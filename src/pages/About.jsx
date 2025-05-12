import React from 'react';
import '../App.css';
import PageTransition from '../components/PageTransition';

function About() {
  return (
    <PageTransition>
      <div className="about-container" style={{ backgroundImage: 'url(/images/mountain-drone-view.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="about-hero">
          <h1>ABOUT US</h1>
          <p>Professional Drone Services Since 2020</p>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>SkyVision Drones was founded with a passion for aerial photography and a vision to provide professional drone services to businesses and individuals. What started as a hobby quickly turned into a full-service drone company with a team of FAA-certified pilots and photography professionals.</p>
            <p>We've worked with clients across various industries, from real estate and construction to weddings and special events, providing stunning aerial perspectives that capture the beauty and scale of any project or occasion.</p>
          </div>
          
          <div className="about-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="team-img-placeholder"></div>
                <h3>Chris Johnson</h3>
                <p>Founder & Lead Pilot</p>
              </div>
              <div className="team-member">
                <div className="team-img-placeholder"></div>
                <h3>Sarah Williams</h3>
                <p>Photography Director</p>
              </div>
              <div className="team-member">
                <div className="team-img-placeholder"></div>
                <h3>Michael Chen</h3>
                <p>Video Editor</p>
              </div>
            </div>
          </div>
          
          <div className="about-section">
            <h2>Our Equipment</h2>
            <p>We use only the latest drone technology and camera equipment to ensure the highest quality results for our clients. Our fleet includes:</p>
            <ul className="equipment-list">
              <li>DJI Mavic 3 Pro with Hasselblad camera</li>
              <li>DJI Inspire 2 with Zenmuse X7 camera</li>
              <li>DJI FPV for dynamic action shots</li>
              <li>Professional editing software and workstations</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;