import { Component, Prop, Vue } from 'vue-property-decorator'
import { WidgetBlock } from '@/types'
import CryptoWidget from '@/components/block/widget/crypto.ts'
import MpdWidget from '@/components/block/widget/mpd.ts'
import SettingsWidget from '@/components/block/widget/settings.ts'

@Component({
  name: 'WidgetBlock',
  components: {
    MpdWidget,
    CryptoWidget,
    SettingsWidget
  }
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) block!: WidgetBlock;

  render(h): VNode {
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
