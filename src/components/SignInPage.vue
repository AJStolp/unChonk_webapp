<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk
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
          Sign in to your unChonk account through the Chrome extension.
        </p>
      </div>

      <div class="space-y-6">
        <!-- Option 1: Already have the extension -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e8eeee] text-[#749076] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Already have the extension?</h2>
              <p class="text-gray-600 mb-4">
                Click the unChonk icon in your Chrome toolbar to open the sign-in page. Look for the puzzle piece icon
                <svg class="inline w-4 h-4 text-gray-500 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                in the top-right of Chrome, then click <strong>unChonk</strong>.
              </p>
              <a
                href="chrome-extension://ofnbgiiljbejpfnmjjnnbmpoiepkmkao/pages/login.html"
                class="inline-block px-6 py-3 bg-[#749076] text-[#070807] font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300 shadow-md hover:shadow-lg"
              >
                Open Extension Sign In
              </a>
              <p class="text-xs text-gray-400 mt-2">
                This link only works if you have the extension installed.
              </p>
            </div>
          </div>
        </div>

        <!-- Option 2: Need to install -->
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e8eeee] text-[#749076] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Don't have the extension yet?</h2>
              <p class="text-gray-600 mb-4">
                Install the unChonk Chrome extension first. After installing, the sign-in page will open automatically.
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

        <!-- Tip -->
        <div class="bg-[#e8eeee] rounded-xl p-4 text-center">
          <p class="text-sm text-gray-700">
            <strong>Tip:</strong> Bookmark the extension sign-in page so you can always find it easily.
          </p>
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
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
