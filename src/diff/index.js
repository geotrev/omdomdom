import { forEach, isArray, createKeyMap, insertNode } from "../utilities"
import { diffAttributes } from "../attributes"

/**
 * Removes extra nodes from a root that previously had more than one virtual node.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 */
const childListToVNode = (template, vNode) => {
  if (template.children.key) {
    let nodeIdx = -1
    forEach(vNode.children, (child, idx) => {
      if (template.children.key === child.key) {
        nodeIdx = idx
      } else {
        vNode.node.removeChild(child.node)
      }
    })

    // Diff the matching child, if we found it
    if (nodeIdx) {
      vNode.children = vNode.children[nodeIdx]
      return diff(template.children, vNode.children, vNode.node)
    }
  }

  // In the case of no template.key or there was no key on the last node,
  // rebuild the tree using the template.

  vNode.children.forEach((child) => vNode.node.removeChild(child.node))
  vNode.node.appendChild(template.children.node)
  vNode.children = template.children
}

/**
 * Builds a list of sibling nodes from a root previously containing one node.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 */
const vNodeToChildList = (template, vNode) => {
  let nextChildren = Array(template.children.length)

  // There is no key, diff the existing child and add the rest of the template
  if (!vNode.children.key) {
    forEach(template.children, (child, idx) => {
      if (idx === 0) {
        return (nextChildren[idx] = vNode.children)
      }

      vNode.node.appendChild(child.node)
      nextChildren[idx] = child
    })

    vNode.children = nextChildren
    return diff(template.children[0], vNode.children[0])
  } else {
    let nodeIdx = -1

    forEach(template.children, (child, idx) => {
      if (child.key === vNode.children.key) {
        nodeIdx = idx
        return false
      }
    })

    forEach(template.children, (child, idx) => {
      if (idx === nodeIdx) {
        return (nextChildren[idx] = vNode.children)
      } else if (idx < nodeIdx) {
        vNode.node.insertBefore(child.node, vNode.node.childNodes[idx])
      } else {
        vNode.node.appendChild(child.node)
      }

      nextChildren[idx] = child
    })

    vNode.children = nextChildren
    return diff(template.children[nodeIdx], vNode.children[nodeIdx])
  }
}

/**
 * Both template and vNode have arrays of virtual nodes. Diff them.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 */
const diffChildList = (template, vNode) => {
  // Dictionaries used to track which keys have been modified.
  const templateChildrenLength = template.children.length
  let nextChildren = Array(templateChildrenLength)
  const vNodeKeyMap = createKeyMap(vNode.children)

  // There are no keys detected
  if (!Object.keys(vNodeKeyMap).length) {
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
        diff(templateChild, vNodeChild)
      } else {
        vNode.node.appendChild(templateChild.node)
        vNode.children.push(templateChild)
      }
    })
  }

  // Match keys and update/move children in-place
  forEach(template.children, (child, idx) => {
    const childNodes = vNode.node.childNodes

    if (Object.prototype.hasOwnProperty.call(vNodeKeyMap, child.key)) {
      if (
        Array.prototype.indexOf.call(
          childNodes,
          vNodeKeyMap[child.key].node
        ) !== idx
      ) {
        insertNode(vNode, vNodeKeyMap[child.key], childNodes[idx])
      }
      nextChildren[idx] = vNodeKeyMap[child.key]
      delete vNodeKeyMap[child.key]
      diff(child, nextChildren[idx])
    } else {
      insertNode(vNode, child, childNodes[idx])
      nextChildren[idx] = child
    }
  })

  vNode.children = nextChildren

  // Remove any real nodes that are left over from the diff
  let delta = vNode.node.childNodes.length - templateChildrenLength
  if (delta > 0) {
    while (delta-- > 0) {
      const length = vNode.node.childNodes.length
      vNode.node.removeChild(vNode.node.childNodes[length - 1])
    }
  }
}

/**
 * Diffs one or both of template.children and vNode.children that are an array of nodes.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 * @param {boolean} templateChildrenIsList
 * @param {boolean} vNodeChildrenIsList
 */
const diffChildren = (
  template,
  vNode,
  templateChildrenIsList,
  vNodeChildrenIsList
) => {
  // If template no longer has children, remove all nodes.
  // Else, if vNode has no children
  if (!template.children) {
    vNode.children.forEach((child) => vNode.node.removeChild(child.node))
    return (vNode.children = null)
  } else if (!vNode.children) {
    template.children.forEach((child) => vNode.node.appendChild(child.node))
    return (vNode.children = template.children)
  }

  // Things are getting complicated:
  // - If both children are lists of nodes, diff them, preserving nodes if they have keys defined.
  // - If template children is now a list, but vNode children had a single node, build it up
  // - If template children is now a single node, but vNode children were a list, break down the list
  //   and preserve the single node if a key was attached.
  if (templateChildrenIsList && vNodeChildrenIsList) {
    diffChildList(template, vNode)
  } else if (templateChildrenIsList && !vNodeChildrenIsList) {
    vNodeToChildList(template, vNode)
  } else if (!templateChildrenIsList && vNodeChildrenIsList) {
    childListToVNode(template, vNode)
  }
}

/**
 * Transfers properties from one virtual node to another.
 * @param {VirtualNode} template
 * @param {VirtualNode} vNode
 */
const rebuildNode = (template, vNode) => {
  for (let property in template) {
    vNode[property] = template[property]
  }
}

/**
 * Reconcile differences between a virtual DOM tree, starting from least complex to most complex.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 * @param {Node} rootNode - the HTML element containing the current virtual node context
 */
export const diff = (template, vNode, rootNode = vNode.node.parentNode) => {
  // Node nodes to compare, exit
  if (!template && !vNode) return

  // If the type changed, replace the node completely
  if (template.type !== vNode.type) {
    rootNode.replaceChild(template.node, vNode.node)
    return rebuildNode(template, vNode)
  }

  // If content changed, update it
  if (template.content && template.content !== vNode.content) {
    rootNode.textContent = template.content
    return (vNode.content = template.content)
  }

  // Update attributes, if any
  diffAttributes(template, vNode)

  const templateChildrenIsList = isArray(template.children)
  const vNodeChildrenIsList = isArray(vNode.children)

  // If template has no children when there previously were children
  if (!template.children && vNode.children) {
    if (vNodeChildrenIsList) {
      vNode.children.forEach((child) => vNode.node.removeChild(child.node))
    } else {
      vNode.node.removeChild(vNode.children.node)
    }
    return (vNode.children = null)
  }

  // If template has  children when there previously were no children
  if (template.children && !vNode.children) {
    if (templateChildrenIsList) {
      const fragment = document.createDocumentFragment()
      template.children.forEach((child) => fragment.appendChild(child.node))
      vNode.node.appendChild(fragment)
    } else {
      vNode.node.appendChild(template.children.node)
    }
    return (vNode.children = template.children)
  }

  // Diff child nodes recursively
  if (!templateChildrenIsList && !vNodeChildrenIsList) {
    return diff(template.children, vNode.children, vNode.node)
  }

  // If any children are arrays of nodes, we need to do a deeper compare
  if (templateChildrenIsList || vNodeChildrenIsList) {
    return diffChildren(
      template,
      vNode,
      templateChildrenIsList,
      vNodeChildrenIsList
    )
  }
}
