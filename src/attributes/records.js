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

/**
 * Set a given attribute as a property, if it has a property equivalent
 * @param {HTMLElement} node
 * @param {string|number|boolean} type
 * @param {string} prop
 * @param {*} value
 */
const setProperty = (element, type, prop, value) => {
  switch (type) {
    case Types.STRING: {
      if (prop === DomProperties.style.propName) {
        if (value === null) {
          element.style[prop] = ""
        } else {
          element.style[prop] = value
        }
      } else if (value === null) {
        element[prop] = ""
      } else {
        element[prop] = value
      }
      break
    }

    case Types.INT: {
      if (value === null) {
        const attr = prop.toLowerCase()
        // The attribute needs to be removed to reset the property,
        // otherwise the value coerced + reflected onto the attribute.
        element.removeAttribute(attr)
      } else if (value === "0") {
        element[prop] = 0
      } else if (value === "-1") {
        element[prop] = -1
      } else {
        const parsed = parseInt(value)
        if (!isNaN(parsed)) {
          element[prop] = parsed
        }
      }
      break
    }

    case Types.BOOL: {
      if (["", "true"].indexOf(value) < 0) {
        element[prop] = false
      } else {
        element[prop] = true
      }
      break
    }

    default:
      break
  }
}

// Set string records
const stringProps = [
  // Style is a special snowflake, and needs an extra property to set its text
  // value. This is less confusing and achieves the same result with one reflow,
  // compared to a new reflowf or each Element.style[name] that gets set.
  ["style", "cssText"],
  ["class", "className"],
  ["accesskey", "accessKey"],
  ["title"],
  ["dir"],
  ["id"],
  ["lang"],
]
forEach(stringProps, ([attr, property]) => {
  DomProperties[attr] = createRecord(attr, property, Types.STRING)
})

// Set boolean records
const booleanProps = ["autofocus", "draggable", "hidden", "inert"]
forEach(booleanProps, (attr) => {
  DomProperties[attr] = createRecord(attr, attr, Types.BOOL)
})

// Set Integer records
const integerProps = [["tabindex", "tabIndex"]]
forEach(integerProps, ([attr, property]) => {
  DomProperties[attr] = createRecord(attr, property, Types.INT)
})

/**
 * Attributes only relevant to the renderer, and don't need to be exposed.
 * @type {Object.<string, string>}
 */
const InternalAttributes = {
  KEY: "key",
}

/**
 * These require setAttributeNS
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

export { Types, Namespace, InternalAttributes, DomProperties, setProperty }
