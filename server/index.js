import { createApp } from "./src/app.js";
import { ENV } from "./src/config/env.js";
import { db } from "./src/config/database.js";
import { logger } from "./src/utils/logger.js";

async function startServer() {
  try {
    // 1. Initialize DB storage & seed data
    await db.init();

    // 2. Create Express app
    const app = createApp();

    // 3. Listen on configured port
    const server = app.listen(ENV.PORT, () => {
      logger.success(`🚀 SellX Trade Desk Backend running at http://localhost:${ENV.PORT}`);
      logger.info(`📡 Health check available at http://localhost:${ENV.PORT}/health`);
      logger.info(`📦 Products API: http://localhost:${ENV.PORT}/api/products`);
      logger.info(`💼 Deals API: http://localhost:${ENV.PORT}/api/deals`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      logger.info("Gracefully shutting down server...");
      server.close(() => {
        db.saveSync();
        logger.info("Database state saved. Server terminated.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    logger.error("Failed to start backend server:", err);
    process.exit(1);
  }
}

startServer();
