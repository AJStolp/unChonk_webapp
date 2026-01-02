import { ref, computed, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { TTSEmbedError } from '../../extension/widget/types/TTSTypes'
import { BackendContentManager } from '../managers/BackendContentManager'
import { globalContentFilter } from '../../extension/widget/highlighting/core/ContentFilters'
import { API_BASE_URL } from '../config/environment'

export interface TextNodeOffset {
  node: Text
  textOffset: number
  highlightOffset: number
  length: number
}

export interface ExtractionResult {
  text: string
  highlightingMap?: any
  mapping?: TextNodeOffset[]
}

export interface AutoReadingResult {
  success: boolean
  filteredText: string
  readingTime: string
  stats: {
    originalBlocks: number
    recommendedBlocks: number
    filteredCharacters: number
    confidenceScore: number
  }
  duration: {
    words: number
    estimatedSeconds: number
    actualSeconds?: number
    isEstimate: boolean
    formattedEstimate: string
    formattedActual?: string
  }
}

/**
 * useContentExtractor - Vue composable for content extraction
 * Follows Vue 3 Composition API best practices
 */
export const useContentExtractor = () => {
  // Composables
  const authStore = useAuthStore()
  
  // State
  const isInitialized = ref(false)
  const isExtracting = ref(false)

  // Services
  const backendContentManager = new BackendContentManager(API_BASE_URL)
  
  // Computed
  const userTier = computed(() => authStore.user?.tier || 'free')
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  /**
   * Initialize the content extractor
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return
    
    try {
      
      // Set user tier for content manager
      await initializeUserTier()
      
      isInitialized.value = true

    } catch (error) {
      console.warn('[useContentExtractor] ⚠️ Failed to initialize user tier:', error)
      // Continue with default tier
      backendContentManager.setUserTier('free')
      isInitialized.value = true
    }
  }
  
  /**
   * Initialize user tier
   */
  const initializeUserTier = async (): Promise<void> => {
    try {
      const tier = userTier.value
      backendContentManager.setUserTier(tier)
    } catch (error) {
      backendContentManager.setUserTier('free')
    }
  }
  
  /**
   * Extract page content
   */
  const extractPageContent = async (): Promise<ExtractionResult> => {
    try {
      isExtracting.value = true
      
      // Use globalContentFilter directly for consistency
      const text = globalContentFilter.extractSemanticContent(document.body)
      
      if (!text || text.length === 0) {
        throw new TTSEmbedError(
          'EXTRACTION_FAILED',
          'No content found on page'
        )
      }
      
      return {
        text: text,
        mapping: [] // CSS Custom Highlight API handles mapping internally
      }
    } catch (error) {
      console.error('[useContentExtractor] ❌ Extraction error:', error)
      throw new TTSEmbedError(
        'EXTRACTION_FAILED',
        'Content extraction failed',
        error
      )
    } finally {
      isExtracting.value = false
    }
  }
  
  /**
   * Extract text from selection or page
   */
  const extractText = async (selectionRange?: Range): Promise<string> => {
    try {
      if (selectionRange) {
        return selectionRange.toString().trim()
      } else {
        // Use DOM extraction directly
        return backendContentManager.extractFromCurrentPage().text
      }
    } catch (error) {
      console.error('[useContentExtractor] ❌ Text extraction failed:', error)
      throw new TTSEmbedError(
        'EXTRACTION_FAILED',
        'Text extraction failed',
        error
      )
    }
  }
  
  /**
   * Get extraction status
   */
  const getExtractionStatus = async (): Promise<any> => {
    try {
      return await backendContentManager.getExtractionStatus()
    } catch (error) {
      console.error('[useContentExtractor] Failed to get extraction status:', error)
      return {
        backend_connected: false,
        user_tier: userTier.value,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
  
  /**
   * Test extraction
   */
  const testExtraction = async (url?: string): Promise<any> => {
    try {
      return await backendContentManager.testExtraction(url)
    } catch (error) {
      console.error('[useContentExtractor] Test extraction failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        test_url: url || window.location.href
      }
    }
  }
  
  /**
   * Get configuration
   */
  const getConfig = (): any => {
    return {
      userTier: userTier.value,
      isAuthenticated: isAuthenticated.value,
      backendConfig: backendContentManager.getConfig()
    }
  }
  
  /**
   * Update user tier
   */
  const updateUserTier = async (): Promise<void> => {
    const tier = userTier.value
    backendContentManager.setUserTier(tier)
  }
  
  /**
   * Extract content for auto-reading with ML filtering
   */
  const extractForAutoReading = async (url?: string): Promise<AutoReadingResult> => {
    try {
      isExtracting.value = true
      
      // Use ML-powered extraction
      const mlResult = await backendContentManager.extractWithMLFiltering(url)
      
      if (!mlResult.success || !mlResult.filteredText) {
        throw new Error('ML extraction failed or returned no content')
      }
      
      // Calculate reading time
      const readingTimeInfo = backendContentManager.calculateReadingTime(mlResult.filteredText)
      
      return {
        success: true,
        filteredText: mlResult.filteredText,
        readingTime: readingTimeInfo.formattedTime,
        stats: {
          originalBlocks: mlResult.filteringStats.totalBlocks,
          recommendedBlocks: mlResult.filteringStats.recommendedBlocks,
          filteredCharacters: mlResult.filteringStats.filteredCharacters,
          confidenceScore: mlResult.filteringStats.confidenceScore
        },
        duration: {
          words: readingTimeInfo.words,
          estimatedSeconds: readingTimeInfo.estimatedMinutes * 60 + readingTimeInfo.estimatedSeconds,
          actualSeconds: undefined,
          isEstimate: true,
          formattedEstimate: readingTimeInfo.formattedTime,
          formattedActual: undefined
        }
      }
    } catch (error) {
      console.error('[useContentExtractor] ❌ Auto-reading extraction failed:', error)
      
      // Fallback to DOM extraction
      try {
        console.warn('[useContentExtractor] ⚠️ ML extraction failed, attempting DOM fallback')
        
        const fallbackResult = await backendContentManager.extractWithFallback()
        
        if (!fallbackResult.success || !fallbackResult.text || fallbackResult.text.length === 0) {
          throw new Error('DOM fallback extraction returned no content')
        }
        
        const fallbackText = fallbackResult.text
        const readingTimeInfo = backendContentManager.calculateReadingTime(fallbackText)
        
        console.warn('[useContentExtractor] ✅ DOM fallback extraction succeeded')
        
        return {
          success: true,
          filteredText: fallbackText,
          readingTime: readingTimeInfo.formattedTime,
          stats: {
            originalBlocks: 1,
            recommendedBlocks: 1,
            filteredCharacters: fallbackText.length,
            confidenceScore: 0.5
          },
          duration: {
            words: readingTimeInfo.words,
            estimatedSeconds: readingTimeInfo.estimatedMinutes * 60 + readingTimeInfo.estimatedSeconds,
            actualSeconds: undefined,
            isEstimate: true,
            formattedEstimate: readingTimeInfo.formattedTime,
            formattedActual: undefined
          }
        }
      } catch (fallbackError) {
        console.error('[useContentExtractor] ❌ Both ML and DOM fallback extraction failed:', fallbackError)
        return {
          success: false,
          filteredText: '',
          readingTime: '0s',
          stats: {
            originalBlocks: 0,
            recommendedBlocks: 0,
            filteredCharacters: 0,
            confidenceScore: 0
          },
          duration: {
            words: 0,
            estimatedSeconds: 0,
            actualSeconds: undefined,
            isEstimate: true,
            formattedEstimate: '0s',
            formattedActual: undefined
          }
        }
      }
    } finally {
      isExtracting.value = false
    }
  }
  
  /**
   * Update actual duration after TTS synthesis
   */
  const updateActualDuration = (actualSeconds: number): {
    formattedActual: string
    actualSeconds: number
    durationDifference: number
  } => {
    const minutes = Math.floor(actualSeconds / 60)
    const seconds = Math.round(actualSeconds % 60)
    const formattedActual = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
    
    return {
      formattedActual,
      actualSeconds,
      durationDifference: 0 // Will be calculated by caller
    }
  }
  
  /**
   * Get DOM elements marked as main content
   */
  const getMainContentElements = (): HTMLElement[] => {
    return backendContentManager.getMarkedMainContent()
  }
  
  /**
   * Clear main content markers
   */
  const clearMainContentMarkers = (): void => {
    backendContentManager.clearMainContentMarkers()
  }
  
  /**
   * Cleanup function
   */
  const cleanup = (): void => {
    backendContentManager.cleanup()
    isInitialized.value = false
    isExtracting.value = false
  }
  
  // Auto-cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })
  
  // Auto-initialize
  initialize().catch(console.error)
  
  return {
    // State
    isInitialized,
    isExtracting,
    userTier,
    isAuthenticated,
    
    // Actions
    initialize,
    extractPageContent,
    extractText,
    getExtractionStatus,
    testExtraction,
    getConfig,
    updateUserTier,
    extractForAutoReading,
    updateActualDuration,
    getMainContentElements,
    clearMainContentMarkers,
    cleanup
  }
}