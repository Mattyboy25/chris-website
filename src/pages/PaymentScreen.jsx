import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { PayPalButtons } from '@paypal/react-paypal-js';
import PageTransition from '../components/PageTransition';
import '../styles/PaymentScreen.css';

function PaymentScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Get data passed from checkout
  const { formData, serviceDetails } = location.state || {};

  // Redirect if no data
  React.useEffect(() => {
    if (!formData || !serviceDetails) {
      navigate('/services');
    }
  }, [formData, serviceDetails, navigate]);

  const handlePayPalCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: serviceDetails.totalPrice.toString(),
          currency_code: "USD"
        },
        description: `${serviceDetails.service.title} Package`
      }]
    });
  };

  const handlePayPalApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      const order = await actions.order.capture();
      // Handle successful payment here
      // You can add API calls to your backend to save the order
      navigate('/contact-success');
    } catch (error) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setError('Stripe integration coming soon!');
    // Stripe integration will go here once you have the API keys
  };

  if (!formData || !serviceDetails) return null;

  return (
    <PageTransition>
      <div className="payment-screen">
        <motion.button 
          className="back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft /> Back
        </motion.button>

        <div className="payment-container">
          <h1>Complete Your Payment</h1>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="service-details">
              <h3>{serviceDetails.service.title}</h3>
              <p className="price">${serviceDetails.totalPrice}</p>
            </div>
            {serviceDetails.addons && serviceDetails.addons.length > 0 && (
              <div className="addons-list">
                <h4>Selected Add-ons:</h4>
                <ul>
                  {serviceDetails.addons.map((addon, index) => (
                    <li key={index}>{addon.name} - ${addon.price}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            
            <div className="payment-options">
              {/* PayPal Button */}
              <div className="payment-option">
                <img src="/images/paypal-logo.png" alt="PayPal" className="payment-logo" />
                <PayPalButtons
                  createOrder={handlePayPalCreateOrder}
                  onApprove={handlePayPalApprove}
                  style={{ layout: "horizontal" }}
                  disabled={isProcessing}
                />
              </div>

              {/* Stripe Button (disabled for now) */}
              <div className="payment-option">
                <img src="/images/stripe-logo.png" alt="Stripe" className="payment-logo" />
                <button
                  className="stripe-button"
                  onClick={handleStripePayment}
                  disabled={isProcessing}
                >
                  <FaCreditCard /> Pay with Card
                </button>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </PageTransition>
  );
}

export default PaymentScreen;