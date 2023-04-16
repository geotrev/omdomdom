import fs from "fs"
import path from "path"
import babel from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))

const dirname = path.resolve()
const year = new Date().getFullYear()

const banner = async () => {
  const pkg = loadJSON("../package.json")

  return `/*!
  * @license MIT (https://github.com/geotrev/omdomdom/blob/master/LICENSE)
  * Omdomdom v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`
}

const Formats = {
  CJS: "cjs",
  ES: "es",
  UMD: "umd",
}
const input = path.resolve(dirname, "src/index.js")
const basePlugins = [
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    comments: false,
    exclude: "node_modules",
  }),
]

const terserPlugin = terser()

const baseOutput = (format) => ({
  banner,
  format,
  name: "Omdomdom",
  sourcemap: true,
})

const outputs = [Formats.ES, Formats.CJS].reduce(
  (configs, format) => [
    ...configs,
    {
      ...baseOutput(format),
      file: path.resolve(dirname, `lib/omdomdom.${format}.js`),
    },
    {
      ...baseOutput(format),
      file: path.resolve(dirname, `lib/omdomdom.${format}.min.js`),
      plugins: [terserPlugin],
    },
  ],
  [
    {
      ...baseOutput(Formats.UMD),
      file: path.resolve(dirname, "dist/omdomdom.js"),
    },
    {
      ...baseOutput(Formats.UMD),
      file: path.resolve(dirname, "dist/omdomdom.min.js"),
      plugins: [terserPlugin],
    },
  ]
)

export default {
  input,
  plugins: basePlugins,
  output: [...outputs],
}
