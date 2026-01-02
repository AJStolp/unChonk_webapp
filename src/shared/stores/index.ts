/**
 * Pinia Store Setup for Chrome Extension
 * Handles cross-context state synchronization
 */
import { createPinia } from 'pinia'

// Create the Pinia instance
export const pinia = createPinia()

// Chrome extension context detection
export const isExtensionEnvironment = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id
}

// Context types for state synchronization
export type ExtensionContext = 'background' | 'content' | 'side-panel' | 'widget'

export const getCurrentContext = (): ExtensionContext => {
  if (typeof chrome === 'undefined') return 'content'
  
  // Background script detection - service workers don't have window or document
  if (typeof window === 'undefined' && typeof document === 'undefined') return 'background'
  
  // Side panel detection (check if window exists first)
  if (typeof window !== 'undefined' && window.location && window.location.href.includes('summarize-panel')) return 'side-panel'
  
  // Widget in content script (check if document exists first)
  if (typeof document !== 'undefined' && document.querySelector && document.querySelector('#tts-widget')) return 'widget'
  
  return 'content'
}

// State synchronization via Chrome messages
export interface StateMessage {
  type: 'STATE_UPDATE'
  store: string
  data: Record<string, unknown>
  context: ExtensionContext
  timestamp: number
}

export const syncStateAcrossContexts = (storeName: string, state: Record<string, unknown>) => {
  if (!isExtensionEnvironment()) return
  
  const message: StateMessage = {
    type: 'STATE_UPDATE',
    store: storeName,
    data: state,
    context: getCurrentContext(),
    timestamp: Date.now()
  }
  
  // Broadcast to all contexts
  chrome.runtime.sendMessage(message).catch(() => {
    // Background might not be ready, that's ok
  })
}

export * from './ttsStore'
export * from './highlightingStore'
export * from './authStore'
export * from './contentStore'