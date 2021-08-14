// core/index.ts

import "reflect-metadata"
import express from "express"

const REQ_POS_KEY = Symbol("reqPos")
const RES_POS_KEY = Symbol("resPos")
const GET_PATH_KEY = Symbol("getPath")
const PREFIX_KEY = Symbol("prefix")

export function Controller(prefix? : string) {
  if (!prefix) prefix = '/'
  return (target: Function) => {
    Reflect.defineMetadata(PREFIX_KEY, prefix, target)
  }
}

export function Get(path? : string) {
  if (!path) path = '/'
  return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(GET_PATH_KEY, path, target, propertyKey)
  }
}

export function Res() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(RES_POS_KEY, parameterIndex, target, propertyKey)
  }
}

export function Req() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(REQ_POS_KEY, parameterIndex, target, propertyKey)
  }
}

type Constructor = {new (...args: any[]): any}

export function bootStrap(DecoratedControllers: Constructor[]) {
  let app = express()
  for (let Ctrl of DecoratedControllers) {
    let prefix = Reflect.getMetadata(PREFIX_KEY, Ctrl)
    let proto = Ctrl.prototype
    let ctrl = new Ctrl()
    let router = express.Router()
    for (let prop of Object.getOwnPropertyNames(proto)) {
      let getPath = Reflect.getMetadata(GET_PATH_KEY, proto, prop)
      if (getPath) {
        let reqPos = Reflect.getMetadata(REQ_POS_KEY, proto, prop)
        let resPos = Reflect.getMetadata(RES_POS_KEY, proto, prop)
        router.get(getPath, (req, res) => {
          let params = []
          if (typeof reqPos === 'number') params[reqPos] = req
          if (typeof resPos === 'number') params[resPos] = res
          ctrl[prop](...params)
        })
      }
    }
    app.use(prefix, router)
  }
  return app
}
