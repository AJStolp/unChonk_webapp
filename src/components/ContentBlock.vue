<template>
  <div 
    class="content-block" 
    :class="{
      'labeled-include': label === 1,
      'labeled-exclude': label === 0
    }"
  >
    <div class="block-header">
      <div class="block-info">
        <span class="block-id">Block #{{ block.id }}</span>
        <span 
          class="visual-zone" 
          :class="`zone-${(block.visualZone || 'other').toLowerCase()}`"
        >
          {{ block.visualZone || "OTHER" }}
        </span>
        <span 
          class="recommendation" 
          :class="`rec-${(block.recommendation || 'maybe').toLowerCase()}`"
        >
          {{ block.recommendation || "MAYBE" }}
        </span>
        <span 
          v-if="block.prediction !== undefined"
          class="prediction" 
          :class="block.recommended ? 'recommended' : 'not-recommended'"
        >
          🤖 {{ block.recommended ? "✅ RECOMMENDED" : "❌ NOT RECOMMENDED" }} 
          ({{ (block.prediction * 100).toFixed(1) }}%)
        </span>
      </div>
    </div>
    
    <div class="block-text">{{ truncatedText }}</div>
    
    <div class="block-metadata">
      <div class="metadata-item">
        <span>📊</span>
        <span>{{ block.textLength || block.text?.length || 0 }} chars</span>
      </div>
      <div class="metadata-item">
        <span>🎯</span>
        <span>{{ block.visualZone || "OTHER" }}</span>
      </div>
      <div class="metadata-item">
        <span>📝</span>
        <span>{{ block.tagName || "div" }}</span>
      </div>
      <div class="metadata-item">
        <span>🔤</span>
        <span>{{ block.fontSize || 16 }}px</span>
      </div>
    </div>
    
    <div class="block-actions">
      <button 
        @click="$emit('label', block.id, 1)" 
        class="btn btn-success"
        :class="{ active: label === 1 }"
      >
        ✅ Include
      </button>
      <button 
        @click="$emit('label', block.id, 0)" 
        class="btn btn-danger"
        :class="{ active: label === 0 }"
      >
        ❌ Exclude
      </button>
      <button 
        @click="$emit('label', block.id, null)" 
        class="btn btn-neutral"
      >
        ⏭️ Skip
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ContentBlock {
  id: number
  text: string
  textLength?: number
  visualZone?: string
  tagName?: string
  fontSize?: number
  recommendation?: string
  prediction?: number
  recommended?: boolean
  modelConfidence?: number
  features?: Record<string, unknown>
}

interface Props {
  block: ContentBlock
  label?: number | null
}

const props = defineProps<Props>()

defineEmits<{
  label: [blockId: number, label: number | null]
}>()

const truncatedText = computed(() => {
  const text = props.block.text || ""
  return text.length > 150 ? text.substring(0, 150) + "..." : text
})
</script>

<style scoped>
.content-block {
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: var(--surface-primary);
  transition: all 0.2s ease;
}

.content-block:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-block.labeled-include {
  border-color: var(--success-primary);
  background: rgba(34, 197, 94, 0.05);
}

.content-block.labeled-exclude {
  border-color: var(--error-primary);
  background: rgba(239, 68, 68, 0.05);
}

.block-header {
  margin-bottom: 0.75rem;
}

.block-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.block-id {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
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

.recommendation {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.rec-likely_good {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-primary);
}

.rec-likely_bad {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-primary);
}

.rec-maybe {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
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

.block-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--surface-secondary);
  border-radius: 6px;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.metadata-item span:first-child {
  font-size: 1rem;
}

.block-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

.btn.btn-success {
  background: var(--success-primary);
  color: white;
}

.btn.btn-success:hover {
  background: #16a34a;
}

.btn.btn-success.active {
  background: #15803d;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn.btn-danger {
  background: var(--error-primary);
  color: white;
}

.btn.btn-danger:hover {
  background: #dc2626;
}

.btn.btn-danger.active {
  background: #b91c1c;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn.btn-neutral {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.btn.btn-neutral:hover {
  background: var(--surface-tertiary);
}

:root {
  --success-primary: #22c55e;
  --error-primary: #ef4444;
  --accent-primary: #3b82f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --surface-primary: #ffffff;
  --surface-secondary: #f9fafb;
  --surface-tertiary: #f3f4f6;
  --border-primary: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --surface-primary: #1f2937;
    --surface-secondary: #374151;
    --surface-tertiary: #4b5563;
    --border-primary: #4b5563;
  }
}
</style>