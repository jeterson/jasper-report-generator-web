<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title v-if="report.id">Editar Relatório</q-toolbar-title>
        <q-toolbar-title v-else>Cadastrar Novo Relatório</q-toolbar-title>

        <q-btn
          v-if="report.id"
          @click="gotoNewPage()"
          outline
          color="primary"
          icon="fa-sharp fa-solid fa-circle-plus"
          label="Adicionar Novo"
        />
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />

    <q-form ref="rform" @submit="saveReport()">
      <q-card>
        <q-card-section class="row q-col-gutter-sm">
          <q-input
            label="Código"
            disable
            outlined
            v-model="report.id"
            class="col-xs-12 col-sm-12 col-md-2 col-lg-2"
          />
          <q-input
            label="Nome"
            outlined
            hide-bottom-space
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            v-model="report.name"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-3"
          />

          <q-select
            :options="connections"
            option-value="id"
            hide-bottom-space
            option-label="name"
            v-model="report.connectionConfig"
            outlined
            :rules="[(val) => !!val || 'Conexão de Dados é obrigatório']"
            label="Conexão de Dados"
            class="col-xs-12 col-sm-12 col-md-4 col-lg-3"
          >
          </q-select>
          <q-select
            hide-bottom-space
            class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
            option-value="id"
            option-label="description"
            :options="categories"
            v-model="report.category"
            label="Categoria"
            :rules="[(val) => !!val || 'Categoria é obrigatório']"
            outlined
            use-input
            input-debounce="200"
            @filter="categoryFilterFn"
          >
            <template v-slot:selected>
              {{ report.category?.description }}&nbsp;
              <q-badge v-if="report.category">{{
                report.category.path
              }}</q-badge>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-if="scope.opt.parent">
                      {{ scope.opt.description }}
                    </div>
                    <strong v-else>{{ scope.opt.description }}</strong>
                  </q-item-label>
                  <q-item-label caption>{{ scope.opt.path }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-file
            v-model="file"
            label="Arquivo JRXML"
            outlined
            class="col-12"
          />

          <div v-if="report.id" class="col-xs-12">
            <div>
              Status do Arquivo de Relatório
              <strong>{{ report.fileName }}</strong>
              &nbsp;
              <q-badge
                :color="report.reportAvailable ? 'positive' : 'negative'"
                >{{
                  report.reportAvailable ? 'DISPONÍVEL' : 'INDISPONÍVEL'
                }}</q-badge
              >
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn type="submit" label="Salvar" icon="save" color="primary" />
          <q-btn
            to="/reports"
            type="reset"
            label="Cancelar"
            icon="cancel"
            color="primary"
            outline
          />
        </q-card-actions>
      </q-card>
    </q-form>
    <q-tabs class="q-pt-md" v-model="tab">
      <q-tab
        :disable="!report.id"
        name="parameters"
        v-model="tab"
        label="Parametros"
      />
      <q-tab :disable="true" name="sql" v-model="tab">
        <div>Consulta SQL <q-badge>Em Breve</q-badge></div>
      </q-tab>
      <q-tab
        :disable="!report.id"
        name="subreports"
        v-model="tab"
        label="Sub Relatórios"
      />
    </q-tabs>

    <q-card>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel :disable="!report.id" name="parameters">
          <report-parameter-page
            :is-report-file-available="isExistsReportFile"
            @parameters-changed="fillReport()"
            :report="report"
          />
        </q-tab-panel>
        <q-tab-panel :disable="!report.id" name="subreports">
          <sub-report-page @reports-changed="fillReport()" :report="report" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-separator />
  </q-page>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  ConnectionConfig,
  ReportDatabase,
} from '../../models/connectionconfig/connection-config.model';
import { useConnectionConfig } from '../../services/connectionconfig/connection-config.hook';
import { useCategory } from '../../services/category/category.hook';
import { useReport } from '../../services/report/report.hook';

import { Category } from '../../models/category/category.model';
import { useQuasar } from 'quasar';
import { QForm } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import ReportParameterPage from './parameters/ReportParameterPage.vue';
import SubReportPage from './subreports/SubReportPage.vue';
import { JasperReport } from 'src/models/report/report.model';

export type UploadResponse = { path: string; fileName: string };

const useConnectionConfigForReport = () => {
  const { findAll } = useConnectionConfig();
  return { findAllConnections: findAll };
};
const useCategoryForReport = () => {
  const { findAll } = useCategory();
  return { findAllCategories: findAll };
};

const { findAllConnections } = useConnectionConfigForReport();
const { findAllCategories } = useCategoryForReport();

const { findById, isReportFileAvailable, createReportWithFile, update } =
  useReport();

const tab = ref('parameters');
const connections = ref<ConnectionConfig[]>([]);
const categories = ref<Category[]>([]);
const isExistsReportFile = ref<boolean>(false);

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const report = ref<JasperReport>({});
const rform = ref<QForm | null>();
const file = ref<File>();

onMounted(async () => {
  fillConnections();
  fillCategories();

  if (route.params.id) {
    fillReport(route.params.id as unknown as number);
  }
});

const fillReport = async (id: number | undefined = undefined) => {
  try {
    if (!id) id = route.params.id as unknown as number;
    report.value = await findById(id as number);
    isExistsReportFile.value = await isReportFileAvailable(id);
  } catch (err) {
    if ((err as unknown as any)?.err?.response?.status === 404) {
      router.push(`/notfound/repots/${id}`);
    }
  }
};

const categoryFilterFn = (
  val: string,
  update: (callbackFn: () => void, afterFn?: () => void) => void
) => {
  findAllCategories(val, undefined, false).then((items) => {
    update(() => {
      categories.value = items;
    });
  });
};

const fillConnections = async () => {
  connections.value = await findAllConnections('', ReportDatabase.NONE);
};

const fillCategories = async () => {
  categories.value = await findAllCategories('');
};

const createNewReport = async () => {
  var createdReport = await createReportWithFile(
    {
      name: report.value.name,
      categoryId: report.value.category?.id,
      connectionId: report.value.connectionConfig?.id,
    },
    file.value as File
  );
  $q.notify({
    type: 'positive',
    message:
      'Relatório criado com sucesso. Você personalizar seu relatório agora!',
  });

  gotoEditPage(createdReport.id as number);
};

const updateReport = async () => {
  var updatedReport = await update(
    {
      name: report.value.name,
      categoryId: report.value.category?.id,
      connectionId: report.value.connectionConfig?.id,
      reportId: report.value.id,
    },
    file.value
  );
  $q.notify({ message: 'Relatório salvo com sucesso!', type: 'positive' });
  fillReport(updatedReport.id);
};

const saveReport = async () => {
  try {
    $q.loading.show();
    if (report.value.id) {
      await updateReport();
    } else {
      await createNewReport();
    }
  } finally {
    $q.loading.hide();
  }
};
const gotoNewPage = () => {
  router.push('/reports/new');
  report.value = {};
  rform.value?.reset();
};

const gotoEditPage = (id: number) => {
  router.push(`/reports/${id}/edit`);
  fillReport(id);
};
</script>
