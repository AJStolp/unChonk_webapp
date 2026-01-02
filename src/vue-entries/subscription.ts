/**
 * Vue Subscription Page Entry Point
 * Initializes the subscription page as a Vue component with Pinia stores
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SubscriptionPage from '../components/SubscriptionPage.vue'

// Create Pinia store
const pinia = createPinia()

// Initialize the subscription page
function initializeSubscriptionPage() {
  const container = document.getElementById('app') || document.body
  
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