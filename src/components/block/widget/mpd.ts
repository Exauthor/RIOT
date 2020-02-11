import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'CryptoWidget'
})
export default class extends Vue {
  @Prop() settigns!: any;

  render(h): Vnode {
    return h('div', ['MPD'])
  }
}
