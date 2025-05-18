import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {
  return (
    <div className="contact-success-container">
      <motion.h2
        className="success-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Thank You for Reaching Out!
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
        Our team has received your email and will get back to you within 24 hours.
      </motion.p>
    </div>
  );
};

export default ContactSuccess;
