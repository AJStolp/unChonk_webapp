<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk™
            </a>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="/subscription"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Pricing
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-2xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Sign In</h1>
        <p class="text-lg text-gray-600">
          Sign in to your unChonk account.
        </p>
      </div>

      <!-- Loading state during OAuth callback -->
      <div v-if="isProcessingOAuth" class="text-center py-12">
        <div class="w-8 h-8 border-[3px] border-[#2d5a3f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Signing you in with Google...</p>
      </div>

      <!-- Authenticated state -->
      <div v-else-if="authStore.isAuthenticated" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
          <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">You're signed in!</h2>
          <p class="text-gray-600 mb-6">
            Open the unChonk Chrome extension to start using text-to-speech. Your login will sync automatically.
          </p>
          <a
            href="chrome-extension://ofnbgiiljbejpfnmjjnnbmpoiepkmkao/pages/dashboard.html"
            class="inline-block px-6 py-3 bg-[#2d5a3f] text-white font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-md hover:shadow-lg"
          >
            Open Extension Dashboard
          </a>
        </div>
      </div>

      <!-- Sign-in options -->
      <div v-else class="space-y-6">
        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Google Sign In -->
        <div v-if="supabaseAvailable" class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Sign in with Google</h2>
            <button
              @click="handleGoogleSignIn"
              :disabled="isSigningIn"
              class="inline-flex items-center justify-center gap-3 w-full max-w-sm mx-auto px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span v-if="!isSigningIn">Continue with Google</span>
              <span v-else>Redirecting...</span>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-sm text-gray-500">or sign in via extension</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Extension detected: open sign-in directly -->
        <div v-if="extensionInstalled" class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e0ece3] text-[#2d5a3f] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Extension detected</h2>
              <p class="text-gray-600 mb-4">
                Your unChonk extension is installed. Open the sign-in page directly.
              </p>
              <a
                href="chrome-extension://ofnbgiiljbejpfnmjjnnbmpoiepkmkao/pages/login.html"
                class="inline-block px-6 py-3 bg-[#2d5a3f] text-white font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-md hover:shadow-lg"
              >
                Open Extension Sign In
              </a>
            </div>
          </div>
        </div>

        <!-- Extension not detected: link to Chrome Web Store -->
        <div v-else class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e0ece3] text-[#2d5a3f] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Get the extension</h2>
              <p class="text-gray-600 mb-4">
                Install the unChonk Chrome extension to get started with text-to-speech.
              </p>
              <a
                href="https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition duration-300"
              >
                Get the Chrome Extension
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Resend Verification -->
      <div v-if="!authStore.isAuthenticated && !isProcessingOAuth" class="mt-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-sm text-gray-500">need to verify your email?</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p class="text-sm text-gray-600 mb-3">
            If your verification email expired or you can't find it, enter your email to get a new one.
          </p>
          <div class="flex gap-2">
            <input
              v-model="resendEmail"
              type="email"
              placeholder="Your email address"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#2d5a3f]"
            />
            <button
              @click="handleResend"
              :disabled="resending || !resendEmail"
              class="px-4 py-2 bg-[#2d5a3f] text-white text-sm font-medium rounded-lg hover:bg-[#1e3d2a] disabled:bg-gray-300 transition-colors"
            >
              {{ resending ? 'Sending...' : 'Resend' }}
            </button>
          </div>
          <p v-if="resendSuccess" class="text-sm text-[#2d5a3f] mt-2 font-medium">Verification email sent! Check your inbox.</p>
          <p v-if="resendError" class="text-sm text-red-500 mt-2">{{ resendError }}</p>
        </div>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-12">
        <a href="/" class="text-gray-700 hover:text-gray-900 hover:underline font-medium">
          &larr; Back to Home
        </a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-12 mt-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <nav class="flex justify-center gap-6 mb-4">
            <a href="/" class="text-gray-500 hover:text-gray-700 transition duration-300">Home</a>
            <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
            <a href="/privacy" class="text-gray-500 hover:text-gray-700 transition duration-300">Privacy Policy</a>
            <a href="/roadmap" class="text-gray-500 hover:text-gray-700 transition duration-300">Roadmap</a>
            <a href="/status" class="text-gray-500 hover:text-gray-700 transition duration-300">Status</a>
          </nav>
          <p class="text-gray-600">
            &copy; {{ currentYear }} unChonk™ by Chonky Heads. Text-to-Speech Solution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../shared/stores/authStore'
import { supabase } from '../shared/utils/supabase'
import { getApiUrl } from '../shared/config/environment'

const authStore = useAuthStore()
const currentYear = computed(() => new Date().getFullYear())

const isProcessingOAuth = ref(false)
const isSigningIn = ref(false)
const errorMessage = ref('')
const supabaseAvailable = computed(() => !!supabase)
const extensionInstalled = ref(false)
const resendEmail = ref('')
const resending = ref(false)
const resendSuccess = ref(false)
const resendError = ref('')

// Check for OAuth callback on mount (Supabase puts tokens in URL hash after Google redirect)
onMounted(async () => {
  // Detect if the extension content script is injected
  extensionInstalled.value = document.documentElement.hasAttribute('data-tts-extension-injected')

  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    isProcessingOAuth.value = true
    errorMessage.value = ''

    try {
      const success = await authStore.handleOAuthCallback()
      if (!success) {
        errorMessage.value = 'Google sign-in failed. Please try again.'
      }
    } catch (error) {
      console.error('[SignInPage] OAuth callback error:', error)
      errorMessage.value = 'Something went wrong during sign-in. Please try again.'
    } finally {
      isProcessingOAuth.value = false
    }
  }
})

const handleResend = async () => {
  resending.value = true
  resendError.value = ''
  resendSuccess.value = false

  try {
    const response = await fetch(getApiUrl('/api/resend-verification'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resendEmail.value }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Failed to resend')
    }

    resendSuccess.value = true
  } catch (err) {
    resendError.value = (err as Error).message
  } finally {
    resending.value = false
  }
}

const handleGoogleSignIn = async () => {
  isSigningIn.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.loginWithGoogle()
    if (!result) {
      errorMessage.value = 'Failed to start Google sign-in. Please try again.'
      isSigningIn.value = false
    }
    // If successful, page will redirect to Google OAuth
  } catch (error) {
    console.error('[SignInPage] Google sign-in error:', error)
    errorMessage.value = 'Failed to start Google sign-in. Please try again.'
    isSigningIn.value = false
  }
}
</script>
