const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductListingController");
const upload = require("../utils/MulterConfig")

// Add a new product (with file upload)
router.post("/add", upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]), productController.addProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Get products by seller
router.get("/seller/:sellerId", productController.getProductsBySeller);

// Update a product
// router.put("/update/:id", productController.updateProduct);

// Delete a product
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;