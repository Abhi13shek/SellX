import { logger } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    logger.info(`${req.method} ${req.originalUrl} - ${statusColor}${res.statusCode}\x1b[0m (${duration}ms)`);
  });
  next();
}
