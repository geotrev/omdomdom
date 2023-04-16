import path from "path"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"

const { CDN } = process.env
const isCdnMode = CDN === "true"
const dirname = path.resolve()
const TEST_ROOT = path.resolve(dirname, "test")
const SOURCE_PATH = TEST_ROOT + "/test-cases.js"
const OUTPUT_PATH = TEST_ROOT + "/bundle.js"
const OMDOMDOM_EXTERNAL_ID = path.resolve(dirname, "src/index.js")

export default {
  input: SOURCE_PATH,
  output: {
    file: OUTPUT_PATH,
    format: "iife",
    globals: isCdnMode
      ? {
          [OMDOMDOM_EXTERNAL_ID]: "Omdomdom",
        }
      : {},
  },
  external: isCdnMode ? [OMDOMDOM_EXTERNAL_ID] : [],
  plugins: [
    nodeResolve(),
    livereload({ watch: TEST_ROOT }),
    serve({
      open: true,
      contentBase: TEST_ROOT,
      historyApiFallback: true,
      host: "localhost",
      port: 3000,
    }),
  ],
}
