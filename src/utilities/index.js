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
 * Checks if the object property exists.
 * @param {Object.<string, string>} obj
 * @param {string} prop
 */
export const hasProperty = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop)
