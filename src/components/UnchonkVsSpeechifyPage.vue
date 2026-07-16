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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">Comparison · 2026</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          unChonk vs Speechify
        </h1>
        <p class="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Both read the web aloud with natural voices and word highlighting. The real difference is how you pay — pay-as-you-go credits versus a recurring subscription.
        </p>
        <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Try unChonk — Free</a>
      </section>

      <!-- Comparison table -->
      <section class="max-w-4xl mx-auto px-4 py-8">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="py-3 pr-4 text-gray-500 font-semibold">Feature</th>
                <th class="py-3 px-4 text-[#2d5a3f] font-bold">unChonk</th>
                <th class="py-3 px-4 text-gray-700 font-bold">Speechify</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Pricing model</td><td class="py-3 px-4">Pay-as-you-go credits</td><td class="py-3 px-4">Recurring subscription</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Pay only when you read</td><td class="py-3 px-4">Yes</td><td class="py-3 px-4">No — billed regardless of use</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Premium natural voices</td><td class="py-3 px-4">Yes</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Real-time word highlighting</td><td class="py-3 px-4">Yes, customizable colors</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Reads webpages &amp; PDFs in-browser</td><td class="py-3 px-4">Yes</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Cross-language reading</td><td class="py-3 px-4">140+ languages</td><td class="py-3 px-4">60+ languages</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Subscription to cancel</td><td class="py-3 px-4">None</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Best for</td><td class="py-3 px-4">Occasional &amp; budget-conscious readers</td><td class="py-3 px-4">Heavy daily power users</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-3">Speechify's plans and feature set change over time — check speechify.com for their latest details. unChonk details reflect current functionality.</p>
      </section>

      <!-- Pricing deep dive -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Pricing: the deciding factor</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            Speechify follows the standard premium-TTS playbook: a recurring subscription that unlocks the best voices and bills you on a schedule. If you listen to long content every single day, a flat plan can make sense. But if your reading comes in bursts — a heavy exam week, a big report, then quiet stretches — you're paying through the quiet periods too.
          </p>
          <p class="text-gray-600 leading-relaxed">
            unChonk flips that. You buy credits once and spend them only as you read, so a light month costs almost nothing and there's no plan to cancel later. For most people who don't read aloud daily, pay-as-you-go simply costs less over a year. See exactly how it works on the <a href="/text-to-speech-no-subscription" class="text-[#2d5a3f] underline font-medium">no-subscription</a> page.
          </p>
        </div>
      </section>

      <!-- Where each fits -->
      <section class="max-w-4xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Which one should you choose?</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl shadow-sm p-8 border border-[#2d5a3f]/20">
            <h3 class="text-xl font-bold text-[#2d5a3f] mb-3">Choose unChonk if…</h3>
            <ul class="space-y-2 text-gray-700">
              <li>You don't read aloud every day</li>
              <li>You dislike subscriptions and auto-renewals</li>
              <li>You want a focused, browser-first reader</li>
              <li>You're a student or have seasonal workloads</li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Choose Speechify if…</h3>
            <ul class="space-y-2 text-gray-700">
              <li>You listen to long content daily</li>
              <li>You want a full cross-device productivity suite</li>
              <li>A flat monthly cost fits your usage</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Is unChonk cheaper than Speechify?</h3>
              <p class="text-gray-600 leading-relaxed">For most casual and moderate readers, yes. Speechify charges a recurring subscription whether or not you use it that month. unChonk uses pay-as-you-go credits, so if you read occasionally you only pay for what you convert to speech instead of an ongoing annual fee.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">What is the main difference between unChonk and Speechify?</h3>
              <p class="text-gray-600 leading-relaxed">The biggest difference is the pricing model. Speechify is subscription-based; unChonk is pay-as-you-go with no recurring charge. Both read webpages aloud with natural voices and word highlighting, but unChonk is built for people who don't want to be locked into a monthly or annual plan.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Do unChonk and Speechify both highlight words while reading?</h3>
              <p class="text-gray-600 leading-relaxed">Yes. Both offer real-time highlighting that tracks the words as they are read aloud, which helps with focus and comprehension. unChonk also lets you customize highlight colors.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Try the no-subscription option</h2>
        <p class="text-lg text-gray-600 mb-8">Install unChonk free and decide for yourself.</p>
        <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="inline-block px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add unChonk to Chrome</a>
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
