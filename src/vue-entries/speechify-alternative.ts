/**
 * Vue entry: "Speechify Alternative" SEO landing page
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SpeechifyAlternativePage from '../components/SpeechifyAlternativePage.vue'
import '../styles/globals.css'


const pinia = createPinia()

function initializePage() {
  const container = document.getElementById('app') || document.body

  // Remove the prerendered SEO snapshot before mounting (see scripts/prerender.mjs)
  document.getElementById('seo-prerender')?.remove()

  const app = createApp(SpeechifyAlternativePage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage)
} else {
  initializePage()
}

export { initializePage }
