'use strict'

const {get, set} = require('lodash')
const fs = require('fs')
// const {parseString} = require('xml2js')
const {xml2js} = require('xml-js')

const {isTypePath, isTypeCall, setMap, getMap, isMap, concatPath, removeNs} = require('./utils')

function compile (node, res, path = [], elPath = []) {
  res = res || {types: new Map(), elements: new Map(), typeCalls: new Map()}
  const name = get(node, '$.name')
  const currentElPath = concatPath(elPath, name)

  if (name) {
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
	return xsdMap
}

function generateStructure (path) {
  const xsdMap = readXsd(readXml(path))
  return xsdMap.elements
}

function fieldsSequence (path) {
  const xsdMap = readXsd(readXml(path))
  const elements = getPathSequence(xsdMap.elements)
  return elements
}

function parseXml (xml, opt) {
  opt = {compact: true, attributesKey: '$'}
  return xml2js(xml, opt)
}

function readXml (path, opt = {}) {
  const xml = fs.readFileSync(path, opt.encode || 'utf8')
  return parseXml(xml, opt)
}

function isPlainObj (o) {
  return typeof o === 'object' && o !== null && o.constructor === Object
}

module.exports = {generateStructure, fieldsSequence}