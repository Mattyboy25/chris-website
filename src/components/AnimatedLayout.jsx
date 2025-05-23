import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnimatedLayout = ({ children }) => {
  const [contentHeight, setContentHeight] = useState('auto');
  const contentRef = useRef(null);
  const location = useLocation();
  
  // Check if current page is Services
  const isServicesPage = location.pathname === '/services';
  // Auto-scroll to top on page change or to element if hash is present
  useEffect(() => {
    if (location.hash) {
      // Wait for a moment to ensure the page content is loaded
      setTimeout(() => {
        const id = location.hash.substring(1); // Remove the # character
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Increased delay for reliability
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname, location.hash]);
  
  // Track when location changes to measure new height
  useEffect(() => {
    // Skip height management for Services page
    if (isServicesPage) {
      return;
    }
    
    const updateHeight = () => {
      if (contentRef.current) {
        // Get the actual scrollHeight of the content
        const contentScrollHeight = contentRef.current.scrollHeight;
        
        // Set a minimum height to avoid collapsing during transitions
        const minHeight = window.innerHeight - 80; // 80px for navbar
        
        // Use the maximum of these values with added safety padding
        const newHeight = Math.max(contentScrollHeight, minHeight);
        
        setContentHeight(`${newHeight}px`);
        console.log(`Setting height for ${location.pathname}: ${newHeight}px`);
      }
    };
    
    // Initial height measurement
    updateHeight();
    
    // Set up multiple measurements with increasing delays
    // This helps ensure we capture the final height after all content is rendered
    const timers = [
      setTimeout(() => updateHeight(), 50),
      setTimeout(() => updateHeight(), 200),
      setTimeout(() => updateHeight(), 500),
      setTimeout(() => updateHeight(), 1000) // Added longer timeout for complex pages
    ];
    
    // Update on window resize
    window.addEventListener('resize', updateHeight);
    
    // Create a mutation observer to detect DOM changes
    const observer = new MutationObserver(updateHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true
      });
    };
    
    // Extra safety: measure after images and other resources load
    window.addEventListener('load', updateHeight);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('load', updateHeight);
      observer.disconnect();
    };
  }, [location.pathname, isServicesPage]);

  // Apply wrapper style conditionally
  const wrapperStyle = isServicesPage 
    ? { minHeight: '100vh' } // Simple style for Services page
    : {
        minHeight: '100vh',
        transition: 'height 0.5s ease',
        height: contentHeight,
        overflow: 'hidden',
        paddingBottom: '0px'
      };

  return (
    <div style={wrapperStyle}>
      <div ref={contentRef} style={{ paddingBottom: '0px' }}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedLayout;