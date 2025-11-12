import type { MaterialMeta, MaterialModule } from './types';

type MaterialModuleLoader = () => Promise<MaterialModule>;

const materialLoaders: MaterialModuleLoader[] = [
  () => import('./components/basic/Button/metadata'),
  () => import('./components/marketing/HeroBanner/metadata')
];

export async function loadMaterials(): Promise<MaterialMeta[]> {
  const modules = await Promise.all(materialLoaders.map((loader) => loader()));
  return modules.map((mod) => mod.default);
}

export async function createBlockDefinitions() {
  const materials = await loadMaterials();
  return materials.map((material) => ({
    id: material.block.id,
    definition: {
      label: material.block.label,
      category: material.block.category,
      media: material.block.media ?? material.previewImage,
      content:
        material.block.content ?? {
          type: 'vue-component',
          component: material.name,
          props: material.defaultProps
        }
    }
  }));
}

type GrapesBlockManager = {
  add(id: string, block: unknown): void;
};

type GrapesEditor = {
  BlockManager: GrapesBlockManager;
};

export async function registerMaterialsWithGrapes(editor: GrapesEditor) {
  const blocks = await createBlockDefinitions();

  blocks.forEach(({ id, definition }) => {
    editor.BlockManager.add(id, definition);
  });
}

export { materialLoaders };
