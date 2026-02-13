<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900">
              unChonk
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

    <main>
      <!-- Header -->
      <div class="max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Product Roadmap
        </h1>
        <p class="text-xl text-gray-600">
          Where we've been, where we're headed
        </p>
      </div>

      <!-- Legend -->
      <div class="flex justify-center gap-6 mb-12">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-green-500"></span>
          <span class="text-sm text-gray-600">Shipped</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-amber-500"></span>
          <span class="text-sm text-gray-600">In Progress</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gray-400"></span>
          <span class="text-sm text-gray-600">Up Next</span>
        </div>
      </div>

      <!-- Desktop: Horizontal Serpentine Roadmap -->
      <section
        v-if="!isMobile"
        ref="roadmapRef"
        class="max-w-6xl mx-auto px-4 pb-16"
      >
        <div class="relative w-full" :style="{ aspectRatio: '3 / 1' }">
          <!-- SVG Path Layer -->
          <svg
            class="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22c55e" />
                <stop offset="45%" stop-color="#22c55e" />
                <stop offset="55%" stop-color="#f59e0b" />
                <stop offset="75%" stop-color="#f59e0b" />
                <stop offset="85%" stop-color="#94a3b8" />
                <stop offset="100%" stop-color="#94a3b8" />
              </linearGradient>
            </defs>

            <!-- Main serpentine path -->
            <path
              ref="pathRef"
              :d="svgPathD"
              stroke="url(#pathGradient)"
              stroke-width="4"
              stroke-linecap="round"
              :class="['roadmap-path', { drawn: isAnimated }]"
            />

            <!-- Glow rings -->
            <circle
              v-for="(pos, index) in milestonePositions"
              :key="'glow-' + index"
              :cx="pos.x"
              :cy="pos.y"
              r="20"
              fill="none"
              :stroke="statusColors[milestones[index].status].glow"
              stroke-width="2"
              :class="['milestone-glow', { visible: isAnimated }]"
              :style="{ animationDelay: `${index * 0.25 + 1.5}s` }"
            />

            <!-- Milestone dots -->
            <circle
              v-for="(pos, index) in milestonePositions"
              :key="'dot-' + index"
              :cx="pos.x"
              :cy="pos.y"
              r="10"
              :fill="statusColors[milestones[index].status].dot"
              stroke="white"
              stroke-width="3"
              :class="['milestone-dot', { visible: isAnimated }]"
              :style="{ transitionDelay: `${index * 0.25 + 1}s` }"
            />
          </svg>

          <!-- HTML Card Overlay -->
          <div class="absolute inset-0">
            <div
              v-for="(pos, index) in milestonePositions"
              :key="'card-' + index"
              class="absolute -translate-x-1/2 card-enter"
              :class="{ visible: isAnimated }"
              :style="{
                left: `${(pos.x / 1200) * 100}%`,
                top: pos.cardSide === 'above'
                  ? `${((pos.y - 95) / 400) * 100}%`
                  : `${((pos.y + 25) / 400) * 100}%`,
                transitionDelay: `${index * 0.2 + 1.2}s`,
              }"
            >
              <!-- Connector line -->
              <div
                v-if="pos.cardSide === 'above'"
                class="w-px h-5 mx-auto"
                :style="{ backgroundColor: statusColors[milestones[index].status].dot, opacity: 0.4 }"
              ></div>

              <div
                class="w-36 text-center px-3 py-2.5 rounded-xl border shadow-sm"
                :style="{
                  backgroundColor: statusColors[milestones[index].status].bg,
                  borderColor: statusColors[milestones[index].status].border,
                }"
              >
                <div
                  class="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
                  :style="{
                    color: statusColors[milestones[index].status].text,
                    backgroundColor: statusColors[milestones[index].status].badge,
                  }"
                >
                  {{ statusColors[milestones[index].status].label }}
                </div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ milestones[index].label }}
                </div>
                <div class="text-xs text-gray-500 mt-1 leading-snug">
                  {{ milestones[index].description }}
                </div>
              </div>

              <!-- Connector line (below) -->
              <div
                v-if="pos.cardSide === 'below'"
                class="w-px h-5 mx-auto order-first"
                :style="{ backgroundColor: statusColors[milestones[index].status].dot, opacity: 0.4 }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile: Vertical Timeline -->
      <section
        v-else
        ref="roadmapRef"
        class="max-w-md mx-auto px-6 pb-16"
      >
        <div class="relative pl-8">
          <!-- Gradient line -->
          <div
            class="absolute left-[15px] top-0 bottom-0 w-0.5 rounded-full"
            style="background: linear-gradient(to bottom, #22c55e 0%, #22c55e 45%, #f59e0b 55%, #f59e0b 75%, #94a3b8 85%, #94a3b8 100%)"
          ></div>

          <div
            v-for="(milestone, index) in milestones"
            :key="milestone.id"
            class="relative mb-8 last:mb-0"
          >
            <!-- Dot on the line -->
            <div
              class="absolute -left-[17px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm"
              :style="{ backgroundColor: statusColors[milestone.status].dot }"
            ></div>

            <!-- Card -->
            <div
              class="ml-4 p-4 rounded-xl border shadow-sm card-enter"
              :class="{ visible: isAnimated }"
              :style="{
                backgroundColor: statusColors[milestone.status].bg,
                borderColor: statusColors[milestone.status].border,
                transitionDelay: `${index * 0.15 + 0.3}s`,
              }"
            >
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                :style="{
                  color: statusColors[milestone.status].text,
                  backgroundColor: statusColors[milestone.status].badge,
                }"
              >
                {{ statusColors[milestone.status].label }}
              </span>
              <h3 class="font-semibold text-gray-900 mt-2">{{ milestone.label }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </section>
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
            &copy; {{ currentYear }} unChonk by Chonky Heads. Text-to-Speech Solution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface RoadmapMilestone {
  id: number
  label: string
  description: string
  status: 'shipped' | 'in-progress' | 'upcoming'
}

interface MilestonePosition {
  x: number
  y: number
  cardSide: 'above' | 'below'
}

const milestones: RoadmapMilestone[] = [
  {
    id: 1,
    label: 'Chrome Extension',
    description: 'Read any webpage aloud right from your browser',
    status: 'shipped',
  },
  {
    id: 2,
    label: 'Text Highlighting',
    description: 'Follow along with real-time sentence and word highlighting',
    status: 'shipped',
  },
  {
    id: 3,
    label: 'Voice Selection',
    description: 'Choose from a variety of natural-sounding voices',
    status: 'shipped',
  },
  {
    id: 4,
    label: 'Speed Controls',
    description: 'Adjust playback speed to match your reading pace',
    status: 'shipped',
  },
  {
    id: 5,
    label: 'Browser Support',
    description: 'Bringing unChonk to more browsers',
    status: 'in-progress',
  },
  {
    id: 6,
    label: 'Reading Experience',
    description: 'Making every session smoother and more natural',
    status: 'in-progress',
  },
  {
    id: 7,
    label: 'AI-Powered Features',
    description: 'Improved summarization and smarter content tools',
    status: 'upcoming',
  },
  {
    id: 8,
    label: 'PDF Support',
    description: 'Read your PDFs aloud with highlighting',
    status: 'upcoming',
  },
]

const milestonePositions: MilestonePosition[] = [
  { x: 75,   y: 130, cardSide: 'above' },
  { x: 225,  y: 270, cardSide: 'below' },
  { x: 375,  y: 130, cardSide: 'above' },
  { x: 525,  y: 270, cardSide: 'below' },
  { x: 675,  y: 130, cardSide: 'above' },
  { x: 825,  y: 270, cardSide: 'below' },
  { x: 975,  y: 130, cardSide: 'above' },
  { x: 1125, y: 270, cardSide: 'below' },
]

const statusColors: Record<string, {
  dot: string
  glow: string
  bg: string
  border: string
  text: string
  badge: string
  label: string
}> = {
  'shipped': {
    dot: '#22c55e',
    glow: 'rgba(34,197,94,0.3)',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#15803d',
    badge: '#dcfce7',
    label: 'Shipped',
  },
  'in-progress': {
    dot: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
    badge: '#fef3c7',
    label: 'In Progress',
  },
  'upcoming': {
    dot: '#94a3b8',
    glow: 'rgba(148,163,184,0.2)',
    bg: '#f8fafc',
    border: '#e2e8f0',
    text: '#64748b',
    badge: '#f1f5f9',
    label: 'Up Next',
  },
}

// Build the SVG serpentine path
const svgPathD = computed(() => {
  const pts = milestonePositions
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i]
    const next = pts[i + 1]
    const midX = (curr.x + next.x) / 2
    d += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`
  }
  return d
})

const pathRef = ref<SVGPathElement | null>(null)
const roadmapRef = ref<HTMLElement | null>(null)
const isAnimated = ref(false)
const isMobile = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  nextTick(() => {
    // Set up path length for draw animation
    if (pathRef.value) {
      const length = pathRef.value.getTotalLength()
      pathRef.value.style.setProperty('--path-length', `${length}`)
    }

    // Intersection Observer — trigger animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isAnimated.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (roadmapRef.value) {
      observer.observe(roadmapRef.value)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Path drawing animation */
.roadmap-path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  transition: stroke-dashoffset 2.5s ease-in-out;
}

.roadmap-path.drawn {
  stroke-dashoffset: 0;
}

/* Milestone dots scale in */
.milestone-dot {
  transform-origin: center;
  transform: scale(0);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.milestone-dot.visible {
  transform: scale(1);
}

/* Glow pulse */
.milestone-glow {
  opacity: 0;
}

.milestone-glow.visible {
  animation: glowPulse 2.5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* Card fade in */
.card-enter {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.card-enter.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Mobile cards don't need the translateX */
section:last-of-type .card-enter {
  transform: translateY(10px);
}

section:last-of-type .card-enter.visible {
  transform: translateY(0);
}
</style>
