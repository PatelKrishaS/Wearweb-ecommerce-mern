// CustomerWishlistPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Title } from './Title';
import { toast } from 'react-toastify';

export const CustomerWishlistPage = () => {
  const { 
    wishlist, 
    loading, 
    error, 
    removeFromWishlist,
    fetchWishlist 
  } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (product) => {
    try {
      await addToCart({
        ...product,
        quantity: 1
      });
      await removeFromWishlist(product._id);
      toast.success('Moved to cart!');
    } catch (err) {
      toast.error('Failed to move to cart');
    }
  };

  if (loading) return <div className="text-center py-5">Loading wishlist...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Your wishlist is empty</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/customer/collection')}
        >
          Browse Products
        </button>
      </div>
    );
  }
  console.log("Wishlist data:", wishlist);


  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <div className="col-12">
                <Title text1="YOUR" text2="WISHLIST" />
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((item) => {
                      const product = item.productId; // Populated product data
                      return (
                        <tr key={item._id || product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={product.imageURL1}
                                alt={product.name}
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                className="me-3"
                              />
                              <div>
                                <h6 className="mb-1">
                                  <Link to={`/product/${product._id}`}>
                                    {product.name}
                                  </Link>
                                </h6>
                                {product.size && <small>Size: {product.size}</small>}
                              </div>
                            </div>
                          </td>
                          <td>
                            ₹{product.offerprice || product.baseprice}
                          </td>
                          <td>
                            {product.stockQuantity > 0 ? (
                              <span className="badge bg-success">In Stock </span>
                            ) : (
                              <span className="badge bg-danger">Out of Stock</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleMoveToCart(product)}
                                disabled={product.stockQuantity <= 0}  // Changed from product.stock to product.stockQuantity
                              >
                                Add to Cart
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromWishlist(product._id)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};