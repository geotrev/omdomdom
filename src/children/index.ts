import { VNode, VNodeChildren, VNodeChildToKeyMap } from "src/types"
import {
  forEach,
  createKeyMap,
  insertBefore,
  DATA_KEY_ATTRIBUTE,
  hasProperty,
} from "../utilities"

/**
 * Diffs the children of both template and vNode, treating the vNode as
 * the source of truth. Assigns the new children state to `vNode`.
 */
export function patchChildren(
  template: VNode,
  vNode: VNode,
  patch: Function
): void {
  const templateChildrenLength: number = template.children.length
  const vNodeChildrenLength: number = vNode.children.length

  if (!templateChildrenLength && !vNodeChildrenLength) return

  const vNodeKeyMap: VNodeChildToKeyMap | undefined = createKeyMap(
    vNode.children
  )
  let nextChildren: VNodeChildren = Array(templateChildrenLength)

  // Attempt to reconcile keyed children.
  //
  // If they exist, preserve the original vnode reference,
  // including the DOM node.
  //
  // Otherwise, if no keyed children existed, simply patch over
  // the existing child vnodes.

  if (vNodeKeyMap !== undefined) {
    forEach(
      template.children as VNodeChildren,
      (templateChild: VNode, idx: number) => {
        const childNodes = vNode.node.childNodes
        const key = templateChild.attributes[DATA_KEY_ATTRIBUTE]

        if (hasProperty(vNodeKeyMap, key)) {
          const keyedChild = vNodeKeyMap[key]

          if (
            Array.prototype.indexOf.call(childNodes, keyedChild.node) !== idx
          ) {
            insertBefore(vNode, keyedChild, childNodes[idx] as Element)
          }

          nextChildren[idx] = keyedChild

          // Remove key entry to prevent dupes
          delete vNodeKeyMap[key]
          patch(templateChild, nextChildren[idx])
        } else {
          insertBefore(vNode, templateChild, childNodes[idx] as Element)
          nextChildren[idx] = templateChild
        }
      }
    )
  } else {
    forEach(
      template.children as VNodeChildren,
      (templateChild: VNode, idx: number) => {
        const vNodeChild = vNode.children[idx]

        if (typeof vNodeChild !== "undefined") {
          patch(templateChild, vNodeChild)
          nextChildren[idx] = vNodeChild
        } else {
          vNode.node.appendChild(templateChild.node)
          nextChildren[idx] = templateChild
        }
      }
    )
  }

  // Set the new children back to the original vnode.
  vNode.children = nextChildren

  // Finally, remove any real nodes that are left over from
  // the diff, if they exist.
  //
  // This assumes all children from template.children
  // have correctly been patched into the DOM/vnode tree,
  // and anything after index of [vNode.childNodes.length - 1]
  // in the DOM is stale.
  //
  // Iterate until the length of extra child nodes equals zero.
  let childNodesLength: number = vNode.node.childNodes.length
  let delta: number = childNodesLength - templateChildrenLength
  if (delta > 0) {
    while (delta > 0) {
      vNode.node.removeChild(vNode.node.childNodes[childNodesLength - 1])
      childNodesLength--
      delta--
    }
  }
}
