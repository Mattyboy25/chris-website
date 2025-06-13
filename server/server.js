require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Create transporter for emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Email order confirmation endpoint
app.post('/api/send-order', async (req, res) => {
  try {
    const { name, email, phone, services, message } = req.body;
    const orderNumber = crypto.randomBytes(4).toString('hex').toUpperCase();

    const emailContent = `
      <h2>New Booking Request</h2>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Services:</strong> ${services}</li>
        <li><strong>Message:</strong> ${message || 'No message provided'}</li>
      </ul>
    `;

    await transporter.sendMail({
      from: `"Upward Drone Services" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Booking Request - Order #${orderNumber}`,
      html: emailContent,
      replyTo: email
    });

    res.status(200).json({
      success: true,
      message: 'Order confirmation sent successfully',
      orderNumber
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation'
    });
  }
});

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
