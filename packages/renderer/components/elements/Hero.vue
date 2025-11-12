<template>
  <section class="rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white p-12 shadow-xl">
    <div class="space-y-4">
      <Heading :level="1" size="lg">
        <slot name="title">{{ title }}</slot>
      </Heading>
      <p class="text-xl text-slate-100">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
      <div>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Heading from '~/components/elements/Heading.vue'

const props = defineProps<{ title?: string; subtitle?: string }>()
</script>
