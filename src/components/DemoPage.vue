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
            <a
              href="/sign-in"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <!-- Interactive read-aloud demo (real voice + word highlighting) -->
      <ReaderHero />
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
import ReaderHero from './ReaderHero.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
