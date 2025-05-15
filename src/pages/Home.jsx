import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

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
  };  // Initialize audio when component mounts
  useEffect(() => {
    audioRef.current = new Audio('/Music/bg-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 1.0;

    // Try to start playing immediately
    audioRef.current.play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => {
        // If initial autoplay fails, we'll try again when video plays
        console.log('Initial autoplay failed, will try again with video play');
      });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle music toggle
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
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

  return (
    <PageTransition>
      <div className="home-wrapper">
        <div className="hero-container">          
          {/* Music Controls */}
          <button 
            className="music-toggle glass-btn-music"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Pause Music' : 'Play Music'}
          >
            <i className={`fas ${isMusicPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          {!videoError ? (
            <div className="video-container" ref={videoContainerRef}>              <video 
                ref={videoRef}
                src="/videos/main-video.mp4"
                autoPlay 
                loop 
                muted 
                playsInline
                className="hero-video visible"
                onError={handleVideoError}
                onPlay={() => {
                  if (audioRef.current && !isMusicPlaying) {
                    audioRef.current.play()
                      .then(() => setIsMusicPlaying(true))
                      .catch(console.error);
                  }
                }}
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
                  <Link to="/services" className="btn-primary glass-btn">
                    EXPLORE SERVICES
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