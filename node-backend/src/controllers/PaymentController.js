// Simulate payment processing
const processPayment = async (req, res) => {
    try {
      const { orderId, amount, paymentMethod } = req.body;
  
      // Simulate payment success
      res.status(200).json({
        message: "Payment processed successfully",
        data: {
          orderId,
          amount,
          paymentMethod,
          status: "Success",
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = {
    processPayment,
  };