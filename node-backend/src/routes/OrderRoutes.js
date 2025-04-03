const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Create an order
router.post("/create", orderController.createOrder);

// Get orders by user
router.get("/user/:userId", orderController.getOrdersByUser);

router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;