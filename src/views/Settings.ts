import { Component, Vue } from 'vue-property-decorator'
import ChartPie from '@/components/block/ChartPie.ts'
import { ChartPieSetting } from '@/types'

@Component({
  name: 'SettingsPage',
  components: {
    ChartPie
  }
})
export default class extends Vue {
  temperatureSettings: ChartPieSetting = {
    percent: 0
  }

  memorySettings: ChartPieSetting = {
    percent: 0,
    value: 4200,
    pre: 'Mb',
    color: 'var(--color-active)',
    title: 'Memory'
  }

  render(h): VNode {
    return h('div', { class: 'about' }, [
      h(ChartPie, { props: { settings: this.temperatureSettings } }),
      h(ChartPie, { props: { settings: this.memorySettings } })
    ])
  }

  mounted() {
    setInterval(() => {
      this.temperatureSettings.percent = Math.floor(Math.random() * 20)
    }, 2000)
  }
}
