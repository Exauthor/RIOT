import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { CryptoModule } from '@/store/modules/crypto'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetCrypto'
})
export default class CryptoWidget extends Vue {
  @Prop({ required: true, type: Object }) readonly settings!: any;

  render(h: CreateElement): VNode {
    if (this.view === 'list') {
      return h('div',
        { class: 'crypto-blocks' },
        this.coins.map((coin: any) => {
          return h('div', {
            class: ['crypto-block', `crypto-block--${parseFloat(coin.percent_change_24h) > 0 ? 'up' : 'down'}`]
          }, [
            h('AppIcon', { class: 'crypto-block__icon', props: { name: coin.id } }),
            h('div', { class: 'crypto-block__info' }, [
              h('div', { class: 'crypto-block__title' }, coin.symbol),
              h('div', { class: 'crypto-block__number' }, [
                h('div', { class: 'crypto-block__change' }, coin.percent_change_24h + '%'),
                h('div', { class: 'crypto-block__cost' }, this.formatNumber(coin.price_usd) + '$')
              ])
            ])
          ]
          )
        })
      )
    } else {
      return h('div', 'not support view')
    }
  }

  get coins() {
    return CryptoModule.getCoinsSequence()
  }

  get generalWidgetSettings() {
    return SettingsModule.getWidgetSettings('Crypto')
  }

  get amountOfBlocks(): number {
    return this.settings.size[0]
  }

  get view(): string {
    return this.settings.view || 'list'
  }

  formatNumber(cost: string): string {
    return String(parseFloat(cost.slice(0, -8)))
  }

  async mounted() {
    if (this.view === 'list') {
      await CryptoModule.fetchCoins()
    }
  }
}
