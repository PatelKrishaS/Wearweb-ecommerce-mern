import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Title } from './Title';
import { toast } from 'react-toastify';
import '../../assets/css/custom.css';

export const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('id');
      
      if (!userId) {
        toast.error('Please login to view orders');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3000/order/user/${userId}`, {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      if (response.status === 404) {
        setOrders([]);
        return;
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }

      // Validate orders data structure
      const validOrders = Array.isArray(response.data.data) 
        ? response.data.data.filter(order => 
            order?._id && 
            order?.products && 
            order?.totalAmount !== undefined
          )
        : [];

      setOrders(validOrders);
      
    } catch (error) {
      console.error('Order fetch error:', error);
      const errorMsg = error.response?.data?.message || 
                     error.message || 
                     'Failed to load orders';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: 'bg-warning text-dark',
      Processing: 'bg-info text-white',
      Shipped: 'bg-primary text-white',
      Delivered: 'bg-success text-white',
      Cancelled: 'bg-danger text-white'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h5>Error Loading Orders</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={fetchOrders}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <Title text1="YOUR" text2="ORDERS" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orders found</h4>
          <p>You haven't placed any orders yet.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '15%' }}>Order #</th>
                    <th style={{ width: '15%' }}>Date</th>
                    <th style={{ width: '15%' }}>Items</th>
                    <th style={{ width: '15%' }}>Total</th>
                    <th style={{ width: '15%' }}>Status</th>
                    <th style={{ width: '25%', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="align-middle">
                        ORD-{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="align-middle">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="align-middle">
                        {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="align-middle">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="align-middle">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="align-middle text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/customer/order-detail-page/${order._id}`)}
                          style={{ minWidth: '120px' }}
                        >
                          View Details
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