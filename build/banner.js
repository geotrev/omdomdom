const year = new Date().getFullYear()

export const banner = async () => {
  const { default: pkg } = await import("../package.json")

  return `/*!
  * @license MIT (https://github.com/geotrev/omdomdom/blob/master/LICENSE)
  * omdomdom v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`
}
