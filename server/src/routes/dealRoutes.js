import { Router } from "express";
import { dealController } from "../controllers/dealController.js";
import { messageController } from "../controllers/messageController.js";
import { validateRequestBody } from "../middleware/validator.js";

const router = Router();

router.get("/", dealController.getAllDeals);
router.get("/:id", dealController.getDealById);
router.post("/", validateRequestBody(["productId"]), dealController.createDeal);
router.post("/:id/accept", dealController.acceptDeal);
router.post("/:id/decline", dealController.declineDeal);
router.post("/:id/counter", validateRequestBody(["unitPrice", "leadTimeDays"]), dealController.submitCounter);

// Nested message routes
router.get("/:id/messages", messageController.getMessages);
router.post("/:id/messages", messageController.postMessage);

export default router;
