import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'LayoutNone'
})
export default class extends Vue {
  render(h: CreateElement): VNode {
    return h('div', { class: 'root' }, this.$slots.default)
  }
}
