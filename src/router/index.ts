import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/IndexPage'
import Settings from '../views/SettingsPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      layout: 'none'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      headerTitle: 'Settings',
      layout: 'none'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
