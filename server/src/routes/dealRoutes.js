import { Router } from "express";
import { dealController } from "../controllers/dealController.js";
import { messageController } from "../controllers/messageController.js";
import { validateRequestBody } from "../middleware/validator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, dealController.getAllDeals);
router.get("/:id", authMiddleware, dealController.getDealById);
router.post("/", authMiddleware, validateRequestBody(["productId"]), dealController.createDeal);
router.post("/:id/accept", authMiddleware, dealController.acceptDeal);
router.post("/:id/decline", authMiddleware, dealController.declineDeal);
router.post("/:id/counter", authMiddleware, validateRequestBody(["unitPrice", "leadTimeDays"]), dealController.submitCounter);

// Nested message routes
router.get("/:id/messages", authMiddleware, messageController.getMessages);
router.post("/:id/messages", authMiddleware, messageController.postMessage);

export default router;
