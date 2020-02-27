import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetMpd'
})
export default class extends Vue {
  @Prop() settings!: any;

  render(h: CreateElement): VNode {
    return h('div', ['MPD'])
  }
}
