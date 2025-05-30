import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreditCardFields from '../components/CreditCardFields';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value 
    }));
  };

  const handleGoBack = () => {
    navigate('/checkout'); // Navigate back to checkout page
  };

  const handlePayment = () => {
    // Payment processing logic here
    console.log('Processing payment...', cardData);
  };
  return (
    <div className="payment-screen">
      <div className="payment-container">
        <h1 className="payment-title">Complete Your Payment</h1>
        
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Service: Photography Package</p>
          <p>Amount: $299.99</p>
        </div>

        {/* Credit Card Fields */}
        <CreditCardFields 
          handleInputChange={handleInputChange}
          cardData={cardData}
        />

        {/* Action Buttons */}
        <div className="payment-actions">
          <button className="payment-submit-btn" onClick={handlePayment}>
            <i className="fas fa-credit-card"></i>
            Complete Payment
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