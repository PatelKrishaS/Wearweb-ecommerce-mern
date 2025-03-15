import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustLoder } from '../common/CustLoader'; // Assuming you have a custom loader component

export const ViewMyProducts = () => {
  const [products, setProducts] = useState([]); // Stores the list of products
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // Fetch products for the current user
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const sellerId = localStorage.getItem("id"); // Get sellerId from localStorage
      if (!sellerId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const res = await axios.get(`/product/user/${sellerId}`);
      console.log("Products fetched:", res.data); // Log the response
      setProducts(res.data.data); // Update the state
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {isLoading && <CustLoder />} {/* Show loader while fetching data */}
      <h1>MY PRODUCTS</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {products?.map((product) => (
          <Link
            key={product._id}
            to={`/seller/store-management/product/${product._id}`} // Navigate to product detail page
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                width: "300px",
                height:"532px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ${product.offerprice} <del>(${product.baseprice})</del>
              </p>
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};