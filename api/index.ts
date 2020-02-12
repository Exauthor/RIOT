import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
// const router = require('./router/index.ts')
import router from './controllers/index'
import { execSync } from 'child_process'

require('dotenv').config()

const utils = require('./utils')

const app = express()

// Compression
// app.use(compression())
// Logger
// app.use(morgan('dev'))

app.use(cors())

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: false
}))

const server = http.createServer(app)

app.set('port', process.env.PORT || 3000)
app.use('/', router)

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

app.get('/memory', (req, res) => {
  let freePrecent: string = execSync('free | awk \'/Mem/{printf("%d"), $3/$2*100}\'').toString('utf8')
  let freeMemory: string = execSync('free | awk \'/Mem/{printf("%d"), $3/1024}\'').toString('utf8')

  res.json({ 'percentMemory': 100 - parseInt(freePrecent), 'usedMemory': freeMemory })
})

app.get('/cpu-up', (req, res) => {
  execSync('sysbench --test=cpu --num-threads=4 --cpu-max-prime=20000 run')

  res.json({ 'cpu': 'start' })
})
