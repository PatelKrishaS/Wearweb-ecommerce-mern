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

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
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

// Update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    let updateData = req.body;

    // Convert string booleans to actual booleans
    if (updateData.bestSeller) {
      updateData.bestSeller = updateData.bestSeller === 'true';
    }
    if (updateData.hasSizes) {
      updateData.hasSizes = updateData.hasSizes === 'true';
    }

    // Handle sizes array (from multiple form fields)
    if (req.body.sizes) {
      // Get all size values (formdata sends multiple fields with same name)
      const sizesArray = Array.isArray(req.body.sizes) 
        ? req.body.sizes 
        : [req.body.sizes];
      
      // Filter out empty values and the initial empty array marker
      updateData.sizes = sizesArray
        .filter(size => size && size !== '[]' && size !== 'none')
        .map(size => size.toUpperCase()); // Ensure uppercase
    }

    // Handle images
    if (req.files?.image1) {
      updateData.imageURL1 = (await cloudinaryUtil.uploadFileToCloudinary(req.files.image1[0])).secure_url;
    }
    if (req.files?.image2) {
      updateData.imageURL2 = (await cloudinaryUtil.uploadFileToCloudinary(req.files.image2[0])).secure_url;
    }
    if (req.files?.image3) {
      updateData.imageURL3 = (await cloudinaryUtil.uploadFileToCloudinary(req.files.image3[0])).secure_url;
    }

    // Log final update data
    console.log("Final update data:", updateData);

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product", error: err.message });
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

// Get latest products (limit to 10)
const getLatestProducts = async (req, res) => {
  try {
    const products = await productModel.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(8) // Limit to 10 products
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "Latest products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching latest products:", err);
    res.status(500).json({ 
      message: "Failed to fetch latest products", 
      error: err.message 
    });
  }
};

// Get best seller products
const getBestSellers = async (req, res) => {
  try {
    const products = await productModel.find({ bestSeller: true })
      .limit(8) // Limit to 8 products
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "Best seller products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching best seller products:", err);
    res.status(500).json({ 
      message: "Failed to fetch best seller products", 
      error: err.message 
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsBySeller, // Updated method name to match the route
  updateProduct,
  getLatestProducts,
  deleteProduct,
  getBestSellers
};