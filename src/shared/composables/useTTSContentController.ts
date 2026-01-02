/**
 * useTTSContentController - Vue composable for TTS content control
 * Modern Vue 3 replacement for TTSContentController class
 * Coordinates with Vue components via Pinia stores
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBackendIntegration } from './useBackendIntegration'
import { createLogger, toErrorContext } from '../utils/logger';

const logger = createLogger('useTTSContentController');
export interface TTSControllerConfig {
  apiBaseUrl: string
  enableBackendIntegration: boolean
  fallbackToWebSpeech: boolean
}

export interface TTSState {
  isPlaying: boolean
  isPaused: boolean
  currentText: string
  hasSelection: boolean
  isInitialized: boolean
  backendAvailable: boolean
  enhancedFeaturesEnabled: boolean
}

/**
 * Main TTS content controller composable
 */
export const useTTSContentController = (config: TTSControllerConfig) => {
  // Composables
  const backend = useBackendIntegration({ apiBaseUrl: config.apiBaseUrl })

  // State
  const state = ref<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentText: '',
    hasSelection: false,
    isInitialized: false,
    backendAvailable: false,
    enhancedFeaturesEnabled: false
  })

  // Keyboard shortcut handler
  let keyboardHandler: ((event: KeyboardEvent) => void) | null = null

  /**
   * Initialize the controller
   */
  const initialize = async (): Promise<void> => {
    try {
      // Initialize backend integration if enabled
      if (config.enableBackendIntegration) {
        await backend.initialize()
        state.value.backendAvailable = backend.isAvailable.value
        state.value.enhancedFeaturesEnabled = backend.isAvailable.value
      }

      // Setup keyboard shortcuts
      setupKeyboardShortcuts()

      state.value.isInitialized = true
      logger.debug('[useTTSContentController] ✅ Initialized')
    } catch (error) {
      logger.error('[useTTSContentController] ❌ Failed to initialize:', toErrorContext(error))
      throw error
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  const setupKeyboardShortcuts = () => {
    keyboardHandler = (event: KeyboardEvent) => {
      // Ctrl+Shift+P: Play/Pause TTS
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        sendMessageToVueWidget('toggle-playback')
      }

      // Ctrl+Shift+S: Stop TTS
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault()
        sendMessageToVueWidget('stop-playback')
      }

      // Ctrl+Shift+H: Toggle play here mode
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault()
        sendMessageToVueWidget('toggle-play-here')
      }
    }

    document.addEventListener('keydown', keyboardHandler)
  }

  /**
   * Send message to Vue widget via custom events
   */
  const sendMessageToVueWidget = (action: string, data?: any) => {
    const event = new CustomEvent('tts-controller-message', {
      detail: { action, data }
    })
    window.dispatchEvent(event)
  }

  /**
   * Emit state change event
   */
  const emitStateChange = () => {
    const event = new CustomEvent('tts-state-change', {
      detail: state.value
    })
    window.dispatchEvent(event)
  }

  /**
   * Extract content from current page
   */
  const extractContent = async (): Promise<{
    text: string
    method_used: string
    textract_used: boolean
    tts_optimized: boolean
  }> => {
    try {
      // Basic text extraction
      const text = document.body.innerText || document.body.textContent || ''
      return {
        text: text.trim(),
        method_used: 'basic_dom',
        textract_used: false,
        tts_optimized: false
      }
    } catch (error) {
      logger.error('[useTTSContentController] ❌ Content extraction failed:', toErrorContext(error))
      throw error
    }
  }

  /**
   * Synthesize text using TTS
   */
  const synthesizeText = async (text: string): Promise<void> => {
    try {
      state.value.currentText = text
      state.value.isPlaying = true
      emitStateChange()

      // Send text to Vue widget for TTS processing
      sendMessageToVueWidget('play-text', { text })
    } catch (error) {
      logger.error('[useTTSContentController] ❌ Text synthesis failed:', toErrorContext(error))
      state.value.isPlaying = false
      emitStateChange()
      throw error
    }
  }

  /**
   * Stop TTS playback
   */
  const stop = () => {
    state.value.isPlaying = false
    state.value.isPaused = false
    emitStateChange()
    sendMessageToVueWidget('stop-playback')
  }

  /**
   * Pause TTS playback
   */
  const pause = () => {
    state.value.isPaused = true
    state.value.isPlaying = false
    emitStateChange()
    sendMessageToVueWidget('pause-playback')
  }

  /**
   * Resume TTS playback
   */
  const resume = () => {
    state.value.isPlaying = true
    state.value.isPaused = false
    emitStateChange()
    sendMessageToVueWidget('resume-playback')
  }

  /**
   * Cleanup resources
   */
  const cleanup = () => {
    if (keyboardHandler) {
      document.removeEventListener('keydown', keyboardHandler)
      keyboardHandler = null
    }
    sendMessageToVueWidget('cleanup')
  }

  // Watch backend status for reactive updates
  watch(
    () => backend.status.value,
    (status) => {
      state.value.backendAvailable = status.available
      state.value.enhancedFeaturesEnabled = status.authenticated
      emitStateChange()
    }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    state: computed(() => state.value),
    isInitialized: computed(() => state.value.isInitialized),
    isPlaying: computed(() => state.value.isPlaying),
    isPaused: computed(() => state.value.isPaused),
    hasSelection: computed(() => state.value.hasSelection),
    currentText: computed(() => state.value.currentText),
    backendAvailable: computed(() => state.value.backendAvailable),
    enhancedFeaturesEnabled: computed(() => state.value.enhancedFeaturesEnabled),

    // Actions
    initialize,
    extractContent,
    synthesizeText,
    stop,
    pause,
    resume,
    cleanup
  }
}
