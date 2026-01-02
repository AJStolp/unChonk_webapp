import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { ENTERPRISE_CONFIG } from '../../extension/widget/constants/config'
import { TTSEmbedError } from '../../extension/widget/types/TTSTypes'
import { RETRY_CONFIG } from '../constants'

/**
 * useApiClient - Vue composable for secure API calls
 * Follows Vue 3 Composition API best practices
 */
export const useApiClient = () => {
  // Composables
  const authStore = useAuthStore()
  
  // Computed
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const authToken = computed(() => authStore.authToken)
  
  /**
   * Make a secure API call with authentication and retry logic
   */
  const secureApiCall = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...ENTERPRISE_CONFIG.SECURITY_HEADERS,
      ...((options.headers as Record<string, string>) || {})
    }
    
    // Add auth header if authenticated
    if (isAuthenticated.value && authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }
    
    const requestConfig: RequestInit = {
      ...options,
      headers,
      credentials: 'same-origin'
    }
    
    for (let attempt = 0; attempt <= ENTERPRISE_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await Promise.race([
          fetch(`${ENTERPRISE_CONFIG.API_BASE_URL}${endpoint}`, requestConfig),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error('Request timeout')),
              ENTERPRISE_CONFIG.REQUEST_TIMEOUT
            )
          )
        ])
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          if (response.status === 401) {
            // Clear invalid token and trigger logout
            await authStore.logout()
            throw new TTSEmbedError(
              'AUTH_EXPIRED',
              'Session expired. Using free tier.'
            )
          } else if (response.status === 429) {
            if (attempt < ENTERPRISE_CONFIG.MAX_RETRIES) {
              await new Promise((resolve) =>
                setTimeout(
                  resolve,
                  ENTERPRISE_CONFIG.RATE_LIMIT_DELAY * Math.pow(RETRY_CONFIG.EXPONENTIAL_BASE, attempt)
                )
              )
              continue
            }
            throw new TTSEmbedError(
              'RATE_LIMITED',
              'Rate limit exceeded. Please try again later.'
            )
          }
          
          throw new TTSEmbedError(
            `API_ERROR_${response.status}`,
            errorData.detail || `Request failed: ${response.status}`
          )
        }
        
        return await response.json()
      } catch (err: unknown) {
        if (attempt === ENTERPRISE_CONFIG.MAX_RETRIES) {
          throw err instanceof TTSEmbedError
            ? err
            : new TTSEmbedError(
                'NETWORK_ERROR',
                (err as Error).message || 'Network request failed'
              )
        }
        
        // Exponential backoff for retries
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.EXPONENTIAL_BASE, attempt))
        )
      }
    }
  }
  
  /**
   * Make a GET request
   */
  const get = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return secureApiCall(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Make a POST request
   */
  const post = async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> => {
    return secureApiCall(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * Make a PUT request
   */
  const put = async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> => {
    return secureApiCall(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }
  
  /**
   * Make a DELETE request
   */
  const del = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    return secureApiCall(endpoint, { ...options, method: 'DELETE' })
  }
  
  return {
    // State
    isAuthenticated,
    authToken,
    
    // Methods
    secureApiCall,
    get,
    post,
    put,
    delete: del
  }
}