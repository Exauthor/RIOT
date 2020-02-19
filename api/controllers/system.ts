import { execSync } from 'child_process'
import { Response, Request } from 'express'
import { getMemory } from '../services/system'
let express = require('express')
let http = require('http')
let path = require('path')
let router = express.Router()

router.get('/', async(req: Request, res: Response) => {
  let answer = { memory: getMemory() }
  res.status(200).send(answer)
})

router.get('/memory', (req: Request, res: Response) => {
  res.json(getMemory())
})

router.post('/cpu-up', (req: Request, res: Response) => {
  execSync('sysbench --test=cpu --num-threads=4 --cpu-max-prime=20000 run')

  res.json({ 'cpu': 'start' })
})

export default router
