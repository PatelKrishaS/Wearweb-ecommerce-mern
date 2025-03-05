// routes/AreaRoutes.js
const express = require("express");
const router = express.Router();
const areaController = require("../controllers/AreaController");

router.post("/add", areaController.addArea);
router.get("/", areaController.getAreas);
router.get("/getareabycity/:cityId", areaController.getAreaByCityId);

module.exports = router;