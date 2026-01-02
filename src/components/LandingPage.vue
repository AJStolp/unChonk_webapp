<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Bar -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              ttsAudify
            </h1>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="/extension/pages/login.html"
              class="text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 font-medium transition duration-300"
            >
              Sign In
            </a>
            <a
              href="/pages/subscription.html"
              class="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300"
            >
              View Plans
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            ttsAudify
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Text-to-Speech with AWS Polly
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform any text into natural-sounding speech with advanced highlighting and premium voices
          </p>

          <!-- CTA Buttons -->
          <div class="flex justify-center">
            <a
              href="/pages/subscription.html"
              class="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Powerful Features
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Everything you need for professional text-to-speech
        </p>
      </div>

      <!-- Feature Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Premium Voices
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Access to AWS Polly's standard and neural voices for natural-sounding speech
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Word Highlighting
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Follow along with real-time word and sentence highlighting as text is read
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Custom Colors
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Personalize highlight colors for accessibility or your preferred style
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Customizable Settings
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Control voice, engine type, and playback preferences to suit your needs
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Usage Analytics
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Track your character usage and manage your credits with detailed analytics
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Browser Extension
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Seamlessly integrated Chrome extension for text-to-speech on any webpage
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl p-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join users who are transforming their reading experience with ttsAudify
        </p>
        <a
          href="/pages/subscription.html"
          class="inline-block px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg"
        >
          Get Started Now
        </a>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400">
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

onMounted(() => {
  // Track landing page view
  trackEvent(ANALYTICS_EVENTS.LANDING_PAGE_VIEW)
})
</script>
