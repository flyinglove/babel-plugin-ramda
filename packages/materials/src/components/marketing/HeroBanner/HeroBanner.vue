<template>
  <section class="hero" :style="sectionStyle">
    <div class="hero__content">
      <p class="hero__eyebrow" v-if="eyebrow">{{ eyebrow }}</p>
      <h1 class="hero__title">{{ title }}</h1>
      <p class="hero__subtitle">{{ subtitle }}</p>
      <div class="hero__actions">
        <slot name="actions">
          <button class="hero__primary" type="button">{{ primaryCta }}</button>
          <button class="hero__secondary" type="button">{{ secondaryCta }}</button>
        </slot>
      </div>
    </div>
    <div class="hero__media">
      <slot name="media">
        <img :src="illustration" :alt="title" loading="lazy" />
      </slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

type HeroLayout = 'left' | 'right';

interface HeroBannerProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  illustration: string;
  layout: HeroLayout;
  background: string;
}

const props = withDefaults(defineProps<HeroBannerProps>(), {
  eyebrow: '企业增长指南',
  title: '用低代码 10 倍提升交付效率',
  subtitle: '集成可复用物料，快速搭建企业官网、活动页与应用原型。',
  primaryCta: '立即体验',
  secondaryCta: '观看演示',
  illustration:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  layout: 'left' as HeroLayout,
  background: '#111827'
});

const sectionStyle = computed(() => ({
  background: props.background,
  flexDirection: props.layout === 'left' ? 'row' : 'row-reverse'
}));
</script>

<style scoped>
.hero {
  display: flex;
  gap: 2.5rem;
  padding: 4rem 3rem;
  border-radius: 2.5rem;
  color: #f9fafb;
  align-items: center;
  overflow: hidden;
}

.hero__content {
  flex: 1 1 50%;
}

.hero__media {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
}

.hero__media img {
  width: 100%;
  max-width: 420px;
  border-radius: 1.5rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.35);
}

.hero__eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.75;
  margin-bottom: 0.75rem;
}

.hero__title {
  font-size: clamp(2.5rem, 3vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: 1.125rem;
  opacity: 0.85;
  margin-bottom: 1.75rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
}

.hero__primary,
.hero__secondary {
  border-radius: 9999px;
  padding: 0.875rem 2.25rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.hero__primary {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  color: #111827;
}

.hero__secondary {
  background: transparent;
  color: #f9fafb;
  border: 1px solid rgba(249, 250, 251, 0.3);
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 3rem 1.5rem;
  }

  .hero__actions {
    justify-content: center;
  }
}
</style>
