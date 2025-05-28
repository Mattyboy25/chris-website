import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import PageTransition from './PageTransition';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {
  const location = useLocation();
  const { fromCheckout, name, isDeposit } = location.state || {};

  return (
    <PageTransition>
      <div className="success-container">
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <FaCheckCircle />
        </motion.div>
        
        <motion.h1 
          className="success-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {fromCheckout ? 'Thank You for Your Order!' : 'Message Sent Successfully!'}
        </motion.h1>
        
        <motion.p 
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {fromCheckout 
            ? isDeposit
              ? `Thank you ${name}! Your deposit payment has been received. We'll be in touch within 24 hours to confirm your appointment.`
              : `Thank you ${name}! Your payment has been processed successfully. We'll be in touch within 24 hours to confirm your appointment.`
            : 'Our team has received your email and will get back to you within 24 hours.'}
        </motion.p>
        
        {fromCheckout && (
          <motion.div
            className="next-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <h3>What happens next?</h3>
            <ol>
              <li>We'll review your booking details</li>
              <li>Confirm your preferred service date and time</li>
              <li>Send you a confirmation email with full details</li>
              {isDeposit && (
                <li>The remaining balance will be due upon completion of the project</li>
              )}
            </ol>
            <Link to="/" className="home-button">Return to Home</Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default ContactSuccess;
