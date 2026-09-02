import { ProductModel } from "../models/ProductModel.js";

export const productController = {
  getAllProducts(req, res, next) {
    try {
      const { category, search, sortBy } = req.query;
      const products = ProductModel.findAll({ category, search, sortBy });
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  },

  getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  createProduct(req, res, next) {
    try {
      const { name, basePrice, category, description, supplier, leadTimeDays, highlights, image, sku } = req.body;
      const product = ProductModel.create({
        name,
        basePrice,
        category,
        description,
        supplier,
        leadTimeDays,
        highlights,
        image,
        sku,
        sellerAdded: true,
      });
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = ProductModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
