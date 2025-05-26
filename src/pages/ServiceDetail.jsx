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
  };  const calculatePrice = () => {
    let basePrice = parseInt(service.info.pricing.replace(/[^0-9]/g, ''));
    let totalPrice = basePrice;
    const addons = [];

    if (service.slug === 'basic-drone-photography') {
      if (selectedOptions.photos > 0) {
        const price = selectedOptions.photos * 25; // $25 per additional photo
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.photos} additional aerial photos`,
          price: price
        });
      }
      if (selectedOptions.groundShots) {
        totalPrice += 100;
        addons.push({
          name: 'Ground-Level Photography',
          price: 100
        });
      }
    }
    
    else if (service.slug === 'standard-photo-video') {
      if (selectedOptions.photos > 0) {
        const price = selectedOptions.photos * 25; // $25 per additional photo
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.photos} additional photos`,
          price: price
        });
      }
      if (selectedOptions.twilight) {
        totalPrice += 200;
        addons.push({
          name: 'Twilight/Sunset Photos',
          price: 200
        });
      }
      if (selectedOptions.aerials) {
        totalPrice += 150;
        addons.push({
          name: 'Additional Aerial Shots',
          price: 150
        });
      }
    }
    
    else if (service.slug === 'premium-full-production') {
      if (selectedOptions.video) {
        totalPrice += 300; // Extended video coverage
        addons.push({
          name: 'Extended Video Coverage',
          price: 300
        });
      }
      if (selectedOptions.aerials) {
        totalPrice += 200; // Additional property coverage
        addons.push({
          name: 'Additional Property Coverage',
          price: 200
        });
      }
    }

    // Rush service fee applies to all packages
    if (selectedOptions.turnaround === "rush") {
      totalPrice += 100;
      addons.push({
        name: 'Rush delivery - 24 hours',
        price: 100
      });
    }

    // Save selected addons to localStorage
    localStorage.setItem(`selected_addons_${service.slug}`, JSON.stringify(addons));
    
    // Log the calculation for debugging
    console.log(`Calculated price: $${totalPrice} with addons:`, addons);

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
            </div>            {isCustomize ? (
              <div className="customization-section">
                <div className="included-features">                  <h3>Included in Package:</h3>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}><span className="feature-check"></span>{feature}</li>
                    ))}
                  </ul>
                </div>                <h3>Customize Your Package</h3>                {/* Basic Package Options */}
                {service.slug === 'basic-drone-photography' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.groundShots}
                          onChange={(e) => handleOptionChange('groundShots', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Ground-Level Photography (+$100)
                      </label>
                    </div>
                    <div className="option-group select-container">
                      <select 
                        value={selectedOptions.photos}
                        onChange={(e) => handleOptionChange('photos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>Additional Aerial Photos</option>
                        <option value={5}>+5 photos ($75)</option>
                        <option value={10}>+10 photos ($150)</option>
                        <option value={15}>+15 photos ($225)</option>
                      </select>
                    </div>
                    <div className="option-group select-container">
                      <div className="select-label">Turnaround Time</div>
                      <select
                        value={selectedOptions.turnaround}
                        onChange={(e) => handleOptionChange('turnaround', e.target.value)}
                        className="fancy-select"
                      ><option value="standard">24 hours</option>
                        <option value="rush">Priority Service (&lt; 24 hours) (+$100)</option>
                      </select>
                    </div>
                  </>
                )}{/* Standard Package Options */}
                {service.slug === 'standard-photo-video' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.twilight}
                          onChange={(e) => handleOptionChange('twilight', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Twilight/Sunset Photos (+$200)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.aerials}
                          onChange={(e) => handleOptionChange('aerials', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Additional Aerial Shots (+$150)
                      </label>
                    </div>
                    <div className="option-group select-container">
                      <select 
                        value={selectedOptions.photos}
                        onChange={(e) => handleOptionChange('photos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>No Additional Photos</option>
                        <option value={10}>+10 photos ($250)</option>
                        <option value={15}>+15 photos ($375)</option>                        <option value={20}>+20 photos ($500)</option>
                      </select>
                    </div>
                    <div className="option-group select-container">
                      <div className="select-label">Turnaround Time</div>
                      <select
                        value={selectedOptions.turnaround}
                        onChange={(e) => handleOptionChange('turnaround', e.target.value)}
                        className="fancy-select"
                      ><option value="standard">24 hours</option>
                        <option value="rush">Priority Service (&lt; 24 hours) (+$100)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Premium Package Options */}
                {service.slug === 'premium-full-production' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.video}
                          onChange={(e) => handleOptionChange('video', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Extended Video Coverage (+$300)
                      </label>
                    </div>                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.aerials}
                          onChange={(e) => handleOptionChange('aerials', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Additional Property Coverage (+$200)
                      </label>
                    </div>

                    <div className="option-group select-container">
                      <div className="select-label">Turnaround Time</div>
                      <select
                        value={selectedOptions.turnaround}
                        onChange={(e) => handleOptionChange('turnaround', e.target.value)}
                        className="fancy-select"
                      ><option value="standard">24 hours</option>
                        <option value="rush">Priority Service (&lt; 24 hours) (+$100)</option>
                      </select>
                    </div>                  </>
                )}
                
                <div className="price-summary">
                  <h3>Total Price: ${calculatePrice()}</h3>
                  <p>Base package: {service.info.pricing}</p>
                  <motion.button
                    className="book-now-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const finalPrice = calculatePrice();
                      // Navigate to contact page with both service and price parameters
                      navigate(`/contact?service=${service.slug}&customPrice=${finalPrice}`);
                    }}
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
                      >                        <span className="feature-check"></span>
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
          </div>          <div className="service-sidebar">
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