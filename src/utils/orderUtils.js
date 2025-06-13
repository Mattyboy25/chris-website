/**
 * Send order confirmation email and get order number
 * @param {Object} orderData - The order data
 * @param {string} orderData.name - Customer's name
 * @param {string} orderData.email - Customer's email
 * @param {string} orderData.phone - Customer's phone number
 * @param {string[]} orderData.services - Selected services
 * @param {string} orderData.message - Additional message
 * @returns {Promise<{success: boolean, orderNumber?: string, error?: string}>}
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send order');
    }

    return {
      success: true,
      orderNumber: data.orderNumber
    };
  } catch (error) {
    console.error('Error sending order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
