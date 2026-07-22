<template>
  <div class="relative min-h-screen bg-white">
    <!-- Scroll-depth sentinels (analytics only) -->
    <div ref="scrollSentinels" aria-hidden="true" class="absolute inset-0 pointer-events-none">
      <span class="absolute top-1/4" data-depth="25"></span>
      <span class="absolute top-1/2" data-depth="50"></span>
      <span class="absolute top-3/4" data-depth="75"></span>
    </div>

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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">Chrome Extension</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Read Aloud Chrome Extension
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Listen to any webpage out loud while word highlighting follows along.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          Chrome has no built-in read aloud for the pages you actually read. unChonk adds it — a read aloud Chrome extension with natural AI voices and real-time word highlighting that works on articles, PDFs, and Google Docs.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="#demo" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See it in action</a>
        </div>
      </section>

      <!-- Interactive demo (real voice + word highlighting) -->
      <section id="demo" @play.capture="onDemoPlay">
        <ReaderHero />
      </section>

      <!-- The gap it fills -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Read aloud, built into your browser</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Your screen is where most of your reading happens — long articles, documentation, news, research. But Chrome can't read any of it to you. So the moment your eyes get tired or you want to multitask, you're stuck reading every word yourself. A read aloud extension closes that gap: it turns whatever is on the page into audio you can listen to.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          unChonk reads the page out loud with natural-sounding AI voices, and highlights each word as it speaks so your eyes can follow along instead of losing your place. You can speed it up, slow it down, and keep listening as you move between tabs.
        </p>
        <p class="text-gray-600 leading-relaxed">
          It's not limited to web pages either — the same extension reads PDFs and Google Docs aloud, so one tool covers nearly everything you read in the browser.
        </p>
      </section>

      <!-- Features -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">What the extension does</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Reads any webpage aloud</h3>
              <p class="text-gray-600">Open an article and press play — unChonk reads the page out loud in your browser.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Real-time word highlighting</h3>
              <p class="text-gray-600">Each word lights up as it's read, included on the free tier, so you never lose your place.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Reads PDFs and Google Docs too</h3>
              <p class="text-gray-600">The same extension handles PDFs and Google Docs, not just web pages.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">No subscription</h3>
              <p class="text-gray-600">Pay as you go with a free tier. Installs in seconds — no monthly fee to maintain.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">What is the unChonk read aloud Chrome extension?</h3>
            <p class="text-gray-600 leading-relaxed">unChonk is a Chrome extension that reads any webpage aloud with natural AI voices. It highlights each word as it reads so you can follow along, and it also reads PDFs and Google Docs. It installs in seconds and is pay as you go with a free tier.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Does Chrome have a built-in read aloud feature?</h3>
            <p class="text-gray-600 leading-relaxed">Chrome has no built-in read aloud for general web pages, which is why a dedicated extension is useful. unChonk adds read-aloud to Chrome with natural voices and synchronized word highlighting on any page you visit.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Is the read aloud extension free?</h3>
            <p class="text-gray-600 leading-relaxed">unChonk is pay as you go with a free tier, so there's no subscription. Word highlighting is included on the free tier, and you can install the extension and start listening in seconds.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Add read aloud to Chrome</h2>
          <p class="text-lg text-gray-600 mb-8">Install unChonk free and let any page read itself to you.</p>
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add unChonk to Chrome</a>
        </div>
      </section>
    </main>

    <SeoFooter :year="currentYear" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SeoFooter from './SeoFooter.vue'
import ReaderHero from './ReaderHero.vue'
import { fireAttributedConversion, CONVERSION_LABELS } from '@shared/utils/attribution'

const currentYear = computed(() => new Date().getFullYear())
const installUrl = 'https://chromewebstore.google.com/detail/unchonk-text-to-speech/ofnbgiiljbejpfnmjjnnbmpoiepkmkao'

// GA4 engagement events ride the existing Google tag on this page (see the
// gtag.js snippet in read-aloud-chrome-extension.html). trackEvent in
// @shared/utils/analytics is a no-op stub, so fire gtag directly.
function gtagEvent(name: string) {
  if (typeof window.gtag === 'function') window.gtag('event', name)
}

// demo_play: first time the on-page demo's audio starts (capture-phase listener
// on the #demo section catches the non-bubbling `play` event from ReaderHero).
let demoPlayed = false
function onDemoPlay() {
  if (demoPlayed) return
  demoPlayed = true
  gtagEvent('demo_play')
}

const scrollSentinels = ref<HTMLElement | null>(null)
let depthObserver: IntersectionObserver | null = null

onMounted(() => {
  gtagEvent('landing_page_view')

  // Scroll depth: fire once per sentinel (25/50/75% of page height).
  const targets = scrollSentinels.value?.querySelectorAll('[data-depth]')
  if (!targets?.length) return
  depthObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      gtagEvent(`scroll_depth_${(entry.target as HTMLElement).dataset.depth}`)
      depthObserver?.unobserve(entry.target)
    }
  })
  targets.forEach((t) => depthObserver!.observe(t))
})

onUnmounted(() => {
  depthObserver?.disconnect()
})
</script>
