import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {
  const location = useLocation();
  const customerName = location.state?.customerInfo?.name || 'Valued Customer';

  return (
    <div className="success-container">
      <h1 className="success-heading">
        Thank You for Your Order, <span className="customer-name">{customerName}</span>!
      </h1>
      
      <div className="checkmark-container">
        <svg className="success-checkmark" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="23" />
          <path className="checkmark-path" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <div className="confirmation-box">
        <p className="confirmation-message">
          Your booking request has been received. We'll be in touch within 24 hours to confirm your appointment.
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
