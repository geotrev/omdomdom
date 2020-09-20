import { hasProperty, forEach } from "../utilities"
import {
  InternalAttributes,
  setProperty,
  Namespace,
  DomProperties,
  Types,
} from "./records"

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} vNode
 * @param {string[]} attributes
 */
const removeAttributes = (vNode, attributes) => {
  forEach(attributes, (attribute) => {
    if (hasProperty(DomProperties, attribute)) {
      const propertyRecord = DomProperties[attribute]
      setProperty(
        vNode.node,
        propertyRecord.type,
        propertyRecord.propName,
        null
      )
    } else {
      if (attribute in vNode.node) {
        setProperty(vNode.node, Types.STRING, attribute, null)
      }
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

    if (hasProperty(DomProperties, attribute)) {
      const propertyRecord = DomProperties[attribute]
      setProperty(
        vNode.node,
        propertyRecord.type,
        propertyRecord.propName,
        value
      )
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

    if (attribute in vNode.node) {
      setProperty(vNode.node, Types.STRING, attribute, value)
    }
    vNode.node.setAttribute(attribute, value || "")
  }
}

/**
 * Checks property-based attributes. If the attribute exists,
 * then we should set its property value.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getPropertyValues = (element, attributes) => {
  for (let attr in DomProperties) {
    const propertyRecord = DomProperties[attr]
    const propName = propertyRecord.propName
    const attrValue = element.getAttribute(attr)

    if (attr === DomProperties.style.attrName) {
      attributes[attr] = element.style[propName]
    } else if (typeof attrValue === "string") {
      attributes[attr] = attrValue
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
      if (!hasProperty(DomProperties, attribute.name)) {
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
