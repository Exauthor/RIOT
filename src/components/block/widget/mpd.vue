<template lang="pug">
  div MPD
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'CryptoWidget'
})
export default class extends Vue {
  @Prop() settigns!: any;
}
</script>
