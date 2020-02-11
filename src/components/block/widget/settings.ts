import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'settingsWidget'
})
export default class extends Vue {
  @Prop() settigns!: any;

  render(h): Vnode {
    return h('div', { on: { click: this.goToPage } }, ['Settings'])
  }

  goToPage() {
    this.$router.push({ name: 'settings' })
  }
}
