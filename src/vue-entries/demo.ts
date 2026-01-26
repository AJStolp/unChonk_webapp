/**
 * Vue Demo Page Entry Point
 * Initializes the demo page as a Vue component with Pinia stores
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DemoPage from '../components/DemoPage.vue'
import { initializeExtensionAuthSync } from '../shared/composables/useExtensionAuthSync'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize extension auth sync listener (receives auth from browser extension)
let cleanupAuthSync: (() => void) | null = null

// Initialize the demo page
function initializeDemoPage() {
  const container = document.getElementById('app') || document.body

  // Initialize extension auth sync before mounting Vue app
  cleanupAuthSync = initializeExtensionAuthSync()

  // Create Vue app
  const app = createApp(DemoPage)
  app.use(pinia)

  // Mount the demo page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).demoApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDemoPage)
} else {
  initializeDemoPage()
}

// Export for manual initialization
export { initializeDemoPage }
