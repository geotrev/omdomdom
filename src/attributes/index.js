import { forEach } from "../utilities"
import { InternalAttributes, Namespace, DomProperties } from "./records"

/**
 * Set a given attribute as a property, if it has a property equivalent
 */
const setProperty = (node, prop, value) => {
  if (value === null) {
    node[prop] = ""
  } else {
    node[prop] = value
  }
}

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} vNode
 * @param {string[]} attributes
 */
const removeAttributes = (vNode, attributes) => {
  forEach(attributes, (attribute) => {
    if (attribute === DomProperties.style) {
      vNode.node.style.cssText = null
    } else if (Object.prototype.hasOwnProperty.call(DomProperties, attribute)) {
      setProperty(vNode.node, DomProperties[attribute], null)
    } else if (attribute in vNode.node) {
      setProperty(vNode.node, DomProperties[attribute], null)
      vNode.node.removeAttribute(attribute)
    } else {
      vNode.node.removeAttribute(attribute)
    }

    delete vNode.attributes[attribute]
  })
}

/**
 * Adds attributes to the element.
 * @param {VirtualNode} vNode
 * @param {Object.<string, string>} attributes
 */
const setAttributes = (vNode, attributes) => {
  for (let attribute in attributes) {
    const value = attributes[attribute]
    vNode.attributes[attribute] = value

    if (attribute === InternalAttributes.KEY) {
      vNode.attributes[attribute] = value
      continue
    }

    if (attribute === DomProperties.style) {
      vNode.node.style.cssText = attributes[attribute]
      continue
    }

    // Only set DomProperties as properties, and not attributes
    if (Object.prototype.hasOwnProperty.call(DomProperties, attribute)) {
      setProperty(vNode.node, DomProperties[attribute], value)
      continue
    }

    // Set namespaced properties using setAttributeNS
    if (attribute.startsWith(Namespace.xlink.prefix)) {
      vNode.node.setAttributeNS(Namespace.xlink.resource, attribute, value)
      continue
    } else if (attribute.startsWith(Namespace.xml.prefix)) {
      vNode.node.setAttributeNS(Namespace.xml.resource, attribute, value)
      continue
    }

    // If the attribute is also a property, set it
    if (attribute in vNode.node) {
      setProperty(vNode.node, DomProperties[attribute], value)
    }
    vNode.node.setAttribute(attribute, value || "")
  }
}

/**
 * Gets dynamic property-based attributes to be applied.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getPropertyValues = (element, attributes) => {
  for (let prop in DomProperties) {
    const propertyName = DomProperties[prop]

    if (prop === DomProperties.style) {
      attributes[prop] = element[propertyName].cssText
    } else if (element[propertyName]) {
      attributes[prop] = element[propertyName]
    }
  }
}

/**
 * Gets non-property attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getBaseAttributes = (element) => {
  return Array.prototype.reduce.call(
    element.attributes,
    (attributes, attribute) => {
      if (
        !Object.prototype.hasOwnProperty.call(DomProperties, attribute.name)
      ) {
        attributes[attribute.name] = attribute.value
      }
      return attributes
    },
    {}
  )
}

/**
 * Gets all attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
export const getAttributes = (element) => {
  const attributes = getBaseAttributes(element)
  getPropertyValues(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from vNode to template
 * @param {VirtualNode} template
 * @param {VirtualNode} vNode
 */
export const updateAttributes = (template, vNode) => {
  let removedAttributes = []
  let changedAttributes = {}

  // Get stale attributes
  for (let attribute in vNode.attributes) {
    const oldValue = vNode.attributes[attribute]
    const nextValue = template.attributes[attribute]
    if (oldValue === nextValue) continue

    if (typeof nextValue === "undefined") {
      removedAttributes.push(attribute)
    }
  }

  // Get changed or new attributes
  for (let attribute in template.attributes) {
    const oldValue = vNode.attributes[attribute]
    const nextValue = template.attributes[attribute]
    if (oldValue === nextValue) continue

    if (typeof nextValue !== "undefined") {
      changedAttributes[attribute] = nextValue
    }
  }

  // Add and remove attributes
  removeAttributes(vNode, removedAttributes)
  setAttributes(vNode, changedAttributes)
}
