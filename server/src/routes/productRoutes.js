import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { validateRequestBody } from "../middleware/validator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/:id/similar", productController.getSimilarProducts);
router.post("/", authMiddleware, validateRequestBody(["name", "basePrice"]), productController.createProduct);
router.put("/:id/automation", authMiddleware, productController.updateAutomationRules);
router.post("/:id/automation/simulate", authMiddleware, productController.simulateAutomation);
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
