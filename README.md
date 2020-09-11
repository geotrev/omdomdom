# OmDomDom

OmDomDom eats your stringy HTML and outputs real HTML.

**Features:**

- Write HTML as a string. Get HTML.
- Dynamically update your existing OmDomDom-rendered HTML.
- Satisfies the hunger.

## Install

Use either npm or from CDN.

**NPM**

```sh
$ npm i omdomdom
```

**CDN**

```html
<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.0.1/dist/omdomdom.js"
  integrity="sha256-G/tIiIcqSiKFeq2X7DlA6laZGBuVCdig96KCAOIT6ks="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.0.1/dist/omdomdom.min.js"
  integrity="sha256-waCWKicYMCJic4tBKdkV54qhuGsq8J9JWQY+QmFVjj8="
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
      <li key="budget">No budget</li>
      <li key="angular">Using angular</li>
      <li key="nap">Napping during work</li>
    </ul>
  </div>
`
const toHTML = omDomDom.createHTML(view)
const node = omDomDom.createNode(toHTML)
const root = document.getElementById("om-root")
omDomDom.render(node, root)
```

Then update your HTML:

```js
const nextView = `
  <div>
    <p style="color: steelblue">Things I like doing:</p>
    <ul>
      <li key="pizza">Eating pizza</li>
      <li key="kirby">Hanging with Kirby</li>
      <li key="guitar">Playing guitar</li>
      <li key="gameboy">Fixing Game Boys</li>
    </ul>
    <p style="font-weight: bold">Now that's more like it!</p>
  </div>
`
const nextHTML = omDomDom.createHTML(nextView)
const nextNode = omDomDom.createNode(nextHTML)
omDomDom.diff(nextNode, node, root)
```

### Caveats

The main caveat to keep in mind is that you must render from a single HTML root node, similar to React.

## Support

OmDomDom works in all modern browsers and IE11.
