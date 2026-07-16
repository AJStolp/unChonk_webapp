<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a href="/" class="text-xl font-bold text-gray-900">unChonk™</a>
          <div class="flex items-center gap-4">
            <a href="/subscription" class="text-gray-700 hover:text-gray-900 font-medium transition duration-300">Pricing</a>
            <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-6 py-2 bg-[#2d5a3f] text-white font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-md hover:shadow-lg">Add to Chrome</a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <!-- Hero -->
      <section class="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">PDF Reader</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Read Any PDF Aloud
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Turn dense PDFs into audio and listen while word highlighting follows along.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          unChonk reads PDFs out loud right in your browser with natural AI voices and real-time word highlighting — so you can get through reports, papers, and documents with your ears instead of your eyes.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="/demo" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See it in action</a>
        </div>
      </section>

      <!-- Why listen to PDFs -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Listen to PDFs instead of staring at them</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          PDFs are where the longest, densest reading tends to live — research papers, manuals, contracts, textbooks, reports. Reading them on screen is slow and tiring, and it's easy to lose your place in a wall of text. Listening changes that. When a natural voice reads the document to you, you can absorb it while your eyes rest, or follow along visually as each word is highlighted.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          unChonk reads the PDF out loud directly in your browser. There's no converting to another format and no copy-pasting page by page — open the document and press play. You control the speed, so you can slow down for the hard parts and speed up through the rest.
        </p>
        <p class="text-gray-600 leading-relaxed">
          The result is a faster, lower-effort way to get through PDFs: less eye strain, better focus, and more of your attention on the content.
        </p>
      </section>

      <!-- Features -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Built for reading PDFs by ear</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Reads PDFs in the browser</h3>
              <p class="text-gray-600">Open a PDF and press play — no uploads to a separate site, no format conversion.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Word highlighting as it reads</h3>
              <p class="text-gray-600">Each word lights up in sync with the audio so you never lose your place in a long document.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Natural AI voices</h3>
              <p class="text-gray-600">Clear, natural-sounding voices that are easy to listen to for long stretches.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Adjustable reading speed</h3>
              <p class="text-gray-600">Slow down for technical sections, speed up through the parts you already know.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Can unChonk read a PDF aloud?</h3>
            <p class="text-gray-600 leading-relaxed">Yes. unChonk opens your PDF in the browser and reads it out loud with natural AI voices. Each word is highlighted as it's spoken, so you can follow along, and you can adjust the speed to whatever pace suits you.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Does it highlight words while reading a PDF?</h3>
            <p class="text-gray-600 leading-relaxed">It does. unChonk highlights each word and sentence in real time as it reads the PDF aloud, so your eyes can track the audio without losing your place. Word highlighting is included on the free tier.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Do I need a subscription to listen to PDFs?</h3>
            <p class="text-gray-600 leading-relaxed">No. unChonk is pay as you go with a free tier, so there's no monthly subscription. Install the Chrome extension, open a PDF, and start listening in seconds.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Stop reading PDFs. Start listening.</h2>
          <p class="text-lg text-gray-600 mb-8">Install unChonk free and let any PDF read itself to you.</p>
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add unChonk to Chrome</a>
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
