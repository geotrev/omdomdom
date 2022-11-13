import { PropertyAwareElement } from "../types"
import { Types, DomProperties, RecordType, RecordPropName } from "./records"

export const setProperty = (
  element: PropertyAwareElement,
  type: RecordType,
  prop: RecordPropName,
  value: any
): void => {
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
        // otherwise the value is coerced + reflected into the attribute.
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
