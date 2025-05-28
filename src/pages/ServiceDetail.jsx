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
  const [isModalOpen, setIsModalOpen] = useState(false);  const [selectedOptions, setSelectedOptions] = useState({
    photos: 0,
    video: false,
    aerials: false,
    groundShots: false,
    groundPhotos: 0,
    rawFootage: false,
    brandedVideo: false,
    twilight: false,
    droneVideo: false,
    backgroundMusic: "none", // none, basic, premium
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
    const addons = [];    if (service.slug === 'launch-package') {
      if (selectedOptions.photos > 0) {
        const price = selectedOptions.photos * 25; // $25 per additional photo
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.photos} additional aerial photos`,
          price: price
        });
      }      if (selectedOptions.groundPhotos > 0) {
        let price = 0;
        if (selectedOptions.groundPhotos === 10) price = 75;
        if (selectedOptions.groundPhotos === 15) price = 150;
        if (selectedOptions.groundPhotos === 20) price = 225;
        
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.groundPhotos} additional ground photos`,
          price: price
        });
      }
      if (selectedOptions.droneVideo) {
        totalPrice += 50;
        addons.push({
          name: 'Drone Video (30 seconds)',
          price: 50
        });
      }
      if (selectedOptions.backgroundMusic === 'basic') {
        totalPrice += 25;
        addons.push({
          name: 'Background Music (1 royalty-free track)',
          price: 25
        });
      }
      if (selectedOptions.backgroundMusic === 'premium') {
        totalPrice += 50;
        addons.push({
          name: 'Background Music (synced to beat with transitions)',
          price: 50
        });
      }
      if (selectedOptions.rawFootage) {
        totalPrice += 75;
        addons.push({
          name: 'Raw Aerial Footage',
          price: 75
        });
      }
      if (selectedOptions.brandedVideo) {
        totalPrice += 50;
        addons.push({
          name: 'Branded Video',
          price: 50
        });
      }
    }    else if (service.slug === 'elevate-package') {
      if (selectedOptions.photos > 0) {
        const price = selectedOptions.photos * 25; // $25 per additional photo
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.photos} additional photos`,
          price: price
        });
      }
      if (selectedOptions.groundPhotos > 0) {
        let price = 0;
        if (selectedOptions.groundPhotos === 10) price = 75;
        if (selectedOptions.groundPhotos === 15) price = 150;
        if (selectedOptions.groundPhotos === 20) price = 225;
        
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.groundPhotos} additional ground photos`,
          price: price
        });
      }
      if (selectedOptions.droneVideo) {
        totalPrice += 100;
        addons.push({
          name: 'Drone Video (30 seconds)',
          price: 100
        });
      }
      if (selectedOptions.backgroundMusic === 'premium') {
        totalPrice += 50;
        addons.push({
          name: 'Background Music (synced to beat with transitions)',
          price: 50
        });
      }
      if (selectedOptions.rawFootage) {
        totalPrice += 150;
        addons.push({
          name: 'Raw Footage',
          price: 150
        });
      }
      if (selectedOptions.brandedVideo) {
        totalPrice += 50;
        addons.push({
          name: 'Branded Video',
          price: 50
        });
      }
    }    else if (service.slug === 'skyline-premium') {
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
      if (selectedOptions.groundPhotos > 0) {
        let price = 0;
        if (selectedOptions.groundPhotos === 10) price = 75;
        if (selectedOptions.groundPhotos === 15) price = 150;
        if (selectedOptions.groundPhotos === 20) price = 225;
        
        totalPrice += price;
        addons.push({
          name: `+${selectedOptions.groundPhotos} additional ground photos`,
          price: price
        });
      }
      if (selectedOptions.droneVideo) {
        totalPrice += 150;
        addons.push({
          name: 'Drone Video (30 seconds)',
          price: 150
        });
      }
      if (selectedOptions.backgroundMusic === 'premium') {
        totalPrice += 50;
        addons.push({
          name: 'Background Music (synced to beat with transitions)',
          price: 50
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
                </div>                <h3>Customize Your Package</h3>                {/* Launch Package Options */}                {service.slug === 'launch-package' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.droneVideo}
                          onChange={(e) => handleOptionChange('droneVideo', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Drone Video (30 seconds) (+$50)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'basic'}
                          onChange={() => handleOptionChange('backgroundMusic', 'basic')}
                        />
                        <span className="feature-check"></span>
                        Background Music (+$25) - 1 royalty-free track, no custom edits
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'premium'}
                          onChange={() => handleOptionChange('backgroundMusic', 'premium')}
                        />
                        <span className="feature-check"></span>
                        Background Music (+$50) - Synced to beat with transitions
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'none'}
                          onChange={() => handleOptionChange('backgroundMusic', 'none')}
                        />
                        <span className="feature-check"></span>
                        No Background Music
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.rawFootage}
                          onChange={(e) => handleOptionChange('rawFootage', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Raw Aerial Footage (+$75)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.brandedVideo}
                          onChange={(e) => handleOptionChange('brandedVideo', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Branded Video (+$50)
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
                      <select 
                        value={selectedOptions.groundPhotos}
                        onChange={(e) => handleOptionChange('groundPhotos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>Additional Ground Photos</option>
                        <option value={10}>+10 photos ($75)</option>
                        <option value={15}>+15 photos ($150)</option>
                        <option value={20}>+20 photos ($225)</option>
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
                )}{/* Elevate Package Options */}                {service.slug === 'elevate-package' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.droneVideo}
                          onChange={(e) => handleOptionChange('droneVideo', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Drone Video (30 seconds) (+$100)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'premium'}
                          onChange={() => handleOptionChange('backgroundMusic', 'premium')}
                        />
                        <span className="feature-check"></span>
                        Background Music (+$50) - Synced to beat with transitions
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'none'}
                          onChange={() => handleOptionChange('backgroundMusic', 'none')}
                        />
                        <span className="feature-check"></span>
                        No Background Music
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.rawFootage}
                          onChange={(e) => handleOptionChange('rawFootage', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Raw Footage (+$150)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.brandedVideo}
                          onChange={(e) => handleOptionChange('brandedVideo', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Branded Video (+$50)
                      </label>
                    </div><div className="option-group select-container">
                      <select 
                        value={selectedOptions.photos}
                        onChange={(e) => handleOptionChange('photos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>Additional Aerial Photos</option>
                        <option value={10}>+10 photos ($150)</option>
                        <option value={15}>+15 photos ($250)</option>                        <option value={20}>+20 photos ($300)</option>
                      </select>
                    </div>
                    <div className="option-group select-container">
                      <select 
                        value={selectedOptions.groundPhotos}
                        onChange={(e) => handleOptionChange('groundPhotos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>Additional Ground Photos</option>
                        <option value={10}>+10 photos ($75)</option>
                        <option value={15}>+15 photos ($150)</option>
                        <option value={20}>+20 photos ($225)</option>
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

                {/* Skyline Premium Options */}                {service.slug === 'skyline-premium' && (
                  <>
                    <div className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.droneVideo}
                          onChange={(e) => handleOptionChange('droneVideo', e.target.checked)}
                        />
                        <span className="feature-check"></span>
                        Drone Video (30 seconds) (+$150)
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'premium'}
                          onChange={() => handleOptionChange('backgroundMusic', 'premium')}
                        />
                        <span className="feature-check"></span>
                        Background Music (+$50) - Synced to beat with transitions
                      </label>
                    </div>
                    <div className="option-group">
                      <label>
                        <input
                          type="radio"
                          name="backgroundMusic"
                          checked={selectedOptions.backgroundMusic === 'none'}
                          onChange={() => handleOptionChange('backgroundMusic', 'none')}
                        />
                        <span className="feature-check"></span>
                        No Background Music
                      </label>
                    </div>
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
                      <select 
                        value={selectedOptions.groundPhotos}
                        onChange={(e) => handleOptionChange('groundPhotos', parseInt(e.target.value))}
                        className="fancy-select"
                      >
                        <option value={0}>Additional Ground Photos</option>
                        <option value={10}>+10 photos ($75)</option>
                        <option value={15}>+15 photos ($150)</option>
                        <option value={20}>+20 photos ($225)</option>
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
                    </div>                  </>
                )}
                  <div className="price-summary">
                  <h3>Total Price: ${calculatePrice()}</h3>
                  <p>Base package: {service.info.pricing}</p>
                  <div className="button-container">
                    <motion.button
                      className="back-to-services-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/services')}
                    >
                      <FaArrowLeft /> Back to Services
                    </motion.button>
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