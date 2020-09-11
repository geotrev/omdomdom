import path from "path"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import { banner } from "./build/banner"

const Formats = {
  CJS: "cjs",
  ES: "es",
  UMD: "umd",
}
const input = path.resolve(__dirname, "src/index.js")
const basePlugins = [babel({ babelHelpers: "bundled" })]

const terserPlugin = terser({
  output: {
    comments: (_, comment) => {
      const { value, type } = comment

      if (type === "comment2") {
        return /@preserve|@license|@cc_on/i.test(value)
      }
    },
  },
  mangle: { reserved: ["omDomDom"] },
})

const baseOutput = (format) => ({
  banner,
  format,
  name: "omDomDom",
  sourcemap: true,
})

const moduleOutputs = [Formats.ES, Formats.CJS].map((format) => ({
  ...baseOutput(format),
  plugins: process.env.BABEL_ENV === "publish" ? [terserPlugin] : undefined,
  file: path.resolve(__dirname, `lib/omdomdom.${format}.js`),
}))

const umdOutputs = [
  {
    ...baseOutput(Formats.UMD),
    file: path.resolve(__dirname, `dist/omdomdom.js`),
  },
  {
    ...baseOutput(Formats.UMD),
    plugins: [terserPlugin],
    file: path.resolve(__dirname, `dist/omdomdom.min.js`),
  },
]

export default {
  input,
  plugins: basePlugins,
  output: [...moduleOutputs, ...umdOutputs],
}
