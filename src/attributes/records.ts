import { forEach } from "../utilities"

type AttributeRecord = {
  attrName: string
  propName: string
  type: "string" | "number" | "boolean"
}

export type RecordType = AttributeRecord["type"]
export type RecordPropName = AttributeRecord["propName"]
export type RecordAttrName = AttributeRecord["attrName"]

type AttributePropTuple = [string, string]

const createRecord = (
  attrName: RecordAttrName,
  propName: RecordPropName,
  type: RecordType
): AttributeRecord => ({
  attrName,
  propName,
  type,
})

const Types: Record<string, RecordType> = {
  STRING: "string",
  INT: "number",
  BOOL: "boolean",
}
const DomProperties: Record<string, AttributeRecord> = {}

// Set string records
const stringProps = [
  // Style is a special snowflake, and needs an extra property to set its text
  // value. This is less confusing and achieves the same result with one reflow,
  // compared to a new reflow for each Element.style[styleProperty] setter.
  ["style", "cssText"],
  ["class", "className"],
]
forEach(stringProps, ([attr, property]: AttributePropTuple) => {
  DomProperties[attr] = createRecord(attr, property || attr, Types.STRING)
})

// Set boolean records
const booleanProps = [
  "autofocus",
  "draggable",
  "hidden",
  "checked",
  "multiple",
  "muted",
  "selected",
]
forEach(booleanProps, (attr: RecordAttrName) => {
  DomProperties[attr] = createRecord(attr, attr, Types.BOOL)
})

// Set Integer records
const integerProps = [["tabindex", "tabIndex"]]
forEach(integerProps, ([attr, property]: AttributePropTuple) => {
  DomProperties[attr] = createRecord(attr, property, Types.INT)
})

/**
 * Attributes with these namespaces require `setAttributeNS`
 * @type {Object.<string, string>}
 */
const Namespace = {
  xlink: {
    prefix: "xlink:",
    resource: "http://www.w3.org/1999/xlink",
  },
  xml: {
    prefix: "xml:",
    resource: "http://www.w3.org/XML/1998/namespace",
  },
}

export { Types, Namespace, DomProperties }
