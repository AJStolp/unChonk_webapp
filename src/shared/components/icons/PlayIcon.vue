<template>
  <BaseIcon
    v-bind="$props"
    aria-label="Play"
    viewBox="0 -960 960 960"
  >
    <path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/>
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