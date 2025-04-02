import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductContext, useProductContext } from '../context/ProductContext'; 
import { RelatedProducts } from './RelatedProducts';
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/product/getProductById/${id}`);
        setProduct(response.data.data);
        
        // Use categoryId instead of category
        if (response.data.data.categoryId) {
          fetchRelatedProducts(response.data.data.categoryId._id || response.data.data.categoryId);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);

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
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
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
                {renderRatingStars(product.averageRating || 0)}
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
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-2">Select Size</h6>
                <div className="d-flex flex-wrap gap-2">
                  {availableSizes.map((size, index) => (
                    <div key={index} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="productSize"
                        id={`size-${index}`}
                        checked={selectedSize === size}
                        onChange={() => handleSizeSelect(size)}
                      />
                      <label className="form-check-label" htmlFor={`size-${index}`}>
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
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
              <button className="btn btn-primary px-4 py-2">
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary px-4 py-2">
                <i className="far fa-heart me-2"></i> Wishlist
              </button>
            </div>

            
          </div>
        </div>
      </div>

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
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="mb-3 pb-3 border-bottom">
                          <div className="d-flex justify-content-between">
                            <h6>{review.userName}</h6>
                            <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                          </div>
                          <div className="mb-2">
                            {renderRatingStars(review.rating)}
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

      {/* Related Products Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Related Products</h3>
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};