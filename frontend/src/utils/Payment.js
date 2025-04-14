import axios from "axios";

export const initiateRazorpayPayment = async (paymentData, onSuccess, onError) => {
    try {
      // 1. Get Razorpay key from Vite environment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }
  
      // 2. Create order on backend
      const orderResponse = await axios.post('/razorpay/create-order', {
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          products: paymentData.products,
          userId: localStorage.getItem('id')
        }
      });
  
      // 3. Initialize Razorpay
      const options = {
        key: razorpayKey, // Use from environment
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.orderId,
        handler: async (response) => {
          try {
            await axios.post('/razorpay/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            onSuccess(response);
          } catch (error) {
            onError(error);
          }
        },
        prefill: paymentData.user,
        theme: {
          color: '#3399cc'
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
    } catch (error) {
      console.error('Payment Initialization Error:', error);
      onError(error);
    }
  };