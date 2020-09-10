import path from "path"
import resolve from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"

const DEMO_PATH = path.resolve(__dirname, "demo")
const SOURCE_PATH = path.resolve(__dirname, "demo/test-cases.js")
const OUTPUT_PATH = DEMO_PATH + "/bundle.js"

export default {
  input: SOURCE_PATH,
  output: {
    file: OUTPUT_PATH,
    format: "iife",
  },
  plugins: [
    resolve(),
    livereload({ watch: DEMO_PATH }),
    serve({
      open: true,
      contentBase: DEMO_PATH,
      historyApiFallback: true,
      host: "localhost",
      port: 3000,
    }),
  ],
}
