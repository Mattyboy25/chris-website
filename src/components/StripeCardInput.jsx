import React from 'react';
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import '../styles/StripeCardInput.css';

const StripeCardInput = ({ onChange }) => {
  const options = {
    style: {
      base: {
        fontSize: '16px',
        color: 'var(--text-color)',
        '::placeholder': {
          color: 'var(--text-color-light)',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="stripe-card-container">
      <div className="card-group">
        <label>Card Number</label>
        <div className="card-element-container">
          <CardNumberElement options={options} onChange={onChange} />
        </div>
      </div>

      <div className="card-row">
        <div className="card-group">
          <label>Expiration</label>
          <div className="card-element-container">
            <CardExpiryElement options={options} onChange={onChange} />
          </div>
        </div>

        <div className="card-group">
          <label>CVC</label>
          <div className="card-element-container">
            <CardCvcElement options={options} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCardInput;