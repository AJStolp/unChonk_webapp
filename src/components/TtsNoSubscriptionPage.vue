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
        <span class="inline-block bg-[#e0ece3] text-[#2d5a3f] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5">No subscription · Pay as you go</span>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Text to Speech With No Subscription
        </h1>
        <p class="text-xl text-gray-700 mb-4">
          Read any webpage aloud with premium voices — and never get charged a monthly fee again.
        </p>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          unChonk is the pay-as-you-go text-to-speech reader for your browser. Buy credits once, use them whenever you read, and skip the auto-renewing subscriptions that every other TTS app forces on you.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="installUrl" target="_blank" rel="noopener noreferrer" @click="fireAttributedConversion(CONVERSION_LABELS.WEBSTORE_CLICK)" class="px-8 py-4 bg-[#2d5a3f] text-white text-lg font-semibold rounded-xl hover:bg-[#1e4530] transition duration-300 shadow-lg hover:shadow-xl">Add to Chrome — Free</a>
          <a href="/subscription" class="px-8 py-4 bg-white text-[#2d5a3f] text-lg font-semibold rounded-xl border border-[#2d5a3f]/30 hover:border-[#2d5a3f] transition duration-300">See pay-as-you-go pricing</a>
        </div>
      </section>

      <!-- Why subscriptions are wrong for TTS -->
      <section class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why a subscription is the wrong model for text to speech</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Most people don't read aloud every single day. You might lean on text to speech heavily during exam week, a big research project, or a stretch of long work documents — and then barely touch it for a month. A subscription charges you the same whether you used it 200 times or not at all. Over a year, that adds up to paying for a lot of silence.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          Subscriptions also create friction you didn't ask for: free trials that quietly convert, annual plans that auto-renew, and the small chore of remembering to cancel. unChonk removes all of that. There is no recurring charge to forget about, because there is no recurring charge at all.
        </p>
        <p class="text-gray-600 leading-relaxed">
          You buy credits, and the credits are yours. Read a hundred pages this week and nothing next month — you only ever spend on the text you actually convert to speech.
        </p>
      </section>

      <!-- How pay-as-you-go works -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">How pay-as-you-go text to speech works</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div class="text-2xl font-bold text-[#2d5a3f] mb-3">1</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Install free</h3>
              <p class="text-gray-600">Add the unChonk Chrome extension and start reading webpages aloud right away — no card required to begin.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div class="text-2xl font-bold text-[#2d5a3f] mb-3">2</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Top up credits</h3>
              <p class="text-gray-600">When you want premium neural voices, buy a one-time pack of credits. No plan, no monthly bill, no commitment.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div class="text-2xl font-bold text-[#2d5a3f] mb-3">3</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Spend only when you read</h3>
              <p class="text-gray-600">Each read draws from your balance based on the characters you convert. Read less, spend less — it's that simple.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- What you still get -->
      <section class="max-w-4xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Everything you'd expect — minus the monthly bill</h2>
        <p class="text-gray-600 leading-relaxed mb-8">
          Dropping the subscription doesn't mean dropping features. unChonk reads any webpage, article, or PDF aloud with natural-sounding premium voices, follows along with real-time word and sentence highlighting, and lets you control voice, speed, and highlight colors to match how you read best.
        </p>
        <ul class="space-y-3 text-gray-700">
          <li class="flex gap-3"><span class="text-[#2d5a3f] font-bold">✓</span> Premium, natural-sounding neural voices</li>
          <li class="flex gap-3"><span class="text-[#2d5a3f] font-bold">✓</span> Real-time word and sentence highlighting</li>
          <li class="flex gap-3"><span class="text-[#2d5a3f] font-bold">✓</span> Reads webpages, articles, and PDFs in your browser</li>
          <li class="flex gap-3"><span class="text-[#2d5a3f] font-bold">✓</span> Adjustable speed and customizable highlight colors</li>
          <li class="flex gap-3"><span class="text-[#2d5a3f] font-bold">✓</span> Pay-as-you-go credits — no subscription, ever</li>
        </ul>
        <p class="text-gray-600 leading-relaxed mt-8">
          Comparing options? See how the pricing stacks up on our <a href="/unchonk-vs-speechify" class="text-[#2d5a3f] underline font-medium">unChonk vs Speechify</a> comparison, or read why people switch on the <a href="/speechify-alternative" class="text-[#2d5a3f] underline font-medium">Speechify alternative</a> page.
        </p>
      </section>

      <!-- FAQ -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Is there a text to speech with no subscription?</h3>
              <p class="text-gray-600 leading-relaxed">Yes. unChonk is pay-as-you-go. You buy credits once and use them to read text aloud — there is no monthly subscription, no auto-renewal, and no recurring charge. Your credits stay on your account until you use them.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">How does pay-as-you-go text to speech work?</h3>
              <p class="text-gray-600 leading-relaxed">You only pay for the characters you actually convert to speech. Top up a balance of credits, and each time unChonk reads text aloud it draws from that balance. When you read less, you spend less. There is no fixed monthly fee whether you use it or not.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Do unChonk credits expire?</h3>
              <p class="text-gray-600 leading-relaxed">Credit purchases are valid for 90 days from the date of purchase, so you have plenty of time to read at your own pace. There's still no recurring charge — you simply top up again whenever you need more. See the <a href="/subscription" class="text-[#2d5a3f] underline">pricing page</a> for current details.</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">How is this different from Speechify's subscription?</h3>
              <p class="text-gray-600 leading-relaxed">Speechify and most text-to-speech apps charge a recurring annual or monthly subscription. unChonk replaces that with one-time, pay-as-you-go credits — you are never locked into a plan and you never get charged for a month you didn't use.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Start reading aloud — no subscription required</h2>
        <p class="text-lg text-gray-600 mb-8">Install unChonk and only ever pay for what you read.</p>
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
