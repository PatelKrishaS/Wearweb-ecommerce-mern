const routes = require("express").Router();
const stateController = require("../controllers/StateController");

routes.get("/getallstates", stateController.getAllStates);
routes.post("/state", stateController.addState);
routes.delete("/state/:id", stateController.deleteStateById);
routes.get("/state/:id", stateController.getStateById);

module.exports = routes;
