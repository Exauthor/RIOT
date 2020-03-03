import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import router from './controllers/index'
import routerSystem from './controllers/system'
import routerMpd, { MPDSocket } from './controllers/mpd'
import * as WebSocket from 'ws'
const wsApp = new MPDSocket()

require('dotenv').config()

const utils = require('./utils')

const app = express()

app.use(cors())

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: false
}))

const server = http.createServer(app)

app.set('port', process.env.PORT || 3000)

app.use('/', router)
app.use('/system', routerSystem)
app.use('/mpd', routerMpd)

const wss: any = new WebSocket.Server({ server })
wsApp.init(wss)

server.listen(app.get('port'), () => console.log('Server listening on port ' + app.get('port')))
server.on('error', utils.onError)

// Catch 404 error
app.use((req, res, next) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})
