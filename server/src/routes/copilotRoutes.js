import { Router } from "express";
import { copilotController } from "../controllers/copilotController.js";

const router = Router();

router.get("/buyer/:dealId", copilotController.getBuyerInsights);
router.get("/seller/:dealId", copilotController.getSellerInsights);

export default router;
