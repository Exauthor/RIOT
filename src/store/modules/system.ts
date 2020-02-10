import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '../index'

export interface SystemState {
  os: string,
}

@Module({ dynamic: true, store, name: 'system' })
export class System extends VuexModule implements SystemState {
  os = 'Arch'

  @Mutation
  plus(delta: string) {
    this.os += delta
  }
}

export const SystemModule = getModule(System)
