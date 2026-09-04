import fs from "fs";
import path from "path";
import { ENV } from "./env.js";
import { logger } from "../utils/logger.js";
import { SEED_PRODUCTS, getSeedDeals } from "../seed/seedData.js";

const DB_FILE = path.join(ENV.DATA_DIR, "db.json");

class Database {
  constructor() {
    this.data = {
      products: [],
      deals: [],
      users: [
        {
          id: "usr-seller-01",
          email: "seller@sellx.trade",
          name: "Verified Trade Partner",
          role: "seller",
          verified: true,
        },
      ],
      notifications: [],
    };
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      if (!fs.existsSync(ENV.DATA_DIR)) {
        fs.mkdirSync(ENV.DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length > 0) {
          this.data = parsed;
          logger.info(`Loaded database from ${DB_FILE} with ${this.data.products.length} products and ${this.data.deals.length} deals.`);
          this.initialized = true;
          return;
        }
      }

      // Seed database if empty
      this.data.products = [...SEED_PRODUCTS];
      this.data.deals = getSeedDeals(this.data.products);
      this.saveSync();
      logger.success(`Initialized fresh database with ${this.data.products.length} products and ${this.data.deals.length} deals.`);
      this.initialized = true;
    } catch (err) {
      logger.error("Database initialization error:", err);
      // Fallback in-memory
      this.data.products = [...SEED_PRODUCTS];
      this.data.deals = getSeedDeals(this.data.products);
      this.initialized = true;
    }
  }

  reset() {
    this.data.products = [...SEED_PRODUCTS];
    this.data.deals = getSeedDeals(this.data.products);
    this.saveSync();
    logger.success(`Reset database with ${this.data.products.length} products and ${this.data.deals.length} deals.`);
    return this.data;
  }

  saveSync() {
    try {
      if (!fs.existsSync(ENV.DATA_DIR)) {
        fs.mkdirSync(ENV.DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      logger.error("Failed to write to db.json:", err);
    }
  }
}

export const db = new Database();
