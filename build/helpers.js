#!/usr/bin/env node

import path from "path"
import fs from "fs"

export const FILE_FORMAT = "utf-8"

export const getJSON = (target) =>
  JSON.parse(fs.readFileSync(path.resolve(process.cwd(), target)))

export const getFileContent = (filePath) => {
  const targetPath = path.resolve(process.cwd(), filePath)
  return fs.readFileSync(targetPath, FILE_FORMAT)
}

export const writeFileContent = (filePath, content) => {
  return fs.writeFileSync(
    path.resolve(process.cwd(), filePath),
    content,
    FILE_FORMAT
  )
}
