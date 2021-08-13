// core/index.js

import "reflect-metadata"
import express from "express"
import { type } from "os"

const reqPosMetadataKey = Symbol("reqPos")
const resPosMetadataKey = Symbol("resPos")
const getMethodMetadataKey = Symbol("getMethod")
const getPathMetadataKey = Symbol("getPath")

export function Controller(prefix? : string) {
  if (!prefix) prefix = '/'
  return (target: Function) => {
    let router = express.Router()
    let P = target.prototype
    P.router = router
    P.prefix = prefix
    for (let pk of Object.getOwnPropertyNames(P)) {
      let getMethod = Reflect.getMetadata(getMethodMetadataKey, P, pk)
      if (getMethod) {
        let getPath = Reflect.getMetadata(getPathMetadataKey, P, pk)
        router.get(getPath, (req, res) => {
          let params = []
          let reqPos = Reflect.getMetadata(reqPosMetadataKey, P, pk)
          if (typeof reqPos === 'number') params[reqPos] = req
          let resPos = Reflect.getMetadata(resPosMetadataKey, P, pk)
          if (typeof resPos === 'number') params[resPos] = res
          getMethod(...params);
        })
      }
    }
  }
}

export function Get(path? : string) {
  if (!path) path = '/'
  return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(getMethodMetadataKey, descriptor.value, target, propertyKey)
    Reflect.defineMetadata(getPathMetadataKey, path, target, propertyKey)
  }
}

export function Res() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(resPosMetadataKey, parameterIndex, target, propertyKey)
  }
}

export function Req() {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(reqPosMetadataKey, parameterIndex, target, propertyKey)
  }
}
export function bootStrap(DecoratedControllers) {
  let app = express()
  for (let ctrl of DecoratedControllers) {
    let c = new ctrl()
    app.use(c.prefix, c.router)
  }
  return app
}
