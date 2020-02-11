<template lang="pug">
  .home
    .container
       WidgetBlock(v-for='(block, index) in widgetBlocks' :block='block' :key='index')
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import WidgetBlock from '@/components/block/widget/index.ts'

@Component({
  name: 'IndexPage',
  components: {
    WidgetBlock
  }
})
export default class extends Vue {
  get widgetBlocks() {
    return SettingsModule.widgetBlocks
  }
}
</script>
