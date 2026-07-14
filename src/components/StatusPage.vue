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

      <!-- Uptime Stats -->
      <div v-if="uptimeLoaded" class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center p-4 rounded-xl border border-gray-200">
          <p class="text-2xl font-bold" :class="uptimeColor(uptime['24h'])">{{ uptime['24h'] }}%</p>
          <p class="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>
        <div class="text-center p-4 rounded-xl border border-gray-200">
          <p class="text-2xl font-bold" :class="uptimeColor(uptime['7d'])">{{ uptime['7d'] }}%</p>
          <p class="text-xs text-gray-500 mt-1">Last 7 days</p>
        </div>
        <div class="text-center p-4 rounded-xl border border-gray-200">
          <p class="text-2xl font-bold" :class="uptimeColor(uptime['30d'])">{{ uptime['30d'] }}%</p>
          <p class="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <!-- Avg Response Time -->
      <div v-if="uptimeLoaded && avgResponseMs > 0" class="text-center mb-10">
        <p class="text-sm text-gray-400">
          Avg response time (24h): <span class="font-medium text-gray-600">{{ avgResponseMs }}ms</span>
        </p>
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
            <a href="/status" class="text-gray-500 hover:text-gray-700 transition duration-300">Status</a>
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

const isLoading = ref(false)
const lastChecked = ref<Date | null>(null)
const uptimeLoaded = ref(false)
const uptime = ref<Record<string, number>>({ '24h': 100, '7d': 100, '30d': 100 })
const avgResponseMs = ref(0)
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
    name: 'Speech API',
    description: 'Text-to-speech voice engine',
    icon: '🔊',
    status: 'checking',
    key: 'azure_speech',
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

function uptimeColor(pct: number): string {
  if (pct >= 99.5) return 'text-green-600'
  if (pct >= 95) return 'text-amber-600'
  return 'text-red-600'
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
      updateService('azure_speech', 'down')
      updateService('aws_s3', 'down')
    } else {
      const data = await response.json()

      updateService('api', data.status === 'healthy' ? 'operational' : 'degraded')

      const dbStatus = data.services?.database
      if (dbStatus === 'healthy') updateService('database', 'operational')
      else if (dbStatus === 'degraded') updateService('database', 'degraded')
      else updateService('database', 'down')

      const speechStatus = data.services?.azure_speech
      if (speechStatus === 'healthy') updateService('azure_speech', 'operational')
      else if (speechStatus === 'degraded') updateService('azure_speech', 'degraded')
      else updateService('azure_speech', 'down')

      const s3Status = data.services?.aws_s3
      if (s3Status === 'healthy') updateService('aws_s3', 'operational')
      else if (s3Status === 'degraded') updateService('aws_s3', 'degraded')
      else updateService('aws_s3', 'down')
    }
  } catch {
    updateService('api', 'down')
    updateService('database', 'down')
    updateService('azure_speech', 'down')
    updateService('aws_s3', 'down')
  }

  lastChecked.value = new Date()
  isLoading.value = false
}

async function fetchUptimeHistory() {
  try {
    const apiUrl = API_BASE_URL === 'http://localhost:5000'
      ? 'https://api.unchonk.com'
      : API_BASE_URL

    const resp = await fetch(`${apiUrl}/api/status/history`)
    if (resp.ok) {
      const data = await resp.json()
      uptime.value = data.uptime
      avgResponseMs.value = data.avg_response_ms_24h || 0
      uptimeLoaded.value = true
    }
  } catch {
    // Silently fail, uptime section just won't show
  }
}

onMounted(() => {
  checkStatus()
  fetchUptimeHistory()
  refreshInterval = setInterval(() => {
    checkStatus()
    fetchUptimeHistory()
  }, 60000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
