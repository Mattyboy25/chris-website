import React from 'react';
import '../styles/CreditCardFields.css';

const CreditCardFields = ({ handleInputChange, cardData }) => {
  return (
    <div className="credit-card-fields">
      <div className="input-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={cardData.cardNumber}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
        />
      </div>

      <div className="card-details">
        <div className="input-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
          />
        </div>

        <div className="input-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={cardData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength="4"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCardFields;
