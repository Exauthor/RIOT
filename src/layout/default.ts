import { Component, Vue } from 'vue-property-decorator'
import HeaderMenu from '@/components/general/HeaderMenu.ts'

@Component({
  name: 'LayoutDefault',
  components: {
    HeaderMenu
  }
})
export default class extends Vue {
  render(h): VNode {
    return h('div', [ h(HeaderMenu), this.$slots.default ])
  }
}
