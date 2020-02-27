
var mpd = require('mpd')
var cmd = mpd.cmd
var debug = require('debug')('mpd.fm:mpdclient')

interface ISetupMPDServer {
  port: string
  host: string
}

interface IAdditionalSetupMPDServer {
  mpdClient: any
  mpdStatus: number
}

// Private
var Status = Object.freeze({ 'disconnected': 1, 'connecting': 2, 'reconnecting': 3, 'ready': 4 })
var updateClients: any = []

export class MPD implements ISetupMPDServer, IAdditionalSetupMPDServer {
  mpdClient: any = null
  mpdStatus: number = Status.disconnected
  port: string
  host: string

  constructor(options: ISetupMPDServer) {
    this.port = options.port
    this.host = options.host
    this.connect()
  }

  connect() {
    const self = this
    if (this.mpdClient && this.mpdClient.socket) {
      this.mpdClient.socket.end()
      this.mpdClient = null
    }

    this.mpdStatus = Status.connecting
    debug('Connecting')
    this.mpdClient = mpd.connect({ port: this.port, host: this.host })

    this.mpdClient.on('ready', function() {
      console.log('MPD client ready and connected to ' + self.host + ':' + self.port)

      self.mpdStatus = Status.ready
      self.mpdClient.on('system', function(name: string) {
        debug('System update received: ' + name)
        if (name === 'playlist' || name === 'player') {
          self.sendStatusRequest(function(error: any, status: string) {
            if (!error) {
              updateClients.forEach(function(callback: Function) {
                callback(status)
              })
            }
          })
        }
      })
    })

    this.mpdClient.on('end', function() {
      debug('Connection ended')
      self.retryConnect()
    })

    this.mpdClient.on('error', function(err: any) {
      console.error('MPD client socket error: ' + err)
      self.retryConnect()
    })
  }

  retryConnect() {
    if (this.mpdStatus === Status.reconnecting) { return }
    this.mpdClient = null
    this.mpdStatus = Status.reconnecting
    setTimeout(() => {
      this.connect()
    }, 3000)
  }

  sendStatusRequest(callback: any) {
    this.sendCommands([ cmd('currentsong', []), cmd('status', []) ],
      function(error: any, message: any) {
        if (error) {
          callback(error)
        } else {
          var status = mpd.parseKeyValueMessage(message)
          callback(null, status)
        }
      })
  }

  sendCommands(commands: Array<any>, callback: Function, wrapCommand: Boolean = false) {
    if (wrapCommand) {
      commands = commands.map(command => cmd(command[0], command[1]))
    }
    console.log(commands, 'sendCommands commands')
    try {
      if (this.mpdStatus !== Status.ready) {
        callback('Not connected')
      }

      var callbackInherit = function(error: any, message: any) {
        if (error) {
          console.error(error)
          callback(error)
        } else {
          callback(null, message)
        }
      }

      if (Array.isArray(commands)) {
        this.mpdClient.sendCommands(commands, callbackInherit)
      } else {
        this.mpdClient.sendCommand(commands, callbackInherit)
      }
    } catch (error) {
      callback(error)
    }
  }

  sendElapsedRequest(callback: Function) {
    this.sendCommands(cmd('status', []),
      function(error: any, msg: any) {
        if (error) {
          callback(error)
        } else {
          var data = mpd.parseKeyValueMessage(msg)
          var elapsed: any = { elapsed: 0 }
          for (const [key, value] of Object.entries(data)) {
            if (key.toLowerCase() === 'elapsed') {
              elapsed.elapsed = value
              break
            }
          }
          callback(null, elapsed)
        }
      })
  }

  sendPlay(play: any, callback: any) {
    var command = 'play'
    var arg: any = []
    if (!play) {
      command = 'pause'
      arg = [1]
    }

    this.sendCommands(cmd(command, arg),
      function(err: any, msg: any) {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
  }

  sendPlayStation(stream: any, callback: any) {
    this.sendCommands([cmd('clear', []), cmd('repeat', [1]), cmd('add', [stream]), cmd('play', []) ],
      function(err: any, msg: string) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      })
  }

  checkCommandAction(commands: [string, Array<number>]) {
    return this.sendCommands([cmd(commands)], (error: any, message: any) => {
      if (error) {
        console.log('MPD ERROR: ', error)
        return error
      }
      console.log('MPD MESSAGE:', message)
      return message
    })
  }
}

export class MDPService extends MPD {
  setup(options?: ISetupMPDServer) {
    if (options) {
      this.port = options.port
      this.host = options.host
    }
    this.connect()
  }

  onStatusChange(callback: Function) {
    updateClients.push(callback)
  }

  getMpdStatus(callback: Function) {
    this.sendStatusRequest(callback)
  }

  getElapsed(callback: Function) {
    this.sendElapsedRequest(callback)
  }

  play(callback: Function) {
    this.sendPlay(true, callback)
  }

  pause(callback: Function) {
    this.sendPlay(false, callback)
  }

  playStation(stream: any, callback: Function) {
    debug('play ' + stream)
    this.sendPlayStation(stream, callback)
  }
}
