<h2 align="center">👾 OmDomDom</h2>
<p align="center">Create, render, and patch virtual DOMs</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/omdomdom"><img src="https://img.shields.io/npm/v/omdomdom.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/omdomdom"><img src="https://img.shields.io/npm/l/omdomdom.svg?sanitize=true" alt="License"></a>
  <a href="https://www.npmjs.com/package/omdomdom"><img src="https://badgen.net/circleci/github/geotrev/omdomdom/main" alt="Circle CI status (main)" /></a>
  <a href="https://www.npmjs.com/package/omdomdom"><img src="https://badgen.net/bundlephobia/minzip/omdomdom" alt="bundle size" /></a>
  <a href="https://www.npmjs.com/package/omdomdom"><img src="https://badgen.net/david/dev/geotrev/omdomdom" alt="devDependencies" /></a>
</p>

OmDomDOm is intentionally very minimal. It doesn't utilize tagged template literals and therefore is binding-free.

Pull requests and issues welcome!

## Install

**NPM**

```sh
$ npm i omdomdom
```

Then import:

```js
import { render, patch, create } from "omdomdom"

create(...)
render(...)
patch(...)
```

**CDN**

```html
<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.2.1/dist/omdomdom.js"
  integrity="sha256-0NKRNWXlyGHJqE2rt9TL0ZfUKZOTpl9yDaV2IDrVOtU="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.2.1/dist/omdomdom.min.js"
  integrity="sha256-z2QunatqIwvTpeWq5IoXEI+thliEu0jLGUKIikVuv4I="
  crossorigin="anonymous"
></script>
```

The CDN will set `window.OmDomDom` on your page.

## Virtual Node Structure

If you're familiar with other virtual DOM implementations, then this will look familiar. :)

```js
VirtualNode {
  // One of three value types are used:
  // - The tag name of the element
  // - "text" if text node
  // - "comment" if comment node
  type: String,

  // An object whose key/value pairs are the attribute
  // name and value, respectively
  attributes: Object.<attribute: string, value: string>,

  // Is set to `true` if a node is an `svg`, which tells
  // OmDomDom to treat it, and its children, as such
  isSVGContext: Boolean,

  // The content of a "text" or "comment" node
  content: String,

  // An array of virtual node children
  children: Array<VirtualNode>,

  // The real DOM node
  node: Node
}
```

## API

### `create(string|node)`

The function takes one argument: an html string or a real DOM node. Either way, it will be converted into a virtual node.

#### Option 1: HTML String

```js
const html = "<p style='color: pink'>I'm pink!</p>"
const vNode = create(html)
```

If the value is indeed a string, then it will be passed to [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser).

#### Option 2: Node

This is a more performant option if you have high confidence in the structure of your HTML string.

```js
const html = "<p style='color: pink'>I'm pink!</p>"
const wrapper = document.createElement("div")
wrapper.innerHTML = html

const vNode = create(wrapper)
```

The main downside to this option is you lose the helpful error messaging DOMParser provides from option 1. But, again, if you have a simple element to render, then it

### `render(vNode, targetNode)`

Inserts your node somewhere on the page.

```js
render(vNode, document.getElementById("root"))
```

Under the hood, all `render` does is use `targetNode.appendChild(vNode.node)`.

### `patch(nextVNode, oldVnode)`

Updates your original (old) virtual node with changes from the next one.

```js
const nextHtml = "<p style='color: red'>I'm new and fresh.</p>"
patch(create(nextHtml), vNode)
```

Do note that any virtual nodes created as the first argument to `patch` are discarded. Again, the only virtual node tree you need to care about is the old one.

## Reconciliation

Reconciliation works similar to React and others, by comparing an older (live) virtual DOM tree to a new (template) one. The live tree is then patched with changes from the template.

### Keys

If you have elements in dynamically generated lists or where there's many siblings, use the `data-key` attribute to memoize the node between patches.

```html
<button data-key="123">Click me</button>
```

The value for the attribute only needs to be unique among its sibling nodes.

### Performance

If you think it can be improved, please contribute. :)

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills/dependencies.
