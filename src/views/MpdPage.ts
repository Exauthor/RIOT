import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import WidgetBlock from '@/components/block/widget/BlockWidget'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'MpdPage',
  components: {
    WidgetBlock
  }
})
export default class extends Vue {
  render(h: CreateElement): VNode {
    return h('div', { class: 'home' }, [
      h('div', { class: 'container' }, ['VALUE']
      )
    ])
  }
}
