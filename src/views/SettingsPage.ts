import { Component, Vue } from 'vue-property-decorator'
// import ChartPie from '@/components/block/ChartPie.ts'
import { IChartPieSetting, IWidgetBlock } from '@/types'
import { CreateElement, VNode } from 'vue/types'

import WidgetBlock from '@/components/block/widget/index.ts'

@Component({
  name: 'SettingsPage'
})
export default class extends Vue {
  settingsBlocks: Array<IWidgetBlock> = [
    {
      title: 'Settings',
      component: 'SettingsWidget',
      settings: {
        size: [3, 3],
        view: 'chartPie',
        chartSettings: {
          percent: 0
        }
      }
    },
    {
      title: 'Settings',
      component: 'SettingsWidget',
      settings: {
        size: [3, 3],
        view: 'chartPie',
        chartSettings: {
          percent: 0,
          value: 4200,
          pre: 'Mb',
          color: 'var(--color-active)',
          title: 'Memory'
        }
      }
    }
  ]

  render(h: CreateElement): VNode {
    return h('div', { class: 'settings-page' },
      this.settingsBlocks.map((block, index) => {
        return h(WidgetBlock, { props: { block }, key: index })
      })
    )
  }
}
