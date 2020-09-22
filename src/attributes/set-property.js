import { Types, DomProperties } from "./records"

/**
 * Set a given attribute as a property, if it has a property equivalent
 * @param {HTMLElement} node
 * @param {string|number|boolean} type
 * @param {string} prop
 * @param {*} value
 */
export const setProperty = (element, type, prop, value) => {
  switch (type) {
    case Types.STRING: {
      if (prop === DomProperties.style.propName) {
        if (value === null) {
          element.style[prop] = ""
        } else {
          element.style[prop] = value
        }
      } else if (value === null) {
        element[prop] = ""
      } else {
        element[prop] = value
      }
      break
    }

    case Types.INT: {
      if (value === null) {
        const attr = prop.toLowerCase()
        // The attribute needs to be removed to reset the property,
        // otherwise the value coerced + reflected onto the attribute.
        element.removeAttribute(attr)
      } else if (value === "0") {
        element[prop] = 0
      } else if (value === "-1") {
        element[prop] = -1
      } else {
        const parsed = parseInt(value, 10)
        if (!isNaN(parsed)) {
          element[prop] = parsed
        }
      }
      break
    }

    case Types.BOOL: {
      if (["", "true"].indexOf(value) < 0) {
        element[prop] = false
      } else {
        element[prop] = true
      }
      break
    }

    default:
      break
  }
}
