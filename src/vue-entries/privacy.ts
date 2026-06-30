/**
 * Vue Privacy Page Entry Point
 * Initializes the privacy policy page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrivacyPage from '../components/PrivacyPage.vue'
import '../styles/globals.css'

// Load analytics

// Create Pinia store
const pinia = createPinia()

// Initialize the privacy page
function initializePrivacyPage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

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
