import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Checkout from './pages/Checkout';
import PaymentScreen from './pages/PaymentScreen';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import ContactSuccess from './components/ContactSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { ThemeProvider } from './components/ThemeContext';
import AnimatedLayout from './components/AnimatedLayout';
import './App.css';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('your_publishable_key');

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Elements stripe={stripePromise}>
          <AnimatedLayout>            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/contact-success" element={<ContactSuccess />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </AnimatedLayout>
        </Elements>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
