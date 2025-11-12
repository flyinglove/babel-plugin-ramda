<template>
  <article class="vue-card">
    <header v-if="title" class="vue-card__header">
      <h3>{{ title }}</h3>
    </header>
    <p v-if="description" class="vue-card__description">{{ description }}</p>
    <section class="vue-card__body">
      <slot />
    </section>
    <footer v-if="$slots.footer" class="vue-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: '示例卡片',
    description: '这是卡片的描述内容。'
  }
);
</script>

<style scoped>
.vue-card {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  min-height: 180px;
}

.vue-card__header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.vue-card__description {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.vue-card__body {
  flex: 1;
  color: #374151;
}

.vue-card__footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  text-align: right;
  color: #6b7280;
}
</style>
