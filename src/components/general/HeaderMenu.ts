import { Component, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'
import { PageModule } from '@/store/modules/page'
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
    if (this.$route.meta.headerTitle) {
      return h('div', { class: this.classes }, [
        h('p', { on: { click: this.goBack } }, [ 'go back' ]),
        h('div', { class: ['header-menu__active'] }, [
          h('h2', [this.currentText])
        ])
      ]
      )
    } else {
      return h('div', { class: this.classes }, [h('p', this.currentText)])
    }
  }

  get currentText(): string {
    const block = PageModule.getActiveBlock
    const headerTitle = this.$route.meta.headerTitle
    if (block) {
      return block.title || block.id
    } else if (headerTitle) {
      return headerTitle
    }
    return 'Default text'
  }

  goBack(): void {
    this.$router.push({ name: 'index' })
  }
}
