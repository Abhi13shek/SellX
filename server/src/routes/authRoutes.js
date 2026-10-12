import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateRequestBody } from "../middleware/validator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", validateRequestBody(["email", "password"]), authController.register);
router.post("/login", validateRequestBody(["email", "password"]), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;
