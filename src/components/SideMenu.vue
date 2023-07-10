<template>
  <div class="menu">
    <div class="top">
      <q-list>
        <q-item clickable v-ripple to="/connection-config">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-database" />
          </q-item-section>
          <q-item-section> Fonte de Dados </q-item-section>
          <q-tooltip anchor="bottom right" self="top middle">
            Fonte de Dados
          </q-tooltip>
        </q-item>

        <q-item clickable v-ripple to="/categories">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-folder-tree" />
          </q-item-section>
          <q-item-section>Categoria</q-item-section>
          <q-tooltip anchor="bottom right" self="top middle">
            Categoria
          </q-tooltip>
        </q-item>
        <q-item clickable v-ripple to="/reports">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-file-lines" />
          </q-item-section>
          <q-item-section>Relatórios</q-item-section>
          <q-tooltip anchor="bottom right" self="top middle">
            Relatórios
          </q-tooltip>
        </q-item>
        <q-item clickable v-ripple to="/generate-reports">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-file-export" />
          </q-item-section>
          <q-item-section>Gerar Relatório</q-item-section>
          <q-tooltip anchor="bottom right" self="top middle">
            Gerar Relatório
          </q-tooltip>
        </q-item>

        <q-item clickable v-ripple target="_blank" :href="API_DOC_URL">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-code" />
          </q-item-section>
          <q-item-section>Para Desenvolvedores</q-item-section>
          <q-tooltip anchor="bottom right" self="top middle">
            Para Desenvolvedores
          </q-tooltip>
        </q-item>
      </q-list>
    </div>
    <div class="botton">
      <q-list>
        <q-item clickable v-ripple @click="changeMinitDrawer">
          <q-item-section avatar>
            <q-icon v-if="!miniState" name="fa-solid fa-angle-left" />
            <q-icon v-else name="fa-solid fa-angle-right" />
          </q-item-section>
          <q-item-section>
            {{ miniState ? 'Expandir' : 'Minimizar' }}
          </q-item-section>
          <q-tooltip>
            {{ miniState ? 'Expandir' : 'Minimizar' }}
          </q-tooltip>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, toRefs, defineEmits } from 'vue';
import { API_DOC_URL } from '../env/env';
const props = defineProps({
  miniState: Boolean,
});

const emit = defineEmits(['changeMiniDrawer']);
const { miniState } = toRefs(props);

const changeMinitDrawer = () => {
  emit('changeMiniDrawer', !miniState.value);
};
</script>

<style>
.menu {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100vh);
}
</style>
