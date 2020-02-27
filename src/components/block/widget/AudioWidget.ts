import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetMpd'
})
export default class extends Vue {
  @Prop() settings!: any;

  render(h: CreateElement): VNode {
    return h('div', ['AudioWidget'])
  }

  mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()
        const audioChunks: any = []

        mediaRecorder.addEventListener('dataavailable', (event: any) => {
          audioChunks.push(event.data)
          console.log(event)
        })

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' })
          // this.downloadBlob(new Blob(audioChunks))
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audio.play()
        })

        setTimeout(() => {
          mediaRecorder.stop()
        }, 6000)
      })
  }

  downloadBlob(blob: any) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'audio.mp3'
    a.click()
  }
}
