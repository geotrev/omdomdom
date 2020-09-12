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
  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}

/**
 * forEach in reverse.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEachReverse = (items, fn) => {
  let idx = items.length
  while (--idx >= 0) {
    if (fn(items[idx], idx) === false) break
  }
}
