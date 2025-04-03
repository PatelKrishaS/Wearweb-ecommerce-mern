import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const OrderConfirmation = () => {
  const { state } = useLocation();

  return (
    <div className="container my-5 text-center">
      <div className="card p-5">
        <h1 className="text-success mb-4">Order Placed Successfully!</h1>
        <i className="fas fa-check-circle text-success mb-4" style={{ fontSize: '5rem' }}></i>
        <h3>Order ID: {state?.orderId}</h3>
        <h4 className="mt-3">Total Amount: ₹{state?.totalAmount}</h4>
        <p className="mt-4">Thank you for your purchase. Your order has been received.</p>
        <Link to="/customer/orders" className="btn btn-primary mt-4">View Your Orders</Link>
      </div>
    </div>
  );
};