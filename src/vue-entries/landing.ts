/**
 * Vue Landing Page Entry Point
 * Initializes the landing page as a Vue component with Pinia stores
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import LandingPage from '../components/LandingPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Create Pinia store
const pinia = createPinia()

// Initialize the landing page
function initializeLandingPage() {
  const container = document.getElementById('app') || document.body

  // Create Vue app
  const app = createApp(LandingPage)
  app.use(pinia)

  // Mount the landing page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).landingApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLandingPage)
} else {
  initializeLandingPage()
}

// Export for manual initialization
export { initializeLandingPage }
