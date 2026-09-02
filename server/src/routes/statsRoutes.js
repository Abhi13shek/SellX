import { Router } from "express";
import { statsController } from "../controllers/statsController.js";

const router = Router();

router.get("/", statsController.getPlatformStats);

export default router;
