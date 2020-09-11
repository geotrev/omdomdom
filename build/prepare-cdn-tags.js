#!/usr/bin/env node

import fs from "fs"
import * as logger from "./logger.js"
import { getFileContent, writeFileContent, getJSON } from "./helpers.js"

logger.begin("Updating CDN Tags")

const metadata = getJSON("build/metadata.json")

// Separate peers from bundled dependencies

const bundled = []
const peers = metadata.reduce((detected, data) => {
  return data.peer
    ? { ...detected, [peers[data.name]]: data }
    : bundled.push(data)
}, {})

// Enums
const Files = {
  README: "README.md",
  DEMO_HTML: "demo/index.html",
}

const Patterns = {
  SCRIPT: /<script[\s\S]+?<\/script>/g,
  VERSION: /@\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?\//g,
  SRI: /sha256-([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}|[A-Za-z0-9+/]{2})=/g,
}

/**
 * Get and update scripts tags in each package:
 * - README.md
 * - demo/index.html
 */
bundled.forEach((pkg) => {
  logger.step(`\nUpdating package files for: ${pkg.name}`)

  Object.keys(Files).forEach((fileKey) => {
    const fileTarget = Files[fileKey]

    if (fs.existsSync(fileTarget) !== false) {
      logger.step(`--> Updating ${fileTarget}`)

      const fileContent = getFileContent(fileTarget)
      const fileScriptTags = fileContent
        .match(Patterns.SCRIPT)
        .filter((tag) => tag.includes("cdn.jsdelivr.net"))

      const nextScriptTags = fileScriptTags.map((tag) => {
        const isMin = tag.includes(".min.js")
        const oldHash = tag.match(Patterns.SRI)[0]
        const nextHash = isMin ? pkg.sri.bundleMin : pkg.sri.bundle
        const oldVersion = tag.match(Patterns.VERSION)[0]
        const possiblePeer = Object.keys(peers).filter((peerName) =>
          tag.includes(peerName)
        )
        const peerName = possiblePeer.length ? possiblePeer[0] : null

        // If known peers were encountered, update them

        if (peerName) {
          const peer = peers[peerName]
          return tag
            .replace(Patterns.SRI, isMin ? peer.sri.bundleMin : peer.sri.bundle)
            .replace(Patterns.VERSION, `@${peer.version}/`)
        }

        // Otherwise, update the element CDN

        let updaters = []

        if (![pkg.sri.bundleMin, pkg.sri.bundle].includes(oldHash)) {
          updaters.push((tagString) => tagString.replace(oldHash, nextHash))
        }

        if (pkg.version !== oldVersion) {
          updaters.push((tagString) =>
            tagString.replace(oldVersion, `@${pkg.version}/`)
          )
        }

        return updaters.reduce(
          (updatedTag, updater) => (updatedTag = updater(updatedTag)),
          tag
        )
      })

      let nextFileContent = fileContent
      fileScriptTags.forEach((oldTag, i) => {
        if (nextScriptTags[i] === oldTag) return
        nextFileContent = nextFileContent.replace(oldTag, nextScriptTags[i])
      })

      writeFileContent(fileTarget, nextFileContent)
    } else {
      logger.step(`--> File not found: ${fileTarget}. Skipping.`)
    }
  }) // end Object.keys
}) // end forEach

logger.finish()
