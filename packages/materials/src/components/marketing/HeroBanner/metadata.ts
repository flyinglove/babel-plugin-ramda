import type { MaterialMeta } from '../../../types';

const previewImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"%3E%3Cdefs%3E%3ClinearGradient id="bg" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23111827"/%3E%3Cstop offset="100%25" stop-color="%231f2937"/%3E%3C/linearGradient%3E%3CradialGradient id="glow" cx="50%25" cy="50%25" r="60%25"%3E%3Cstop offset="0%25" stop-color="%23f97316" stop-opacity="0.4"/%3E%3Cstop offset="100%25" stop-color="%23f97316" stop-opacity="0"/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width="360" height="220" rx="32" fill="url(%23bg)"/%3E%3Ccircle cx="260" cy="110" r="92" fill="url(%23glow)"/%3E%3Crect x="48" y="54" width="160" height="12" rx="6" fill="%23fbbf24"/%3E%3Crect x="48" y="78" width="200" height="26" rx="8" fill="white"/%3E%3Crect x="48" y="112" width="180" height="14" rx="7" fill="%23cbd5f5"/%3E%3Crect x="48" y="134" width="210" height="14" rx="7" fill="%23cbd5f5" opacity="0.8"/%3E%3Crect x="48" y="172" width="120" height="32" rx="16" fill="%23f97316"/%3E%3Crect x="176" y="172" width="120" height="32" rx="16" stroke="white" fill="none" opacity="0.7"/%3E%3C/svg%3E';

const heroBannerMeta: MaterialMeta = {
  name: 'MaterialHeroBanner',
  displayName: '英雄横幅',
  description: '视觉聚焦型宣传模块，支持左右布局与自定义插槽。',
  previewImage,
  component: () => import('./HeroBanner.vue').then((mod) => mod.default),
  props: {
    eyebrow: {
      type: 'text',
      default: '企业增长指南',
      description: '位于标题上方的提示文字。'
    },
    title: {
      type: 'text',
      default: '用低代码 10 倍提升交付效率',
      description: '主标题内容。'
    },
    subtitle: {
      type: 'textarea',
      default: '集成可复用物料，快速搭建企业官网、活动页与应用原型。',
      description: '副标题或补充说明。'
    },
    primaryCta: {
      type: 'text',
      default: '立即体验',
      description: '主按钮文案。'
    },
    secondaryCta: {
      type: 'text',
      default: '观看演示',
      description: '次按钮文案。'
    },
    illustration: {
      type: 'image',
      default:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      description: '展示图片地址。'
    },
    layout: {
      type: 'select',
      default: 'left',
      description: '图片相对于文案的位置。',
      options: [
        { label: '图片在右侧', value: 'left' },
        { label: '图片在左侧', value: 'right' }
      ]
    },
    background: {
      type: 'color',
      default: '#111827',
      description: '背景色或渐变色。',
      responsive: true
    }
  },
  defaultProps: {
    eyebrow: '企业增长指南',
    title: '用低代码 10 倍提升交付效率',
    subtitle: '集成可复用物料，快速搭建企业官网、活动页与应用原型。',
    primaryCta: '立即体验',
    secondaryCta: '观看演示',
    illustration:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    layout: 'left',
    background: '#111827'
  },
  slots: [
    {
      name: 'actions',
      description: '自定义操作按钮区域。',
      allowedComponents: ['MaterialButton']
    },
    {
      name: 'media',
      description: '自定义图片或视频展示内容。',
      multiple: false
    }
  ],
  responsive: {
    breakpoints: {
      mobile: {
        description: '移动端采用纵向排列并居中展示。',
        props: {
          layout: 'left'
        }
      },
      tablet: {
        description: '平板端可保持左右结构，仅调整内边距。',
        props: {
          background: 'linear-gradient(135deg, #111827, #312e81)'
        }
      }
    }
  },
  block: {
    id: 'material-hero-banner',
    category: '营销组件',
    label: '英雄横幅',
    media: previewImage,
    content: {
      type: 'vue-component',
      component: 'MaterialHeroBanner',
      props: {
        eyebrow: '企业增长指南',
        title: '用低代码 10 倍提升交付效率',
        subtitle: '集成可复用物料，快速搭建企业官网、活动页与应用原型。'
      }
    }
  }
};

export default heroBannerMeta;
