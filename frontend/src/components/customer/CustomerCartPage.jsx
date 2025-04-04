import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Title } from './Title';


export const CustomerCartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === cart?.items?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart?.items?.map(item => item._id) || []);
    }
  };

  const getSelectedSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .filter(item => selectedItems.includes(item._id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
  
    const orderData = {
      products: cart.items
        .filter(item => selectedItems.includes(item._id))
        .map(item => ({
          productId: item.productId._id || item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'One Size',
          image: item.image
        })),
      subtotal: cart.items
        .filter(item => selectedItems.includes(item._id))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  
    navigate('/customer/place-order', { state: { orderData } });
  };

  if (loading) return <div className="text-center py-5">Loading cart...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container my-5 text-center" style={{width:'200px'}}>
        <h3>Your cart is empty</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/customer/collection')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div className="col-12" style={{width:'550px'}}>
                        <Title text1="YOUR" text2="CART" />
              </div>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={clearCart}
                style={{width:'150px'}}
              >
                Clear Cart
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedItems.length === cart.items.length}
                          onChange={selectAllItems}
                        />
                      </th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map(item => (
                      <tr key={item._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleSelectItem(item._id)}
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="me-3"
                            />
                            <div>
                              <h6 className="mb-1">{item.name}</h6>
                              {item.size && <small>Size: {item.size}</small>}
                            </div>
                          </div>
                        </td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </button>
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
          <div className="card">
            <div className="card-header bg-white">
              <div className="col-12" style={{width:'550px'}}>
                  <Title text1="ORDER" text2="SUMMARY" />
                </div>            
              </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({selectedItems.length} items):</span>
                <span>₹{getSelectedSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Delivery Charges:</span>
                <span>₹10.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5>₹{(getSelectedSubtotal() + 10).toFixed(2)}</h5>
              </div>
              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2 py-2"
                onClick={() => navigate('/customer/collection')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};