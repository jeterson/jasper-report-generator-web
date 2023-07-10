<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-primary" v-if="connectionConfig.id">
          <q-icon name="fa-solid fa-database" />
          Editar conexão com Banco de Dados</q-toolbar-title
        >
        <q-toolbar-title class="text-primary" v-else>
          <q-icon name="fa-solid fa-database" />
          Cadastrar conexão com Banco de Dados</q-toolbar-title
        >
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />

    <q-card>
      <q-card-section class="row q-col-gutter-sm">
        <q-input
          label="Código"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2"
          disable
          outlined
          v-if="connectionConfig.id"
          v-model="connectionConfig.id"
        />
        <q-input
          label="Nome"
          class="col-xs-12 col-sm-12 col-md-3 col-lg-5"
          outlined
          v-model="connectionConfig.name"
        />
        <q-input
          label="URL de conexão"
          class="col-xs-12 col-sm-12 col-md-3 col-lg-5"
          outlined
          v-model="connectionConfig.connectionUrl"
        />
        <q-input
          label="Banco de Dados"
          disable
          class="col-xs-12 col-sm-12 col-md-3 col-lg-5"
          outlined
          v-if="connectionConfig.id"
          v-model="connectionConfig.database"
        />
        <q-select
          v-else
          class="col-xs-12 col-sm-12 col-md-3 col-lg-5"
          label="Banco de Dados"
          :options="databases"
          v-model="connectionConfig.database"
          outlined
        />

        <div class="col-sm-12" v-if="connectionConfig.id">
          <q-btn
            color="info"
            outline
            :icon="isChangePasswordVisible ? 'close' : 'key'"
            @click="isChangePasswordVisible = !isChangePasswordVisible"
            :label="isChangePasswordVisible ? 'Fechar' : 'Alterar Credenciais'"
          />
        </div>

        <div
          class="col-sm-12"
          v-if="isChangePasswordVisible || !connectionConfig.id"
        >
          <q-card>
            <q-card-section class="row">
              <span class="col-sm-12 text-h5">Credenciais</span>
              <small class="col-sm-12">
                <q-banner dense rounded class="bg-info text-white">
                  <q-icon name="info" size="18px" />
                  Suas credenciais são armazenadas de forma segura!</q-banner
                >
              </small>
            </q-card-section>
            <q-card-section class="row q-col-gutter-sm">
              <q-input
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                outlined
                label="Usuário"
                v-model="connectionConfig.username"
              />
              <q-input
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                v-model="connectionConfig.password"
                outlined
                label="Senha"
                :type="isPassword ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPassword = !isPassword"
                  />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn @click="save()" icon="save" color="primary" label="Salvar" />
        <q-btn
          @click="cancel()"
          icon="cancel"
          color="primary"
          outline
          label="Cancelar"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import {
  ConectionConfigView,
  ReportDatabase,
} from 'src/models/connectionconfig/connection-config.model';
import { useConnectionConfig } from 'src/services/connectionconfig/connection-config.hook';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const connectionConfigEmpty = (): ConectionConfigView => {
  return {
    connectionUrl: '',
    name: '',
    status: { ok: false, message: '' },
    actions: [],
    password: '',
    username: '',
  };
};

const { update, create, findById, findAllAvailableDatabases } =
  useConnectionConfig();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const connectionConfig = ref<ConectionConfigView>(connectionConfigEmpty());
const databases = ref<ReportDatabase[]>([]);
const isPassword = ref<boolean>(true);
const isChangePasswordVisible = ref<boolean>(false);

onMounted(() => {
  setTimeout(async () => {
    if (route.params.id) {
      connectionConfig.value.id = route.params.id as unknown as number;
      connectionConfig.value = await findById(connectionConfig.value.id);
    }
    databases.value = (await findAllAvailableDatabases()).map(
      (x) => x as ReportDatabase
    );
  }, 50);
});

const cancel = () => {
  router.push('/connection-config');
};

const save = async (): Promise<void> => {
  try {
    if (connectionConfig.value.id) {
      await update(connectionConfig.value);
    } else {
      await create(connectionConfig.value);
    }
    cancel();
    $q.notify({ message: 'Registro salvo com sucesso!', type: 'positive' });
  } catch (err) {}
};
</script>
<style></style>
