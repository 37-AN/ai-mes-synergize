// Minimal stub for Node's "util" module in the browser.
// Calling promisify here throws an error to flag unsupported usage.
export function promisify(fn) {
  throw new Error("util.promisify is not supported in the browser.");
}
