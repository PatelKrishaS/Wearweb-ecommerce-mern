const userAddressModel = require("../models/UserAddressModel");

// Add a new user address
const addUserAddress = async (req, res) => {
  try {
    const { userId, title, unitName, street, landMark, cityId, stateId, addressDetail, zipCode } = req.body;

    // Create a new address
    const newAddress = await userAddressModel.create({
      userId,
      title,
      unitName,
      street,
      landMark,
      cityId,
      stateId,
      addressDetail,
      zipCode,
    });

    res.status(201).json({
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await userAddressModel.find({ userId })
      .populate("cityId")
      .populate("stateId");

    if (addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    res.status(200).json({
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all user addresses (for all users)
const getAllUserAddresses = async (req, res) => {
  try {
    const addresses = await userAddressModel.find()
      .populate("cityId")
      .populate("stateId")
      .populate("userId"); // Optionally populate user details if needed

    if (addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found" });
    }

    res.status(200).json({
      message: "All user addresses fetched successfully",
      data: addresses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a user address
const updateUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updates = req.body;

    const updatedAddress = await userAddressModel.findByIdAndUpdate(addressId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on updates
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await userAddressModel.findById(addressId)
      .populate("cityId")
      .populate("stateId")
      .populate("areaId");

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address fetched successfully",
      data: address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a user address
const deleteUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const deletedAddress = await userAddressModel.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  addUserAddress,
  getUserAddresses,
  getAllUserAddresses,
  updateUserAddress,
  getAddressById,
  deleteUserAddress,
};