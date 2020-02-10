import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface PageState {
  layout: string
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements PageState {
  layout = 'default'
}

export const PageModule = getModule(Page)
