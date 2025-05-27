import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaArrowRight, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/SkylinePremium.css';

function SkylinePremium() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        setVideoError(true);
      });
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
    setVideoError(true);
  };

  return (
    <PageTransition>
      <div className="skyline-premium-page">
        <div className="skyline-hero">
          {!videoError ? (
            <video
              ref={videoRef}
              className="skyline-hero-video"
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
            />
          ) : (
            <div className="video-fallback">Video not available</div>
          )}
          <div className="skyline-hero-overlay"></div>
          
          <div className="back-button-container">
            <motion.button 
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
          
          <motion.h1
            className="skyline-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Skyline Premium
          </motion.h1>
          <motion.p
            className="skyline-hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Elevate Your Content with Cinematic Production
          </motion.p>
        </div>

        <div className="skyline-content-container">
          <section className="skyline-intro-section">
            <motion.div
              className="skyline-intro"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Premium Visual Experience</h2>
              <p>
                Our Skyline Premium package delivers everything in the Elevate Package plus interior walkthrough footage, 
                property line overlays, social media optimized clips, and priority scheduling. Perfect for luxury real estate, 
                developers, and businesses with media teams.
              </p>
            </motion.div>
          </section>
          
          <section className="skyline-features-section">
            <h2>What's Included</h2>
            <div className="features-container">
              <div className="features-column">
                <h3>Elevate Package Included Plus:</h3>
                <ul className="feature-list">
                  <li><FaCheck /> 30 High-quality aerial shots</li>
                  <li><FaCheck /> 25 Ground-level photos</li>
                  <li><FaCheck /> 5 minute cinematic video tour</li>
                  <li><FaCheck /> Social Media Optimized Clips</li>
                  <li><FaCheck /> Virtual property tour</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="skyline-cta-section">
            <div className="cta-container">
              <div className="pricing-info">
                <h3>Premium Package</h3>
                <p className="price">$650</p>
                <p className="description">The ultimate property showcase experience</p>
              </div>
              <Link to="/services/skyline-premium?customize=true">
                <motion.button
                  className="cta-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Customize Your Package <FaArrowRight />
                </motion.button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default SkylinePremium;