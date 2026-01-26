/**
 * Vue Subscription Page Entry Point
 * Initializes the subscription page as a Vue component with Pinia stores
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SubscriptionPage from '../components/SubscriptionPage.vue'
import { initializeExtensionAuthSync } from '../shared/composables/useExtensionAuthSync'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize extension auth sync listener (receives auth from browser extension)
let cleanupAuthSync: (() => void) | null = null

// Initialize the subscription page
function initializeSubscriptionPage() {
  const container = document.getElementById('app') || document.body

  // Initialize extension auth sync before mounting Vue app
  cleanupAuthSync = initializeExtensionAuthSync()

  // Create Vue app
  const app = createApp(SubscriptionPage)
  app.use(pinia)

  // Mount the subscription page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).subscriptionApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSubscriptionPage)
} else {
  initializeSubscriptionPage()
}

// Export for manual initialization
export { initializeSubscriptionPage }