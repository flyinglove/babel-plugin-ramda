<template>
  <span role="badge" class="inline-flex items-center rounded-full bg-sky-500 px-3 py-1 text-sm font-semibold text-white">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label?: string; default?: string }>()

const label = computed(() => props.label ?? props.default ?? '')
</script>
