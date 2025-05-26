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
          <div className="video-container">
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
          <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-titles">
              <div className="dynamic-title" style={{ opacity: 1 }}>
                <h1 className="hero-title">
                  <span className="typing-text changing-word ">{changingWord || 'Sup'}</span>
                  <span className="static-text">Drone Services</span>
                </h1>
              </div>
              <p className="hero-subtitle" style={{ opacity: 1, transform: 'none' }}>
                Elevating Your Perspective
              </p>
            </div>
            <div className="hero-btns" style={{ opacity: 1, transform: 'none', marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <a className="btn-primary glass-btn" href="/contact" data-discover="true">Book now</a>
              <a className="glass-btn-alt" href="/about" data-discover="true">ABOUT US</a>
            </div>
          </div>
          <div className={`scroll-arrow-container ${showScrollArrow ? 'visible' : 'hidden'}`} style={{ position: 'absolute', left: 0, right: 0, bottom: '2.5rem', display: 'flex', justifyContent: 'center', pointerEvents: 'auto', zIndex: 2 }}>
            <button
              className="scroll-arrow"
              aria-label="Scroll Down"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={handleScrollClick}
              tabIndex={0}
            >
              <FaChevronDown />
            </button>
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
                    <div className="feature-card coming-soon">
                    <div className="coming-soon-overlay">
                      <span className="coming-soon-text">Coming Soon</span>
                    </div>
                    <div className="feature-icon">
                      <i className="fas fa-camera"></i>
                    </div>
                    <h3>Events & Weddings</h3>
                    <p>Capture your special moments from angles never before possible.</p>
                  </div>
                  
                  <div className="feature-card coming-soon">
                    <div className="coming-soon-overlay">
                      <span className="coming-soon-text">Coming Soon</span>
                    </div>
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