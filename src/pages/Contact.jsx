import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This would connect to a backend service in a real application
    console.log('Form submitted:', formData);
    alert('Thanks for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <PageTransition>
      <div className="contact-container">
        <div className="contact-hero">
          <h1>CONTACT US</h1>
          <p>Get in touch for a free consultation</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Reach Out</h2>
            <p>We'd love to hear about your project. Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <FaPhone />
                <p>(555) 123-4567</p>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <p>info@skyvisiondrones.com</p>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <p>123 Drone Ave, Skyview, CA 90210</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Service Interested In</label>
                <select 
                  id="service" 
                  name="service" 
                  value={formData.service} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select a Service</option>
                  <option value="aerial-photography">Aerial Photography</option>
                  <option value="drone-videography">Drone Videography</option>
                  <option value="real-estate">Real Estate Tours</option>
                  <option value="construction">Construction Monitoring</option>
                  <option value="events">Events Coverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Contact;