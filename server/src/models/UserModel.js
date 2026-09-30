import { randomUUID } from "node:crypto";
import { db } from "../config/database.js";

export const UserModel = {
  findByEmail(email) {
    if (!email) return null;
    return db.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  create({ email, name, role = "seller", passwordHash }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.findByEmail(normalizedEmail)) return null;

    const newUser = {
      id: `usr-${randomUUID()}`,
      email: normalizedEmail,
      name: name || "Verified Partner",
      role,
      verified: true,
      createdAt: Date.now(),
      passwordHash,
    };
    db.data.users.push(newUser);
    db.saveSync();
    return newUser;
  },

  toSafeUser(user) {
    if (!user) return null;
    const { id, email, name, role, verified, createdAt } = user;
    return { id, email, name, role, verified, ...(createdAt == null ? {} : { createdAt }) };
  },
};
