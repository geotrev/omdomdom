import { forEach, createKeyMap, insertBefore } from "../utilities"

const DATA_KEY_ATTRIBUTE = "data-key"

/**
 * Both template and vNode have arrays of virtual nodes. Diff them.
 * @param {VirtualNode} template - new virtual node tree.
 * @param {VirtualNode} vNode - existing virtual node tree.
 */
export function patchChildren(template, vNode, patch) {
  const templateChildrenLength = template.children.length
  const vNodeChildrenLength = vNode.children.length

  if (!templateChildrenLength && !vNodeChildrenLength) return

  const vNodeKeyMap = createKeyMap(vNode.children)
  let nextChildren = Array(templateChildrenLength)

  if (vNodeKeyMap !== undefined) {
    forEach(template.children, (templateChild, idx) => {
      const childNodes = vNode.node.childNodes
      const key = templateChild.attributes[DATA_KEY_ATTRIBUTE]

      if (Object.prototype.hasOwnProperty.call(vNodeKeyMap, key)) {
        const keyedChild = vNodeKeyMap[key]

        if (Array.prototype.indexOf.call(childNodes, keyedChild.node) !== idx) {
          insertBefore(vNode, keyedChild, childNodes[idx])
        }

        nextChildren[idx] = keyedChild

        // Remove entry to prevent dupes
        delete vNodeKeyMap[key]
        patch(templateChild, nextChildren[idx])
      } else {
        insertBefore(vNode, templateChild, childNodes[idx])
        nextChildren[idx] = templateChild
      }
    })
  } else {
    forEach(template.children, (templateChild, idx) => {
      const vNodeChild = vNode.children[idx]

      if (typeof vNodeChild !== "undefined") {
        patch(templateChild, vNodeChild)
        nextChildren[idx] = vNodeChild
      } else {
        vNode.node.appendChild(templateChild.node)
        nextChildren[idx] = templateChild
      }
    })
  }

  vNode.children = nextChildren

  // Remove any real nodes that are left over from the diff
  let childNodesLength = vNode.node.childNodes.length
  let delta = childNodesLength - templateChildrenLength

  if (delta > 0) {
    while (delta > 0) {
      vNode.node.removeChild(vNode.node.childNodes[childNodesLength - 1])
      childNodesLength--
      delta--
    }
  }
}
