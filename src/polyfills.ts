import { Buffer } from 'buffer'

// @react-pdf/renderer uses Buffer internally. Available in Node/CF Workers
// natively, but not in browsers — polyfill it before any component loads.
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer
}
