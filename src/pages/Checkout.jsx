import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaEdit } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/Checkout.css';
import { services } from '../data/servicesData';
import stripePromise, { createPaymentSession } from '../utils/stripe';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();  const [formData, setFormData] = useState({
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
  
  // Get package details from location state
  const { serviceSlug, addons, totalPrice } = location.state || {};
  const service = services.find(s => s.slug === serviceSlug);
  
  // Redirect to services if there's no selected package
  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);

  const basePrice = service ? parseInt(service.info.pricing.replace(/[^0-9]/g, '')) : 0;
  
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
    
    setIsSubmitting(true);
    setSubmitError('');
      try {
      const orderDetails = {
        package: service?.title,
        basePrice: basePrice,
        addons: addons || [],
        totalPrice: totalPrice,
        customer: formData
      };
      
      console.log('Order details to submit:', orderDetails);
      
      // Only show split payment UI for orders over $500
      if (totalPrice >= 500) {
        const depositAmount = Math.floor(totalPrice * 0.5); // 50% deposit
        
        // Create Stripe Checkout session for the deposit
        const { sessionId } = await createPaymentSession(orderDetails);
        
        // Get Stripe instance
        const stripe = await stripePromise;
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId
        });
        
        if (error) {
          console.error('Error redirecting to checkout:', error);
          setSubmitError('Payment initialization failed. Please try again.');
          return;
        }
      } else {
        // For orders under $500, proceed with regular checkout
        // Show success message
        setSubmitSuccess(true);
        
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          navigate('/contact-success', { state: { fromCheckout: true, name: formData.fullName } });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was a problem submitting your request. Please try again.');
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
              <div className="payment-terms">
                <h3>Payment Terms</h3>
                <p>For orders over $500, we offer split payment:</p>
                <ul>
                  <li>50% deposit (${Math.floor(totalPrice * 0.5)}) required to book your service</li>
                  <li>Remaining 50% (${Math.ceil(totalPrice * 0.5)}) due after project delivery</li>
                </ul>
                <p>You'll be directed to our secure payment page to complete the deposit payment after submitting your details.</p>
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
                <small className="field-note">This is the address where we will perform the drone photography/videography service, not your personal address.</small>
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
              </div>                <div className="form-group agreement-group">
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
                  <p>🔒 Your privacy is important to us. We will never share, sell, or use your information for any purpose other than communicating with you about your booking.</p>
                </div>

              {submitError && <div className="error-message">{submitError}</div>}
              
              <button 
                type="submit" 
                className="submit-request-btn"
                disabled={isSubmitting || !agreementChecked}
              >
                {isSubmitting ? 'Submitting...' : submitSuccess ? 'Request Submitted!' : 'Submit Request'}
                {submitSuccess && <FaCheck className="success-icon" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Checkout;
