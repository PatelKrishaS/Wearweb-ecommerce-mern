import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Title } from '../customer/Title';

export const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const sellerId = localStorage.getItem('id');
      
      if (!sellerId) {
        toast.error('Please login to view orders');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3000/order/seller/${sellerId}`);
      
      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data?.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await axios.patch(`http://localhost:3000/order/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row text-center display-4">
                        <div className="col-12 ">
                          <Title text1="ORDERS" text2="MANAGEMENT" />
                        </div>
                      </div> 

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orders found</h4>
          <p>You don't have any orders yet.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={fetchOrders}
          >
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '120px',textAlign:'center' }}>Order #</th>
                    <th style={{ width: '150px',textAlign:'center' }}>Customer</th>
                    <th style={{ width: '200px',textAlign:'center' }}>Items</th>
                    {/* <th style={{ width: '120px' }}>Date</th> */}
                    <th style={{ width: '100px' ,textAlign:'center'}}>Total</th>
                    <th style={{ width: '100px' ,textAlign:'center'}}>Payment</th>
                    <th style={{ width: '100px' ,textAlign:'center'}}>Status</th>
                    <th style={{ width: '100px',textAlign:'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody style={{textAlign:'center'}}>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="align-middle">
                        <div className="fw-semibold small">ORD-{order._id.slice(-6).toUpperCase()}</div>
                        <div className="text-muted small">{formatDate(order.createdAt)}</div>
                      </td>
                      
                      <td className="align-middle">
                        <div className="fw-medium">{order.userId?.name || 'Customer'}</div>
                        {/* <div className="text-muted small">
                          {order.shippingAddress?.phoneNumber || 'No phone'}
                        </div> */}
                      </td>
                      
                      <td className="align-middle">
                        <div className="d-flex flex-column">
                          {order.products.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="mb-1">
                              <div className="text-truncate" style={{ maxWidth: '180px' }}>
                                {product.productName || 'Product'}
                              </div>
                              {/* <div className="d-flex justify-content-between small">
                                <span>Qty: {product.quantity}</span>
                                <span>${(product.unitPrice * product.quantity).toFixed(2)}</span>
                              </div> */}
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <div className="text-muted small">
                              +{order.products.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* <td className="align-middle small">
                        {formatDate(order.createdAt)}
                      </td> */}
                      
                      <td className="align-middle fw-bold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      
                      <td className="align-middle">
                        <span className={`badge ${order.paymentMethod === 'cod' 
                          ? 'bg-warning text-dark' 
                          : 'bg-success'}`}>
                          {order.paymentMethod === 'cod' ? 'COD' : 'Paid'}
                        </span>
                      </td>
                      
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <select
                            className={`form-select form-select-sm ${updatingStatus === order._id ? 'disabled' : ''}`}
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={updatingStatus === order._id}
                            style={{ minWidth: '120px' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {updatingStatus === order._id && (
                            <div className="spinner-border spinner-border-sm ms-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="align-middle">
                        <button
                          className="btn btn-primary" 
                          onClick={() => navigate(`/seller/store-management/order-detail/${order._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};