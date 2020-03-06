import Vue from 'vue'
import Vuex from 'vuex'

import { SystemState } from './modules/system'
import { SettingsState } from './modules/settings'
import { PageState } from './modules/page'
import { CryptoState } from './modules/crypto'

Vue.use(Vuex)

export interface RootState {
  system: SystemState
  settings: SettingsState
  page: PageState
  crypto: CryptoState
}

// // Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({})
