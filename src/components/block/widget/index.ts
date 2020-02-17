import { Component, Prop, Vue } from 'vue-property-decorator'
import { IWidgetBlock } from '@/types'
import CryptoWidget from '@/components/block/widget/crypto.ts'
import MpdWidget from '@/components/block/widget/mpd.ts'
import SettingsWidget from '@/components/block/widget/settings.ts'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetBlock',
  components: {
    MpdWidget,
    CryptoWidget,
    SettingsWidget
  }
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) block!: IWidgetBlock;

  render(h: CreateElement): VNode {
    return h('div', { class: this.classes }, [
      h('component', {
        is: this.block.component,
        props: {
          settings: this.block.settings
        }
      })
    ])
  }

  get classes() {
    const classes: any = {}
    const pre = 'widget-block'
    classes[pre] = true
    classes[`${pre}-width-${this.block.settings.size[0]}`] = true
    classes[`${pre}-height-${this.block.settings.size[1]}`] = true
    return classes
  }
}
