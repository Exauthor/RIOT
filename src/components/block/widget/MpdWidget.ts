import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'

@Component({
  name: 'WidgetMpd'
})
export default class extends Vue {
  @Prop() settings!: any;

  socket: any
  wsUri: string = 'ws://localhost:3000'
  socketInfo: any = {}
  mpdInfo: any = {}
  // mpdHeaderInterface = [
  //   {
  //     icon: 'left',
  //     class: 'mpd-block__icon mpd-block__icon--arrow mpd-block__icon--arrow--prev',
  //     actions: ''
  //   },
  //   {
  //     icon: 'play',
  //     class: `mpd-block__icon mpd-block__icon--play ${this.mpdInfo.state === 'pause' && 'mpd-block__icon--play-stop'}`,
  //     innerHTML: '<div class="mpd-block__icon--play-line"></div>',
  //     actions: this.tooglePlayTrack
  //   },
  //   {
  //     icon: 'right',
  //     class: 'mpd-block__icon mpd-block__icon--arrow',
  //     actions: ''
  //   },
  //   {
  //     icon: 'repeat',
  //     class: 'mpd-block__icon mpd-block__icon--repeat',
  //     actions: ''
  //   }
  // ]

  get mpdHeaderInterface(): any {
    const mpdHeaderInterface = []
    mpdHeaderInterface.push({
      icon: 'left',
      class: 'mpd-block__icon mpd-block__icon--arrow mpd-block__icon--arrow--prev',
      actions: ''
    })
    mpdHeaderInterface.push({
      icon: 'play',
      class: `mpd-block__icon mpd-block__icon--play ${this.mpdInfo.state === 'pause' && 'mpd-block__icon--play-stop'}`,
      innerHTML: '<div class="mpd-block__icon--play-line"></div>',
      actions: this.tooglePlayTrack
    })
    mpdHeaderInterface.push({
      icon: 'right',
      class: 'mpd-block__icon mpd-block__icon--arrow',
      actions: ''
    })
    mpdHeaderInterface.push({
      icon: 'repeat',
      class: 'mpd-block__icon mpd-block__icon--repeat',
      actions: ''
    })
    return mpdHeaderInterface
  }

  get trackName(): string {
    const { artist, title, file } = this.mpdInfo
    if (artist || title) {
      return `${this.mpdInfo.artist} - ${this.mpdInfo.title}`
    }

    return file ? file.slice(file.lastIndexOf('/') + 1) : 'Unknow file'
  }

  render(h: CreateElement): VNode {
    if (this.mpdInfo.file) {
      return h('div', { class: 'mpd-block' },
        [
          h('div', { class: 'mpd-block__body' }, [
            h('div', { class: 'mpd-block__header' }, [
              h('h4', { class: 'mpd-block__title' }, this.trackName)
            ])
          ]),
          h('div', { class: 'mpd-block__music' }, [
            h('div', { class: 'mpd-block__header-interface' },
              this.mpdHeaderInterface.map((icon) => {
                const optionIcon: any = { class: icon.class }
                if (icon.innerHTML) {
                  optionIcon.domProps = {
                    innerHTML: icon.innerHTML
                  }
                }
                if (icon.actions) {
                  optionIcon.on = {
                    click: icon.actions
                  }
                }
                return h('div', optionIcon)
              })
            )
          ])
        ]
      )
    }
    return h('div', ['MPD not connected'])
  }

  nextTrack() {
    this.socket.send()
  }

  tooglePlayTrack(play: boolean) {
    this.socket.send(JSON.stringify({ type: play ? 'PLAY' : 'STOP' }))
  }

  mounted() {
    this.socket = new WebSocket(this.wsUri)
    const self = this
    this.socket.onopen = function(event: any) {
      console.log(event, 'open')
      // self.socket.send(JSON.stringify({ type: 'PLAY' }))
      self.socket.send(JSON.stringify({ type: 'STATUS' }))
    }
    this.socket.onclose = function(event: any) {
      console.log(event, 'close')
      this.socketInfo = { type: 'info', event }
    }
    this.socket.onmessage = function(event: any) {
      const answer = JSON.parse(event.data)
      console.log(answer, 'onmessage')
      switch (answer.type) {
        case 'STATUS': {
          self.mpdInfo = answer.data
        }
      }
      // onMessage(event)
    }
    this.socket.onerror = function(event: any) {
      console.log(event, 'onerror')
      this.socketInfo = { type: 'error', event }
    }
  }
}
