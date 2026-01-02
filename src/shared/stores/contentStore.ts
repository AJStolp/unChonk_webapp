/**
 * Content State Store - Text & Summary Management
 * Manages extracted content, summaries, and document state
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { syncStateAcrossContexts } from '.'
import { useContentExtractor } from '../composables/useContentExtractor'

export interface ExtractedContent {
  id: string
  url: string
  title: string
  text: string
  wordCount: number
  extractedAt: string
  selectors: string[]
}

export interface SummarySection {
  heading: string
  headingLevel?: number
  points?: string[]
  content?: string  // For paragraph-style content
  _textContainerId?: string
  _pointTextContainerIds?: string[]
}

export interface Summary {
  id: string
  contentId: string
  title?: string
  sections?: SummarySection[]
  keyPoints?: string[]
  totalSentences?: number
  summaryRatio?: number
  generatedAt: string
  _titleTextContainerId?: string
}

export interface ContentState {
  currentContent: ExtractedContent | null
  currentSummary: Summary | null
  isExtracting: boolean
  isGeneratingSummary: boolean
}

export const useContentStore = defineStore('content', () => {
  // ===== CONTENT STATE =====
  const currentContent = ref<ExtractedContent | null>(null)
  const currentSummary = ref<Summary | null>(null)
  const extractedContents = ref<ExtractedContent[]>([])
  const summaries = ref<Summary[]>([])
  
  // ===== LOADING STATES =====
  const isExtracting = ref(false)
  const isGeneratingSummary = ref(false)
  const extractionError = ref<string | null>(null)
  const summaryError = ref<string | null>(null)
  
  // ===== PAGE STATE =====
  const currentUrl = ref('')
  const pageTitle = ref('')
  const pageLanguage = ref('en')
  const lastExtractedAt = ref<string | null>(null)
  
  // ===== COMPUTED =====
  const contentState = computed((): ContentState => ({
    currentContent: currentContent.value,
    currentSummary: currentSummary.value,
    isExtracting: isExtracting.value,
    isGeneratingSummary: isGeneratingSummary.value
  }))
  
  const hasContent = computed(() => currentContent.value !== null)
  const hasSummary = computed(() => currentSummary.value !== null)
  const canGenerateSummary = computed(() => 
    hasContent.value && !isGeneratingSummary.value && currentContent.value!.wordCount > 50
  )
  
  const contentStats = computed(() => {
    if (!currentContent.value) return null
    
    return {
      wordCount: currentContent.value.wordCount,
      charCount: currentContent.value.text.length,
      estimatedReadTime: Math.ceil(currentContent.value.wordCount / 200), // ~200 WPM
      summaryRatio: currentSummary.value?.summaryRatio || 0
    }
  })
  
  // ===== ACTIONS =====
  
  // Extract selected text from page
  const extractSelectedText = (): ExtractedContent | null => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      console.warn('[Content Store] ⚠️ No text selected')
      return null
    }
    
    const selectedText = selection.toString().trim()
    if (selectedText.length === 0) {
      console.warn('[Content Store] ⚠️ Selected text is empty')
      return null
    }
    
    const wordCount = selectedText.split(/\s+/).filter((word: string) => word.length > 0).length
    
    const extractedContent: ExtractedContent = {
      id: generateId(),
      url: currentUrl.value,
      title: `Selected Text (${wordCount} words)`,
      text: selectedText,
      wordCount: wordCount,
      extractedAt: new Date().toISOString(),
      selectors: []
    }
    
    return extractedContent
  }
  
  // Set content from selected text  
  const playSelectedText = () => {
    const selectedContent = extractSelectedText()
    if (selectedContent) {
      currentContent.value = selectedContent
      return true
    }
    return false
  }
  
  // Extract content from current page
  const extractContent = async (forceReextract = false) => {
    
    if (isExtracting.value) {
      console.warn('[Content Store] ⚠️ Extraction already in progress')
      return false
    }
    
    // Check if we already have recent content for this URL
    if (!forceReextract && currentContent.value && currentContent.value.url === currentUrl.value) {
      const extractedTime = new Date(currentContent.value.extractedAt).getTime()
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      
      if (now - extractedTime < fiveMinutes) {
        return true
      }
    }
    
    isExtracting.value = true
    extractionError.value = null
    
    try {
      let extractedText = ''
      let wordCount = 0
      let extractedTitle = pageTitle.value || 'Untitled'
      
      // Always use direct content extraction since we're in the content script context
      const contentExtractor = useContentExtractor()
      
      const extractionResult = await contentExtractor.extractPageContent()
      if (extractionResult.text && extractionResult.text.length > 0) {
        extractedText = extractionResult.text
        wordCount = extractionResult.text.split(/\s+/).filter((word: string) => word.length > 0).length
        extractedTitle = document.title || extractedTitle
      } else {
        throw new Error('Direct content extraction failed - no text found')
      }
      
      const extractedContent: ExtractedContent = {
        id: generateId(),
        url: currentUrl.value,
        title: extractedTitle,
        text: extractedText,
        wordCount: wordCount,
        extractedAt: new Date().toISOString(),
        selectors: []
      }
      
      currentContent.value = extractedContent
      lastExtractedAt.value = extractedContent.extractedAt
      
      // Add to history
      const existingIndex = extractedContents.value.findIndex(c => c.url === extractedContent.url)
      if (existingIndex >= 0) {
        extractedContents.value[existingIndex] = extractedContent
      } else {
        extractedContents.value.unshift(extractedContent)
        // Keep only last 50 entries
        if (extractedContents.value.length > 50) {
          extractedContents.value = extractedContents.value.slice(0, 50)
        }
      }
      
      return true
      
    } catch (error) {
      console.error('[Content Store] ❌ Content extraction failed:', error)
      extractionError.value = error instanceof Error ? error.message : 'Unknown error'
      return false
    } finally {
      isExtracting.value = false
    }
  }
  
  // Generate summary from current content
  const generateSummary = async () => {
    
    if (!currentContent.value) {
      console.warn('[Content Store] ⚠️ No content to summarize')
      return false
    }
    
    if (isGeneratingSummary.value) {
      console.warn('[Content Store] ⚠️ Summary generation already in progress')
      return false
    }
    
    isGeneratingSummary.value = true
    summaryError.value = null
    
    try {
      // This will integrate with your existing SummaryUtils
      const response = await chrome.runtime.sendMessage({
        action: 'generateSummary',
        contentId: currentContent.value.id,
        text: currentContent.value.text,
        title: currentContent.value.title
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Summary generation failed')
      }
      
      const summary: Summary = {
        id: generateId(),
        contentId: currentContent.value.id,
        title: response.data.title,
        sections: response.data.sections,
        keyPoints: response.data.keyPoints,
        totalSentences: response.data.totalSentences,
        summaryRatio: response.data.summaryRatio,
        generatedAt: new Date().toISOString(),
        _titleTextContainerId: response.data._titleTextContainerId
      }
      
      currentSummary.value = summary
      
      // Add to history
      const existingIndex = summaries.value.findIndex(s => s.contentId === summary.contentId)
      if (existingIndex >= 0) {
        summaries.value[existingIndex] = summary
      } else {
        summaries.value.unshift(summary)
        // Keep only last 20 summaries
        if (summaries.value.length > 20) {
          summaries.value = summaries.value.slice(0, 20)
        }
      }
      
      // Open the side panel FIRST (as part of user gesture), then send the summary
      try {
        await chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' })
        
        // Small delay to ensure side panel is ready to receive messages
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Then notify side panel with the summary data
        await chrome.runtime.sendMessage({
          type: 'SUMMARY_GENERATED',
          data: {
            summary: summary,
            content: currentContent.value
          }
        })
      } catch (error) {
        console.warn('[Content Store] ⚠️ Failed to open side panel or send summary:', error)
      }
      
      return true
      
    } catch (error) {
      console.error('[Content Store] ❌ Summary generation failed:', error)
      summaryError.value = error instanceof Error ? error.message : 'Unknown error'
      return false
    } finally {
      isGeneratingSummary.value = false
    }
  }
  
  // Set current page info
  const setPageInfo = (url: string, title: string, language = 'en') => {
    currentUrl.value = url
    pageTitle.value = title
    pageLanguage.value = language
  }
  
  // Load content/summary by ID
  const loadContent = (contentId: string) => {
    const content = extractedContents.value.find(c => c.id === contentId)
    if (content) {
      currentContent.value = content
      
      // Load associated summary if exists
      const summary = summaries.value.find(s => s.contentId === contentId)
      if (summary) {
        currentSummary.value = summary
      }
      
      return true
    }
    return false
  }
  
  const loadSummary = (summaryId: string) => {
    const summary = summaries.value.find(s => s.id === summaryId)
    if (summary) {
      currentSummary.value = summary
      return true
    }
    return false
  }
  
  // Clear states
  const clearContent = () => {
    currentContent.value = null
    extractionError.value = null
  }
  
  const clearSummary = () => {
    currentSummary.value = null
    summaryError.value = null
  }
  
  const clearAll = () => {
    clearContent()
    clearSummary()
    extractedContents.value = []
    summaries.value = []
  }
  
  // Validate content/summary structure
  const validateContent = (content: unknown): content is ExtractedContent => {
    return content !== null &&
           typeof content === 'object' &&
           'id' in content &&
           'text' in content &&
           'url' in content &&
           typeof content.id === 'string' &&
           typeof content.text === 'string' &&
           typeof content.url === 'string' &&
           content.text.length > 0
  }

  const validateSummary = (summary: unknown): summary is Summary => {
    return summary !== null &&
           typeof summary === 'object' &&
           'id' in summary &&
           typeof summary.id === 'string' &&
           (('sections' in summary && Array.isArray(summary.sections)) ||
            ('keyPoints' in summary && Array.isArray(summary.keyPoints)))
  }
  
  // Update content and summary from external source (e.g., cross-context messages)
  const updateFromExternalData = (content: ExtractedContent, summary: Summary) => {
    if (validateContent(content)) {
      currentContent.value = content
    } else {
      console.warn('[Content Store] ⚠️ Invalid content data from external source:', content)
    }
    
    if (validateSummary(summary)) {
      currentSummary.value = summary
    } else {
      console.warn('[Content Store] ⚠️ Invalid summary data from external source:', summary)
    }
    
    // Clear any existing errors
    extractionError.value = null
    summaryError.value = null
  }
  
  // Helper functions
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  
  // ===== CROSS-CONTEXT SYNC =====
  watch([currentContent, currentSummary, isExtracting, isGeneratingSummary], () => {
    syncStateAcrossContexts('content', {
      hasContent: hasContent.value,
      hasSummary: hasSummary.value,
      isExtracting: isExtracting.value,
      isGeneratingSummary: isGeneratingSummary.value,
      currentContent: currentContent.value,
      currentSummary: currentSummary.value,
      contentStats: contentStats.value
    })
  }, { deep: true })
  
  return {
    // ===== STATE =====
    currentContent,
    currentSummary,
    extractedContents,
    summaries,
    isExtracting,
    isGeneratingSummary,
    extractionError,
    summaryError,
    currentUrl,
    pageTitle,
    pageLanguage,
    lastExtractedAt,
    
    // ===== COMPUTED =====
    contentState,
    hasContent,
    hasSummary,
    canGenerateSummary,
    contentStats,
    
    // ===== ACTIONS =====
    extractContent,
    extractSelectedText,
    playSelectedText,
    generateSummary,
    setPageInfo,
    loadContent,
    loadSummary,
    clearContent,
    clearSummary,
    clearAll,
    validateContent,
    validateSummary,
    updateFromExternalData
  }
})