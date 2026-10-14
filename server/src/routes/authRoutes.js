import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateRequestBody } from "../middleware/validator.js";

const router = Router();

router.post("/register", validateRequestBody(["email", "password"]), authController.register);
router.post("/login", validateRequestBody(["email", "password"]), authController.login);
router.post("/password-reset/request", validateRequestBody(["email"]), authController.requestPasswordReset);
router.post("/password-reset/confirm", validateRequestBody(["email", "code", "password"]), authController.resetPassword);
router.get("/me", authController.getCurrentUser);

export default router;
