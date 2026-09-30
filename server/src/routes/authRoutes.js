import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateRequestBody } from "../middleware/validator.js";

const router = Router();

router.post("/register", validateRequestBody(["email", "password"]), authController.register);
router.post("/login", validateRequestBody(["email", "password"]), authController.login);
router.get("/me", authController.getCurrentUser);

export default router;
