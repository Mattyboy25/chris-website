// Test script for email functionality
const testOrder = {
  name: "Test Customer",
  email: "test@example.com", // Replace with your email for testing
  phone: "123-456-7890",
  services: ["Drone Photography", "Real Estate"],
  message: "This is a test order"
};

fetch('http://localhost:3001/api/send-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testOrder),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});
