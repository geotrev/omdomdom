# 👾 OmDomDom

OmDomDom renders DOM strings to HTML. It can also reconcile changes to those strings.

The bundle is very small at 2.4kb minified + gzipped.

Issues and PRs welcome.

## Install

Use either npm or from CDN.

**NPM**

```sh
$ npm i omdomdom
```

Import its helpers:

```js
import { render, diff, createNode } from "omdomdom"
```

**CDN**

```html
<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.6/dist/omdomdom.js"
  integrity="sha256-eEOZpNShBVFE1hEEDISk3T6TOJ0nHQmN9kMnPJamNjI="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.6/dist/omdomdom.min.js"
  integrity="sha256-g+loPjC8HxcQ90Pk1NDU14Dn3bj+Joy92G5xszxEa3Q="
  crossorigin="anonymous"
></script>
```

The CDN will make `omDomDom` a global variable on the page.

## Usage

You can do two main things with OmDomDom: Render HTML to a page and patch it with updates.

### createNode

To get started, pass your view to `createNode`.

```js
const view = `
  <div>
    <p style="color: pink">Things I like doing:</p>
    <ul>
      <li>No budget</li>
      <li>Using angular</li>
      <li>Napping during work</li>
    </ul>
    <p>Booooo.</p>
  </div>
`

// Create virtual node
const omNode = = createNode(view)
```

Keeping the virtual node reference is necessary only if you intend to do updates later using [`diff`](#diff). Otherwise, you can set the variable to `null` to free up your browser memory.

`createNode` will check if your value is a string, then convert it to HTML using [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser). The advantage of this route is DOMParser provides some decent error output in the case of incorrect HTML.

You can optionally create the HTML yourself and provide that, if you prefer:

```js
// The `body` tag is discarded in final input, don't worry.
const wrapper = document.createElement("body")
wrapper.innerHTML = view.trim()

const omNode = createNode(wrapper)
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

### Render

Use `render` to insert your node somewhere on the page.

```js
render(omNode, document.getElementById("root"))
```

### Diff

As mentioned in the `createNode` function details, using `diff` requires you to have your initial virtual node reference. Pass a new virtual node to compare and patch the DOM for the new changes to appear.

```js
const nextView = /* altered DOM string */
const nextNode = createNode(nextView)
diff(nextNode, omDomDomNode)
```

## Reconciliation

Reconciliation works similar to React and others, by comparing an older (live) virtual DOM tree to a new (template) one. The old tree is patched with changes from the template.

### Events

Since the end result is real HTML, you should be able to use events like anywhere else. Although if you do so, and your interactive elements are in a sibling context, make sure they use keys.

### Keys

In just about every way, keys behave in OmDomDom similar to the likes of other virtual DOM implementations.

### Performance

If you think it can be improved, please contribute. :)

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills/dependencies.
