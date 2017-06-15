'use strict'

const {get, set} = require('lodash')
const fs = require('fs')
const {parseString} = require('xml2js')
const {isTypePath, isTypeCall, setMap, getMap, isMap, concatPath, removeNs} = require('./utils')

function compile (node, res, path = [], elPath = []) {
  res = res || {types: new Map(), elements: new Map(), typeCalls: new Map()}
  const name = get(node, '$.name')
  const currentElPath = concatPath(elPath, name)

  if (name) {
    console.log(' elPath',isTypePath(path), path, elPath, name)
    const target = isTypePath(path) ? 'types' : 'elements'
    const typeName = get(node, '$.type')
    isTypeCall(typeName) && res.typeCalls.set(currentElPath, {typeName, target})

    setMap(res[target], currentElPath, '')
  }

  for (const prop in node) {
    const val = node[prop]
    const currentPath = concatPath(path, prop)

  	if (val instanceof Array) {
      val.forEach((item) => compile(item, res, currentPath, currentElPath))
  	} else if(isPlainObj(val)) {
      compile(val, res, currentPath, currentElPath)
  	}
  }
  return res
}

function linkTypes (xsdMap) {
  for (let [path, def] of xsdMap.typeCalls) {
    const {typeName, target} = def
    const type = xsdMap.types.get(removeNs(typeName))
    console.log(' path, typeName',path, typeName)
    setMap(xsdMap[target], path, type)
  }
}

function getPathSequence (elements, sequence = [], elPath = []) {
  for (let [prop, val] of elements) {
    const currentPath = concatPath(elPath, prop)
    if(isMap(val)) {
      getPathSequence(val, sequence, currentPath)
    } else {
      sequence.push(currentPath.join('.'))
    }
  }
  return sequence
}

function readXsd (xsd) {
  const xsdMap = compile(xsd)
  linkTypes(xsdMap)
  xsdMap.sequence = getPathSequence(xsdMap.elements)
	return xsdMap
}

function read (path) {
  return readXml(path)
  	.then(readXsd)
}

function parseXml (str, opt) {
  return new Promise((resolve, reject) => {
  	return parseString(str, opt, (err, res) => err ? reject(err) : resolve(res))
  })
}

function readFile (path, encode = 'utf8') {
  return new Promise((resolve, reject) => {
  	return fs.readFile(path, encode, (err, res) => err ? reject(err) : resolve(res))
  }) 
}

function readXml (path, opt) {
  return readFile(path)
  	.then((str) => parseXml(str, opt))
}

function isPlainObj (o) {
  return typeof o === 'object' && o !== null && o.constructor === Object
}

module.exports = {parseXml, readXml, read}