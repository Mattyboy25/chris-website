import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Services.css';
import '../styles/ServiceDetail.css';
import PageTransition from '../components/PageTransition';
import { FaArrowLeft, FaCheck, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { services, iconMap } from '../data/servicesData';

function Services() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Create refs for each service section and video
  const serviceSectionRefs = services.map(() => useRef(null));
  const videoRefs = services.map(() => useRef(null));
  const placeholderRefs = services.map(() => useRef(null));
  
  // Track which services are in view and which videos are loaded
  const [visibleServices, setVisibleServices] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});
  
  // State to track the expanded service
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  
  // Function to load a video when it's visible
  const loadVideo = useCallback((index, serviceId) => {
    if (loadedVideos[serviceId]) return; // Skip if already loaded
    
    const videoElement = videoRefs[index]?.current;
    const placeholderElement = placeholderRefs[index]?.current;
    const videoContainer = videoElement?.parentElement;
    
    if (videoElement) {
      // Set source dynamically to start loading
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      // Check if source is already set
      if (!videoElement.src) {
        // Create source element programmatically
        const sourceElement = document.createElement('source');
        sourceElement.src = service.videoSrc;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);
        
        // Load the video - this will now trigger the loadeddata event
        videoElement.load();
      }

      // Handle when video is loaded
      const handleLoaded = () => {
        if (placeholderElement) {
          placeholderElement.classList.add('hidden');
        }
        videoElement.classList.add('loaded');
        if (videoContainer) {
          videoContainer.classList.add('loaded');
        }
        setLoadedVideos(prev => ({ ...prev, [serviceId]: true }));
        
        // Play the video if this is the expanded service
        if (expandedServiceId === serviceId || 
            (serviceSectionRefs[index].current && 
            serviceSectionRefs[index].current.classList.contains('hovered'))) {
          videoElement.play().catch(err => console.error("Video play error:", err));
        }
        
        // Remove this listener after first load
        videoElement.removeEventListener('loadeddata', handleLoaded);
      };
      
      videoElement.addEventListener('loadeddata', handleLoaded);
    }
  }, [loadedVideos, expandedServiceId]);
  
  // Handle service click to expand in place
  const handleServiceClick = (service, index) => {
    // Immediately load the video if not already loaded
    loadVideo(index, service.id);
    
    if (expandedServiceId === service.id) {
      // If already expanded, collapse it
      setExpandedServiceId(null);
    } else {
      // First set the expanded service ID to the new service
      setExpandedServiceId(service.id);
      
      // Wait for the content to render and animation to finish, then scroll
      setTimeout(() => {
        // Find the service banner
        const bannerElement = document.querySelector(`.service-banner[data-service-id="${service.id}"]`);
        
        if (bannerElement) {
          // Calculate the position of the banner
          const headerOffset = 260; // Height of navbar
          const bannerPosition = bannerElement.getBoundingClientRect().top;
          const offsetPosition = bannerPosition + window.pageYOffset;
          
          // Scroll to the banner first to ensure consistent positioning
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Then after a short delay, scroll to the expanded detail with proper offset
          setTimeout(() => {
            const detailElement = document.querySelector(`.service-banner[data-service-id="${service.id}"] + .in-place-service-detail`);
            if (detailElement) {
              const detailPosition = detailElement.getBoundingClientRect().top;
              const finalPosition = detailPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
              });
            }
          }, 400); // Give time for the expansion animation to complete
        }
      }, 50);
      
      // Update URL without navigating (for bookmark/sharing)
      window.history.pushState(null, '', `/services/${service.slug}`);
    }
  };
  
  // Handle closing expanded service
  const handleCloseExpanded = () => {
    setExpandedServiceId(null);
    // Reset URL
    window.history.pushState(null, '', '/services');
  };

  // Handle hover to play/pause video
  const handleServiceHover = useCallback((index, serviceId, isHovering) => {
    const sectionElement = serviceSectionRefs[index]?.current;
    const videoElement = videoRefs[index]?.current;
    const videoContainer = videoElement?.parentElement;
    
    if (!videoElement || expandedServiceId === serviceId) return;
    
    if (isHovering) {
      // Add hovered class for future reference
      if (sectionElement) {
        sectionElement.classList.add('hovered');
      }
      
      // Load the video if not loaded yet
      if (!loadedVideos[serviceId]) {
        loadVideo(index, serviceId);
      } else {
        // Video is already loaded, play it
        videoElement.play().catch(err => console.error("Video play error:", err));
        if (videoContainer) videoContainer.style.opacity = 1;
      }
    } else {
      // Remove hovered class
      if (sectionElement) {
        sectionElement.classList.remove('hovered');
      }
      
      // Pause the video on mouse leave
      videoElement.pause();
      // Don't hide the video container when leaving if it's loaded
      // - this allows the placeholder to stay hidden and the video to remain visible
    }
  }, [expandedServiceId, loadedVideos, loadVideo]);

  // Check if sections are in view with improved threshold
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 300px 0px', // Load videos before they come into view
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        const serviceId = parseInt(entry.target.dataset.serviceId, 10);
        
        if (entry.isIntersecting) {
          // Mark as visible
          setVisibleServices(prev => ({ ...prev, [serviceId]: true }));
          
          // Find the index of this service
          const index = services.findIndex(s => s.id === serviceId);
          if (index !== -1) {
            // Start loading the video with a slight delay to prioritize visible content
            setTimeout(() => {
              loadVideo(index, serviceId);
            }, index * 200); // Stagger loading by 200ms per item
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    serviceSectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      serviceSectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [loadVideo]);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  return (
    <PageTransition>
      <div className="services-page" ref={containerRef}>
        <div className="services-intro">
          <div className="container">
          </div>
        </div>

        {/* Service Banners */}
        <div className="services-banners">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const inView = useInView(serviceSectionRefs[index], { once: false, amount: 0.3 });
            const isExpanded = expandedServiceId === service.id;
            
            return (
              <React.Fragment key={service.id}>
                <section 
                  ref={serviceSectionRefs[index]}
                  data-service-id={service.id}
                  className={`service-banner ${isEven ? 'text-left' : 'text-right'} 
                              ${visibleServices[service.id] ? 'visible' : ''} 
                              ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => handleServiceClick(service, index)}
                  onMouseEnter={() => handleServiceHover(index, service.id, true)}
                  onMouseLeave={() => handleServiceHover(index, service.id, false)}
                >
                  {/* Placeholder image - use service-specific images that match video content */}
                  <div 
                    ref={placeholderRefs[index]} 
                    className="video-placeholder"
                    style={{ 
                      backgroundImage: `url('/images/${service.slug}-placeholder.jpg')`,
                      backgroundPosition: 'center center'
                    }}
                  ></div>
                  
                  {/* Video background container */}
                  <div className={`banner-video-container ${loadedVideos[service.id] ? 'loaded' : ''}`}>
                    <video
                      ref={videoRefs[index]}
                      className={`banner-background-video ${loadedVideos[service.id] ? 'loaded' : ''}`}
                      muted
                      loop
                      playsInline
                      preload="none" 
                    >
                      {/* Source will be added dynamically */}
                    </video>
                  </div>
                  
                  <div className="banner-overlay"></div>
                  <div className={`banner-content ${isEven ? 'content-left' : 'content-right'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -80 : 80 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="banner-text"
                    >
                      <span className="service-icon">
                        {service.iconName && iconMap[service.iconName] && React.createElement(iconMap[service.iconName])}
                      </span>
                      <h2>{service.title}</h2>
                      <p>{service.shortDesc}</p>
                      
                      <ul className="service-feature-list">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -20 : 20 }}
                            transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                          >
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      
                      <motion.button 
                        className="service-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from triggering
                          handleServiceClick(service, index);
                        }}
                      >
                        {isExpanded ? 'Close Details' : 'Learn More'}
                      </motion.button>
                    </motion.div>
                  </div>
                </section>
                
                {/* Expandable Service Detail Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      className="in-place-service-detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {/* Use the already loaded video from the service banner */}
                      {loadedVideos[service.id] ? (
                        <video 
                          className="service-detail-video" 
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                        >
                          <source src={service.videoSrc} type="video/mp4" />
                        </video>
                      ) : (
                        <div 
                          className="video-placeholder"
                          style={{ 
                            backgroundImage: placeholderRefs[index]?.current?.style.backgroundImage || 
                                            `url('/images/service-placeholder-${index % 3 + 1}.jpg')` 
                          }}
                        ></div>
                      )}
                      
                      <div className="detail-content-wrapper">
                        <div className="detail-header">
                          <motion.button 
                            className="back-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCloseExpanded()}
                          >
                            <FaArrowLeft /> Close Details
                          </motion.button>
                          <h1>{service.title}</h1>
                        </div>
                        
                        <div className="service-detail-content">
                          <div className="service-detail-main">
                            <div className="service-detail-intro">
                              <p>{service.fullDesc}</p>
                            </div>
                            
                            <div className="service-key-features">
                              <h2>Key Features</h2>
                              <ul className="detail-feature-list">
                                {service.features.map((feature, idx) => (
                                  <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
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
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (step.step - 1) * 0.1 }}
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
                              transition={{ delay: 0.4 }}
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
                              transition={{ delay: 0.5 }}
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
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <h2>Ready to Elevate Your Perspective?</h2>
                          <p>Our professional drone pilots are ready to bring your vision to life with cutting-edge equipment and years of expertise.</p>
                          <motion.button 
                            className="cta-btn-large"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/contact')}
                          >
                            Contact Us Today
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </div>

        {/* Custom Services Section */}
        <div className="custom-services">
          <div className="container">
            <motion.div 
              className="custom-services-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Need a Custom Solution?</h2>
              <p>
                Don't see exactly what you're looking for? We specialize in creating custom drone packages
                tailored to your specific requirements. Contact us today to discuss your project needs.
              </p>
              <motion.button 
                className="contact-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Floating Book Now Button */}
        <Link to="/contact" className="floating-book-btn">Book now</Link>
      </div>
    </PageTransition>
  );
}

export default Services;