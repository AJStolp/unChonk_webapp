/**
 * Highlighting State Store - Visual Feedback Brain
 * Manages word/sentence highlighting state across contexts
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { syncStateAcrossContexts } from '.'
import type { SpeechMark } from '../../extension/widget/types/TTSTypes'
import { useAuthStore } from './authStore'

export interface HighlightSettings {
  wordColor: string
  sentenceColor: string
  wordOpacity: number
  sentenceOpacity: number
  borderRadius: number
  paddingX: number
  paddingY: number
  fontWeight: number
}

export interface HighlightingState {
  isActive: boolean
  currentWord: SpeechMark | null
  currentSentence: SpeechMark | null
  container: HTMLElement | null
}

export const useHighlightingStore = defineStore('highlighting', () => {
  // ===== CORE HIGHLIGHTING STATE =====
  const isActive = ref(false)
  const isInitialized = ref(false)
  const container = ref<HTMLElement | null>(null)
  const selectionRange = ref<Range | undefined>(undefined)
  
  // ===== ENGINE STATE (moved from HighlightingEngine) =====
  const activeSession = ref<string | undefined>(undefined)
  const highlightingMethod = ref<'backend' | 'webspeech' | 'none'>('none')
  const extractedText = ref<string | undefined>(undefined)
  const usingPaintAPI = ref(false)
  const highlightTechnology = ref<'paint-api' | 'css-spans' | 'none'>('none')
  
  // ===== CURRENT HIGHLIGHTING TARGETS =====
  const currentWord = ref<SpeechMark | null>(null)
  const currentSentence = ref<SpeechMark | null>(null)
  const lastActiveWord = ref<SpeechMark | null>(null)
  const lastActiveSentence = ref<SpeechMark | null>(null)
  
  // ===== SPEECH MARKS DATA =====
  const speechMarks = ref<SpeechMark[]>([])
  const sortedWords = ref<SpeechMark[]>([])
  const sortedSentences = ref<SpeechMark[]>([])
  
  // ===== TIMING & PROGRESS =====
  const totalDuration = ref(0)
  const currentTime = ref(0)
  const rafId = ref<number | null>(null)
  
  // ===== CHARACTER MAPPING =====
  const charMap = ref<Map<number, { node: Text; offset: number }>>(new Map())
  
  // ===== HIGHLIGHTING MANAGER (pure logic, no state) =====
  const highlightingManager = ref<any>(null)
  
  // ===== SETTINGS =====
  const settings = ref<HighlightSettings>({
    wordColor: 'rgba(255, 255, 0, 0.6)',
    sentenceColor: 'rgba(147, 51, 234, 0.2)',
    wordOpacity: 0.6,
    sentenceOpacity: 0.2,
    borderRadius: 3,
    paddingX: 2,
    paddingY: 1,
    fontWeight: 600
  })

  // Custom color mode state
  const customColorMode = ref(false)
  const customWordColor = ref('#FFFF00') // Yellow
  const customSentenceColor = ref('#00FFFF') // Cyan
  
  // ===== COMPUTED =====
  const highlightingState = computed((): HighlightingState => ({
    isActive: isActive.value,
    currentWord: currentWord.value,
    currentSentence: currentSentence.value,
    container: container.value
  }))
  
  const hasActiveHighlights = computed(() => 
    currentWord.value !== null || currentSentence.value !== null
  )
  
  const isEngineReady = computed(() => 
    isInitialized.value && usingPaintAPI.value && highlightingManager.value
  )
  
  const highlightingProgress = computed(() => {
    if (totalDuration.value === 0) return 0
    return Math.min(100, (currentTime.value / totalDuration.value) * 100)
  })
  
  const highlightingStats = computed(() => ({
    totalWords: sortedWords.value.length,
    totalSentences: sortedSentences.value.length,
    currentWordIndex: sortedWords.value.findIndex(w => w === currentWord.value),
    currentSentenceIndex: sortedSentences.value.findIndex(s => s === currentSentence.value),
    progress: highlightingProgress.value,
    technology: highlightTechnology.value,
    method: highlightingMethod.value
  }))
  
  // ===== ACTIONS =====
  
  // Set engine state
  const setEngineState = (state: Partial<{
    activeSession: string
    highlightingMethod: 'backend' | 'webspeech' | 'none'
    extractedText: string
    usingPaintAPI: boolean
    highlightTechnology: 'paint-api' | 'css-spans' | 'none'
  }>) => {
    if (state.activeSession !== undefined) activeSession.value = state.activeSession
    if (state.highlightingMethod !== undefined) highlightingMethod.value = state.highlightingMethod
    if (state.extractedText !== undefined) extractedText.value = state.extractedText
    if (state.usingPaintAPI !== undefined) usingPaintAPI.value = state.usingPaintAPI
    if (state.highlightTechnology !== undefined) highlightTechnology.value = state.highlightTechnology
  }
  
  // Set timing state
  const setTimingState = (time: number, duration?: number) => {
    currentTime.value = time
    if (duration !== undefined) {
      totalDuration.value = duration
    }
  }
  
  // Start/stop RAF loop (reactive timing)
  const startTimingLoop = () => {
    if (rafId.value) return // Already running
    
    const updateLoop = () => {
      // This will be called by the highlighting engine
      rafId.value = requestAnimationFrame(updateLoop)
    }
    
    rafId.value = requestAnimationFrame(updateLoop)
  }
  
  const stopTimingLoop = () => {
    if (rafId.value) {
      cancelAnimationFrame(rafId.value)
      rafId.value = null
    }
  }
  
  // Initialize highlighting for a container
  const initializeHighlighting = async (targetContainer: HTMLElement, text: string, range?: Range) => {
    try {
      container.value = targetContainer
      extractedText.value = text
      selectionRange.value = range

      // Initialize HighlightingManager (pure business logic)
      // Use relative import to avoid Chrome extension alias issues
      const { HighlightingManager } = await import('../../shared/managers/HighlightingManager')
      highlightingManager.value = new HighlightingManager({
        onHighlightingSetup: (data) => {
        },
        onHighlightingStart: () => {
          isActive.value = true
        },
        onHighlightingStop: () => {
          isActive.value = false
        }
      })

      // Connect manager to Vue store for state management
      const storeInterface = {
        setEngineState: setEngineState,
        setTimingState: setTimingState,
        startTimingLoop: startTimingLoop,
        stopTimingLoop: stopTimingLoop,
        get isInitialized() { return isInitialized.value },
        get activeSession() { return activeSession.value }
      }
      highlightingManager.value.connectStore(storeInterface)

      // Initialize with user tier (free/premium)
      const authStore = useAuthStore()
      const userTier = authStore.user?.tier || 'free'
      const sessionId = `session-${Date.now()}`

      const managerInitialized = await highlightingManager.value.initialize(userTier, sessionId)

      // If custom color mode is already on, apply custom colors immediately after initialization
      if (customColorMode.value) {
        applyCustomColors()
      }

      isInitialized.value = true
      isActive.value = true

      return true
    } catch (error) {
      console.error('[Highlighting Store] ❌ Failed to initialize highlighting:', error)
      return false
    }
  }
  
  // Set speech marks for highlighting
  const setSpeechMarks = (marks: SpeechMark[], skipSetup = false) => {
    speechMarks.value = marks

    // Sort by type for efficient lookup
    sortedWords.value = marks.filter(mark => mark.type === 'word').sort((a, b) => a.time - b.time)
    sortedSentences.value = marks.filter(mark => mark.type === 'sentence').sort((a, b) => a.time - b.time)

    if (highlightingManager.value) {
      if (skipSetup) {
        // For incremental updates (e.g., Web Speech API), update speech marks without resetting state
        highlightingManager.value.updateSpeechMarksIncrementally(marks)
      } else {
        // For full setup (e.g., Polly backend), reset and initialize highlighting
        if (container.value && extractedText.value) {
          highlightingManager.value.setupBackendHighlighting(
            { speech_marks: marks },
            extractedText.value,
            container.value,
            selectionRange.value  // Pass selection range if available
          )
        }
      }
    }
  }
  
  // Update current highlighting based on audio time
  const updateHighlighting = (currentTime: number) => {
    if (!isActive.value || !isInitialized.value || !highlightingManager.value) {
      return
    }

    // Track state in Vue store for reactivity
    const activeWord = findActiveWord(currentTime)
    if (activeWord !== currentWord.value) {
      lastActiveWord.value = currentWord.value
      currentWord.value = activeWord
    }

    const activeSentence = findActiveSentence(currentTime)
    if (activeSentence !== currentSentence.value) {
      lastActiveSentence.value = currentSentence.value
      currentSentence.value = activeSentence
    }

    // CRUCIAL: Call the actual highlighting manager to trigger visual updates
    // This was missing - the highlighting manager needs to be called to apply visual effects
    if (highlightingManager.value && speechMarks.value.length > 0) {
      // Use the new method to update highlighting at the current time
      highlightingManager.value.updateHighlightingAtTime(currentTime)
    }
  }
  
  // Helper functions
  const findActiveWord = (time: number): SpeechMark | null => {
    for (let i = 0; i < sortedWords.value.length; i++) {
      const word = sortedWords.value[i]
      const nextWord = sortedWords.value[i + 1]
      
      if (time >= word.time && (!nextWord || time < nextWord.time)) {
        return word
      }
    }
    return null
  }
  
  const findActiveSentence = (time: number): SpeechMark | null => {
    for (let i = 0; i < sortedSentences.value.length; i++) {
      const sentence = sortedSentences.value[i]
      const nextSentence = sortedSentences.value[i + 1]
      
      if (time >= sentence.time && (!nextSentence || time < nextSentence.time)) {
        return sentence
      }
    }
    return null
  }
  
  // Highlight specific word/sentence manually
  const highlightWord = (word: SpeechMark) => {
    currentWord.value = word
  }

  const highlightSentence = (sentence: SpeechMark) => {
    currentSentence.value = sentence
  }
  
  // Clear all highlighting
  const clearHighlighting = () => {
    currentWord.value = null
    currentSentence.value = null
    lastActiveWord.value = null
    lastActiveSentence.value = null
  }
  
  // Settings management
  const updateSettings = (newSettings: Partial<HighlightSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  // Custom color management
  const toggleCustomColorMode = () => {
    customColorMode.value = !customColorMode.value

    if (customColorMode.value) {
      // Apply custom colors and ensure provider knows to use them
      applyCustomColors()
    } else {
      // Reset to default colors when turning off custom mode
      settings.value = {
        ...settings.value,
        wordColor: 'rgba(255, 255, 0, 0.6)',
        sentenceColor: 'rgba(147, 51, 234, 0.2)'
      }
      // Tell the provider to use default colors again
      if (highlightingManager.value) {
        highlightingManager.value.resetToDefaultColors()
      }
    }
  }

  const setCustomWordColor = (hexColor: string) => {
    customWordColor.value = hexColor
    if (customColorMode.value) {
      applyCustomColors()
    }
  }

  const setCustomSentenceColor = (hexColor: string) => {
    customSentenceColor.value = hexColor
    if (customColorMode.value) {
      applyCustomColors()
    }
  }

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const applyCustomColors = () => {
    const wordColorRgba = hexToRgba(customWordColor.value, settings.value.wordOpacity)
    const sentenceColorRgba = hexToRgba(customSentenceColor.value, settings.value.sentenceOpacity)

    settings.value = {
      ...settings.value,
      wordColor: wordColorRgba,
      sentenceColor: sentenceColorRgba
    }

    // Update the highlighting provider settings (even if not currently active)
    // This ensures the colors are ready for the next playback
    if (highlightingManager.value) {
      highlightingManager.value.updateProviderSettings(settings.value)
    }
  }

  // Start/stop highlighting
  const startHighlighting = () => {
    if (highlightingManager.value) {
      highlightingManager.value.startHighlighting()
    }
    isActive.value = true
  }

  const stopHighlighting = () => {
    if (highlightingManager.value) {
      highlightingManager.value.stopHighlighting()
    }
    isActive.value = false
    clearHighlighting()
  }
  
  // Reset highlighting state
  const reset = () => {
    // Core state
    isActive.value = false
    isInitialized.value = false
    container.value = null
    clearHighlighting()
    speechMarks.value = []
    sortedWords.value = []
    sortedSentences.value = []
    charMap.value.clear()
    
    // Engine state
    activeSession.value = undefined
    highlightingMethod.value = 'none'
    extractedText.value = undefined
    usingPaintAPI.value = false
    highlightTechnology.value = 'none'
    
    // Timing state
    totalDuration.value = 0
    currentTime.value = 0
    stopTimingLoop()
  }
  
  // Set character mapping (for PaintAPI integration)
  const setCharacterMap = (newCharMap: Map<number, { node: Text; offset: number }>) => {
    charMap.value = newCharMap
  }
  
  // ===== CROSS-CONTEXT SYNC =====
  watch([isActive, currentWord, currentSentence, settings], () => {
    syncStateAcrossContexts('highlighting', {
      isActive: isActive.value,
      currentWord: currentWord.value,
      currentSentence: currentSentence.value,
      settings: settings.value,
      hasActiveHighlights: hasActiveHighlights.value
    })
  }, { deep: true })
  
  return {
    // ===== CORE STATE =====
    isActive,
    isInitialized,
    container,
    currentWord,
    currentSentence,
    lastActiveWord,
    lastActiveSentence,
    speechMarks,
    sortedWords,
    sortedSentences,
    charMap,
    settings,
    customColorMode,
    customWordColor,
    customSentenceColor,

    // ===== ENGINE STATE =====
    activeSession,
    highlightingMethod,
    extractedText,
    usingPaintAPI,
    highlightTechnology,
    totalDuration,
    currentTime,
    rafId,
    
    // ===== COMPUTED =====
    highlightingState,
    hasActiveHighlights,
    isEngineReady,
    highlightingProgress,
    highlightingStats,
    
    // ===== ACTIONS =====
    initializeHighlighting,
    setSpeechMarks,
    updateHighlighting,
    highlightWord,
    highlightSentence,
    clearHighlighting,
    updateSettings,
    toggleCustomColorMode,
    setCustomWordColor,
    setCustomSentenceColor,
    startHighlighting,
    stopHighlighting,
    setCharacterMap,
    reset,
    setEngineState,
    setTimingState,
    startTimingLoop,
    stopTimingLoop
  }
})