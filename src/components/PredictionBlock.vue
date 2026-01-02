<template>
  <div class="prediction-block">
    <div class="prediction-header">
      <div>
        <strong>Block #{{ prediction.id }}</strong>
        <span 
          class="visual-zone" 
          :class="`zone-${(prediction.visualZone || 'other').toLowerCase()}`"
        >
          {{ prediction.visualZone || "OTHER" }}
        </span>
        <span 
          class="prediction" 
          :class="prediction.recommended ? 'recommended' : 'not-recommended'"
        >
          {{ prediction.recommended ? "✅ Recommended" : "❌ Not Recommended" }}
        </span>
      </div>
      <div>
        <strong>{{ Math.round(confidence * 100) }}% confidence</strong>
      </div>
    </div>
    
    <div class="block-text">
      <span>{{ displayText }}</span>
      <span v-if="isLongText && !showFullText" class="text-ellipsis">...</span>
      <button 
        v-if="isLongText" 
        @click="toggleText" 
        class="show-more-btn"
      >
        {{ showFullText ? 'Show Less' : 'Show More' }}
      </button>
    </div>
    
    <div class="confidence-bar">
      <div 
        class="confidence-fill" 
        :class="confidenceClass"
        :style="{ width: confidence * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Prediction {
  id: number
  text: string
  visualZone?: string
  prediction: number
  recommended: boolean
}

interface Props {
  prediction: Prediction
  index: number
}

const props = defineProps<Props>()

const showFullText = ref(false)
const currentCharLimit = ref(100)

const fullText = computed(() => props.prediction.text || "")
const isLongText = computed(() => fullText.value.length > 100)
const confidence = computed(() => props.prediction.prediction)

const confidenceLevel = computed(() => {
  if (confidence.value > 0.7) return "high"
  if (confidence.value > 0.4) return "medium"
  return "low"
})

const confidenceClass = computed(() => `confidence-${confidenceLevel.value}`)

const displayText = computed(() => {
  if (!isLongText.value || showFullText.value) {
    return fullText.value
  }
  
  if (!showFullText.value) {
    return fullText.value.substring(0, currentCharLimit.value)
  }
  
  return fullText.value.substring(0, currentCharLimit.value)
})

const toggleText = () => {
  if (!showFullText.value) {
    // Gradually expand by 1000 characters
    if (currentCharLimit.value < fullText.value.length) {
      currentCharLimit.value = Math.min(currentCharLimit.value + 1000, fullText.value.length)
      if (currentCharLimit.value >= fullText.value.length) {
        showFullText.value = true
      }
    }
  } else {
    // Collapse back to original
    showFullText.value = false
    currentCharLimit.value = 100
  }
}
</script>

<style scoped>
.prediction-block {
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: var(--surface-primary);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.prediction-header > div:first-child {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.visual-zone {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.zone-center {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-primary);
}

.zone-sidebar {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-primary);
}

.zone-header,
.zone-footer {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-primary);
}

.zone-other {
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
}

.prediction {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.prediction.recommended {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-primary);
}

.prediction.not-recommended {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-primary);
}

.block-text {
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.text-ellipsis {
  color: var(--text-secondary);
}

.show-more-btn {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.show-more-btn:hover {
  background: #2563eb;
}

.confidence-bar {
  height: 6px;
  background: var(--surface-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.confidence-high {
  background: var(--success-primary);
}

.confidence-medium {
  background: #f59e0b;
}

.confidence-low {
  background: var(--error-primary);
}

:root {
  --success-primary: #22c55e;
  --error-primary: #ef4444;
  --accent-primary: #3b82f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --surface-primary: #ffffff;
  --surface-secondary: #f9fafb;
  --border-primary: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --surface-primary: #1f2937;
    --surface-secondary: #374151;
    --border-primary: #4b5563;
  }
}
</style>