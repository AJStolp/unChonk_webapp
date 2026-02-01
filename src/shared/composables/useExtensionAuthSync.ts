/**
 * Extension Auth Sync Composable
 * Receives auth tokens from the unChonk browser extension via postMessage
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useAuthStorage } from './useStorage'

// Must match extension's authSyncConfig.ts
const AUTH_SYNC_MESSAGES = {
  AUTH_TOKEN_SYNC: 'UNCHONK_AUTH_SYNC',
  AUTH_TOKEN_CLEAR: 'UNCHONK_AUTH_CLEAR',
  REQUEST_AUTH_TOKEN: 'UNCHONK_REQUEST_AUTH',
  AUTH_SYNC_ACK: 'UNCHONK_AUTH_ACK'
} as const

const AUTH_SYNC_EXTENSION_ID = 'unchonk-extension'

interface AuthSyncPayload {
  type: string
  extensionId: string
  authToken: string | null
  refreshToken: string | null
  timestamp: number
}

export function useExtensionAuthSync() {
  const authStore = useAuthStore()
  const storage = useAuthStorage()

  const extensionConnected = ref(false)
  const lastSyncTimestamp = ref<number | null>(null)

  /**
   * Handle incoming messages from the extension's content script
   */
  function handleExtensionMessage(event: MessageEvent): void {
    // Only accept messages from same origin (content script runs in page context)
    if (event.origin !== window.location.origin) {
      return
    }

    const data = event.data as AuthSyncPayload

    // Verify this is from our extension
    if (data?.extensionId !== AUTH_SYNC_EXTENSION_ID) {
      return
    }

    // Handle different message types
    switch (data.type) {
      case AUTH_SYNC_MESSAGES.AUTH_TOKEN_SYNC:
        handleAuthSync(data)
        break
      case AUTH_SYNC_MESSAGES.AUTH_TOKEN_CLEAR:
        handleAuthClear()
        break
      default:
        // Unknown message type, ignore
        break
    }
  }

  /**
   * Handle auth token sync from extension
   */
  async function handleAuthSync(payload: AuthSyncPayload): Promise<void> {
    extensionConnected.value = true
    lastSyncTimestamp.value = payload.timestamp

    // Only update if we received tokens
    if (payload.authToken) {
      // Store tokens using the storage composable (same as authStore uses)
      await storage.setAuthToken(payload.authToken)

      if (payload.refreshToken) {
        await storage.setRefreshToken(payload.refreshToken)
      }

      // If authStore is not authenticated, trigger re-initialization
      if (!authStore.isAuthenticated) {
        await authStore.initializeAuth()
      }

      // Send acknowledgment back to extension
      sendAcknowledgment()
    }
  }

  /**
   * Handle auth clear from extension (user logged out in extension)
   */
  async function handleAuthClear(): Promise<void> {
    extensionConnected.value = true
    lastSyncTimestamp.value = Date.now()

    // Logout the webapp
    await authStore.logout()
  }

  /**
   * Send acknowledgment back to extension
   */
  function sendAcknowledgment(): void {
    window.postMessage({
      type: AUTH_SYNC_MESSAGES.AUTH_SYNC_ACK,
      extensionId: AUTH_SYNC_EXTENSION_ID,
      timestamp: Date.now()
    }, window.location.origin)
  }

  /**
   * Request auth tokens from extension
   * Call this if webapp needs to prompt extension to send tokens
   */
  function requestAuthFromExtension(): void {
    window.postMessage({
      type: AUTH_SYNC_MESSAGES.REQUEST_AUTH_TOKEN,
      extensionId: AUTH_SYNC_EXTENSION_ID
    }, window.location.origin)
  }

  /**
   * Initialize the listener
   */
  function initializeListener(): void {
    window.addEventListener('message', handleExtensionMessage)

    // Request auth from extension on init (in case extension loaded before webapp)
    requestAuthFromExtension()
  }

  /**
   * Cleanup the listener
   */
  function cleanupListener(): void {
    window.removeEventListener('message', handleExtensionMessage)
  }

  // Auto-setup when used in a component
  onMounted(() => {
    initializeListener()
  })

  onUnmounted(() => {
    cleanupListener()
  })

  return {
    extensionConnected,
    lastSyncTimestamp,
    requestAuthFromExtension,
    initializeListener,
    cleanupListener
  }
}

/**
 * Standalone initialization function for use outside Vue components
 * Call this in main.ts or App.vue setup
 */
export function initializeExtensionAuthSync(): () => void {
  const handleMessage = async (event: MessageEvent): Promise<void> => {
    if (event.origin !== window.location.origin) return

    const data = event.data as AuthSyncPayload
    if (data?.extensionId !== AUTH_SYNC_EXTENSION_ID) return

    if (data.type === AUTH_SYNC_MESSAGES.AUTH_TOKEN_SYNC && data.authToken) {
      // Store directly to localStorage for immediate availability
      localStorage.setItem('auth_token', data.authToken)
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }

      // Send acknowledgment
      window.postMessage({
        type: AUTH_SYNC_MESSAGES.AUTH_SYNC_ACK,
        extensionId: AUTH_SYNC_EXTENSION_ID,
        timestamp: Date.now()
      }, window.location.origin)
    }

    if (data.type === AUTH_SYNC_MESSAGES.AUTH_TOKEN_CLEAR) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  }

  window.addEventListener('message', handleMessage)

  // Request auth from extension
  window.postMessage({
    type: AUTH_SYNC_MESSAGES.REQUEST_AUTH_TOKEN,
    extensionId: AUTH_SYNC_EXTENSION_ID
  }, window.location.origin)

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage)
  }
}
