/* eslint-disable jest/expect-expect */

import { create, render, patch } from "../"

describe("patch", () => {
  beforeEach(() => (document.body.innerHTML = ""))

  describe("null params", () => {
    it("does not patch if template isn't given", () => {
      // Given
      const vdom = create("<div></div>")
      // When
      patch(null, vdom)
      // Then
      expect(vdom.type).toEqual("div")
    })

    it("does not patch if virtual node isn't given", () => {
      // Given
      const vdom = null
      // When
      patch(create("<div></div>"), vdom)
      // Then
      expect(vdom).toBeNull()
    })
  })

  describe("assignVNode", () => {
    it("patches vnode `type` if it changed", () => {
      // Given
      const vdom = create("<div></div>")
      // When
      patch(create("<span></span>"), vdom)
      // Then
      expect(vdom.type).toEqual("span")
    })

    it("replaces DOM node if `type` changed", () => {
      // Given
      const vdom = create("<div></div>")
      const template = create("<span></span>")
      // When
      patch(template, vdom)
      // Then
      expect(vdom.node).toEqual(template.node)
    })

    it("patches vnode `content` if it changed", () => {
      // Given
      const vdom = create("<div>old</div>")
      // When
      patch(create("<div>new</div>"), vdom)
      // Then
      expect(vdom.children[0].content).toEqual("new")
    })

    it("replaces DOM node if `content` changed", () => {
      // Given
      const vdom = create("<div>old</div>")
      const template = create("<span>new</span>")
      // When
      patch(template, vdom)
      // Then
      expect(vdom.children[0].node).toEqual(template.children[0].node)
    })
  })

  describe("attributes", () => {
    it("updates attributes if value changed", () => {
      // Given
      const vdom = create('<div data-foo="foo bar"></div>')
      // When
      patch(create('<div data-foo="foo bar baz"></div>'), vdom)
      // Then
      expect(vdom.attributes["data-foo"]).toEqual("foo bar baz")
      expect(vdom.node.getAttribute("data-foo")).toEqual("foo bar baz")
    })

    it("adds attributes if they don't already exist", () => {
      // Given
      const vdom = create("<div></div>")
      // When
      patch(create("<div data-foo></div>"), vdom)
      // Then
      expect(vdom.attributes).toHaveProperty("data-foo")
      expect(vdom.node.hasAttribute("data-foo")).toBe(true)
    })

    it("removes attributes if they no longer exist", () => {
      // Given
      const vdom = create("<div data-foo></div>")
      // When
      patch(create("<div></div>"), vdom)
      // Then
      expect(vdom.attributes).not.toHaveProperty("data-foo")
      expect(vdom.node.hasAttribute("data-foo")).toBe(false)
    })

    describe("DOM properties", () => {
      it("updates className", () => {
        // Given
        const vdom = create('<div class="foo"></div>')
        // When
        patch(create('<div class="bar"></div>'), vdom)
        // Then
        expect(vdom.attributes.class).toEqual("bar")
        expect(vdom.node.className).toEqual("bar")
        expect(vdom.node.getAttribute("class")).toEqual("bar")
      })

      it("updates style.cssText", () => {
        // Given
        const vdom = create('<div style="color: blue;"></div>')
        // When
        patch(create('<div style="color: red;"></div>'), vdom)
        // Then
        expect(vdom.attributes.style).toEqual("color: red;")
        expect(vdom.node.style.cssText).toEqual("color: red;")
        expect(vdom.node.getAttribute("style")).toEqual("color: red;")
      })

      it("updates tabIndex", () => {
        // Given
        const vdom = create('<div tabindex="-1"></div>')
        // When
        patch(create('<div tabindex="3"></div>'), vdom)
        // Then
        expect(vdom.attributes.tabindex).toEqual("3")
        expect(vdom.node.tabIndex).toEqual(3)
        expect(vdom.node.getAttribute("tabindex")).toEqual("3")
      })

      it("removes tabIndex attribute if unset", () => {
        // Given
        const vdom = create('<div tabindex="0"></div>')
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.tabindex).toBe(undefined)
        expect(vdom.node.tabIndex).toEqual(-1)
        expect(vdom.node.getAttribute("tabindex")).toEqual(null)
      })

      it("updates autofocus", () => {
        // Given
        const vdom = create(`<div autofocus></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.autofocus).toEqual(undefined)
        expect(vdom.node.autofocus).toEqual(false)
        expect(vdom.node.getAttribute("autofocus")).toEqual("")
      })

      it("updates draggable", () => {
        // Given
        const vdom = create(`<div draggable></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.draggable).toEqual(undefined)
        expect(vdom.node.draggable).toEqual(false)
        expect(vdom.node.getAttribute("draggable")).toEqual("false")
      })

      it("updates hidden", () => {
        // Given
        const vdom = create(`<div hidden></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.hidden).toEqual(undefined)
        expect(vdom.node.hidden).toEqual(false)
        expect(vdom.node.getAttribute("hidden")).toBeNull()
      })

      it("updates checked", () => {
        // Given
        const vdom = create(`<div checked></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.checked).toEqual(undefined)
        expect(vdom.node.checked).toEqual(false)
        expect(vdom.node.getAttribute("checked")).toEqual("")
      })

      it("updates multiple", () => {
        // Given
        const vdom = create(`<div multiple></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.multiple).toEqual(undefined)
        expect(vdom.node.multiple).toEqual(false)
        expect(vdom.node.getAttribute("multiple")).toEqual("")
      })

      it("updates muted", () => {
        // Given
        const vdom = create(`<div muted></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.muted).toEqual(undefined)
        expect(vdom.node.muted).toEqual(false)
        expect(vdom.node.getAttribute("muted")).toEqual("")
      })

      it("updates selected", () => {
        // Given
        const vdom = create(`<div selected></div>`)
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.selected).toEqual(undefined)
        expect(vdom.node.selected).toEqual(false)
        expect(vdom.node.getAttribute("selected")).toEqual("")
      })
    })
  })

  describe("children", () => {
    it("updates children", () => {
      // Given
      const vdom = create(`
        <div>
          <p class="item">foo</p>
          <p class="item">bar</p>
          <p class="item">baz</p>
        </div>
      `)
      const template = create(`
        <div>
          <p class="item1">quz</p>
          <p class="item2">foo</p>
          <p class="item3">bar</p>
        </div>
      `)
      // When
      patch(template, vdom)
      // Then
      for (const child of vdom.children) {
        expect(child.attributes.class).toEqual(child.node.className)
        expect(child.children[0].content).toEqual(child.node.textContent)
      }
    })

    it("adds new children", () => {
      // Given
      const vdom = create(`
        <div>
          <p class="item">foo</p>
          <p class="item">bar</p>
        </div>
      `)
      const preUpdateChildren = vdom.children
      const template = create(`
        <div>
          <p class="item">quz</p>
          <p class="item">foo</p>
          <p class="item">bar</p>
        </div>
      `)
      // When
      patch(template, vdom)
      // Then
      expect(vdom.children).toHaveLength(3)
      expect(vdom.node.childNodes).toHaveLength(3)
      preUpdateChildren.forEach((child, idx) => {
        expect(child.node).toEqual(vdom.children[idx].node)
      })
    })

    it("removes stale children", () => {
      // Given
      const vdom = create(`
        <div>
          <p class="item">foo</p>
          <p class="item">bar</p>
          <p class="item">bar</p>
        </div>
      `)
      const preUpdateChildren = vdom.children
      const template = create(`
        <div>
          <p class="item">quz</p>
          <p class="item">foo</p>
        </div>
      `)
      // When
      patch(template, vdom)
      // Then
      expect(vdom.children).toHaveLength(2)
      expect(vdom.node.childNodes).toHaveLength(2)
      vdom.children.forEach((child, idx) => {
        expect(child.node).toEqual(preUpdateChildren[idx].node)
      })
    })

    it("children are memoized if data-key attributes are defined", () => {
      // Given
      const vdom = create(`
        <div>
          <p data-key="abc">foo</p>
          <p data-key="def">bar</p>
          <p data-key="ghi">baz</p>
          <p data-key="jkl">qux</p>
        </div>
      `)
      render(vdom, document.body)
      const map = Array.apply(null, document.querySelectorAll("p")).reduce(
        (dict, node) => {
          return { ...dict, [node.getAttribute("data-key")]: node }
        },
        {}
      )
      const template = create(`
        <div>
          <p data-key="def" class="changed">bar</p>
          <p data-key="abc" class="changed">foo</p>
          <p data-key="jkl" class="changed">qux</p>
          <p data-key="ghi" class="changed">baz</p>
        </div>
      `)
      // When
      patch(template, vdom)
      // Then
      Array.apply(null, vdom.node.childNodes).forEach((child) => {
        const key = child.getAttribute("data-key")
        const preUpdateChildRef = map[key]
        expect(preUpdateChildRef).toEqual(child)
      })
    })

    it("children aren't memoized if data-key isn't defined", () => {
      // Given
      const vdom = create(`
        <div>
          <p data-key="abc">foo</p>
          <p data-key="def">bar</p>
          <p data-key="ghi">baz</p>
          <p>qux</p>
        </div>
      `)
      render(vdom, document.body)
      const oldNode = document.querySelector("div").childNodes[3]
      const template = create(`
        <div>
          <p data-key="def" class="changed">bar</p>
          <p class="changed">qux</p>
          <p data-key="abc" class="changed">foo</p>
          <p data-key="ghi" class="changed">baz</p>
        </div>
      `)
      // When
      patch(template, vdom)
      // Then
      const newNode = document.querySelector("div").childNodes[1]
      expect(newNode).not.toEqual(oldNode)
    })
  })
})
