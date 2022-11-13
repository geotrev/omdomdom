/* eslint-disable jest/expect-expect */

import { create, render, patch, VNode } from ".."
import { VNodeKeyToChildMap } from "../types"

describe("patch", () => {
  afterEach(() => (document.body.innerHTML = ""))

  describe("null params", () => {
    it("does not patch if template isn't given", () => {
      // Given
      const vdom = create("<div></div>")
      // When
      patch(undefined, vdom)
      // Then
      expect(vdom.type).toEqual("div")
    })

    it("does not patch if virtual node isn't given", () => {
      // Given
      const vdom = undefined
      // When
      patch(create("<div></div>"), vdom)
      // Then
      expect(vdom).toBeUndefined()
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
      expect((vdom.node as HTMLElement).getAttribute("data-foo")).toEqual(
        "foo bar baz"
      )
    })

    it("adds attributes if they don't already exist", () => {
      // Given
      const vdom = create("<div></div>")
      // When
      patch(create("<div data-foo></div>"), vdom)
      // Then
      expect(vdom.attributes).toHaveProperty("data-foo")
      expect((vdom.node as HTMLElement).hasAttribute("data-foo")).toBe(true)
    })

    it("removes attributes if they no longer exist", () => {
      // Given
      const vdom = create("<div data-foo></div>")
      // When
      patch(create("<div></div>"), vdom)
      // Then
      expect(vdom.attributes).not.toHaveProperty("data-foo")
      expect((vdom.node as HTMLElement).hasAttribute("data-foo")).toBe(false)
    })

    describe("DOM properties", () => {
      it("updates className", () => {
        // Given
        const vdom = create('<div class="foo"></div>')
        // When
        patch(create('<div class="bar"></div>'), vdom)
        // Then
        expect(vdom.attributes.class).toEqual("bar")
        expect((vdom.node as HTMLElement).className).toEqual("bar")
        expect((vdom.node as HTMLElement).getAttribute("class")).toEqual("bar")
      })

      it("updates style.cssText", () => {
        // Given
        const vdom = create('<div style="color: blue;"></div>')
        // When
        patch(create('<div style="color: red;"></div>'), vdom)
        // Then
        expect(vdom.attributes.style).toEqual("color: red;")
        expect((vdom.node as HTMLElement).style.cssText).toEqual("color: red;")
        expect((vdom.node as HTMLElement).getAttribute("style")).toEqual(
          "color: red;"
        )
      })

      it("updates tabIndex", () => {
        // Given
        const vdom = create('<div tabindex="-1"></div>')
        // When
        patch(create('<div tabindex="3"></div>'), vdom)
        // Then
        expect(vdom.attributes.tabindex).toEqual("3")
        expect((vdom.node as HTMLElement).tabIndex).toEqual(3)
        expect((vdom.node as HTMLElement).getAttribute("tabindex")).toEqual("3")
      })

      it("removes tabIndex attribute if unset", () => {
        // Given
        const vdom = create('<div tabindex="0"></div>')
        // When
        patch(create("<div></div>"), vdom)
        // Then
        expect(vdom.attributes.tabindex).toBe(undefined)
        expect((vdom.node as HTMLElement).tabIndex).toEqual(-1)
        expect((vdom.node as HTMLElement).getAttribute("tabindex")).toEqual(
          null
        )
      })

      it("updates autofocus", () => {
        // Given
        const vdom = create(`<div></div>`)
        // When
        patch(create("<div autofocus></div>"), vdom)
        // Then
        expect(vdom.attributes.autofocus).toEqual("")
        expect((vdom.node as HTMLElement).autofocus).toEqual(true)
        expect((vdom.node as HTMLElement).getAttribute("autofocus")).toBeNull()
      })

      it("updates draggable", () => {
        // Given
        const vdom = create(`<div></div>`)
        // When
        patch(create("<div draggable></div>"), vdom)
        // Then
        expect(vdom.attributes.draggable).toEqual("")
        expect((vdom.node as HTMLElement).draggable).toEqual(true)
        expect((vdom.node as HTMLElement).getAttribute("draggable")).toEqual(
          "true"
        )
      })

      it("updates hidden", () => {
        // Given
        const vdom = create(`<div></div>`)
        // When
        patch(create("<div hidden></div>"), vdom)
        // Then
        expect(vdom.attributes.hidden).toEqual("")
        expect((vdom.node as HTMLElement).hidden).toEqual(true)
        expect((vdom.node as HTMLElement).getAttribute("hidden")).toEqual("")
      })

      it("updates checked", () => {
        // Given
        const vdom = create("<input />")
        // When
        patch(create(`<input type="radio" checked />`), vdom)
        // Then
        expect(vdom.attributes.checked).toEqual("")
        expect((vdom.node as HTMLInputElement).checked).toEqual(true)
        expect(
          (vdom.node as HTMLInputElement).getAttribute("checked")
        ).toBeNull()
      })

      it("updates multiple", () => {
        // Given
        const vdom = create(`<select></select>`)
        // When
        patch(create(`<select multiple=""></select>`), vdom)
        // Then
        expect(vdom.attributes.multiple).toEqual("")
        expect((vdom.node as HTMLSelectElement).multiple).toEqual(true)
        expect(
          (vdom.node as HTMLSelectElement).getAttribute("multiple")
        ).toEqual("")
      })

      it("updates muted", () => {
        // Given
        const vdom = create(`<video></video>`)
        // When
        patch(create("<video muted></video>"), vdom)
        // Then
        expect(vdom.attributes.muted).toEqual("")
        expect((vdom.node as HTMLVideoElement).muted).toEqual(true)
        expect((vdom.node as HTMLVideoElement).getAttribute("muted")).toBeNull()
      })

      it("updates selected", () => {
        // Given
        const vdom = create(`<option></option>`)
        // When
        patch(create("<option selected></option>"), vdom)
        // Then
        expect(vdom.attributes.selected).toEqual("")
        expect((vdom.node as HTMLOptionElement).selected).toEqual(true)
        expect(
          (vdom.node as HTMLOptionElement).getAttribute("selected")
        ).toBeNull()
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
        expect(child.attributes.class).toEqual(
          (child.node as HTMLParagraphElement).className
        )
        expect(child.children[0].content).toEqual(
          (child.node as HTMLParagraphElement).textContent
        )
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
      const pList: HTMLParagraphElement[] = vdom.children.map(
        (child) => child.node as HTMLParagraphElement
      )
      const map: Record<string, HTMLParagraphElement> = pList.reduce(
        (
          acc: Record<string, HTMLParagraphElement>,
          node: HTMLParagraphElement
        ): Record<string, HTMLParagraphElement> => {
          return { ...acc, [node.getAttribute("data-key") as string]: node }
        },
        {} as Record<string, HTMLParagraphElement>
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
      const childList: Array<HTMLElement | Text | Comment> = vdom.children.map(
        (child) => child.node
      )
      childList.forEach((child: HTMLElement | Text | Comment) => {
        const key: string = (child as HTMLElement).getAttribute(
          "data-key"
        ) as string
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
      const oldDiv: HTMLDivElement = document.querySelector(
        "div"
      ) as HTMLDivElement
      const oldNode = oldDiv.childNodes[3]
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
      const newDiv: HTMLDivElement = document.querySelector(
        "div"
      ) as HTMLDivElement
      const newNode = newDiv.childNodes[1]
      expect(newNode).not.toEqual(oldNode)
    })
  })
})
