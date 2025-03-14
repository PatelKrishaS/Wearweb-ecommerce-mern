import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const { register, handleSubmit, reset } = useForm();

  // Fetch product details by ID
  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`/product/getProductById/${id}`);
      console.log(res.data); // API response
      reset(res.data.data); // Set form default values
    } catch (err) {
      console.error("Failed to fetch product details:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Handle form submission
  const submitHandler = async (data) => {
    try {
      const sellerId = localStorage.getItem("id"); // Get sellerId from localStorage
      data.sellerId = sellerId; // Add sellerId to the payload
      delete data._id; // Remove _id from the payload

      console.log("Data being sent:", data); // Log the payload

      const res = await axios.put(`/product/updateProduct/${id}`, data);
      console.log(res.data); // API response
      alert("Product updated successfully");
    } catch (err) {
      console.error("Failed to update product:", err.response?.data || err.message);
      alert("Failed to update product");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">UPDATE PRODUCT</h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: "Product name is required" })}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  {...register("description", { required: "Description is required" })}
                />
              </div>

              {/* Base Price */}
              <div className="mb-3">
                <label className="form-label">Base Price</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("baseprice", { required: "Base price is required" })}
                />
              </div>

              {/* Offer Price */}
              <div className="mb-3">
                <label className="form-label">Offer Price</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("offerprice")}
                />
              </div>

              {/* Offer Percentage */}
              <div className="mb-3">
                <label className="form-label">Offer Percentage</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("offerPercentage")}
                />
              </div>

              {/* Image URLs */}
              <div className="mb-3">
                <label className="form-label">Image URL 1</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("imageURL1")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL 2</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("imageURL2")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL 3</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("imageURL3")}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                Update Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};