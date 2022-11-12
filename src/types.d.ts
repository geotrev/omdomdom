export type VNodeDOMNode = HTMLElement | Comment | Text

export type VNodeElementType =
  | "comment"
  | "text"
  | "svg"
  | keyof HTMLElementTagNameMap
  | string

export type VNodeAttributeMap = Record<string, string>

export type VNodeContent = string | null

export type VNodeChildren = VNode[]

export interface VNode {
  type: VNodeElementType
  attributes: VNodeAttributeMap
  content: VNodeContent
  children: VNodeChildren
  node: VNodeDOMNode
  isSVGContext: boolean
}

// Internal types

export type VNodeChildToKeyMap = Record<string, VNode>
