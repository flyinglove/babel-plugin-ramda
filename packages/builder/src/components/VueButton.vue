<template>
  <button
    :class="['vue-button', `vue-button--${variant}`]"
    :disabled="disabled"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
  }>(),
  {
    label: '提交',
    variant: 'primary',
    disabled: false
  }
);

const emit = defineEmits<{ (event: 'click', eventData: MouseEvent): void }>();

function onClick(event: MouseEvent) {
  if (props.disabled) return;
  emit('click', event);
}
</script>

<style scoped>
.vue-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.vue-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vue-button--primary {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
}

.vue-button--primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.vue-button--secondary {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.vue-button--secondary:hover:not(:disabled) {
  background: #f9fafb;
}

.vue-button--ghost {
  background: transparent;
  color: #374151;
  border: 1px dashed #d1d5db;
}

.vue-button--ghost:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.08);
}
</style>
