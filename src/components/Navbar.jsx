import { Link, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import '../App.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const scrollToTop = (e) => {
    // Always prevent default and scroll to top if we're on the home page
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Close menu if it's open
      if (isOpen) {
        setIsOpen(false);
      }
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-icon')) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);
  
  // Add scroll event listener to change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${theme} ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={scrollToTop}>
          Upward Drone Services
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={`nav-menu ${isOpen ? 'active' : ''} ${theme}`}>
          <li className="nav-item" style={{"--item-index": 1}}>
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item" style={{"--item-index": 2}}>
            <Link to="/services" className="nav-links" onClick={toggleMenu}>
              Services
            </Link>
          </li>
          <li className="nav-item" style={{"--item-index": 3}}>
            <Link to="/portfolio" className="nav-links" onClick={toggleMenu}>
              Portfolio
            </Link>
          </li>
          <li className="nav-item" style={{"--item-index": 4}}>
            <Link to="/about" className="nav-links" onClick={toggleMenu}>
              About
            </Link>
          </li>          <li className="nav-item" style={{"--item-index": 5}}>
            <Link to="/contact" className="nav-links" onClick={toggleMenu}>
              Contact
            </Link>          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;