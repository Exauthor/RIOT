import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import router from './controllers/index'
import routerSystem from './controllers/system'

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

server.listen(app.get('port'), () => console.log('Express server listening on port ' + app.get('port')))
server.on('error', utils.onError)

// Catch 404 error
app.use((req, res, next) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})
