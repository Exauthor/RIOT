import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'
import { PageModule } from '@/store/modules/page'

import noneLayout from '@/layout/none.ts'
import defaultLayout from '@/layout/default.ts'

import { SystemModule } from '@/store/modules/system'
import { ColorModule } from '@/store/modules/color'

@Component({
  name: 'App',
  components: {
    noneLayout,
    defaultLayout
  }
})
export default class extends Vue {
  get layout() {
    return PageModule.layout
  }

  render(h: CreateElement): VNode {
    return h('component', { is: this.layout + 'Layout', attrs: { id: 'app' } }, [h('router-view')])
  }

  mounted() {
    SystemModule.getSystemInfo()
    ColorModule.setMainColors()
    setInterval(SystemModule.getSystemInfo, 30000)
  }
}
