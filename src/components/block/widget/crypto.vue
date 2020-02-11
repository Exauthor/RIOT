<template lang="pug">
  .crypto-blocks(v-if='view === "list"')
    .crypto-block(
      v-for='(coin, index) in coins'
      :class='{ [`crypto-block--${parseFloat(coin.percent_change_24h) > 0 ? "up": "down"}`]: true }'
    )
      AppIcon.crypto-block__icon(:name='coin.id')
      .crupto-block__info
        .crupto-block__title {{ coin.symbol }}
        .crupto-block__change {{ coin.percent_change_24h }}%
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
// eslint-disable-next-line no-unused-vars
import { WidgetBlockGeneralSettings } from '@/types'
import axios from 'axios'

@Component({
  name: 'CryptoWidget'
})
export default class CryptoWidget extends Vue {
  @Prop({ required: true, type: Object }) readonly settings!: any;

  coins = []

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
</script>
