import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;

export const createPaymentIntent = async (amount, metadata) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        metadata,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const createPaymentSession = async (orderDetails) => {
  try {
    const response = await fetch('/api/create-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderDetails,
        depositAmount: Math.floor(orderDetails.totalPrice * 0.5), // 50% deposit
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
};

export const createFinalPaymentSession = async (orderDetails) => {
  try {
    const response = await fetch('/api/create-final-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderDetails,
        finalAmount: Math.ceil(orderDetails.totalPrice * 0.5), // Remaining 50%
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create final payment session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating final payment session:', error);
    throw error;
  }
};

export const getPaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`/api/payment-status/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};
