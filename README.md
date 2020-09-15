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
    <p>Booooo.</p>
  </div>
`
window.omDomDomNode = createNode(createHTML(view))
const root = document.getElementById("om-root")
render(omDomDomNode, root)
```

Then update your HTML:

```js
const nextView = `
  <div>
    <p style="color: steelblue">Things I like doing:</p>
    <p>Playing Pokemon Red.</p>
    <p>Yay!</p>
  </div>
`
const nextNode = createNode(createHTML(nextView))
diff(nextNode, omDomDomNode)
```

## Gotchas

1. The root of your tree should be a single node, similar to in React.
2. When elements are in a sibling context (e.g., two or more elements side-by-side), add a `key` attribute to apply any HTML changes to the node in-place.

## Support

OmDomDom works in all modern browsers and IE11. It requires no polyfills or external dependencies.
