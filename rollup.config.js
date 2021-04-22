import path from "path"
import babel from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

const year = new Date().getFullYear()

const banner = async () => {
  const { default: pkg } = await import("./package.json")

  return `/*!
  * @license MIT (https://github.com/geotrev/omdomdom/blob/master/LICENSE)
  * omdomdom v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`
}

const Formats = {
  CJS: "cjs",
  ES: "es",
  UMD: "umd",
}
const input = path.resolve(__dirname, "src/index.js")
const basePlugins = [nodeResolve(), babel({ babelHelpers: "bundled" })]

const terserPlugin = terser({
  output: {
    comments: (_, comment) => {
      const { value, type } = comment

      if (type === "comment2") {
        return /@preserve|@license|@cc_on/i.test(value)
      }
    },
  },
  mangle: { reserved: ["OmDomDom"] },
})

const baseOutput = (format) => ({
  banner,
  format,
  name: "OmDomDom",
  sourcemap: true,
})

let moduleOutputs = [Formats.ES, Formats.CJS].map((format) => ({
  ...baseOutput(format),
  file: path.resolve(__dirname, `lib/omdomdom.${format}.js`),
}))

const umdOutputs = [
  {
    ...baseOutput(Formats.UMD),
    file: path.resolve(__dirname, `dist/omdomdom.js`),
  },
]

if (process.env.BABEL_ENV === "publish") {
  moduleOutputs = [
    ...moduleOutputs,
    ...[Formats.ES, Formats.CJS].map((format) => ({
      ...baseOutput(format),
      plugins: [terserPlugin],
      file: path.resolve(__dirname, `lib/omdomdom.${format}.min.js`),
    })),
  ]

  umdOutputs.push({
    ...baseOutput(Formats.UMD),
    plugins: [terserPlugin],
    file: path.resolve(__dirname, `dist/omdomdom.min.js`),
  })
}

export default {
  input,
  plugins: basePlugins,
  output: [...moduleOutputs, ...umdOutputs],
}
