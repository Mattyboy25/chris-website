import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaPlane, FaCamera, FaCertificate, FaVideo, FaQuoteLeft } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/About.css';

function About() {  useEffect(() => {
    // Check if URL has a hash and scroll to that element
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // Remove the # character
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, [window.location.hash]);

  const teamMembers = [{
      name: "Christian Jacobs",
      role: "Founder & Lead Pilot",
      quote: "Capturing the world from above is more than just flying a drone—it's about telling stories from a new perspective.",
      bio: "FAA-certified drone pilot with experience in aerial photography. Specializes in commercial real estate and construction site documentation.",      certifications: ["FAA Part 107 Certified", "DJI Certified"],
      social: {
        instagram: "@chris.drones"
      },
      icon: <FaPlane />,
      image: "/images/Christian.jpg" // You'll need to add these images
    },{
      name: "Matthew Odumosu",
      role: "Drone Technician & Field Assistant",
      quote: "Every property has a unique story. Our job is to tell that story through stunning aerial imagery.",      bio: "Lead for operations and logistics. Ensures all equipment is flight-ready and assists in capturing the best shots.",
      certifications: ["Adobe Certified"],
      social: {
        linkedin: "https://linkedin.com/in/sarah-williams",
        instagram: "@sarah.aerial"
      },
      icon: <FaCamera />,
      image: "/images/Matthew.PNG"
    }
 
  ];

  return (
    <PageTransition>
      <div className="about-container">
        <motion.div 
          className="about-hero glass-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>ABOUT US</h1>
          <p>Professional Drone Services Since 2025</p>
          <div className="hero-line"></div>
        </motion.div>
        
        <div className="about-content">
          <motion.div 
            className="story-section glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Story</h2>
            <div className="story-content">
            <p>Upward Drone Services was born from a deep passion for aerial photography and a desire to bring fresh perspectives to everyday moments and major projects alike. What began as a personal interest in drones and visual storytelling has grown into a professional pursuit, built on a strong foundation of FAA certification, training, and creative vision.</p>
            <p>While we're new to the industry, we bring a high level of dedication, technical skill, and a commitment to excellence in every flight. Our mission is to serve local businesses, real estate agents, contractors, and event planners with high-quality aerial imagery that adds value, clarity, and impact.</p>
            <p>We’re actively building our portfolio and would love the opportunity to help showcase your property, project, or special event from above.</p>
            </div>
          </motion.div>
          
          <div className="team-section">
            <motion.h2 
              className="team-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Meet Our Team
            </motion.h2>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="team-card glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="team-card-content">
                    <div className="team-card-portrait">
                      <img src={member.image} alt={member.name} className="portrait-image" />
                    </div>
                    <h3>{member.name}</h3>
                    <span className="member-role">{member.role}</span>
                    
                    <div className="quote-container">
                      <FaQuoteLeft className="quote-icon" />
                      <p className="member-quote">{member.quote}</p>
                    </div>
                    
                    <p className="member-bio">{member.bio}</p>
                    
                    <div className="member-certifications">
                      {member.certifications.map(cert => (
                        <motion.span 
                          key={cert} 
                          className="certification-badge"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaCertificate /> {cert}
                        </motion.span>
                      ))}
                    </div>
                    

                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;