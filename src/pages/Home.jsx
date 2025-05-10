import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../components/ThemeContext';
import '../App.css';

function Home() {
  const [videoError, setVideoError] = useState(false);
  const { theme } = useContext(ThemeContext);

  // Handle video error and fallback to background image
  const handleVideoError = () => {
    setVideoError(true);
  };

  // Get the right video source based on theme
  const getVideoSource = () => {
    return theme === 'light' ? '/videos/lightmode-bg (2).mp4' : '/videos/darkmode-bg.mp4';
  };

  return (
    <div className={`hero-container ${theme}`}>
      {!videoError ? (
        <video 
          src={getVideoSource()} 
          autoPlay 
          loop 
          muted 
          className="hero-video"
          onError={handleVideoError}
        />
      ) : (
        <div className={`hero-fallback-bg ${theme}`}></div>
      )}
      <div className="hero-content">
        <h1>AERIAL PHOTOGRAPHY & VIDEOGRAPHY</h1>
        <p>Professional Drone Services</p>
        <div className="hero-btns">
          <Link to="/services" className="btn-primary">
            LEARN MORE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;