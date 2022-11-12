import { forEach, assignVNode } from "./utilities"
import { toHTML } from "./parsers"
import { updateAttributes, getAttributes } from "./attributes"
import { patchChildren } from "./children"
import { VNodeDOMNode, VNode, VNodeElementType } from "./types"

export const patch = (
  template: VNode,
  vNode: VNode,
  rootNode: HTMLElement
): void => {
  // This came happen if a null result is given for either
  // template or vNode. Impossible to compare - return.
  if (!template || !vNode) return

  rootNode = rootNode || (vNode.node as HTMLElement).parentNode
  const contentChanged = template.content && template.content !== vNode.content

  // If the type or content changed, replace the node completely
  if (template.type !== vNode.type || contentChanged) {
    rootNode.replaceChild(
      template.node as HTMLElement,
      vNode.node as HTMLElement
    )
    return assignVNode(template, vNode)
  }

  // Update attributes, if any
  updateAttributes(template, vNode)

  // Diff child nodes recursively
  patchChildren(template, vNode, patch)
}

export const render = (vNode: VNode, root: HTMLElement): void => {
  root.appendChild(vNode.node as HTMLElement)
}

export const create = (
  node: VNodeDOMNode,
  isSVGContext: boolean | undefined = false
): VNode => {
  if (typeof node === "string") {
    node = toHTML(node)
  }

  const isRoot = (node as Element).tagName === "BODY"
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
      return create(childNodes[0] as VNodeDOMNode)
    }
  }

  const type: VNodeElementType =
    node.nodeType === 3
      ? "text"
      : node.nodeType === 8
      ? "comment"
      : (node as Element).tagName.toLowerCase()
  const isSVG = isSVGContext || type === "svg"
  const attributes =
    node.nodeType === 1 ? getAttributes(node as HTMLElement) : {}
  const content = numChildNodes > 0 ? null : node.textContent

  // Recursively build children
  const children = Array(numChildNodes)
  forEach(childNodes, (child: VNodeDOMNode, idx: number) => {
    children[idx] = create(child, isSVG)
  })

  return { type, attributes, children, content, node, isSVGContext: isSVG }
}
