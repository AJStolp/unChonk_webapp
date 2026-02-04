<template>
  <div class="min-h-screen bg-white relative overflow-hidden">
    <!-- Navigation Bar -->
    <nav class="relative z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex flex-col">
            <span class="text-xl font-bold text-gray-900">
              unChonk
            </span>
            <span class="text-xs text-gray-500 hidden sm:block">
              Just unChonk.it
            </span>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Sign In
            </a>
            <a
              href="/subscription"
              class="px-6 py-2 bg-[#749076] text-[#070807] font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 shadow-md hover:shadow-lg"
            >
              View Plans
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main>
    <!-- Hero Section -->
    <div class="relative bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Side -->
          <div class="text-left">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Text to Speech App for Your Browser
            </h1>
            <p class="text-xl md:text-2xl text-gray-700 mb-8">
              Natural-Sounding Text-to-Speech
            </p>
            <p class="text-lg text-gray-600 mb-12 leading-relaxed">
              Read any webpage aloud with premium voices. Real-time word highlighting, customizable playback, and natural-sounding speech right in your browser.
            </p>

            <!-- CTA Buttons -->
            <div class="flex gap-4">
              <a
                href="/subscription"
                class="px-8 py-4 bg-[#749076] text-[#070807] text-lg font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>
          </div>

          <!-- Right Side - Visual Element -->
          <div class="text-left lg:text-right relative">
            <div class="inline-block">
              <!-- Placeholder for illustration or product demo -->
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg class="block w-full h-40 md:h-48 lg:h-56" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style="display: block;">
          <path d="M0,120 L0,80 Q600,-20 1200,80 L1200,120 Z" fill="#f9fafb"></path>
        </svg>
      </div>
    </div>

    <!-- Features Section -->
    <div class="relative z-10 bg-gray-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Text-to-Speech Features
          </h2>
          <p class="text-lg text-gray-600">
            Everything you need to read aloud any webpage
          </p>
        </div>

        <!-- Feature Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Premium Voices
          </h3>
          <p class="text-gray-600">
            Access to premium natural-sounding voices for lifelike speech
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Word Highlighting
          </h3>
          <p class="text-gray-600">
            Follow along with real-time word and sentence highlighting as text is read
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Custom Colors
          </h3>
          <p class="text-gray-600">
            Personalize highlight colors for accessibility or your preferred style
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Customizable Settings
          </h3>
          <p class="text-gray-600">
            Control voice, engine type, and playback preferences to suit your needs
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Usage Analytics
          </h3>
          <p class="text-gray-600">
            Track your character usage and manage your credits with detailed analytics
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition duration-300">
          <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8eeee] text-[#749076] mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Chrome Extension
          </h3>
          <p class="text-gray-600">
            Read aloud any webpage with our Chrome extension. No copying and pasting needed
          </p>
        </div>
      </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="relative z-10 bg-gray-50 py-24 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center border border-gray-100">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join users who are transforming their reading experience with unChonk
          </p>
          <a
            href="/subscription"
            class="inline-block px-8 py-4 bg-[#749076] text-[#070807] text-lg font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
        </div>
      </div>

    </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <nav class="flex justify-center gap-6 mb-4">
            <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
            <a href="/privacy" class="text-gray-500 hover:text-gray-700 transition duration-300">Privacy Policy</a>
            <a href="/report" class="text-gray-500 hover:text-gray-700 transition duration-300">Report a Bug</a>
          </nav>
          <p class="text-gray-600">
            &copy; {{ currentYear }} unChonk by Chonky Heads. Text-to-Speech Solution.
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
