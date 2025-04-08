import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Title } from '../customer/Title';

export const SellerOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/order/${orderId}`);
      
      if (response.data?.success) {
        setOrder(response.data.data);
      } else {
        toast.error(response.data?.message || 'Failed to load order details');
        navigate('/seller/store-management/order-page');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      navigate('/seller/store-management/order-page');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(`http://localhost:3000/order/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!window.confirm('Are you sure you want to process a refund for this order?')) return;
    
    try {
      setIsProcessingRefund(true);
      const response = await axios.post(`http://localhost:3000/order/${orderId}/refund`);
      
      if (response.data.success) {
        toast.success('Refund processed successfully');
        setOrder(prev => ({ ...prev, status: 'Refunded' }));
      } else {
        toast.error(response.data.message || 'Failed to process refund');
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      toast.error(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateSubtotal = () => {
    if (!order?.products) return 0;
    return order.products.reduce((sum, product) => sum + (product.unitPrice * product.quantity), 0);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-5">
        <h4>Order not found</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/seller/store-management/order-page')}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <Title text1="ORDER" text2="DETAILS" />
          <button 
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => navigate('/seller/store-management/order-page')}
          >
            ← Back to Orders
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order Items</h5>
              <div>
                <span className="me-2">Status:</span>
                <span className={`badge ${
                  order.status === 'Pending' ? 'bg-warning' :
                  order.status === 'Processing' ? 'bg-info' :
                  order.status === 'Shipped' ? 'bg-primary' :
                  order.status === 'Delivered' ? 'bg-success' :
                  order.status === 'Cancelled' || order.status === 'Refunded' ? 'bg-danger' : 'bg-secondary'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Image</th>
                      <th>Product</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <img 
                            src={product.image || product.productId?.imageURL1 || '/placeholder-product.jpg'} 
                            alt={product.productName} 
                            className="img-thumbnail"
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>
                          <div className="fw-semibold">{product.productName || product.productId?.name}</div>
                          {product.size && (
                            <div className="text-muted small">Size: {product.size}</div>
                          )}
                          <div className="text-muted small">SKU: {product.productId?._id.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="text-end align-middle">₹{product.unitPrice.toFixed(2)}</td>
                        <td className="text-center align-middle">{product.quantity}</td>
                        <td className="text-end align-middle fw-bold">
                          ₹{(product.unitPrice * product.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Order Number:</span>
                  <span className="fw-semibold">ORD-{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Payment Method:</span>
                  <span className={`badge ${order.paymentMethod === 'cod' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
              </div>

              <div className="border-top pt-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {order.paymentMethod === 'cod' && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery Charge:</span>
                    <span>₹10.00</span>
                  </div>
                )}
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-top pt-3">
                <div className="mb-3">
                  <label className="form-label">Update Status</label>
                  <div className="d-flex align-items-center">
                    <select
                      className={`form-select ${updatingStatus ? 'disabled' : ''}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(e.target.value)}
                      disabled={updatingStatus || order.status === 'Cancelled' || order.status === 'Refunded'}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {updatingStatus && (
                      <div className="spinner-border spinner-border-sm ms-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>

                {order.paymentMethod !== 'cod' && 
                  (order.status === 'Cancelled' || order.status === 'Refunded') && (
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleProcessRefund}
                    disabled={isProcessingRefund || order.status === 'Refunded'}
                  >
                    {isProcessingRefund ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : order.status === 'Refunded' ? (
                      'Refund Processed'
                    ) : (
                      'Process Refund'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Customer & Shipping</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Customer Information</h6>
                <div className="ps-3">
                <div className="fw-medium">
                {order.user?.name || order.userId?.name || 'Customer'}
                </div>
                {order.userId?.email && (
                <div className="text-muted small">
                    {order.userId.email}
                </div>
                )}
                {order.shippingAddress?.phoneNumber && (
                    <div className="text-muted small">{order.shippingAddress.phoneNumber}</div>
                )}
                </div>
              </div>

              <div>
                <h6>Shipping Address</h6>
                {order.shippingAddress ? (
                  <div className="ps-3">
                    <div className="fw-medium">{order.shippingAddress.title}</div>
                    <div>{order.shippingAddress.unitName}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.landMark}</div>
                    <div>{order.shippingAddress.addressDetail}</div>
                    <div>
                      {order.shippingAddress.cityId?.cityName}, {order.shippingAddress.stateId?.stateName} - {order.shippingAddress.zipCode}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">No shipping address provided</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};