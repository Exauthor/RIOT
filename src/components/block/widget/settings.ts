import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'settingsWidget'
})
export default class extends Vue {
  @Prop() settigns!: any;

  render(h: CreateElement): VNode {
    return h('div', { on: { click: this.goToPage } }, ['Settings'])
  }

  goToPage() {
    this.$router.push({ name: 'settings' })
  }
}
