<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk
            </a>
            <span class="text-sm font-medium text-gray-400">/</span>
            <span class="text-sm font-medium text-gray-600">Admin Dashboard</span>
          </div>
          <div class="flex items-center gap-4">
            <div v-if="isAuthenticated" class="flex items-center gap-3">
              <span class="text-sm text-gray-600">
                <span class="font-medium text-gray-900">{{ userDisplayName }}</span>
              </span>
              <div class="w-8 h-8 rounded-full bg-[#749076] flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ userInitial }}</span>
              </div>
              <button
                @click="handleLogout"
                class="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center py-32">
      <div class="w-full max-w-sm">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-1 text-center">Admin Login</h2>
          <p class="text-gray-500 text-sm mb-6 text-center">Employee access only</p>

          <div v-if="loginError" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-red-600 text-sm">{{ loginError }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="username"
                v-model="loginUsername"
                type="text"
                required
                autocomplete="username"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749076] focus:border-transparent text-sm"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                v-model="loginPassword"
                type="password"
                required
                autocomplete="current-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#749076] focus:border-transparent text-sm"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              :disabled="loginLoading"
              class="w-full py-2.5 bg-[#749076] text-white font-semibold rounded-lg hover:bg-[#5f7760] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {{ loginLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#749076] mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading analytics...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !platformStats && !adminData" class="max-w-md mx-auto text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="fetchAllData"
            class="px-6 py-2 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <button
            @click="fetchAllData"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <!-- Auth Error Banner (shows when platform stats loaded but admin failed) -->
        <div v-if="error" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p class="text-amber-800 text-sm">{{ error }}</p>
          <button @click="fetchAllData" class="text-sm font-medium text-amber-900 underline hover:no-underline ml-4 shrink-0">Retry</button>
        </div>

        <!-- Row 1: KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(platformStats?.total_users ?? adminData?.total_users ?? 0) }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ formatNumber(adminData?.verified_users ?? 0) }} verified</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Characters Processed</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatLargeNumber(totalCharacters) }}</p>
            <p class="text-xs text-gray-400 mt-2">Synthesized + Extracted</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(adminData?.total_revenue_cents ?? 0) }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ formatNumber(adminData?.paying_users ?? 0) }} paying users</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Listening Hours</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(Math.round(platformStats?.total_listening_hours ?? 0)) }}</p>
            <p class="text-xs text-gray-400 mt-2">hrs of audio generated</p>
          </div>
        </div>

        <!-- Row 2: 30-Day Activity Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Signups (30d)</p>
            <p class="text-2xl font-bold text-[#749076]">{{ formatNumber(adminData?.signups_last_30_days ?? 0) }}</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Purchases (30d)</p>
            <p class="text-2xl font-bold text-[#749076]">{{ formatNumber(adminData?.purchases_last_30_days ?? 0) }}</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Total Extractions</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(platformStats?.total_extractions ?? 0) }}</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Total Syntheses</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(platformStats?.total_syntheses ?? 0) }}</p>
          </div>
        </div>

        <!-- Row 3: Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- UTM Sources Doughnut Chart -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top UTM Sources</h3>
            <div v-if="utmSources.length > 0" class="flex items-center justify-center" style="height: 300px;">
              <Doughnut :data="utmChartData" :options="doughnutOptions" />
            </div>
            <div v-else class="flex items-center justify-center h-[300px] text-gray-400">
              No UTM data available
            </div>
          </div>

          <!-- Usage Breakdown Bar Chart -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Usage Breakdown</h3>
            <div class="flex items-center justify-center" style="height: 300px;">
              <Bar :data="usageChartData" :options="barOptions" />
            </div>
          </div>
        </div>

        <!-- Row 4: User Funnel -->
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Funnel</h3>
          <div class="flex items-center justify-center" style="height: 280px;">
            <Bar :data="funnelChartData" :options="horizontalBarOptions" />
          </div>
        </div>

        <!-- Row 5: UTM Source Table -->
        <div v-if="utmSources.length > 0" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">UTM Source Details</h3>
          </div>
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="utm in utmSources" :key="utm.source" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ utm.source }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ formatNumber(utm.count) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 text-right">
                  {{ ((utm.count / (adminData?.total_users || 1)) * 100).toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Back Link -->
        <div class="text-center mt-12 mb-8">
          <a href="/" class="text-gray-700 hover:text-gray-900 hover:underline font-medium">
            &#8592; Back to Home
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getApiUrl } from '@shared/config/environment'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

// Types matching backend response models
interface PlatformStats {
  total_characters_synthesized: number
  total_characters_extracted: number
  total_extractions: number
  total_syntheses: number
  total_users: number
  total_listening_hours: number
}

interface AdminAnalytics {
  total_users: number
  verified_users: number
  paying_users: number
  total_revenue_cents: number
  total_chars_synthesized: number
  total_chars_extracted: number
  signups_last_30_days: number
  purchases_last_30_days: number
  top_utm_sources: Array<{ source: string; count: number }>
}

// Session-based admin auth (doesn't persist across tabs/browser restart)
const ADMIN_TOKEN_KEY = 'admin_auth_token'
const ADMIN_USER_KEY = 'admin_auth_user'

const adminToken = ref<string | null>(sessionStorage.getItem(ADMIN_TOKEN_KEY))
const adminUsername = ref<string | null>(sessionStorage.getItem(ADMIN_USER_KEY))

// Login form state
const loginUsername = ref('')
const loginPassword = ref('')
const loginError = ref<string | null>(null)
const loginLoading = ref(false)

// State
const platformStats = ref<PlatformStats | null>(null)
const adminData = ref<AdminAnalytics | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const isAuthenticated = computed(() => !!adminToken.value)

const userDisplayName = computed(() => adminUsername.value || 'Admin')

const userInitial = computed(() => {
  return userDisplayName.value.charAt(0).toUpperCase()
})

// Login / Logout
async function handleLogin() {
  loginError.value = null
  loginLoading.value = true

  try {
    const response = await fetch(getApiUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUsername.value,
        password: loginPassword.value,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      loginError.value = data?.detail || 'Invalid credentials'
      return
    }

    const data = await response.json()
    adminToken.value = data.access_token
    adminUsername.value = loginUsername.value
    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.access_token)
    sessionStorage.setItem(ADMIN_USER_KEY, loginUsername.value)

    // Clear form
    loginUsername.value = ''
    loginPassword.value = ''

    // Load dashboard data
    fetchAllData()
  } catch (err) {
    loginError.value = 'Network error. Check API connection.'
  } finally {
    loginLoading.value = false
  }
}

function handleLogout() {
  adminToken.value = null
  adminUsername.value = null
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_USER_KEY)
  platformStats.value = null
  adminData.value = null
  error.value = null
}

const totalCharacters = computed(() => {
  const synth = adminData.value?.total_chars_synthesized ?? platformStats.value?.total_characters_synthesized ?? 0
  const ext = adminData.value?.total_chars_extracted ?? platformStats.value?.total_characters_extracted ?? 0
  return synth + ext
})

const utmSources = computed(() => adminData.value?.top_utm_sources ?? [])

// Chart colors
const CHART_COLORS = [
  '#749076', '#5f7760', '#4a5e4c', '#8fb392', '#a4c6a7',
  '#b8d9bb', '#6b8a6d', '#557058', '#3f5641', '#c5dfc7',
]

// UTM Doughnut chart
const utmChartData = computed(() => ({
  labels: utmSources.value.map(u => u.source),
  datasets: [{
    data: utmSources.value.map(u => u.count),
    backgroundColor: CHART_COLORS.slice(0, utmSources.value.length),
    borderWidth: 2,
    borderColor: '#fff',
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { font: { size: 12 }, padding: 16 },
    },
  },
}

// Usage breakdown bar chart (syntheses vs extractions)
const usageChartData = computed(() => ({
  labels: ['Characters Synthesized', 'Characters Extracted'],
  datasets: [{
    label: 'Characters',
    data: [
      adminData.value?.total_chars_synthesized ?? platformStats.value?.total_characters_synthesized ?? 0,
      adminData.value?.total_chars_extracted ?? platformStats.value?.total_characters_extracted ?? 0,
    ],
    backgroundColor: ['#749076', '#a4c6a7'],
    borderRadius: 6,
  }]
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number | string) => formatLargeNumber(Number(value)),
      },
    },
  },
}

// User funnel horizontal bar chart
const funnelChartData = computed(() => ({
  labels: ['Total Users', 'Verified Users', 'Paying Users'],
  datasets: [{
    label: 'Users',
    data: [
      adminData.value?.total_users ?? 0,
      adminData.value?.verified_users ?? 0,
      adminData.value?.paying_users ?? 0,
    ],
    backgroundColor: ['#749076', '#8fb392', '#a4c6a7'],
    borderRadius: 6,
  }]
}))

const horizontalBarOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
  },
}

// Formatters
function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function formatCurrency(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

// API calls
async function fetchPlatformStats() {
  const response = await fetch(getApiUrl('/api/platform-stats'))
  if (!response.ok) throw new Error(`Platform stats failed: ${response.statusText}`)
  return await response.json()
}

async function fetchAdminAnalytics() {
  const token = adminToken.value
  if (!token) throw new Error('Not authenticated')
  const response = await fetch(getApiUrl('/api/admin/analytics/overview'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired — force logout
      handleLogout()
      throw new Error('Session expired — please sign in again.')
    }
    if (response.status === 403) throw new Error('Forbidden — admin access required.')
    throw new Error(`Admin analytics failed: ${response.statusText}`)
  }
  return await response.json()
}

async function fetchAllData() {
  loading.value = true
  error.value = null

  // Fetch independently so public stats still load even if admin auth fails
  const statsPromise = fetchPlatformStats()
    .then(data => { platformStats.value = data })
    .catch(err => console.warn('[Admin Dashboard] Platform stats error:', err))

  const adminPromise = fetchAdminAnalytics()
    .then(data => { adminData.value = data })
    .catch(err => {
      const msg = err instanceof Error ? err.message : 'Failed to load admin analytics'
      if (msg.includes('Unauthorized')) {
        error.value = 'Session expired or invalid. Please sign in again.'
      } else {
        error.value = msg
      }
      console.error('[Admin Dashboard] Admin analytics error:', err)
    })

  await Promise.all([statsPromise, adminPromise])
  loading.value = false
}

// Initialize — if we have a token in sessionStorage, load data immediately
onMounted(() => {
  if (isAuthenticated.value) {
    fetchAllData()
  }
})
</script>
