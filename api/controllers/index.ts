import { Response, Request } from 'express'
let express = require('express')
let http = require('http')
let path = require('path')
let router = express.Router()

router.get('/', async(req: Request, res: Response) => {
  let answer = { text: 'Hello User!' }
  res.status(200).send(answer)
})

export default router
