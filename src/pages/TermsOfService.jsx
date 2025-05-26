import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import '../styles/Legal.css';

function TermsOfService() {
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
            <h1>Terms of Service</h1>
            <p className="effective-date">Effective Date: June 1, 2025</p>
            
            <p className="policy-intro">
              Welcome to Upward Drone Services. By accessing or using our website, you agree to the following terms:
            </p>
            
            <h2>1. Services</h2>
            <p>
              We offer drone photography, video, and mapping services for real estate, construction, and commercial projects in Georgia and surrounding areas.
            </p>
            
            <h2>2. User Responsibilities</h2>
            <p>By using our site, you agree to:</p>
            <ul>
              <li>Provide accurate information when contacting us</li>
              <li>Not misuse or damage our website or content</li>
              <li>Comply with all local and federal laws when engaging our services</li>
            </ul>
            
            <h2>3. Intellectual Property</h2>
            <p>
              All content, photos, and videos on this site are the property of Upward Drone Services and may not be copied, reused, or distributed without permission.
            </p>
            
            <h2>4. Service Limitations</h2>
            <p>
              We reserve the right to decline projects that violate FAA regulations, local laws, or pose safety concerns.
            </p>
            
            <h2>5. Limitation of Liability</h2>
            <p>
              We strive to deliver high-quality services, but Upward Drone Services is not liable for any indirect damages or losses resulting from use of our site or services.
            </p>
            
            <h2>6. Changes to These Terms</h2>
            <p>
              We may update these terms at any time. Continued use of our site implies acceptance of any revised terms.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default TermsOfService;
