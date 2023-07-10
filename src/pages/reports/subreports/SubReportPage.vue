<template>
  <div class="text-primary text-center" v-if="!hasSubReports()">
    <div>Não há sub relatórios para esse relatório</div>
    <q-btn @click="showDialogCreateNew = true" label="Adicionar" flat />
  </div>

  <div v-else>
    <q-markup-table>
      <thead>
        <th class="text-left">Código</th>
        <th class="text-left">Diretório</th>
        <th class="text-left">Arquivo</th>
        <th class="text-left">Arquivo Disponível</th>
        <th class="text-left">Ações</th>
      </thead>
      <tbody>
        <tr v-for="subreport in report.subReports" :key="subreport.id">
          <td>{{ subreport.id }}</td>
          <td>{{ subreport.filePath }}</td>
          <td>{{ subreport.fileName }}</td>
          <td>
            <q-badge
              :color="subreport.reportAvailable ? 'positive' : 'negative'"
              >{{ subreport.reportAvailable ? 'SIM' : 'NÃO' }}
            </q-badge>
          </td>
          <td>
            <q-btn
              flat
              round
              size="10px"
              color="primary"
              @click="setSelectedSubReport(subreport)"
              icon="fa-regular fa-pen-to-square"
            />
            <q-btn
              round
              size="10px"
              flat
              @click="removeSubReport(subreport)"
              color="negative"
              icon="fa-solid fa-trash-can"
            />
          </td>
        </tr>
        <tr v-if="editingReport">
          <td colspan="5">
            <q-form @submit="updateSubReportFile()">
              <q-card flat bordered>
                <q-card-section>
                  <q-file
                    :rules="[(val) => !!val || 'Arquivo é obrigatório']"
                    outlined
                    label="Arquivo"
                    v-model="file"
                  />
                </q-card-section>
                <q-separator />
                <q-card-actions>
                  <q-btn
                    type="submit"
                    label="Salvar"
                    icon="save"
                    color="primary"
                  />
                  <q-btn
                    type="reset"
                    label="Cancelar"
                    icon="cancel"
                    color="primary"
                    @click="resetSelectedReport()"
                    outline
                  />
                </q-card-actions>
              </q-card>
            </q-form>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
  <q-dialog persistent v-model="showDialogCreateNew">
    <div style="width: 700px; max-width: 80vw">
      <q-form @submit="updateSubReportFile()">
        <q-card flat bordered>
          <q-card-section>
            <q-toolbar>
              <q-toolbar-title>Adicionar Novo SubRelatório</q-toolbar-title>
            </q-toolbar>
          </q-card-section>
          <q-card-section class="row">
            <q-file
              class="col-12"
              :rules="[(val) => !!val || 'Arquivo é obrigatório']"
              outlined
              label="Arquivo"
              v-model="file"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn type="submit" label="Salvar" icon="save" color="primary" />
            <q-btn
              type="reset"
              label="Cancelar"
              icon="cancel"
              color="primary"
              @click="resetSelectedReport()"
              outline
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, ref, PropType } from 'vue';

import { JasperReport } from '../../../models/report/report.model';
import { useReport } from 'src/services/report/report.hook';
import { useQuasar } from 'quasar';

const { update, createReportWithFile, remove } = useReport();
const $q = useQuasar();
const props = defineProps({
  report: { type: Object as PropType<JasperReport>, required: true },
});

const emit = defineEmits(['reportsChanged']);

const file = ref<File>();
const editingReport = ref<boolean>(false);
const selectedSubReport = ref<JasperReport>();
const showDialogCreateNew = ref<boolean>(false);

const updateSubReportFile = async () => {
  try {
    $q.loading.show();

    if (selectedSubReport.value?.id) {
      await update(
        {
          name: report.value.name,
          categoryId: report.value.category.id,
          connectionId: report.value.connectionConfig.id,
          reportId: selectedSubReport.value?.id,
        },
        file.value
      );
    } else {
      await createReportWithFile(
        {
          name: report.value.name,
          categoryId: report.value.category.id,
          connectionId: report.value.connectionConfig.id,
          parentReportId: report.value.id,
        },
        file.value as File
      );
    }
    emit('reportsChanged');
    resetSelectedReport();
    $q.notify({ message: 'Arquivo Alterado', type: 'positive' });
  } finally {
    $q.loading.hide();
  }
};

const setSelectedSubReport = (subreport: JasperReport) => {
  editingReport.value = !editingReport.value;
  if (editingReport.value) selectedSubReport.value = subreport;
  else selectedSubReport.value = undefined;
};

const resetSelectedReport = () => {
  editingReport.value = false;
  selectedSubReport.value = undefined;
  showDialogCreateNew.value = false;
};

const removeSubReport = async (subreport: JasperReport) => {
  await remove(subreport.id as number);
  emit('reportsChanged');
};
const hasSubReports = () => report.value.subReports?.length;
const { report } = toRefs(props);
</script>
