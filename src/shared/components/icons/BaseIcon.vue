<template>
  <svg
    :width="size"
    :height="size"
    :class="[
      'mx-auto',
      color && `text-${color}`,
      className
    ]"
    :aria-hidden="!ariaLabel"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
    fill="currentColor"
    :viewBox="viewBox"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number
  color?: string
  className?: string
  ariaLabel?: string
  viewBox?: string
}

withDefaults(defineProps<Props>(), {
  size: 20,
  color: undefined,
  className: '',
  ariaLabel: undefined,
  viewBox: '0 0 24 24'
})
</script>