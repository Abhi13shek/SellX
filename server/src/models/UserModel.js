import { db } from "../config/database.js";

export const UserModel = {
  findByEmail(email) {
    if (!email) return null;
    return db.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  create({ email, name, role = "seller" }) {
    const newUser = {
      id: `usr-${Math.random().toString(36).slice(2, 8)}`,
      email: email.trim().toLowerCase(),
      name: name || "Verified Partner",
      role,
      verified: true,
      createdAt: Date.now(),
    };
    db.data.users.push(newUser);
    db.saveSync();
    return newUser;
  },
};
