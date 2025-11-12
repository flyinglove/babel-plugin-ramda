import type { Component } from 'vue';

import { loadMaterials } from '@babel-plugin-ramda/materials';
import type {
  MaterialMeta,
  PropControlDefinition,
  PropControlOption,
  PropControlType
} from '@babel-plugin-ramda/materials';

import VueButton from './components/VueButton.vue';
import VueCard from './components/VueCard.vue';

export interface TraitOptionDefinition {
  value: string | number | boolean;
  name: string;
}

export interface TraitDefinition {
  type: string;
  label?: string;
  name?: string;
  changeProp?: number | boolean;
  placeholder?: string;
  options?: TraitOptionDefinition[];
}

export interface BlockMeta {
  id?: string;
  label?: string;
  category?: string;
  media?: string;
  content?: Record<string, unknown>;
}

export interface ComponentDefinition {
  label: string;
  component: Component;
  category?: string;
  defaultProps?: Record<string, unknown>;
  emits?: string[];
  traits?: TraitDefinition[];
  slots?: Record<string, () => unknown>;
  block?: BlockMeta;
}

export type ComponentRegistry = Record<string, ComponentDefinition>;

export interface GrapesVueComponent {
  createApp: (...args: unknown[]) => unknown;
  h: (...args: unknown[]) => unknown;
  registry: ComponentRegistry;
}

const builtInRegistry: ComponentRegistry = {
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
          { value: 'primary', name: 'Primary' },
          { value: 'secondary', name: 'Secondary' },
          { value: 'ghost', name: 'Ghost' }
        ]
      },
      {
        type: 'checkbox',
        label: '禁用',
        name: 'disabled',
        changeProp: 1
      }
    ],
    block: {
      id: 'vue-button',
      label: '按钮',
      category: '基础组件'
    }
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
    },
    block: {
      id: 'vue-card',
      label: '卡片',
      category: '布局组件'
    }
  }
};

export async function createComponentRegistry(): Promise<ComponentRegistry> {
  const materials = await loadMaterials();
  const materialEntries = await Promise.all(
    materials.map(async (material) => {
      try {
        const component = await material.component();
        return [material.name, createDefinitionFromMaterial(material, component as Component)] as const;
      } catch (error) {
        console.error('[builder] Failed to load material component:', material.name, error);
        return undefined;
      }
    })
  );

  const registry: ComponentRegistry = { ...builtInRegistry };

  for (const entry of materialEntries) {
    if (!entry) continue;
    const [name, definition] = entry;
    registry[name] = definition;
  }

  return registry;
}

function createDefinitionFromMaterial(material: MaterialMeta, component: Component): ComponentDefinition {
  const traits = Object.entries(material.props ?? {})
    .map(([propName, propDefinition]) => createTraitFromProp(propName, propDefinition))
    .filter((trait): trait is TraitDefinition => Boolean(trait));

  const slots = material.slots?.length
    ? Object.fromEntries(
        material.slots.map((slot) => [
          slot.name,
          () => slot.description ?? `Slot: ${slot.name}`
        ])
      )
    : undefined;

  return {
    label: material.displayName,
    category: material.block.category ?? material.displayName,
    component,
    defaultProps: material.defaultProps,
    traits,
    slots,
    block: {
      id: material.block.id,
      label: material.block.label ?? material.displayName,
      category: material.block.category ?? 'Vue 组件',
      media: material.block.media ?? material.previewImage,
      content:
        material.block.content ?? {
          type: 'vue-component',
          component: material.name,
          props: material.defaultProps
        }
    }
  } satisfies ComponentDefinition;
}

function createTraitFromProp(
  propName: string,
  propDefinition: PropControlDefinition
): TraitDefinition | null {
  const traitType = mapPropControlTypeToTrait(propDefinition.type);
  if (!traitType) {
    return null;
  }

  const trait: TraitDefinition = {
    type: traitType,
    name: propName,
    label: propDefinition.description ?? humanizeLabel(propName),
    changeProp: 1
  };

  if (traitType === 'text' && propDefinition.type === 'image') {
    trait.placeholder = '请输入图片链接';
  }

  if (propDefinition.options && propDefinition.options.length > 0) {
    trait.options = propDefinition.options.map((option: PropControlOption) => ({
      value: option.value as string | number | boolean,
      name: option.label
    }));
  }

  return trait;
}

function mapPropControlTypeToTrait(type: PropControlType): string | null {
  switch (type) {
    case 'text':
      return 'text';
    case 'textarea':
      return 'textarea';
    case 'number':
      return 'number';
    case 'select':
      return 'select';
    case 'color':
      return 'color';
    case 'switch':
      return 'checkbox';
    case 'image':
      return 'text';
    default:
      return null;
  }
}

function humanizeLabel(name: string): string {
  const withSpaces = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}
