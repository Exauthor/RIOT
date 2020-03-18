import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

import MpdWidget from '@/components/block/widget/MpdWidget'
import CryptoWidget from '@/components/block/widget/CryptoWidget'
import SettingsWidget from '@/components/block/widget/SettingsWidget'
import AudioWidget from '@/components/block/widget/AudioWidget'

@Component({
  name: 'BlockClock',
  components: {
    MpdWidget,
    AudioWidget,
    CryptoWidget,
    SettingsWidget
  }
})
export default class extends Vue {
  render(h: CreateElement): VNode {
    return h('div', { class: 'settings__clock' }, [
      h('div', { class: 'settings__hour' }, [
        h('div', { class: 'settings__hour-path', ref: 'hourLine' })
      ]),
      h('div', { class: 'settings__minute' }, [
        h('div', { class: 'settings__minute-path', ref: 'minuteLine' })
      ]),
      h('div', { class: 'settings__second' }, [
        h('div', { class: 'settings__second-path', ref: 'secondLine' })
      ])
    ])
  }

  mounted() {
    this.startOneTick()
    setInterval(this.startOneTick, 1000)
  }

  startOneTick() {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    this.$refs.hourLine.style = `transform: rotate(${(hours % 12) * 30 + (minutes * (15 / 60))}deg)`
    this.$refs.minuteLine.style = `transform: rotate(${minutes * 6}deg)`
    this.$refs.secondLine.style = `transform: rotate(${seconds * 6}deg)`
  }
}
