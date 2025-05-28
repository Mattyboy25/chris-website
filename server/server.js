require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Create a payment session endpoint
app.post('/api/create-payment-session', async (req, res) => {
  try {
    const { package: packageName, totalPrice, depositAmount, customer } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageName} - 50% Deposit`,
              description: 'Initial deposit payment for drone photography/videography services',
            },
            unit_amount: depositAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/contact-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        package: packageName,
        totalPrice: totalPrice,
        depositAmount: depositAmount,
        customerEmail: customer.email,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        propertyAddress: customer.propertyAddress,
        serviceDate: customer.serviceDate
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating payment session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create final payment session endpoint
app.post('/api/create-final-payment-session', async (req, res) => {
  try {
    const { package: packageName, totalPrice, finalAmount, customer, orderId } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageName} - Final Payment`,
              description: 'Final payment for completed drone photography/videography services',
            },
            unit_amount: finalAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/contact-success?session_id={CHECKOUT_SESSION_ID}&final=true`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId,
        package: packageName,
        totalPrice: totalPrice,
        finalAmount: finalAmount,
        customerEmail: customer.email,
        customerName: customer.fullName,
        paymentType: 'final'
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating final payment session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get payment status endpoint
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      metadata: session.metadata
    });
  } catch (err) {
    console.error('Error getting payment status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint to handle successful payments
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Here you would typically:
    // 1. Save the order details to your database
    // 2. Send confirmation emails
    // 3. Update the booking status
    console.log('Payment successful for session:', session.id);
    console.log('Customer details:', session.metadata);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
