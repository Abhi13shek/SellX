import { SessionModel } from "../models/SessionModel.js";
import { UserModel } from "../models/UserModel.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { message: "Unauthorized", statusCode: 401 } });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, error: { message: "Unauthorized", statusCode: 401 } });
  }

  const userId = SessionModel.validate(token);
  if (!userId) {
    return res.status(401).json({ success: false, error: { message: "Session invalid or expired", statusCode: 401 } });
  }

  const user = UserModel.findById(userId);
  if (!user) {
    return res.status(401).json({ success: false, error: { message: "User not found", statusCode: 401 } });
  }

  req.user = user;
  req.token = token;
  next();
}
