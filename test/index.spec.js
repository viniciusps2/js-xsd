'use strict'

const path = require('path')
const parseXsd = require('..')
const xmlFile = path.join(__dirname, 'example2.xml')

describe('parent-child', () => {
  it('should not throw when save without changes', function * () {
    const res = yield parseXsd.read(xmlFile)
    const res2 = yield parseXsd.readXml(xmlFile)
    console.log('res2', JSON.stringify(res2, null, 2))

    console.log(' res.types',res.types)
    console.log(' res.elements',res.elements)

    console.log('res.sequence', JSON.stringify(res.sequence, null, 2))


  })
})

function wait (tm) {
  return new Promise((resolve) => setTimeout(resolve, tm))
}
