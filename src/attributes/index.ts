import { VNode, PropertyAwareElement } from "../types"
import { hasProperty, forEach } from "../utilities"
import { Namespace, DomProperties, Types } from "./records"
import { setProperty } from "./set-property"

type AttributeMap = Record<string, any>
type AttributeList = string[]

const removeAttributes = (vNode: VNode, attributes: AttributeList): void => {
  forEach(attributes, (attrName: string) => {
    const node = vNode.node as PropertyAwareElement

    if (hasProperty(DomProperties, attrName)) {
      const propertyRecord = DomProperties[attrName]
      setProperty(node, propertyRecord.type, propertyRecord.propName, null)
    } else {
      if (attrName in vNode.node) {
        setProperty(node, Types.STRING, attrName, null)
      }
      node.removeAttribute(attrName)
    }

    delete vNode.attributes[attrName]
  })
}

const setAttributes = (vNode: VNode, attributes: AttributeMap) => {
  for (let attrName in attributes) {
    const value = attributes[attrName]
    vNode.attributes[attrName] = value

    const node = vNode.node as PropertyAwareElement

    if (hasProperty(DomProperties, attrName)) {
      const propertyRecord = DomProperties[attrName]
      setProperty(node, propertyRecord.type, propertyRecord.propName, value)
      continue
    }

    // Set namespaced properties using setAttributeNS
    if (attrName.startsWith(Namespace.xlink.prefix)) {
      node.setAttributeNS(Namespace.xlink.resource, attrName, value)
      continue
    }

    if (attrName.startsWith(Namespace.xml.prefix)) {
      node.setAttributeNS(Namespace.xml.resource, attrName, value)
      continue
    }

    if (attrName in node) {
      setProperty(node, Types.STRING, attrName, value)
    }
    node.setAttribute(attrName, value || "")
  }
}

const getPropertyValues = (
  element: PropertyAwareElement,
  attributes: AttributeMap
) => {
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

const getBaseAttributes = (element: HTMLElement): AttributeMap => {
  const elementAttrs: { name: string; value: string }[] = [
    ...element.attributes,
  ].map((attr) => ({
    name: attr.name,
    value: attr.value,
  }))

  return elementAttrs.reduce(
    (
      acc: AttributeMap,
      attr: { name: string; value: string }
    ): AttributeMap => {
      if (!hasProperty(DomProperties, attr.name)) {
        acc[attr.name] = attr.value
      }
      return acc
    },
    {}
  )
}

/**
 * Gets all attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
export const getAttributes = (element: PropertyAwareElement) => {
  const attributes: AttributeMap = getBaseAttributes(element)
  getPropertyValues(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from vNode to template
 * @param {VirtualNode} template
 * @param {VirtualNode} vNode
 */
export const updateAttributes = (template: VNode, vNode: VNode): void => {
  let removedAttributes: AttributeList = []
  let changedAttributes: AttributeMap = {}

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
