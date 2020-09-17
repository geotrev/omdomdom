import { forEach, createKeyMap, isnertBefore, patch } from "./utilities"
import { toHTML } from "./parsers"
import { updateAttributes, getAttributes } from "./attributes"

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
 * Both template and vNode have arrays of virtual nodes. Diff them.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 */
const updateChildren = (template, vNode) => {
  const templateChildrenLength = template.children.length

  if (!templateChildrenLength && !vNode.children.length) return

  const [vNodeKeyMap, hasKeys] = createKeyMap(vNode.children)

  // There were no keys found:

  if (!hasKeys) {
    // Remove extra nodes if template.children is smaller
    let delta = vNode.children.length - templateChildrenLength
    if (delta > 0) {
      while (delta-- > 0) {
        const child = vNode.children.pop()
        vNode.node.removeChild(child.node)
      }
    }

    return forEach(template.children, (templateChild, idx) => {
      const vNodeChild = vNode.children[idx]

      if (typeof vNodeChild !== "undefined") {
        update(templateChild, vNodeChild)
      } else {
        vNode.node.appendChild(templateChild.node)
        vNode.children.push(templateChild)
      }
    })
  }

  // There were keys found, resolve them:

  let nextChildren = Array(templateChildrenLength)

  // Match keys and update/move children in-place
  forEach(template.children, (child, idx) => {
    const childNodes = vNode.node.childNodes
    const key = child.attributes.key

    if (Object.prototype.hasOwnProperty.call(vNodeKeyMap, key)) {
      const keyChild = vNodeKeyMap[key]

      if (Array.prototype.indexOf.call(childNodes, keyChild.node) !== idx) {
        insertBefore(vNode, keyChild, childNodes[idx])
      }

      nextChildren[idx] = keyChild

      // Prevent duplicates, remove the entry and let it insert at
      // its natural index in the `else` block.
      delete vNodeKeyMap[key]
      update(child, nextChildren[idx])
    } else {
      insertBefore(vNode, child, childNodes[idx])
      nextChildren[idx] = child
    }
  })

  vNode.children = nextChildren

  // Remove any real nodes that are left over from the diff
  let childNodesLength = vNode.node.childNodes.length
  let delta = childNodesLength - templateChildrenLength
  if (delta > 0) {
    while (delta-- > 0) {
      vNode.node.removeChild(vNode.node.childNodes[childNodesLength - 1])
      childNodesLength--
    }
  }
}

/**
 * Reconcile differences between two virtual DOM trees.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 * @param {Node} rootNode - the HTML element containing the current node context
 */
export const update = (template, vNode, rootNode = vNode.node.parentNode) => {
  // Node nodes to compare, exit
  if (!template && !vNode) return
  const contentChanged = template.content && template.content !== vNode.content

  // If the type or content changed, replace the node completely
  if (template.type !== vNode.type || contentChanged) {
    rootNode.replaceChild(template.node, vNode.node)
    return patch(template, vNode)
  }

  // Update attributes, if any
  updateAttributes(template, vNode)

  // Diff child nodes recursively
  updateChildren(template, vNode)
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
        "[omDomDom]: Your element should not have more than one root node."
      )
    } else if (numChildNodes === 0) {
      throw new Error(
        "[omDomDom]: Your element should have at least one root node."
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

  if (Object.prototype.hasOwnProperty.call(attributes, "key")) {
    node.removeAttribute("key")
  }

  // Recursively build children
  const children = Array(numChildNodes)
  forEach(childNodes, (child, idx) => {
    children[idx] = create(child, isSVG)
  })

  return { type, attributes, children, content, node, isSVGContext: isSVG }
}
