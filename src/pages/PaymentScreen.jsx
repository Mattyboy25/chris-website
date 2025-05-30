import React, { useState } from 'react';
import CreditCardFields from '../components/CreditCardFields';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
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

  return (
    <div className="payment-screen">
      <div className="payment-container">
        <h2>Complete Your Payment</h2>
        
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

        {/* Submit Button */}
        <button className="payment-submit-btn">
          Complete Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;