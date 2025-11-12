<template>
  <component :is="asTag" :class="['font-bold leading-tight', sizeClass]">
    <slot>{{ content }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ level?: number; size?: 'sm' | 'md' | 'lg'; content?: string; default?: string }>(),
  {
    level: 2,
    size: 'lg',
    content: undefined,
    default: undefined
  }
)

const asTag = computed(() => `h${Math.min(Math.max(props.level, 1), 6)}`)

const content = computed(() => props.content ?? props.default ?? '')

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-lg'
    case 'md':
      return 'text-2xl'
    default:
      return 'text-4xl'
  }
})
</script>
