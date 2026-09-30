import { promisify } from "node:util";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { db } from "../config/database.js";
import { UserModel } from "../models/UserModel.js";

const scryptAsync = promisify(scrypt);
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const HASH_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEMORY = 64 * 1024 * 1024;
const INVALID_CREDENTIALS = "Invalid email or password.";

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

  getCurrentUser(req, res) {
    const defaultUser = UserModel.findByEmail("seller@sellx.trade");
    res.json({ success: true, data: UserModel.toSafeUser(defaultUser) });
  },
};