<template>
  <div v-if="pageSchema" class="space-y-8">
    <SchemaRenderer :nodes="pageSchema.nodes" :context="computedContext" />
  </div>
  <div v-else class="text-center text-slate-500">
    Loading schema...
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import SchemaRenderer from '~/components/SchemaRenderer.vue'
import type { PageSchema } from '~/types/schema'

const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || 'index'
)

const { data: pageSchema } = await useAsyncData<PageSchema>(
  () => `page-schema-${slug.value}`,
  () => $fetch(`/api/schema/${slug.value}`),
  { server: true, watch: [slug] }
)

const runtimeContext = reactive({
  route,
  now: new Date().toISOString()
})

const computedContext = computed(() => {
  const schemaContext = pageSchema.value?.context || {}
  return {
    ...runtimeContext,
    ...schemaContext,
    context: schemaContext
  }
})

watchEffect(() => {
  const schema = pageSchema.value
  if (!schema) return

  if (schema.styles) {
    useHead({
      style: [
        {
          key: `schema-${slug.value}`,
          children: schema.styles
        }
      ]
    })
  }

  useSeoMeta({
    title: schema.title,
    description: schema.description || 'Schema rendered page'
  })
})
</script>
