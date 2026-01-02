/**
 * TTS State Store - The Heart of Audio Playback
 * Manages all TTS playback state across all extension contexts
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { syncStateAcrossContexts } from '.'
import { useHighlightingStore } from './highlightingStore'
import { useAudioSynthesizer } from '../composables/useAudioSynthesizer'

export interface TTSSettings {
  voice: string
  rate: number
  volume: number
  autoPlay: boolean
  engine: 'browser' | 'polly'  // browser = free tier, polly = premium/pro (Natural Voices)
}

export interface TTSProgress {
  currentTime: number
  totalTime: number
  percentage: number
}

export interface PlaybackState {
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  currentText: string
  currentAudio: HTMLAudioElement | null
}

export const useTTSStore = defineStore('tts', () => {
  // ===== CORE PLAYBACK STATE =====
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const isLoading = ref(false)
  const currentText = ref('')
  const currentAudio = ref<HTMLAudioElement | null>(null)
  const currentContainer = ref<HTMLElement | null>(null)
  const usingOffscreenAudio = ref(false) // Track if using offscreen audio
  const usingWebSpeech = ref(false) // Track if using Web Speech API
  const pausedTime = ref(0) // Track time when paused for accurate resume
  
  // ===== PROGRESS TRACKING =====
  const progress = ref<TTSProgress>({
    currentTime: 0,
    totalTime: 0,
    percentage: 0
  })
  
  // ===== USER SETTINGS =====
  const settings = ref<TTSSettings>({
    voice: 'Joanna',
    rate: 1.0,
    volume: 1.0,
    autoPlay: false,
    engine: 'browser'  // Default to browser, will be updated based on user tier
  })
  
  // ===== PLAY HERE MODE =====
  const playHereMode = ref(false)
  const playHereButtons = ref<Map<Element, HTMLButtonElement>>(new Map())
  const playHereManager = ref<any>(null)
  
  // ===== UI STATE =====
  const currentPlayingElement = ref<HTMLElement | null>(null)
  const widgetVisible = ref(true)
  const timerDisplay = ref('00:00')
  
  // ===== PROGRESS TRACKING =====
  let progressInterval: number | null = null
  
  // ===== ERROR STATE =====
  const error = ref<string | null>(null)
  
  // ===== COMPUTED STATES =====
  const canPlay = computed(() => !isLoading.value && currentText.value.length > 0 && !error.value)
  
  const hasError = computed(() => !!error.value)
  
  const displayTime = computed(() => {
    const current = progress.value.currentTime
    const minutes = Math.floor(current / 60)
    const seconds = Math.floor(current % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  const playbackState = computed((): PlaybackState => ({
    isPlaying: isPlaying.value,
    isPaused: isPaused.value,
    isLoading: isLoading.value,
    currentText: currentText.value,
    currentAudio: currentAudio.value
  }))
  
  // ===== ACTIONS =====
  
  // Clear errors
  const clearError = () => {
    error.value = null
  }
  
  // Set error with auto-clear timeout
  const setError = (message: string, timeout = 5000) => {
    error.value = message
    console.error('[TTS Store] ❌', message)
    
    if (timeout > 0) {
      setTimeout(() => {
        if (error.value === message) {
          error.value = null
        }
      }, timeout)
    }
  }

  // Play text with highlighting support
  const play = async (text?: string, container?: HTMLElement, element?: HTMLElement, selectionRange?: Range) => {
    // Clear any previous errors
    clearError()
    
    if (text) currentText.value = text
    if (container) currentContainer.value = container
    if (element) currentPlayingElement.value = element
    
    if (!currentText.value) {
      setError('No text to play')
      return false
    }
    
    try {
      isLoading.value = true
      
      // Use the audio synthesizer composable
      const audioSynthesizer = useAudioSynthesizer()
      
      // Try AWS Polly first
      const synthesisResult = await audioSynthesizer.synthesizeWithPolly(currentText.value)
      
      if (synthesisResult) {
        // AWS Polly success - use offscreen API for audio playback

        // Set up Paint API highlighting for AWS Polly
        if (currentContainer.value) {
          const highlightingStore = useHighlightingStore()

          // Initialize Paint API highlighting first
          await highlightingStore.initializeHighlighting(currentContainer.value, currentText.value, selectionRange)

          // Set speech marks for highlighting
          if (synthesisResult.speechMarks && synthesisResult.speechMarks.length > 0) {
            highlightingStore.setSpeechMarks(synthesisResult.speechMarks)
          }

          // Start highlighting system for visual rendering
          highlightingStore.startHighlighting()
        }

        // Use offscreen document to play audio (bypasses Chrome extension audio restrictions)
        try {
          // Check if chrome runtime is available - relaxed check for content script context
          try {
            if (typeof chrome === 'undefined' || !chrome?.runtime?.sendMessage) {
              console.warn('[TTS Store] Chrome runtime not available for offscreen API, falling back to Web Speech')
              throw new Error('Chrome runtime not available')
            }
          } catch (runtimeError) {
            console.warn('[TTS Store] Chrome runtime check failed:', runtimeError)
            throw new Error('Chrome runtime not available')
          }

          const response = await chrome.runtime.sendMessage({
            action: 'playOffscreenAudio',
            target: 'offscreen',
            url: synthesisResult.audioUrl
          })

          if (response.success) {
            // Set flag to track that we're using offscreen audio
            usingOffscreenAudio.value = true
            usingWebSpeech.value = false

            console.log('[TTS Store] 🎵 Offscreen audio started. Duration:', synthesisResult.estimatedDurationSeconds)

            // Create a mock audio element for progress tracking
            const mockAudio = {
              currentTime: 0,
              duration: synthesisResult.estimatedDurationSeconds || 0,
              volume: settings.value.volume,
              playbackRate: settings.value.rate,
              paused: false,
              addEventListener: () => {},
              removeEventListener: () => {},
              play: () => Promise.resolve(),
              pause: () => {},
            }

            setCurrentAudio(mockAudio as unknown as HTMLAudioElement)

            // Start progress tracking
            if (synthesisResult.estimatedDurationSeconds) {
              startProgressTracking(synthesisResult.estimatedDurationSeconds)
            } else {
              console.warn('[TTS Store] ⚠️ No duration provided for offscreen audio!')
            }

            isPlaying.value = true
            isPaused.value = false
            console.log('[TTS Store] ✅ Set isPlaying = true, isPaused = false')
          } else {
            throw new Error('Offscreen audio playback failed: ' + response.error)
          }
        } catch (offscreenError) {
          console.warn('[TTS Store] ⚠️ Offscreen audio failed, falling back to Web Speech:', offscreenError)
          setError('AWS Polly unavailable, using Web Speech API', 3000)
          throw offscreenError // Fall through to Web Speech
        }
      } else {
        // Fallback to Web Speech API
        // Set flag to track that we're using Web Speech
        usingWebSpeech.value = true
        usingOffscreenAudio.value = false

        const utterance = new SpeechSynthesisUtterance(currentText.value)
        utterance.rate = settings.value.rate
        utterance.volume = settings.value.volume
        utterance.voice = speechSynthesis.getVoices().find(voice =>
          voice.name.includes(settings.value.voice) || voice.name.includes('Joanna')
        ) || speechSynthesis.getVoices()[0]

        // Estimate duration for progress tracking (Web Speech doesn't provide duration)
        const estimatedDuration = (currentText.value.split(/\s+/).length / 160) * 60 // 160 WPM average

        utterance.onstart = () => {
          isPlaying.value = true
          isPaused.value = false
          // Start progress tracking for Web Speech highlighting
          startProgressTracking(estimatedDuration)
        }

        utterance.onend = () => {
          isPlaying.value = false
          isPaused.value = false
          // Stop progress tracking
          if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
          }
        }

        utterance.onerror = (event) => {
          console.error('[TTS Store] ❌ Web Speech utterance.onerror fired:', event)
          isPlaying.value = false
          isPaused.value = false
          // Stop progress tracking on error
          if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
          }
        }

        // Set up Web Speech highlighting using Paint API for visual consistency
        if (currentContainer.value) {
          const highlightingStore = useHighlightingStore()

          // Initialize Paint API highlighting
          await highlightingStore.initializeHighlighting(currentContainer.value, currentText.value, selectionRange)

          // Set up Web Speech to Paint API adapter
          const { WebSpeechToPaintAPIAdapter } = await import('../../extension/widget/highlighting/adapters/WebSpeechToPaintAPIAdapter')
          const webSpeechAdapter = new WebSpeechToPaintAPIAdapter()

          // Track if this is the first speech mark update
          let isFirstUpdate = true

          // Initialize adapter with callback to update Paint API
          webSpeechAdapter.initialize(currentText.value, (speechMarks) => {
            // For the first update, do full setup. For subsequent updates, skip setup to avoid resetting state
            highlightingStore.setSpeechMarks(speechMarks, !isFirstUpdate)
            isFirstUpdate = false
          })

          // Setup utterance with Paint API integration
          webSpeechAdapter.setupUtterance(utterance)

          // Start highlighting system for visual rendering
          highlightingStore.startHighlighting()
        }

        speechSynthesis.speak(utterance)
      }
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to play audio'
      setError(errorMessage)
      isLoading.value = false
      isPaused.value = false
      isPlaying.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const pause = async () => {
    try {
      // Save current time FIRST before any async operations
      pausedTime.value = progress.value.currentTime
      console.log('[TTS Store] ⏸️ Pausing at', pausedTime.value)

      // Pause offscreen audio (AWS Polly)
      if (usingOffscreenAudio.value) {
        const response = await chrome.runtime.sendMessage({
          action: 'pauseOffscreenAudio',
          target: 'offscreen'
        })

        if (!response?.success) {
          console.error('[TTS Store] ❌ Failed to pause offscreen audio:', response?.error)
        }
      }
      // Pause Web Speech API
      else if (usingWebSpeech.value && speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause()
      }
      // Pause regular audio element
      else if (currentAudio.value && !currentAudio.value.paused) {
        currentAudio.value.pause()
      }

      // Pause progress tracking
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }

      // Set state immediately
      isPlaying.value = false
      isPaused.value = true

      // DON'T clear highlighting - keep it visible at paused position
      console.log('[TTS Store] ✅ Paused. isPaused =', isPaused.value)
    } catch (error) {
      console.error('[TTS Store] ❌ Pause failed:', error)
      // Make sure state is set even on error
      isPlaying.value = false
      isPaused.value = true
    }
  }

  const resume = async () => {
    try {
      console.log('[TTS Store] ▶️ Resuming from', pausedTime.value, 'isPaused =', isPaused.value)

      // Set state immediately
      isPlaying.value = true
      isPaused.value = false

      // Sync highlighting to current paused position
      const highlightingStore = useHighlightingStore()
      if (pausedTime.value > 0) {
        highlightingStore.updateHighlighting(pausedTime.value)
        console.log('[TTS Store] 🎨 Synced highlighting to', pausedTime.value)
      }

      // Resume offscreen audio (AWS Polly)
      if (usingOffscreenAudio.value) {
        const response = await chrome.runtime.sendMessage({
          action: 'resumeOffscreenAudio',
          target: 'offscreen'
        })

        if (response?.success) {
          console.log('[TTS Store] ✅ Offscreen audio resumed')

          // Restart progress tracking from paused time
          if (progress.value.totalTime > 0) {
            startProgressTracking(progress.value.totalTime, pausedTime.value)
          }
        } else {
          console.error('[TTS Store] ❌ Failed to resume offscreen audio:', response?.error)
          // Reset state on failure
          isPlaying.value = false
          isPaused.value = true
          return
        }
      }
      // Resume Web Speech API
      else if (usingWebSpeech.value) {
        if (speechSynthesis.paused) {
          speechSynthesis.resume()
          console.log('[TTS Store] ✅ Web Speech resumed')

          // Restart progress tracking from paused time
          if (progress.value.totalTime > 0) {
            startProgressTracking(progress.value.totalTime, pausedTime.value)
          }
        } else {
          console.warn('[TTS Store] ⚠️ Web Speech not paused, cannot resume')
        }
      }
      // Resume regular audio element
      else if (currentAudio.value) {
        if (currentAudio.value.paused) {
          await currentAudio.value.play()
          console.log('[TTS Store] ✅ Regular audio resumed')
        }
      }

      console.log('[TTS Store] ✅ Resumed. isPlaying =', isPlaying.value)
    } catch (error) {
      console.error('[TTS Store] ❌ Resume failed:', error)
      // Reset state on error
      isPlaying.value = false
      isPaused.value = true
    }
  }
  
  const stop = async () => {
    // Stop offscreen audio if using it
    if (usingOffscreenAudio.value) {
      try {
        await chrome.runtime.sendMessage({
          action: 'stopOffscreenAudio',
          target: 'offscreen'
        })
      } catch (error) {
        console.error('[TTS Store] ❌ Failed to stop offscreen audio:', error)
      }
    }

    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
    }

    // Stop Web Speech if it's being used
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }

    // Clear progress tracking
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    // Reset flags
    usingOffscreenAudio.value = false
    usingWebSpeech.value = false
    pausedTime.value = 0

    isPlaying.value = false
    isPaused.value = false
    progress.value = { currentTime: 0, totalTime: 0, percentage: 0 }
    currentPlayingElement.value = null
    timerDisplay.value = '00:00'

    // Clear highlighting
    const highlightingStore = useHighlightingStore()
    highlightingStore.stopHighlighting()
  }
  
  const togglePlayPause = () => {
    if (isPlaying.value) {
      pause()
    } else if (isPaused.value) {
      resume()
    } else {
      play()
    }
  }
  
  // Set current audio element and wire up events
  const setCurrentAudio = (audio: HTMLAudioElement | null) => {
    // Clean up previous audio
    if (currentAudio.value) {
      currentAudio.value.removeEventListener('timeupdate', updateProgress)
      currentAudio.value.removeEventListener('ended', handleAudioEnded)
      currentAudio.value.removeEventListener('error', handleAudioError)
    }
    
    currentAudio.value = audio
    
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('ended', handleAudioEnded)
      audio.addEventListener('error', handleAudioError)
      audio.volume = settings.value.volume
      audio.playbackRate = settings.value.rate
    }
  }
  
  // Event handlers
  const updateProgress = async () => {
    if (!currentAudio.value) return
    
    progress.value = {
      currentTime: currentAudio.value.currentTime,
      totalTime: currentAudio.value.duration || 0,
      percentage: currentAudio.value.duration 
        ? (currentAudio.value.currentTime / currentAudio.value.duration) * 100 
        : 0
    }
    
    // Update highlighting based on current audio time
    const highlightingStore = useHighlightingStore()
    highlightingStore.updateHighlighting(currentAudio.value.currentTime)
  }
  
  const handleAudioEnded = () => {
    console.log('[TTS Store] 🏁 Audio ended, calling stop()')
    stop()
  }
  
  const handleAudioError = (error: Event) => {
    console.error('[TTS Store] 🔥 Audio error:', error)
    stop()
  }
  
  // Progress tracking for offscreen audio
  const startProgressTracking = (duration: number, startFromTime = 0) => {
    if (progressInterval) {
      clearInterval(progressInterval)
    }

    console.log('[TTS Store] 📊 Starting progress tracking. Duration:', duration, 'Start from:', startFromTime)

    const startTime = Date.now() - (startFromTime * 1000) // Adjust start time for resume
    const updateInterval = 100 // Update every 100ms
    let tickCount = 0

    progressInterval = window.setInterval(async () => {
      tickCount++

      if (!isPlaying.value) {
        console.log('[TTS Store] ⏹️ Progress tracking stopped (isPlaying = false)')
        if (progressInterval) {
          clearInterval(progressInterval)
          progressInterval = null
        }
        return
      }

      const elapsed = (Date.now() - startTime) / 1000
      const currentTime = Math.min(elapsed, duration)

      progress.value = {
        currentTime,
        totalTime: duration,
        percentage: (currentTime / duration) * 100
      }

      // Update highlighting
      const highlightingStore = useHighlightingStore()
      highlightingStore.updateHighlighting(currentTime)

      // Check if audio finished
      if (currentTime >= duration) {
        console.log('[TTS Store] ⏱️ Progress reached end:', currentTime, '>=', duration)
        handleAudioEnded()
      }
    }, updateInterval)
  }
  
  // Play Here mode
  const togglePlayHereMode = async () => {
    playHereMode.value = !playHereMode.value

    // Initialize manager if needed
    if (!playHereManager.value) {
      const { PlayHereManager } = await import('../managers/PlayHereManager')
      playHereManager.value = new PlayHereManager()
    }

    if (playHereMode.value) {
      // Enable play here mode with smart pause/resume callback
      playHereManager.value.enable(async (element: Element, text: string) => {
        console.log('[TTS Store] 🎯 Play Here clicked. isPlaying:', isPlaying.value, 'isPaused:', isPaused.value)

        // Check if we're currently playing this same element
        const isSameElement = currentPlayingElement.value === element

        if (isPlaying.value && isSameElement) {
          // Pause current playback
          console.log('[TTS Store] ⏸️ Play Here - Pausing')
          await pause()
          // Update button to show play icon
          playHereManager.value.setPlaying(element, false)
        } else if (isPaused.value && isSameElement) {
          // Resume paused playback
          console.log('[TTS Store] ▶️ Play Here - Resuming')
          await resume()
          // Update button to show pause icon
          playHereManager.value.setPlaying(element, true)
        } else {
          // Start new playback from this element
          console.log('[TTS Store] 🆕 Play Here - Starting new playback')
          // Stop other buttons
          playHereManager.value.stopAll()
          // Start playing
          await play(text, element as HTMLElement, element as HTMLElement)
          // Update this button to show pause icon
          playHereManager.value.setPlaying(element, true)
        }
      })
    } else {
      // Disable play here mode
      playHereManager.value.disable()
    }
  }
  
  // Settings management
  const updateSettings = (newSettings: Partial<TTSSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    
    // Apply settings to current audio
    if (currentAudio.value) {
      if (newSettings.volume !== undefined) {
        currentAudio.value.volume = newSettings.volume
      }
      if (newSettings.rate !== undefined) {
        currentAudio.value.playbackRate = newSettings.rate
      }
    }
  }
  
  // Widget UI
  const setCurrentPlayingElement = (element: HTMLElement | null) => {
    currentPlayingElement.value = element
  }
  
  const toggleWidgetVisibility = () => {
    widgetVisible.value = !widgetVisible.value
  }
  
  // Reset all state
  const reset = () => {
    stop()
    currentText.value = ''
    currentContainer.value = null
    playHereMode.value = false
    playHereButtons.value.clear()
    clearError()
  }
  
  // ===== CROSS-CONTEXT SYNC =====
  // Watch for state changes and sync across contexts
  watch([isPlaying, isPaused, progress, settings], () => {
    syncStateAcrossContexts('tts', {
      isPlaying: isPlaying.value,
      isPaused: isPaused.value,
      progress: progress.value,
      settings: settings.value,
      playHereMode: playHereMode.value,
      timerDisplay: displayTime.value
    })
  }, { deep: true })
  
  return {
    // ===== STATE =====
    isPlaying,
    isPaused,
    isLoading,
    currentText,
    currentAudio,
    currentContainer,
    progress,
    settings,
    playHereMode,
    playHereButtons,
    currentPlayingElement,
    widgetVisible,
    timerDisplay,
    error,
    
    // ===== COMPUTED =====
    canPlay,
    displayTime,
    playbackState,
    hasError,
    
    // ===== ACTIONS =====
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    setCurrentAudio,
    togglePlayHereMode,
    updateSettings,
    setCurrentPlayingElement,
    toggleWidgetVisibility,
    reset,
    clearError,
    setError
  }
})