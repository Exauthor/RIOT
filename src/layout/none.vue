<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'LayoutNone'
})
export default class extends Vue {}
</script>
