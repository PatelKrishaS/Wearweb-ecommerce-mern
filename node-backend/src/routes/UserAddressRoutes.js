const routes = require("express").Router();
const userAddressController = require("../controllers/UserAddressController");

routes.get("/user-addresses", userAddressController.getAllUserAddresses);
routes.post("/user-address", userAddressController.addUserAddress);
routes.delete("/user-address/:id", userAddressController.deleteUserAddressById);
routes.get("/user-address/:id", userAddressController.getUserAddressById);

module.exports = routes;
