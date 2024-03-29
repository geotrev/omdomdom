import { forEach } from "../utilities"

const Types = { STRING: "string", INT: "number", BOOL: "boolean" }
const DomProperties = {}

/**
 * Creates a new record for DomProperties
 * @param {string} attrName
 * @param {string} propName
 * @param {string} type
 */
const createRecord = (attrName, propName, type) => ({
  attrName,
  propName,
  type,
})

// Set string records
const stringProps = [
  // Style is a special snowflake, and needs an extra property to set its text
  // value. This is less confusing and achieves the same result with one reflow,
  // compared to a new reflow for each Element.style[styleProperty] setter.
  ["style", "cssText"],
  ["class", "className"],
]
forEach(stringProps, ([attr, property]) => {
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
forEach(booleanProps, (attr) => {
  DomProperties[attr] = createRecord(attr, attr, Types.BOOL)
})

// Set Integer records
const integerProps = [["tabindex", "tabIndex"]]
forEach(integerProps, ([attr, property]) => {
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
