/**
 * Vue Email Verification Page Entry Point
 * Initializes the email verification page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import EmailVerificationPage from '../components/EmailVerificationPage.vue'

// Create Pinia store
const pinia = createPinia()





// Initialize the email verification page
function initializeEmailVerificationPage() {
  const container = document.getElementById('app') || document.body
  
  // Create Vue app
  const app = createApp(EmailVerificationPage)
  app.use(pinia)

  // Mount the email verification page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).emailVerificationApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEmailVerificationPage)
} else {
  initializeEmailVerificationPage()
}

// Export for manual initialization
export { initializeEmailVerificationPage }