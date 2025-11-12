import type { Component } from 'vue';

export type PropControlType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'color'
  | 'switch'
  | 'image';

export interface PropControlOption<T = unknown> {
  label: string;
  value: T;
}

export interface PropControlDefinition<T = unknown> {
  type: PropControlType;
  default: T;
  description?: string;
  options?: PropControlOption<T>[];
  responsive?: boolean;
}

export interface SlotDefinition {
  name: string;
  description?: string;
  allowedComponents?: string[];
  multiple?: boolean;
}

export interface ResponsiveBreakpointConfig {
  props?: Record<string, unknown>;
  description?: string;
}

export interface ResponsiveConfig {
  breakpoints: Record<string, ResponsiveBreakpointConfig>;
}

export interface BlockDefinition {
  id: string;
  category: string;
  label: string;
  media?: string;
  content?: unknown;
}

export interface MaterialMeta {
  name: string;
  displayName: string;
  description: string;
  previewImage: string;
  component: () => Promise<Component>;
  props: Record<string, PropControlDefinition>;
  defaultProps: Record<string, unknown>;
  slots: SlotDefinition[];
  responsive: ResponsiveConfig;
  block: BlockDefinition;
}

export type MaterialModule = { default: MaterialMeta };
