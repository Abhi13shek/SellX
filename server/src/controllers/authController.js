import { UserModel } from "../models/UserModel.js";

export const authController = {
  login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({
          success: false,
          error: { message: "Valid email address required", statusCode: 400 },
        });
      }

      let user = UserModel.findByEmail(email);
      if (!user) {
        user = UserModel.create({ email, name: email.split("@")[0] });
      }

      res.json({
        success: true,
        data: {
          user,
          token: `demo-jwt-${user.id}-${Date.now()}`,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser(req, res, next) {
    try {
      const defaultUser = {
        id: "usr-seller-01",
        email: "seller@sellx.trade",
        name: "Verified Trade Partner",
        role: "seller",
        verified: true,
      };
      res.json({ success: true, data: defaultUser });
    } catch (err) {
      next(err);
    }
  },
};
