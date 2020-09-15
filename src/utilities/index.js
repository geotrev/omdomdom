/**
 * Checks if the object property exists.
 * @param {Object.<string, any>} obj
 * @param {string} prop
 * @returns {boolean}
 */
const hasProperty = (obj, prop) =>
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
      "[omDomDom]: Children with duplicate keys detected. Children with duplicate keys will be skipped, resulting in dropped node references. Keys must be unique and non-indexed."
    )
    return false
  }

  return true
}

/**
 * Checks if the value is an array literal.
 * @param {*} value
 * @returns {boolean}
 */
export const isArray = (value) => {
  const type = typeof value
  return type !== "null" && type !== "undefined" && Array.isArray(value)
}

/**
 * Simplified lodash implementation.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEach = (items, fn) => {
  let idx = -1
  const length = items.length
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
  forEach(children, (child) => {
    if (keyIsValid(map, child.key)) map[child.key] = child
  })
  return map
}

export const insertNode = (parent, child, refNode) => {
  return parent.node.insertBefore(child.node, refNode)
}
