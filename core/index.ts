// core/index.js

import "reflect-metadata"
import express from "express"
import { type } from "os"

const reqPosMetadataKey = Symbol("reqPos")
const resPosMetadataKey = Symbol("resPos")
const getPathMetadataKey = Symbol("getPath")
const prefixMetaDataKey = Symbol("prefix")

export function Controller(prefix? : string) {
  if (!prefix) prefix = '/'
  return (target: Function) => {
    Reflect.defineMetadata(prefixMetaDataKey, prefix, target)
  }
}

export function Get(path? : string) {
  if (!path) path = '/'
  return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
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
    let prefix = Reflect.getMetadata(prefixMetaDataKey, ctrl)
    let P = ctrl.prototype
    let c = new ctrl()
    let r = express.Router()
    for (let pk of Object.getOwnPropertyNames(P)) {
      let getPath = Reflect.getMetadata(getPathMetadataKey, P, pk)
      if (getPath) {
        r.get(getPath, (req, res) => {
          let params = []
          let reqPos = Reflect.getMetadata(reqPosMetadataKey, P, pk)
          if (typeof reqPos === 'number') params[reqPos] = req
          let resPos = Reflect.getMetadata(resPosMetadataKey, P, pk)
          if (typeof resPos === 'number') params[resPos] = res
          c[pk](...params)
        })
      }
    }
    app.use(prefix, r)
  }
  return app
}
