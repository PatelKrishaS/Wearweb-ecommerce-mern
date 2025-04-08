import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { Title } from '../customer/Title';


export const ProductListing = () => {
  const [categories, setCategories] = useState([]); // Stores all categories
  const [subcategories, setSubcategories] = useState([]); // Stores subcategories for the selected category
  const [showForm, setShowForm] = useState(false); // Toggles the add product form
  const [products, setProducts] = useState([]); // Stores the list of products
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
  }); // Stores uploaded image files

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

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      sizes: {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
      }
    }
  });

  // Handle file input changes
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setImageFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  // Handle form submission for adding a new product
  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      // Prepare FormData for file uploads
      const formData = new FormData();
      formData.append("sellerId", userId);
      formData.append("categoryId", data.categoryId);
      formData.append("subCategoryId", data.subCategoryId);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("baseprice", data.baseprice);
      formData.append("offerprice", data.offerprice);
      formData.append("offerPercentage", data.offerPercentage);
      // formData.append("size", data.size);
      formData.append("color", data.color);
      formData.append("material", data.material);
      formData.append("stockQuantity", data.stockQuantity);

      formData.append("hasSizes", data.hasSizes ? "true" : "false");
      formData.append("bestSeller", data.bestSeller ? "true" : "false");
    
      if (data.hasSizes) {
        const selectedSizes = data.sizes 
          ? Object.entries(data.sizes)
              .filter(([_, isChecked]) => isChecked)
              .map(([size]) => size)
          : [];
        
        selectedSizes.forEach(size => formData.append("sizes", size));
      } else {
        formData.append("sizes", "none");
      }

      // Append image files if they exist
      if (imageFiles.image1) formData.append("image1", imageFiles.image1);
      if (imageFiles.image2) formData.append("image2", imageFiles.image2);
      if (imageFiles.image3) formData.append("image3", imageFiles.image3);

      console.log("Data being sent:", formData); // Log the payload

      const res = await axios.post("/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      console.log("Response from server:", res.data); // Log the response

      reset();
      setShowForm(false);
      setImageFiles({ image1: null, image2: null, image3: null }); // Clear uploaded files
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
        <div className="row text-center display-4">
                  <div className="col-12 ">
                    <Title text1="PRODUCT" text2="LISTING" />
                  </div>
                </div> 
      {/* Add Product Button */}
      <div className="d-flex justify-content-center">

      <button className="btn btn-primary mb-3 " onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Product"}
      </button>
      </div>


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



              {/* Size Input
              <div className="form-group">
                <label>Size</label>
                <input
                  type="text"
                  {...register("size")}
                  className="form-control"
                />
              </div> */}

           {/* Has Sizes */}
              <div className="form-group" style={{ margin: '15px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    {...register("hasSizes")}
                    style={{ marginRight: '8px' }}
                  />
                  This product comes in multiple sizes
                </label>
              </div>

              {/* Conditionally show sizes checkboxes */}
              {watch("hasSizes") && (
                <div className="form-group">
                  <label>Available Sizes</label>
                  <div className="d-flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map(size => (
                      <div key={size} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`size-${size}`}
                          {...register(`sizes.${size}`)}
                        />
                        <label className="form-check-label" htmlFor={`size-${size}`}>
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Seller */}
              <div className="form-group" style={{ margin: '15px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    {...register("bestSeller")}
                    style={{ marginRight: '8px' }}
                  />
                  This is a best seller
                </label>
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

              {/* Image Uploads */}
              <div className="form-group">
                <label>Image 1</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "image1")}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Image 2</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "image2")}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Image 3</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "image3")}
                  className="form-control"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-success">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};