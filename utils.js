function isTypePath (path) {
  return path.indexOf('xsd:complexType') >= 0 && path.indexOf('xsd:complexType') < path.indexOf('xsd:element')
}

function isTypeCall (type) {
  return type && !type.startsWith('xsd:')
}

function setMap (obj, path, val) {
  return path.reduce((found, curPath, index, path) => {
    const next = found.get(curPath)
    if (next !== undefined && next !== null && isMap(next))  return next

    const value = index < path.length - 1 ? new Map() : val
    found.set(curPath, value)
    return value
  }, obj)
}

function getMap (map, path) {
  return path
    .reduce((found, nextPath) => found !== undefined && found !== null ? found[nextPath] : undefined, obj)
}

function isMap(val) {
  return Object.prototype.toString.call(val) === "[object Map]"
}

function concatPath (parentPath = [], path = []) {
  return parentPath.concat(path)
}

function removeNs (tag) {
  return tag.split(':').slice(-1)[0]
}

module.exports = {
  isTypePath,
  isTypeCall,
  setMap,
  getMap,
  isMap,
  concatPath,
  removeNs
}
