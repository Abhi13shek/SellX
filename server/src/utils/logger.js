export const logger = {
  info: (msg, ...args) => {
    console.log(`\x1b[36m[INFO]\x1b[0m ${new Date().toISOString().slice(11, 19)} - ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${new Date().toISOString().slice(11, 19)} - ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString().slice(11, 19)} - ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString().slice(11, 19)} - ${msg}`, ...args);
  },
};
