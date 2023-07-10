<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title v-if="category.id">Editar Categoria</q-toolbar-title>
        <q-toolbar-title v-else>Cadastrar Categoria</q-toolbar-title>
      </q-toolbar>
    </div>
    <q-separator class="q-mb-md" />

    <q-card>
      <q-card-section class="row q-col-gutter-sm">
        <q-input
          label="Código"
          class="col-sm-12 col-md-2 col-lg-2"
          disable
          outlined
          v-if="category.id"
          v-model="category.id"
        />
        <q-input
          label="Descrição"
          class="col-sm-12 col-md-3 col-lg-5"
          outlined
          hint="Descrição da Categoria"
          v-model="category.description"
        />
        <q-select
          option-label="description"
          option-input-value="id"
          class="col-sm-12 col-md-3 col-lg-5"
          label="Categoria Pai"
          hint="Selecione a categoria pai"
          :options="categories"
          v-model="category.parent"
          @filter="categoryFilterFn"
          use-input
          :input-debounce="200"
          clearable
          outlined
        >
          <template v-slot:selected>
            {{ category.parent?.description }}&nbsp;
            <q-badge v-if="category.parent">{{
              category.parent?.path
            }}</q-badge>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <div v-if="scope.opt.parent">{{ scope.opt.description }}</div>
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
        <q-btn @click="save()" icon="save" color="primary" label="Salvar" />
        <q-btn
          @click="cancel()"
          icon="cancel"
          outline
          color="primary"
          label="Cancelar"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
const categoryEmpty = (): Category => {
  return {
    description: '',
    path: '',
  };
};

import { QBtn, useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategory } from '../../services/category/category.hook';
import { Category } from '../../models/category/category.model';

const { findById, findAll, update, create } = useCategory();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const category = ref<Category>(categoryEmpty());
const categories = ref<Category[]>([]);

onMounted(async () => {
  category.value.id = route.params.id as unknown as number;
  if (category.value.id) {
    category.value = await findById(category.value.id as number);
  }

  categories.value = await findAll('');
});

const categoryFilterFn = (
  val: string,
  update: (callbackFn: () => void, afterFn?: () => void) => void
) => {
  findAll(val, undefined, false).then((items) => {
    update(() => {
      categories.value = items;
    });
  });
};

const cancel = () => {
  router.push('/categories');
};

const save = async (): Promise<void> => {
  try {
    if (category.value.id) {
      console.log(category.value);
      await update(category.value, category.value.parent === undefined);
    } else {
      await create(category.value);
    }
    cancel();
    $q.notify({ message: 'Registro salvo com sucesso!', type: 'positive' });
  } catch (err) {}
};
</script>
<style></style>
