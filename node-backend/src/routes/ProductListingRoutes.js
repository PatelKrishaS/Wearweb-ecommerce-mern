const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductListingController");
const upload = require("../utils/MulterConfig");

// Add a new product (with file upload)
router.post("/add", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]), productController.addProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Get products by seller
router.get("/user/:userId", productController.getProductsBySeller);

// Get product by ID
router.get("/getProductById/:id", productController.getProductById);

// Add this route before module.exports
router.get("/getProductsByCategory", productController.getProductsByCategory);

// Update a product (with file upload support)
router.put(
  "/update/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  productController.updateProduct
);

// Get latest products
router.get('/latest', productController.getLatestProducts);

// Get best seller products
router.get('/bestsellers', productController.getBestSellers);

// Delete a product
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;