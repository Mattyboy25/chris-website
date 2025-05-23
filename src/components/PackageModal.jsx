import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/PackageModal.css';

const PackageModal = ({ isOpen, onClose, package: packageData }) => {
  const [mounted, setMounted] = React.useState(false);

  // Handle mounting animation
  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && packageData && mounted && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content glass-card"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>&times;</button>
            
            <div className="modal-header">
              <h2>{packageData.title}</h2>
              <div className="package-price">{packageData.info.pricing}</div>
            </div>

            <div className="modal-body">
              <p className="package-description">{packageData.fullDesc || packageData.shortDesc}</p>
              
              <div className="features-section">
                <h3>Package Features</h3>
                <ul className="features-list">
                  {packageData.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="feature-check">✓</span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="package-info">
                <div className="info-item">
                  <span className="info-label">Turnaround Time:</span>
                  <span>{packageData.info.turnaround}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Coverage Area:</span>
                  <span>{packageData.info.coverage}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Availability:</span>
                  <span>{packageData.info.availability}</span>
                </div>
              </div>

              <div className="customization-section">
                <h3>Customize Your Package</h3>
                <p>Need to adjust this package to better suit your needs? We can customize any package to match your specific requirements.</p>
              </div>
            </div>

            <div className="modal-footer">
              <div className="button-container">
                <Link 
                  to={`/contact?service=${packageData.slug}`}
                  className="book-now-btn"
                >
                  Book Now
                </Link>                <Link 
                  to={`/services/${packageData.slug}?customize=true`}
                  className="customize-btn"
                  onClick={onClose}
                >
                  Customize Package
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackageModal;
