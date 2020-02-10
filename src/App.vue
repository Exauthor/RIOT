<template>
  <component
    :is="layout + 'Layout'"
    id="app"
  >
    <router-view />
  </component>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PageModule } from '@/store/modules/page'
import noneLayout from '@/layout/none.vue'
import defaultLayout from '@/layout/default.vue'
import { SystemModule } from '@/store/modules/system'

@Component({
  name: 'App',
  components: {
    noneLayout,
    defaultLayout
  }
})
export default class extends Vue {
  get os() {
    return SystemModule.os
  }

  get layout() {
    return PageModule.layout
  }
}
</script>
