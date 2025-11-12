<template>
  <div v-if="nodes?.length" class="schema-renderer">
    <component
      v-for="(node, index) in nodes"
      :is="resolveComponent(node.key)"
      :key="`${node.key}-${index}`"
      v-bind="resolveProps(node, contextValue)"
    >
      <template
        v-for="(slotNodes, slotName) in resolveSlots(node, contextValue)"
        #[slotName]="slotProps"
      >
        <SchemaRenderer
          :nodes="normalizeToArray(slotNodes)"
          :context="createChildContext(contextValue, slotProps)"
          :registry="registryValue"
        />
      </template>
      <SchemaRenderer
        v-if="node.children?.length"
        :nodes="node.children"
        :context="contextValue"
        :registry="registryValue"
      />
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import type { SchemaNode } from '~/types/schema'

const props = defineProps<{
  nodes: SchemaNode[]
  context?: Record<string, any>
  registry?: Record<string, Component>
}>()

const nuxtApp = useNuxtApp()

const contextValue = computed(() => props.context ?? {})

const registryValue = computed(() => ({
  ...(nuxtApp.$componentRegistry || {}),
  ...(props.registry || {})
}))

function resolveComponent(key: string) {
  const component = registryValue.value?.[key]
  if (component) {
    return component
  }

  console.warn(`SchemaRenderer: missing component for key "${key}". Falling back to span.`)
  return 'span'
}

function getByPath(source: Record<string, any>, path: string) {
  if (!path) return undefined
  return path.split('.').reduce<any>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return acc[segment as keyof typeof acc]
    }
    return undefined
  }, source)
}

function resolveDynamicValue(value: any, ctx: Record<string, any>) {
  if (Array.isArray(value)) {
    return value.map((entry) => resolveDynamicValue(entry, ctx))
  }

  if (value && typeof value === 'object') {
    if (value.__type === 'binding' && typeof value.path === 'string') {
      return getByPath(ctx, value.path)
    }

    if (value.__type === 'expr' && typeof value.source === 'string') {
      try {
        const fn = new Function('context', `with(context) { return ${value.source} }`)
        return fn(ctx)
      } catch (error) {
        console.error('SchemaRenderer: failed to evaluate expression', value.source, error)
      }
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolveDynamicValue(entry, ctx)])
    )
  }

  return value
}

function resolveProps(node: SchemaNode, ctx: Record<string, any>) {
  const resolved = resolveDynamicValue(node.props || {}, ctx)
  if (resolved && typeof resolved === 'object' && resolved.styleBlock) {
    const css = String(resolved.styleBlock)
    if (css) {
      useHead({
        style: [{
          key: `${node.key}-style`,
          children: css
        }]
      })
    }
    const { styleBlock, ...rest } = resolved
    return rest
  }
  return resolved
}

function resolveSlots(node: SchemaNode, ctx: Record<string, any>) {
  if (!node.slots) return {}
  const entries = Object.entries(node.slots).map(([slotName, slotValue]) => [
    slotName,
    resolveDynamicValue(slotValue, ctx)
  ])
  return Object.fromEntries(entries)
}

function normalizeToArray(slot: SchemaNode | SchemaNode[] | null | undefined) {
  if (!slot) return []
  return Array.isArray(slot) ? slot : [slot]
}

function createChildContext(parent: Record<string, any>, slotProps: Record<string, any>) {
  return {
    ...parent,
    ...(slotProps || {})
  }
}
</script>

<style scoped>
.schema-renderer > * + * {
  margin-top: 1.5rem;
}
</style>
