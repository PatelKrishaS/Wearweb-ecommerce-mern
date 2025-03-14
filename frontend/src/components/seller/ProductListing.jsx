import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';

export const ProductListing = () => {
  const [categories, setCategories] = useState([]); // Stores all categories
  const [subcategories, setSubcategories] = useState([]); // Stores subcategories for the selected category
  const [showForm, setShowForm] = useState(false); // Toggles the add product form
  const [products, setProducts] = useState([]); // Stores the list of products

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/category/categories");
      setCategories(res.data.data); // Assuming the API returns { data: [...] }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch subcategories for the selected category
  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const res = await axios.get(`/subcategory/getsubcategorybycategory/${categoryId}`);
      console.log("Subcategories fetched:", res.data.data); // Log the response
      setSubcategories(res.data.data); // Update the state
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
    }
  };

  // Fetch products for the current user
  const fetchProducts = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const res = await axios.get(`/product/user/${userId}`);
      setProducts(res.data.data); // Assuming the API returns { data: [...] }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Handle form submission for adding a new product
  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      // Prepare the payload for the product
      const payload = {
        sellerId: userId,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        name: data.name,
        description: data.description,
        baseprice: data.baseprice,
        offerprice: data.offerprice,
        offerPercentage: data.offerPercentage,
        size: data.size,
        color: data.color,
        material: data.material,
        stockQuantity: data.stockQuantity,
      };

      console.log("Data being sent:", payload); // Log the payload

      const res = await axios.post("/product/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response from server:", res.data); // Log the response

      reset();
      setShowForm(false);
      toast.success('Product added successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // Refresh the list of products after adding a new one
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err.response?.data || err.message); // Log the error
      alert("Failed to add product");
    }
  };

  return (
    <div className="container">
      <h1>Product Listing</h1>

      {/* Add Product Button */}
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Product"}
      </button>

      {/* Add Product Form (Conditionally Rendered) */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Product</h5> <br />
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* Name Input */}
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Product name is required" })}
                  className="form-control"
                />
                {errors.name && <span className="text-danger">{errors.name.message}</span>}
              </div>

              {/* Description Input */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  className="form-control"
                  rows="3"
                />
                {errors.description && <span className="text-danger">{errors.description.message}</span>}
              </div>

              {/* Base Price Input */}
              <div className="form-group">
                <label>Base Price</label>
                <input
                  type="number"
                  {...register("baseprice", { required: "Base price is required" })}
                  className="form-control"
                />
                {errors.baseprice && <span className="text-danger">{errors.baseprice.message}</span>}
              </div>

              {/* Offer Price Input */}
              <div className="form-group">
                <label>Offer Price</label>
                <input
                  type="number"
                  {...register("offerprice")}
                  className="form-control"
                />
              </div>

              {/* Offer Percentage Input */}
              <div className="form-group">
                <label>Offer Percentage</label>
                <input
                  type="number"
                  {...register("offerPercentage")}
                  className="form-control"
                />
              </div>

              {/* Size Input */}
              <div className="form-group">
                <label>Size</label>
                <input
                  type="text"
                  {...register("size")}
                  className="form-control"
                />
              </div>

              {/* Color Input */}
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  {...register("color")}
                  className="form-control"
                />
              </div>

              {/* Material Input */}
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  {...register("material")}
                  className="form-control"
                />
              </div>

              {/* Stock Quantity Input */}
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  {...register("stockQuantity", { required: "Stock quantity is required" })}
                  className="form-control"
                />
                {errors.stockQuantity && <span className="text-danger">{errors.stockQuantity.message}</span>}
              </div>

              {/* Category Dropdown */}
              <div className="form-group">
                <label>Category</label>
                <select
                  {...register("categoryId", { required: "Category is required" })}
                  className="form-control"
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    fetchSubcategoriesByCategory(categoryId);
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="text-danger">{errors.categoryId.message}</span>}
              </div>

              {/* Subcategory Dropdown */}
              <div className="form-group">
                <label>Subcategory</label>
                <select
                  {...register("subCategoryId", { required: "Subcategory is required" })}
                  className="form-control"
                  disabled={!subcategories.length}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.subCategoryName}
                    </option>
                  ))}
                </select>
                {errors.subCategoryId && <span className="text-danger">{errors.subCategoryId.message}</span>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-success">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Products
      <div className="mt-4">
        <h3>Your Products</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="list-group">
            {products.map((product) => (
              <div key={product._id} className="list-group-item">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
                <p>Base Price: ${product.baseprice}</p>
                <p>Stock Quantity: {product.stockQuantity}</p>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};