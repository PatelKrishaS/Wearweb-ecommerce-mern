import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { CustLoder } from '../common/CustLoder'; 

export const ViewMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all products added by the logged-in seller
  const getAllMyProducts = async () => {
    setIsLoading(true);
    try {
      const sellerId = localStorage.getItem("id"); // Get sellerId from localStorage
      const res = await axios.get(`/product/getProductsBySeller/${sellerId}`);
      console.log(res.data); // API response
      setProducts(res.data.data); // Store products in state
    } catch (err) {
      console.error("Failed to fetch products:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllMyProducts();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* {isLoading && <CustLoder />} */}
      <h1>MY PRODUCTS</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {products?.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              width: "300px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
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
            <Link
              to={`/seller/updateProduct/${product._id}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
              }}
            >
              UPDATE
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};