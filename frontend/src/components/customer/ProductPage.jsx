import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/getProductById/${id}`);
        setProduct(response.data.data);
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

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
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
                className="img-fluid h-100 object-fit-contain "
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

            {/* Product Meta */}
            <div className="mb-4">
              <div className="row g-3">
                {product.color && (
                  <div className="col-md-6">
                    <h6 className="text-muted">Color</h6>
                    <p>{product.color}</p>
                  </div>
                )}
                {product.material && (
                  <div className="col-md-6">
                    <h6 className="text-muted">Material</h6>
                    <p>{product.material}</p>
                  </div>
                )}
                {product.size && (
                  <div className="col-md-6">
                    <h6 className="text-muted">Size</h6>
                    <p>{product.size}</p>
                  </div>
                )}
                <div className="col-md-6">
                  <h6 className="text-muted">Availability</h6>
                  <p>{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="mb-2">Description</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-primary px-4 py-2">
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary px-4 py-2">
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};