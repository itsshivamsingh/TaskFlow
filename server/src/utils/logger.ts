export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  // Sanitizes URI to hide username:password
  sanitizeUri: (uri: string): string => {
    if (!uri) return '<empty>';
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  },
};
