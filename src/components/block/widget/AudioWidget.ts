import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

import { ColorModule } from '@/store/modules/color'

let audioContext: any = null
let mediaRecorder: any = null
let analyser: any = null
let bufferLength: any = null
let dataArray: any = null
let currentTimeInterval: any = null

@Component({
  name: 'AudioWidget'
})
export default class extends Vue {
  @Prop() settings!: any;

  isRecord: boolean = false
  currentTime: number = 0

  get audioRecordTitle(): string {
    if (this.isRecord || this.currentTime) {
      return `Audio in record${this.isRecord ? 'ing' : 'ed'}: ${this.currentTime} second${this.currentTime > 1 ? 's' : ''}`
    }
    return 'Start a record'
  }

  render(h: CreateElement): VNode {
    return h('div', { class: ['audio-block'] }, [
      h('div', { class: 'audio-block__header' }, [
        h('div', { class: 'audio-block__title' }, this.audioRecordTitle),
        h('div', { class: 'audio-block__actions' }, [
          this.isRecord || (mediaRecorder && mediaRecorder.state === 'pause')
            ? h('div', {
              class: 'audio-block__action audio-block__action--stop',
              on: {
                click: () => this.toggleRecord('stop')
              }
            })
            : undefined
        ])
      ]),
      h('div', { class: 'audio-block__body' }, [
        h('canvas', {
          class: 'audio-block__canvas',
          ref: 'canvas'
        }),
        h('div', {
          class: {
            'audio-block__record': true,
            'audio-block__record--active': this.isRecord
          },
          on: {
            click: this.toggleRecord
          }
        })
      ])
    ])
  }

  mounted() {
    this.toggleRecord()
  }

  toggleRecord(option?: string) {
    const self = this
    if (mediaRecorder && option === 'stop') {
      mediaRecorder.stop()
    } else if (!this.isRecord && mediaRecorder) {
      this.isRecord = true
      currentTimeInterval = setInterval(() => self.currentTime++, 1000)

      mediaRecorder.resume()
    } else if (!this.isRecord && !mediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream)
          mediaRecorder.start()

          if (mediaRecorder.state === 'recording') {
            this.isRecord = true
            currentTimeInterval = setInterval(() => self.currentTime++, 1000)
          }

          const audioChunks: any = []

          mediaRecorder.addEventListener('dataavailable', (event: any) => {
            audioChunks.push(event.data)
          })

          audioContext = new AudioContext()
          const source = audioContext.createMediaStreamSource(stream)

          analyser = audioContext.createAnalyser()
          analyser.fftSize = 2048
          bufferLength = analyser.frequencyBinCount
          dataArray = new Uint8Array(bufferLength)

          source.connect(analyser)
          self.draw()

          mediaRecorder.addEventListener('stop', (data: any) => {
            mediaRecorder = null

            this.isRecord = false
            this.currentTime = 0
            clearInterval(currentTimeInterval)
          })

          mediaRecorder.addEventListener('pause', (data: any) => {
            this.isRecord = false
            clearInterval(currentTimeInterval)
          })
        })
    } else {
      mediaRecorder.pause()
    }
  }

  draw() {
    const { canvas } = this.$refs
    const WIDTH = canvas.width
    const HEIGHT = canvas.height
    const canvasCtx = canvas.getContext('2d')

    requestAnimationFrame(this.draw)

    analyser.getByteTimeDomainData(dataArray)

    canvasCtx.fillStyle = ColorModule.bgDark
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

    canvasCtx.lineWidth = 1
    canvasCtx.strokeStyle = this.isRecord ? ColorModule.color : ColorModule.colorDarkest

    canvasCtx.beginPath()

    let sliceWidth = WIDTH * 1.0 / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0
      let y = v * HEIGHT / 2

      if (i === 0) {
        canvasCtx.moveTo(x, y)
      } else {
        canvasCtx.lineTo(x, y)
      }

      x += sliceWidth
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2)
    canvasCtx.stroke()
  }

  downloadBlob(blob: any) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'audio.mp3'
    a.click()
  }
}
