<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a href="/" class="text-xl font-bold text-gray-900">unChonk™</a>
          <div class="flex items-center gap-4">
            <a href="/subscription" class="text-gray-700 hover:text-gray-900 font-medium transition duration-300">Pricing</a>
            <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-6 py-2 bg-[#2d5a3f] text-white font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-md hover:shadow-lg">Add to Chrome</a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <!-- Hero -->
      <section class="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">For students</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Text to Speech for Students
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Turn textbooks, PDFs, and articles into audio — and follow along with word highlighting as you listen.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          unChonk reads your course material aloud right in the browser so you can study faster, retain more, and get through dense readings without burning out. Pay-as-you-go, so it fits a student budget and a seasonal workload.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="/text-to-speech-no-subscription" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded-xl border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">Why no subscription</a>
        </div>
      </section>

      <!-- How it helps students -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Study smarter by listening</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Long textbooks and research papers are a slog when you only read them. Listening while the text is highlighted engages two senses at once, which helps you stay focused on dense material and remember more of it. It also lets you review notes hands-free — on a walk, on the bus, or while you handle other tasks — so study time fits into the gaps in your day.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Because unChonk highlights each sentence as it reads, you won't lose your place in a wall of text or re-read the same paragraph three times. You move through the reading at a steady pace and keep your momentum.
        </p>
      </section>

      <!-- Use cases -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Made for real coursework</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Textbooks &amp; PDFs</h3>
              <p class="text-gray-600">Listen to assigned readings and PDF chapters without copy-pasting into another app.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Research papers</h3>
              <p class="text-gray-600">Get through long journal articles faster while following the highlighted text.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Revision &amp; review</h3>
              <p class="text-gray-600">Re-listen to notes and summaries hands-free to reinforce what you've studied.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Budget angle -->
      <section class="max-w-4xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Priced for a student schedule</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Student reading isn't constant — it spikes around midterms and finals and goes quiet over breaks. A year-round subscription keeps charging through all of it. unChonk is pay-as-you-go: you buy credits and only spend them when you actually read, so you're not paying during the weeks you're not studying.
        </p>
        <p class="text-gray-600 leading-relaxed">
          See how the credits work on the <a href="/text-to-speech-no-subscription" class="text-[#2d5a3f] underline font-medium">no-subscription page</a>, or check current packs on <a href="/subscription" class="text-[#2d5a3f] underline font-medium">pricing</a>.
        </p>
      </section>

      <!-- FAQ -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">How can text to speech help students study?</h3>
              <p class="text-gray-600 leading-relaxed">Text to speech lets students listen to readings while following the highlighted text, which reinforces comprehension and helps with retention. It is useful for getting through long textbooks and research papers, reviewing notes hands-free, and studying while commuting or multitasking.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Can unChonk read PDFs and articles aloud?</h3>
              <p class="text-gray-600 leading-relaxed">Yes. unChonk reads webpages, online articles, and PDFs aloud directly in your browser with natural voices and synchronized word highlighting, so there is no copying and pasting into a separate app.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Is there an affordable text to speech for students?</h3>
              <p class="text-gray-600 leading-relaxed">unChonk is pay-as-you-go, which suits student budgets and seasonal workloads. Instead of paying a year-round subscription, you buy credits and spend them only when you read, so you are not paying during breaks or light weeks.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Study by listening</h2>
        <p class="text-lg text-gray-600 mb-8">Install unChonk free and turn your reading list into audio.</p>
        <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add unChonk to Chrome</a>
      </section>
    </main>

    <SeoFooter :year="currentYear" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeoFooter from './SeoFooter.vue'
import { fireAttributedConversion, CONVERSION_LABELS } from '@shared/utils/attribution'

const currentYear = computed(() => new Date().getFullYear())
const installUrl = 'https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao'
</script>
