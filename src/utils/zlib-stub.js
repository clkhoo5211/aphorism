// Zlib stub for browser - provides no-op implementations
// Note: In browser, compression is typically handled by browser APIs or not needed
export const Inflate = class {
  constructor() {}
  write() {}
  end() {}
};

export const Deflate = class {
  constructor() {}
  write() {}
  end() {}
};

export function inflateSync(buffer) {
  return buffer; // Return as-is in browser
}

export function deflateSync(buffer) {
  return buffer; // Return as-is in browser
}

export function gunzipSync(buffer) {
  return buffer; // Return as-is in browser
}

export function gzipSync(buffer) {
  return buffer; // Return as-is in browser
}

export default {
  Inflate,
  Deflate,
  inflateSync,
  deflateSync,
  gunzipSync,
  gzipSync,
};

