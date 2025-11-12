<template>
  <button
    class="material-button"
    :class="[`material-button--${variant}`]"
    :style="{ width }"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
  width: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  label: '立即行动',
  variant: 'primary',
  width: 'auto'
});

const { label, variant, width } = toRefs(props);
</script>

<style scoped>
.material-button {
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  padding: 0.75rem 1.75rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.material-button--primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.material-button--secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.material-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2);
}
</style>
