import React, { useEffect, useState } from 'react'
import { Title } from './Title'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get('/product/latest') // You'll need to create this endpoint
        setLatestProducts(res.data.data)
      } catch (err) {
        console.error("Failed to fetch latest products:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLatestProducts()
  }, [])
  

  return (
    <div className="my-5"> 
      <div className="text-center py-4 display-4">
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className="w-75 mx-auto small text-secondary">
          Discover our newest arrivals - fresh styles added just for you
        </p>
      </div>
      
      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {latestProducts.map((product) => (
              <div key={product._id} className="col">
                <div className="card h-100 border-0 shadow-sm">
                  <Link 
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-dark"
                  >
                    {product.imageURL1 && (
                      <img 
                        src={product.imageURL1} 
                        className="card-img-top p-3" 
                        alt={product.name}
                        style={{ height: '250px', objectFit: 'contain' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-danger fw-bold">
                          ${product.offerprice || product.baseprice}
                          {product.offerprice && (
                            <small className="text-muted text-decoration-line-through ms-2">
                              ${product.baseprice}
                            </small>
                          )}
                        </span>
                        {product.offerPercentage && (
                          <span className="badge bg-success">
                            {product.offerPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
