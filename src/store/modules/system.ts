import { Module, VuexModule, Mutation, getModule, Action } from 'vuex-module-decorators'
import { ISystemBlock, IValueInterface } from '@/types'
import store from '../index'
import axios from 'axios'

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
      value: {
        current: 0
      }
    },
    {
      id: 'system-ram',
      title: 'RAM',
      value: {
        current: 0
      }
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
  async getSystemInfo() {
    const info: any = await axios.get('http://localhost:3000/system')
    const updateBlock = (id: string, value: IValueInterface) => this.updateSystemInfoBlock({ id, body: { value } })

    updateBlock('temperature-cpu', { current: info.data.cpuTemperature.temperature })
    updateBlock('system-ram', { current: info.data.memory.usedMemory, max: info.data.memory.totalMemory })
  }

  @Action
  async fetchSystemSettings() {
    setInterval(() => {
      this.updateSystemInfoBlock({
        id: 'temperature-cpu',
        body: {
          value: {
            current: Math.floor(Math.random() * 100)
          }
        }
      })
    }, 3000)
  }
}

export const SystemModule = getModule(System)
