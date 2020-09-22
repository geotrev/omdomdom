# 👾 OmDomDom

OmDomDom is a small virtual DOM implementation. Use it to:

- Create virtual nodes
- Render those nodes to a page
- Reconcile changes between virtual nodes and patch the DOM

The bundle is very small at 2.4kb minified + gzipped. One reason for this small bundle size is that the framework does very little work beyond taking your DOM string, rendering it, and/or resolving differences between two virtual node trees.

Pull requests and issues welcome!

## Install

Use either npm or CDN.

**NPM**

```sh
$ npm i omdomdom
```

Import its helpers:

```js
// named exports

import { render, update, create } from "omdomdom"
create(...)
render(...)
update(...)

// or as a namespace

import * as omDom from "omdomdom"
omDom.create(...)
omDom.render(...)
omDom.update(...)
```

**CDN**

```html
<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.10/dist/omdomdom.js"
  integrity="sha256-Nw8oTDHEuRMTaMbq7ILBarBdY6TEpq1tchf+2vpthjk="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.10/dist/omdomdom.min.js"
  integrity="sha256-3yCmalg41wr4YBRGpN5neDOxqGH6KC+7ewrgIWpVmZw="
  crossorigin="anonymous"
></script>
```

The CDN will make `omDomDom` a property on `window`.

## API

You can do two main things with OmDomDom: Render HTML to a page and patch it with updates.

### create()

To get started, pass your view to `create`.

```js
const view = "<p style='color: pink'>I like hanging out.</p>"

// Create virtual node
const omNode = create(view)
```

`create` will check if your value is a string, then convert it to HTML using [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser). The advantage of this route is `DOMParser` provides some decent error output if your HTML is incorrect.

You can optionally create the HTML yourself and provide that, if you prefer:

```js
const wrapper = document.createElement("div")
wrapper.innerHTML = view.trim()

const omNode = create(wrapper)
```

Either way, you will receive a virtual node tree structured like this:

```js
{
  // The tag name of the element.
  // If the node is text, "text" is used.
  // If the node is a comment, "comment" is used
  type: String,

  // An object whose key/value pairs are the attribute
  // name and value, respectively.
  attributes: Object,

  // Is set to `true` if a node is an `svg`, which lets omDomDom
  // do special rendering operations for svg children.
  isSVGContext: Boolean,

  // The content of a "text" or "comment" node.
  content: String,

  // An array of virtual node children.
  children: Array,

  // The real DOM element.
  node: Node
}
```

_TIP: Use `data-key` to memoize elements in the DOM! This is similar to frameworks like React which use a `key` prop._

### render()

Use `render` to insert your node somewhere on the page.

```js
render(omNode, document.getElementById("root"))
```

### update()

`update` requires you to have your initial virtual node tree, as that's the tree containing the document-appended nodes. Pass a new virtual node tree to compare and patch the original tree, and subsequently update the DOM.

```js
const nextView = "<p style='color: red'>I don't like hanging out.</p>"
update(create(nextView), omNode)
```

Do note that any virtual nodes created as the first argument to `update` are discarded. Again, the only virtual node tree you need to care about is the first one.

## Reconciliation

Reconciliation works similar to React and others, by comparing an older (live) virtual DOM tree to a new (template) one. The old tree is patched with changes from the template.

### Events

Since the end result is real HTML, you should be able to use events like anywhere else. Although if you do so, and your interactive elements are in a sibling context, make sure they use a `data-key` identifier.

### Keys

In just about every way, keys behave in OmDomDom similar to the likes of other virtual DOM implementations. The only difference is that you should use the `data-key` attribute with OmDomDom.

### Performance

If you think it can be improved, please contribute. :)

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills/dependencies.
