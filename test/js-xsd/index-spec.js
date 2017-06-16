'use strict'

const path = require('path')
const xsd = require('../../lib/js-xsd')
const xmlFile = path.join(__dirname, 'example.xml')
const xmlFile2 = path.join(__dirname, 'example2.xml')

describe('xsd-js', () => {
  it('should read sequence', function () {
    const fieldsSequence = xsd.fieldsSequence(xmlFile)
    expect(fieldsSequence).to.contains('ROOTELEMENT.T_ATP_OUT.item.KPOSN')
  })

  it('should read sequence of 2nd xml', function () {
    const fieldsSequence = xsd.fieldsSequence(xmlFile2)
    expect(fieldsSequence).to.contains('PurchaseOrder.ShipTo.name')
    expect(fieldsSequence).to.contains('PurchaseOrder.OrderDate')
  })

  it('should generate structure of 1st xml', function () {
    const structure = xsd.generateStructure(xmlFile)
    expect(structure.get('ROOTELEMENT').get('T_ATP_OUT').get('item').has('KPOSN')).to.be.true
  })

  it('should generate structure of 2nd xml', function () {
    const structure = xsd.generateStructure(xmlFile2)
    expect(structure.get('PurchaseOrder').get('ShipTo').has('name')).to.be.true
  })
})
