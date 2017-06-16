## js-xsd

One day I needed to define the sequence of fields from an xsd to a transformation of json -> xml and then I created this library.

```
npm i viniciusps2/js-xsd --save
```

## Example Xml


```
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"   
           xmlns:tns="http://tempuri.org/PurchaseOrderSchema.xsd"   
           targetNamespace="http://tempuri.org/PurchaseOrderSchema.xsd"   
           elementFormDefault="qualified">  
 <xsd:element name="PurchaseOrder" type="tns:PurchaseOrderType"/>  
 <xsd:complexType name="PurchaseOrderType">  
  <xsd:sequence>  
   <xsd:element name="ShipTo" type="tns:USAddress" maxOccurs="2"/>  
   <xsd:element name="BillTo" type="tns:USAddress"/>  
  </xsd:sequence>  
  <xsd:attribute name="OrderDate" type="xsd:date"/>  
 </xsd:complexType>  
  
 <xsd:complexType name="USAddress">  
  <xsd:sequence>  
   <xsd:element name="name"   type="xsd:string"/>  
   <xsd:element name="street" type="xsd:string"/>  
   <xsd:element name="city"   type="xsd:string"/>  
   <xsd:element name="state"  type="xsd:string"/>  
   <xsd:element name="zip"    type="xsd:integer"/>  
  </xsd:sequence>  
  <xsd:attribute name="country" type="xsd:NMTOKEN" fixed="US"/>  
 </xsd:complexType>  
</xsd:schema>  
```

## Using


```
const xsd = require('js-xsd')
const sequence = xsd.fieldsSequence('example.xml')

// Returns:

[ 'PurchaseOrder.ShipTo.name',
  'PurchaseOrder.ShipTo.street',
  'PurchaseOrder.ShipTo.city',
  'PurchaseOrder.ShipTo.state',
  'PurchaseOrder.ShipTo.zip',
  'PurchaseOrder.ShipTo.country',
  'PurchaseOrder.BillTo.name',
  'PurchaseOrder.BillTo.street',
  'PurchaseOrder.BillTo.city',
  'PurchaseOrder.BillTo.state',
  'PurchaseOrder.BillTo.zip',
  'PurchaseOrder.BillTo.country',
  'PurchaseOrder.OrderDate' ]
```


```
const struture = xsd.fieldsSequence('example.xml')

// Returns:

Map {
  'PurchaseOrder' => Map {
    'ShipTo' => Map {
    'name' => '',
    'street' => '',
    'city' => '',
    'state' => '',
    'zip' => '',
    'country' => '' },
      'BillTo' => Map {
      'name' => '',
      'street' => '',
      'city' => '',
      'state' => '',
      'zip' => '',
      'country' => '' 
    },
    'OrderDate' => '' 
  } 
}
```



