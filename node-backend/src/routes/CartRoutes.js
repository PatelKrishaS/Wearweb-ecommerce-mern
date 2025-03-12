const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

// Create a cart
router.post("/create", cartController.createCart);

// Get cart by user
router.get("/user/:userId", cartController.getCartByUser);

module.exports = router;