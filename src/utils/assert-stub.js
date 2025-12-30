// Assert stub for browser - provides a no-op assert module
export function ok(value, message) {
  if (!value) {
    throw new Error(message || 'Assertion failed');
  }
}

export default {
  ok,
  fail: (message) => { throw new Error(message || 'Assertion failed'); },
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },
  notEqual: (actual, expected, message) => {
    if (actual === expected) {
      throw new Error(message || `Expected not ${expected}, got ${actual}`);
    }
  },
};

