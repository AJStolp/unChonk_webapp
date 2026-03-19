/**
 * Vue Status Page Entry Point
 * Initializes the system status page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import StatusPage from '../components/StatusPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize the status page
function initializeStatusPage() {
  const container = document.getElementById('app') || document.body

  // Create Vue app
  const app = createApp(StatusPage)
  app.use(pinia)

  // Mount the status page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).statusApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStatusPage)
} else {
  initializeStatusPage()
}

// Export for manual initialization
export { initializeStatusPage }
