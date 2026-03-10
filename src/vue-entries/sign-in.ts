import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SignInPage from '../components/SignInPage.vue'
import { loadUmamiScript } from '../shared/utils/analytics'
import { captureAttribution } from '../shared/utils/attribution'
import '../styles/globals.css'

captureAttribution()
loadUmamiScript()

const pinia = createPinia()

function initializeSignInPage() {
  const container = document.getElementById('app') || document.body
  const app = createApp(SignInPage)
  app.use(pinia)
  app.mount(container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSignInPage)
} else {
  initializeSignInPage()
}

export { initializeSignInPage }
