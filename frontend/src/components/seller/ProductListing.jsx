import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const ProductListing = () => {
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Handle form submission
  const submitHandler = async (data) => {
    try {
      const sellerId = localStorage.getItem("id"); // Get sellerId from localStorage
      if (!sellerId) {
        alert("Seller ID not found. Please log in again.");
        return;
      }

      // Prepare the payload
      const payload = {
        sellerId,
        ...data,
      };

      console.log("Data being sent:", payload); // Log the payload

      const res = await axios.post("http://localhost:3000/product/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response from server:", res.data); // Log the response

      reset();
      setShowForm(false);
      alert("Product added successfully");
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
            <h5 className="card-title">Add New Product</h5>
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* Name */}
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Product name is required" })}
                  className="form-control"
                />
                {errors.name && <span className="text-danger">{errors.name.message}</span>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  className="form-control"
                  rows="3"
                />
                {errors.description && <span className="text-danger">{errors.description.message}</span>}
              </div>

              {/* Base Price */}
              <div className="form-group">
                <label>Base Price</label>
                <input
                  type="number"
                  {...register("baseprice", { required: "Base price is required" })}
                  className="form-control"
                />
                {errors.baseprice && <span className="text-danger">{errors.baseprice.message}</span>}
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
                {errors.stockQuantity && <span className="text-danger">{errors.stockQuantity.message}</span>}
              </div>

              {/* Image URLs */}
              <div className="form-group">
                <label>Image URL 1</label>
                <input
                  type="text"
                  {...register("imageURL1", { required: "Image URL 1 is required" })}
                  className="form-control"
                />
                {errors.imageURL1 && <span className="text-danger">{errors.imageURL1.message}</span>}
              </div>

              <div className="form-group">
                <label>Image URL 2</label>
                <input
                  type="text"
                  {...register("imageURL2")}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Image URL 3</label>
                <input
                  type="text"
                  {...register("imageURL3")}
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