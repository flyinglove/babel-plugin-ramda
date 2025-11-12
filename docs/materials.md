# 物料库开发指南

本文档介绍如何在 monorepo 中的 `packages/materials` 目录下新增一个 Vue 3 + TypeScript 组件，并让它能够在搭建端（GrapesJS）中以 Block 的形式被自动加载。

## 目录结构

```text
packages/materials
├── package.json            # 物料库依赖、构建脚本
├── tsconfig.json           # TypeScript/Vue 编译配置
├── src
│   ├── index.ts            # 对外导出入口
│   ├── registry.ts         # 动态加载与 GrapesJS Block 注册
│   ├── types.ts            # 元数据类型定义
│   ├── env.d.ts            # Vue 单文件组件类型声明
│   └── components
│       ├── basic
│       │   └── Button
│       │       ├── Button.vue
│       │       └── metadata.ts
│       └── marketing
│           └── HeroBanner
│               ├── HeroBanner.vue
│               └── metadata.ts
└── ...
```

建议按照业务域进行分组（如 `basic/`、`layout/`、`marketing/`），每个组件目录都包含：

- `<Component>.vue`：Vue 3 + `<script setup lang="ts">` 实现。
- `metadata.ts`：导出默认的元信息对象。
- `preview.png` 或 `preview.svg`：若使用图片文件，可放置于同目录，并在元信息中通过相对路径或 Data URL 引用。

## 元信息字段说明

`metadata.ts` 文件需要默认导出 `MaterialMeta` 类型的对象，核心字段如下：

| 字段 | 说明 |
| --- | --- |
| `name` | 组件注册名（在渲染层用于识别 Vue 组件）。 |
| `displayName` | 在物料面板中展示的中文名称。 |
| `description` | 组件用途简介。 |
| `previewImage` | 预览图（推荐使用 data URL 或相对路径）。 |
| `component` | 返回 Promise 的函数，采用 `() => import('./Component.vue')` 动态加载组件代码。 |
| `props` | Prop 控件定义，包含控件类型、默认值、描述、可选项等。 |
| `defaultProps` | 拖入画布时的默认 Prop 值。 |
| `slots` | 插槽结构描述，可指定允许嵌入的其他组件。 |
| `responsive` | 响应式配置，按断点给出 `props` 的覆盖与说明。 |
| `block` | GrapesJS Block 配置，包括 `id`、`category`、`label`、`media` 与可选的 `content`。 |

> 若组件存在额外的可视化配置（如交互、动画），可在 `metadata.ts` 中扩展自定义字段；只需在 `types.ts` 中补充类型即可。

## 在 GrapesJS 中自动加载

`src/registry.ts` 提供了三个工具函数：

- `loadMaterials()`：通过动态 `import()` 拉取所有 `metadata.ts` 模块，并返回 `MaterialMeta[]`。
- `createBlockDefinitions()`：将元数据转换为 GrapesJS Block 配置。
- `registerMaterialsWithGrapes(editor)`：向指定 `editor.BlockManager` 注册全部物料。

在搭建端（如 Vite + GrapesJS）中可以这样使用：

```ts
import grapesjs from 'grapesjs';
import { registerMaterialsWithGrapes } from '@babel-plugin-ramda/materials';

const editor = grapesjs.init({
  container: '#builder',
  // ...其他配置
});

registerMaterialsWithGrapes(editor);
```

当新增组件并在 `materialLoaders` 数组中注册后，调用 `registerMaterialsWithGrapes` 会自动把新组件填充到 `BlockManager` 中，拖拽时会带上 `defaultProps`、插槽与响应式默认值。

## 新增组件流程示例

1. **创建目录与 Vue 文件**
   ```bash
   mkdir -p packages/materials/src/components/form/InputField
   ```
   新建 `InputField.vue`，使用 `<script setup lang="ts">` 实现组件逻辑与样式。

2. **编写元数据**
   新建 `metadata.ts`，按照上文的字段要求提供：
   - `component: () => import('./InputField.vue')`
   - `props`: 描述每个 Prop 的控件类型、默认值。
   - `slots`: 插槽名称与说明。
   - `responsive`: 针对 `mobile` / `tablet` 等断点的覆盖。
   - `block`: 指定 GrapesJS Block 信息。

3. **准备预览图**
   - 可将压缩后的 PNG/SVG 放在组件目录。
   - 或者直接在 `metadata.ts` 中声明 `data:image/svg+xml,...`。

4. **注册到加载器**
   在 `src/registry.ts` 的 `materialLoaders` 数组中追加：
   ```ts
   () => import('./components/form/InputField/metadata')
   ```
   这样 `loadMaterials()` 会自动包含新组件。

5. **验证与发布**
   - 运行 `yarn workspace @babel-plugin-ramda/materials typecheck` 检查类型。
   - 在搭建端重新加载页面，确认 BlockManager 出现新组件与预览图。

## 预览截图规范

- 建议尺寸：宽度 320-480px，保持 16:9 或 3:2 比例。
- 若使用图片文件，请命名为 `preview.png` 并在提交前压缩到 100KB 以内。
- 若使用矢量图（推荐），可直接写成 data URL，避免额外文件。

遵循以上约定即可保持物料库结构统一、元信息完整，方便团队成员快速扩展组件库。
