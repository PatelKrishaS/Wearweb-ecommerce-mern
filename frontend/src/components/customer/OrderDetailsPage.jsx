import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/order/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to load order details');
        navigate('/customer/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!order) {
    return <div className="alert alert-danger">Order not found</div>;
  }

  return (
    <div className="container my-5">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h2 className="mb-0">Order #: {order._id.slice(-6).toUpperCase()}</h2>
        </div>
        
        <div className="card-body">
          {/* Order Summary */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex mb-2">
                <span className="text-muted col-5">Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="d-flex mb-2">
                <span className="text-muted col-5">Status:</span>
                <span className={`badge ${order.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex mb-2">
                <span className="text-muted col-5">Payment:</span>
                <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
              </div>
              <div className="d-flex mb-2">
                <span className="text-muted col-5">Total:</span>
                <span className="fw-bold">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <h5 className="mb-3">Products</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '40%' }}>Product</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Size</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item) => (
                  <tr key={item.productId._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image || item.productId.imageURL1} 
                          alt={item.productName} 
                          width="60" 
                          className="me-3 rounded border"
                        />
                        <div>
                            <h6 className="mb-1">
                                {item.productName || item.productId?.name || 'Product'}
                            </h6>
                            <small className="text-muted">
                                SKU: {item.productId?._id.slice(-4) || 'N/A'}
                            </small>
                            </div>
                      </div>
                    </td>
                    <td className="text-end">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">{item.size || 'N/A'}</td>
                    <td className="text-end fw-bold">₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address */}
<div className="mt-5">
  <h5 className="mb-3">Shipping Address</h5>
  <div className="card p-3 bg-light">
    {order.shippingAddress && (
      <>
        <p className="mb-1 fw-bold">{order.shippingAddress.title}</p>
        <p className="mb-1">
          {[
            order.shippingAddress.unitName,
            order.shippingAddress.street,
            order.shippingAddress.landMark
          ].filter(Boolean).join(', ')}
        </p>
        <p className="mb-1">
          {order.shippingAddress.addressDetail}
        </p>
        <p className="mb-0">
          {[
            order.shippingAddress.cityId?.cityName,
            order.shippingAddress.stateId?.stateName,
            order.shippingAddress.zipCode
          ].filter(Boolean).join(', ')}
        </p>
      </>
    )}
  </div>
</div>

          {/* Actions */}
          <div className="mt-4 d-flex justify-content-between">
            <button 
              onClick={() => navigate('/customer/orders')}
              className="btn btn-outline-secondary px-4"
            >
              ← Back to Orders
            </button>
            {order.status === 'Processing' && (
              <button 
                className="btn btn-danger px-4"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};