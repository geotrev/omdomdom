import { forEach } from "../utilities"

/**
 * Takes an inline style string and reduces it to
 * an array of objects per prop/value pair.
 * @param {string} styles
 * @returns {Object.<string, string>}
 */
const styleStringToMap = (styles) => {
  return styles.split(";").reduce((allStyles, style) => {
    const entry = style.trim()

    if (entry.indexOf(":") > 0) {
      const [name, value] = entry.split(":")
      if (value.trim() !== "") {
        return { ...allStyles, [name.trim()]: value.trim() }
      }
    }

    return allStyles
  }, {})
}

/**
 * Removes inline styles from the element.
 * @param {HTMLElement} element
 * @param {string[]} styles
 */
export const removeStyles = (element, styles) => {
  forEach(styles, (property) => (element.style[property] = ""))
}

/**
 * Adds inline styles to the element.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} styles
 */
const addStyles = (element, styleMap) => {
  for (let property in styleMap) {
    if (element.style[property] !== styleMap[property]) {
      element.style[property] = styleMap[property]
    }
  }
}

/**
 * Updates styles on element.
 * @param {HTMLElement} element
 * @param {string} styles
 */
export const updateStyles = (element, styles) => {
  const styleMap = styleStringToMap(styles)

  // Get styles to remove
  const staleStyles = Array.prototype.filter.call(
    element.style,
    (style) => styleMap[style] === undefined
  )

  // Remove + update changes
  removeStyles(element, staleStyles)
  addStyles(element, styleMap)
}
