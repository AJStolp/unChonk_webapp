<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="max-w-md mx-auto p-6 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Verifying your email...</p>
      </div>

      <div v-else-if="success" class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-200">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-green-500 dark:text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Email Verified!</h1>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Your email has been successfully verified. Please open the Audify Extension to log in.</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Open your Chrome browser extensions and click on the Audify Extension to continue.
          </p>
        </div>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-200">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-red-500 dark:text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Verification Failed</h1>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ errorMessage }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Please try registering again using the Audify Extension.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApiUrl } from '@/shared/config/environment'

const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

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