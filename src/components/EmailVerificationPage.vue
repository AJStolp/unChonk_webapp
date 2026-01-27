<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar (matching LandingPage) -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              ttsAudify
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-24">
      <!-- Loading State -->
      <div v-if="loading" class="max-w-md mx-auto p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#749076] mx-auto"></div>
        <p class="mt-4 text-gray-600">Verifying your email...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#e8eeee] mb-6">
            <svg class="h-8 w-8 text-[#749076]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h1>
          <p class="text-gray-600 mb-6">Your email has been successfully verified. Please open the Audify Extension to log in.</p>
          <p class="text-sm text-gray-500">
            Open your Chrome browser extensions and click on the Audify Extension to continue.
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <p class="text-sm text-gray-500">
            Please try registering again using the Audify Extension.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-50 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-600">
            &copy; {{ currentYear }} ttsAudify by Chonky Heads. Text-to-Speech Solution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getApiUrl } from '@/shared/config/environment'

const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

const currentYear = computed(() => new Date().getFullYear())

const verifyEmail = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (!token) {
    error.value = true
    errorMessage.value = 'Invalid verification link - missing token'
    return
  }

  loading.value = true

  try {
    const response = await fetch(getApiUrl(`/api/verify-email?token=${token}`))
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Verification failed')
    }

    loading.value = false
    success.value = true
  } catch (err) {
    loading.value = false
    error.value = true
    errorMessage.value = (err as Error).message
  }
}

onMounted(() => {
  verifyEmail()
})
</script>
