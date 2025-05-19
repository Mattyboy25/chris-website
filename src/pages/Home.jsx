import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/Home.css';

function Home() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [changingWord, setChangingWord] = useState('');
  const intervalRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);  
  const [isGlowing, setIsGlowing] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  const words = ['Inspiring', 'Superior', 'Upward'];
  const staticText = 'Drone Services';

  const handleTyping = useCallback(() => {
    const currentWord = words[wordIndex];
    
    if (isWaiting) return;

    if (!isDeleting) {
      // Typing - faster now
      if (charIndex < currentWord.length) {
        setChangingWord(currentWord.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      } else {
        // Finished typing word
        setIsWaiting(true);
        // Keep "Upward" displayed longer (5 seconds) than other words (2 seconds)
        const waitTime = currentWord === 'Upward' ? 3500 : 2000;
        
        if (currentWord === 'Upward') {
          setIsGlowing(true);
          setTimeout(() => setIsGlowing(false), 2500);
        }
        
        setTimeout(() => {
          setIsWaiting(false);
          if (currentWord !== 'Upward') {
            setIsDeleting(true);
          } else {
            setTimeout(() => {
              setIsDeleting(true);
            }, 3000);
          }
        }, waitTime);
      }
    } else {
      // Deleting - immediate with no extra delay
      if (charIndex > 0) {
        setChangingWord(currentWord.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [wordIndex, charIndex, isDeleting, words, isWaiting]);

  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScrollArrowVisibility = () => {
    const currentScrollY = window.scrollY;
    // Hide if scrolling down, show if scrolling up or near top
    setShowScrollArrow(currentScrollY < 50 || currentScrollY < lastScrollY);
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScrollArrowVisibility);
  return () => {
    window.removeEventListener('scroll', handleScrollArrowVisibility);
  };
}, []);


  useEffect(() => {
    // Faster typing/deletion speeds
    const typingSpeed = isDeleting ? 55 : 80; // Much faster now
    intervalRef.current = setInterval(handleTyping, typingSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleTyping, isDeleting]);

  // Handle video error and fallback to background image
  const handleVideoError = () => {
    setVideoError(true);
  };  

  // Play video only once when scrolled into view
  useEffect(() => {
    if (videoError) return;
    let hasPlayed = false;
    const handleScroll = () => {
      if (hasPlayed) return;
      const videoContainer = videoContainerRef.current;
      if (videoContainer) {
        const rect = videoContainer.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // Play video if not already playing
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play();
          }
          hasPlayed = true;
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videoError]);

  // Function to handle card hover effect with glassy overlay
  const handleCardMouseMove = (e) => {
    // Get the card element from the wrapper
    const wrapper = e.currentTarget;
    const card = wrapper.querySelector('.equipment-card');
    const imageContainer = wrapper.querySelector('.equipment-image-container');
    const specsOverlay = wrapper.querySelector('.equipment-specs-overlay');
    
    // Apply glowing shadow effect with smooth transition
    card.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
    card.style.boxShadow = '0 0 30px rgba(75, 182, 239, 0.5)';
    card.style.borderColor = 'rgba(75, 182, 239, 0.3)';
    
    // Apply blur to the image
    imageContainer.style.filter = 'blur(3px) brightness(0.7)';
    
    // Show the specs overlay
    specsOverlay.style.opacity = '1';
    
    // Add class to handle all child hover states
    wrapper.classList.add('is-hovering');
  };
  
  // Reset card when mouse leaves
  const handleCardMouseLeave = (e) => {
    const wrapper = e.currentTarget;
    const card = wrapper.querySelector('.equipment-card');
    const imageContainer = wrapper.querySelector('.equipment-image-container');
    const specsOverlay = wrapper.querySelector('.equipment-specs-overlay');
    
    // Remove hover effect - restore the original shadow with smooth transition
    card.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    if (document.body.classList.contains('light')) {
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.07)';
      card.style.borderColor = 'rgba(240, 240, 240, 0.8)';
    } else {
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      card.style.borderColor = 'rgba(75, 75, 90, 0.2)';
    }
    
    // Remove blur from the image
    imageContainer.style.filter = 'blur(0) brightness(1)';
    
    // Hide the specs overlay
    specsOverlay.style.opacity = '0';
    
    // Remove class
    wrapper.classList.remove('is-hovering');
  };

  // Animation variants for text and button
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: 0.3,  
        ease: "easeOut" 
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        delay: 0.6, 
        ease: "easeOut" 
      }
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 8px 20px rgba(75, 182, 239, 0.5)",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };
  const handleScrollClick = () => {
    // Add offset for navbar (80px)
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <PageTransition>
      <div className="home-wrapper">        
        <div className="hero-container">
          {!videoError ? (
            <div className="video-container" ref={videoContainerRef}>              
              <video 
                ref={videoRef}
                src="/videos/main-video.mp4"
                autoPlay 
                loop 
                muted 
                playsInline
                className="hero-video visible"                
                onError={handleVideoError}
              />
            </div>
          ) : (
            <div className="hero-fallback-bg"></div>
          )}
          <div className="hero-content">
            <div className="hero-titles">
              <motion.div 
                className="dynamic-title"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 className="hero-title">
                  <span className={`typing-text changing-word ${isGlowing ? 'glow' : ''}`}>
                    {changingWord}
                  </span>
                  <span className="static-text">{staticText}</span>
                </motion.h1>
              </motion.div>
              <motion.p 
                initial="hidden"
                animate="visible"
                variants={subtitleVariants}
                className="hero-subtitle"
              >
                Elevating Your Perspective
              </motion.p>
            </div>
              <motion.div 
              className="hero-btns"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              <motion.div className="button-group">
                <motion.div whileHover="hover">
                  <Link to="/contact" className="btn-primary glass-btn">
                    Book now
                  </Link>
                </motion.div>
                <motion.div whileHover="hover">
                  <Link to="/about" className="glass-btn-alt">
                    ABOUT US
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
            <div className={`scroll-arrow-container ${showScrollArrow ? 'visible' : 'hidden'}`}  onClick={handleScrollClick}>
          <div className="scroll-arrow">
            <FaChevronDown />
          </div>
        </div>
        </div>
          
        {/* Content that overlaps the video */}
        <div className="content-wrapper">
          {/* Combined Featured Services and About Section */}
          <section className="combined-section glass-section Home-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              {/* Services Part */}
              <div className="combined-services">
                <h2 className="section-title">Premium Drone Services</h2>
                <p className="section-description">
                  We specialize in creating breathtaking aerial content for real estate, events,
                  construction projects, and more. Our professional drone operators deliver stunning
                  footage that showcases your property or event from a whole new perspective.
                </p>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-home"></i>
                    </div>
                    <h3>Real Estate</h3>
                    <p>Showcase properties with stunning aerial views that highlight the entire property and surrounding area.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-camera"></i>
                    </div>
                    <h3>Events & Weddings</h3>
                    <p>Capture your special moments from angles never before possible.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <h3>Construction & Industrial</h3>
                    <p>Document progress and showcase completed projects with professional aerial documentation.</p>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="section-divider"></div>
              
              {/* About Part */}
              <div className="combined-about">
                <h2 className="section-title">About Upward Drone Services</h2>
                <p className="section-description">
                  With years of experience and FAA certification, we provide professional drone services
                  throughout the region. Our team uses the latest drone technology and editing software
                  to deliver exceptional aerial content.
                </p>
                
                <div className="about-content-wrapper">
                  <Link to="/about" className="btn-secondary glass-btn-alt">
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* Equipment List Section */}
          <section className="equipment-section glass-section Home-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >              
              <h2 className="section-title">Our Professional Gear</h2>
              <p className="section-description">
                We utilize cutting-edge drone technology and premium camera equipment to capture stunning aerial footage.
                Every piece of our gear is carefully selected to deliver exceptional quality in any environment.
              </p>
              <div className="equipment-showcase">
                {/* First Equipment Card - DJI Mavic Air 2S */}
                <div 
                  className="equipment-card-wrapper"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <motion.div 
                    className="equipment-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      delay: 0.1, 
                      duration: 0.5 
                    }}
                  >
                    <div className="equipment-image-container">
                      <img src="/images/equipment/Air-2S.png" alt="DJI Mavic Air 2S" className="equipment-image" />
                      <span className="equipment-name">DJI Mavic Air 2S</span>
                    </div>
                    <div className="equipment-specs-overlay">
                      <span className="equipment-badge">Primary Drone</span>
                      <h3>DJI Mavic Air 2S</h3>
                      <div className="equipment-specs-grid">
                        <div className="spec-item">
                          <i className="fas fa-camera"></i>
                          <span>1-inch CMOS Sensor</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-film"></i>
                          <span>5.4K Video</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-battery-full"></i>
                          <span>31 Min Flight Time</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-arrows-alt"></i>
                          <span>12km Transmission</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Second Equipment Card - Sony a7iii */}
                <div 
                  className="equipment-card-wrapper"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <motion.div 
                    className="equipment-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      delay: 0.2, 
                      duration: 0.5 
                    }}
                  >
                    <div className="equipment-image-container Home-section">
                      <img src="/images/equipment/a7III.png" alt="Sony a7iii" className="equipment-image" />
                      <span className="equipment-name">Sony a7iii</span>
                    </div>
                    <div className="equipment-specs-overlay">
                      <span className="equipment-badge">Ground Photography</span>
                      <h3>Sony a7iii</h3>
                      <div className="equipment-specs-grid">
                        <div className="spec-item">
                          <i className="fas fa-camera"></i>
                          <span>24.2MP Full-Frame Sensor</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-film"></i>
                          <span>4K HDR Video</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-clock"></i>
                          <span>10 FPS Continuous Shooting</span>
                        </div>
                        <div className="spec-item">
                          <i className="fas fa-moon"></i>
                          <span>Exceptional Low-Light Performance</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="equipment-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/about#equipment" className="btn-secondary equipment-btn">
                  View Full Equipment List
                </Link>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Call to Action Section */}
          <section className="cta-section glass-section Home-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              <h2 className="section-title">Ready to Elevate Your Perspective?</h2>
              <p className="section-description">
                Contact us today to discuss your project and discover how our drone services can 
                help you capture unique and stunning aerial footage.
              </p>
              <Link to="/contact" className="btn-primary glass-btn">
                Get in Touch
              </Link>
            </motion.div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;