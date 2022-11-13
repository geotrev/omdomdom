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
  node: HTMLElement | Text | Comment
  isSVGContext: boolean
}

// Internal types

export type VNodeKeyToChildMap = Record<string, VNode>

export type PropertyAwareElement = {
  style: { [x: string]: string | number | boolean }
} & Record<string, any> &
  HTMLElement
