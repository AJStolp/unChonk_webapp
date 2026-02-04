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
              href="https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao"
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

    <main>
      <!-- Header -->
      <div class="max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Text to Speech Online
        </h1>
        <p class="text-xl text-gray-600">
          See how unChonk helps real people read any webpage aloud
        </p>
      </div>

      <!-- Real People, Real Benefits Section -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-10">
          Real People, Real Benefits
        </h2>

        <div class="space-y-10">
          <!-- For Students -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span class="w-1 h-6 bg-purple-500 rounded-full"></span>
              For Students
            </h3>
            <p class="text-gray-600 leading-relaxed pl-4">
              Turn your textbooks into audiobooks. Study while you walk, exercise, or do chores. Listen to your lecture notes on the bus. Review that research paper while cooking dinner. Education doesn't have to be confined to a desk anymore. Your brain is always ready to learn—now your content can be always ready to teach.
            </p>
          </div>

          <!-- For Professionals -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
              For Professionals
            </h3>
            <p class="text-gray-600 leading-relaxed pl-4">
              Tackle that mountain of industry reports during your commute. Listen to documentation while you code. Keep up with the latest news and blog posts without sacrificing precious screen time. Your inbox might be overflowing, but your ears are wide open. Transform information overload into information opportunity.
            </p>
          </div>

          <!-- For Accessibility -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span class="w-1 h-6 bg-green-500 rounded-full"></span>
              For Accessibility
            </h3>
            <p class="text-gray-600 leading-relaxed pl-4">
              Visual impairments shouldn't limit access to information. Dyslexia doesn't have to slow you down. Eye strain and fatigue are no longer roadblocks. The web should be accessible to everyone, and text-to-speech technology is a powerful equalizer. We're committed to making content consumption effortless for all.
            </p>
          </div>

          <!-- For Language Learners -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <span class="w-1 h-6 bg-orange-500 rounded-full"></span>
              For Language Learners
            </h3>
            <p class="text-gray-600 leading-relaxed pl-4">
              Hear correct pronunciation in multiple languages. Follow along with the highlighting to connect written and spoken words. Adjust the speed to match your comprehension level. Language learning is all about input—and we're providing high-quality, controllable audio input whenever you need it.
            </p>
          </div>
        </div>
      </section>
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

<style scoped>
/* Additional custom styles if needed */
</style>
