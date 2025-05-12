import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaPlane, FaCamera, FaCertificate, FaVideo, FaQuoteLeft } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/About.css';

function About() {
  const teamMembers = [    {
      name: "Christian Jacobs",
      role: "Founder & Lead Pilot",
      quote: "Capturing the world from above is more than just flying a drone—it's about telling stories from a new perspective.",
      bio: "FAA-certified drone pilot with over 5 years of experience in aerial photography. Specializes in commercial real estate and construction site documentation.",
      certifications: ["FAA Part 107", "DJI Certified"],
      social: {
        linkedin: "https://linkedin.com/in/chris-johnson",
        instagram: "@chris.drones"
      },
      icon: <FaPlane />,
      image: "/images/chris.jpg" // You'll need to add these images
    },{
      name: "Matthew Odumosu",
      role: "Drone Technician & Field Assistant",
      quote: "Every property has a unique story. Our job is to tell that story through stunning aerial imagery.",
      bio: "Award-winning photographer with expertise in aerial composition and post-processing. Led projects for major real estate developers across the state.",
      certifications: ["Adobe Certified", "FAA Part 107"],
      social: {
        linkedin: "https://linkedin.com/in/sarah-williams",
        instagram: "@sarah.aerial"
      },
      icon: <FaCamera />,
      image: "/images/matthew.png"
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
                  whileHover={{ y: -10 }}
                >
                  <div className="team-card-content">

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
                    
                    <div className="member-social">
                      <motion.a 
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="social-link"
                      >
                        <FaLinkedin />
                      </motion.a>
                      <motion.a 
                        href={`https://instagram.com/${member.social.instagram.substring(1)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="social-link"
                      >
                        <FaInstagram />
                      </motion.a>
                    </div>
                  </div>
                  
                  <div className="team-card-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="equipment-section glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Equipment</h2>
            <p>We use only the latest drone technology and camera equipment to ensure the highest quality results for our clients. Our fleet includes:</p>
            <ul className="equipment-list">
              <li>DJI Mavic Air 2S</li>
              <li>DJI Inspire 2 with Zenmuse X7 camera</li>
              <li>DJI FPV for dynamic action shots</li>
              <li>Professional editing software and workstations</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;