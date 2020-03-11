import { Module, VuexModule, getModule, Action, Mutation } from 'vuex-module-decorators'
import { IMpdHeaderInterface, IMpdTrackStatus, ITrack } from '@/types'

import store from '@/store'

export interface MpdState {
  mpdTrackInfo: IMpdTrackStatus | null
  isConnect: boolean
  wsUri: string
  tracks: ITrack[]
}

let MpdSocket: any = null
let intervalTimer: number | null = null
let currentTime = 0

@Module({ dynamic: true, store, name: 'mpd' })
class Mpd extends VuexModule implements MpdState {
  mpdTrackInfo = null
  wsUri = 'ws://localhost:3000'
  isConnect = false
  tracks = []

  @Mutation
  SET_MPD_STATE<T extends MpdState, P extends keyof MpdState>({ key, value }: { key: P, value: T[P] }) {
    (this as any)[key] = value
  }

  get getCurrentTime() {
    return () => currentTime
  }

  get trackName(): string {
    if (this.mpdTrackInfo === null) return 'Not a file'

    const { artist, title, file } = this.mpdTrackInfo
    if (artist || title) {
      return `${artist} - ${title}`
    }

    return file ? this.formatTrackFromFile(file) : 'Unknown file'
  }

  get formatTrackFromFile() {
    return (track: string) => track.slice(track.lastIndexOf('/') + 1)
  }

  @Action
  sendCommand({ command, arg }: {command: string, arg?: any}) {
    MpdSocket.send(JSON.stringify({ type: command, data: arg || {} }))
  }

  @Action
  async togglePlayTrack(play?: boolean) {
    if ((play || (this.mpdTrackInfo !== null && this.mpdTrackInfo.state === 'pause'))) {
      if (intervalTimer) {
        clearInterval(intervalTimer)
      }

      intervalTimer = setInterval(() => currentTime++, 1000)
      this.sendCommand({ command: 'PLAY' })
    } else if (intervalTimer) {
      clearInterval(intervalTimer)
      this.sendCommand({ command: 'PAUSE' })
    }
  }

  @Action
  setConnection() {
    if (MpdSocket) {
      console.log('Already connect to MPD')
      return
    }

    MpdSocket = new WebSocket(this.wsUri)
    const self = this

    MpdSocket.onopen = function(event: any) {
      self.sendCommand({ command: 'STATUS' })
      self.sendCommand({ command: 'PLAYLIST' })
    }

    MpdSocket.onclose = function(event: any) {
      this.socketInfo = { type: 'info', event }
    }

    MpdSocket.onmessage = function(event: any) {
      const answer = JSON.parse(event.data)

      const generateUniqueTracks = (tracks: Object): Array<string> => {
        return [...new Set(Object.entries(tracks).map(([id, title]) => title))]
      }
      const convertTracksFromStrings = (tracks: Array<string>) => {
        return tracks.map((track, index): ITrack => Object({
          title: self.formatTrackFromFile(track),
          id: index + 1
        }))
      }

      switch (answer.type) {
        case 'STATUS':
          self.SET_MPD_STATE({ key: 'mpdTrackInfo', value: answer.data })
          currentTime = parseInt(answer.data.time.split(':')[0])

          if (answer.data.state === 'play') {
            if (intervalTimer) {
              clearInterval(intervalTimer)
            }
            intervalTimer = setInterval(() => currentTime++, 1000)
          }

          break
        case 'PLAYLIST':
          self.SET_MPD_STATE({ key: 'tracks', value: convertTracksFromStrings(generateUniqueTracks(answer.data)) })

          break
      }
    }

    MpdSocket.onerror = function(event: any) {
      this.socketInfo = { type: 'error', event }
    }
  }
}

export const MpdModule = getModule(Mpd)
