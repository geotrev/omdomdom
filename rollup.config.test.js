import path from "path"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"

const TEST_ROOT = path.resolve(__dirname, "test")
const SOURCE_PATH = path.resolve(TEST_ROOT, "test-cases.js")
const OUTPUT_PATH = path.resolve(TEST_ROOT, "bundle.js")

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
