/**
 * Attributes only relevant to the renderer, and don't need to be exposed.
 * @type {Object.<string, string>}
 */
export const InternalAttributes = {
  KEY: "key",
}

/**
 * Attributes that should exclusively set using the DOM property.
 * @type {Object.<string, string>}
 */
export const DomProperties = {
  checked: "checked",
  multiple: "multiple",
  muted: "muted",
  selected: "selected",
  tabindex: "tabIndex",
  class: "className",
  style: "style",
  id: "id",
  lang: "lang",
  dir: "dir",
}

/**
 * These require setAttributeNS
 * @type {Object.<string, string>}
 */
export const Namespace = {
  xlink: {
    prefix: "xlink:",
    resource: "http://www.w3.org/1999/xlink",
  },
  xml: {
    prefix: "xml:",
    resource: "http://www.w3.org/XML/1998/namespace",
  },
}
