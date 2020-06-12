import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Modules from '../views/modules'
import Block from '../views/block'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: 'modules/list'
    // component: Home
  },
  {
    path: '/import-data',
    name: 'import-data',
    // route level code-splitting
    // this generates a separate chunk (import-data.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "import-data" */ '../views/import-data')
  },
  {
    path: '/modules/list',
    name: 'modules-list',
    component: Modules.List
  },
  {
    path: '/block/list/:id',
    name: 'block-list',
    component: Block.List
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
