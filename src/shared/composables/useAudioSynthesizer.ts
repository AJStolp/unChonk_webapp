import { ref, computed, onUnmounted } from 'vue'
import { SpeechMark } from '../../extension/widget/types/TTSTypes'
import { useAuthStore } from '../stores/authStore'
import { SpeechMarkProcessor } from '../../extension/widget/highlighting/utils/SpeechMarkProcessor'
import { globalContentFilter } from '../../extension/widget/highlighting/core/ContentFilters'
import { usePolly } from './usePolly'
import { useAuthStorage } from './useStorage'

interface SynthesisResult {
  audioUrl: string
  speechMarks: SpeechMark[]
  estimatedDurationSeconds: number
  highlightingMap?: any
}

interface UserPreferences {
  voiceId: string
  engine: string
}

/**
 * useAudioSynthesizer - Vue composable for audio synthesis
 * Follows Vue 3 Composition API best practices
 */
export const useAudioSynthesizer = () => {
  // Composables (only called at top level)
  const authStore = useAuthStore()
  const polly = usePolly()
  const storage = useAuthStorage()
  
  // Reactive state
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const userPreferences = ref<UserPreferences>({
    voiceId: 'Joanna',
    engine: 'browser'  // Default to browser, will be loaded from user preferences
  })
  
  // Services
  const speechMarkProcessor = new SpeechMarkProcessor()
  
  // Computed
  const canSynthesize = computed(() => 
    isInitialized.value && polly.canSynthesize.value
  )
  
  /**
   * Initialize the audio synthesizer
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return
    
    try {
    
      // Load user preferences
      await loadUserPreferences()
    
      isInitialized.value = true
    } catch (error) {
      throw error
    }
  }
  
  /**
   * Load user preferences from storage
   */
  const loadUserPreferences = async (): Promise<void> => {
    try {
      const preferences = await storage.getUserPreferences() as { voiceId?: string; engine?: string } | null

      if (preferences) {
        userPreferences.value = {
          voiceId: preferences.voiceId || 'Joey',
          engine: preferences.engine || 'browser'  // Default to browser
        }

      } else {
        // Determine default engine based on user tier
        const defaultEngine = authStore.user?.tier === 'free' ? 'browser' : 'polly'
        userPreferences.value = {
          voiceId: 'Joey',
          engine: defaultEngine
        }

      }
    } catch (error: unknown) {
      // Error loading preferences - will use defaults
    }
  }
  
  /**
   * Synthesize text with AWS Polly
   */
  const synthesizeWithPolly = async (text: string): Promise<SynthesisResult | null> => {
    try {
     
      
      // Ensure initialized
      if (!isInitialized.value) {
        await initialize()
      }
      
      // Initialize Polly if not already done
      if (!polly.isInitialized.value) {
      
        const initialized = await polly.initialize()
        if (!initialized) {
          console.warn('[useAudioSynthesizer] ❌ Polly initialization failed')
          return null
        }
      }
      
      // Check if Polly is available after initialization
      if (!polly.canSynthesize.value) {
        console.warn('[useAudioSynthesizer] ⚠️ Polly not available for synthesis after initialization')
       
        return null
      }
      
      // Set loading state
      isLoading.value = true
      
      // Apply content filtering to remove unwanted elements
      const filteredText = globalContentFilter.optimizeTextForTts(text)
      
      // Use Polly composable for synthesis
      const synthesisResult = await polly.synthesize(filteredText, {
        voice_id: userPreferences.value.voiceId,
        engine: userPreferences.value.engine as 'standard' | 'neural',
        include_speech_marks: true
      })
      
      if (!synthesisResult.success || !synthesisResult.audioUrl) {
        console.warn('[useAudioSynthesizer] ⚠️ Synthesis failed:', synthesisResult.error)
        return null
      }
      
      // Process speech marks
      let speechMarksData: SpeechMark[] = []
      let estimatedDuration = 0
      
      if (synthesisResult.speechMarks && synthesisResult.speechMarks.length > 0) {
        // Use SpeechMarkProcessor for proper conversion
        const processedData = speechMarkProcessor.extractSpeechMarks({
          speech_marks: synthesisResult.speechMarks
        })
        speechMarksData = processedData.speechMarks
        estimatedDuration = processedData.estimatedDurationSeconds
      } else {
        // Estimate duration from word count
        estimatedDuration = (text.split(/\s+/).length * 60) / 160 // 160 WPM average
      }
      
      const result: SynthesisResult = {
        audioUrl: synthesisResult.audioUrl,
        speechMarks: speechMarksData,
        estimatedDurationSeconds: estimatedDuration
      }
      
      return result
    } catch (error) {
      console.error('[useAudioSynthesizer] ❌ Synthesis failed:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Update user preferences
   */
  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<void> => {
    userPreferences.value = { ...userPreferences.value, ...newPreferences }
    
    try {
      // Save to storage if authenticated
      if (authStore.isAuthenticated) {
        await authStore.updatePreferences({
          voiceId: userPreferences.value.voiceId,
          engine: userPreferences.value.engine as 'neural' | 'standard'
        })
      }
      

    } catch (error) {
      console.error('[useAudioSynthesizer] ❌ Failed to update preferences:', error)
    }
  }
  
  /**
   * Cleanup function
   */
  const cleanup = (): void => {
    isInitialized.value = false
    isLoading.value = false
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
    isLoading,
    userPreferences,
    canSynthesize,
    
    // Actions
    initialize,
    synthesizeWithPolly,
    updatePreferences,
    cleanup
  }
}