import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import '../styles/Legal.css';

function PrivacyPolicy() {
  return (
    <PageTransition>
      <div className="legal-page">
        <div className="legal-container glass-section">
          <motion.div
            className="legal-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Privacy Policy</h1>
            <p className="effective-date">Effective Date: June 1, 2025</p>
            <p className="company-details">
              Business Name: Upward Drone Services LLC<br />
              Contact: <a href="mailto:contact@upwarddroneservices.com">contact@upwarddroneservices.com</a>
            </p>
            
            <p className="policy-intro">
              At Upward Drone Services, your privacy is important to us. This policy outlines how we collect, use, and protect your information when you use our website or services.
            </p>
            
            <h2>1. Information We Collect</h2>
            <p>We may collect:</p>
            <ul>
              <li>Name, email, phone number, and business details you provide via contact forms</li>
              <li>Location and property details for service requests</li>
              <li>Website usage data through cookies or analytics tools</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information to:</p>
            <ul>
              <li>Provide and manage our drone photography and video services</li>
              <li>Respond to inquiries or schedule projects</li>
              <li>Improve our website and customer experience</li>
              <li>Send occasional updates or promotions (with your consent)</li>
            </ul>
            
            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal data. We may share information with trusted partners only as necessary to fulfill services or comply with legal obligations.
            </p>
            
            <h2>4. Your Rights</h2>
            <p>You can:</p>
            <ul>
              <li>Request to see or delete your personal data</li>
              <li>Opt out of any promotional communications</li>
            </ul>
            <p>
              To make a request, email us at <a href="mailto:contact@upwarddroneservices.com">contact@upwarddroneservices.com</a>.
            </p>
            
            <h2>5. Data Security</h2>
            <p>
              We take appropriate measures to protect your information but cannot guarantee 100% security in all situations.
            </p>
            
            <h2>6. Updates</h2>
            <p>
              We may update this policy periodically. Please check this page for the latest version.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default PrivacyPolicy;
