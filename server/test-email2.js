// Test script for email functionality with real-world data
const testOrder = {
  name: "John Smith",
  email: "test@example.com", // Replace with your email for testing
  phone: "404-555-0123",
  services: ["Real Estate Photography", "Aerial Mapping", "Construction Progress"],
  message: "Need drone photography for a new development project in Peachtree City. Looking to start next week."
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
