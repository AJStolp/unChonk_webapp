/**
 * Vue Coming Soon Page Entry Point
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ComingSoonPage from '../components/ComingSoonPage.vue'
import '../styles/globals.css'

const pinia = createPinia()

function initializeComingSoonPage() {
  const container = document.getElementById('app') || document.body
  const app = createApp(ComingSoonPage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeComingSoonPage)
} else {
  initializeComingSoonPage()
}

export { initializeComingSoonPage }
