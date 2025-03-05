// routes/CityRoutes.js
const express = require("express");
const router = express.Router();
const cityController = require("../controllers/CityController");

router.post("/addcity", cityController.addCity);
router.get("/getallcities", cityController.getCities);
router.get("/getcitybystate/:stateId", cityController.getCityByStateId);

module.exports = router;
