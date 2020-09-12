# 👾 OmDomDom

OmDomDom renders HTML from strings, and can reconcile changes to those strings, updating nodes in-place. 🎉

Issues and PRs welcome.

## Install

Use either npm or from CDN.

**NPM**

```sh
$ npm i omdomdom
```

Import its helpers:

```js
import { render, diff, createHTML, createNode } from "omdomdom"
```

**CDN**

```html
<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.2/dist/omdomdom.js"
  integrity="sha256-e32PjVascpR0aAOd7k6EI7Mef5k0I9oppa8vY3PjUSg="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.1.2/dist/omdomdom.min.js"
  integrity="sha256-xINaB3IOlhEwZbJPmoeAd7ccUFIk+Mz4Y9CkmPK5ELo="
  crossorigin="anonymous"
></script>
```

## Usage

You can do two main things with OmDomDom: Render HTML to a page, and update that HTML.

Render some HTML:

```js
const view = `
  <div>
    <p style="color: pink">Things I like doing:</p>
    <ul>
      <li>No budget</li>
      <li>Using angular</li>
      <li>Napping during work</li>
    </ul>
  </div>
`
window.omDomDomNode = createNode(createHTML(view))
window.omDomDomRoot = document.getElementById("om-root")
render(node, root)
```

Then update your HTML:

```js
const nextView = `
  <div>
    <p style="color: steelblue">Things I like doing:</p>
    <p>Playing a lot of Pokemon.</p>
    <p style="font-weight: bold">Now that's more like it!</p>
  </div>
`
const nextNode = createNode(createHTML(nextView))
diff(nextNode, omDomDomNode)
```

## Gotchas

1. If you expect the number of children to change within an element, you should add a unique `key` to those elements to ensure they are tracked between renders.
2. Always render to a single root element. Any more than 1, or 0 elements, will throw an error.

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills or external dependencies.
