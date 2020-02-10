<template lang="pug">
  div(@click='goToPage') Settigns
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'settingsWidget'
})
export default class extends Vue {
  @Prop() settigns!: any;

  goToPage() {
    this.$router.push({ name: 'settings' })
  }
}
</script>
