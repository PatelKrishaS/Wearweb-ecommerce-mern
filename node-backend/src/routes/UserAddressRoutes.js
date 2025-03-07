const express = require("express");
const router = express.Router();
const userAddressController = require("../controllers/UserAddressController");

// Add a new address
router.post("/add", userAddressController.addUserAddress);

// Get all addresses for a user
router.get("/user/:userId", userAddressController.getUserAddresses);

// Get all user addresses (for all users)
router.get("/all", userAddressController.getAllUserAddresses);

// Update an address
router.put("/update/:id", userAddressController.updateUserAddress);

// Delete an address
router.delete("/delete/:id", userAddressController.deleteUserAddress);



module.exports = router;