import { Component, Prop, Vue } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue/types'
import { IMpdHeaderInterface } from '@/types'
import ChartBar from '@/components/block/ChartBar.ts'

import { MpdModule } from '@/store/modules/MpdModule'

@Component({
  name: 'MpdWidget'
})
export default class extends Vue {
  @Prop() settings!: any;

  currentTime = 0

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
      class: `mpd-block__icon mpd-block__icon--play ${MpdModule.mpdTrackInfo && MpdModule.mpdTrackInfo.state === 'pause' && 'mpd-block__icon--play-stop'}`,
      innerHTML: '<div class="mpd-block__icon--play-line"></div>',
      actions: {
        function: MpdModule.togglePlayTrack
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

  render(h: CreateElement): VNode {
    if (MpdModule.mpdTrackInfo && MpdModule.mpdTrackInfo.file) {
      return h('div', { class: 'mpd-block' },
        [
          h('div', { class: 'mpd-block__body' }, [
            h('div', { class: 'mpd-block__header' }, [
              h('h4', { class: 'mpd-block__title' }, MpdModule.trackName)
            ]),
            h('div', { class: 'mpd-block__chart' }, [
              h(ChartBar, {
                key: MpdModule.trackName,
                on: { updateTime: this.updateTime },
                props: {
                  settings: {
                    currentTime: this.currentTime,
                    allTime: parseInt(MpdModule.mpdTrackInfo.time.split(':')[1])
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
                    click: () => icon.actions.function(...(icon.actions.arguments || []))
                  }
                }
                return h('div', optionIcon)
              })
            ),
            h('div', { class: 'mpd-block__track-list' },
              MpdModule.tracks.map(track => {
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
    MpdModule.sendCommand({ command: position === 1 ? 'NEXT' : 'PREVIOUS' })
  }

  setPlayTrackById(id: number) {
    MpdModule.sendCommand({ command: 'SET_TRACK', arg: id })
  }

  toggleRepeat() {
    console.log('Toggle repeat')
  }

  updateTime(time: number) {
    this.currentTime = time

    MpdModule.sendCommand({ command: 'UPDATE_TIME', arg: time })
  }

  async mounted() {
    await MpdModule.setConnection()
    setInterval(() => {
      this.currentTime = MpdModule.getCurrentTime()
    }, 1000)
  }
}
