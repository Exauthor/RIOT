<template lang="pug">
  div(:class='classes')
    component(:is='block.component' :settings='block.settings')
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// eslint-disable-next-line no-unused-vars
import { WidgetBlock } from '@/types'
import CryptoWidget from '@/components/block/widget/crypto.vue'
import MpdWidget from '@/components/block/widget/mpd.vue'
import SettingsWidget from '@/components/block/widget/settings.vue'

@Component({
  name: 'WidgetBlock',
  components: {
    MpdWidget,
    CryptoWidget,
    SettingsWidget
  }
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) block!: WidgetBlock;

  get classes() {
    const classes: any = {}
    const pre = 'widget-block'
    classes[pre] = true
    classes[`${pre}-width-${this.block.settings.size[0]}`] = true
    classes[`${pre}-height-${this.block.settings.size[1]}`] = true
    return classes
  }
}
</script>
