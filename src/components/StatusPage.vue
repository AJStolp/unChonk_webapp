<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk™
            </a>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="/subscription"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Pricing
            </a>
            <a
              href="/sign-in"
              class="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 pt-16 pb-16">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          System Status
        </h1>
        <p class="text-xl text-gray-600">
          Current status of unChonk services
        </p>
      </div>

      <!-- Overall Status Banner -->
      <div
        class="rounded-2xl border p-6 mb-10 text-center transition-all duration-500"
        :class="overallBannerClass"
      >
        <div class="flex items-center justify-center gap-3">
          <span class="relative flex h-4 w-4">
            <span
              v-if="overallStatus === 'operational'"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-4 w-4"
              :class="overallDotClass"
            ></span>
          </span>
          <span class="text-xl font-semibold" :class="overallTextClass">
            {{ overallLabel }}
          </span>
        </div>
        <p class="text-sm mt-2" :class="overallSubtextClass">
          Last checked: {{ lastCheckedFormatted }}
        </p>
      </div>

      <!-- Services List -->
      <div class="space-y-4 mb-16">
        <div
          v-for="service in services"
          :key="service.name"
          class="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50">
              <span class="text-lg">{{ service.icon }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-500">{{ service.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div v-if="isLoading && service.status === 'checking'" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-400">Checking...</span>
            </div>
            <span
              v-else
              class="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
              :class="statusBadgeClass(service.status)"
            >
              <span class="w-2 h-2 rounded-full" :class="statusDotClass(service.status)"></span>
              {{ statusLabel(service.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Auto-refresh note -->
      <div class="text-center mb-16">
        <p class="text-sm text-gray-400">
          Auto refreshes every 60 seconds
        </p>
        <button
          @click="checkStatus"
          :disabled="isLoading"
          class="mt-2 text-sm font-medium text-[#2d5a3f] hover:text-[#1e3d2a] disabled:text-gray-400 transition-colors"
        >
          {{ isLoading ? 'Checking...' : 'Refresh now' }}
        </button>
      </div>

      <!-- Changelog -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Changelog</h2>
        <div class="space-y-8">
          <div
            v-for="release in changelog"
            :key="release.version"
            class="relative pl-8 border-l-2"
            :class="release.emailSent ? 'border-[#2d5a3f]' : 'border-gray-200'"
          >
            <!-- Dot on timeline -->
            <div
              class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white"
              :class="release.emailSent ? 'bg-[#2d5a3f]' : 'bg-gray-300'"
            ></div>

            <!-- Version header -->
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">
                v{{ release.version }}
              </h3>
              <span class="text-sm text-gray-500">{{ release.date }}</span>
              <span
                v-if="release.emailSent"
                class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#e0ece3] text-[#2d5a3f]"
              >
                Users notified
              </span>
            </div>

            <!-- Changes -->
            <ul class="space-y-1.5 mb-3">
              <li
                v-for="(change, i) in release.changes"
                :key="i"
                class="text-sm text-gray-600 flex items-start gap-2"
              >
                <span class="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" :class="changeTypeColor(change.type)"></span>
                <span>{{ change.text }}</span>
              </li>
            </ul>

            <!-- Email summary if sent -->
            <div
              v-if="release.emailSent && release.emailSummary"
              class="bg-gray-50 rounded-lg p-3 text-sm text-gray-500"
            >
              <span class="font-medium text-gray-600">Email sent:</span> {{ release.emailSummary }}
            </div>
          </div>
        </div>
      </div>

      <!-- Email guidelines -->
      <div class="mt-16 p-6 rounded-2xl bg-gray-50 border border-gray-100">
        <h3 class="font-semibold text-gray-900 mb-3">When do we send emails?</h3>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium text-[#2d5a3f] mb-2">We notify users about:</p>
            <ul class="space-y-1 text-gray-600">
              <li>Bug fixes that affected usability</li>
              <li>New features users can try</li>
              <li>Resolved outages or downtime</li>
            </ul>
          </div>
          <div>
            <p class="font-medium text-gray-500 mb-2">We skip emails for:</p>
            <ul class="space-y-1 text-gray-600">
              <li>Internal refactors and code cleanup</li>
              <li>Analytics and tracking updates</li>
              <li>Minor UI polish</li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-12 mt-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <nav class="flex justify-center gap-6 mb-4">
            <a href="/" class="text-gray-500 hover:text-gray-700 transition duration-300">Home</a>
            <a href="/subscription" class="text-gray-500 hover:text-gray-700 transition duration-300">Pricing</a>
            <a href="/privacy" class="text-gray-500 hover:text-gray-700 transition duration-300">Privacy Policy</a>
            <a href="/roadmap" class="text-gray-500 hover:text-gray-700 transition duration-300">Roadmap</a>
          </nav>
          <p class="text-gray-600">
            &copy; {{ currentYear }} unChonk™ by Chonky Heads. Text-to-Speech Solution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { API_BASE_URL } from '../shared/config/environment'

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'checking'

interface Service {
  name: string
  description: string
  icon: string
  status: ServiceStatus
  key: string
}

interface ChangeEntry {
  type: 'fix' | 'feature' | 'improvement'
  text: string
}

interface Release {
  version: string
  date: string
  emailSent: boolean
  emailSummary?: string
  changes: ChangeEntry[]
}

const isLoading = ref(false)
const lastChecked = ref<Date | null>(null)
let refreshInterval: ReturnType<typeof setInterval> | null = null

const services = ref<Service[]>([
  {
    name: 'API Server',
    description: 'Core backend services and authentication',
    icon: '🖥',
    status: 'checking',
    key: 'api',
  },
  {
    name: 'Database',
    description: 'User data and account management',
    icon: '🗄',
    status: 'checking',
    key: 'database',
  },
  {
    name: 'AWS Polly',
    description: 'Premium text-to-speech voice engine',
    icon: '🔊',
    status: 'checking',
    key: 'aws_polly',
  },
  {
    name: 'Cloud Storage',
    description: 'Audio file storage and delivery',
    icon: '☁',
    status: 'checking',
    key: 'aws_s3',
  },
  {
    name: 'Website',
    description: 'unchonk.com web application',
    icon: '🌐',
    status: 'operational',
    key: 'website',
  },
])

const changelog = ref<Release[]>([
  {
    version: '3.0.2',
    date: 'March 18, 2026',
    emailSent: false,
    changes: [
      { type: 'improvement', text: 'Updated brand color to forest green across extension and webapp' },
      { type: 'improvement', text: 'Redesigned dashboard with clean white theme' },
      { type: 'feature', text: 'Added free tier usage tracking for analytics' },
      { type: 'improvement', text: 'Enhanced Google Ads conversion tracking with hashed email' },
      { type: 'improvement', text: 'Added TM branding to unChonk across all pages' },
    ],
  },
  {
    version: '3.0.1',
    date: 'March 18, 2026',
    emailSent: false,
    changes: [
      { type: 'feature', text: 'Added email/password login alongside Google OAuth' },
      { type: 'improvement', text: 'Server side GA4 event tracking for sign ups, purchases, and first usage' },
      { type: 'fix', text: 'Fixed Google Ads conversion tracking (switched from unreliable client side to server side)' },
    ],
  },
  {
    version: '2.2.9',
    date: 'March 16, 2026',
    emailSent: true,
    emailSummary: 'Notified all users about resolved service issues and that verification emails were working again.',
    changes: [
      { type: 'fix', text: 'Resolved AWS account suspension that caused service downtime' },
      { type: 'fix', text: 'Replaced dead Resend API key; verification emails working again' },
      { type: 'fix', text: 'Resent verification emails to stuck unverified users' },
    ],
  },
  {
    version: '2.2.0',
    date: 'February 10, 2026',
    emailSent: false,
    changes: [
      { type: 'fix', text: 'Fixed highlighting drift caused by AWS Polly byte offset mismatch' },
      { type: 'fix', text: 'Removed optimizeTextForTts that was causing text alignment issues' },
      { type: 'fix', text: 'Fixed cross element sentence highlighting with proper clipping' },
      { type: 'fix', text: 'Filtered out zero width rects that caused visual glitches' },
      { type: 'fix', text: 'Fixed content scoring false positives on header class names' },
      { type: 'fix', text: 'Fixed billing portal 500 error' },
    ],
  },
])

const currentYear = computed(() => new Date().getFullYear())

const overallStatus = computed<ServiceStatus>(() => {
  const statuses = services.value.map(s => s.status)
  if (statuses.some(s => s === 'checking')) return 'checking'
  if (statuses.every(s => s === 'operational')) return 'operational'
  if (statuses.some(s => s === 'down')) return 'down'
  return 'degraded'
})

const overallLabel = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return 'All Systems Operational'
    case 'degraded': return 'Partial Service Disruption'
    case 'down': return 'Major Service Disruption'
    case 'checking': return 'Checking Services...'
  }
})

const overallBannerClass = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return 'bg-green-50 border-green-200'
    case 'degraded': return 'bg-amber-50 border-amber-200'
    case 'down': return 'bg-red-50 border-red-200'
    case 'checking': return 'bg-gray-50 border-gray-200'
  }
})

const overallDotClass = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return 'bg-green-500'
    case 'degraded': return 'bg-amber-500'
    case 'down': return 'bg-red-500'
    case 'checking': return 'bg-gray-400'
  }
})

const overallTextClass = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return 'text-green-800'
    case 'degraded': return 'text-amber-800'
    case 'down': return 'text-red-800'
    case 'checking': return 'text-gray-600'
  }
})

const overallSubtextClass = computed(() => {
  switch (overallStatus.value) {
    case 'operational': return 'text-green-600'
    case 'degraded': return 'text-amber-600'
    case 'down': return 'text-red-600'
    case 'checking': return 'text-gray-400'
  }
})

const lastCheckedFormatted = computed(() => {
  if (!lastChecked.value) return 'Never'
  return lastChecked.value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

function statusBadgeClass(status: ServiceStatus): string {
  switch (status) {
    case 'operational': return 'bg-green-50 text-green-700'
    case 'degraded': return 'bg-amber-50 text-amber-700'
    case 'down': return 'bg-red-50 text-red-700'
    case 'checking': return 'bg-gray-50 text-gray-500'
  }
}

function statusDotClass(status: ServiceStatus): string {
  switch (status) {
    case 'operational': return 'bg-green-500'
    case 'degraded': return 'bg-amber-500'
    case 'down': return 'bg-red-500'
    case 'checking': return 'bg-gray-400'
  }
}

function statusLabel(status: ServiceStatus): string {
  switch (status) {
    case 'operational': return 'Operational'
    case 'degraded': return 'Degraded'
    case 'down': return 'Down'
    case 'checking': return 'Checking'
  }
}

function changeTypeColor(type: ChangeEntry['type']): string {
  switch (type) {
    case 'fix': return 'bg-red-400'
    case 'feature': return 'bg-[#2d5a3f]'
    case 'improvement': return 'bg-amber-400'
  }
}

function updateService(key: string, status: ServiceStatus) {
  const service = services.value.find(s => s.key === key)
  if (service) service.status = status
}

async function checkStatus() {
  isLoading.value = true

  updateService('website', 'operational')

  try {
    const apiUrl = API_BASE_URL === 'http://localhost:5000'
      ? 'https://api.unchonk.com'
      : API_BASE_URL

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${apiUrl}/api/health`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      updateService('api', 'down')
      updateService('database', 'down')
      updateService('aws_polly', 'down')
      updateService('aws_s3', 'down')
    } else {
      const data = await response.json()

      updateService('api', data.status === 'healthy' ? 'operational' : 'degraded')

      const dbStatus = data.services?.database
      if (dbStatus === 'healthy') updateService('database', 'operational')
      else if (dbStatus === 'degraded') updateService('database', 'degraded')
      else updateService('database', 'down')

      const pollyStatus = data.services?.aws_polly
      if (pollyStatus === 'healthy') updateService('aws_polly', 'operational')
      else if (pollyStatus === 'degraded') updateService('aws_polly', 'degraded')
      else updateService('aws_polly', 'down')

      const s3Status = data.services?.aws_s3
      if (s3Status === 'healthy') updateService('aws_s3', 'operational')
      else if (s3Status === 'degraded') updateService('aws_s3', 'degraded')
      else updateService('aws_s3', 'down')
    }
  } catch {
    updateService('api', 'down')
    updateService('database', 'down')
    updateService('aws_polly', 'down')
    updateService('aws_s3', 'down')
  }

  lastChecked.value = new Date()
  isLoading.value = false
}

onMounted(() => {
  checkStatus()
  refreshInterval = setInterval(checkStatus, 60000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
