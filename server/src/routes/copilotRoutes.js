import { Router } from "express";
import { copilotController } from "../controllers/copilotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/buyer/:dealId", authMiddleware, copilotController.getBuyerInsights);
router.get("/seller/:dealId", authMiddleware, copilotController.getSellerInsights);
router.post("/recommend", copilotController.recommendBuyerProduct);

export default router;
