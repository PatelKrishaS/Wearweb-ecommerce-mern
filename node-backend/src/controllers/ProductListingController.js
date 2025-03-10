const productModel = require("../models/ProductListingModel");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      sellerId,
      categoryId,
      subCategoryId,
      name,
      description,
      baseprice,
      offerprice,
      offerPercentage,
      size,
      color,
      material,
      stockQuantity,
      imageURL1,
      imageURL2,
      imageURL3,
    } = req.body;

    const newProduct = await productModel.create({
      sellerId,
      categoryId,
      subCategoryId,
      name,
      description,
      baseprice,
      offerprice,
      offerPercentage,
      size,
      color,
      material,
      stockQuantity,
      imageURL1,
      imageURL2,
      imageURL3,
    });

    res.status(201).json({
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find()
      .populate("sellerId")
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by seller
const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await productModel.find({ sellerId })
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product
// const updateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const updates = req.body;

//     const updatedProduct = await productModel.findByIdAndUpdate(productId, updates, {
//       new: true, // Return the updated document
//       runValidators: true, // Run validation on updates
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({
//       message: "Product updated successfully",
//       data: updatedProduct,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductsBySeller,
  deleteProduct,
};