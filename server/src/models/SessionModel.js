import crypto from "crypto";
import { db } from "../config/database.js";
import { genId } from "../utils/helpers.js";

const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const SessionModel = {
  create(userId) {
    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const now = Date.now();

    const session = {
      id: genId("sess"),
      userId,
      tokenHash,
      expiresAt: now + SESSION_LIFETIME_MS,
      createdAt: now,
    };

    if (!db.data.sessions) db.data.sessions = [];
    db.data.sessions.push(session);
    db.saveSync();

    return rawToken; // Only returned once
  },

  validate(rawToken) {
    if (!rawToken || typeof rawToken !== "string") return null;
    if (!db.data.sessions) return null;

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const session = db.data.sessions.find(
      (s) => s.tokenHash === tokenHash && s.expiresAt > Date.now()
    );

    return session ? session.userId : null;
  },

  revoke(rawToken) {
    if (!rawToken || typeof rawToken !== "string") return;
    if (!db.data.sessions) return;

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const idx = db.data.sessions.findIndex((s) => s.tokenHash === tokenHash);

    if (idx !== -1) {
      db.data.sessions.splice(idx, 1);
      db.saveSync();
    }
  },

  revokeAllForUser(userId) {
    if (!db.data.sessions) return;
    
    const initialLength = db.data.sessions.length;
    db.data.sessions = db.data.sessions.filter((s) => s.userId !== userId);

    if (db.data.sessions.length !== initialLength) {
      db.saveSync();
    }
  },
};
