<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Scale your TTS usage as you grow
        </p>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <span class="text-blue-600 dark:text-blue-400">ℹ️</span>
          <p class="text-sm font-medium text-blue-700 dark:text-blue-300">
            All purchases are valid for one year from date of purchase
          </p>
        </div>
      </div>

      <!-- Credit Slider Section -->
      <div v-if="sliderConfig" class="max-w-4xl mx-auto mb-12">
        <!-- Credit Display -->
        <div class="text-center mb-6">
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ selectedCredits.toLocaleString() }} credits
          </div>
          <div class="text-lg text-gray-600 dark:text-gray-400">
            {{ (selectedCredits * sliderConfig.characters_per_credit).toLocaleString() }} characters
            <span class="mx-2">•</span>
            <span class="font-semibold" :class="currentTier === 'Pro' ? 'text-amber-500' : 'text-purple-500'">
              {{ currentTier }} Tier
            </span>
          </div>
        </div>

        <!-- Slider -->
        <div class="mb-6 px-4">
          <input
            type="range"
            v-model.number="selectedCredits"
            :min="sliderConfig.min"
            :max="sliderConfig.max"
            :step="100"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{{ sliderConfig.min.toLocaleString() }}</span>
            <span>{{ sliderConfig.max.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Preset Package Buttons -->
        <div v-if="packages.length > 0" class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <button
            v-for="pkg in packages"
            :key="pkg.credits"
            @click="selectedCredits = pkg.credits"
            :class="[
              'p-3 rounded-lg border-2 transition',
              selectedCredits === pkg.credits
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
            ]"
          >
            <div class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ (pkg.credits / 1000).toFixed(0) }}K
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              ${{ pkg.price.toFixed(2) }}
            </div>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !sliderConfig" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Loading pricing options...</p>
      </div>

      <!-- Error State -->
      <div v-if="error && !sliderConfig" class="max-w-md mx-auto text-center py-12">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          <button
            @click="fetchCreditPackages"
            class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- 4-Tier Grid -->
      <div v-if="sliderConfig" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">

        <!-- FREE TIER -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 flex flex-col h-full">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
            <p class="text-gray-600 dark:text-gray-400">Forever free</p>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Browser TTS
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Basic voices
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Highlighting
            </li>
          </ul>

          <button
            class="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg mt-auto cursor-not-allowed"
            disabled
          >
            Current Plan
          </button>
        </div>

        <!-- LIGHT TIER (NEW) -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 relative flex flex-col h-full"
          :class="[
            currentTier === 'Light' ? 'border-blue-500 transform hover:scale-105 transition' : 'border-gray-300 dark:border-gray-600',
            isLightDisabled ? 'opacity-60' : ''
          ]"
        >
          <div v-if="currentTier === 'Light'" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Selected
            </span>
          </div>

          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Light</h3>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${{ lightTierPrice.toFixed(2) }}
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ lightTierCredits.toLocaleString() }} credits
            </p>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              {{ (lightTierCredits * (sliderConfig?.characters_per_credit || 1000)).toLocaleString() }} characters
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Approx. {{ Math.round((lightTierCredits * (sliderConfig?.characters_per_credit || 1000)) / 750 / 60) }} hours of audio
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Standard voices
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Word highlighting
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Best for casual use
            </li>
          </ul>

          <button
            v-if="!isLightDisabled"
            @click="handlePurchase"
            :disabled="loading"
            class="w-full p-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg hover:from-blue-500 hover:to-cyan-600 transition shadow-lg mt-auto"
            :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Purchase Credits</span>
          </button>

          <div v-else class="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg mt-auto text-center text-sm">
            {{ currentTier === 'Premium' ? 'Select 500-1,999 for Light' : 'Use Premium or Pro tier' }}
          </div>
        </div>

        <!-- PREMIUM TIER -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 relative flex flex-col h-full"
          :class="[
            currentTier === 'Premium' ? 'border-purple-500 transform hover:scale-105 transition' : 'border-gray-300 dark:border-gray-600',
            isPremiumDisabled ? 'opacity-60' : ''
          ]"
        >
          <div v-if="currentTier === 'Premium'" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Selected
            </span>
          </div>

          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${{ premiumTierPrice.toFixed(2) }}
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ premiumTierCredits.toLocaleString() }} credits
            </p>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              {{ (premiumTierCredits * (sliderConfig?.characters_per_credit || 1000)).toLocaleString() }} characters
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Approx. {{ Math.round((premiumTierCredits * (sliderConfig?.characters_per_credit || 1000)) / 750 / 60) }} hours of audio
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Standard voices
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Word highlighting
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Best for regular use
            </li>
          </ul>

          <button
            v-if="!isPremiumDisabled"
            @click="handlePurchase"
            :disabled="loading"
            class="w-full p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition shadow-lg mt-auto"
            :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Purchase Credits</span>
          </button>

          <div v-else class="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg mt-auto text-center text-sm">
            {{ currentTier === 'Pro' ? 'Use Pro tier for 10,000+' : 'Select 2,000-9,999 for Premium' }}
          </div>
        </div>

        <!-- PRO TIER -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 relative flex flex-col h-full"
          :class="[
            currentTier === 'Pro' ? 'border-amber-500 transform hover:scale-105 transition' : 'border-gray-300 dark:border-gray-600',
            isProDisabled ? 'opacity-60' : ''
          ]"
        >
          <div v-if="currentTier === 'Pro'" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Best Value
            </span>
          </div>

          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${{ proTierPrice.toFixed(2) }}
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ proTierCredits.toLocaleString() }} credits
            </p>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              {{ (proTierCredits * (sliderConfig?.characters_per_credit || 1000)).toLocaleString() }} characters
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Approx. {{ Math.round((proTierCredits * (sliderConfig?.characters_per_credit || 1000)) / 750 / 60) }} hours of audio
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Standard + Neural voices
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Highest credit amounts
            </li>
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span class="text-green-500 mr-2">✓</span>
              Best for power users
            </li>
          </ul>

          <button
            v-if="!isProDisabled"
            @click="handlePurchase"
            :disabled="loading"
            class="w-full p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition shadow-lg mt-auto"
            :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Purchase Credits</span>
          </button>

          <div v-else class="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg mt-auto text-center text-sm">
            Select 10,000+ credits for Pro
          </div>
        </div>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-12">
        <a href="/pages/index.html" class="text-purple-500 hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { trackEvent, ANALYTICS_EVENTS } from '@shared/utils/analytics'

// API calls use relative URLs - Vite proxy forwards /api to backend

// Types
interface CreditPackage {
  credits: number
  tier: string
  price: number
  characters: number
  rate: number
  description: string
}

interface SliderConfig {
  min: number
  max: number
  premium_threshold: number
  pro_threshold: number
  premium_rate: number
  pro_rate: number
  characters_per_credit: number
}

// State
const selectedCredits = ref(500) // Updated default to new minimum
const packages = ref<CreditPackage[]>([])
const sliderConfig = ref<SliderConfig | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const calculatedPrice = computed(() => {
  if (!sliderConfig.value) return 0

  const credits = selectedCredits.value
  const config = sliderConfig.value

  // All tiers use the same rate: $0.007/credit (no volume discount)
  if (credits >= 500) {
    return credits * config.premium_rate
  }
  return 0
})

const currentTier = computed(() => {
  if (!sliderConfig.value) return 'Free'

  const credits = selectedCredits.value

  // Pro tier: 10,000+ credits
  if (credits >= 10000) {
    return 'Pro'
  }
  // Premium tier: 2,000-9,999 credits
  else if (credits >= 2000) {
    return 'Premium'
  }
  // Light tier: 500-1,999 credits
  else if (credits >= 500) {
    return 'Light'
  }
  // Free tier: < 500 credits
  return 'Free'
})

const isLightDisabled = computed(() => {
  return currentTier.value === 'Premium' || currentTier.value === 'Pro'
})

const isPremiumDisabled = computed(() => {
  return currentTier.value === 'Pro' || currentTier.value === 'Light'
})

const isProDisabled = computed(() => {
  return currentTier.value === 'Light' || currentTier.value === 'Premium'
})

// Computed properties for tier-specific pricing
const lightTierPrice = computed(() => {
  if (!sliderConfig.value) return 0

  const config = sliderConfig.value
  const credits = selectedCredits.value

  // Light tier range: 500-1,999 credits
  if (credits >= 500 && credits < 2000) {
    // Within range - show current slider value price
    return credits * config.premium_rate
  } else if (credits >= 2000) {
    // Above Light tier - show max price (1,999 credits)
    return 1999 * config.premium_rate
  }

  // Below Light tier - show min price
  return 500 * config.premium_rate
})

const premiumTierPrice = computed(() => {
  if (!sliderConfig.value) return 0

  const config = sliderConfig.value
  const credits = selectedCredits.value

  // Premium tier range: 2,000-9,999 credits
  if (credits >= 2000 && credits < 10000) {
    // Within range - show current slider value price
    return credits * config.premium_rate
  } else if (credits >= 10000) {
    // Above Premium tier - show max price (9,999 credits)
    return 9999 * config.premium_rate
  }

  // Below Premium tier - show min price
  return 2000 * config.premium_rate
})

const proTierPrice = computed(() => {
  if (!sliderConfig.value) return 0

  const config = sliderConfig.value
  const credits = selectedCredits.value

  // Pro tier range: 10,000+ credits
  if (credits >= 10000) {
    // Show current slider value price (same rate as other tiers)
    return credits * config.premium_rate
  }

  // Outside Pro tier range - show min price (same rate as other tiers)
  return 10000 * config.premium_rate
})

// Computed properties for tier-specific credit display
const lightTierCredits = computed(() => {
  const credits = selectedCredits.value
  // Light tier range: 500-1,999
  if (credits >= 500 && credits < 2000) {
    return credits // Within range
  } else if (credits >= 2000) {
    return 1999 // Above range - show max
  }
  return 500 // Below range - show min
})

const premiumTierCredits = computed(() => {
  const credits = selectedCredits.value
  // Premium tier range: 2,000-9,999
  if (credits >= 2000 && credits < 10000) {
    return credits // Within range
  } else if (credits >= 10000) {
    return 9999 // Above range - show max
  }
  return 2000 // Below range - show min
})

const proTierCredits = computed(() => {
  const credits = selectedCredits.value
  // Pro tier range: 10,000+
  if (credits >= 10000) {
    return credits
  }
  return 10000 // Show minimum
})

// Fetch credit packages and slider config
const fetchCreditPackages = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/credit-packages')

    if (!response.ok) {
      throw new Error(`Failed to fetch credit packages: ${response.statusText}`)
    }

    const data = await response.json()

    packages.value = data.packages || []
    sliderConfig.value = data.slider_config || null

    // Set initial selected credits to minimum
    if (sliderConfig.value) {
      selectedCredits.value = sliderConfig.value.min
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load pricing data'
    console.error('[Subscription Page] Error fetching credit packages:', err)
  } finally {
    loading.value = false
  }
}

// Handle credit purchase
const handlePurchase = async () => {
  loading.value = true
  error.value = null

  // Track purchase initiation
  trackEvent(ANALYTICS_EVENTS.CREDIT_PURCHASE_INITIATED, {
    credits: selectedCredits.value,
    tier: currentTier.value,
    price: calculatedPrice.value,
  })

  try {
    const response = await fetch('/api/create-credit-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credits: selectedCredits.value
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to create checkout: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.url) {
      // Redirect to Stripe checkout
      window.location.href = data.url
    } else {
      throw new Error('No checkout URL returned')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create checkout'
    console.error('[Subscription Page] Error creating checkout:', err)

    // Track purchase failure
    trackEvent(ANALYTICS_EVENTS.CREDIT_PURCHASE_FAILED, {
      credits: selectedCredits.value,
      tier: currentTier.value,
      error: error.value,
    })

    alert(`Error: ${error.value}`)
  } finally {
    loading.value = false
  }
}

const handleUpgrade = async (tier: 'premium' | 'pro', cycle: 'monthly' | 'yearly') => {
  alert(`Legacy upgrade flow - please use the credit slider above`)
}

// Track tier changes when user adjusts slider
watch(currentTier, (newTier, oldTier) => {
  if (oldTier && newTier !== oldTier) {
    trackEvent(ANALYTICS_EVENTS.TIER_SELECTED, {
      tier: newTier,
      credits: selectedCredits.value,
      price: calculatedPrice.value,
    })
  }
})

// Initialize on mount
onMounted(() => {
  // Track subscription page view
  trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_VIEW)

  fetchCreditPackages()
})
</script>
