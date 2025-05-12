import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Services.css';
import PageTransition from '../components/PageTransition';
import { FaCamera, FaVideo, FaHome, FaBuilding, FaSearchPlus, FaRing } from 'react-icons/fa';
import { services, iconMap } from '../data/servicesData';

function Services() {
  const navigate = useNavigate();
  
  // Service data now imported from servicesData.js

  // Create refs for each service section and video
  const serviceSectionRefs = services.map(() => useRef(null));
  const videoRefs = services.map(() => useRef(null));
  const containerRef = useRef(null);
  
  // Track which services are in view
  const [visibleServices, setVisibleServices] = useState({});

  // Handle navigation to service detail page using slug instead of ID
  const handleServiceClick = (slug) => {
    navigate(`/services/${slug}`);
  };

  // Create thumbnail images from video and handle hover
  useEffect(() => {
    services.forEach((service, index) => {
      const videoElement = videoRefs[index]?.current;
      const sectionElement = serviceSectionRefs[index]?.current;
      
      if (videoElement && sectionElement) {
        // Generate thumbnail from first frame
        videoElement.currentTime = 0.1;
        
        videoElement.addEventListener('loadeddata', function handleLoad() {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          
          const poster = canvas.toDataURL('image/jpeg');
          sectionElement.style.backgroundImage = `url(${poster})`;
          
          videoElement.removeEventListener('loadeddata', handleLoad);
        });
        
        // Handle hover to play/pause video
        sectionElement.addEventListener('mouseenter', () => {
          videoElement.play().catch(err => console.error("Video play error:", err));
        });
        
        sectionElement.addEventListener('mouseleave', () => {
          videoElement.pause();
          videoElement.currentTime = 0.1;
        });
      }
    });
    
    // Cleanup event listeners
    return () => {
      services.forEach((service, index) => {
        const sectionElement = serviceSectionRefs[index]?.current;
        if (sectionElement) {
          sectionElement.removeEventListener('mouseenter', () => {});
          sectionElement.removeEventListener('mouseleave', () => {});
        }
      });
    };
  }, []);

  // Check if sections are in view with improved threshold
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.15,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const serviceId = parseInt(entry.target.dataset.serviceId, 10);
          setVisibleServices(prev => ({ ...prev, [serviceId]: true }));
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
  }, []);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <PageTransition>
      <div className="services-page" ref={containerRef}>
        <motion.div 
          className="services-hero"
          style={{ 
            y: heroY,
            opacity: heroOpacity
          }}
        >
          <h1>Professional Drone Services</h1>
          <p>Elevate your perspective with our comprehensive range of aerial solutions</p>
        </motion.div>

        <div className="services-intro">
          <div className="container">
            <h2>How We Can Help You</h2>
            <p>
              At Upward Drone Services, we provide professional aerial photography, videography, and specialized 
              drone services for clients across various industries. Our FAA-certified pilots use cutting-edge 
              equipment to deliver stunning results that help you stand out.
            </p>
          </div>
        </div>

        <div className="services-banners">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const inView = useInView(serviceSectionRefs[index], { once: false, amount: 0.3 });
            
            return (
              <section 
                key={service.id}
                ref={serviceSectionRefs[index]}
                data-service-id={service.id}
                className={`service-banner ${isEven ? 'text-left' : 'text-right'} ${visibleServices[service.id] ? 'visible' : ''}`}
                onClick={() => handleServiceClick(service.slug)}
              >
                {/* Video background container */}
                <div className="banner-video-container">
                  <video
                    ref={videoRefs[index]}
                    className="banner-background-video"
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src={service.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
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
                    <p>{service.fullDesc}</p>
                    
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
                        handleServiceClick(service.slug);
                      }}
                    >
                      Learn More
                    </motion.button>
                  </motion.div>
                </div>
              </section>
            );
          })}
        </div>

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
      </div>
    </PageTransition>
  );
}

export default Services;