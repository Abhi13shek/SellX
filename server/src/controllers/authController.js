import { promisify } from "node:util";
import { createHash, randomBytes, randomInt, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { db } from "../config/database.js";
import { ENV } from "../config/env.js";
import { UserModel } from "../models/UserModel.js";

const scryptAsync = promisify(scrypt);
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const HASH_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEMORY = 64 * 1024 * 1024;
const INVALID_CREDENTIALS = "Invalid email or password.";
const RESET_CODE_LIFETIME_MS = 15 * 60 * 1000;

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await scryptAsync(password, salt, HASH_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
    maxmem: MAX_MEMORY,
  });
  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

async function verifyPassword(password, passwordHash) {
  if (typeof passwordHash !== "string") return false;
  const [algorithm, cost, blockSize, parallelization, saltText, hashText] = passwordHash.split("$");
  if (
    algorithm !== "scrypt" ||
    Number(cost) !== SCRYPT_COST ||
    Number(blockSize) !== SCRYPT_BLOCK_SIZE ||
    Number(parallelization) !== SCRYPT_PARALLELIZATION ||
    !saltText ||
    !hashText
  ) return false;

  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  if (salt.length !== SALT_LENGTH || expected.length !== HASH_LENGTH) return false;

  const actual = await scryptAsync(password, salt, expected.length, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
    maxmem: MAX_MEMORY,
  });
  return timingSafeEqual(expected, actual);
}

function createSession(user) {
  return {
    user: UserModel.toSafeUser(user),
    token: randomBytes(32).toString("base64url"),
  };
}

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    error: { message, statusCode },
  });
}

function hashResetCode(code) {
  return createHash("sha256").update(code).digest("hex");
}

function codesMatch(expectedHash, code) {
  const expected = Buffer.from(expectedHash || "", "hex");
  const actual = Buffer.from(hashResetCode(code), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!isValidEmail(email)) {
        return sendError(res, 400, "Enter a valid email address.");
      }
      if (typeof password !== "string" || password.length < 8) {
        return sendError(res, 400, "Password must be at least 8 characters.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (UserModel.findByEmail(normalizedEmail)) {
        return sendError(res, 409, "An account with this email already exists.");
      }

      const passwordHash = await hashPassword(password);
      const user = UserModel.create({
        email: normalizedEmail,
        name: normalizedEmail.split("@")[0],
        passwordHash,
      });
      if (!user) {
        return sendError(res, 409, "An account with this email already exists.");
      }

      await db.flush();
      res.status(201).json({ success: true, data: createSession(user) });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!isValidEmail(email) || typeof password !== "string") {
        return sendError(res, 401, INVALID_CREDENTIALS);
      }

      const user = UserModel.findByEmail(email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return sendError(res, 401, INVALID_CREDENTIALS);
      }

      res.json({ success: true, data: createSession(user) });
    } catch (err) {
      next(err);
    }
  },

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const response = {
        success: true,
        data: { message: "If an account exists for that email, a reset code has been created." },
      };
      if (!isValidEmail(email) || !db.pool) return res.json(response);

      const user = UserModel.findByEmail(email);
      if (!user) return res.json(response);

      const now = Date.now();
      const code = String(randomInt(100000, 1000000));
      await db.pool.execute(
        "UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL",
        [now, user.id]
      );
      await db.pool.execute(
        "INSERT INTO password_reset_tokens (id, user_id, code_hash, expires_at, used_at, created_at) VALUES (?, ?, ?, ?, NULL, ?)",
        [randomUUID(), user.id, hashResetCode(code), now + RESET_CODE_LIFETIME_MS, now]
      );

      // Local development has no mail service. Make the generated code available
      // only outside production so the flow is testable without weakening deploys.
      if (ENV.NODE_ENV !== "production") response.data.resetCode = code;
      return res.json(response);
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, code, password } = req.body;
      if (!isValidEmail(email) || !/^\d{6}$/.test(String(code || ""))) {
        return sendError(res, 400, "Enter a valid email address and 6-digit reset code.");
      }
      if (typeof password !== "string" || password.length < 8) {
        return sendError(res, 400, "Password must be at least 8 characters.");
      }
      if (!db.pool) return sendError(res, 503, "Password reset is unavailable while the database is offline.");

      const user = UserModel.findByEmail(email);
      if (!user) return sendError(res, 400, "The reset code is invalid or has expired.");

      const [tokens] = await db.pool.execute(
        `SELECT id, code_hash FROM password_reset_tokens
         WHERE user_id = ? AND used_at IS NULL AND expires_at > ?
         ORDER BY created_at DESC LIMIT 1`,
        [user.id, Date.now()]
      );
      const token = tokens[0];
      if (!token || !codesMatch(token.code_hash, String(code))) {
        return sendError(res, 400, "The reset code is invalid or has expired.");
      }

      const updatedUser = UserModel.updatePasswordHash(user.id, await hashPassword(password));
      await db.flush();
      await db.pool.execute("UPDATE password_reset_tokens SET used_at = ? WHERE id = ?", [Date.now(), token.id]);
      res.json({ success: true, data: { message: "Password updated. You can now sign in.", user: UserModel.toSafeUser(updatedUser) } });
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser(req, res) {
    const defaultUser = UserModel.findByEmail("seller@sellx.trade");
    res.json({ success: true, data: UserModel.toSafeUser(defaultUser) });
  },
};
