import { forEach, assignVNode } from "./utilities"
import { toHTML } from "./parsers"
import { updateAttributes, getAttributes } from "./attributes"
import { patchChildren } from "./children"

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
 * Reconcile differences between two virtual DOM trees.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 * @param {Node} rootNode - the HTML element containing the current node context
 */
export const patch = (template, vNode, rootNode) => {
  // This came happen if a null result is given for either
  // template or vNode. Impossible to compare - return.
  if (!template || !vNode) return

  rootNode = rootNode || vNode.node.parentNode
  const contentChanged = template.content && template.content !== vNode.content

  // If the type or content changed, replace the node completely
  if (template.type !== vNode.type || contentChanged) {
    rootNode.replaceChild(template.node, vNode.node)
    return assignVNode(template, vNode)
  }

  // Update attributes, if any
  updateAttributes(template, vNode)

  // Diff child nodes recursively
  patchChildren(template, vNode, patch)
}

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
 * Creates a new virtual DOM from a root node.
 * @param {HTMLElement|ShadowRoot|HTMLBodyElement} node
 * @param {boolean} isSVGContext
 * @returns {VirtualNode}
 */
export const create = (node, isSVGContext = false) => {
  if (typeof node === "string") {
    node = toHTML(node)
  }

  const isRoot = node.tagName === "BODY"
  const childNodes = node.childNodes
  const numChildNodes = childNodes ? childNodes.length : 0

  // toHTML returns a `body` tag as its root node, but we want the first child only
  if (isRoot) {
    if (numChildNodes > 1) {
      throw new Error(
        "[OmDomDom]: Your element should not have more than one root node."
      )
    } else if (numChildNodes === 0) {
      throw new Error(
        "[OmDomDom]: Your element should have at least one root node."
      )
    } else {
      return create(childNodes[0])
    }
  }

  const type =
    node.nodeType === 3
      ? "text"
      : node.nodeType === 8
      ? "comment"
      : node.tagName.toLowerCase()
  const isSVG = isSVGContext || type === "svg"
  const attributes = node.nodeType === 1 ? getAttributes(node) : {}
  const content = numChildNodes > 0 ? null : node.textContent

  // Recursively build children
  const children = Array(numChildNodes)
  forEach(childNodes, (child, idx) => {
    children[idx] = create(child, isSVG)
  })

  return { type, attributes, children, content, node, isSVGContext: isSVG }
}
