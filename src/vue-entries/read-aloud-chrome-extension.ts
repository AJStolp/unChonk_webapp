/**
 * Vue entry: "Read Aloud Chrome Extension" SEO landing page
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ReadAloudChromeExtensionPage from '../components/ReadAloudChromeExtensionPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import '../styles/globals.css'

loadUmamiScript()

const pinia = createPinia()

function initializePage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

  const app = createApp(ReadAloudChromeExtensionPage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage)
} else {
  initializePage()
}

export { initializePage }
