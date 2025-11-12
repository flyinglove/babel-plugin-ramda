<template>
  <p class="text-lg leading-relaxed text-slate-700">
    <slot>{{ content }}</slot>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ content?: string; default?: string }>()

const content = computed(() => props.content ?? props.default ?? '')
</script>
