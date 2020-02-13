import { Component, Vue } from 'vue-property-decorator'
import { PageModule } from '@/store/modules/page'
import noneLayout from '@/layout/none.ts'
import defaultLayout from '@/layout/default.ts'
import { SystemModule } from '@/store/modules/system'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'App',
  components: {
    noneLayout,
    defaultLayout
  }
})
export default class extends Vue {
  render(h: CreateElement): VNode {
    return h('component', { is: this.layout + 'Layout', attrs: { id: 'app' } }, [h('router-view')])
  }
  get os() {
    return SystemModule.os
  }

  get layout() {
    return PageModule.layout
  }
}
