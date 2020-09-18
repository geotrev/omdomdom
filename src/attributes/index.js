import { forEach } from "../utilities"
import { updateStyles, removeStyles } from "../styles"

/**
 * @type {string[]}
 */
export const dynamicAttributes = ["checked", "selected", "value"]

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} vNode
 * @param {Attribute[]} attributes
 */
const removeAttributes = (vNode, attributes) => {
  forEach(attributes, (attribute) => {
    delete vNode.attributes[attribute]

    if (attribute === "key") return

    // If the attribute is `class` or `style`, unset the properties.
    // else if the attribute is also a property, unset it
    if (attribute === "class") {
      vNode.node.className = ""
    } else if (attribute === "style") {
      removeStyles(vNode.node, Array.prototype.slice.call(vNode.node.style))
    } else if (attribute in vNode.node) {
      vNode.node[attribute] = ""
    }

    // Clean up the DOM attribute, if it exists
    vNode.node.removeAttribute(attribute)
  })
}

/**
 * Adds attributes to the element.
 * @param {VirtualNode} vNode
 * @param {Object.<string, string>} attributes
 */
const addAttributes = (vNode, attributes) => {
  for (let attribute in attributes) {
    const value = attributes[attribute]
    vNode.attributes[attribute] = value

    if (attribute === "key") {
      vNode.attributes[attribute] = value
      continue
    }

    // - Assign class and style as properties
    // else unset the attribute and remove its property, if it exists
    if (attribute === "class") {
      vNode.node.className = value
    } else if (attribute === "style") {
      updateStyles(vNode.node, value)
    } else {
      // If the attribute is also a property, set it
      if (attribute in vNode.node) {
        vNode.node[attribute] =
          !vNode.node[attribute] && vNode.node[attribute] !== 0 ? true : value
      }
      vNode.node.setAttribute(attribute, value || "")
    }
  }
}

/**
 * Gets dynamic property-based attributes to be applied.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getDynamicAttributes = (element, attributes) => {
  forEach(dynamicAttributes, (prop) => {
    if (!element[prop]) return
    attributes[prop] = element[prop]
  })
}

/**
 * Gets non-dynamic node attributes to be applied.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getBaseAttributes = (element) => {
  let attributes = {}

  Array.prototype.forEach.call(element.attributes, (attribute) => {
    if (dynamicAttributes.indexOf(attribute.name) < 0) {
      attributes[attribute.name] = attribute.value
    }
  })

  return attributes
}

/**
 * Gets all virtual node attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
export const getAttributes = (element) => {
  const attributes = getBaseAttributes(element)
  getDynamicAttributes(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from vNode to nextVNode
 * @param {VirtualNode} nextVNode
 * @param {VirtualNode} vNode
 */
export const updateAttributes = (nextVNode, vNode) => {
  let removedAttributes = []
  let changedAttributes = {}

  // Get stale attributes
  for (let attribute in vNode.attributes) {
    const oldValue = vNode.attributes[attribute]
    const nextValue = nextVNode.attributes[attribute]
    if (oldValue !== nextValue && typeof nextValue === "undefined") {
      removedAttributes.push(attribute)
    }
  }

  // Get changed or new attributes
  for (let attribute in nextVNode.attributes) {
    const oldValue = vNode.attributes[attribute]
    const nextValue = nextVNode.attributes[attribute]
    if (oldValue !== nextValue && typeof nextValue !== "undefined") {
      changedAttributes[attribute] = nextValue
    }
  }

  // Add and remove attributes
  removeAttributes(vNode, removedAttributes)
  addAttributes(vNode, changedAttributes)
}
