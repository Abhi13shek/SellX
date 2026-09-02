import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import copilotRoutes from "./routes/copilotRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

export function createApp() {
  const app = express();

  // Core Middleware
  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  if (ENV.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(requestLogger);
  }

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "SellX Trade Desk API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API Route Mounts
  app.use("/api/products", productRoutes);
  app.use("/api/deals", dealRoutes);
  app.use("/api/copilot", copilotRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/stats", statsRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
        statusCode: 404,
      },
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
