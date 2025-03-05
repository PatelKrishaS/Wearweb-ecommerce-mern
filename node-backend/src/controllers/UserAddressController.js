const userAddressModel = require("../models/UserAddressModel");

const getAllUserAddresses = async (req, res) => {
    const userAddresses = await userAddressModel.find().populate("userId cityId stateId");
    res.json({ message: "User addresses fetched successfully", data: userAddresses });
};

const addUserAddress = async (req, res) => {
    const savedUserAddress = await userAddressModel.create(req.body);
    res.json({ message: "User address added successfully", data: savedUserAddress });
};

const deleteUserAddressById = async (req, res) => {
    const deletedUserAddress = await userAddressModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User address deleted successfully", data: deletedUserAddress });
};

const getUserAddressById = async (req, res) => {
    const foundUserAddress = await userAddressModel.findById(req.params.id).populate("userId cityId stateId");
    res.json({ message: "User address fetched", data: foundUserAddress });
};

module.exports = {
    getAllUserAddresses,
    addUserAddress,
    deleteUserAddressById,
    getUserAddressById
};
