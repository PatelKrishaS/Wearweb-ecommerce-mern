const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/SubcategoryController");

// Subcategory Routes
router.post("/subcategory", subcategoryController.addSubcategory);
router.get("/getsubcategorybycategory/:categoryId", subcategoryController.getSubcategoriesByCategory);


module.exports = router;
