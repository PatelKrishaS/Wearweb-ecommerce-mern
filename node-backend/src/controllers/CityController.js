const City = require("../models/CityModel");

const addCity = async (req, res) => {
  try {
    const savedCity = await City.create(req.body);
    res.status(201).json({
      message: "City added successfully",
      data: savedCity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCities = async (req, res) => {
  try {
    const cities = await City.find().populate("stateId");
    res.status(200).json({
      message: "All cities fetched successfully",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate("stateId");
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({
      message: "City fetched successfully",
      data: city,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCityById = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({
      message: "City deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addCity, getAllCities, getCityById, deleteCityById };
