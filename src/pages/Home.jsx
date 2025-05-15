import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { ThemeContext } from '../components/ThemeContext';
import '../styles/Home.css'; // Updated import to use Home.css

function Home() {
  const [videoError, setVideoError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [currentVideo, setCurrentVideo] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const lightVideoRef = useRef(null);
  const darkVideoRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Handle video error and fallback to background image
  const handleVideoError = () => {
    setVideoError(true);
  };

  // Get the video source based on theme
  const getLightVideoSource = () => '/videos/lightmode-bg (2).mp4';
  const getDarkVideoSource = () => '/videos/darkmode-bg.mp4';

  // Handle theme change with crossfade animation
  useEffect(() => {
    if (videoError) return;
    
    // Only trigger the transition if it's not the initial load
    if (currentVideo !== theme) {
      setIsTransitioning(true);
      
      // After transition is complete, update the current video to match theme
      const timer = setTimeout(() => {
        setCurrentVideo(theme);
        setIsTransitioning(false);
      }, 500); // 500ms matches the CSS transition duration (changed from 1000ms)
      
      return () => clearTimeout(timer);
    }
  }, [theme, currentVideo, videoError]);

  // Keep both videos playing and in sync
  useEffect(() => {
    if (videoError) return;
    
    const lightVideo = lightVideoRef.current;
    const darkVideo = darkVideoRef.current;
    
    if (lightVideo && darkVideo) {
      // Ensure both videos play
      const playVideos = async () => {
        try {
          if (lightVideo.paused) await lightVideo.play();
          if (darkVideo.paused) await darkVideo.play();
          
          // Sync playback positions
          if (Math.abs(lightVideo.currentTime - darkVideo.currentTime) > 0.5) {
            darkVideo.currentTime = lightVideo.currentTime;
          }
        } catch (error) {
          console.error("Video playback error:", error);
          setVideoError(true);
        }
      };
      
      playVideos();
    }
  }, [videoError]);

  // Animation variants for text and button
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
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

  return (
    <PageTransition>
      <div className="home-wrapper">
        <div className={`hero-container ${theme}`}>
          {!videoError ? (
            <div className="video-container" ref={videoContainerRef}>
              {/* Light mode video */}
              <video 
                ref={lightVideoRef}
                src={getLightVideoSource()} 
                autoPlay 
                loop 
                muted 
                playsInline
                className={`hero-video ${theme === 'light' && !isTransitioning ? 'visible' : 'hidden'} ${isTransitioning && theme === 'dark' ? 'fade-out' : ''}`}
                onError={handleVideoError}
              />
              
              {/* Dark mode video */}
              <video 
                ref={darkVideoRef}
                src={getDarkVideoSource()} 
                autoPlay 
                loop 
                muted 
                playsInline
                className={`hero-video ${theme === 'dark' && !isTransitioning ? 'visible' : 'hidden'} ${isTransitioning && theme === 'light' ? 'fade-out' : ''}`}
                onError={handleVideoError}
              />
            </div>
          ) : (
            <div className={`hero-fallback-bg ${theme}`}></div>
          )}
          <div className="hero-content">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={titleVariants}
              className="hero-title"
            >
              AERIAL PHOTOGRAPHY & VIDEOGRAPHY
            </motion.h1>
            
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
              className="hero-subtitle"
            >
              Upward Drone Services - Elevating Your Perspective
            </motion.p>
            
            <motion.div 
              className="hero-btns"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              <motion.div whileHover="hover">
                <Link to="/services" className="btn-primary glass-btn">
                  EXPLORE SERVICES
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Content that overlaps the video */}
        <div className="content-wrapper">
          {/* Combined Featured Services and About Section */}
          <section className="combined-section glass-section">
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
          <section className="equipment-section glass-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              <h2 className="section-title">Our Equipment</h2>
              <ul className="equipment-list">
                <motion.li>DJI Mavic Air 2S</motion.li>
                <motion.li>Sony a7iii</motion.li>
              </ul>
            </motion.div>
          </section>
          
          {/* Call to Action Section */}
          <section className="cta-section glass-section">
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