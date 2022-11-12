import { VNode, VNodeChildren, VNodeChildToKeyMap } from "src/types"

const DATA_KEY_ATTRIBUTE = "data-key"

export const hasProperty = (obj: object, prop: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, prop)

const keyIsValid = (map: object, key: string) => {
  if (!key) return false

  if (hasProperty(map, key)) {
    // eslint-disable-next-line no-console
    console.warn(
      "[OmDomDom]: Children with duplicate keys detected. Children with duplicate keys will be skipped, resulting in dropped node references. Keys must be unique and non-indexed."
    )
    return false
  }

  return true
}

export const forEach = (
  items: [] | NodeList | VNodeChildren,
  fn: Function
): void => {
  const length = items.length
  let idx = -1

  if (!length) return

  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}

export const createKeyMap = (
  children: VNodeChildren
): VNodeChildToKeyMap | undefined => {
  const map: VNodeChildToKeyMap = {}

  forEach(children, (child: VNode) => {
    const key = child.attributes[DATA_KEY_ATTRIBUTE]
    if (keyIsValid(map, key)) {
      map[key] = child
    }
  })

  // Cheap way to check if the map contains keys,
  // and if so, returns the map on the first iteration.
  for (const _ in map) {
    return map
  }
}

export const insertBefore = (parent: VNode, child: VNode, refNode: Element) => {
  return (parent.node as HTMLElement).insertBefore(
    child.node as HTMLElement,
    refNode
  )
}

export const assignVNode = (template: VNode, vNode: VNode) => {
  let prop: keyof VNode
  for (prop in template) {
    // @ts-ignore
    vNode[prop] = template[prop]
  }
}
