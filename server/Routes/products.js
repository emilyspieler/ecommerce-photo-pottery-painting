const express = require("express");
const router = express.Router();
const { authenticate, adminRequired } = require("../Middleware/auth");
const { uploadMultiple } = require("../utils/uploads");
const productController = require("../controllers/productController");

router.post(
  "/",
  authenticate,
  adminRequired,
  uploadMultiple,
  productController.createProduct,
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.delete(
  "/:id",
  authenticate,
  adminRequired,
  productController.deleteProduct,
);

module.exports = router;
