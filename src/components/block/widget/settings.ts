import { Component, Prop, Vue } from 'vue-property-decorator'
import ChartPie from '@/components/block/ChartPie.ts'
import { CreateElement, VNode } from 'vue/types'

import { ChartPieSetting } from '@/types'

@Component({
  name: 'settingsWidget'
})
export default class extends Vue {
  @Prop() settings!: any;

  temperatureSettings: ChartPieSetting = {
    percent: 0
  }

  render(h: CreateElement): VNode {
    if (this.settings.view === 'chartPie') {
      return h('div', { on: { click: this.goToPage } }, [
        h(ChartPie, { props: { settings: this.temperatureSettings } })
      ])
    }
    return h('div', { on: { click: this.goToPage } }, ['Settings'])
  }

  goToPage() {
    this.$router.push({ name: 'settings' })
  }
}
