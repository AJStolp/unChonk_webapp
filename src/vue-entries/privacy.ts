/**
 * Vue Privacy Page Entry Point
 * Initializes the privacy policy page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrivacyPage from '../components/PrivacyPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize the privacy page
function initializePrivacyPage() {
  const container = document.getElementById('app') || document.body

  // Create Vue app
  const app = createApp(PrivacyPage)
  app.use(pinia)

  // Mount the privacy page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).privacyApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePrivacyPage)
} else {
  initializePrivacyPage()
}

// Export for manual initialization
export { initializePrivacyPage }
