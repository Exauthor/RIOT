<template lang="pug">
  div
    HeaderMenu
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeaderMenu from '@/components/general/HeaderMenu.vue'

@Component({
  name: 'LayoutDefault',
  components: {
    HeaderMenu
  }
})
export default class extends Vue {}
</script>
