/**
 * Vue Roadmap Page Entry Point
 * Initializes the product roadmap page as a Vue component
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import RoadmapPage from '../components/RoadmapPage.vue'
import '../styles/globals.css'

// Load analytics

// Create Pinia store
const pinia = createPinia()

// Initialize the roadmap page
function initializeRoadmapPage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

  // Create Vue app
  const app = createApp(RoadmapPage)
  app.use(pinia)

  // Mount the roadmap page
  app.mount(container)

  // Expose app for debugging
  ;(window as any).roadmapApp = app
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRoadmapPage)
} else {
  initializeRoadmapPage()
}

// Export for manual initialization
export { initializeRoadmapPage }
