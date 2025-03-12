const express = require("express");
const router = express.Router();
const orderDetailController = require("../controllers/OrderDetailController");

// Add order details
router.post("/add", orderDetailController.addOrderDetails);

// Get details by order
router.get("/order/:orderId", orderDetailController.getDetailsByOrder);

module.exports = router;