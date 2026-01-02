/**
 * Vue Demo Page Entry Point
 * Initializes the demo page as a Vue component with Pinia stores
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DemoPage from '../components/DemoPage.vue'

// Create Pinia store
const pinia = createPinia()

// Initialize the demo page
function initializeDemoPage() {
  const container = document.getElementById('app') || document.body

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
