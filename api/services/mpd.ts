
var mpd = require('mpd')
var cmd = mpd.cmd
var debug = require('debug')('mpd.fm:mpdclient')

interface IMPDConnection {
  port: string
  host: string
}

interface IAdditionalSetupMPDServer {
  mpdClient: any
}

// Private
var Status = Object.freeze({ 'disconnected': 1, 'connecting': 2, 'reconnecting': 3, 'ready': 4 })
var updateClients: any = []

export class MPD implements IAdditionalSetupMPDServer {
  mpdClient: any = null
  private status: number = Status.disconnected
  private port: string
  private host: string

  constructor(options: IMPDConnection) {
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

    this.status = Status.connecting
    debug('Connecting')
    this.mpdClient = mpd.connect({ port: this.port, host: this.host })

    this.mpdClient.on('ready', function() {
      console.log('MPD client ready and connected to ' + self.host + ':' + self.port)

      self.status = Status.ready
      self.mpdClient.on('system', function(name: string) {
        debug('System update received: ' + name)
        if (name === 'playlist' || name === 'player') {
          self.sendStatusRequest(function(error: Error, status: string) {
            if (!error) updateClients.forEach((callback: Function) => callback(mpd.parseKeyValueMessage(status)))
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
    if (this.status === Status.reconnecting) { return }
    this.mpdClient = null
    this.status = Status.reconnecting
    setTimeout(() => {
      this.connect()
    }, 3000)
  }

  sendStatusRequest(callback?: Function) {
    return this.sendCommands([['currentsong', []], ['status', []]], callback || null, true, true)
  }

  defaultCallback(resolve: Function, reject: Function, computedFunction?: Function) {
    return (error: Error, message: string) => {
      if (error) {
        reject(error)
      } else {
        resolve(computedFunction ? computedFunction(message) : message)
      }
    }
  }

  sendCommands(commands: Array<any>, callback: Function | null, wrapCommand: Boolean = true, parse: Boolean = true) {
    return new Promise((resolve, reject) => {
      commands = wrapCommand ? commands.map(command => cmd(command[0], command[1])) : commands
      console.log(commands, 'sendCommands commands')

      if (this.status !== Status.ready) reject(Error('Not connected'))

      const callbackInherit = callback || this.defaultCallback(resolve, reject, parse ? mpd.parseKeyValueMessage : null)

      // const finalFunction = Array.isArray(commands) ? this.mpdClient.sendCommands : this.mpdClient.sendCommand
      // this.mpdClient.sendCommands(commands, callbackInherit)

      if (Array.isArray(commands)) {
        this.mpdClient.sendCommands(commands, callbackInherit)
      } else {
        this.mpdClient.sendCommand(commands, callbackInherit)
      }
    })
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

  setPlay(command: [string, Array<number>]) {
    return this.sendCommands([command], null, true)
  }

  setPlayStation(stream: any, callback: any) {
    this.sendCommands([cmd('clear', []), cmd('repeat', [1]), cmd('add', [stream]), cmd('play', []) ],
      function(err: any, msg: string) {
        if (err) {
          callback(err)
        } else {
          callback()
        }
      })
  }
}

export class MDPService extends MPD {
  onStatusChange(callback: Function) {
    updateClients.push(callback)
  }

  getMpdStatus() {
    return this.sendStatusRequest()
  }

  getElapsed(callback: Function) {
    return this.sendElapsedRequest(callback)
  }

  play() {
    return this.setPlay(['pause', []])
  }

  pause() {
    return this.setPlay(['pause', [1]])
  }

  playStation(stream: any, callback: Function) {
    debug('play ' + stream)
    return this.setPlayStation(stream, callback)
  }
}
