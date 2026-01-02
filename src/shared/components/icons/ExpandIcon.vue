<template>
  <BaseIcon 
    v-bind="$props" 
    :aria-label="isExpanded ? 'Collapse' : 'Expand'" 
    viewBox="0 -960 960 960"
    :class="[
      'transition-transform duration-200',
      getRotationClass()
    ]"
  >
    <path d="M480-80 200-360l56-57 184 184v-287h80v287l184-183 56 56L480-80Zm-40-520v-120h80v120h-80Zm0-200v-80h80v80h-80Z"/>
  </BaseIcon>
</template>

<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

interface Props {
  size?: string | number
  color?: string
  className?: string
  isExpanded: boolean
  isHorizontal?: boolean
}

const props = defineProps<Props>()

const getRotationClass = () => {
  if (props.isHorizontal) {
    // When horizontal: rotate 90deg to point right, 270deg when expanded to point left
    return props.isExpanded ? '-rotate-90' : 'rotate-90'
  } else {
    // When vertical: normal behavior (down arrow, up when expanded)
    return props.isExpanded ? 'rotate-180' : 'rotate-0'
  }
}
</script>