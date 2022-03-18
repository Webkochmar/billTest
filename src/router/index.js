import Vue from 'vue'
import VueRouter from 'vue-router'

import Catalog from "@/views/Main"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Catalog',
    component: Catalog
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
