import type { Component } from 'vue';
import VueButton from './components/VueButton.vue';
import VueCard from './components/VueCard.vue';

export interface TraitDefinition {
  type: string;
  label?: string;
  name?: string;
  changeProp?: number | boolean;
  placeholder?: string;
  options?: Array<{ id: string; name: string }>;
}

export interface ComponentDefinition {
  label: string;
  component: Component;
  category?: string;
  defaultProps?: Record<string, unknown>;
  emits?: string[];
  traits?: TraitDefinition[];
  slots?: Record<string, () => unknown>;
}

export interface GrapesVueComponent {
  createApp: (...args: unknown[]) => unknown;
  h: (...args: unknown[]) => unknown;
  registry: Record<string, ComponentDefinition>;
}

export const componentRegistry: Record<string, ComponentDefinition> = {
  VueButton: {
    label: '按钮',
    category: '基础组件',
    component: VueButton,
    defaultProps: {
      label: '提交',
      variant: 'primary',
      disabled: false
    },
    emits: ['click'],
    traits: [
      {
        type: 'text',
        label: '文本',
        name: 'label',
        changeProp: 1,
        placeholder: '按钮文案'
      },
      {
        type: 'select',
        label: '风格',
        name: 'variant',
        changeProp: 1,
        options: [
          { id: 'primary', name: 'Primary' },
          { id: 'secondary', name: 'Secondary' },
          { id: 'ghost', name: 'Ghost' }
        ]
      },
      {
        type: 'checkbox',
        label: '禁用',
        name: 'disabled',
        changeProp: 1
      }
    ]
  },
  VueCard: {
    label: '卡片',
    category: '布局组件',
    component: VueCard,
    defaultProps: {
      title: '示例卡片',
      description: '这是卡片的描述内容。'
    },
    traits: [
      {
        type: 'text',
        label: '标题',
        name: 'title',
        changeProp: 1,
        placeholder: '请输入标题'
      },
      {
        type: 'textarea',
        label: '描述',
        name: 'description',
        changeProp: 1,
        placeholder: '描述信息'
      }
    ],
    slots: {
      default: () => '这里是卡片内容，可在编辑器中嵌套其他组件。'
    }
  }
};
