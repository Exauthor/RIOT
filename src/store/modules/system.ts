import { Module, VuexModule, Mutation, getModule, Action } from 'vuex-module-decorators'
import { ISystemBlock } from '@/types'
import store from '../index'

export interface SystemState {
  os: string,
  systemInfoBlocks: Array<ISystemBlock>
}

interface IUpdateSystemInfoBlock{
  id: string,
  body: any
}

@Module({ dynamic: true, store, name: 'system' })
export class System extends VuexModule implements SystemState {
  os = 'Arch'
  systemInfoBlocks = [
    {
      id: 'temperature-cpu',
      title: 'Temp cpu',
      value: 50
    },
    {
      id: 'system-ram',
      title: 'RAM',
      value: 2100,
      maxValue: 16000,
      minValue: 0
    }
  ]

  get getSystemInfoBlock() {
    return (id: string): ISystemBlock | undefined => this.systemInfoBlocks.find(block => block.id === id)
  }

  @Mutation
  updateSystemInfoBlock(newBlock: IUpdateSystemInfoBlock) {
    const index = this.systemInfoBlocks.findIndex(block => block.id === newBlock.id)
    this.systemInfoBlocks[index] = Object.assign(this.systemInfoBlocks[index], newBlock.body)
  }

  @Action
  async fetchSystemSettings() {
    setInterval(() => {
      this.updateSystemInfoBlock({
        id: 'temperature-cpu',
        body: {
          value: Math.floor(Math.random() * 100)
        }
      })
    }, 3000)
  }
}

export const SystemModule = getModule(System)
