<template>
  <footer class="py-12 mt-8 border-t border-gray-100 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          <a href="/" class="text-gray-500 hover:text-gray-700 transition duration-300">Home</a>
          <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
          <a href="/demo" class="text-gray-500 hover:text-gray-700 transition duration-300">Demo</a>
          <a href="/speechify-alternative" class="text-gray-500 hover:text-gray-700 transition duration-300">Speechify Alternative</a>
          <a href="/unchonk-vs-speechify" class="text-gray-500 hover:text-gray-700 transition duration-300">unChonk vs Speechify</a>
          <a href="/text-to-speech-no-subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">No Subscription</a>
          <a href="/text-to-speech-for-students" class="text-gray-500 hover:text-gray-700 transition duration-300">For Students</a>
          <a href="/text-to-speech-for-dyslexia" class="text-gray-500 hover:text-gray-700 transition duration-300">For Dyslexia</a>
          <a href="/read-aloud-chrome-extension" class="text-gray-500 hover:text-gray-700 transition duration-300">Read Aloud Extension</a>
          <a href="/read-pdf-aloud" class="text-gray-500 hover:text-gray-700 transition duration-300">Read PDF Aloud</a>
          <a href="/read-your-writing-aloud" class="text-gray-500 hover:text-gray-700 transition duration-300">Read Writing Aloud</a>
          <a href="/privacy" class="text-gray-500 hover:text-gray-700 transition duration-300">Privacy</a>
        </nav>
        <p class="text-gray-600">
          &copy; {{ year }} unChonk™ by Chonky Heads. Text-to-Speech Solution.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{ year: number }>()
</script>
