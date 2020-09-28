import { render, create } from "../"

describe("render", () => {
  it("renders the root vdom node into a target element", () => {
    // Given
    const vdom = create(`<div>test</div>`)
    // When
    render(vdom, document.body)
    // Then
    expect(document.body.firstElementChild).toEqual(vdom.node)
  })
})
