import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreditCardFields from '../components/CreditCardFields';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Get order data from navigation state
  const { formData, serviceDetails } = location.state || {};
  const { service, addons = [], totalPrice, basePrice } = serviceDetails || {};

  // Redirect to checkout if no order data
  useEffect(() => {
    if (!serviceDetails || !service || !formData) {
      navigate('/checkout', { replace: true });
    }
  }, [serviceDetails, service, formData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value 
    }));
    // Clear error when user starts typing
    if (paymentError) setPaymentError('');
  };
  const validateCard = () => {
    // Validate card number using Luhn algorithm
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length !== 16) {
      throw new Error('Please enter a valid 16-digit card number');
    }

    const digits = cleanCardNumber.split('').map(Number);
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      throw new Error('Invalid card number. Please check and try again.');
    }

    // Validate expiry date format and logic
    if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      throw new Error('Please enter expiry date in MM/YY format');
    }

    const [month, year] = cardData.expiryDate.split('/').map(num => parseInt(num, 10));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) {
      throw new Error('Invalid month in expiry date');
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      throw new Error('Card has expired. Please use a valid card');
    }

    // Validate CVV
    const cvvRegex = /^\d{3,4}$/;
    if (!cardData.cvv || !cvvRegex.test(cardData.cvv)) {
      throw new Error('Please enter a valid CVV (3-4 digits)');
    }
  };
  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // Validate required data
      if (!serviceDetails || !formData) {
        throw new Error('Missing order information. Please start over from the checkout page.');
      }

      // Validate all card fields are filled
      const { cardNumber, expiryDate, cvv } = cardData;
      if (!cardNumber || !expiryDate || !cvv) {
        throw new Error('Please fill in all card details');
      }

      // Validate card data
      validateCard();

      // Simulate payment processing with a realistic delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1500));

      // Success - navigate to success page with complete order details
      navigate('/contact-success', {
        state: {
          fromCheckout: true,
          name: formData.fullName,
          orderDetails: {
            service: service.title,
            totalPrice,
            basePrice,
            serviceDate: formData.serviceDate,
            location: formData.location,
            addons: addons.map(addon => ({
              name: addon.name,
              price: addon.price
            }))
          }
        },
        replace: true // Replace current history entry to prevent back navigation to payment
      });
    } catch (err) {
      console.error('Payment Error:', err);
      
      // Provide more specific error messages
      let errorMessage = err.message;
      if (errorMessage.includes('card number')) {
        errorMessage += ' (Examples: 4111 1111 1111 1111)';
      } else if (errorMessage.includes('expiry date')) {
        errorMessage += ' (Example: 12/25)';
      } else if (errorMessage.includes('CVV')) {
        errorMessage += ' (Example: 123)';
      }
      
      setPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/checkout', { 
      state: { serviceSlug: service?.slug, addons, totalPrice } 
    });
  };  

  // Show loading or redirect if no service data
  if (!service) {
    return (
      <div className="payment-screen">
        <div className="payment-container">
          <h1>Redirecting...</h1>
          <p>Please wait while we redirect you to the checkout page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-screen">
      <div className="payment-container">
        <h1 className="payment-title">Complete Your Payment</h1>
          {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          {/* Service Details */}
          <div className="service-details">
            <h4>{service?.title || 'Photography Package'}</h4>
            <span className="price">${basePrice || 299}</span>
          </div>
          
          {/* Add-ons List */}
          {addons && addons.length > 0 && (
            <div className="addons-list">
              <h4>Add-ons</h4>
              <ul>
                {addons.map((addon, index) => (
                  <li key={index}>
                    <span>{addon.name}</span>
                    <span>${addon.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Total Amount */}
          <div className="summary-total">
            <span>Total Amount:</span>
            <span className="total-price">${totalPrice || 299}</span>
          </div>
          
          {/* Customer Info */}
          {formData && (
            <div className="customer-info">
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Service Date:</strong> {formData.serviceDate}</p>
            </div>
          )}
        </div>

        {/* Credit Card Fields */}
        <CreditCardFields 
          handleInputChange={handleInputChange}
          cardData={cardData}
        />

        {/* Payment Error Message */}
        {paymentError && (
          <div className="payment-error">
            <p>{paymentError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="payment-actions">
          <button className="payment-submit-btn" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-credit-card"></i>
            )}
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </button>
          <button className="go-back-btn" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;