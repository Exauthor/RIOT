import { Component, Prop, Vue } from 'vue-property-decorator'
import ChartPie from '@/components/block/ChartPie.ts'
import BlockClock from '@/components/block/items/BlockClock.ts'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetSettings'
})
export default class extends Vue {
  @Prop() settings!: any;

  render(h: CreateElement): VNode {
    if (this.settings.view === 'chartPie') {
      return h('div', [
        h(ChartPie, { props: { settings: this.settings.chartSettings } })
      ])
    } else if (this.settings.view === 'clock') {
      return h(BlockClock)
    }
    return h('div', `Settings - Don't handle view: ${this.settings.view}`)
  }
}
