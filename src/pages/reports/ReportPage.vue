<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title>Relatórios</q-toolbar-title>
        <q-btn
          to="/reports/new"
          outline
          color="primary"
          icon="fa-sharp fa-solid fa-circle-plus"
          label="Adicionar Novo"
        />
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />
    <q-card class="q-mb-md">
      <q-card-section class="q-pa-none">
        <q-expansion-item
          v-model="expanded"
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
          icon="search"
          label="Pesquisar"
        >
          <div>
            <q-card-section class="row q-col-gutter-sm">
              <q-input
                outlined
                label="Nome do Relatório"
                v-model="searchParams.reportName"
                class="col-xs-12 col-sm-12 col-md-4 col lg-4"
              />
              <q-input
                outlined
                label="Path"
                v-model="searchParams.path"
                class="col-xs-12 col-sm-12 col-md-4 col lg-4"
              />
              <q-select
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
                clearable
                option-value="id"
                option-label="description"
                :options="categories"
                v-model="searchParams.category"
                label="Categoria"
                outlined
                use-input
                input-debounce="200"
                @filter="categoryFilterFn"
              >
                <template v-slot:selected>
                  {{ searchParams.category?.description }}&nbsp;
                  <q-badge v-if="searchParams.category?.id">{{
                    searchParams.category?.path
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
    <q-table :columns="columnsReport" :rows="reports">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="category" :props="props">
            {{ props.row.category.description }}
          </q-td>
          <q-td key="connectionConfig" :props="props">
            {{ props.row.connectionConfig.name }}
          </q-td>
          <q-td key="fileName" :props="props">
            {{ props.row.fileName }}
          </q-td>
          <q-td key="reportAvailable" :props="props">
            <q-badge>{{ props.row.reportAvailable ? 'SIM' : 'NÃO' }} </q-badge>
          </q-td>

          <q-td key="actions" :props="props">
            <q-btn
              icon="fa-regular fa-pen-to-square"
              flat
              @click="gotoEditPage(props.row)"
              color="primary"
              round
              dense
            ></q-btn>
            <q-btn
              icon="fa-solid fa-trash-can"
              flat
              round
              @click="deleteReport(props.row)"
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
import { Category } from 'src/models/category/category.model';
import { JasperReport } from 'src/models/report/report.model';
import { useCategory } from 'src/services/category/category.hook';
import { useReport } from 'src/services/report/report.hook';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { columns, findAll, remove } = useReport();
const categoryHook = useCategory();

const columnsReport = ref<QTableColumn[]>([]);
const reports = ref<JasperReport[]>([]);
const router = useRouter();
const route = useRoute();
const categories = ref<Category[]>([]);
const $q = useQuasar();

const expanded = ref(true);

const searchParams = ref<{
  reportName?: string;
  category?: Category;
  path?: string;
}>({});

onMounted(async () => {
  columnsReport.value = await columns();
  categories.value = await categoryHook.findAll('');
  searchParams.value = {
    category: route.query.categoryId
      ? categories.value.find(
          (x) => x.id == (route.query.categoryId as unknown as number)
        )
      : undefined,
    path: route.query.path as string,
    reportName: route.query.reportName as string,
  };
  search();
});

const search = async () => {
  reports.value = await findAll(
    searchParams.value.reportName ?? '',
    searchParams.value.category?.id ?? null,
    (searchParams.value.path ?? '').replaceAll('\\', '/')
  );

  router.push(
    `/reports?reportName=${searchParams.value.reportName ?? ''}&categoryId=${
      searchParams.value.category?.id ?? ''
    }&path=${searchParams.value.path ?? ''}`
  );
};

const gotoEditPage = (report: JasperReport) => {
  router.push(`/reports/${report.id}/edit`);
};

const categoryFilterFn = (
  val: string,
  update: (callbackFn: () => void, afterFn?: () => void) => void
) => {
  categoryHook.findAll(val, undefined, false).then((items) => {
    update(() => {
      categories.value = items;
    });
  });
};

const deleteReport = (category: JasperReport) => {
  $q.dialog({
    title: 'Atenção',
    message: `Deseja deletar o relatório ${category.name}?`,
    ok: { label: 'Sim', flat: true },
    cancel: { label: 'Não', flat: true },
  }).onOk(async () => {
    await remove(category.id as number);
    search();
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  //.onCancel(() => {});
};
</script>
