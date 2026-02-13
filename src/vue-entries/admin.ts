/**
 * Vue Admin Dashboard Entry Point
 * Self-contained admin page — uses sessionStorage auth, no shared auth stores
 */

import { createApp } from 'vue'
import AdminDashboardPage from '../components/AdminDashboardPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

// Load analytics
loadUmamiScript()

// Initialize the admin dashboard page
function initializeAdminPage() {
  const container = document.getElementById('app') || document.body

  const app = createApp(AdminDashboardPage)
  app.mount(container)
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAdminPage)
} else {
  initializeAdminPage()
}

// Export for manual initialization
export { initializeAdminPage }
