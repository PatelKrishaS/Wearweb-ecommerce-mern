import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from './Title';

export const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No related products found.</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="text-center py-4">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
        <p className="w-75 mx-auto small text-secondary">
          You might also like these similar products
        </p>
      </div>
      
      <div className="container px-3">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div key={product._id} className="col d-flex">
              <Link 
               to={`/customer/getProductById/${product._id}`}
               onClick={() => window.scrollTo(0, 0)}
                className="text-decoration-none text-dark w-100"
              >
                <div className="card h-100 border-0 shadow-sm">
                  {/* Discount badge */}
                  {product.offerPercentage && (
                    <span className="badge bg-success position-absolute top-0 end-0 m-2">
                      {product.offerPercentage}% OFF
                    </span>
                  )}
                  
                  {/* Product image */}
                  <div className="flex-grow-1 d-flex align-items-center p-3" style={{ minHeight: '250px' }}>
                    <img 
                      src={product.imageURL1} 
                      className="card-img-top img-fluid mx-auto" 
                      alt={product.name}
                      style={{ 
                        maxHeight: '220px',
                        width: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="card-body p-3">
                    <div className="product-name" style={{ minHeight: '72px' }}>
                      {product.name}
                    </div>
                    
                    <div className="price-section mt-2">
                      <div className="d-flex align-items-baseline">
                        <span className="text-danger fw-bold fs-5">
                          ₹{product.offerprice || product.baseprice}
                        </span>
                        {product.offerprice && (
                          <small className="text-muted text-decoration-line-through ms-2 fs-6">
                            ₹{product.baseprice}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};