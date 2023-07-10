<template>
  <q-card flat bordered>
    <q-card-section horizontal class="row">
      <q-card-section class="col-xs-6">
        <q-toolbar class="q-pa-none">
          <q-toolbar-title v-if="!!!selectedParameter.id">
            Crie um novo parametro para o relatório
          </q-toolbar-title>
          <q-toolbar-title v-else>
            Edite o parametro do relatório
          </q-toolbar-title>
          <q-btn
            :disable="!isReportFileAvailable"
            v-if="!!!selectedParameter.id"
            outline
            round
            @click="createParametersFromJrml()"
            color="primary"
            icon="fa-regular fa-file-code"
          >
            <q-tooltip>Buscar do arquivo jrxml</q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator class="q-mb-md" />

        <q-form
          ref="pform"
          class="row q-gutter-sm"
          @submit="updateParameterForReport()"
          @reset="selectedParameter = {}"
        >
          <q-input
            v-model="selectedParameter.id"
            class="col-xs-12"
            label="Código"
            v-if="!!selectedParameter.id"
            disable
            outlined
          />
          <q-input
            v-model="selectedParameter.name"
            class="col-xs-12"
            label="Nome"
            hide-bottom-space
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            outlined
          />
          <q-select
            :options="parametersType"
            label="Tipo"
            outlined
            hide-bottom-space
            :rules="[(val) => !!val || 'Tipo é obrigatório']"
            v-model="selectedParameter.type"
            class="col-xs-12"
          />
          <q-input
            v-model="selectedParameter.defaultValue"
            class="col-xs-12"
            label="Valor padrão"
            outlined
          />
          <q-input
            v-model="selectedParameter.pattern"
            class="col-xs-12"
            label="Pattern"
            outlined
          />

          <div class="q-pt-sm q-pb-sm q-gutter-sm">
            <q-btn label="Salvar" type="submit" icon="save" color="primary" />
            <q-btn
              label="Cancelar"
              icon="cancel"
              color="primary"
              type="reset"
              outline
            />
          </div>
        </q-form>
      </q-card-section>
      <q-separator vertical />
      <q-card-section class="col-xs-6">
        <q-markup-table>
          <thead>
            <th class="text-left">Ações</th>
            <th class="text-left">Código</th>
            <th class="text-left">Nome</th>
            <th class="text-left">Tipo</th>
            <th class="text-left">Valor Padrão</th>
            <th class="text-left">Pattern</th>
            <th class="text-left">Criado Manual</th>
          </thead>
          <tbody>
            <tr :key="parameter.id" v-for="parameter in report.parameters">
              <td class="q-gutter-xs">
                <q-btn
                  flat
                  round
                  size="10px"
                  color="primary"
                  icon="fa-regular fa-pen-to-square"
                  @click="setSelectedParameter(parameter)"
                />
                <q-btn
                  round
                  size="10px"
                  flat
                  color="primary"
                  @click="removeParameterFromReport(parameter)"
                  icon="fa-solid fa-trash-can"
                />
              </td>
              <td>{{ parameter.id }}</td>
              <td>{{ parameter.name }}</td>
              <td>{{ parameter.type }}</td>
              <td>{{ parameter.defaultValue }}</td>
              <td>{{ parameter.pattern }}</td>
              <td>{{ parameter.createdManually ? 'Sim' : 'Não' }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRefs,
  defineEmits,
  ref,
  onMounted,
  PropType,
} from 'vue';
import {
  ReportParamType,
  ReportParameter,
} from '../../../models/report/report-parameter.model';

import { useReportParameter } from '../../../services/report/report-parameter.hook';
import { JasperReport } from '../../../models/report/report.model';
import { QForm, useQuasar } from 'quasar';

//Hooks
const { findParametersType, createFromXml, create, update, remove } =
  useReportParameter();
const $q = useQuasar();

//lifecycle component
onMounted(async () => {
  parametersType.value = await findParametersType();
});

//props
const props = defineProps({
  parameters: Array<ReportParameter>,
  report: { type: Object as PropType<JasperReport>, required: true },
  isReportFileAvailable: Boolean,
});
const { report, isReportFileAvailable } = toRefs(props);

//Event emitters
const emit = defineEmits(['parametersChanged']);

//refs
const selectedParameter = ref<ReportParameter>({ createdManually: true });
const parametersType = ref<ReportParamType[]>([]);
const pform = ref<QForm | null>(null);

//methods
const removeParameterFromReport = async (parameter: ReportParameter) => {
  await remove(parameter.id as number);
  onParametersChanged();
};

const setSelectedParameter = (parameter: ReportParameter) => {
  selectedParameter.value = parameter;
};

const onParametersChanged = () => emit('parametersChanged');

const updateParameterForReport = async () => {
  selectedParameter.value.reportType =
    selectedParameter.value.reportType ?? selectedParameter.value.type;

  if (selectedParameter.value.id) {
    await update(selectedParameter.value);
    $q.notify({ message: 'Parametro Atualizado!', type: 'positive' });
  } else {
    await create(report.value?.id as number, selectedParameter.value);
    $q.notify({ message: 'Parametro Criado!', type: 'positive' });
  }
  pform.value?.reset();
  onParametersChanged();
};

const createParametersFromJrml = async () => {
  if (!isReportFileAvailable.value) return;

  var hasCreated = await createFromXml(report.value?.id as number);
  if (hasCreated) {
    $q.notify({ message: 'Parametros criados com sucesso!', type: 'positive' });
  } else {
    $q.notify({ message: 'Nenhum parametro criado!', type: 'info' });
  }
  onParametersChanged();
};
</script>
