import path from "path"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"

const currentDir = process.cwd()
const TEST_ROOT = path.resolve(currentDir, "test")
const SOURCE_PATH = TEST_ROOT + "/test-cases.js"
const OUTPUT_PATH = TEST_ROOT + "/bundle.js"

export default {
  input: SOURCE_PATH,
  output: {
    file: OUTPUT_PATH,
    format: "iife",
  },
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
