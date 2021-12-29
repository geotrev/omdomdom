import {
  hasProperty,
  forEach,
  createKeyMap,
  insertBefore,
  assignVNode,
} from "../utilities"

describe("utilities", () => {
  describe("hasProperty", () => {
    it("returns true if property exists", () => {
      const obj = { foo: "bar" }
      expect(hasProperty(obj, "foo")).toBe(true)
    })

    it("returns false if property doesn't exist", () => {
      const obj = { baz: "bar" }
      expect(hasProperty(obj, "foo")).toBe(false)
    })
  })

  describe("forEach", () => {
    it("iterates over an array", () => {
      // Given
      let items = [1, 2, 3]
      let originals = []
      // When
      forEach(items, (item, idx) => {
        originals[idx] = item
        return (items[idx] = items[idx] * 2)
      })
      // Then
      expect(originals).toEqual([1, 2, 3])
      expect(items).toEqual([2, 4, 6])
    })

    it("breaks the loop if an iteration returns false", () => {
      // Given
      const items = [1, 2, 3, 4]
      let endItem = 2
      let unreachableItem = 4
      let maxIdx = items.length - 1
      let earlyReturnIdx
      // When
      forEach(items, (item, idx) => {
        // This should never be reached.
        if (item === unreachableItem) {
          earlyReturnIdx = idx
        }

        // This should end the loop.
        if (item === endItem) {
          earlyReturnIdx = idx
          return false
        }
      })
      // Then
      expect(earlyReturnIdx).toEqual(items.indexOf(endItem))
      expect(earlyReturnIdx).toBeLessThan(maxIdx)
    })
  })

  describe("createKeyMap", () => {
    const withKeys = [
      { attributes: { "data-key": "one" } },
      { attributes: { "data-key": "two" } },
      { attributes: { "data-key": "three" } },
      { attributes: {} },
      { attributes: { "data-key": "five" } },
    ]

    const withNoKeys = [
      { attributes: {} },
      { attributes: {} },
      { attributes: {} },
    ]

    it("returns null if no keys were detected", () => {
      expect(createKeyMap(withNoKeys)).toBeUndefined()
    })

    it("returns the map object if keys were detected", () => {
      // Given
      const map = createKeyMap(withKeys)
      const keys = Object.keys(map)
      const values = Object.values(map)
      // Then
      expect(keys).toHaveLength(4)
      expect(values).toHaveLength(4)
    })

    it("creates an object whose property/value is obj.attributes['data-key'] and the object", () => {
      // Given
      const map = createKeyMap(withKeys)
      const keys = Object.keys(map)
      const values = Object.values(map)
      // Then
      for (let key in map) {
        expect(keys).toContain(key)
        expect(values).toContain(map[key])
      }
    })

    /* eslint-disable no-console */
    console.warn = jest.fn()

    it("prints warning if a duplicate key is encountered", () => {
      // Given
      const dupe = [
        ...withKeys,
        {
          attributes: { "data-key": "two" },
        },
      ]
      // When
      createKeyMap(dupe)
      // Then
      expect(console.warn).toBeCalledWith(
        "[OmDomDom]: Children with duplicate keys detected. Children with duplicate keys will be skipped, resulting in dropped node references. Keys must be unique and non-indexed."
      )
    })

    it("doesn't assign to the map if duplicate keys are encountered", () => {
      // Given
      const dupe = [
        ...withKeys,
        {
          foo: true,
          attributes: { "data-key": "two" },
        },
      ]
      const map = createKeyMap(dupe)
      // Then
      expect(map.two.foo).toBeUndefined()
    })

    console.warn.mockClear()
    /* eslint-enable no-console */
  })

  describe("insertBefore", () => {
    it("inserts child vnode.node at a specified index of parent vnode.node", () => {
      // Given
      document.body.innerHTML = "<div><p></p><h3></h3></div>"
      const parent = { node: document.body.querySelector(":scope > div") }
      const child = { node: document.createElement("span") }
      const ref = document.querySelector("h3")
      // When
      insertBefore(parent, child, ref)
      // Then
      expect(document.body.innerHTML).toEqual(
        "<div><p></p><span></span><h3></h3></div>"
      )
    })
  })

  describe("assignVNode", () => {
    it("assigns all the entries of an object to a new object", () => {
      // Given
      const memo = { foo: "bar", baz: "qux" }
      const template = { foo: "qux", baz: "foo" }
      // When
      assignVNode(template, memo)
      // Then
      expect(memo).toEqual(template)
    })
  })
})
