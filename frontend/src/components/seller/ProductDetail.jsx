import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';


export const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [product, setProduct] = useState(null); // Stores product details
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode

  // Fetch product details by ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`/product/getProductById/${id}`);
        setProduct(res.data.data); // Set product details
        // Set form default values
        setValue("name", res.data.data.name);
        setValue("description", res.data.data.description);
        setValue("baseprice", res.data.data.baseprice);
        setValue("offerprice", res.data.data.offerprice);
        setValue("offerPercentage", res.data.data.offerPercentage);
        setValue("size", res.data.data.size);
        setValue("color", res.data.data.color);
        setValue("material", res.data.data.material);
        setValue("stockQuantity", res.data.data.stockQuantity);
        setValue("categoryId", res.data.data.categoryId);
        setValue("subCategoryId", res.data.data.subCategoryId);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProductDetails();
  }, [id, setValue]);

  // Handle form submission for updating the product
  const submitHandler = async (data) => {
    try {
      const res = await axios.put(`/product/update/${id}`, data);
      console.log("Product updated:", res.data);
        toast.success('Product updated successfully!', {
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
      setIsEditing(false); // Exit edit mode
      navigate(`/seller/store-management/product/${id}`); 
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product");
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading state while fetching product details
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Product Details</h2>

            {/* Display product details */}
            {!isEditing ? (
              <div>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Base Price:</strong> ${product.baseprice}</p>
                <p><strong>Offer Price:</strong> ${product.offerprice}</p>
                <p><strong>Offer Percentage:</strong> {product.offerPercentage}%</p>
                <p><strong>Size:</strong> {product.size}</p>
                <p><strong>Color:</strong> {product.color}</p>
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Stock Quantity:</strong> {product.stockQuantity}</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {product.imageURL1 && (
                    <img
                      src={product.imageURL1}
                      alt="Product Image 1"
                      style={{ height: 100, width: 100, borderRadius: "5px" }}
                    />
                  )}
                  {product.imageURL2 && (
                    <img
                      src={product.imageURL2}
                      alt="Product Image 2"
                      style={{ height: 100, width: 100, borderRadius: "5px" }}
                    />
                  )}
                  {product.imageURL3 && (
                    <img
                      src={product.imageURL3}
                      alt="Product Image 3"
                      style={{ height: 100, width: 100, borderRadius: "5px" }}
                    />
                  )}
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setIsEditing(true)} // Enter edit mode
                >
                  Edit Product
                </button>
              </div>
            ) : (
              // Edit form
              <form onSubmit={handleSubmit(submitHandler)}>
                {/* Product Name */}
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Product name is required" })}
                    className="form-control"
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    className="form-control"
                    rows="3"
                  />
                </div>

                {/* Base Price */}
                <div className="form-group">
                  <label>Base Price</label>
                  <input
                    type="number"
                    {...register("baseprice", { required: "Base price is required" })}
                    className="form-control"
                  />
                </div>

                {/* Offer Price */}
                <div className="form-group">
                  <label>Offer Price</label>
                  <input
                    type="number"
                    {...register("offerprice")}
                    className="form-control"
                  />
                </div>

                {/* Offer Percentage */}
                <div className="form-group">
                  <label>Offer Percentage</label>
                  <input
                    type="number"
                    {...register("offerPercentage")}
                    className="form-control"
                  />
                </div>

                {/* Size */}
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    {...register("size")}
                    className="form-control"
                  />
                </div>

                {/* Color */}
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    {...register("color")}
                    className="form-control"
                  />
                </div>

                {/* Material */}
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    {...register("material")}
                    className="form-control"
                  />
                </div>

                {/* Stock Quantity */}
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    {...register("stockQuantity", { required: "Stock quantity is required" })}
                    className="form-control"
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-success w-100 mt-3">
                  Update Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => setIsEditing(false)} // Cancel edit mode
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};