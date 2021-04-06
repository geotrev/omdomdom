# 👾 OmDomDom

![CircleCI status (master)](https://badgen.net/circleci/github/geotrev/omdomdom/master) ![minified + gzip size](https://badgen.net/bundlephobia/minzip/omdomdom) ![npm version](https://badgen.net/npm/v/omdomdom) ![dependencies](https://badgen.net/david/dep/geotrev/omdomdom) ![devDependencies](https://badgen.net/david/dev/geotrev/omdomdom)

OmDomDom is a small virtual DOM implementation. Use it to:

- Create virtual nodes from DOM strings
- Render those nodes to a page
- Reconcile changes between virtual nodes and patch the DOM

The library is intentionally very minimal. There isn't any special syntax for things like handlers, special attributes/properties, state management, or the like. Write your HTML and deliver data any way you want.

Pull requests and issues welcome!

## Install

Use either npm or CDN.

**NPM**

```sh
$ npm i omdomdom
```

Then import its functions.

```js
import { render, update, create } from "omdomdom"

create(...)
render(...)
update(...)
```

OmDomDom uses only named exports, but you can always namespace them using an import wildcard:

```js
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
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.12/dist/omdomdom.js"
  integrity="sha256-O2bP3b/AkY5BjR9qzR3LuNWDTJHExYc8Xa5Gpie/IqQ="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.12/dist/omdomdom.min.js"
  integrity="sha256-p+Wv3PIjUp0bWWgYMozbo9Dja73lSDjfCUZRq32Uvk4="
  crossorigin="anonymous"
></script>
```

The CDN will make `OmDomDom` a property on `window`.

## API

You can do three things with OmDomDom: Create a vdom instance, render its nodes to a page, and patch it with updates.

### create()

To get started, pass your view to `create`.

```js
const view = "<p style='color: pink'>This is the start of something great.</p>"
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
VirtualNode {
  // The tag name of the element.
  // If the element is a text node, "text" is used.
  // If the element is a comment node, "comment" is used.
  type: String,

  // An object whose key/value pairs are the attribute
  // name and value, respectively.
  attributes: Object.<name, value>,

  // Is set to `true` if a node is an `svg`, which lets OmDomDom
  // do special rendering operations for svg children.
  isSVGContext: Boolean,

  // The content of a "text" or "comment" node.
  content: String,

  // An array of virtual node children.
  children: Array<VirtualNode>,

  // The real DOM element.
  node: Node
}
```

_TIP: Use `data-key` on your elements to preserve them between renders. This is similar to libraries like React which use a `key` prop._

### render()

Use `render` to insert your node somewhere on the page.

```js
render(omNode, document.getElementById("root"))
```

### update()

`update` requires you to have your initial virtual node tree, as that's the tree containing the document-appended nodes. Pass a new virtual node tree to compare and patch the original tree, and subsequently update the DOM.

```js
const nextView = "<p style='color: red'>I'm new and fresh.</p>"
update(create(nextView), omNode)
```

Do note that any virtual nodes created as the first argument to `update` are discarded. Again, the only virtual node tree you need to care about is the first one.

## Reconciliation

Reconciliation works similar to React and others, by comparing an older (live) virtual DOM tree to a new (template) one. The live tree is then patched with changes from the template.

### Keys

In just about every way, keys behave in OmDomDom similar to the likes of other virtual DOM implementations. The only difference is that you should use the `data-key` attribute with OmDomDom.

### Events

Since the end result is real HTML, you should be able to use events like anywhere else. Although if you do so, and your interactive elements are in a sibling context, make sure they use a `data-key` attribute to ensure the nodes are kept between updates.

It's worth noting that you won't be able to use tagged templates with OmDomDom.

### Performance

If you think it can be improved, please contribute. :)

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills/dependencies.
