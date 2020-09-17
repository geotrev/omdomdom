import { forEach, createKeyMap, insertBefore, patch } from "../utilities"
import { updateAttributes } from "../attributes"

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
 * Reconcile differences between a virtual DOM tree, starting from least complex to most complex.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 * @param {Node} rootNode - the HTML element containing the current virtual node context
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
