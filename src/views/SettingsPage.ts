import { Component, Vue } from 'vue-property-decorator'
import { IChartPieSetting, IWidgetBlock } from '@/types'
import { CreateElement, VNode } from 'vue/types'

import { UtilsModule } from '@/store/modules/utils'

import WidgetBlock from '@/components/block/widget/BlockWidget'

@Component({
  name: 'SettingsPage'
})
export default class extends Vue {
  settingsBlocks: Array<IWidgetBlock> = [
    {
      id: UtilsModule.getUUID(),
      title: 'RAM Computer',
      component: 'SettingsWidget',
      size: [3, 3],
      view: 'chartPie',
      chartSettings: {
        value: {
          current: 22
        }
      }
    },
    {
      id: UtilsModule.getUUID(),
      title: 'Temperature CPU Computer',
      component: 'SettingsWidget',
      size: [3, 3],
      view: 'chartPie',
      chartSettings: {
        value: {
          current: 4200,
          max: 16000
        },
        pre: 'Mb',
        color: 'var(--color-active)',
        title: 'Memory'
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
