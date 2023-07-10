<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title>Gerardor de Relatórios</q-toolbar-title>
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />

    <q-card flat bordered>
      <q-card-section horizontal class="row">
        <q-card-section class="col-xs-6">
          <q-tree
            children-key="subItems"
            :nodes="categories"
            node-key="code"
            selected-color="secondary"
            v-model:selected="selected"
            no-selection-unset
          >
            <template v-slot:header-report="prop">
              <div>
                <q-icon name="fa-solid fa-file" />
                {{ prop.node.label }}
              </div>
            </template>
          </q-tree>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-xs-6">
          <q-form @submit="emitReport()">
            <q-card>
              <q-card-section>
                <q-toolbar class="q-pa-none">
                  <q-toolbar-title>
                    <div>{{ selectedReport?.name }}</div>
                  </q-toolbar-title>
                  <q-btn
                    @click="gotoConfigReport()"
                    icon="fa-solid fa-gear"
                    round
                    color="primary"
                    outline
                  >
                    <q-tooltip> Configurar Relatório </q-tooltip>
                  </q-btn>
                </q-toolbar>
                <div class="text-caption">
                  {{ selectedReport?.category.path }}
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="row q-gutter-sm">
                <div
                  v-for="parameter in selectedReport?.parameters"
                  :key="parameter.id"
                  class="col-xs-12"
                >
                  <div v-if="parameter.type === 'STRING'">
                    <q-input
                      v-model="parameter.defaultValue"
                      outlined
                      :label="getLabel(parameter)"
                    />
                  </div>
                  <div
                    v-if="
                      parameter.type === 'INTEGER' ||
                      parameter.type === 'DECIMAL'
                    "
                  >
                    <q-input
                      v-model="parameter.defaultValue"
                      outlined
                      type="number"
                      :label="getLabel(parameter)"
                    />
                  </div>
                  <div v-if="parameter.type === 'DATE'">
                    <q-input
                      v-model="parameter.defaultValue"
                      outlined
                      :mask="getMaskForInputDate(parameter)"
                      :label="getLabel(parameter)"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              :mask="getMask(parameter)"
                              v-model="parameter.defaultValue"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions>
                <q-btn
                  type="submit"
                  label="Emitir"
                  icon="print"
                  color="primary"
                />
                <q-btn
                  type="reset"
                  label="Limpar"
                  icon="cancel"
                  color="primary"
                  outline
                />
              </q-card-actions>
            </q-card>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useCategory } from '../../../services/category/category.hook';
import { useReport } from 'src/services/report/report.hook';
import { JasperReport } from 'src/models/report/report.model';
import { ReportParameter } from 'src/models/report/report-parameter.model';
import { useRoute, useRouter } from 'vue-router';

const categories = ref<any[]>([]);
const selected = ref<any>('');
const selectedReport = ref<JasperReport>();

watch(selected, (newValue: string) => {
  if (!newValue.includes('category')) {
    const stringID = newValue.replace('report-', '');
    const id = stringID as unknown as number;
    findReport(id);
  }
});

const { findAllAsTree } = useCategory();
const { findById } = useReport();
const router = useRouter();
const route = useRoute();

const findReport = async (id: number) => {
  selectedReport.value = await findById(id);
  router.push(`/generate-reports/${id}`);
};

const getLabel = (parameter: ReportParameter) => {
  return parameter.reportParameterView
    ? parameter.reportParameterView?.label
    : parameter.name;
};

const getMask = (parameter: ReportParameter) => {
  const containPattern = !!parameter.pattern;

  if (!containPattern) return 'DD/MM/YYYY';

  return parameter.pattern?.toUpperCase();
};

const getMaskForInputDate = (parameter: ReportParameter) => {
  const containPattern = !!parameter.pattern;

  if (!containPattern) return '##/##/####';

  var pattern = parameter.pattern
    ?.toUpperCase()
    .replaceAll('D', '#')
    .replaceAll('M', '#')
    .replaceAll('Y', '#');

  console.log(pattern);

  return pattern;
};

const gotoConfigReport = () => {
  router.push(`/reports/${selectedReport.value?.id}/edit`);
};

const emitReport = () => {
  const reportParameters = selectedReport.value?.parameters?.map((p) => ({
    name: p.name,
    value: p.defaultValue,
    type: p.type,
    reportType: p.reportType,
  }));
  console.log('ReportParameters = ', reportParameters);
};

onMounted(async () => {
  categories.value = await findAllAsTree();
  if (route.params.reportId) {
    findReport(route.params.reportId as unknown as number);
  }
});
</script>
