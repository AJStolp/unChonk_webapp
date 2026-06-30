/**
 * Vue entry: "Read PDF Aloud" SEO landing page
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ReadPdfAloudPage from '../components/ReadPdfAloudPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

loadUmamiScript()

const pinia = createPinia()

function initializePage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

  const app = createApp(ReadPdfAloudPage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage)
} else {
  initializePage()
}

export { initializePage }
