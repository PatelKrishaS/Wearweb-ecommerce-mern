const productModel = require("../models/ProductListingModel");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

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
    } = req.body;

    // Validate required fields
    if (!sellerId || !categoryId || !subCategoryId || !name || !description || !baseprice || !stockQuantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Upload images to Cloudinary
    const imageURL1 = req.files?.image1
      ? (await cloudinaryUtil.uploadFileToCloudinary(req.files.image1[0])).secure_url
      : null;
    const imageURL2 = req.files?.image2
      ? (await cloudinaryUtil.uploadFileToCloudinary(req.files.image2[0])).secure_url
      : null;
    const imageURL3 = req.files?.image3
      ? (await cloudinaryUtil.uploadFileToCloudinary(req.files.image3[0])).secure_url
      : null;

    // Create new product
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
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Failed to add product", error: err.message });
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
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// Get products by seller
const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.userId; // Use userId from route parameter
    const products = await productModel.find({ sellerId })
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products by seller:", err);
    res.status(500).json({ message: "Failed to fetch products by seller", error: err.message });
  }
};

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
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductsBySeller, // Updated method name to match the route
  deleteProduct,
};