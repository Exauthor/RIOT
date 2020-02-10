<template lang="pug">
  div(:class='classes' v-if='view === "inPage"')
    p(@click='goBack') back
    .header-menu__active
      h1 {{ this.$route.meta.headerTitle || 'current block' }}
  div(:class='classes' v-else)
    p Active block
</template>

<script lang="ts">
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
</script>
