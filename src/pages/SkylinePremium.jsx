import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaArrowRight, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/SkylinePremium.css';

function SkylinePremium() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        setVideoError(true);
      });
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
    setVideoError(true);
  };

  return (
    <PageTransition>
      <div className="skyline-premium-page">
        <div className="skyline-hero">
          {!videoError ? (
            <video
              ref={videoRef}
              className="skyline-hero-video"
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
            >
              <source src="/videos/City.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="skyline-fallback-bg"></div>
          )}
          <div className="skyline-hero-overlay"></div>
          
          <div className="back-button-container">
            <motion.button 
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
          
          <motion.h1
            className="skyline-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}