const express = require("express");
const router = express.Router();
const statsController = require("../controllers/StatsController");

router.get("/categories", statsController.getTopCategories);
router.get("/customers", statsController.getCustomerStats);
router.get("/sales", statsController.getSalesStats);
// router.get('/categories/count',statsController.getTotalCategoriesCount) 


module.exports = router;