import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'LayoutNone'
})
export default class extends Vue {
  render(h): VNode {
    return this.$slots.default
  }
}
