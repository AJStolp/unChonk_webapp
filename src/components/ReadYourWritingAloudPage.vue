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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">Proofreading</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Hear Your Writing Read Aloud
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Catch the errors your eyes skip by listening to your own words read back.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          unChonk reads your essays, emails, and Google Docs out loud with natural AI voices and word highlighting — so typos, missing words, and clumsy sentences jump out the moment you hear them.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="/demo" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded-xl border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See it in action</a>
        </div>
      </section>

      <!-- Why listening catches errors -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why proofreading by ear works</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          When you read your own writing silently, you don't really read it — your brain replays what you meant to say and quietly fixes the page as it goes. That's why the typo you missed ten times is obvious to someone reading it for the first time. Your eyes are too close to the text to see it fresh.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          Listening breaks that autopilot. When a voice reads your words back exactly as written, a missing "the," a repeated word, or a sentence that runs on too long stops sounding fine and starts sounding wrong. You hear the rhythm of your writing, which is the fastest way to catch awkward phrasing before anyone else does.
        </p>
        <p class="text-gray-600 leading-relaxed">
          unChonk reads your draft aloud right where you write it — in a Google Doc or on the web — with word highlighting so you can see exactly which word it's on when something sounds off.
        </p>
      </section>

      <!-- Features -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">A second pair of ears for your drafts</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Reads Google Docs aloud</h3>
              <p class="text-gray-600">Hear your draft read back right in the doc where you're writing it.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Word highlighting</h3>
              <p class="text-gray-600">See exactly which word is being read, so you can spot the one that sounds wrong.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Natural AI voices</h3>
              <p class="text-gray-600">Clear voices that read your words as written, so mistakes don't slip past.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Adjustable speed</h3>
              <p class="text-gray-600">Slow it down for a careful final pass, or speed up to check the flow.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">How does listening help me proofread?</h3>
            <p class="text-gray-600 leading-relaxed">When you read your own writing silently, your brain fills in what you meant to write, so you skip right over typos, missing words, and clumsy sentences. Hearing it read aloud breaks that autopilot — awkward phrasing and mistakes stand out the moment you hear them.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Can unChonk read my Google Doc aloud?</h3>
            <p class="text-gray-600 leading-relaxed">Yes. unChonk reads Google Docs aloud along with web pages and other text, with natural AI voices and word highlighting so you can follow along as you listen for errors.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Will it read my essay out loud for free?</h3>
            <p class="text-gray-600 leading-relaxed">unChonk is pay as you go with a free tier, so you can start hearing your essays and writing read back without a subscription. Word highlighting is included on the free tier.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Hear it before you send it</h2>
          <p class="text-lg text-gray-600 mb-8">Install unChonk free and let your writing read itself back to you.</p>
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
