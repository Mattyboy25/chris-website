import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export async function createPaymentIntent(amount, metadata) {
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
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createDepositPaymentIntent(totalAmount, metadata) {
  const depositAmount = Math.floor(totalAmount * 0.5); // 50% deposit
  return createPaymentIntent(depositAmount, {
    ...metadata,
    isDeposit: true,
    totalAmount,
  });
}

export { stripePromise };
