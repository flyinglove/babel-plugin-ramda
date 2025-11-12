import type { MaterialMeta } from '../../../types';

const previewImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="80" viewBox="0 0 240 80"%3E%3Crect width="240" height="80" rx="40" fill="url(%23a)"/%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%236366f1"/%3E%3Cstop offset="100%25" stop-color="%238b5cf6"/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" font-family="Inter,system-ui" font-size="22" fill="white"%3E立即行动%3C/text%3E%3C/svg%3E';

const buttonMeta: MaterialMeta = {
  name: 'MaterialButton',
  displayName: '渐变按钮',
  description: '一个带有渐变背景与悬停动画的呼吁动作按钮。',
  previewImage,
  component: () => import('./Button.vue').then((mod) => mod.default),
  props: {
    label: {
      type: 'text',
      default: '立即行动',
      description: '按钮文本内容。'
    },
    variant: {
      type: 'select',
      default: 'primary',
      description: '按钮样式风格。',
      options: [
        { label: '主按钮', value: 'primary' },
        { label: '次按钮', value: 'secondary' }
      ]
    },
    width: {
      type: 'text',
      default: 'auto',
      description: 'CSS 宽度值（例如 200px 或 100%）。',
      responsive: true
    }
  },
  defaultProps: {
    label: '立即行动',
    variant: 'primary',
    width: 'auto'
  },
  slots: [
    {
      name: 'default',
      description: '按钮内容插槽，可替换为自定义 HTML 或图标。'
    }
  ],
  responsive: {
    breakpoints: {
      mobile: {
        description: '小屏幕下自动撑满宽度。',
        props: {
          width: '100%'
        }
      }
    }
  },
  block: {
    id: 'material-button',
    category: '基础组件',
    label: '渐变按钮',
    media: previewImage
  }
};

export default buttonMeta;
