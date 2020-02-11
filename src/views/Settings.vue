<template lang='pug'>
  .about
    ChartPie(:settings='temperatureSettings')
    ChartPie(:settings='memorySettings')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import ChartPie from '@/components/block/ChartPie.ts'
// eslint-disable-next-line no-unused-vars
import { ChartPieSetting } from '@/types'

@Component({
  name: 'SettingsPage',
  components: {
    ChartPie
  }
})
export default class extends Vue {
  temperatureSettings: ChartPieSetting = {
    percent: 0
  }

  memorySettings: ChartPieSetting = {
    percent: 0,
    value: 4200,
    pre: 'Mb',
    color: 'var(--color-active)',
    title: 'Memory'
  }

  mounted() {
    setInterval(() => {
      this.temperatureSettings.percent = Math.floor(Math.random() * 20)
    }, 2000)
  }
}
</script>
