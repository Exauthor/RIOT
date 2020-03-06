import { Response, Request } from 'express'
import { MDPService } from '../services/mpd'

import fs from 'fs'
import path from 'path'
import * as WebSocket from 'ws'
let debug = require('debug')('mpd.fm:wss')

const MPD_PORT = (process.env as any).MPD_PORT || '6600'
const MPD_HOST = process.env.MPD_HOST || 'localhost'

let express = require('express')
let router = express.Router()
const mpdClient = new MDPService({ port: MPD_PORT, host: MPD_HOST })

router.get('/', async(req: Request, res: Response) => {
  let answer = {
    list: ['Music']
  }

  res.status(200).send(answer)
})

router.get('/command', async(req: Request, res: Response) => {
  try {
    const answer = await mpdClient.sendCommands(req.body.commands, null, true, true)
    res.status(200).send(answer)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/status', async(req: Request, res: Response) => {
  const status = await mpdClient.getMpdStatus()
  res.status(200).send(status)
})

router.get('/play', async(req: Request, res: Response) => {
  const status = await mpdClient.play()
  res.status(200).send(status)
})

router.get('/stop', async(req: Request, res: Response) => {
  const status = await mpdClient.pause()
  res.status(200).send(status)
})

export class MPDSocket {
  init(wss: WebSocket) {
    let self = this
    wss.on('connection', (ws: WebSocket) => {
      ws.on('message', async function incoming(message: string) {
        let msg: any
        try {
          msg = JSON.parse(message)
        } catch {
          self.sendWSSMessage(ws, 'WRONG COMMAND BOI', null)
        }

        debug('Received %s with %o', msg.type, msg.data)
        switch (msg.type) {
          case 'REQUEST_STATION_LIST':
            self.sendWSSMessage(ws, 'STATION_LIST IS EMPTY', null)
            break

          case 'PLAYLIST':
            // eslint-disable-next-line no-case-declarations
            const playlists = await mpdClient.sendCommands([['playlist', []]])
            self.sendWSSMessage(ws, 'PLAYLIST', playlists)
            break

          case 'STATUS':
            // eslint-disable-next-line no-case-declarations
            const status = await mpdClient.getMpdStatus()
            self.sendWSSMessage(ws, 'STATUS', status)
            break

          case 'REQUEST_ELAPSED':
            mpdClient.getElagetElapsedpsed(function(error: any, elapsed: any) {
              if (error) {
                self.sendWSSMessage(ws, 'MPD_OFFLINE', null)
              } else {
                self.sendWSSMessage(ws, 'ELAPSED', elapsed)
              }
            })
            break

          case 'SET_TRACK':
            await mpdClient.sendCommands([['playid', [msg.data]]])
            break

          case 'PREVIOUS':
            await mpdClient.sendCommands([['previous', []]])
            break

          case 'NEXT':
            await mpdClient.sendCommands([['next', []]])
            break

          case 'UPDATE_TIME':
            await mpdClient.sendCommands([['seekcur', [msg.data]]])
            break

          case 'PLAY':
            if (msg.data && msg.data.stream) {
              mpdClient.playStation(msg.data.stream, (error: Error) => {
                if (error) self.sendWSSMessage(ws, 'MPD_OFFLINE')
              })
            } else {
              mpdClient.play()
            }
            break

          case 'PAUSE':
            mpdClient.pause()
            break
          default:
            self.sendWSSMessage(ws, 'WRONG COMMAND')
        }
      })
    })

    mpdClient.onStatusChange((status: string) => self.broadcastMessage(wss, 'STATUS', status))
  }

  sendWSSMessage(client: WebSocket, type: string, data?: any, showDebug = true) {
    data = this.objectToLowerCase(data)
    showDebug && debug('Send: ' + type + ' with %o', data)
    let payload = {
      type,
      data: (data) || {}
    }
    client.send(JSON.stringify(payload))
  }

  broadcastMessage(server: WebSocket, type: string, data: any) {
    data = this.objectToLowerCase(data)
    const self = this
    debug('Broadcast: ' + type + ' with %o', data)
    server.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        self.sendWSSMessage(client, type, data, false)
      }
    })
  }

  objectToLowerCase(data : Object): any {
    if (!data) {
      return data
    } else if (Array.isArray(data)) {
      return data.map(value => this.objectToLowerCase(value))
    } else if (typeof data === 'object') {
      var retData: any = {}
      for (const [key, value] of Object.entries(data)) {
        retData[key.toLowerCase()] = this.objectToLowerCase(value)
      }
      return retData
    } else {
      return data
    }
  }
}

export default router
