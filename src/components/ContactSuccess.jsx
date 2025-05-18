import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ContactSuccess.css';

const ContactSuccess = () => {
  // Animation variants for the checkmark
  const checkmarkVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0 
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the circle
  const circleVariants = {
    hidden: { 
      scale: 0,
      opacity: 0 
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="contact-success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="success-title"
      >
        Thank You for Reaching Out!
      </motion.h2>
      <div className="checkmark-container">
        <motion.div
          className="circle"
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.svg
            viewBox="0 0 50 50"
            className="checkmark"
          >
            <motion.path
              d="M14,26 L 22,33 L 36,16"
              fill="transparent"
              strokeWidth="4"
              stroke="#fff"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.svg>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="success-message"
      >
        Our team has received your email and will get back to you within 24 hours.
      </motion.p>
    </motion.div>
  );
};

export default ContactSuccess;
