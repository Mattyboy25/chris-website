import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import generateOrderNumber from '../utils/orderUtils';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerName = searchParams.get('name') || '';

  useEffect(() => {
    // Generate order number when component mounts
    setOrderNumber(generateOrderNumber());
  }, []);

  return (
    <div className="success-container">
      <h1 className="success-heading">
        Thank You for Your Order{customerName ? `, ${customerName}` : ''}!
      </h1>
      
      <div className="order-number">
        Order #: {orderNumber}
      </div>

      <div className="checkmark-container">
        <svg 
          className="success-checkmark" 
          viewBox="0 0 52 52"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            className="checkmark-circle" 
            cx="26" 
            cy="26" 
            r="23" 
            fill="none"
          />
          <path 
            className="checkmark-path" 
            fill="none" 
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>

      <div className="confirmation-box">
        <p className="confirmation-message">
          Your booking request has been received. We'll be in touch within 24 hours to confirm your appointment.
          <br /><br />
          Your order confirmation number: <strong>{orderNumber}</strong>
        </p>
        
        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>We'll review your booking request</li>
            <li>Confirm your preferred service date and time</li>
            <li>Send you a confirmation email with all details</li>
          </ol>
        </div>

        <Link to="/" className="return-home-btn">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ContactSuccess;
