import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaEdit } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/Checkout.css';
import { services } from '../data/servicesData';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    serviceDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [dateError, setDateError] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  
  // Get package details from location state
  const { serviceSlug, addons, totalPrice } = location.state || {};
  const service = services.find(s => s.slug === serviceSlug);
  
  // Helper function to get tomorrow's date for min attribute
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  // Redirect to services if there's no selected package
  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);

  const basePrice = service ? parseInt(service.info.pricing.replace(/[^0-9]/g, '')) : 0;
  
  const validateDate = (selectedDate) => {
    // Get today's date and reset time to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Convert selected date string to Date object
    const chosenDate = new Date(selectedDate + 'T00:00:00');
    
    // Compare using timestamps for accurate date comparison
    if (chosenDate.getTime() <= today.getTime()) {
      setDateError('Please select tomorrow or a future date');
      return false;
    }
    
    setDateError('');
    return true;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'serviceDate') {
      validateDate(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreementChecked) {
      setSubmitError('Please agree to the Terms of Service and Privacy Policy before submitting.');
      return;
    }

    // Validate the service date
    if (!validateDate(formData.serviceDate)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Navigate to payment screen with all form data and service details
      navigate('/payment', {
        state: {
          formData,
          serviceDetails: {
            service,
            addons,
            totalPrice,
            basePrice
          }
        }
      });
      return;
    } catch (error) {
      console.error('Error navigating to payment screen:', error);
      setSubmitError('Something went wrong. Please try again.');
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
              </div>              <div className="address-fields">
                <h3>Property Address for Service *</h3>
                <div className="form-group">
                  <label htmlFor="streetAddress">Street Address *</label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      placeholder="12345"
                      maxLength="5"
                      pattern="[0-9]{5}"
                    />
                  </div>
                </div>
                <small className="field-note">This is the address where we will perform the drone photography/videography service.</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="serviceDate">Preferred Service Date *</label>
                <input 
                  type="date" 
                  id="serviceDate" 
                  name="serviceDate" 
                  value={formData.serviceDate}
                  onChange={handleInputChange}
                  className={dateError ? 'error' : ''}
                  min={getMinDate()}
                  required
                />
                {dateError && <div className="error-message">{dateError}</div>}
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
              >                {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
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
