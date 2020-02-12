import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import WidgetBlock from '@/components/block/widget/index.ts'

@Component({
  name: 'IndexPage',
  components: {
    WidgetBlock
  }
})
export default class extends Vue {
  render(h): VNode {
    return h('div', { class: 'home' }, [
      h('div', { class: 'container' },
        this.widgetBlocks.map((block, index) => {
          return h(WidgetBlock, { props: { block }, key: index })
        })
      )
    ])
  }

  get widgetBlocks() {
    return SettingsModule.widgetBlocks
  }
}
