import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const OrderConfirmation = () => {
  const { state } = useLocation();
  
  // Generate a more readable order number
  const orderNumber = `ORD-${state?.orderId?.slice(-6).toUpperCase()}`;

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-sm p-4 p-md-5" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body text-center">
          {/* Success Icon */}
          <div className="mb-4">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
          </div>
          
          {/* Title */}
          <h1 className="text-success mb-4 fw-bold">Order Placed Successfully!</h1>
          
          {/* Order Details */}
          <div className="mb-4 p-3 bg-light rounded">
            <h3 className="mb-2">Order Number: <span className="fw-normal">{orderNumber}</span></h3>
            <h4 className="mb-0">Total Amount: <span className="fw-bold">₹{state?.totalAmount?.toFixed(2)}</span></h4>
          </div>
          
          {/* Message */}
          <p className="text-muted mb-4 fs-5">
            Thank you for your purchase. We've sent a confirmation email.
          </p>
          
          {/* Buttons */}
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <Link 
              to="/customer/collection" 
              className="btn btn-outline-primary px-4 py-2 flex-grow-1"
              style={{ minWidth: '200px' }}
            >
              Continue Shopping
            </Link>
            <Link 
              to="/customer/orders" 
              className="btn btn-primary px-4 py-2 flex-grow-1"
              style={{ minWidth: '200px' }}
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};