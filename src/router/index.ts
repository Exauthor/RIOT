import Vue from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import IndexPage from '../views/IndexPage'
import MpdPage from '../views/MpdPage'
import SettingsPage from '../views/SettingsPage'

Vue.use(VueRouter)

interface IRouterMeta {
  meta: {
    headerTitle: string
  }
}

const routes: Array<RouteConfig & IRouterMeta> = [
  {
    path: '/',
    name: 'index',
    component: IndexPage,
    meta: {
      headerTitle: 'Main Page'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: {
      headerTitle: 'Settings'
    }
  },
  {
    path: '/mpd',
    name: 'mpd',
    component: MpdPage,
    meta: {
      headerTitle: 'MPD'
    }
  }
]

const router: VueRouter = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: Function) => {
  document.title = to.meta.headerTitle
  next()
})

export default router
