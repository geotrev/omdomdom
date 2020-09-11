import path from "path"
import fs from "fs"
import Hashes from "jshashes"
import { getJSON } from "./helpers.js"
import * as logger from "./logger.js"

logger.begin("Building Metadata")

const metadata = getJSON("build/metadata.json")

/**
 * Update metadata.json with the latest version and SRI hashes
 */

const SHA256 = new Hashes.SHA256()

function getSHA(data) {
  return SHA256.b64(data)
}

const updatedMetadata = metadata.map((pkg) => {
  const { name, version: prevVersion, sri: prevSri } = pkg

  logger.step(`\nUpdating package: ${name}`)

  // Update SRI hashes

  const bundlePath = path.resolve(process.cwd(), `dist/${name}.js`)
  const bundleMinPath = path.resolve(process.cwd(), `dist/${name}.min.js`)
  const bundleContent = fs.readFileSync(bundlePath, "utf-8")
  const bundleMinContent = fs.readFileSync(bundleMinPath, "utf-8")
  const bundleContentHash = `sha256-${getSHA(bundleContent)}`
  const bundleMinContentHash = `sha256-${getSHA(bundleMinContent)}`
  let sri = {
    bundle: prevSri.bundle,
    bundleMin: prevSri.bundleMin,
  }

  if (
    bundleContentHash !== prevSri.bundle ||
    bundleMinContentHash !== prevSri.bundleMin
  ) {
    sri.bundle = bundleContentHash
    sri.bundleMin = bundleMinContentHash
    logger.step(
      `--> SRI hashes changed, updated.\n      bundle: ${bundleContentHash}\n      bundle (minified): ${bundleMinContentHash}`
    )
  } else {
    logger.step("--> SRI hashes unchanged, skipping...")
  }

  // Update version

  const pkgVersion = getJSON(`package.json`).version
  let version = prevVersion

  if (pkgVersion !== prevVersion) {
    version = pkgVersion
    logger.step(
      `--> Version changed, updated.\n      ${prevVersion} -> ${pkgVersion}`
    )
  } else {
    logger.step("--> Version unchanged, skipping...")
  }

  return { ...pkg, version, sri }
})

const payload = JSON.stringify(updatedMetadata, null, 2)

fs.writeFileSync(
  path.resolve(process.cwd(), "build/metadata.json"),
  payload,
  "utf-8"
)

logger.finish()
