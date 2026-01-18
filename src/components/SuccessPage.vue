<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar (matching LandingPage) -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/pages/index.html" class="text-xl font-bold text-gray-900">
              ttsAudify
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex items-center justify-center py-24">
      <div class="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 text-center">
        <div class="mb-6">
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#e8eeee] mb-6">
            <svg
              class="h-8 w-8 text-[#749076]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-3">
            Success!
          </h1>

          <p class="text-gray-600 mb-8">
            Your purchase has been processed successfully. Your credits are now available.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <a
            href="/pages/index.html"
            class="w-full inline-block px-6 py-3 bg-[#749076] text-[#070807] font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 text-center shadow-md hover:shadow-lg"
          >
            Back to Home
          </a>

          <p class="text-sm text-gray-500 mt-6">
            You can now use the Audify Extension in your Chrome browser.
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
import { onMounted, computed } from 'vue'
import { trackEvent, ANALYTICS_EVENTS } from '@shared/utils/analytics'

const currentYear = computed(() => new Date().getFullYear())

const token = localStorage.getItem('access_token')

const handlePostSubscriptionTasks = async () => {
  if (!token) {
    return
  }

  try {
    // Handle post-subscription tasks
  } catch (error) {
    console.error('Error in post-subscription tasks:', error)
  }
}


onMounted(() => {
  // Handle URL parameters (e.g., from Stripe)
  const urlParams = new URLSearchParams(window.location.search)
  const sessionId = urlParams.get('session_id')
  const paymentIntent = urlParams.get('payment_intent')

  // Track successful purchase
  trackEvent(ANALYTICS_EVENTS.CREDIT_PURCHASE_SUCCESS, {
    session_id: sessionId || 'unknown',
    payment_intent: paymentIntent || 'unknown',
  })

  if (sessionId) {
    // You could validate the session with your backend here
  }

  if (paymentIntent) {
  }

  handlePostSubscriptionTasks()
})
</script>
