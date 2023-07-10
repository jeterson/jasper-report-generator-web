import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'connection-config',
        component: () =>
          import('pages/connectionconfig/ConnectionConfigPage.vue'),
      },
      {
        path: 'connection-config/:id/edit',
        component: () =>
          import('pages/connectionconfig/CreateOrEditConnectionConfigPage.vue'),
      },
      {
        path: 'connection-config/new',
        component: () =>
          import('pages/connectionconfig/CreateOrEditConnectionConfigPage.vue'),
      },
      {
        path: 'categories',
        component: () => import('pages/category/CategoryPage.vue'),
      },
      {
        path: 'categories/new',
        component: () => import('pages/category/CreateOrEditCategoryPage.vue'),
      },
      {
        path: 'categories/:id/edit',
        component: () => import('pages/category/CreateOrEditCategoryPage.vue'),
      },

      {
        path: 'reports/:id/edit',
        component: () => import('pages/reports/CreateOrEditReportPage.vue'),
      },
      {
        path: 'reports/new',
        component: () => import('pages/reports/CreateOrEditReportPage.vue'),
      },
      {
        path: 'reports',
        component: () => import('pages/reports/ReportPage.vue'),
      },
      {
        path: 'reports',
        component: () => import('pages/reports/ReportPage.vue'),
      },
      {
        path: 'generate-reports',
        component: () =>
          import('pages/reports/generatereport/GenerateReportPage.vue'),
      },
      {
        path: 'generate-reports/:reportId',
        component: () =>
          import('pages/reports/generatereport/GenerateReportPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
