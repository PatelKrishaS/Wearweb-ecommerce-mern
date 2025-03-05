const State = require("../models/StateModel");

const addState = async (req, res) => {
  try {
    const savedState = await State.create(req.body);
    res.status(201).json({
      message: "State added successfully",
      data: savedState,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.status(200).json({
      message: "All states fetched successfully",
      data: states,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({
      message: "State fetched successfully",
      data: state,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStateById = async (req, res) => {
  try {
    const deletedState = await State.findByIdAndDelete(req.params.id);
    if (!deletedState) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({
      message: "State deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addState, getAllStates, getStateById, deleteStateById };
