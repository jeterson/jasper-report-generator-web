<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-primary">
          <q-icon name="fa-solid fa-database" />
          Configurar Conexão com Banco de Dados</q-toolbar-title
        >
        <q-btn
          to="/connection-config/new"
          outline
          color="primary"
          icon="fa-sharp fa-solid fa-circle-plus"
          label="Adicionar Nova"
        />
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />

    <q-card class="q-mb-md">
      <q-card-section class="q-pa-none">
        <q-expansion-item
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
          v-model="searchExpanded"
          icon="search"
          label="Pesquisar"
        >
          <div>
            <q-card-section class="row q-col-gutter-sm">
              <q-input
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                outlined
                v-model="connectionName"
                label="Nome"
              />
              <q-select
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                option-label="label"
                option-value="value"
                :options="databases"
                v-model="databaseEngine"
                label="Banco de Dados"
                outlined
              />
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn
                @click="search()"
                color="primary"
                label="Pesquisar"
                icon="search"
              />
            </q-card-actions>
          </div>
        </q-expansion-item>
      </q-card-section>
    </q-card>

    <q-table :grid="false" :rows="connectionConfigs" :columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="database" :props="props">
            {{ props.row.database }}
          </q-td>
          <q-td key="connectionUrl" :props="props">
            {{ props.row.connectionUrl }}
          </q-td>
          <q-td key="status" :props="props">
            <q-icon
              size="24px"
              color="positive"
              v-if="props.row.status.ok"
              name="fa-solid fa-database"
            />
            <q-icon
              color="negative"
              v-else
              size="24px"
              name="fa-solid fa-database"
            />
            <q-tooltip>{{ props.row.status.message }}</q-tooltip>
          </q-td>

          <q-td key="actions" :props="props">
            <q-btn
              @click="goToEditPage(props.row.id)"
              icon="fa-regular fa-pen-to-square"
              flat
              color="primary"
              round
              dense
            ></q-btn>
            <q-btn
              @click="deleteConnection(props.row)"
              icon="fa-solid fa-trash-can"
              flat
              round
              color="negative"
              dense
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import { QTableColumn, useQuasar } from 'quasar';
import {
  ConectionConfigView,
  ReportDatabase,
} from 'src/models/connectionconfig/connection-config.model';
import { useConnectionConfig } from 'src/services/connectionconfig/connection-config.hook';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const { findAllAvailableDatabases, findAll, remove, getColumns } =
  useConnectionConfig();
const $q = useQuasar();
const router = useRouter();
const columns = ref<QTableColumn[]>([]);
const connectionName = ref<string>('');
const searchExpanded = ref(true);
const databaseEngine = ref<{ label: string; value: string }>({
  value: ReportDatabase.NONE,
  label: 'TODOS',
});
const databases = ref<{ label: string; value: string }[]>([]);

const connectionConfigs = ref<ConectionConfigView[]>([]);

onMounted(async () => {
  search();
  columns.value = await getColumns();
  databases.value = (await findAllAvailableDatabases(true)).map((x) => ({
    label: x === 'NONE' ? 'TODOS' : x,
    value: x,
  }));
});

const search = async () => {
  connectionConfigs.value = (
    await findAll(
      connectionName.value,
      databaseEngine.value.value as ReportDatabase
    )
  ).map((c) => ({ ...c, actions: null }));
};

const goToEditPage = (id: number) => {
  router.push(`connection-config/${id}/edit`);
};

const deleteConnection = (config: ConectionConfigView) => {
  $q.dialog({
    title: 'Atenção',
    message: `Deseja deletar a conexão ${config.name}`,
    ok: { label: 'Sim', flat: true },
    cancel: { label: 'Não', flat: true },
  })
    .onOk(async () => {
      await remove(config.id as number);
      search();
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .onCancel(() => {});
};
</script>
<style>
.connection-config-name {
  display: flex;
  justify-content: space-between;
}
.text-triming {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.connection-config-content-edit {
  display: flex;
}
.show {
  display: block;
}
.hide {
  display: none;
}
</style>
