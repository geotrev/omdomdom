import { create } from "../"

function testNodeShape(vnode, tag = "div") {
  expect(vnode).toHaveProperty("type", tag)
  expect(vnode).toHaveProperty("attributes", { style: "" })
  expect(vnode).toHaveProperty("children", [])
  expect(vnode).toHaveProperty("content", "")
  expect(vnode).toHaveProperty("isSVGContext", false)
  expect(vnode).toHaveProperty("node", vnode.node)
}

describe("create", () => {
  // eslint-disable-next-line jest/expect-expect
  it("creates vdom with correct object shape", () => {
    const vdom = create("<div></div>")
    testNodeShape(vdom)
  })

  it("sets attribute names and values", () => {
    // Given
    const atts = {
      "data-key": "foo",
      class: "bar baz",
      style: "color: blue; font-size: 16px;",
    }
    const vdom = create(
      `<div data-key='${atts["data-key"]}' class='${atts.class}' style='${atts.style}'></div>`
    )
    // Then
    expect(Object.keys(vdom.attributes)).toHaveLength(3)
    for (let att in vdom.attributes) {
      expect(vdom.attributes[att]).toEqual(atts[att])
    }
  })

  it("sets svg context if tag is 'svg'", () => {
    const vdom = create("<svg></svg>")
    expect(vdom.isSVGContext).toBe(true)
  })

  it("sets children if childNodes exist", () => {
    // Given
    const vdom = create(`
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
    `)
    // Then
    expect(vdom.children).toHaveLength(3)
    for (let child of vdom.children) {
      testNodeShape(child, "span")
    }
  })

  it("sets type to 'text' and content to textContent if the node is a text node", () => {
    // Given
    const vdom = create("<div>text content</div>")
    const child = vdom.children[0]
    // Then
    expect(child.type).toEqual("text")
    expect(child.content).toEqual("text content")
    expect(child.children).toEqual([])
  })

  it("sets content to null if childNodes exist", () => {
    // Given
    const vdom = create("<div>text content</div>")
    // Then
    expect(vdom.content).toEqual(null)
  })

  it("sets type to 'comment' if the node is a comment node", () => {
    // Given
    const vdom = create("<div><!-- comment here --></div>")
    // Then
    expect(vdom.children[0].type).toEqual("comment")
  })
})
