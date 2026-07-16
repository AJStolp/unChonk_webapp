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

      <div class="space-y-6">
        <!-- Already have the extension: sign in directly -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e0ece3] text-[#2d5a3f] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Already have the extension?</h2>
              <p class="text-gray-600 mb-4">
                Sign in directly through the unChonk extension. Supports Google sign in and email login.
              </p>
              <a
                href="chrome-extension://ofnbgiiljbejpfnmjjnnbmpoiepkmkao/pages/login.html"
                class="inline-block px-6 py-3 bg-[#2d5a3f] text-white font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-md hover:shadow-lg"
              >
                Open Extension Sign In
              </a>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-sm text-gray-500">new to unChonk?</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- New user: get the extension first -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
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
                @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)"
                class="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition duration-300"
              >
                Get the Chrome Extension
              </a>
            </div>
          </div>
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
import { computed } from 'vue'
import { fireAttributedConversion, CONVERSION_LABELS } from '@shared/utils/attribution'

const currentYear = computed(() => new Date().getFullYear())
</script>
