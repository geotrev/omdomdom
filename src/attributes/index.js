import { hasProperty, forEach } from "../utilities"
import { InternalAttributes, Namespace, DomProperties, Types } from "./records"
import { setProperty } from "./set-property"

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} vNode
 * @param {string[]} attributes
 */
const removeAttributes = (vNode, attributes) => {
  forEach(attributes, (attrName) => {
    if (hasProperty(DomProperties, attrName)) {
      const propertyRecord = DomProperties[attrName]
      setProperty(
        vNode.node,
        propertyRecord.type,
        propertyRecord.propName,
        null
      )
    } else {
      if (attrName in vNode.node) {
        setProperty(vNode.node, Types.STRING, attrName, null)
      }
      vNode.node.removeAttribute(attrName)
    }

    delete vNode.attributes[attrName]
  })
}

/**
 * Adds attributes to the element.
 * @param {VirtualNode} vNode
 * @param {Object.<string, string>} attributes
 */
const setAttributes = (vNode, attributes) => {
  for (let attrName in attributes) {
    const value = attributes[attrName]
    vNode.attributes[attrName] = value

    if (attrName === InternalAttributes.KEY) {
      vNode.attributes[attrName] = value
      continue
    }

    if (hasProperty(DomProperties, attrName)) {
      const propertyRecord = DomProperties[attrName]
      setProperty(
        vNode.node,
        propertyRecord.type,
        propertyRecord.propName,
        value
      )
      continue
    }

    // Set namespaced properties using setAttributeNS
    if (attrName.startsWith(Namespace.xlink.prefix)) {
      vNode.node.setAttributeNS(Namespace.xlink.resource, attrName, value)
      continue
    } else if (attrName.startsWith(Namespace.xml.prefix)) {
      vNode.node.setAttributeNS(Namespace.xml.resource, attrName, value)
      continue
    }

    if (attrName in vNode.node) {
      setProperty(vNode.node, Types.STRING, attrName, value)
    }
    vNode.node.setAttribute(attrName, value || "")
  }
}

/**
 * Checks property-based attributes. If the attribute exists,
 * then we should set its property value.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getPropertyValues = (element, attributes) => {
  for (let attrName in DomProperties) {
    const propertyRecord = DomProperties[attrName]
    const propName = propertyRecord.propName
    const attrValue = element.getAttribute(attrName)

    if (attrName === DomProperties.style.attrName) {
      attributes[attrName] = element.style[propName]
    } else if (typeof attrValue === "string") {
      attributes[attrName] = attrValue
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
    (attributes, attrName) => {
      if (!hasProperty(DomProperties, attrName.name)) {
        attributes[attrName.name] = attrName.value
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
  for (let attrName in vNode.attributes) {
    const oldValue = vNode.attributes[attrName]
    const nextValue = template.attributes[attrName]
    if (oldValue === nextValue) continue

    if (typeof nextValue === "undefined") {
      removedAttributes.push(attrName)
    }
  }

  // Get changed or new attributes
  for (let attrName in template.attributes) {
    const oldValue = vNode.attributes[attrName]
    const nextValue = template.attributes[attrName]
    if (oldValue === nextValue) continue

    if (typeof nextValue !== "undefined") {
      changedAttributes[attrName] = nextValue
    }
  }

  // Add and remove attributes
  removeAttributes(vNode, removedAttributes)
  setAttributes(vNode, changedAttributes)
}
