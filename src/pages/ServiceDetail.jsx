import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaCheck, FaClock, FaMapMarkerAlt, FaMoneyBillWave
} from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import { services, iconMap } from '../data/servicesData';
import PackageModal from '../components/PackageModal';
import '../styles/ServiceDetail.css';

function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = services.find(s => s.slug === slug);
  const videoRef = React.useRef(null);

  const handleVideoHover = (isHovering) => {
    if (videoRef.current) {
      if (isHovering) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  };

  // If service not found, show error
  if (!service) {
    return (
      <PageTransition>
        <div className="service-detail-page">
          <div className="service-not-found">
            <h1>Service Not Found</h1>
            <p>The service you're looking for doesn't exist or has been removed.</p>
            <motion.button 
              className="service-btn back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }
  const videoSrc = service.slug === 'real-estate-tours' ? '/videos/Real%20Estate%20Summergrove.mp4' : service.videoSrc;

  return (
    <PageTransition>
      <div className="service-detail-page">
        <div className="service-detail-container">
          <div className="back-section">
            <motion.button 
              className=" back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
          
          <div className="service-detail-content">
            <div className="service-detail-main">
              <div className="service-detail-intro">
                <h2>{service.title}</h2>
                <p>{service.fullDesc}</p>
              </div>
              
              <div className="service-detail-video"
                   onMouseEnter={() => handleVideoHover(true)}
                   onMouseLeave={() => handleVideoHover(false)}>
                <video 
                  ref={videoRef}
                  className="detail-video" 
                  muted 
                  loop 
                  playsInline
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="service-key-features">
                <h2>Key Features</h2>
                <ul className="detail-feature-list">
                  {service.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="feature-check"><FaCheck /></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="service-detail-section">
                <h2>Our Process</h2>
                <div className="service-process">
                  {service.process.map((step) => (
                    <motion.div 
                      className="process-step"
                      key={step.step}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: (step.step - 1) * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="step-number">{step.step}</div>
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="service-sidebar">
              <motion.div 
                className="service-cta-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3>Ready to Get Started?</h3>
                <p>Contact us today to discuss your project requirements and receive a customized quote.</p>
                <motion.button 
                  className="cta-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                >
                  Request a Quote
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="service-info-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3>Service Details</h3>
                <div className="info-item">
                  <span><FaClock /> Turnaround Time</span>
                  <span>{service.info.turnaround}</span>
                </div>
                <div className="info-item">
                  <span><FaMapMarkerAlt /> Coverage</span>
                  <span>{service.info.coverage}</span>
                </div>
                <div className="info-item">
                  <span><FaMoneyBillWave /> Pricing</span>
                  <span>{service.info.pricing}</span>
                </div>
                <div className="info-item">
                  <span>Availability</span>
                  <span>{service.info.availability}</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="service-detail-cta"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>Ready to Elevate Your Perspective?</h2>
            <p>Our professional drone pilots are ready to bring your vision to life with cutting-edge equipment and years of expertise.</p>
            <div className="cta-buttons">
              <motion.button 
                className="cta-btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
              >
                View Full Package Details
              </motion.button>
              <motion.button 
                className="cta-btn-large secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
              >
                Contact Us Today
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <PackageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        package={service}
      />
    </PageTransition>
  );
}

export default ServiceDetail;