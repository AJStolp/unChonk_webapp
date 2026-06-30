/**
 * Vue Report Page Entry Point
 * Initializes the bug report / contact page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ReportPage from '../components/ReportPage.vue'
import '../styles/globals.css'

// Load analytics

// Create Pinia store
const pinia = createPinia()

// Initialize the report page
function initializeReportPage() {
  const container = document.getElementById('app') || document.body

  // Create Vue app
  const app = createApp(ReportPage)
  app.use(pinia)

  // Mount the report page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).reportApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeReportPage)
} else {
  initializeReportPage()
}

// Export for manual initialization
export { initializeReportPage }
