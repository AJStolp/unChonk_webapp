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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">Accessibility</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Text to Speech for Dyslexia
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Listen to any webpage while synchronized highlighting guides your eyes across the text.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          unChonk reads articles, PDFs, and web pages aloud with natural voices and real-time word highlighting — designed to reduce reading fatigue and help dyslexic readers focus and understand more.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="/demo" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded-xl border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See it in action</a>
        </div>
      </section>

      <!-- How it helps -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">How text to speech helps with dyslexia</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          For many people with dyslexia, the hardest part of reading isn't understanding ideas — it's decoding the words on the page. That decoding burns mental energy and causes fatigue, which makes long passages feel exhausting before you even reach the meaning. Text to speech shifts that load. When you listen instead of decode, your attention is free to focus on comprehension.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          The bigger benefit comes from pairing audio with visual tracking. When the word being spoken is highlighted as you hear it, your brain connects the sound to its written form. That multi-sensory reinforcement can support word recognition over time and keeps your place steady so you don't skip lines or re-read the same sentence.
        </p>
        <p class="text-gray-600 leading-relaxed">
          The result is reading that feels less like a struggle: less fatigue, better focus, and more of your energy spent on the content itself.
        </p>
      </section>

      <!-- Features for dyslexic readers -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Built to make reading easier</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Synchronized highlighting</h3>
              <p class="text-gray-600">Each word and sentence lights up as it's read, so your eyes always know where to look.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Customizable highlight colors</h3>
              <p class="text-gray-600">Choose the contrast that's most comfortable for you and reduces visual strain.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Adjustable reading speed</h3>
              <p class="text-gray-600">Slow things down to follow along, or speed up once you find your rhythm.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Works on any page</h3>
              <p class="text-gray-600">Read articles, assignments, and PDFs right in your browser — no copy-paste needed.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">How does text to speech help with dyslexia?</h3>
            <p class="text-gray-600 leading-relaxed">Text to speech lets dyslexic readers listen to content instead of decoding every word, which reduces fatigue and frees up mental energy for understanding. Pairing audio with synchronized highlighting connects the spoken word to the written one, which can improve focus, word recognition, and comprehension.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Does unChonk highlight words as it reads?</h3>
            <p class="text-gray-600 leading-relaxed">Yes. unChonk highlights each word and sentence in real time as it reads aloud, so your eyes can follow along without losing your place. You can also customize the highlight color for the contrast that works best for you.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Is unChonk good for dyslexic students and readers?</h3>
            <p class="text-gray-600 leading-relaxed">unChonk is well suited to dyslexic readers because it reads any webpage, article, or PDF aloud with natural voices, adjustable speed, and word highlighting. It installs as a Chrome extension and is pay-as-you-go, so there is no subscription to maintain.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Make reading less of a struggle</h2>
          <p class="text-lg text-gray-600 mb-8">Install unChonk free and let any page read itself to you.</p>
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add unChonk to Chrome</a>
        </div>
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
