/* eslint-disable no-console */

export function begin(msg) {
  console.log("****************************************")
  console.log(`Running Operation: ${msg}`)
  console.log("****************************************\n")
}

export function step(msg, newLine) {
  console.log(msg)
  if (newLine) console.log("\n")
}

export function finish() {
  console.log(`\nDone ✨\n`)
}
