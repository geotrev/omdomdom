#!/usr/bin/env node

import fs from "fs"
import path from "path"
import Hashes from "jshashes"

const FILE_FORMAT = "utf-8"
const readmePath = path.resolve(process.cwd(), "README.md")
const readmeFile = fs.readFileSync(readmePath, FILE_FORMAT)

const getFileContent = (filePath) =>
  fs.readFileSync(path.resolve(process.cwd(), filePath), FILE_FORMAT)
const getSHA = (data) => new Hashes.SHA256().b64(data)

const nextBundleSHA = getSHA(getFileContent("dist/omdomdom.js"))
const nextBundleMinSHA = getSHA(getFileContent("dist/omdomdom.min.js"))
/**
 * Detect existing hashes.
 */

// https://stackoverflow.com/a/31245864
const b64Regexp = /sha256-([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}|[A-Za-z0-9+/]{2})=/g
const [currentBundleSHA, currentBundleMinSHA] = readmeFile.match(b64Regexp)

if (currentBundleSHA && currentBundleMinSHA) {
  // eslint-disable-next-line no-console
  console.log(`
#===============================#

-> Detected content hashes in README.md: 
    - Bundle: ${currentBundleSHA}
    - Bundle (minified): ${currentBundleMinSHA}

Attempting update...
`)
} else {
  // eslint-disable-next-line no-console
  console.error("Couldn't find hashes. Something went wrong. Exiting...")
  process.exit()
}

const formatSHA = (hash) => `sha256-${hash}`
const formattedBundleSHA = formatSHA(nextBundleSHA)
const formattedBundleMinSHA = formatSHA(nextBundleMinSHA)

/**
 * Don't write if the hashes are the same.
 */

if (
  currentBundleSHA === formattedBundleSHA &&
  currentBundleMinSHA === formattedBundleMinSHA
) {
  // eslint-disable-next-line no-console
  console.info("Integrity hasn't changed. Exiting...")
  process.exit()
}

/**
 * Apply the new hashes to readme contents, then write to file.
 */

let nextReadmeFile = readmeFile

if (currentBundleSHA !== formattedBundleSHA) {
  nextReadmeFile = nextReadmeFile.replace(currentBundleSHA, formattedBundleSHA)
}

if (currentBundleMinSHA !== formattedBundleMinSHA) {
  nextReadmeFile = nextReadmeFile.replace(
    currentBundleMinSHA,
    formattedBundleMinSHA
  )
}

fs.writeFileSync(readmePath, nextReadmeFile, FILE_FORMAT)
// eslint-disable-next-line no-console
console.log(`
#===============================#

-> Content hashes updated in README.md
    - Bundle: ${formattedBundleSHA}
    - Bundle (minified): ${formattedBundleMinSHA}
`)
