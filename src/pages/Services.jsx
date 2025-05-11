import React from 'react';
import '../App.css';
import PageTransition from '../components/PageTransition';

function Services() {
  return (
    <PageTransition>
      <div className="services-container">
        <h1>OUR SERVICES</h1>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📸</div>
            <h2>Aerial Photography</h2>
            <p>High-quality aerial images perfect for real estate, events, and commercial use.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎥</div>
            <h2>Drone Videography</h2>
            <p>Stunning 4K aerial footage for marketing, events, and promotional content.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏠</div>
            <h2>Real Estate Tours</h2>
            <p>Full property showcases with indoor and outdoor aerial perspectives.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h2>Construction Monitoring</h2>
            <p>Progress tracking and site surveys for construction projects.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Services;