import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Services.css';
import PageTransition from '../components/PageTransition';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import { services, iconMap } from '../data/servicesData';

function Services() {const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        setVideoError(true);
      });
    }
  }, []);

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
    setVideoError(true);
  };  const navigate = useNavigate();
  const handlePackageClick = (packageData) => {
    navigate(`/services/${packageData.slug}?customize=true`);
  };

  return (
    <PageTransition>
      <div className="services-page">
        <div className="services-hero">
          {!videoError ? (
            <video
              ref={videoRef}
              className="services-hero-video"
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
            >
              <source src="/videos/Real%20Estate%20Summergrove.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="services-fallback-bg"></div>
          )}
          <div className="services-hero-overlay"></div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Real Estate Drone Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Professional aerial photography and videography packages tailored for your property
          </motion.p>
        </div>

        <div className="services-container">
          <div className="services-intro">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Choose Your Perfect Package
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              From basic aerial shots to comprehensive property showcases, we have the perfect solution for your real estate marketing needs.
            </motion.p>
          </div>

          <div className="services-grid">            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {index === 1 && <div className="popular-tag">Most Popular</div>}
                <span className="service-icon">
                  {service.iconName && iconMap[service.iconName] && React.createElement(iconMap[service.iconName])}
                </span>
                <h3 className="service-title">{service.title}</h3>
                <div className="service-price">{service.info.pricing}</div>
                <p className="service-description">{service.shortDesc}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                    >
                      <span className="feature-bullet"><FaCheck size={12} /></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Button clicked for:", service.title);
                    handlePackageClick(service);
                  }} 
                  className="service-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started <FaArrowRight style={{ marginLeft: '8px' }} />
                </motion.button>
              </motion.div>
            ))}
          </div>          <motion.div
            className="service-card custom-quote-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="service-title">Custom Package</h3>
            <div className="service-price">Tailored Pricing</div>
            <p className="service-description">Don't see what you're looking for? Let us create a custom package that perfectly matches your needs.</p>            <motion.button 
              onClick={() => navigate('/contact')}
              className="service-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Quote <FaArrowRight style={{ marginLeft: '8px' }} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Services;