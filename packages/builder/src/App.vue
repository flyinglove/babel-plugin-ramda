<template>
  <div class="builder">
    <header class="builder__header">
      <h1>Vue GrapesJS Builder</h1>
    </header>
    <main class="builder__body">
      <section class="builder__sidebar" ref="sidebarRef"></section>
      <section class="builder__canvas">
        <div id="gjs"></div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type grapesjs from 'grapesjs';
import { useGrapesEditor } from './useGrapesEditor';

const sidebarRef = ref<HTMLElement | null>(null);
let editor: grapesjs.Editor | null = null;

onMounted(() => {
  editor = useGrapesEditor({
    sidebar: sidebarRef.value ?? undefined
  });
});
</script>

<style scoped>
.builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.builder__header {
  padding: 0.75rem 1.5rem;
  background: #20232a;
  color: #fff;
  border-bottom: 1px solid #2c313c;
}

.builder__body {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr;
  overflow: hidden;
}

.builder__sidebar {
  background: #1f1f24;
  color: #fff;
  overflow-y: auto;
}

.builder__blocks {
  padding: 1rem;
}

.builder__blocks .gjs-blocks-c {
  display: grid;
  gap: 0.75rem;
}

.builder__canvas {
  background: #f1f2f6;
  overflow: hidden;
}

#gjs {
  height: 100%;
}
</style>
