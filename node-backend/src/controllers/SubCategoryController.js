const subcategoryModel = require("../models/SubCategoryModel");

const addSubcategory = async (req, res) => {
  try {
    const savedSubcategory = await subcategoryModel.create(req.body);
    res.status(201).json({
      message: "Subcategory added successfully",
      data: savedSubcategory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await subcategoryModel.find({ categoryId: req.params.categoryId });
    res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addSubcategory, getSubcategoriesByCategory };
