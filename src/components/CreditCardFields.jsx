import React from 'react';
import '../styles/CreditCardFields.css';

const CreditCardFields = ({ handleInputChange, cardData }) => {
  const formatCardNumber = (value) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add spaces after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    handleInputChange({
      target: {
        name,
        value: formattedValue
      }
    });
  };

  return (
    <div className="credit-card-fields">
      <div className="input-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={cardData.cardNumber}
          onChange={handleCardInput}
          placeholder="0000 0000 0000 0000"
          maxLength="19"
          autoComplete="cc-number"
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
            onChange={handleCardInput}
            placeholder="MM/YY"
            maxLength="5"
            autoComplete="cc-exp"
          />
        </div>

        <div className="input-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="password"
            id="cvv"
            name="cvv"
            value={cardData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength="4"
            autoComplete="cc-csc"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCardFields;
