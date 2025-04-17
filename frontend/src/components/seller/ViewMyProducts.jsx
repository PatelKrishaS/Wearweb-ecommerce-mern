import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustLoder } from '../common/CustLoader';
import { toast } from 'react-toastify';
import { Title } from '../customer/Title';


export const ViewMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track which product is being deleted

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const sellerId = localStorage.getItem("id");
      if (!sellerId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const res = await axios.get(`/product/user/${sellerId}`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product function
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setDeletingId(productId);
    try {
      await axios.delete(`/product/delete/${productId}`);
      toast.success('Product deleted successfully!');
      // Refresh the product list after deletion
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container py-3">
      {isLoading && <CustLoder />}
        <div className="row text-center display-4">
          <div className="col-12">
            <Title text1="VIEW" text2="MY PRODUCTS" />
          </div>
        </div>      
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '80px' }}>Image</th>
              <th style={{ minWidth: '180px' }}>Product</th>
              <th style={{ width: '90px' }} className="text-end pe-2">Price</th>
              <th style={{ width: '80px' }} className="text-center">Stock</th>
              <th style={{ width: '120px' }} className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id}>
                {/* Product Image */}
                <td>
                  <div className="d-flex justify-content-center">
                    {product.imageURL1 ? (
                      <img 
                        src={product.imageURL1} 
                        alt={product.name}
                        className="img-thumbnail"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          padding: '2px'
                        }}
                      />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" 
                        style={{ 
                          width: '60px', 
                          height: '60px',
                          fontSize: '0.8rem'
                        }}>
                        <span className="text-muted">No Image</span>
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Product Details */}
                <td className="small">
                  <Link 
                    to={`/seller/store-management/product/${product._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="fw-semibold" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '1rem',
                      lineHeight: '1.2'
                    }}>
                      {product.name}
                    </div>
                  </Link>
                  <div className="d-flex flex-wrap gap-2">
                    {product.color && (
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.85rem' }}>
                        <span className="fw-medium" style={{ fontSize: '0.85rem' }}>Color: </span>
                        {product.color}
                      </span>
                    )}
                    {product.material && (
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.85rem' }}>
                        <span className="fw-medium" style={{ fontSize: '0.85rem' }}>Material: </span>
                        {product.material}
                      </span>
                    )}
                    {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'none' && (
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.85rem' }}>
                        {product.sizes.length > 2 ? 'Multiple sizes' : product.sizes.join(', ')}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Pricing */}
                <td className="text-end pe-2 small">
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-danger">₹{product.offerprice}</span>
                    {product.offerprice < product.baseprice && (
                      <small className="text-muted text-decoration-line-through">
                        ₹{product.baseprice}
                      </small>
                    )}
                  </div>
                </td>
                
                {/* Stock */}
                <td className="text-center small">
                  <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {product.stockQuantity > 0 ? product.stockQuantity : '0'}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="text-center small">
                  <div className="d-flex justify-content-center gap-1">
                    <Link
                      to={`/seller/store-management/product/${product._id}`}
                      className="btn btn-sm btn-outline-primary py-0 px-2"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      title="Delete"
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="fas fa-trash"></i>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <h5>No products found</h5>
          <p className="small mb-3">You haven't added any products yet.</p>
          <Link to="/seller/store-management/add-product" className="btn btn-sm btn-primary">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};