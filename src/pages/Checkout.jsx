import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaEdit } from 'react-icons/fa';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, createDepositPaymentIntent } from '../api/stripe';
import { sendOrderConfirmation } from '../api/email';
import StripeCardInput from '../components/StripeCardInput';
import PageTransition from '../components/PageTransition';
import '../styles/Checkout.css';
import { services } from '../data/servicesData';

function CheckoutForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    serviceDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  
  // Get package details from location state
  const { serviceSlug, addons, totalPrice } = location.state || {};
  const service = services.find(s => s.slug === serviceSlug);
  const basePrice = service ? parseInt(service.info.pricing.replace(/[^0-9]/g, '')) : 0;

  // Redirect to services if there's no selected package
  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreementChecked) {
      setSubmitError('Please agree to the Terms of Service and Privacy Policy before submitting.');
      return;
    }
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare order details
      const orderDetails = {
        package: service?.title,
        basePrice: basePrice,
        addons: addons || [],
        totalPrice: totalPrice,
        customer: formData
      };

      // Create payment intent for deposit if total is over $500
      const requiresDeposit = totalPrice >= 500;
      const paymentResponse = await createDepositPaymentIntent(
        totalPrice,
        { orderId: Math.random().toString(36).substr(2, 9) } // Replace with actual order ID
      );

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: {
            card: elements.getElement('card'),
            billing_details: {
              name: formData.fullName,
              email: formData.email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Send confirmation email
      await sendOrderConfirmation(orderDetails, requiresDeposit ? 'deposit' : 'full');
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect to confirmation page after a delay
      setTimeout(() => {
        navigate('/contact-success', { 
          state: { 
            fromCheckout: true, 
            name: formData.fullName,
            isDeposit: requiresDeposit
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'There was a problem processing your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <PageTransition>
      <div className="checkout-container">
        <div className="back-section">
          <motion.button 
            className="back-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Package
          </motion.button>
        </div>
        
        <h1 className="checkout-title">Complete Your Booking</h1>
        
        <div className="checkout-content">
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <motion.button 
                className="edit-package-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/services/${serviceSlug}?customize=true`)}
              >
                <FaEdit /> Edit Package
              </motion.button>
            </div>
            <div className="summary-item package-summary">
              <span className="item-name">{service.title}</span>
              <span className="item-price">${basePrice}</span>
            </div>
            
            {addons && addons.length > 0 && (
              <div className="addons-list">
                <h3>Add-ons</h3>
                {addons.map((addon, index) => (
                  <div key={index} className="summary-item addon-item">
                    <span className="item-name">{addon.name}</span>
                    <span className="item-price">${addon.price}</span>
                    <button 
                      className="remove-addon-btn"
                      onClick={() => {
                        const updatedAddons = addons.filter((_, i) => i !== index);
                        const newTotalPrice = totalPrice - addon.price;
                        navigate('/checkout', { 
                          state: { 
                            serviceSlug,
                            addons: updatedAddons,
                            totalPrice: newTotalPrice 
                          },
                          replace: true
                        });
                      }}
                      aria-label={`Remove ${addon.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-price">${totalPrice}</span>
            </div>

            {totalPrice >= 500 && (
              <div className="deposit-info">
                <h4>Payment Schedule</h4>
                <div className="payment-breakdown">
                  <div className="payment-item">
                    <span>Initial Deposit (50%)</span>
                    <span className="amount">${(totalPrice * 0.5).toFixed(2)}</span>
                  </div>
                  <div className="payment-item">
                    <span>Final Payment (50%)</span>
                    <span className="amount">${(totalPrice * 0.5).toFixed(2)}</span>
                  </div>
                  <p className="deposit-note">
                    For orders over $500, we require a 50% deposit to begin work. 
                    The remaining balance will be due upon completion of the project.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="checkout-form-container">
            <h2>Your Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Your phone number"
                />
              </div>

              <div className="form-group property-address-group">
                <label htmlFor="propertyAddress">Property Address for Service *</label>
                <input 
                  type="text" 
                  id="propertyAddress" 
                  name="propertyAddress" 
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter the address of the property to be photographed/filmed"
                />
                <small className="field-note">
                  This is the address where we will perform the drone photography/videography service, 
                  not your personal address.
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="serviceDate">Preferred Service Date *</label>
                <input 
                  type="date" 
                  id="serviceDate" 
                  name="serviceDate" 
                  value={formData.serviceDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requests or information about your property"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Payment Details *</label>
                <StripeCardInput />
              </div>

              <div className="form-group agreement-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    name="termsAgreement"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="agreement-text">
                    I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  </span>
                </label>
              </div>
              
              <div className="privacy-notice">
                <p>🔒 Your information is securely processed by Stripe. We will never store your card details.</p>
              </div>

              {submitError && <div className="error-message">{submitError}</div>}
              
              <button 
                type="submit" 
                className="submit-request-btn"
                disabled={isSubmitting || !agreementChecked || !stripe}
              >
                {isSubmitting ? 'Processing...' : submitSuccess ? 'Payment Successful!' : 'Submit Payment'}
                {submitSuccess && <FaCheck className="success-icon" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
