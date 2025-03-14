const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

// Category Routes
router.post("/category", categoryController.addCategory);
router.get("/categories", categoryController.getAllCategories);

module.exports = router;
