const SubCategory = require("../models/SubCategoryModel");

const addSubCategory = async (req, res) => {
  try {
    const savedSubCategory = await SubCategory.create(req.body);
    res.status(201).json({
      message: "SubCategory added successfully",
      data: savedSubCategory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId");
    res.status(200).json({
      message: "All subcategories fetched successfully",
      data: subCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("categoryId");
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.status(200).json({
      message: "SubCategory fetched successfully",
      data: subCategory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSubCategoryById = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.status(200).json({
      message: "SubCategory deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addSubCategory, getAllSubCategories, getSubCategoryById, deleteSubCategoryById };
