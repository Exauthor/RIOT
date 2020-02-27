import { Response, Request } from 'express'
import { MDPService } from '../services/mpd'

let fs = require('fs')
let path = require('path')
let debug = require('debug')('mpd.fm:wss')
const WebSocket = require('ws')

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

router.get('/connect', async(req: Request, res: Response) => {
  res.status(200).send(true)
})

router.get('/command', async(req: Request, res: Response) => {
  console.log(req.body.commands, 'commands')
  mpdClient.sendCommands(req.body.commands, function(error: any, status: string) {
    if (error) {
      console.log('ERROR FROM MPD:', error)
      res.status(400).send(error)
      return
    }
    console.log('ANSWER FROM MPD:', status)
    res.status(200).send(status)
  }, true)
})

export class MPDSocket {
  init(wss: any) {
    let self = this
    wss.on('connection', function connection(ws: any, req: any) {
      ws.on('message', function incoming(message: string) {
        let msg: any = JSON.parse(message)
        try {
          msg = JSON.parse(message)
        } catch {
          self.sendWSSMessage(ws, 'WRONG COMMAND BOI', null)
        }

        debug('Received %s with %o', msg.type, msg.data)
        switch (msg.type) {
          case 'REQUEST_TRACK_LIST':
            console.log('START WITH SOCKET')
            self.sendWSSMessage(ws, 'STATION_LIST IS EMPTY', null)
            break
          case 'REQUEST_STATION_LIST':
            console.log('START WITH SOCKET')
            self.sendWSSMessage(ws, 'STATION_LIST IS EMPTY', null)
            break
            // fs.readFile(stationFile, 'utf8', function(err, data) {
            //   if (err) {
            //     console.error('Can\'t read station file: "' + stationFile + '": ' + err)
            //     return
            //   }
            //   try {
            //     var stationList = JSON.parse(data)
            //     if (!Array.isArray(stationList)) { throw 'Station list is not an array' }
            //     sendWSSMessage(ws, 'STATION_LIST', stationList)
            //   } catch (error) {
            //     console.error('Can\'t interpret station file: "' + stationFile + '": ' + error)
            //   }
            // })
            // break

          case 'REQUEST_STATUS':
            mpdClient.getMpdStatus(function(error: any, status: any) {
              if (error) {
                self.sendWSSMessage(ws, 'MPD_OFFLINE', null)
              } else {
                self.sendWSSMessage(ws, 'STATUS', status)
              }
            })
            break

          case 'REQUEST_ELAPSED':
            mpdClient.getElapsed(function(error: any, elapsed: any) {
              if (error) {
                self.sendWSSMessage(ws, 'MPD_OFFLINE', null)
              } else {
                self.sendWSSMessage(ws, 'ELAPSED', elapsed)
              }
            })
            break

          case 'PLAY':
            if (msg.data && msg.data.stream) {
              mpdClient.playStation(msg.data.stream, function(error: any) {
                if (error) {
                  self.sendWSSMessage(ws, 'MPD_OFFLINE', null)
                }
              })
            } else {
              mpdClient.play(function(error: any) {
                if (error) {
                  self.sendWSSMessage(ws, 'MPD_OFFLINE')
                }
              })
            }
            break

          case 'PAUSE':
            mpdClient.pause(function(error: any) {
              if (error) {
                self.sendWSSMessage(ws, 'MPD_OFFLINE')
              }
            })
            break
          default:
        }
      })
    })

    mpdClient.onStatusChange(function(status: string) {
      console.log('UPDATE SOCKER VALUES')
      self.broadcastMessage(wss, 'STATUS', status)
    })
  }

  sendWSSMessage(client: any, type: any, data?: any, showDebug = true) {
    data = this.objectToLowerCase(data)
    showDebug && debug('Send: ' + type + ' with %o', data)
    var msg = {
      type: type,
      data: (data) || {}
    }
    client.send(JSON.stringify(msg), function(error) {
      if (error) { debug('Failed to send data to client %o', error) }
    })
  }

  broadcastMessage(server: any, type: any, data: any) {
    data = this.objectToLowerCase(data)
    const self = this
    debug('Broadcast: ' + type + ' with %o', data)
    server.clients.forEach(function each(client: any) {
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
