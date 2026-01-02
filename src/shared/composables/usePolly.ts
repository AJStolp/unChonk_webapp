/**
 * usePolly - Vue composable for AWS Polly integration
 * Follows Vue 3 Composition API best practices with proper reactivity
 */
import { ref, computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import { useAuthStorage } from './useStorage'
import { SpeechMark } from '../../extension/widget/types/TTSTypes'
import { API_BASE_URL } from '../config/environment'
import { API_TIMEOUTS, RETRY_CONFIG } from '../constants'

interface PollyConfig {
  apiBaseUrl: string
  retryAttempts: number
  timeout: number
}

interface SynthesizeOptions {
  voice_id?: string
  engine?: 'standard' | 'neural'
  include_speech_marks?: boolean
}

interface SynthesizeResult {
  success: boolean
  audioUrl?: string
  speechMarks?: SpeechMark[]
  charactersUsed?: number
  remainingChars?: number
  error?: string
}

interface PollyStatus {
  available: boolean
  authenticated: boolean
  charactersRemaining: number
  responseTime: number
  lastError: string | null
}

const DEFAULT_CONFIG: PollyConfig = {
  apiBaseUrl: API_BASE_URL,
  retryAttempts: RETRY_CONFIG.MAX_ATTEMPTS,
  timeout: API_TIMEOUTS.POLLY_SYNTHESIS
}

/**
 * Main Polly composable
 */
export const usePolly = (config: Partial<PollyConfig> = {}) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  const storage = useAuthStorage()
  const authStore = useAuthStore()
  const { isAuthenticated, user, preferences } = storeToRefs(authStore)
  
  // Reactive state
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const status = ref<PollyStatus>({
    available: false,
    authenticated: false,
    charactersRemaining: 0,
    responseTime: 0,
    lastError: null
  })
  
  // Internal state
  const authToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const abortController = ref<AbortController | null>(null)
  
  /**
   * Enhanced fetch that uses offscreen context in Chrome extensions
   */
  const enhancedFetch = async (url: string, options: RequestInit): Promise<Response> => {
    // For now, just use normal fetch - the offscreen handling was causing issues
    return fetch(url, options);
  }
  
  // Computed
  const isAvailable = computed(() => 
    isInitialized.value && status.value.available && status.value.authenticated
  )
  
  const canSynthesize = computed(() => 
    isAvailable.value && !isLoading.value
  )
  
  /**
   * Initialize Polly integration
   */
  const initialize = async (): Promise<boolean> => {
    if (isInitialized.value) return true
    
    try {
      
      // Get stored tokens
      authToken.value = await storage.getAuthToken()
      refreshToken.value = await storage.getRefreshToken()
      
      // Update status based on both token AND auth store state
      const hasValidToken = !!authToken.value
      const isAuthStoreAuthenticated = isAuthenticated.value
      
      status.value = {
        available: hasValidToken && isAuthStoreAuthenticated,
        authenticated: hasValidToken && isAuthStoreAuthenticated,
        charactersRemaining: (user.value?.charactersLimit || 0) - (user.value?.charactersUsed || 0),
        responseTime: 0,
        lastError: null
      }
      
      isInitialized.value = true
      
      return status.value.available
    } catch (error) {
      console.error('[usePolly] ❌ Initialization failed:', error)
      status.value.lastError = error instanceof Error ? error.message : 'Initialization failed'
      return false
    }
  }
  
  /**
   * Refresh authentication token
   */
  const refreshAuth = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      console.warn('[usePolly] 🔄 No refresh token available')
      return false
    }
    
    try {
      const response = await enhancedFetch(`${fullConfig.apiBaseUrl}/api/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken.value }),
        signal: AbortSignal.timeout(10000)
      })
      
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.access_token) {
        authToken.value = data.access_token
        await storage.setAuthToken(data.access_token)
        
        if (data.refresh_token) {
          refreshToken.value = data.refresh_token
          await storage.setRefreshToken(data.refresh_token)
        }
        
        status.value.authenticated = true
        status.value.lastError = null

        return true
      }
      
      throw new Error('No access token in refresh response')
    } catch (error) {
      console.error('[usePolly] ❌ Token refresh failed:', error)
      status.value.lastError = error instanceof Error ? error.message : 'Token refresh failed'
      status.value.authenticated = false
      
      // Clear invalid tokens
      await storage.clearAllAuth()
      authToken.value = null
      refreshToken.value = null
      
      return false
    }
  }
  
  /**
   * Get request headers with authentication
   */
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    
    return headers
  }
  
  /**
   * Synthesize text with AWS Polly
   */
  const synthesize = async (
    text: string, 
    options: SynthesizeOptions = {}
  ): Promise<SynthesizeResult> => {
    // Ensure initialized
    if (!isInitialized.value) {
      const initialized = await initialize()
      if (!initialized) {
        return {
          success: false,
          error: 'Polly not available - authentication required'
        }
      }
    }
    
    if (!canSynthesize.value) {
      return {
        success: false,
        error: 'Polly not available or busy'
      }
    }
    
    isLoading.value = true
    status.value.lastError = null
    
    // Create abort controller for this request
    abortController.value = new AbortController()
    
    try {
      const startTime = Date.now()
      
      // Use user preferences as defaults
      // Always use 'standard' engine for now (neural commented out for future)
      const synthesizeOptions = {
        voice_id: options.voice_id || preferences.value?.voiceId || 'Joanna',  // Always provide a default voice
        engine: 'standard',  // Always standard for both free (browser) and paid (polly) tiers
        include_speech_marks: options.include_speech_marks ?? true
      }
      
      // Attempt synthesis with retry logic
      for (let attempt = 0; attempt < fullConfig.retryAttempts; attempt++) {
        try {
          // Use background script for synthesis to avoid CORS issues in content script
          const response = await chrome.runtime.sendMessage({
            action: 'synthesize',
            text: text,
            options: {
              text_to_speech: text,
              ...synthesizeOptions
            }
          })
          
          // Handle error response from background script
          if (!response.success) {
            if (response.error?.includes('401') && attempt === 0) {
              console.warn('[usePolly] 🔄 Got 401, attempting token refresh...')
              const refreshed = await refreshAuth()
              if (refreshed) {
                continue // Retry with new token
              } else {
                return {
                  success: false,
                  error: 'Authentication failed - please log in again'
                }
              }
            }
            throw new Error(response.error || 'Synthesis failed')
          }
          
          const result = response.data
          
          // Update status
          status.value.responseTime = Date.now() - startTime
          if (result.remaining_chars !== undefined) {
            status.value.charactersRemaining = result.remaining_chars
          }
          
          // Convert speech marks from milliseconds to seconds
          const convertedSpeechMarks = result.speech_marks?.map((mark: unknown) => {
            const typedMark = mark as { time: number; type: string; value: string; start?: number; end?: number };
            return {
              ...typedMark,
              time: typedMark.time / 1000 // AWS Polly returns milliseconds, we need seconds
            };
          })
          
          return {
            success: true,
            audioUrl: result.audio_url,
            speechMarks: convertedSpeechMarks,
            charactersUsed: result.characters_used,
            remainingChars: result.remaining_chars
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            return {
              success: false,
              error: 'Request cancelled'
            }
          }
          
          // If this was the last attempt, throw the error
          if (attempt === fullConfig.retryAttempts - 1) {
            throw error
          }
          
          console.warn(`[usePolly] ⚠️ Attempt ${attempt + 1} failed, retrying...`, error)
        }
      }
      
      return {
        success: false,
        error: 'All retry attempts failed'
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Synthesis failed'
      console.error('[usePolly] ❌ Synthesis failed:', error)
      
      status.value.lastError = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
      abortController.value = null
    }
  }
  
  /**
   * Cancel ongoing synthesis
   */
  const cancel = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
      isLoading.value = false
    }
  }
  
  /**
   * Test connection to Polly
   */
  const testConnection = async (): Promise<boolean> => {
    try {
      const result = await synthesize('test', {})
      return result.success
    } catch {
      return false
    }
  }
  
  /**
   * Get detailed status for debugging
   */
  const getDebugInfo = () => ({
    isInitialized: isInitialized.value,
    isLoading: isLoading.value,
    isAvailable: isAvailable.value,
    canSynthesize: canSynthesize.value,
    hasAuthToken: !!authToken.value,
    tokenLength: authToken.value?.length || 0,
    status: status.value,
    config: fullConfig
  })
  
  // Watch for auth changes
  watch(isAuthenticated, async (authenticated) => {
    
    if (authenticated && !authToken.value) {

      await initialize()
    } else if (!authenticated) {

      authToken.value = null
      refreshToken.value = null
      status.value.authenticated = false
      status.value.available = false
    } else if (authenticated && authToken.value) {

      // Update status to reflect current auth state
      status.value.authenticated = true
      status.value.available = true
    }
  })
  
  // Auto-initialize if already authenticated
  if (isAuthenticated.value) {
    initialize()
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    cancel()
  })
  
  return {
    // State
    isInitialized,
    isLoading,
    status,
    isAvailable,
    canSynthesize,
    
    // Actions
    initialize,
    synthesize,
    cancel,
    testConnection,
    refreshAuth,
    getDebugInfo
  }
}