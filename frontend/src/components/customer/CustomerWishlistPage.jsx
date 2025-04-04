import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const CustomerWishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  // Fetch wishlist data
  const fetchWishlist = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/wishlist/user/${userId}`);
      setWishlist(response.data.data);
    } catch (err) {
      setError(err.message);
      // If wishlist doesn't exist, create one
      if (err.response?.status === 404) {
        try {
          await axios.post('http://localhost:3000/wishlist/create', { userId });
          fetchWishlist(); // Fetch again after creation
        } catch (createErr) {
          setError(createErr.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/wishlist/user/${userId}/item/${productId}`);
      toast.success('Removed from wishlist');
      fetchWishlist(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  // Move item to cart
  const moveToCart = async (product) => {
    try {
      await axios.post(`http://localhost:3000/cart/user/${userId}/add`, {
        productId: product._id,
        quantity: 1,
        price: product.offerprice || product.baseprice,
        image: product.imageURL1,
        name: product.name
      });
      await removeFromWishlist(product._id);
      toast.success('Moved to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move to cart');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  if (loading) return <div className="text-center py-5">Loading wishlist...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Your wishlist is empty</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/customer/collection')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white">
              <h4 className="mb-0">Your Wishlist ({wishlist.items.length} items)</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {wishlist.items.map((item) => (
                  <div key={item._id} className="col-md-4 col-lg-3 mb-4">
                    <div className="card h-100">
                      <Link to={`/customer/getProductById/${item.productId._id}`}>
                        <img
                          src={item.productId.imageURL1}
                          className="card-img-top"
                          alt={item.productId.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link to={`/customer/getProductById/${item.productId._id}`}>
                            {item.productId.name}
                          </Link>
                        </h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-danger fw-bold">
                            ₹{item.productId.offerprice || item.productId.baseprice}
                          </span>
                          {item.productId.offerprice && (
                            <small className="text-muted text-decoration-line-through">
                              ₹{item.productId.baseprice}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="card-footer bg-white d-flex justify-content-between">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromWishlist(item.productId._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => moveToCart(item.productId)}
                        >
                          <i className="fas fa-cart-plus me-1"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};