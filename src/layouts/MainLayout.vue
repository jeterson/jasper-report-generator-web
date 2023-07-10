<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <q-icon name="fa-solid fa-file-pdf" />
          </q-avatar>
          Gerar de Relatório JasperReports
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="mini"
      show-if-above
      :width="300"
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <!-- drawer content -->
      <SideMenu :mini-state="mini" @change-mini-drawer="changeMiniState" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-space />
        <small>Desenvolvido por: Jéterson Miranda Gomes</small>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue';
import SideMenu from '../components/SideMenu.vue';
import { useQuasar } from 'quasar';

export default {
  components: {
    SideMenu,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const mini = ref(true);
    const $q = useQuasar();

    return {
      leftDrawerOpen,
      mini,
      changeMiniState(miniUpdated: boolean) {
        mini.value = miniUpdated;
      },
      toggleLeftDrawer() {
        /*if ($q.screen.sm || $q.screen.xs) {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        }
        mini.value = !mini.value;*/

        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
