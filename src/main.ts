import Vue from 'vue'

import '@/styles/index.styl'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'

import './registerServiceWorker'

import AppIcon from '@/components/app/AppIcon.vue'

Vue.component('AppIcon', AppIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
