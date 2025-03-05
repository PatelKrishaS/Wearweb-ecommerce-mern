const routes = require("express").Router();
const cityController = require("../controllers/CityController");

routes.get("/cities", cityController.getAllCities);
routes.post("/city", cityController.addCity);
routes.delete("/city/:id", cityController.deleteCityById);
routes.get("/city/:id", cityController.getCityById);

module.exports = routes;
