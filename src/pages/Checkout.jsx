import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/Checkout.css';
import { services } from '../data/servicesData';

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
    const handleRemoveAddon = (addonIndex) => {
    const updatedAddons = addons.filter((_, index) => index !== addonIndex);
    
    // Calculate new price
    const removedAddon = addons[addonIndex];
    const newTotalPrice = totalPrice - removedAddon.price;
    
    // Update localStorage with the updated addons
    if (service) {
      localStorage.setItem(`selected_addons_${service.slug}`, JSON.stringify(updatedAddons));
    }
    
    // Update location state with new values
    navigate('/checkout', { 
      state: { 
        serviceSlug,
        addons: updatedAddons, 
        totalPrice: newTotalPrice 
      },
      replace: true
    });
  };
  
  const handleEditPackage = () => {
    navigate(`/services/${serviceSlug}?customize=true`);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if terms are agreed to
    if (!agreementChecked) {
      setSubmitError('Please agree to the Privacy Policy and Terms of Service before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a submission with a timeout
      
      const orderDetails = {
        package: service?.title,
        basePrice: basePrice,
        addons: addons || [],
        totalPrice: totalPrice,
        customer: formData
      };
      
      console.log('Order details to submit:', orderDetails);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSubmitSuccess(true);
      
      // Clear addons from localStorage after successful submission
      if (service) {
        localStorage.removeItem(`selected_addons_${service.slug}`);
      }
      
      // Redirect to confirmation page after a delay
      setTimeout(() => {
        navigate('/contact-success', { state: { fromCheckout: true, name: formData.fullName } });
      }, 2000);
      
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
        
        <div className="checkout-content">          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <motion.button
                className="edit-package-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditPackage}
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
                    <div className="addon-info">
                      <span className="item-name">{addon.name}</span>
                      <span className="item-price">${addon.price}</span>
                    </div>
                    <button 
                      className="remove-addon-btn" 
                      onClick={() => handleRemoveAddon(index)}
                      title="Remove add-on"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-price">${totalPrice}</span>
            </div>
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
              
              <div className="form-group">
                <label htmlFor="propertyAddress">Property Address * <span className="address-note">(Address of the property to be photographed)</span></label>
                <input 
                  type="text" 
                  id="propertyAddress" 
                  name="propertyAddress" 
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Full address of the property location"
                />
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
              
              <div className="privacy-notice">
                <p>Your privacy matters to us. We will never sell or share your information with third parties.</p>
              </div>
              
              <div className="form-group agreement-checkbox">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={() => setAgreementChecked(!agreementChecked)}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="agreement-text">
                    I agree to the <Link to="/privacy-policy" target="_blank" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and <Link to="/terms-of-service" target="_blank" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>
                  </span>
                </label>
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
