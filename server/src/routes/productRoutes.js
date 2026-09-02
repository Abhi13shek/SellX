import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { validateRequestBody } from "../middleware/validator.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", validateRequestBody(["name", "basePrice"]), productController.createProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
