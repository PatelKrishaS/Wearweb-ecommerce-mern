const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductListingController");

// Add a new product
router.post("/add", productController.addProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Get products by seller
router.get("/seller/:sellerId", productController.getProductsBySeller);

// Update a product
// router.put("/update/:id", productController.updateProduct);

// Delete a product
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;