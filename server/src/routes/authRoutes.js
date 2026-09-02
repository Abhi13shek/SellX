import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateRequestBody } from "../middleware/validator.js";

const router = Router();

router.post("/login", validateRequestBody(["email"]), authController.login);
router.get("/me", authController.getCurrentUser);

export default router;
