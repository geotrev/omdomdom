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
const forEach = (items, fn) => {
  let idx = -1
  const length = items.length
  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}

/**
 * Object representation of a DOM element.
 * @typedef VirtualNode
 * @type {Object}
 * @property {string} type - The type of node. E.g., tag name, "comment", or "text".
 * @property {Object.<string, string>} attributes - List of attributes, if any.
 * @property {TextNode|CommentNode} content - Text or comment content, if any.
 * @property {VirtualNode[]} children - Child virtual nodes, if any.
 * @property {HTMLElement} node - The corresponding DOM element.
 * @property {boolean} isSVGContext
 */

/**
 * @type {string[]}
 */
const dynamicAttributes = ["checked", "selected", "value"]

/**
 * Takes an inline style string and reduces it to
 * an array of objects per prop/value pair.
 * @param {string} styles
 * @returns {Attribute[]}
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
 * @param {Attribute[]} styles
 */
const removeStyles = (element, styles) => {
  forEach(styles, (property) => (element.style[property] = ""))
}

/**
 * Adds inline styles to the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} styles
 */
const updateStyles = (element, properties, styleMap) => {
  forEach(properties, (property) => {
    if (element.style[property] === styleMap[property]) return
    element.style[property] = styleMap[property]
  })
}

/**
 * Updates styles on element.
 * @param {HTMLElement} element
 * @param {string} styles
 */
const diffStyles = (element, styles) => {
  const styleMap = styleStringToMap(styles)
  const styleProps = Object.keys(styleMap)

  // Get styles to remove
  const staleStyles = Array.prototype.filter.call(
    element.style,
    (style) => styleMap[style] === undefined
  )

  // Remove + update changes
  removeStyles(element, staleStyles)
  updateStyles(element, styleProps, styleMap)
}

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} vNode
 * @param {Attribute[]} attributes
 */
const removeAttributes = (vNode, attributes) => {
  forEach(attributes, (attribute) => {
    delete vNode.attributes[attribute]

    // If the attribute is `class` or `style`, unset the properties.
    // else if the attribute is also a property, unset it
    if (attribute === "class") {
      vNode.element.className = ""
    } else if (attribute === "style") {
      removeStyles(
        vNode.element,
        Array.prototype.slice.call(vNode.element.style)
      )
    } else if (attribute in vNode.element) {
      vNode.element[attribute] = ""
    }

    // Clean up the DOM attribute, if it exists
    vNode.element.removeAttribute(attribute)
  })
}

/**
 * Adds attributes to the element.
 * @param {VirtualNode} vNode
 * @param {Attribute[]} attributes
 */
const addAttributes = (vNode, attributes) => {
  forEach(Object.keys(attributes), (attribute) => {
    const value = attributes[attribute]
    vNode.attributes[attribute] = value

    // If the attribute is `class` or `style`, apply those as properties.
    if (attribute === "class") {
      vNode.node.className = value
    } else if (attribute === "style") {
      diffStyles(vNode.node, value)
    } else {
      // If the attribute is also a property, set it
      if (attribute in vNode.node) {
        vNode.node[attribute] = value || attribute
      }
      vNode.node.setAttribute(attribute, value || "")
    }
  })
}

/**
 * Gets dynamic property-based attributes to be applied.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getDynamicAttributes = (element, attributes) => {
  forEach(dynamicAttributes, (prop) => {
    if (!element[prop]) return
    attributes[prop] = element[prop]
  })
}

/**
 * Gets non-dynamic node attributes to be applied.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getBaseAttributes = (element) => {
  let attributes = {}

  Array.prototype.forEach.call(element.attributes, (attribute) => {
    if (dynamicAttributes.indexOf(attribute.name) < 0) {
      attributes[attribute.name] = attribute.value
    }
  })

  return attributes
}

/**
 * Gets all virtual node attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getAttributes = (element) => {
  const attributes = getBaseAttributes(element)
  getDynamicAttributes(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from vNode to nextVNode
 * @param {VirtualNode} nextVNode
 * @param {VirtualNode} vNode
 */
const diffAttributes = (nextVNode, vNode) => {
  let removedAttributes = []
  let changedAttributes = {}
  const vNodeAttributeNames = Object.keys(vNode.attributes)
  const nextVNodeAttributeNames = Object.keys(nextVNode.attributes)

  // Get stale attributes
  forEach(vNodeAttributeNames, (attr) => {
    const oldValue = vNode.attributes[attr]
    const nextValue = nextVNode.attributes[attr]
    if (oldValue === nextValue) return

    if (typeof nextValue === "undefined") {
      removedAttributes.push(attr)
    }
  })

  // Get changed or new attributes
  forEach(nextVNodeAttributeNames, (attr) => {
    const oldValue = vNode.attributes[attr]
    const nextValue = nextVNode.attributes[attr]
    if (oldValue === nextValue) return

    if (typeof nextValue !== "undefined") {
      changedAttributes[attr] = nextValue
    }
  })

  // Add and remove attributes
  removeAttributes(vNode, removedAttributes)
  addAttributes(vNode, changedAttributes)
}

/**
 * Removes extra nodes from a root that previously had more than one virtual node.
 */
const childListToVNode = (template, vNode) => {
  if (template.key) {
    let nodeIdx = -1
    forEach(vNode.children, (child, idx) => {
      if (template.key === child.key) {
        nodeIdx = idx
      } else {
        vNode.node.removeChild(child.node)
      }
    })

    // Diff the matching child, if we found it
    if (nodeIdx) {
      vNode.children = vNode.children[nodeIdx]
      return diffVNode(template, vNode.children, vNode.node)
    }
  }

  // In the case of no template.key or there was no key on the last node,
  // rebuild the tree using the template.

  vNode.forEach((child) => vNode.node.removeChild(child.node))
  vNode.node.appendChild(template.node)
  vNode.children = template.children
}

/**
 * Builds a list of sibling nodes from a root previously containing one node.
 */
const vNodeToChildList = (template, vNode) => {
  // If vNode has a key, search template.children for
  // a match and store its position
  const templateChildrenLength = template.children.length
  const nextChildren = Array(templateChildrenLength)
  let matchIdx = -1

  forEach(template.children, (child, idx) => {
    if (vNode.children.key && child.key === vNode.children.key) {
      nextChildren[idx] = vNode.children
      matchIdx = idx
    } else {
      nextChildren[idx] = child
    }
  })

  // Use a fragment to insert the nodes to prevent unnecessary reflows.
  const fragment = document.createDocumentFragment()
  nextChildren.forEach((vChild) => fragment.appendChild(vChild.node))

  // Remove existing node
  vNode.node.removeChild(vNode.node)

  // Append the updated children
  vNode.node.appendChild(fragment)
  vNode.children = nextChildren

  // Diff the matching child, if we found one
  if (matchIdx > -1) {
    diffVNode(template.children[matchIdx], vNode.children[matchIdx], vNode.node)
  }
}

/**
 * Both template and vNode have arrays of virtual nodes. Diff them.
 */
const diffChildList = (template, vNode) => {
  const keyNodeMap = {}

  // Collect nodes with keys
  forEach(vNode.children, (child) => {
    if (!Object.prototype.hasOwnProperty.call(child, "key")) return

    if (Object.prototype.hasOwnProperty.call(keyNodeMap, child.key)) {
      // eslint-disable-next-line no-console
      console.warn(
        "[omDomDom]: Children with duplicate keys detected. Children with duplicate keys will be skipped, resulting in dropped node references. Keys must be unique and non-indexed."
      )
    } else if (Object.prototype.hasOwnProperty.call(child, "key")) {
      keyNodeMap[child.key] = child
    }
  })

  const nextChildrenLength = template.children.length
  const nextChildren = Array(nextChildrenLength)
  const preservedChildren = []

  // Iterate through template children, and if a child
  // has a node with a key, see if we previously collected it
  // and add it to the next list of children
  forEach(template.children, (child, idx) => {
    const preservedChild = keyNodeMap[child.key]
    if (preservedChild) {
      nextChildren[idx] = preservedChild
      preservedChildren.push([child, preservedChild])
    } else {
      nextChildren[idx] = child
    }
  })

  // Use a fragment to insert the nodes to prevent unnecessary reflows.
  const fragment = document.createDocumentFragment()
  nextChildren.forEach((child) => fragment.appendChild(child.node))

  // Remove existing nodes
  vNode.children.forEach((child) => vNode.node.removeChild(child))

  // Append the updated children
  vNode.node.appendChild(fragment)
  vNode.children = nextChildren

  // Update the matching children, if we found any
  if (preservedChildren.length) {
    forEach(preservedChildren, ([templateChild, preservedChild]) =>
      diffVNode(templateChild, preservedChild, vNode.node)
    )
  }
}

/**
 * One or both of template.children and vNode.children are an array of nodes.
 * Checklist:
 * 1. If template.children is null, all children are removed
 * 2. If vNode.children is null, all new children were added
 * 3. If both template.children and vNode.children are arrays, teardown and rebuild,
 *    but keep nodes with keys
 * 4. If template.children is an array but vNode.children is null, build up to an
 *    array, and keep vNode.node if a key is present.
 * 5. If vNode.children is an array but template.children is null, teardown the array,
 *    and keep the node if there was a matching key was in vNode's children.
 */
const diffChildren = (
  template,
  vNode,
  templateChildrenIsList,
  vNodeChildrenIsList
) => {
  // If template no longer has children, remove all nodes.
  // Else, if vNode has no children
  if (!template.children) {
    vNode.children.forEach((child) => vNode.node.removeChild(child.node))
    return (vNode.children = null)
  } else if (!vNode.children) {
    template.children.forEach((child) => vNode.node.appendChild(child.node))
    return (vNode.children = template.children)
  }

  // Things are getting complicated:
  // - If both children are lists of nodes, diff them, preserving nodes if they have keys defined.
  // - If template children is now a list, but vNode children had a single node, build it up
  // - If template children is now a single node, but vNode children were a list, break down the list
  //   and preserve the single node if a key was attached.
  if (templateChildrenIsList && vNodeChildrenIsList) {
    diffChildList(template, vNode)
  } else if (templateChildrenIsList && !vNodeChildrenIsList) {
    vNodeToChildList(template, vNode)
  } else if (!templateChildrenIsList && vNodeChildrenIsList) {
    childListToVNode(template, vNode)
  }
}

/**
 * Export utilities
 */

/**
 * Reconcile differences between a virtual DOM tree, starting from least complex to most complex.
 * @param {VirtualNode[]|VirtualNode} templateTree - new tree or array of trees
 * @param {VirtualNode[]|VirtualNode} nodeTree - old tree or array of trees
 * @param {HTMLElement} rootNode - the HTML element containing the current virtual node context
 */
export const diffVNode = (template, vNode, rootNode) => {
  // Node nodes to compare, exit
  if (!template && !vNode) return

  /**
   * Diff virtual node data
   */

  // Element was removed
  if (!template) {
    return rootNode.removeChild(vNode.node)
  }

  // Element was added
  if (!vNode) {
    return rootNode.appendChild(template.node)
  }

  // If the type changed, replace the node completely
  if (template.type !== vNode.type) {
    rootNode.replaceChild(template.node, vNode.node)
    return (vNode.node = template.node)
  }

  // If content changed, update it
  if (template.content !== vNode.content) {
    rootNode.textContent = template.content
    return (vNode.content = template.content)
  }

  // Update attributes, if any
  diffAttributes(template, vNode)

  const templateChildrenIsList = isArray(template.children)
  const vNodeChildrenIsList = isArray(vNode.children)

  // Diff child nodes recursively
  if (!templateChildrenIsList && !vNodeChildrenIsList) {
    return diffVNode(template.children, vNode.children, vNode.node)
  }

  // If any children are arrays of nodes, we need to do a deeper compare
  if (templateChildrenIsList || vNodeChildrenIsList) {
    return diffChildren(
      template,
      vNode,
      templateChildrenIsList,
      vNodeChildrenIsList
    )
  }
}

/**
 * Renders a vDOM into the given root context. This happens one time,
 * when a component is first rendered.
 * All subsequent renders are the result of reconciliation.
 * @param {VirtualNode[]} vDOM
 * @param {ShadowRoot} context
 */
export const renderToDOM = (vNode, root) => {
  root.appendChild(vNode.node)
}

/**
 * Convert stringified HTML into valid HTML, stripping all extra spaces.
 * @param {string} stringToRender
 */
export const stringToHTML = (stringToRender) => {
  /**
   * Remove all extraneous whitespace:
   * - From the beginning + end of the document fragment
   * - If there's more than one space before a left tag bracket, replace them with one
   * - If there's more than one space before a right tag bracket, replace them with one
   */
  const processedDOMString = stringToRender
    .trim()
    .replace(/\s+</g, "<")
    .replace(/>\s+/g, ">")

  const parser = new DOMParser()
  const context = parser.parseFromString(processedDOMString, "text/html")

  return context.body
}

/**
 * 1. Detect if children is flat
 *    - If childNodes.length > 1, use an array
 *    - If childNodes.length === 1, use object to directly access node
 * 2. Set attributes as key: value instead of array of {name, type}.
 */

/**
 * Creates a new virtual DOM from a root node.
 * @param {HTMLElement|ShadowRoot|HTMLBodyElement} element
 * @param {boolean} isSVGContext
 * @returns {VirtualNode[]}
 */
export const createVNode = (node, isSVGContext = false) => {
  const isRoot = node.tagName === "BODY"
  const childNodes = node.childNodes
  const numChildNodes = childNodes ? childNodes.length : 0

  if (isRoot) {
    if (numChildNodes > 1) {
      throw new Error(
        "[omDomDom]: Your element should not have more than one shadow root view node."
      )
    } else if (numChildNodes === 0) {
      throw new Error(
        "[omDomDom]: Your element should have at least one shadow root node."
      )
    } else {
      return createVNode(childNodes[0])
    }
  }

  // Get basic node data.
  const type =
    node.nodeType === 3
      ? "text"
      : node.nodeType === 8
      ? "comment"
      : node.tagName.toLowerCase()
  const isSVG = isSVGContext || type === "svg"
  const attributes = node.nodeType === 1 ? getAttributes(node) : {}
  const content = numChildNodes > 0 ? null : node.textContent
  let key

  // Retrieve key from attributes if they were created, then delete
  // it from attributes to prevent reflection into the real DOM.
  if (attributes.key) {
    key = attributes.key
    delete attributes.key
  }

  // Recursively build children, if any.
  let children = null
  if (numChildNodes > 1) {
    children = Array(numChildNodes)
    for (let idx = 0; idx < numChildNodes; idx++) {
      children[idx] = createVNode(childNodes[idx], isSVG)
    }
  } else if (numChildNodes === 1) {
    children = createVNode(childNodes[0])
  }

  return { type, attributes, key, children, content, isSVGContext: isSVG }
}
