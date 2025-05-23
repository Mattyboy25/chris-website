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
  const [selectedOptions, setSelectedOptions] = useState({
    photos: 0,
    video: false,
    aerials: false,
    groundShots: false,
    twilight: false,
    turnaround: "standard"
  });
  
  const service = services.find(s => s.slug === slug);
  const videoRef = React.useRef(null);
  const location = window.location;
  const isCustomize = new URLSearchParams(location.search).get('customize') === 'true';

  const handleOptionChange = (option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const calculatePrice = () => {
    let basePrice = parseInt(service.info.pricing.replace(/[^0-9]/g, ''));
    let totalPrice = basePrice;

    if (selectedOptions.photos > 0) {
      totalPrice += selectedOptions.photos * 25; // $25 per additional photo
    }
    if (selectedOptions.video) totalPrice += 200;
    if (selectedOptions.aerials) totalPrice += 150;
    if (selectedOptions.groundShots) totalPrice += 100;
    if (selectedOptions.twilight) totalPrice += 200;
    if (selectedOptions.turnaround === "rush") totalPrice += 100;

    return totalPrice;
  };

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
        <div className="back-section">
          <motion.button 
            className="back-btn"
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

            {isCustomize ? (
              <div className="customization-section">
                <h3>Customize Your Package</h3>
                
                <div className="option-group">
                  <label>Additional Photos</label>
                  <select 
                    value={selectedOptions.photos}
                    onChange={(e) => handleOptionChange('photos', parseInt(e.target.value))}
                  >
                    <option value={0}>No additional photos</option>
                    <option value={5}>+5 photos ($125)</option>
                    <option value={10}>+10 photos ($250)</option>
                    <option value={15}>+15 photos ($375)</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.video}
                      onChange={(e) => handleOptionChange('video', e.target.checked)}
                    />
                    Add Video Package (+$200)
                  </label>
                </div>

                <div className="option-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.aerials}
                      onChange={(e) => handleOptionChange('aerials', e.target.checked)}
                    />
                    Additional Aerial Shots (+$150)
                  </label>
                </div>

                <div className="option-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.groundShots}
                      onChange={(e) => handleOptionChange('groundShots', e.target.checked)}
                    />
                    Ground-Level Photography (+$100)
                  </label>
                </div>

                <div className="option-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.twilight}
                      onChange={(e) => handleOptionChange('twilight', e.target.checked)}
                    />
                    Twilight/Sunset Photos (+$200)
                  </label>
                </div>

                <div className="option-group">
                  <label>Turnaround Time</label>
                  <select
                    value={selectedOptions.turnaround}
                    onChange={(e) => handleOptionChange('turnaround', e.target.value)}
                  >
                    <option value="standard">Standard (48-72 hours)</option>
                    <option value="rush">Rush Service - 24 hours (+$100)</option>
                  </select>
                </div>

                <div className="price-summary">
                  <h3>Total Price: ${calculatePrice()}</h3>
                  <p>Base package: {service.info.pricing}</p>
                  <motion.button
                    className="book-now-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/contact?service=${service.slug}&customPrice=${calculatePrice()}`)}
                  >
                    Book Custom Package
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
                onClick={() => navigate(`/contact?service=${service.slug}`)}
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
                <span><FaMoneyBillWave /> Starting at</span>
                <span>{service.info.pricing}</span>
              </div>
            </motion.div>
          </div>
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