import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { WidgetBlockGeneralSettings } from '@/types'
import { CreateElement, VNode } from 'vue/types'
import axios from 'axios'

@Component({
  name: 'CryptoWidget'
})
export default class CryptoWidget extends Vue {
  @Prop({ required: true, type: Object }) readonly settings!: any;

  coins = []

  render(h: CreateElement): VNode {
    if (this.view === 'list') {
      return h('div',
        { class: 'crypto-blocks' },
        this.coins.map((coin: any, index) => {
          return h('div', {
            class: ['crypto-block', `crypto-block--${parseFloat(coin.percent_change_24h) > 0 ? 'up' : 'down'}`]
          }, [
            h('AppIcon', { class: 'crypto-block__icon', props: { name: coin.id } }),
            h('div', { class: 'crupto-block__info' }, [
              h('div', { class: 'crupto-block__title' }, coin.symbol),
              h('div', { class: 'crupto-block__change' }, coin.percent_change_24h + '%')
            ])
          ]
          )
        })
      )
    } else {
      return h('div', 'not support view')
    }
  }

  get generallWidgetSettings(): WidgetBlockGeneralSettings | undefined {
    return SettingsModule.getWidgetSettings('Crypto')
  }
  get amountOfBlocks(): number {
    return this.settings.size[0]
  }
  get view(): string {
    return this.settings.view || 'list'
  }
  get coinsSequence(): Array<string> {
    return ['bitcoin', 'ethereum', 'cardano', 'neo']
  }

  async mounted() {
    if (this.view === 'list') {
      const response: any = await axios('https://api.coinmarketcap.com/v1/ticker/')
      this.coins = response.data.filter((coin: any) => this.coinsSequence.includes(coin.id))
    }
  }
}
