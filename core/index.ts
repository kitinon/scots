// core/index.js

import express from "express"

const app = express()
const router = express.Router()
let reqPos: number
let resPos: number

export function Controller(prefix? : string) {
  if (!prefix) prefix = '/'
  return (target: Function) => {
    app.use(prefix, router)
  }
}

export function Get(path? : string) {
  if (!path) path = '/'
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    router.get(path, (req, res) => {
      let params = []
      if (reqPos !== undefined) params[reqPos] = req
      if (resPos !== undefined) params[resPos] = res
      ;(descriptor.value)(...params)
    })
  }
}

export function Res() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    resPos = parameterIndex
  }
}

export function Req() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    reqPos = parameterIndex
  }
}

export function bootStrap(Controller) {
  new Controller()
  return app
}