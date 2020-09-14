import { render, diff, createHTML, createNode } from "../src"

// eslint-disable-next-line no-console
const logNode = (node) => console.log("Node:", node)

/**
 * Render
 */
{
  const view = `
    <div>
      <p>Testing some simple content.</p>
      <ul>
        <!-- Just a wee ol' comment -->
        <li style="font-weight: bold">item 1</li>
        <li class="hangin-out">item 2</li>
        <li data-chillin="out">item 3</li>
      </ul>
    </div>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-1"))
}

/**
 * SVG
 */

{
  const view =
    '<svg id="Layer_1" enable-background="new 0 0 512 512" height="200" viewBox="0 0 512 512" width="200" xmlns="http://www.w3.org/2000/svg"><g><path d="m156 10h80v40h-80z" fill="#ff9eb1"/><path d="m336 502h-280c-11.046 0-20-8.954-20-20v-412c0-11.046 8.954-20 20-20h280c11.046 0 20 8.954 20 20v412c0 11.046-8.954 20-20 20z" fill="#c5d3de"/><path d="m116 150h40v40h-40z" fill="#e7e9ef"/><path d="m76 90v372h170l70-70v-302z" fill="#fff"/><path d="m246 392v70l70-70z" fill="#a7bdcd"/><path d="m116 150h40v40h-40z" fill="#c5d3de"/><path d="m136 50h120v60h-120z" fill="#ffbecb"/><path d="m116 230h40v40h-40z" fill="#c5d3de"/><path d="m116 310h40v40h-40z" fill="#c5d3de"/><g><g><path d="m276 160h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g><g><path d="m256 200h-60c-5.523 0-10-4.477-10-10s4.477-10 10-10h60c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g><g><path d="m276 240h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g><g><path d="m256 280h-60c-5.523 0-10-4.477-10-10s4.477-10 10-10h60c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g><g><path d="m276 320h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g><g><path d="m256 360h-60c-5.523 0-10-4.477-10-10s4.477-10 10-10h60c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e7e9ef"/></g></g><path d="m406 126v240l20 40 20-40v-240z" fill="#c5d3de"/><path d="m406 126h40v80h-40z" fill="#a7bdcd"/><g fill="#8aa8bd"><path d="m336 40h-90v-30c0-5.523-4.477-10-10-10h-80c-5.523 0-10 4.477-10 10v30h-90c-16.542 0-30 13.458-30 30v412c0 16.542 13.458 30 30 30h280c16.542 0 30-13.458 30-30v-412c0-16.542-13.458-30-30-30zm-30 342h-60c-5.523 0-10 4.477-10 10v60h-150v-352h40v10c0 5.523 4.477 10 10 10h120c5.523 0 10-4.477 10-10v-10h40zm-14.142 20-35.858 35.858v-35.858zm-45.858-302h-100v-40h100zm-80-80h60v20h-60zm180 462c0 5.514-4.486 10-10 10h-280c-5.514 0-10-4.486-10-10v-412c0-5.514 4.486-10 10-10h70v20h-50c-5.523 0-10 4.477-10 10v372c0 5.523 4.477 10 10 10h170c.335 0 .668-.017.998-.05.248-.025.49-.067.733-.109.079-.014.159-.021.237-.036.288-.058.569-.131.848-.213.032-.01.066-.015.098-.025.285-.087.562-.189.835-.299.027-.011.056-.019.083-.031.26-.108.512-.231.761-.36.041-.021.084-.038.125-.06.226-.121.443-.256.658-.393.061-.039.125-.072.185-.112.195-.131.379-.274.564-.417.074-.057.152-.108.224-.167.215-.177.419-.366.618-.56.034-.033.071-.062.105-.095l70-70c.034-.033.062-.071.095-.105.194-.199.383-.404.56-.618.06-.073.111-.151.169-.226.143-.184.286-.368.416-.561.041-.062.076-.128.116-.19.136-.213.27-.428.39-.653.022-.041.039-.084.06-.125.129-.249.251-.5.359-.761.011-.027.019-.056.031-.083.111-.273.213-.551.299-.835.01-.033.016-.067.026-.099.081-.278.155-.559.213-.846.017-.083.024-.168.038-.251.041-.238.083-.476.107-.719.033-.33.05-.663.05-.998v-302.003c0-5.523-4.477-10-10-10h-50v-20h70c5.514 0 10 4.486 10 10v412z"/><path d="m476 116h-40v-10c0-5.523-4.477-10-10-10s-10 4.477-10 10v10h-10c-5.523 0-10 4.477-10 10v240c0 1.552.361 3.083 1.056 4.472l20 40c1.694 3.388 5.156 5.528 8.944 5.528s7.25-2.14 8.944-5.528l20-40c.694-1.389 1.056-2.92 1.056-4.472v-230h10v70c0 5.523 4.477 10 10 10s10-4.477 10-10v-80c0-5.523-4.477-10-10-10zm-40 20v60h-20v-60zm-10 247.639-10-20v-147.639h20v147.639z"/></g></g></svg>'

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-2"))
}
/**
 * Diff: attributes, styles
 */

{
  const view = `
    <p data-chillin="out" class="hangin-out">
      <button style="font-weight: bold" id="test3">Click to update</button>
    </p>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-3"))

  let activeView = view
  document.querySelector("#test3").onclick = () => {
    const nextView = `
      <p data-chillin="in" style="background: blue">
        <button id="test3">Click to update</button>
      </p>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: dynamic attributes: value, selected, checked
 */

{
  const view = `
    <div style="padding: 8px; background: red; color: white" id="test4">
      <select name="cars" id="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes" selected>Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <br />
      <input type="text" id="text" placeholder="One good pls" />
      <br />
      <input type="checkbox" id="check" /> Check me out
    </div>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-4"))
}

/**
 * Diff: single node to no node
 */

{
  const view = `
    <div style="padding: 8px; background: red" id="test5">
      <button>Click to change</button>
    </div>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-5"))

  let activeView = view
  document.querySelector("#test5").onclick = () => {
    const nextView = `
      <div id="test5" style="padding: 8px; background: red"></div>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: no node to single node
 */

{
  const view = `<p style="padding: 8px; background: red" id="test6"></p>`

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-6"))

  let activeView = view
  document.querySelector("#test6").onclick = () => {
    const nextView = `
      <p style="padding: 8px; background: red" id="test6">
        <span style="color: white">henlo</span>
      </p>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: node type
 */

//  NOTE: This will break the event listener

{
  const view = `
    <p style="padding: 8px; background: red" id="test7">
      <button>Click to change</button>
    </p>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-7"))

  let activeView = view
  document.querySelector("#test7").onclick = () => {
    const nextView = `
      <p style="padding: 8px; background: red" id="test7">
        <span style="background: white; color: black">Click to change</span>
      </p>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: No nodes to list of nodes
 */

{
  const view = `<ul style="padding: 8px; background: red; color: white" id="test8"></ul>`

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-8"))

  let activeView = view
  document.querySelector("#test8").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test8">
        <li>New item!</li>
        <li>New item!</li>
        <li>New item!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes to no nodes
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test9">
      <li>New item!</li>
      <li>New item!</li>
      <li>New item!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-9"))

  let activeView = view
  document.querySelector("#test9").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test9"></ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes to one node
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test10">
      <li>New item!</li>
      <li>New item!</li>
      <li>New item!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-10"))

  let activeView = view
  document.querySelector("#test10").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test10">
        <li>New item!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: One node to list of nodes
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test11">
      <li>New item!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-11"))

  let activeView = view
  document.querySelector("#test11").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test11">
        <li>New item!</li>
        <li>New item two!</li>
        <li>New item!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test12">
      <li>Pikachu</li>
      <li>Eevee</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-12"))

  let activeView = view
  document.querySelector("#test12").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test12">
        <li>Totodile!</li>
        <li>Chikorita!</li>
        <li>Cyndaquil!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes to one node with key
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test13">
      <li>Totodile!</li>
      <li key="chik">Chikorita!</li>
      <li>Cyndaquil!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-13"))

  let activeView = view
  document.querySelector("#test13").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test13">
        <li key="chik">Chikorita!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: One node with key to list of nodes
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test14">
      <li key="chik">Chikorita!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-14"))

  let activeView = view
  document.querySelector("#test14").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test14">
        <li>Totodile!</li>
        <li key="chik">Chikorita!</li>
        <li>Cyndaquil!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes with one key
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test15">
      <li>Cyndaquil!</li>
      <li>Chikorita!</li>
      <li key="toto">Totodile!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-15"))

  let activeView = view
  document.querySelector("#test15").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test15">
        <li>Blaziken!</li>
        <li key="toto">Feraligatr!</li>
        <li>Swampert!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes with multiple keys
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test16">
      <li key="toto">Totodile!</li>
      <li key="chik">Chikorita!</li>
      <li>Salamence!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-16"))

  let activeView = view
  document.querySelector("#test16").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test16">
        <li key="chik">Chikorita!</li>
        <li key="cyndi">Cyndaquil!</li>
        <li key="toto">Totodile!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes with all keys
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test17">
      <li key="squ">Squirtle!</li>
      <li key="cha">Charmander!</li>
      <li key="bul">Bulbasaur!</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-17"))

  let activeView = view
  document.querySelector("#test17").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test17">
        <li key="bul">Bulbasaur!</li>
        <li key="squ">Squirtle!</li>
        <li key="cha">Charmander!</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}

/**
 * Diff: List of nodes with some keys
 */

{
  const view = `
    <ul style="padding: 8px; background: red; color: white" id="test18">
      <li key="bulb">Bulbasaur</li>
      <li key="squirt">Squirtle</li>
      <li key="char">Charmander</li>
      <li key="chi">Chikorita</li>
      <li key="tree">Treecko</li>
      <li key="mud">Mudkip</li>
      <li key="tor">Torchic</li>
    </ul>
  `

  const node = createNode(createHTML(view))
  render(node, document.getElementById("test-root-18"))

  let activeView = view
  document.querySelector("#test18").onclick = () => {
    const nextView = `
      <ul style="padding: 8px; background: red; color: white" id="test18">
        <li key="toto">Totodile</li>
        <li key="cyn">Cyndaquil</li>
        <li key="bulb">Bulbasaur</li>
        <li key="squirt">Squirtle</li>
        <li key="char">Charmander</li>
        <li key="tree">Treecko</li>
        <li key="mud">Mudkip</li>
        <li key="chi">Chikorita</li>
        <li key="tor">Torchic</li>
      </ul>
    `

    activeView = activeView === view ? nextView : view
    const nextNode = createNode(createHTML(activeView))
    diff(nextNode, node)
    logNode(node)
  }
}
