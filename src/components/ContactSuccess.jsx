import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {  const location = useLocation();
  const { fromCheckout, name } = location.state || {};
  const customerName = name || '';
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const isFinalPayment = searchParams.get('final') === 'true';

  return (
    <div className="contact-success-container">
      <motion.h2
        className="success-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {fromCheckout 
          ? `Thank You for Your Order, ${customerName}!` 
          : 'Thank You for Reaching Out!'}
      </motion.h2>

      <motion.div
        className="checkmark-wrapper"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
      >
        <svg className="checkmark" viewBox="0 0 52 52">
          <motion.circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.path
            className="checkmark-check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </svg>
      </motion.div>

      <motion.p
        className="success-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        {fromCheckout 
          ? `Your booking request has been received. We'll be in touch within 24 hours to confirm your appointment.` 
          : 'Our team has received your email and will get back to you within 24 hours.'}
      </motion.p>
      
      {fromCheckout && (      <motion.div
        className="next-steps"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >        <h3>What happens next?</h3>
        {sessionId ? (
          isFinalPayment ? (
            <ol>
              <li>Your final payment has been processed successfully</li>
              <li>Our team will prepare your deliverables</li>
              <li>You'll receive an email with download links</li>
              <li>Please leave us a review of your experience</li>
            </ol>
          ) : (
            <ol>
              <li>Your deposit payment has been processed successfully</li>
              <li>We'll confirm your preferred service date and time</li>
              <li>Our team will complete your project</li>
              <li>You'll receive an invoice for the remaining balance</li>
              <li>Once final payment is complete, we'll deliver your files</li>
            </ol>
          )
        ) : (
          <ol>
            <li>We'll review your booking request</li>
            <li>Confirm your preferred service date and time</li>
            <li>Send you a confirmation email with all details</li>
          </ol>
        )}
        <Link to="/" className="home-button">Return to Home</Link>
      </motion.div>
      )}
    </div>
  );
};

export default ContactSuccess;
