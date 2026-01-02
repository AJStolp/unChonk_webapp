<template>
  <BaseIcon
    v-bind="$props"
    aria-label="Pause"
    viewBox="0 -960 960 960"
  >
    <path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/>
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