import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductContext, useProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext'; 
import { useWishlist } from '../context/WishlistContext';
import { RelatedProducts } from './RelatedProducts';
import { ReviewForm } from './ReviewForm';
import { toast } from 'react-toastify';
// const { relatedProducts, fetchRelatedProducts } = useProductContext();

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const { relatedProducts, fetchRelatedProducts } = useContext(ProductContext);
  const [reviewsUpdated, setReviewsUpdated] = useState(false); 
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  

  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:3000/product/getProductById/${id}`),
          axios.get(`http://localhost:3000/review/product/${id}`)
        ]);
    
        // Process product data
        const productData = productRes.data.data;
        
        // Ensure sizes is always an array (even if empty or undefined)
        const processedSizes = productData.hasSizes 
          ? (productData.sizes || []).filter(size => size && size !== 'none')
          : [];
        
        // Filter out any invalid reviews
        const validReviews = (reviewsRes.data.reviews || []).filter(review => 
          review && 
          review._id && 
          review.rating && 
          (review.userId || review.user)
        );
    
        setProduct({
          ...productData,
          sizes: processedSizes,
          reviews: validReviews,
          reviewCount: reviewsRes.data.count || validReviews.length
        });
    
        if (productData.categoryId) {
          fetchRelatedProducts(productData.categoryId._id || 
                             productData.categoryId);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, reviewsUpdated]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!product) return <div className="text-center py-5">Product not found</div>;

  // Get all available product images
  const productImages = [
    product.imageURL1,
    product.imageURL2,
    product.imageURL3
  ].filter(img => img);

  // Parse available sizes if they exist
  const availableSizes = product.size ? product.size.split(',') : [];

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSizeSelect = (size) => {
    if (product?.sizes?.includes(size)) {
      setSelectedSize(size);
    }
  };


  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    if (product.hasSizes && !selectedSize) {
      alert('Please select a size');
      return;
    }
  
    const cartItem = {
      ...product,
      selectedSize,
      quantity
    };

    addToCart(cartItem);
  };

  
  const handlePlaceOrder = () => {
    if (product.hasSizes && !selectedSize) {
      alert('Please select a size');
      return;
    }
  
    // Calculate amounts without delivery charge (will be added in PlaceOrder)
    const price = product.offerprice || product.baseprice;
    const subtotal = price * quantity;
  
    const orderData = {
      productId: product._id,
      productName: product.name,
      quantity,
      size: product.hasSizes ? selectedSize : 'One Size',
      price,
      image: product.imageURL1,
      subtotal, // Pass subtotal only
      totalAmount: subtotal // Will be recalculated in PlaceOrder
    };
  
    navigate('/customer/place-order', { state: { orderData } });
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-secondary'}`}
        />
      );
    }
    return stars;
  };

  const onReviewSubmit = async (newReview) => {
    try {
      // Validate the new review before adding
      if (!newReview || !newReview._id || !newReview.rating) {
        console.error('Invalid review format:', newReview);
        return;
      }
  
      setProduct(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          reviewCount: (prev.reviewCount || 0) + 1,
          reviews: [{
            ...newReview,
            userId: newReview.userId || { name: 'You' } // Ensure userId exists
          }, ...(prev.reviews || [])]
        };
      });
  
      // Force refresh from server to ensure consistency
      const reviewsResponse = await axios.get(`http://localhost:3000/review/product/${id}`);
      setProduct(prev => ({
        ...prev,
        reviews: reviewsResponse.data.reviews || []
      }));
    } catch (err) {
      console.error("Error updating reviews:", err);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Product Images Section */}
        <div className="col-lg-6">
          <div className="border rounded-3 p-3">
            {/* Main Image */}
            <div className="text-center mb-3" style={{ height: '400px' }}>
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="img-fluid h-100 object-fit-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="d-flex justify-content-center gap-2">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => handleImageChange(index)}
                    style={{
                      width: '60px',
                      height: '60px',
                      cursor: 'pointer',
                      border: currentImageIndex === index ? '2px solid #0d6efd' : '1px solid #dee2e6'
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="img-fluid h-100 w-100 object-fit-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="col-lg-6">
          <div className="product-details">
            <h1 className="mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="d-flex align-items-center mb-2">
              <div className="me-2">
                {renderRatingStars(product.reviewCount > 0 ? product.averageRating : 0)}
              </div>
              <small className="text-muted">({product.reviewCount || 0} reviews)</small>
            </div>
            
            {/* Price Section */}
            <div className="d-flex align-items-center mb-4">
              {product.offerPercentage && (
                <span className="badge bg-success me-2">
                  {product.offerPercentage}% OFF
                </span>
              )}
              <span className="text-danger fw-bold fs-3 me-2">
                ₹{product.offerprice || product.baseprice}
              </span>
              {product.offerprice && (
                <small className="text-muted text-decoration-line-through fs-5">
                  ₹{product.baseprice}
                </small>
              )}
            </div>

            {/* Size Selection */}

          {product.hasSizes && product.sizes && product.sizes.length > 0 ? (
            <div className="mb-4">
              <h6 className="mb-2">Select Size</h6>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn btn-outline-secondary ${selectedSize === size ? 'active' : ''}`}
                    style={{
                      width: '50px',
                      border: selectedSize === size ? '2px solid #0d6efd' : '1px solid #dee2e6'
                    }}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <small className="text-muted mt-2 d-block">
                  Selected: {selectedSize}
                </small>
              )}
            </div>
          ) : (
            !product.hasSizes && (
              <div className="mb-4">
                <h6 className="mb-2">Size</h6>
                <p className="text-muted">One Size</p>
              </div>
            )
          )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <h6 className="mb-2">Quantity</h6>
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary px-3"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{width:'50px'}}
                >
                  -
                </button>
                <span className="mx-3">{quantity}</span>
                <button 
                  className="btn btn-outline-secondary px-3"
                  onClick={() => handleQuantityChange(1)}
                  style={{width:'50px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-4 mb-5">
            <button 
              className="btn btn-primary px-4 py-2" 
              style={{width:'200px'}}
              disabled={product.hasSizes && !selectedSize}
              onClick={handleAddToCart}  // Connect the handler here
            >
              Add to Cart
            </button>

              {/* Order Now Button */}
              <button 
                className="btn btn-success px-4 py-2" 
                style={{width:'200px'}}
                onClick={handlePlaceOrder}
                disabled={isOrdering || (product.hasSizes && !selectedSize)}
              >
                {isOrdering ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Ordering...
                  </>
                ) : (
                  'Order Now'
                )}
              </button>

              <button 
                className={`btn px-4 py-2 ${isWishlisted ? 'btn-danger' : 'btn-outline-secondary'}`}
                style={{width:'200px'}}
                onClick={toggleWishlist}
              >
                <i className={`far fa-heart me-2 ${isWishlisted ? 'fas' : 'far'}`}></i>
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {orderSuccess && (
              <div className="alert alert-success mt-3">
                Order placed successfully! 
                <Link to="/customer/orders" className="ms-2">View your orders</Link>
              </div>
            )}

            
          </div>
        </div>
      </div>

      {/* Description/Reviews Tabs */}
      {/* Description/Reviews Tabs */}
<div className="mb-5">
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
        onClick={() => setActiveTab('description')}
      >
        Description
      </button>
    </li>
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
        onClick={() => setActiveTab('reviews')}
      >
        Reviews ({product.reviewCount || 0})
      </button>
    </li>
  </ul>
  <div className="tab-content p-3 border border-top-0">
    {activeTab === 'description' ? (
      <div className="tab-pane active">
        <p className="text-muted">{product.description}</p>
        {product.specifications && (
          <div className="mt-3">
            <h6>Specifications</h6>
            <ul className="list-unstyled">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="mb-1">
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div className="tab-pane active">
  {/* Add Review Form - only for logged in users */}
  {localStorage.getItem('id') && (
    <ReviewForm 
      productId={id} 
      onReviewSubmit={onReviewSubmit}
    />
  )}
  
  {/* Reviews list */}
  {product.reviewCount > 0 ? (
    product.reviews?.length > 0 ? (
      product.reviews.map((review) => {
        // Skip if review is undefined
        if (!review) return null;
        
        // Safely get user name
        const userName = review.userId?.name || 
                        (typeof review.userId === 'object' ? review.userId?.name : 'Anonymous');
        
        // Skip if review is invalid
        if (!review._id || !review.rating) return null;

        return (
          <div key={review._id} className="mb-3 pb-3 border-bottom">
            <div className="d-flex justify-content-between">
              <h6>{userName}</h6>
              <small className="text-muted">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
              </small>
            </div>
            <div className="mb-2">
              {renderRatingStars(review.rating)}
            </div>
            <p>{review.comment || ''}</p>
          </div>
        );
      })
    ) : (
      <div className="alert alert-warning">
        Could not load reviews (expected {product.reviewCount})
      </div>
    )
  ) : (
    <p>No reviews yet. {!localStorage.getItem('id') && "Login to be the first to review!"}</p>
  )}
</div>
    )}
  </div>
</div>

      {/* Related Products Section */}
      <div className="row mt-5">
        <div className="col-12">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};