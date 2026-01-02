/**
 * useBackendIntegration - Vue composable for backend integration
 * Wraps usePolly and adds content extraction capabilities
 * Modern Vue 3 replacement for BackendIntegrationManager class
 */
import { ref, computed, watch } from 'vue'
import { usePolly } from './usePolly'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'

export interface BackendConfig {
  apiBaseUrl: string
  retryAttempts?: number
  timeout?: number
}

export interface ContentExtraction {
  text: string | null
  url: string
  timestamp: Date
  method: 'backend' | 'dom'
  success: boolean
  error?: string
}

export interface BackendStatus {
  available: boolean
  authenticated: boolean
  charactersRemaining: number
  responseTime: number
  lastError: string | null
}

import { API_BASE_URL } from '../config/environment'
import { createLogger, toErrorContext } from '../utils/logger';
import { API_TIMEOUTS, RETRY_CONFIG } from '../constants';

const logger = createLogger('useBackendIntegration');
const DEFAULT_CONFIG: BackendConfig = {
  apiBaseUrl: API_BASE_URL,
  retryAttempts: RETRY_CONFIG.MAX_ATTEMPTS,
  timeout: API_TIMEOUTS.BACKEND_EXTRACTION
}

/**
 * Main backend integration composable
 */
export const useBackendIntegration = (config: Partial<BackendConfig> = {}) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }

  // Composables
  const polly = usePolly({ apiBaseUrl: fullConfig.apiBaseUrl })
  const authStore = useAuthStore()
  const { isAuthenticated, user } = storeToRefs(authStore)

  // State
  const isExtractingContent = ref(false)
  const lastExtraction = ref<ContentExtraction | null>(null)

  // Computed
  const status = computed<BackendStatus>(() => ({
    available: polly.isAvailable.value,
    authenticated: isAuthenticated.value,
    charactersRemaining: (user.value?.charactersLimit || 0) - (user.value?.charactersUsed || 0),
    responseTime: polly.status.value.responseTime,
    lastError: polly.status.value.lastError
  }))

  const isAvailable = computed(() => polly.isAvailable.value)
  const canSynthesize = computed(() => polly.canSynthesize.value)

  /**
   * Extract content from URL using backend API
   */
  const extractContent = async (url: string): Promise<string | null> => {
    try {
      isExtractingContent.value = true

      // Use background script for CORS-safe extraction
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        const response = await chrome.runtime.sendMessage({
          action: 'extractContent',
          url: url
        })

        if (response.success && response.text) {
          lastExtraction.value = {
            text: response.text,
            url,
            timestamp: new Date(),
            method: 'backend',
            success: true
          }

          logger.debug('[useBackendIntegration] ✅ Content extracted:', {
            url,
            textLength: response.text.length
          })

          return response.text
        } else {
          throw new Error(response.error || 'Content extraction failed')
        }
      }

      // Fallback: Direct API call (may have CORS issues in content script)
      const response = await fetch(`${fullConfig.apiBaseUrl}/api/extract/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authStore.authToken ? { 'Authorization': `Bearer ${authStore.authToken}` } : {})
        },
        body: JSON.stringify({
          url,
          prefer_textract: true,
          include_metadata: true
        }),
        signal: AbortSignal.timeout(fullConfig.timeout!)
      })

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.status}`)
      }

      const result = await response.json()
      const extractedText = result.text || null

      lastExtraction.value = {
        text: extractedText,
        url,
        timestamp: new Date(),
        method: 'backend',
        success: !!extractedText
      }

      return extractedText
    } catch (error) {
      logger.error('[useBackendIntegration] ❌ Content extraction failed:', toErrorContext(error))

      lastExtraction.value = {
        text: null,
        url,
        timestamp: new Date(),
        method: 'backend',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      return null
    } finally {
      isExtractingContent.value = false
    }
  }

  /**
   * Get debug information
   */
  const getDebugInfo = () => ({
    ...polly.getDebugInfo(),
    backend: {
      isExtractingContent: isExtractingContent.value,
      lastExtraction: lastExtraction.value,
      status: status.value
    }
  })

  // Watch auth changes and reinitialize Polly if needed
  watch(isAuthenticated, async (authenticated) => {
    if (authenticated && !polly.isInitialized.value) {
      await polly.initialize()
    }
  })

  return {
    // State
    isInitialized: polly.isInitialized,
    isLoading: polly.isLoading,
    isExtractingContent,
    lastExtraction,
    status,
    isAvailable,
    canSynthesize,

    // Actions - Synthesis (from Polly)
    initialize: polly.initialize,
    synthesize: polly.synthesize,
    cancel: polly.cancel,

    // Actions - Content Extraction (unique to this composable)
    extractContent,

    // Actions - Auth (delegated to store)
    login: authStore.login,
    logout: authStore.logout,

    // Utils
    getDebugInfo
  }
}
