import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

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

  render(h: CreateElement): VNode {
    if (this.view === 'inPage') {
      return h('div', { class: this.classes }, [
        h('p', { on: { click: this.goBack } }, [ 'go back' ]),
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
