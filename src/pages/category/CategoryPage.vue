<template>
  <q-page padding>
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-primary">
          <q-icon name="fa-solid fa-file" /> Categorias</q-toolbar-title
        >
        <q-btn
          @click="goToNewPage()"
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
          v-model="searchExpanded"
          icon="search"
          label="Pesquisar"
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
        >
          <div>
            <q-card-section class="row q-col-gutter-sm">
              <q-input
                class="col-sm-12 col-md-6 col-lg-6"
                outlined
                v-model="categorySearch.description"
                label="Descrição"
              />
              <q-select
                class="col-sm-12 col-md-6 col-lg-6"
                clearable
                option-value="id"
                option-label="description"
                :options="parentCategories"
                v-model="categorySearch.parentCategory"
                label="Categoria Pai"
                outlined
                use-input
                input-debounce="200"
                @filter="categoryFilterFn"
              >
                <template v-slot:selected>
                  {{ categorySearch.parentCategory?.description }}&nbsp;
                  <q-badge v-if="categorySearch.parentCategory">{{
                    categorySearch.parentCategory?.path
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

    <q-table :rows="categories" :columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="parent" :props="props">
            {{ props.row.parent?.description }}
          </q-td>
          <q-td key="path" :props="props">
            {{ props.row.path }}
          </q-td>

          <q-td key="actions" :props="props">
            <q-btn
              @click="goToEditPage(props.row.id)"
              icon="fa-regular fa-pen-to-square"
              flat
              color="secondary"
              round
              dense
            ></q-btn>
            <q-btn
              @click="deleteCategory(props.row)"
              icon="fa-solid fa-trash-can"
              flat
              round
              color="negative"
              outline
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

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategory } from '../../services/category/category.hook';
import { CategoryView } from '../../models/category/category.model';

interface CategorySearch {
  description: string;
  parentCategory: CategoryView | undefined;
}

const { findAll, remove, findColumns } = useCategory();
const $q = useQuasar();
const router = useRouter();
const columns = ref<QTableColumn[]>([]);
const categorySearch = ref<CategorySearch>({
  description: '',
  parentCategory: undefined,
});

const searchExpanded = ref(true);

const categories = ref<CategoryView[]>([]);
const parentCategories = ref<CategoryView[]>([]);

onMounted(async () => {
  search();
  searchParentCategories();
  columns.value = await findColumns();
});

const goToNewPage = () => {
  router.push('categories/new');
};

const search = async () => {
  categories.value = await findAll(
    categorySearch.value.description,
    categorySearch.value.parentCategory?.id
  );
};

const categoryFilterFn = (
  val: string,
  update: (callbackFn: () => void, afterFn?: () => void) => void
) => {
  findAll(val, undefined, false).then((categories) => {
    update(() => {
      parentCategories.value = categories;
    });
  });
};

const searchParentCategories = async () => {
  parentCategories.value = await findAll('');
};

const goToEditPage = (id: number) => {
  router.push(`categories/${id}/edit`);
};

const deleteCategory = (category: CategoryView) => {
  $q.dialog({
    title: 'Atenção',
    message: `Deseja deletar a categoria ${category.description}`,
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
