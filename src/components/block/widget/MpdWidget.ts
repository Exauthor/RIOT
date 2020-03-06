import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'
import { IMpdHeaderInterface, IMpdTrackStatus } from '@/types'
import ChartBar from '@/components/block/ChartBar.ts'

@Component({
  name: 'MpdWidget'
})
export default class extends Vue {
  @Prop() settings!: any;

  socket: any
  wsUri: string = 'ws://localhost:3000'
  socketInfo: any = {}
  mpdInfo: IMpdTrackStatus | null = null
  intervalTimer: any = null
  currentTime: number = 0
  tracks: any[] = [
    {
      title: 'Летов - всё как у людей'
    }
  ]

  get mpdHeaderInterface() {
    const mpdHeaderInterface: IMpdHeaderInterface[] = []
    mpdHeaderInterface.push({
      icon: 'left',
      class: 'mpd-block__icon mpd-block__icon--arrow mpd-block__icon--arrow--prev',
      actions: {
        function: this.setPlayTrack,
        arguments: [-1]
      }
    })
    mpdHeaderInterface.push({
      icon: 'play',
      class: `mpd-block__icon mpd-block__icon--play ${this.mpdInfo && this.mpdInfo.state === 'pause' && 'mpd-block__icon--play-stop'}`,
      innerHTML: '<div class="mpd-block__icon--play-line"></div>',
      actions: {
        function: this.togglePlayTrack
      }
    })
    mpdHeaderInterface.push({
      icon: 'right',
      class: 'mpd-block__icon mpd-block__icon--arrow',
      actions: {
        function: this.setPlayTrack,
        arguments: [1]
      }
    })
    mpdHeaderInterface.push({
      icon: 'repeat',
      class: 'mpd-block__icon mpd-block__icon--repeat',
      actions: {
        function: this.toggleRepeat
      }

    })
    return mpdHeaderInterface
  }

  get trackName(): string {
    if (!this.mpdInfo) return 'Not a file'

    const { artist, title, file } = this.mpdInfo
    if (artist || title) {
      return `${this.mpdInfo.artist} - ${this.mpdInfo.title}`
    }

    return file ? this.formatTrackFromFile(file) : 'Unknown file'
  }

  render(h: CreateElement): VNode {
    if (this.mpdInfo && this.mpdInfo.file) {
      return h('div', { class: 'mpd-block' },
        [
          h('div', { class: 'mpd-block__body' }, [
            h('div', { class: 'mpd-block__header' }, [
              h('h4', { class: 'mpd-block__title' }, this.trackName)
            ]),
            h('div', { class: 'mpd-block__chart' }, [
              h(ChartBar, {
                key: this.trackName,
                on: {
                  updateTime: this.updateTime
                },
                props: {
                  settings: {
                    currentTime: this.currentTime,
                    allTime: parseInt(this.mpdInfo.time.split(':')[1])
                  }
                }
              })
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
                if (icon.actions && icon.actions.function) {
                  optionIcon.on = {
                    click: () => {
                      return icon.actions.function(...(icon.actions.arguments || []))
                    }
                  }
                }
                return h('div', optionIcon)
              })
            ),
            h('div', { class: 'mpd-block__track-list' },
              this.tracks.map(track => {
                return h('div', {
                  class: 'mpd-block__track-item',
                  on: {
                    click: () => this.setPlayTrackById(track.id)
                  }
                }, track.title)
              })
            )
          ])
        ]
      )
    }
    return h('div', ['MPD not connected'])
  }

  formatTrackFromFile(track: string) {
    return track.slice(track.lastIndexOf('/') + 1)
  }

  setPlayTrack(position: number) {
    this.sendCommand(position === 1 ? 'NEXT' : 'PREVIOUS')
  }

  setPlayTrackById(id: number) {
    this.sendCommand('SET_TRACK', id)
  }

  toggleRepeat() {
    console.log('Toggle repeat')
  }

  updateTime(time: number) {
    this.sendCommand('UPDATE_TIME', time)
  }

  async togglePlayTrack(play?: boolean) {
    if (play || (this.mpdInfo && this.mpdInfo.state === 'pause')) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = setInterval(() => this.currentTime++, 1000)
      this.sendCommand('PLAY')
    } else {
      clearInterval(this.intervalTimer)
      this.sendCommand('PAUSE')
    }
  }

  sendCommand(command: string, arg?: any) {
    this.socket.send(JSON.stringify({ type: command, data: arg || {} }))
  }

  mounted() {
    this.socket = new WebSocket(this.wsUri)
    const self = this
    this.socket.onopen = function(event: any) {
      self.sendCommand('STATUS')
      self.sendCommand('PLAYLIST')
    }
    this.socket.onclose = function(event: any) {
      this.socketInfo = { type: 'info', event }
    }
    this.socket.onmessage = function(event: any) {
      const answer = JSON.parse(event.data)
      switch (answer.type) {
        case 'STATUS':
          self.mpdInfo = answer.data
          self.currentTime = parseInt(answer.data.time.split(':')[0])
          if (answer.data.state === 'play') {
            clearInterval(self.intervalTimer)
            self.intervalTimer = setInterval(() => self.currentTime++, 1000)
          }
          break
        case 'PLAYLIST':
          self.tracks = [...new Set(Object.entries(answer.data)
            .map((track: any) => Object({
              title: self.formatTrackFromFile(track[1]),
              id: parseInt(track[0].split(':')[0]) + 1
            }))
            .map(music => JSON.stringify({ title: music.title })))].map((music, index) => Object.assign(JSON.parse(music), { id: index + 1 }))

          break
      }
    }
    this.socket.onerror = function(event: any) {
      this.socketInfo = { type: 'error', event }
    }
  }
}
