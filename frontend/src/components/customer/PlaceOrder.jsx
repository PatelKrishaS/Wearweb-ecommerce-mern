import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Title } from './Title';
import { toast } from 'react-toastify';

export const PlaceOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    products: [],
    subtotal: 0,
    totalAmount: 0
  });

  // Initialize order data from location state or fallback
  useEffect(() => {
    if (state?.orderData) {
      setOrderData({
        products: Array.isArray(state.orderData.products) 
          ? state.orderData.products 
          : [state.orderData],
        subtotal: state.orderData.subtotal || 0,
        totalAmount: calculateTotalAmount(
          state.orderData.subtotal || 0, 
          'cod'
        )
      });
    }
  }, [state]);

  // Calculate total including delivery charge
  const calculateTotalAmount = (subtotal, method) => {
    return method === 'cod' ? subtotal + 10 : subtotal;
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('id');
        if (!userId) {
          navigate('/login');
          return;
        }

        const [addressRes, profileRes] = await Promise.all([
          axios.get(`http://localhost:3000/user-address/user/${userId}`),
          axios.get(`http://localhost:3000/user/${userId}`)
        ]);

        setUserAddresses(addressRes.data.data || []);
        setUserProfile(profileRes.data.data);
        
        if (!profileRes.data.data?.phoneNumber || !profileRes.data.data?.email) {
          navigate('/customer/profile', { state: { fromOrder: true } });
          return;
        }

        if (addressRes.data.data?.length === 0) {
          navigate('/customer/address', { state: { fromOrder: true } });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user data');
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  // Update total when payment method changes
  useEffect(() => {
    setOrderData(prev => ({
      ...prev,
      totalAmount: calculateTotalAmount(prev.subtotal, paymentMethod)
    }));
  }, [paymentMethod]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      const orderPayload = {
        userId: localStorage.getItem('id'),
        products: orderData.products.map(product => ({
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
          size: product.size,
          image: product.image
        })),
        shippingAddress: selectedAddress._id,
        paymentMethod,
        totalAmount: orderData.totalAmount
      };

      const response = await axios.post('http://localhost:3000/order/create', orderPayload);
      
      toast.success('Order placed successfully!');
      navigate('/customer/order-confirmation', {
        state: {
          orderId: response.data.data._id,
          totalAmount: orderData.totalAmount,
          products: orderData.products
        }
      });
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (isLoading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Order Summary */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <Title text1="ORDER" text2="SUMMARY" />
            </div>
            <div className="card-body">
              {orderData.products.map((product, index) => (
                <div key={index} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex">
                    <img 
                      src={product.image} 
                      alt={product.productName}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      className="me-3"
                    />
                    <div>
                      <h6>{product.productName}</h6>
                      <p>Size: {product.size || 'One Size'}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Price: ₹{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{orderData.subtotal.toFixed(2)}</span>
              </div>
              
              {paymentMethod === 'cod' && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Charge:</span>
                  <span>₹10.00</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>₹{orderData.totalAmount.toFixed(2)}</h5>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <Title text1="PAYMENT" text2="METHOD" />
            </div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label className="form-check-label" htmlFor="cod">
                  Cash on Delivery (+₹10 delivery charge)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <label className="form-check-label" htmlFor="online">
                  Online Payment (Free delivery)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <Title text1="SELECT" text2="DELIVERY ADDRESS" />
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {userAddresses.map(address => (
                  <div 
                    key={address._id}
                    className={`list-group-item list-group-item-action ${selectedAddress?._id === address._id ? 'active' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h5>{address.title}</h5>
                    <p className="mb-1">{address.unitName}, {address.street}</p>
                    <p className="mb-1">{address.landMark}, {address.addressDetail}</p>
                    <p className="mb-0">
                      {address.cityId?.cityName}, {address.stateId?.stateName} - {address.zipCode}
                    </p>
                  </div>
                ))}
                
                <button 
                  className="list-group-item list-group-item-action text-center"
                  onClick={() => navigate('/customer/address')}
                  style={{
                    borderTop: '1px solid rgba(0,0,0,.125)',
                    color: '#0d6efd',
                    fontWeight: '500'
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add New Address
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header bg-light">
              <Title text1="CONTACT" text2="INFORMATION" />
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Phone:</strong> {userProfile.phoneNumber}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <button 
                className="btn btn-outline-secondary mt-2"
                onClick={() => navigate('/customer/profile')}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button 
          className="btn btn-primary btn-lg px-5"
          onClick={handlePlaceOrder}
          disabled={!selectedAddress}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};