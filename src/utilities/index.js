const DATA_KEY_ATTRIBUTE = "data-key"

/**
 * Checks if the object property exists.
 * @param {Object.<string, any>} obj
 * @param {string} prop
 * @returns {boolean}
 */
export const hasProperty = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop)

/**
 * Checks if a property in a keyMap is unique. if not, it's skipped.
 * @param {Object.<string, VirtualNode>} map
 * @param {string} key
 * @returns {boolean}
 */
const keyIsValid = (map, key) => {
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

/**
 * lodash forEach, basically.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEach = (items, fn) => {
  const length = items.length
  let idx = -1

  if (!length) return

  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}

/**
 * Generates a <key: vNode> map of a virtual node list.
 * @param {VirtualNode[]} children
 * @returns {Object.<string, VirtualNode>}
 */
export const createKeyMap = (children) => {
  const map = {}
  let hasKeys = false

  forEach(children, (child) => {
    const key = child.attributes[DATA_KEY_ATTRIBUTE]
    if (keyIsValid(map, key)) {
      map[key] = child
      if (!hasKeys) hasKeys = true
    }
  })

  return hasKeys ? map : null
}

export const insertBefore = (parent, child, refNode) => {
  return parent.node.insertBefore(child.node, refNode)
}

/**
 * Transfers properties from one virtual node to another.
 * @param {VirtualNode} template
 * @param {VirtualNode} vNode
 */
export const assignVNode = (template, vNode) => {
  for (let property in template) {
    vNode[property] = template[property]
  }
}
