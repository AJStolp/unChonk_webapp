<template>
  <BaseIcon
    v-bind="$props"
    aria-label="Stop"
    viewBox="0 -960 960 960"
  >
    <path d="M300-660v360-360Zm-60 420v-480h480v480H240Zm60-60h360v-360H300v360Z"/>
  </BaseIcon>
</template>

<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

interface Props {
  size?: string | number
  color?: string
  className?: string
}

defineProps<Props>()
</script>