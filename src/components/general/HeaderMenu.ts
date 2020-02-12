import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'HeaderBlock'
})
export default class extends Vue {
  get classes() {
    const classes: any = {}
    const pre = 'header-menu'
    classes[pre] = true
    return classes
  }

  render(h): VNode {
    if (this.view === 'inPage') {
      return h('div', { class: this.classes }, [
        h('p', { on: { click: 'goBack' } }),
        h('div', { class: ['header-menu__active'] }, [
          h('h2', [this.$route.meta.headerTitle || 'current block'])
        ])
      ]
      )
    } else {
      return h('div', { class: this.classes }, [h('p', 'Active block')])
    }
  }

  get view(): string {
    if (this.$route.meta.headerTitle) {
      return 'inPage'
    }
    return 'index'
  }

  goBack(): void {
    this.$router.push({ name: 'index' })
  }
}
