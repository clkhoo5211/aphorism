// Pino stub for browser - provides a no-op logger compatible with AppKit
// AppKit's logger expects levels.error to exist, so we provide proper levels structure
export const levels = {
  values: {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
  },
  labels: {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal',
  },
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

// Create a logger instance that AppKit can use
const createLoggerInstance = () => ({
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => createLoggerInstance(),
  level: 'silent',
  levels: levels,
});

export const pino = (options) => {
  return createLoggerInstance();
};

// Set default export and attach levels to pino function
pino.levels = levels;
pino.destination = () => ({});
pino.transport = () => ({});
pino.stdSerializers = {
  err: () => ({}),
  req: () => ({}),
  res: () => ({}),
};

export default pino;
