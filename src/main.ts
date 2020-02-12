import Vue from 'vue'

import '@/styles/index.styl'

import App from '@/App.ts'
import store from '@/store'
import router from '@/router'
import i18n from '@/locales'

import ElementUI from 'element-ui'

import './registerServiceWorker'

import AppIcon from '@/components/app/AppIcon.vue'

Vue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.component('AppIcon', AppIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
