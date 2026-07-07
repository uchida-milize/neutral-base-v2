// Shim for next/font/google — Next.js resolves these calls via a build-time
// SWC/webpack transform that doesn't exist in Storybook's Vite/Rollup build,
// so the real package's named exports (e.g. `Inter`) don't exist there.
// Stub returns the shape callers rely on: { variable, className }.
export function Inter() {
  return { variable: "", className: "" };
}
