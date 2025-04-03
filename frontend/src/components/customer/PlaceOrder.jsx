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

  // Fetch user addresses and profile
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

        setUserAddresses(addressRes.data.data);
        setUserProfile(profileRes.data.data);
        
        // Check if profile is complete
        if (!profileRes.data.data.phoneNumber || !profileRes.data.data.email) {
          navigate('/customer/profile', { state: { fromOrder: true } });
          return;
        }

        // Check if addresses exist
        if (addressRes.data.data.length === 0) {
          navigate('/customer/address', { state: { fromOrder: true } });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    try {
      const orderPayload = {
        userId: localStorage.getItem('id'),
        products: [{
          productId: state.orderData.productId,
          quantity: state.orderData.quantity,
          price: state.orderData.price,
          size: state.orderData.size
        }],
        shippingAddress: selectedAddress._id,
        paymentMethod,
        totalAmount: state.orderData.totalAmount
      };

      const response = await axios.post('http://localhost:3000/order/create', orderPayload);
      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
      navigate('/customer/order-confirmation', { 
        state: { 
          orderId: response.data.data._id,
          totalAmount: state.orderData.totalAmount 
        } 
      });
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (isLoading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Order Summary */}
        <div className="col-md-6">
        <div className="card mb-4">
          
          <div className="card-header bg-light" >
            <Title text1="ORDER" text2="SUMMARY" />
          </div>
      <div className="card-body">
        <div className="d-flex mb-3">
          <img 
            src={state.orderData.image} 
            alt={state.orderData.productName}
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div className="ms-3">
            <h5>{state.orderData.productName}</h5>
            <p>Size: {state.orderData.size}</p>
            <p>Quantity: {state.orderData.quantity}</p>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between mb-2">
          <span>Subtotal:</span>
          <span>₹{state.orderData.subtotal}</span>
        </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Delivery Charge:</span>
            <span>₹10</span>
          </div>
        <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>₹{state.orderData.totalAmount}</h5>
          </div>
        </div>
    </div>

          {/* Payment Method */}
          <div className="card mb-4">
            <div className="card-header bg-light" >
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
                  Cash on Delivery
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
                  Online Payment
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="col-md-6">
        <div className="card mb-4">
  <div className="card-header bg-light" >
            <Title text1="SELECT" text2="DELIVERY ADDRESS" />
          </div>
  <div className="card-body p-0"> {/* Remove default padding */}
    <div className="list-group list-group-flush"> {/* Use list group for better alignment */}
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
          <p className="mb-0">{address.cityId?.cityName}, {address.stateId?.stateName} - {address.zipCode}</p>
        </div>
      ))}
      
      {/* Add New Address Button - now properly aligned */}
      <button 
        className="list-group-item list-group-item-action text-center"
        onClick={() => navigate('/customer/addresses')}
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
          <div className="card-header bg-light" >
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
          className="btn btn-primary btn-lg"
          onClick={handlePlaceOrder}
          disabled={!selectedAddress}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};