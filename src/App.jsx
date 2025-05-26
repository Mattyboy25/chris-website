import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { ThemeProvider } from './components/ThemeContext';
import AnimatedLayout from './components/AnimatedLayout';
import './App.css';
// Remove unused imports since we're no longer defining icons here
// import { FaCamera, FaVideo, FaHome, FaBuilding, FaSearchPlus, FaRing } from 'react-icons/fa';

function App() {
  // Remove the hardcoded services array as we're now importing it from servicesData.js

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <AnimatedLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </AnimatedLayout>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
