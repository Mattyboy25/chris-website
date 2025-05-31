import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreditCardFields from '../components/CreditCardFields';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Get order data from navigation state
  const { formData, serviceDetails } = location.state || {};
  const { service, addons = [], totalPrice, basePrice } = serviceDetails || {};

  // Redirect to checkout if no order data
  useEffect(() => {
    if (!serviceDetails || !service) {
      navigate('/checkout');
    }
  }, [serviceDetails, service, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value 
    }));
  };
  const handleGoBack = () => {
    navigate('/checkout', { 
      state: { serviceSlug: service?.slug, addons, totalPrice } 
    }); // Navigate back to checkout page with current data
  };  const handlePayment = async () => {
    // Basic validation
    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      setPaymentError('Please fill in all card details.');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');
    
    try {
      // Payment processing logic here
      console.log('Processing payment...', {
        cardData,
        orderDetails: {
          service: service?.title,
          totalPrice,
          customer: formData,
          addons
        }
      });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        // Navigate to success page
        navigate('/contact-success', {
          state: {
            fromCheckout: true,
            name: formData?.fullName || 'Customer'
          }
        });
      } else {
        setPaymentError('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Show loading or redirect if no service data
  if (!service) {
    return (
      <div className="payment-screen">
        <div className="payment-container">
          <h1>Redirecting...</h1>
          <p>Please wait while we redirect you to the checkout page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-screen">
      <div className="payment-container">
        <h1 className="payment-title">Complete Your Payment</h1>
          {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          {/* Service Details */}
          <div className="service-details">
            <h4>{service?.title || 'Photography Package'}</h4>
            <span className="price">${basePrice || 299}</span>
          </div>
          
          {/* Add-ons List */}
          {addons && addons.length > 0 && (
            <div className="addons-list">
              <h4>Add-ons</h4>
              <ul>
                {addons.map((addon, index) => (
                  <li key={index}>
                    <span>{addon.name}</span>
                    <span>${addon.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Total Amount */}
          <div className="summary-total">
            <span>Total Amount:</span>
            <span className="total-price">${totalPrice || 299}</span>
          </div>
          
          {/* Customer Info */}
          {formData && (
            <div className="customer-info">
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Service Date:</strong> {formData.serviceDate}</p>
            </div>
          )}
        </div>

        {/* Credit Card Fields */}
        <CreditCardFields 
          handleInputChange={handleInputChange}
          cardData={cardData}
        />

        {/* Payment Error Message */}
        {paymentError && (
          <div className="payment-error">
            <p>{paymentError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="payment-actions">
          <button className="payment-submit-btn" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-credit-card"></i>
            )}
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </button>
          <button className="go-back-btn" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;