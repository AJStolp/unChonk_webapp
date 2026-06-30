/**
 * Vue entry: "unChonk vs Speechify" comparison SEO landing page
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import UnchonkVsSpeechifyPage from '../components/UnchonkVsSpeechifyPage.vue'
import '../styles/globals.css'


const pinia = createPinia()

function initializePage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

  const app = createApp(UnchonkVsSpeechifyPage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage)
} else {
  initializePage()
}

export { initializePage }
