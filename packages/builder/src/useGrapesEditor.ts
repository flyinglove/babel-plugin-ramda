import { createApp, h } from 'vue';
import grapesjs, { type Editor } from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import type { ComponentDefinition, GrapesVueComponent } from './vueRegistry';
import { componentRegistry } from './vueRegistry';

interface UseGrapesEditorOptions {
  sidebar?: HTMLElement;
}

export function useGrapesEditor(options: UseGrapesEditorOptions = {}): Editor {
  const editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    fromElement: false,
    storageManager: {
      type: 'local',
      autosave: true,
      autoload: true,
      stepsBeforeSave: 1,
      options: {
        local: { key: 'vue-grapesjs-schema' }
      }
    },
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      ],
      scripts: []
    },
    plugins: [presetWebpage],
    pluginsOpts: {
      [presetWebpage]: {
        blocksBasicOpts: { flexGrid: true },
        navbarOpts: false,
        countdownOpts: false,
        formsOpts: true
      }
    }
  });

  const panels = editor.Panels;
  panels.addPanel({
    id: 'actions',
    el: options.sidebar,
    buttons: []
  });

  panels.addPanel({
    id: 'top-actions',
    el: editor.getContainer().querySelector('.gjs-pn-panels'),
    buttons: []
  });

  panels.addButton('options', {
    id: 'save-schema',
    className: 'gjs-pn-btn gjs-pn-btn--save',
    label: '💾 保存',
    command: 'save-schema'
  });

  panels.addButton('options', {
    id: 'load-schema',
    className: 'gjs-pn-btn gjs-pn-btn--load',
    label: '📂 载入',
    command: 'load-schema'
  });

  panels.addButton('options', {
    id: 'clear-canvas',
    className: 'gjs-pn-btn gjs-pn-btn--clear',
    label: '🧹 清空',
    command: 'clear-canvas'
  });

  registerVueBridge(editor);
  registerVueComponentType(editor);
  registerVueBlocks(editor, componentRegistry);
  registerCommands(editor);

  if (options.sidebar) {
    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'builder__blocks';
    options.sidebar.appendChild(blocksContainer);
    editor.BlockManager.render(blocksContainer);
  }

  editor.on('load', () => {
    const frameWindow = editor.Canvas.getWindow();
    frameWindow.document.body.style.fontFamily = 'Inter, sans-serif';
  });

  return editor;
}

function registerCommands(editor: Editor) {
  editor.Commands.add('save-schema', {
    async run(ed) {
      await ed.store();
      editor.Modal.open({ title: '保存成功', content: '页面 schema 已保存在本地。' });
    }
  });

  editor.Commands.add('load-schema', {
    async run(ed) {
      await ed.load();
      editor.Modal.open({ title: '载入完成', content: '已从本地存储恢复页面 schema。' });
    }
  });

  editor.Commands.add('clear-canvas', {
    run(ed) {
      ed.DomComponents.clear();
      editor.StorageManager.get('local')?.store({ components: '', styles: '' });
    }
  });
}

function registerVueBridge(editor: Editor) {
  editor.on('load', () => {
    const frameWindow = editor.Canvas.getWindow();
    frameWindow.__GrapesVue = {
      createApp,
      h,
      registry: componentRegistry
    } satisfies GrapesVueComponent;
  });
}

function registerVueBlocks(editor: Editor, registry: Record<string, ComponentDefinition>) {
  const blockManager = editor.BlockManager;

  Object.entries(registry).forEach(([id, definition]) => {
    blockManager.add(id, {
      id,
      label: definition.label,
      category: definition.category ?? 'Vue 组件',
      attributes: { class: 'gjs-block gjs-block--vue' },
      content: {
        type: 'vue-component',
        component: id,
        props: { ...definition.defaultProps },
        emits: definition.emits ?? [],
        traits: definition.traits?.map((trait) => ({ ...trait })) ?? []
      }
    });
  });
}

function registerVueComponentType(editor: Editor) {
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;

  domc.addType('vue-component', {
    isComponent: (el) => el?.getAttribute?.('data-vue-component') === 'true',
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: true,
          copyable: true,
          resizable: false,
          layerable: true,
          selectable: true,
          component: '',
          props: {},
          emits: [],
          traits: []
        },
        init(this: any) {
          defaultModel.prototype.init?.call(this);
          this.setAttributes({ 'data-vue-component': 'true' });
          this.listenTo(this, 'change:traits', this.updatePropsFromTraits);
          this.listenTo(this, 'change:props', this.updateTraitValues);
          this.listenTo(this, 'change', this.updatePropsFromTraits);
        },
        updatePropsFromTraits(this: any) {
          const traits = this.get('traits') || [];
          const nextProps: Record<string, unknown> = { ...this.get('props') };
          traits.forEach((trait: any) => {
            const name = trait.name;
            if (!name) return;
            const value = this.get(name);
            if (value !== undefined) {
              nextProps[name] = value;
            }
          });
          this.set('props', nextProps, { silent: true });
        },
        updateTraitValues(this: any) {
          const traits = this.get('traits') || [];
          const props = this.get('props') || {};
          traits.forEach((trait: any) => {
            const name = trait.name;
            if (!name) return;
            if (props[name] !== undefined) {
              this.set(name, props[name]);
            }
          });
        }
      },
      {
        isComponent: (el: HTMLElement) => el?.getAttribute?.('data-vue-component') === 'true'
      }
    ),
    view: defaultView.extend({
      init(this: any) {
        defaultView.prototype.init?.call(this);
        this.listenTo(this.model, 'change:props', this.renderVue);
        this.listenTo(this.model, 'change:component', this.renderVue);
        this.listenTo(this.model, 'change:emits', this.renderVue);
      },
      onRender(this: any) {
        defaultView.prototype.onRender?.call(this);
        this.renderVue();
      },
      renderVue(this: any) {
        const frameWindow = this.em?.get('Canvas')?.getWindow?.();
        const bridge = frameWindow?.__GrapesVue ?? (window as any).__GrapesVue;
        if (!bridge) return;
        const { createApp, h, registry } = bridge;
        const componentName = this.model.get('component');
        const componentDef = registry?.[componentName];
        const props = {
          ...(componentDef?.defaultProps ?? {}),
          ...(this.model.get('props') ?? {})
        };
        const emits: string[] = this.model.get('emits') ?? [];

        if (this.vueApp) {
          this.vueApp.unmount();
          this.vueApp = undefined;
        }

        if (!componentDef?.component) {
          this.el.innerHTML = `<div class="gjs-vue-placeholder">未找到组件 ${componentName}</div>`;
          return;
        }

        const listeners: Record<string, (payload: unknown) => void> = {};
        emits.forEach((event: string) => {
          const handlerName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
          listeners[handlerName] = (payload: unknown) => {
            this.em.get('Editor')?.trigger('vue:emit', {
              component: componentName,
              event,
              payload,
              id: this.model.getId()
            });
          };
        });

        this.vueApp = createApp({
          render() {
            return h(
              componentDef.component,
              {
                ...props,
                ...listeners
              },
              componentDef.slots
                ? Object.fromEntries(
                    Object.entries(componentDef.slots).map(([slotName, slotFn]) => [
                      slotName,
                      () => slotFn()
                    ])
                  )
                : undefined
            );
          }
        });

        this.vueApp.mount(this.el);
      },
      events: {
        dblclick: 'openTraitManager'
      },
      openTraitManager(this: any) {
        const editor = this.em.get('Editor');
        editor?.runCommand('open-sm');
        editor?.StyleManager?.select(this.model);
      },
      remove(this: any) {
        this.vueApp?.unmount?.();
        this.vueApp = undefined;
        defaultView.prototype.remove?.call(this);
      }
    })
  });
}
