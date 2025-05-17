import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import '../styles/Contact.css';

function Contact() {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This would connect to a backend service in a real application
    console.log('Form submitted:', formData);
    alert('Thanks for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };  // Handle video error and fallback to background image
  const handleVideoError = () => {
    console.error('Video loading error. Retries:', loadRetries);
    
    // Try to reload the video a few times before giving up
    if (loadRetries < 3 && videoRef.current) {
      setLoadRetries(prevRetries => prevRetries + 1);
      // Wait a second before trying to reload
      setTimeout(() => {
        if (videoRef.current) {
          const isDarkMode = document.body.classList.contains('dark');
          const videoSource = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
          
          // Reset and reload the video
          videoRef.current.src = ''; // Clear the source
          videoRef.current.src = videoSource; // Set the appropriate source
          videoRef.current.load(); // Force reload
          
          // Try to play the video
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              setVideoError(true);
            });
          }
        }
      }, 1000);
    } else {
      console.error('Max retries reached or video element not available. Falling back to static background.');
      setVideoError(true);
    }
  };  // Handle video loaded
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully!');
    setVideoLoaded(true);
    setLoadRetries(0); // Reset retry count on successful load
    
    // Add a class to the body when the video is loaded to enhance glass effect
    document.body.classList.add('video-loaded');
    
    // Ensure the video plays
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }
  };
  // Animation variants
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
  };  // Preload the videos
  useEffect(() => {
    // Preload both videos
    const preloadVideos = () => {
      const isDarkMode = document.body.classList.contains('dark');
      
      // Create link preload elements for both videos
      const createPreloadLink = (href, as = 'video') => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
        return link;
      };
      
      // Preload both videos but prioritize the one that matches current theme
      const darkVideoLink = createPreloadLink('/videos/contact-dark.mp4');
      const lightVideoLink = createPreloadLink('/videos/contact-light.mp4');
      
      // Set the src directly on the video element
      if (videoRef.current) {
        const videoSrc = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
        videoRef.current.src = videoSrc;
        
        // Force load the video element
        videoRef.current.load();
      }
      
      // Clean up preload links on unmount
      return () => {
        document.head.removeChild(darkVideoLink);
        document.head.removeChild(lightVideoLink);
      };
    };
    
    return preloadVideos();
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Remove video-loaded class when component unmounts
      document.body.classList.remove('video-loaded');
    };
  }, []);

  // Determine which video to use based on light/dark theme
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {      const updateVideoSource = () => {
        const isDarkMode = document.body.classList.contains('dark');
        // Use absolute paths correctly for Vite
        const videoSource = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
        
        // Check if the video source has changed
        // Ensure we're using the correct absolute URL comparison
        const currentSrc = videoElement.src;
        const fullVideoSource = new URL(videoSource, window.location.origin).href;
        
        if (currentSrc !== fullVideoSource) {
          videoElement.src = videoSource;
          // Force reload when changing the source
          videoElement.load();
        }
      };

      // Initial source setting
      updateVideoSource();
      
      // Setup mutation observer to detect theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            updateVideoSource();
          }
        });
      });
      
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      
      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <PageTransition>
      <div className="contact-page-wrapper">        {/* Background Video */}        {!videoError ? (          <div className="video-container" ref={videoContainerRef}>            <video 
              ref={videoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              className="hero-video contact-video"
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              poster="/images/video-poster.jpg"
            />
          </div>
        ) : (
          <div className="contact-fallback-bg"></div>
        )}
        
        {/* Content Section */}
        <div className="contact-container">
          <motion.div 
            className="contact-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1>CONTACT US</h1>
            <p>Get in touch for a free consultation</p>
          </motion.div>
          
          <div className="contact-content glass-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              <div className="contact-content-inner">
                <div className="contact-info">
                  <h2>Reach Out</h2>
                  <p>We'd love to hear about your project. Fill out the form and our team will get back to you within 24 hours.</p>
                  
                  <div className="contact-details">
                    <div className="contact-item">
                      <FaPhone />
                      <p>(770) 733-0899</p>
                    </div>
                    <div className="contact-item">
                      <FaEnvelope />
                      <p>contact@upwarddroneservices.com</p>
                    </div>
                    <div className="contact-item">
                      <FaMapMarkerAlt />
                      <p>123 Drone Ave, Skyview, CA 90210</p>
                    </div>
                  </div>
                  
                  <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                  </div>
                </div>
                
                <div className="contact-form-container">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="service">Service Interested In</label>
                      <select 
                        id="service" 
                        name="service" 
                        value={formData.service} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Select a Service</option>
                        <option value="aerial-photography">Aerial Photography</option>
                        <option value="drone-videography">Drone Videography</option>
                        <option value="real-estate">Real Estate Tours</option>
                        <option value="construction">Construction Monitoring</option>
                        <option value="events">Events Coverage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required
                      ></textarea>
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className="submit-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Contact;