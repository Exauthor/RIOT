import { Component, Vue } from 'vue-property-decorator'
import HeaderMenu from '@/components/general/HeaderMenu.ts'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'LayoutDefault',
  components: {
    HeaderMenu
  }
})
export default class extends Vue {
  render(h: CreateElement): VNode {
    return h('div', [ h(HeaderMenu), this.$slots.default ])
  }
}
