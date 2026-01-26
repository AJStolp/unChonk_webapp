/**
 * Vue Success Page Entry Point
 * Initializes the success page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuccessPage from '../components/SuccessPage.vue'
import { initializeExtensionAuthSync } from '../shared/composables/useExtensionAuthSync'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize extension auth sync listener (receives auth from browser extension)
let cleanupAuthSync: (() => void) | null = null

// Initialize the success page
function initializeSuccessPage() {
  const container = document.getElementById('app') || document.body

  // Initialize extension auth sync before mounting Vue app
  cleanupAuthSync = initializeExtensionAuthSync()

  // Create Vue app
  const app = createApp(SuccessPage)
  app.use(pinia)

  // Mount the success page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).successApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSuccessPage)
} else {
  initializeSuccessPage()
}

// Export for manual initialization
export { initializeSuccessPage }