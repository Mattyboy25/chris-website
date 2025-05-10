import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../App.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
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
        <Link to="/" className="navbar-logo">
          SkyVision Drones
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-links" onClick={toggleMenu}>
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/portfolio" className="nav-links" onClick={toggleMenu}>
              Portfolio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>
        
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;