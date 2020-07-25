import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../views/layout';
import Home from '../views/home';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      {
        path: '/modules/list',
        name: 'modules-list',
        component: () =>
          import(/* webpackChunkName: "modules" */ '../views/modules/List')
      },
      {
        path: '/interface/list/:id',
        name: 'interface-list',
        component: () =>
          import(/* webpackChunkName: "interface-list" */ '../views/interface/List.vue')
      },
      {
        path: '/interface/detail/:id',
        name: 'interface-detail',
        component: () =>
          import(/* webpackChunkName: "interface-detail" */ '../views/interface/Detail.vue')
      },
      {
        path: '/import-data',
        name: 'import-data',
        component: () =>
          import(/* webpackChunkName: "import-data" */ '../views/import-data')
      },
      {
        path: '/test-api',
        name: 'test-api',
        component: () =>
          import(/* webpackChunkName: "test-api" */ '../views/test-api')
      },
      {
        path: '/manual',
        name: 'manual',
        component: () =>
          import(/* webpackChunkName: "manual" */ '../views/manual')
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
