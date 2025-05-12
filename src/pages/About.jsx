import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import '../styles/About.css'; // Updated import to use About.css

function About() {
  return (
    <PageTransition>
      <div className="about-container" style={{ backgroundImage: 'url(/images/mountain-drone-view.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="about-hero">
          <h1>ABOUT US</h1>
          <p>Professional Drone Services Since 2025</p>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>Upward Drone Services was born from a deep passion for aerial photography and a desire to bring fresh perspectives to everyday moments and major projects alike. What began as a personal interest in drones and visual storytelling has grown into a professional pursuit, built on a strong foundation of FAA certification, training, and creative vision.</p>
            <p>While we're new to the industry, we bring a high level of dedication, technical skill, and a commitment to excellence in every flight. Our mission is to serve local businesses, real estate agents, contractors, and event planners with high-quality aerial imagery that adds value, clarity, and impact.</p>
            <p>We’re actively building our portfolio and would love the opportunity to help showcase your property, project, or special event from above.</p>
          </div>
          
          <div className="about-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="team-img-placeholder"></div>
                <h3>Christian Jacobs</h3>
                <p>Founder & Lead Pilot</p>
              </div>
              <div className="team-member">
                <div className="team-img-placeholder"></div>
                <h3>Matthew Odumosu</h3>
                <p>Drone Technician & Field Assistant</p>
              </div>
            </div>
          </div>
          
          <div className="about-section">
            <h2>Our Equipment</h2>
            <p>We use only the latest drone technology and camera equipment to ensure the highest quality results for our clients. Our fleet includes:</p>
            <ul className="equipment-list">
              <li>DJI Mavic Air 2S</li>
              <li>Sony a7iii</li>
              
              
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;