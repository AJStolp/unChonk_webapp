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
            <a
              href="https://chromewebstore.google.com/detail/tts-audify-enterprise-tex/mbblkelaeinpifdgjcbnojnhdmmpjfdd"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Report Page Content -->
    <main class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Report a Bug</h1>
      <p class="text-gray-600 mb-8">Help us improve unChonk by reporting issues or checking known bugs.</p>

      <!-- Report Bug Section -->
      <section class="mb-12">
        <div class="bg-gradient-to-br from-[#f0f5f0] to-[#e8eeee] rounded-2xl p-8 border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Found a Bug?</h2>
          <p class="text-gray-700 mb-6">
            We appreciate your help in making unChonk better! If you've encountered an issue, please let us know by emailing us with the following details:
          </p>

          <div class="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">What to Include:</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Description:</strong> What happened vs. what you expected</li>
              <li><strong>Steps to reproduce:</strong> How can we recreate the issue?</li>
              <li><strong>URL:</strong> The website where the issue occurred</li>
              <li><strong>Browser & version:</strong> e.g., Chrome 120</li>
              <li><strong>Extension version:</strong> Found in the extension popup</li>
              <li><strong>Screenshots or recordings:</strong> If applicable</li>
            </ul>
          </div>

          <a
            href="mailto:ttsunchonk@gmail.com?subject=Bug Report: [Brief Description]"
            class="inline-flex items-center px-6 py-3 bg-[#749076] text-white font-semibold rounded-xl hover:bg-[#5f7760] transition duration-300"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Bug Report
          </a>
        </div>
      </section>

      <!-- Known Bugs Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Known Issues</h2>
        <p class="text-gray-600 mb-6">
          We're actively working on fixing these issues. Check back for updates!
        </p>

        <div class="space-y-4">
          <!-- Bug Item -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                  <span class="text-gray-500 text-sm">Extension</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Content shift when PlayHere widget is called</h3>
                <p class="text-gray-600 text-sm">
                  Page content may shift when the PlayHere widget is activated. We're working on a fix to prevent layout shifts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Requests Section -->
      <section class="mb-12">
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Have a Feature Request?</h2>
          <p class="text-gray-700 mb-4">
            We love hearing your ideas! While this page focuses on bug reports, we also welcome suggestions for new features or improvements.
          </p>
          <a
            href="mailto:ttsunchonk@gmail.com?subject=Feature Request: [Brief Description]"
            class="inline-flex items-center text-[#749076] hover:text-[#5f7760] font-medium transition duration-300"
          >
            Send a feature request
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      <!-- Back Link -->
      <div class="text-center mt-12">
        <a href="/" class="text-gray-700 hover:text-gray-900 hover:underline font-medium">
          &larr; Back to Home
        </a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <nav class="flex justify-center gap-6 mb-4">
            <a href="/" class="text-gray-500 hover:text-gray-700 transition duration-300">Home</a>
            <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
            <a href="/privacy" class="text-gray-500 hover:text-gray-700 transition duration-300">Privacy</a>
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
