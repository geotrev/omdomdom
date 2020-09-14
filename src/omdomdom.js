import { forEach } from "./utilities"
import { getAttributes } from "./attributes"

/**
 * Object representation of a DOM element.
 * @typedef VirtualNode
 * @type {Object}
 * @property {string} type - The type of node. E.g., tag name, "comment", or "text".
 * @property {Object.<string, string>} attributes - List of attributes, if any.
 * @property {TextNode|CommentNode} content - Text or comment content, if any.
 * @property {VirtualNode[]} children - Child virtual nodes, if any.
 * @property {HTMLElement} node - The corresponding DOM element.
 * @property {boolean} isSVGContext
 */

/**
 * Renders a node into the given root context. This happens one time,
 * when a component is first rendered.
 * All subsequent renders are the result of reconciliation.
 * @param {VirtualNode} vDOM
 * @param {ShadowRoot|HTMLElement} root
 */
export const render = (vNode, root) => {
  root.appendChild(vNode.node)
}

/**
 * Convert stringified HTML into valid HTML, stripping all extra spaces.
 * @param {string} stringToRender
 */
export const createHTML = (stringToRender) => {
  /**
   * Remove all extraneous whitespace:
   * - From the beginning + end of the document fragment
   * - If there's more than one space before a left tag bracket, replace them with one
   * - If there's more than one space before a right tag bracket, replace them with one
   */
  const processedDOMString = stringToRender
    .trim()
    .replace(/\s+</g, "<")
    .replace(/>\s+/g, ">")

  const parser = new DOMParser()
  const context = parser.parseFromString(processedDOMString, "text/html")

  return context.body
}

/**
 * Creates a new virtual DOM from a root node.
 * @param {HTMLElement|ShadowRoot|HTMLBodyElement} node
 * @param {boolean} isSVGContext
 * @returns {VirtualNode}
 */
export const createNode = (node, isSVGContext = false) => {
  const isRoot = node.tagName === "BODY"
  const childNodes = node.childNodes
  const numChildNodes = childNodes ? childNodes.length : 0

  if (isRoot) {
    if (numChildNodes > 1) {
      throw new Error(
        "[omDomDom]: Your element should not have more than one root node."
      )
    } else if (numChildNodes === 0) {
      throw new Error(
        "[omDomDom]: Your element should have at least one root node."
      )
    } else {
      return createNode(childNodes[0])
    }
  }

  // Get basic node data.
  const type =
    node.nodeType === 3
      ? "text"
      : node.nodeType === 8
      ? "comment"
      : node.tagName.toLowerCase()
  const isSVG = isSVGContext || type === "svg"
  const attributes = node.nodeType === 1 ? getAttributes(node) : {}
  const content = numChildNodes > 0 ? null : node.textContent
  let key

  // Retrieve key from attributes if they were created, then delete
  // it from attributes to prevent reflection into the real DOM.
  if (attributes.key) {
    key = attributes.key
    // node.removeAttribute("key")
  }

  // Recursively build children, if any.
  let children = null
  if (numChildNodes > 1) {
    children = Array(numChildNodes)
    forEach(childNodes, (child, idx) => {
      children[idx] = createNode(child, isSVG)
    })
  } else if (numChildNodes === 1) {
    children = createNode(childNodes[0])
  }

  return { type, attributes, key, children, content, node, isSVGContext: isSVG }
}
