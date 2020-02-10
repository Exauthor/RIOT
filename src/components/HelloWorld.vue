<template>
  <button @click="UpdateValue">
    clickMe: {{ os }}
  </button>
</template>

<script lang="ts">
import { SystemModule } from '@/store/modules/system'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  get os(): string {
    return SystemModule.os
  }
  UpdateValue(event: any) {
    console.log(event)
  }
}
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
