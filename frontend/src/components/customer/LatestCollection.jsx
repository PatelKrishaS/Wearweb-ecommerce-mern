import React, { useEffect, useState } from 'react';
import { Title } from './Title';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get('/product/latest');
        setLatestProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch latest products:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestProducts();
  }, []);

  return (
    <div className="my-5"> 
      <div className="text-center py-4 display-4">
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className="w-75 mx-auto small text-secondary">
          Discover our newest arrivals - fresh styles added just for you
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container px-3">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {latestProducts.map((product) => (
              <div key={product._id} className="col d-flex">
                {/* The entire card is wrapped in a Link */}
                <Link 
                  to={`/customer/getProductById/${product._id}`} // This should match your route
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
                        className="card-img-top img-fluid mx-auto " 
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
                        {product.name.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                      
                      <div className="price-section mt-2">
                        <div className="d-flex align-items-baseline">
                          <span className="text-danger fw-bold fs-5">
                            ₹{product.offerprice || product.baseprice}
                          </span>
                          {product.offerprice && (
                            <small className="text-muted text-decoration-line-through ms-2 fs-6">
                              ₹ {product.baseprice}
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
      )}
    </div>
  );
};