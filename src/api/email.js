import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderConfirmation(order, paymentType) {
  const isDeposit = paymentType === 'deposit';
  const amount = isDeposit ? order.totalPrice * 0.5 : order.totalPrice;

  const emailContent = `
    Dear ${order.customer.fullName},

    Thank you for your ${isDeposit ? 'deposit' : 'payment'} of $${amount.toFixed(2)} for your drone photography service.
    
    Order Details:
    - Package: ${order.package}
    - Service Date: ${order.customer.serviceDate}
    - Service Location: ${order.customer.propertyAddress}
    
    ${isDeposit ? `
    Remaining Balance: $${(order.totalPrice * 0.5).toFixed(2)}
    The remaining balance will be due upon completion of the project.
    ` : ''}

    We will be in touch shortly to confirm all details of your booking.

    Best regards,
    Upward Drone Services Team
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: order.customer.email,
      subject: `Order Confirmation - ${isDeposit ? 'Deposit Received' : 'Payment Complete'}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
