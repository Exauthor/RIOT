import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface UtilsState {}

@Module({ dynamic: true, store, name: 'auth' })
class Utils extends VuexModule implements UtilsState {
  get getUUID() {
    return (): string => {
      let date = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (c) => {
          const r = (date + Math.random() * 16) % 16 | 0
          date = Math.floor(date / 16)
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )

      return uuid
    }
  }
}

export const UtilsModule = getModule(Utils)
