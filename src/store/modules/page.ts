import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators'
import { IActiveBlock } from '@/types'
import store from '@/store'

export interface PageState {
  layout: string,
  activeBlocks: Array<IActiveBlock>,
  activeBlockLinks: Array<String>
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements PageState {
  layout = 'default'
  activeBlocks = []
  activeBlockLinks = []

  @Mutation
  UPDATE_ACTIVE_BLOCK(block: IActiveBlock): void {
    this.activeBlocks = [ block ]
    this.activeBlockLinks = [ block.id ]
  }

  get getActiveBlock() {
    const findById = (array: Array<IActiveBlock>, id: string) => array.find(block => block.id === id)
    let currentBlock: IActiveBlock | undefined
    let isExist: Boolean = true

    this.activeBlockLinks.forEach((link, index) => {
      if (isExist) {
        let findingBlocks = index === 0 ? this.activeBlocks : currentBlock ? currentBlock.children : undefined
        currentBlock = findingBlocks ? findById(findingBlocks, link) : undefined && (isExist = false)
      }
    })

    return currentBlock
  }
}

export const PageModule = getModule(Page)
