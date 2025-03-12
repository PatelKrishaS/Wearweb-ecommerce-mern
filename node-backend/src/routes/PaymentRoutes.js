const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController");

// Process payment
router.post("/process", paymentController.processPayment);

module.exports = router;