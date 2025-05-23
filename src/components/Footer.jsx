import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Footer() {
  const location = useLocation();

  const scrollToTop = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>About Us</h2>
              <Link to="/about">Our Story</Link>
              <Link to="/about">Our Team</Link>
              <Link to="/about">Testimonials</Link>
              <Link to="/about">Careers</Link>
            </div>
            <div className="footer-link-items">
              <h2>Services</h2>
              <Link to="/services">Aerial Photography</Link>
              <Link to="/services">Drone Videography</Link>
              <Link to="/services">Real Estate</Link>
              <Link to="/services">Construction</Link>
            </div>
          </div>
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>Videos</h2>
              <Link to="/portfolio">Showreel</Link>
              <Link to="/portfolio">Testimonials</Link>
              <Link to="/portfolio">Projects</Link>
            </div>
            <div className="footer-link-items">
              <h2>Contact Us</h2>
              <Link to="/contact">Contact</Link>
              <Link to="/contact">Support</Link>
              <Link to="/contact">Locations</Link>
              <Link to="/contact">FAQs</Link>
            </div>
          </div>
        </div>
        <section className="social-media">
          <div className="social-media-wrap">
            <div className="footer-logo">
              <Link to="/" className="social-logo" onClick={scrollToTop}>
                Upward Drone Services
              </Link>
            </div>
            <small className="website-rights">Upward Drone Services © {new Date().getFullYear()}</small>
            <div className="social-icons">
              <Link
                className="social-icon-link facebook"
                to="/"
                target="_blank"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </Link>
              <Link
                className="social-icon-link instagram"
                to="/"
                target="_blank"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </Link>
              <Link
                className="social-icon-link youtube"
                to="/"
                target="_blank"
                aria-label="Youtube"
              >
                <i className="fab fa-youtube" />
              </Link>
              <Link
                className="social-icon-link linkedin"
                to="/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;