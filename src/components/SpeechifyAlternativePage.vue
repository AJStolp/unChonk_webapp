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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">Speechify alternative</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          The Speechify Alternative With No Subscription
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Premium voices and word highlighting to read any webpage aloud — pay-as-you-go instead of a yearly plan.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          If you love what Speechify does but not the recurring bill, unChonk is built for you. Same core experience — natural read-aloud with real-time highlighting — without locking you into a subscription.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Try unChonk — Free</a>
          <a href="/unchonk-vs-speechify" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See the full comparison</a>
        </div>
      </section>

      <!-- Why look for an alternative -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why people look for a Speechify alternative</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Speechify popularized listening to anything, and it's a capable product. But the most common reason people search for an alternative is simple: the pricing. A premium text-to-speech subscription is a recurring cost that keeps charging whether you read a lot or barely at all. For students, occasional readers, and anyone with seasonal workloads, that math rarely works out.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Others want something lighter and more focused — a reader that lives in the browser, reads the page in front of them with clear highlighting, and doesn't try to be an entire productivity suite. unChonk is exactly that: a focused, browser-first read-aloud tool you pay for only when you use it.
        </p>
      </section>

      <!-- unChonk at a glance -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">unChonk at a glance</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Premium natural voices</h3>
              <p class="text-gray-600">Lifelike neural voices that make long reads comfortable to listen to.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Real-time word highlighting</h3>
              <p class="text-gray-600">Follow along as each word and sentence is read, with colors you can customize.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Reads webpages, articles &amp; PDFs</h3>
              <p class="text-gray-600">Listen to whatever is in front of you, right inside your browser — no copy-paste.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Pay-as-you-go, no subscription</h3>
              <p class="text-gray-600">Buy credits once and spend them only when you read. <a href="/text-to-speech-no-subscription" class="text-[#2d5a3f] underline">See how it works.</a></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick comparison -->
      <section class="max-w-4xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">unChonk vs Speechify at a glance</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="py-3 pr-4 text-gray-500 font-semibold"></th>
                <th class="py-3 px-4 text-[#2d5a3f] font-bold">unChonk</th>
                <th class="py-3 px-4 text-gray-700 font-bold">Speechify</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Pricing model</td><td class="py-3 px-4">Pay-as-you-go credits</td><td class="py-3 px-4">Recurring subscription</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Premium natural voices</td><td class="py-3 px-4">Yes</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Real-time highlighting</td><td class="py-3 px-4">Yes, customizable colors</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Reads webpages &amp; PDFs</td><td class="py-3 px-4">Yes, in-browser</td><td class="py-3 px-4">Yes</td></tr>
              <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Auto-renewal to cancel</td><td class="py-3 px-4">None</td><td class="py-3 px-4">Yes</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-3">Comparison reflects each product's pricing approach; check Speechify's site for their current plans and features.</p>
      </section>

      <!-- FAQ -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">What is the best Speechify alternative?</h3>
              <p class="text-gray-600 leading-relaxed">unChonk is a strong Speechify alternative for people who want to read any webpage aloud without committing to a subscription. It offers premium natural-sounding voices and real-time word highlighting, but charges pay-as-you-go credits instead of a recurring monthly or annual fee.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Is unChonk free like Speechify?</h3>
              <p class="text-gray-600 leading-relaxed">unChonk is free to install and lets you start reading without a subscription. Instead of locking premium voices behind a recurring plan, unChonk uses pay-as-you-go credits, so you only pay for the text you actually convert to speech.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Does unChonk have natural AI voices like Speechify?</h3>
              <p class="text-gray-600 leading-relaxed">Yes. unChonk provides premium, natural-sounding neural voices for lifelike read-aloud, plus real-time word and sentence highlighting so you can follow along as it reads.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Can I switch from Speechify to unChonk?</h3>
              <p class="text-gray-600 leading-relaxed">Yes. Install the unChonk Chrome extension, open any webpage, PDF, or article, and start listening. There is nothing to migrate — and no subscription to cancel later because unChonk never puts you on a recurring plan.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Give the no-subscription alternative a try</h2>
        <p class="text-lg text-gray-600 mb-8">Install unChonk free and read any page aloud in seconds.</p>
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
