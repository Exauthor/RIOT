import { execSync } from 'child_process'
import { Response, Request } from 'express'
import { getMemory, getCpuTemperature, getCurrentVolume, updateVolume } from '../services/system'
let express = require('express')
let http = require('http')
let path = require('path')
let router = express.Router()

router.get('/', async(req: Request, res: Response) => {
  let answer = {
    memory: getMemory(),
    cpuTemperature: getCpuTemperature()
    // value: getCurrentVolume()
  }
  res.status(200).send(answer)
})

router.get('/memory', (req: Request, res: Response) => {
  res.json(getMemory())
})

router.get('/cpu-temperature', (req: Request, res: Response) => {
  res.json(getCpuTemperature())
})

router.get('/volume', (req: Request, res: Response) => {
  res.json(getCurrentVolume())
})

router.post('/volume', (req: Request, res: Response) => {
  console.log(req)
  res.json(updateVolume(req.body.volume))
})

router.post('/cpu-up', (req: Request, res: Response) => {
  execSync('sysbench --test=cpu --num-threads=4 --cpu-max-prime=20000 run')

  res.json({ 'cpu': 'start' })
})

export default router
