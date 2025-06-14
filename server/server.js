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
console.log('Initializing email configuration...'); // Debug log
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
console.log('Verifying email configuration...'); // Debug log
console.log('Email Config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  user: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO
}); // Debug log

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
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

// Booking submission endpoint
app.post('/api/submit-booking', async (req, res) => {
  try {
    console.log('Received booking request:', req.body); // Debug log

    const { 
      name, 
      email, 
      phone, 
      address,
      services,
      message,
      packageDetails,
      paymentIntent,
      totalPrice
    } = req.body;
    
    console.log('Generating email content...'); // Debug log

    // Generate a unique order number
    const orderNumber = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const mailOptions = {
      from: '"Upward Drone Services" <${process.env.EMAIL_USER}>',
      to: process.env.EMAIL_TO,
      subject: `📸 New Booking - ${name} (Order #${orderNumber})`,
      html: `
        <h2>New Booking Details</h2>
        
        <h3>Order Information:</h3>
        <ul>
          <li><strong>Order Number:</strong> ${orderNumber}</li>
          <li><strong>Total Price:</strong> $${totalPrice}</li>
          <li><strong>Payment Status:</strong> ${paymentIntent ? 'Payment Initiated' : 'No Payment Required'}</li>
          ${paymentIntent ? `<li><strong>Payment ID:</strong> ${paymentIntent.id}</li>` : ''}
        </ul>

        <h3>Client Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Address:</strong> ${address}</li>
        </ul>

        <h3>Service Details:</h3>
        <ul>
          <li><strong>Selected Services:</strong> ${Array.isArray(services) ? services.join(', ') : services}</li>
        </ul>

        ${packageDetails ? `
        <h3>Package Details:</h3>
        <pre>${packageDetails}</pre>
        ` : ''}

        ${message ? `
        <h3>Additional Notes:</h3>
        <p>${message}</p>
        ` : ''}
      `,
      replyTo: email
    };    console.log('SMTP Config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO
    }); // Debug log

    console.log('Attempting to send email...'); // Debug log
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!'); // Debug log

    res.status(200).json({ 
      success: true,
      message: 'Booking submitted successfully',
      orderNumber
    });

  } catch (error) {    console.error('Email error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing booking'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
