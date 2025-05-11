import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../components/ThemeContext';
import PageTransition from '../components/PageTransition';
import '../App.css';

function Home() {
  const [videoError, setVideoError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [currentVideo, setCurrentVideo] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const lightVideoRef = useRef(null);
  const darkVideoRef = useRef(null);

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

  return (
    <PageTransition>
      <div className={`hero-container ${theme}`}>
        {!videoError ? (
          <div className="video-container">
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
          <h1>AERIAL PHOTOGRAPHY & VIDEOGRAPHY</h1>
          <p>Upward Drone Services - Elevating Your Perspective</p>
          <div className="hero-btns">
            <Link to="/services" className="btn-primary">
              EXPLORE SERVICES
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;