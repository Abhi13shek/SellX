import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { ENV } from "./env.js";
import { logger } from "../utils/logger.js";
import { SEED_PRODUCTS, getSeedDeals } from "../seed/seedData.js";
import {
  ensureRelationalSchema,
  loadRelationalState,
  migrateState,
  persistRelationalChanges,
  readBackupState,
} from "./relationalStore.js";

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
    this.pool = null;
    this.pendingWrite = Promise.resolve();
    this.persistedData = null;
  }

  async init() {
    if (this.initialized) return;

    try {
      if (ENV.MYSQL.host) {
        this.pool = mysql.createPool({
          ...ENV.MYSQL,
          decimalNumbers: true,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
        await ensureRelationalSchema(this.pool);

        const backupState = await readBackupState(this.pool);
        let relationalState = await loadRelationalState(this.pool);
        if (backupState) {
          await migrateState(this.pool, this.normalizeState(backupState));
        } else if (this.isEmpty(relationalState) && fs.existsSync(DB_FILE)) {
          const localState = this.normalizeState(JSON.parse(fs.readFileSync(DB_FILE, "utf-8")));
          await migrateState(this.pool, localState);
        } else if (this.isEmpty(relationalState)) {
          this.seed();
          await migrateState(this.pool, this.data);
        }

        this.data = await loadRelationalState(this.pool);
        this.persistedData = this.cloneState(this.data);
        this.initialized = true;
        logger.success(
          `Loaded relational MySQL data: ${this.data.users.length} users, ${this.data.products.length} products, ${this.data.deals.length} deals.`
        );
        return;
      }

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
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
        throw err;
      }
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
    if (this.pool) {
      this.pendingWrite = this.pendingWrite
        .then(async () => {
          const snapshot = this.cloneState(this.data);
          await persistRelationalChanges(this.pool, this.persistedData, snapshot);
          this.persistedData = snapshot;
        })
        .catch((err) => logger.error("Failed to persist relational data:", err));
      return;
    }

    try {
      if (!fs.existsSync(ENV.DATA_DIR)) {
        fs.mkdirSync(ENV.DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      logger.error("Failed to write to db.json:", err);
    }
  }

  async flush() {
    await this.pendingWrite;
  }

  async close() {
    await this.flush();
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  seed() {
    this.data.products = [...SEED_PRODUCTS];
    this.data.deals = getSeedDeals(this.data.products);
  }

  normalizeState(state) {
    return {
      products: Array.isArray(state.products) ? state.products : [],
      deals: Array.isArray(state.deals) ? state.deals : [],
      users: Array.isArray(state.users) ? state.users : this.data.users,
      notifications: Array.isArray(state.notifications) ? state.notifications : [],
    };
  }

  cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  isEmpty(state) {
    return ["users", "products", "deals", "notifications"]
      .every((key) => state[key].length === 0);
  }
}

export const db = new Database();
