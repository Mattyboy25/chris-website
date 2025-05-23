import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ContactSuccess from '../components/ContactSuccess';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

function Contact() {  
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  // Verify EmailJS initialization and get package details
  useEffect(() => {
    console.log('Checking EmailJS configuration...');
    if (!emailjs.init) {
      console.error('EmailJS not initialized properly');
    }

    // Get package details from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceSlug = urlParams.get('service');
    const customPrice = urlParams.get('customPrice');
    
    // Set initial total price from URL parameter
    if (customPrice) {
      const price = parseFloat(customPrice);
      setTotalPrice(price);
      
      // Also set in formData
      setFormData(prev => ({
        ...prev,
        customPrice: price.toString()
      }));
    }

    // Load package data
    if (serviceSlug) {
      import('../data/servicesData.js').then(({ services }) => {
        const pkg = services.find(s => s.slug === serviceSlug);
        if (pkg) {
          setSelectedPackage(pkg);
          
          // Try to load addons from localStorage
          try {
            const storedAddons = localStorage.getItem(`selected_addons_${serviceSlug}`);
            if (storedAddons) {
              const parsedAddons = JSON.parse(storedAddons);
              setSelectedAddons(parsedAddons);
              
              // If we don't have a customPrice, calculate one based on addons
              if (!customPrice) {
                let basePrice = parseInt(pkg.info.pricing.replace(/[^0-9]/g, ''));
                let addonTotal = parsedAddons.reduce((sum, addon) => sum + addon.price, 0);
                const calculatedPrice = basePrice + addonTotal;
                
                setTotalPrice(calculatedPrice);
                
                // Also update formData
                setFormData(prev => ({
                  ...prev,
                  customPrice: calculatedPrice.toString()
                }));
              }
            }
          } catch (error) {
            console.error('Error loading addons from localStorage:', error);
          }
        }
      });
    }
  }, []);
  // Function to handle removing an addon
  const handleRemoveAddon = (addonIndex) => {
    const addonToRemove = selectedAddons[addonIndex];
    
    // Update selected addons
    const updatedAddons = selectedAddons.filter((_, index) => index !== addonIndex);
    setSelectedAddons(updatedAddons);
    
    // Update localStorage
    if (selectedPackage) {
      localStorage.setItem(`selected_addons_${selectedPackage.slug}`, JSON.stringify(updatedAddons));
    }
    
    // Calculate new price
    const newPrice = totalPrice - addonToRemove.price;
    
    // Update total price
    setTotalPrice(newPrice);
    
    // Also update formData to reflect the new price
    setFormData(prev => ({
      ...prev,
      customPrice: newPrice.toString()
    }));
  };
  
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: new URLSearchParams(window.location.search).get('service') || '',
    customPrice: new URLSearchParams(window.location.search).get('customPrice') || '',
    message: '',
    packageDetails: ''
  });
  const [messagePlaceholder, setMessagePlaceholder] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, openUpward: false });
  const serviceOptions = [
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'construction', label: 'Construction' },
    { value: 'events', label: 'Events' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'custom', label: 'Custom' },
  ];
  const serviceDropdownRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      // Format as 000-000-0000
      if (digits.length <= 3) {
        newValue = digits;
      } else if (digits.length <= 6) {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleServiceChange = (selectedService) => {
    const selectedOption = serviceOptions.find(opt => opt.value === selectedService);
    setFormData(prev => ({ 
      ...prev, 
      service: selectedService,
      serviceLabel: selectedOption?.label || '' 
    }));
    if (selectedService === 'custom') {
      setMessagePlaceholder('Please describe your project requirements and any specific needs you have. Include details about location, timeline, and desired outcomes.');
    } else {
      setMessagePlaceholder('');
    }
    setServiceDropdownOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
    
    // Prepare package details for form submission
    let packageDetailsText = '';
    
    if (selectedPackage) {
      packageDetailsText = `Selected Package: ${selectedPackage.title}\n\n`;
      packageDetailsText += `Included Features:\n`;
      selectedPackage.features.forEach(feature => {
        packageDetailsText += `- ${feature}\n`;
      });
      
      if (selectedAddons.length > 0) {
        packageDetailsText += `\nSelected Add-ons:\n`;
        selectedAddons.forEach(addon => {
          packageDetailsText += `- ${addon.name} (+$${addon.price})\n`;
        });
      }
      
      packageDetailsText += `\nTotal Price: $${totalPrice}`;
      
      // Add package details to form data
      const hiddenPackageInput = document.createElement('input');
      hiddenPackageInput.type = 'hidden';
      hiddenPackageInput.name = 'packageDetails';
      hiddenPackageInput.value = packageDetailsText;
      form.current.appendChild(hiddenPackageInput);
    }

    console.log('Form data:', formData);
    console.log('Package details:', packageDetailsText);

    try {      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', result.text);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        serviceLabel: '',
        message: '',
        packageDetails: ''
      });
      
      // Clear the addons from localStorage after successful submission
      if (selectedPackage) {
        localStorage.removeItem(`selected_addons_${selectedPackage.slug}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
      
      // Remove the dynamically added package details input
      const hiddenPackageInput = form.current.querySelector('input[name="packageDetails"]');
      if (hiddenPackageInput) {
        form.current.removeChild(hiddenPackageInput);
      }
    }
  };

  // Handle video error and fallback to background image
  const handleVideoError = () => {
    console.error('Video loading error. Retries:', loadRetries);
    
    // Try to reload the video a few times before giving up
    if (loadRetries < 3 && videoRef.current) {
      setLoadRetries(prevRetries => prevRetries + 1);
      // Wait a second before trying to reload
      setTimeout(() => {
        if (videoRef.current) {
          const isDarkMode = document.body.classList.contains('dark');
          const videoSource = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
          
          // Reset and reload the video
          videoRef.current.src = ''; // Clear the source
          videoRef.current.src = videoSource; // Set the appropriate source
          videoRef.current.load(); // Force reload
          
          // Try to play the video
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              setVideoError(true);
            });
          }
        }
      }, 1000);
    } else {
      console.error('Max retries reached or video element not available. Falling back to static background.');
      setVideoError(true);
    }
  };  

  // Handle video loaded
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully!');
    setVideoLoaded(true);
    setLoadRetries(0); // Reset retry count on successful load
    
    // Add a class to the body when the video is loaded to enhance glass effect
    document.body.classList.add('video-loaded');
    
    // Ensure the video plays
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };  

  // Preload the videos
  useEffect(() => {
    // Preload both videos
    const preloadVideos = () => {
      const isDarkMode = document.body.classList.contains('dark');
      
      // Create link preload elements for both videos
      const createPreloadLink = (href, as = 'video') => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
        return link;
      };
      
      // Preload both videos but prioritize the one that matches current theme
      const darkVideoLink = createPreloadLink('/videos/contact-dark.mp4');
      const lightVideoLink = createPreloadLink('/videos/contact-light.mp4');
      
      // Set the src directly on the video element
      if (videoRef.current) {
        const videoSrc = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
        videoRef.current.src = videoSrc;
        
        // Force load the video element
        videoRef.current.load();
      }
      
      // Clean up preload links on unmount
      return () => {
        document.head.removeChild(darkVideoLink);
        document.head.removeChild(lightVideoLink);
      };
    };
    
    return preloadVideos();
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Remove video-loaded class when component unmounts
      document.body.classList.remove('video-loaded');
    };
  }, []);

  // Determine which video to use based on light/dark theme
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {      
      const updateVideoSource = () => {
        const isDarkMode = document.body.classList.contains('dark');
        // Use absolute paths correctly for Vite
        const videoSource = isDarkMode ? '/videos/contact-dark.mp4' : '/videos/contact-light.mp4';
        
        // Check if the video source has changed
        // Ensure we're using the correct absolute URL comparison
        const currentSrc = videoElement.src;
        const fullVideoSource = new URL(videoSource, window.location.origin).href;
        
        if (currentSrc !== fullVideoSource) {
          videoElement.src = videoSource;
          // Force reload when changing the source
          videoElement.load();
        }
      };

      // Initial source setting
      updateVideoSource();
      
      // Setup mutation observer to detect theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            updateVideoSource();
          }
        });
      });
      
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      
      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        serviceDropdownRef.current && 
        !serviceDropdownRef.current.contains(event.target) &&
        !event.target.closest('.custom-select-dropdown')
      ) {
        setServiceDropdownOpen(false);
      }
    };

    if (serviceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Update position on scroll
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };  }, [serviceDropdownOpen]);
  
  const updateDropdownPosition = () => {
    if (serviceDropdownRef.current) {
      const inputElement = serviceDropdownRef.current.querySelector('.custom-select-input');
      const rect = inputElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate if dropdown should open upward or downward
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceNeeded = Math.min(300, serviceOptions.length * 44); // 44px per option
      const openUpward = spaceBelow < spaceNeeded && rect.top > spaceNeeded;
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5, // Add 5px gap
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpward: false // Force dropdown to always open downward
      });
    }
  };

  // Update dropdown position when it opens
  useEffect(() => {
    if (serviceDropdownOpen) {
      updateDropdownPosition();
    }
  }, [serviceDropdownOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setServiceDropdownOpen(prev => !prev);
    } else if (e.key === 'Escape') {
      setServiceDropdownOpen(false);
    } else if (e.key === 'Tab' && !e.shiftKey && serviceDropdownOpen) {
      e.preventDefault();
      const firstOption = document.querySelector('.custom-select-option');
      if (firstOption) firstOption.focus();
    }
  };

  const handleOptionKeyDown = (e, opt) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServiceChange(opt.value);
    } else if (e.key === 'Escape') {
      setServiceDropdownOpen(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const options = Array.from(document.querySelectorAll('.custom-select-option'));
      const currentIndex = options.indexOf(e.target);
      if (currentIndex < options.length - 1) {
        options[currentIndex + 1].focus();
      } else {
        setServiceDropdownOpen(false);
      }
    }
  };
  return (
    <PageTransition>
      <div className="contact-page-wrapper">        
        {/* Background Video */}        
        {!videoError ? (          
          <div className="video-container" ref={videoContainerRef}>            
            <video 
              ref={videoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              className="hero-video contact-video"
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              poster="/images/video-poster.jpg"
            />
          </div>
        ) : (
          <div className="contact-fallback-bg"></div>
        )}
        
        {/* Content Section */}
        <div className="contact-container">
          <motion.div 
            className="contact-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1>CONTACT US</h1>
            <p>Get in touch for a free consultation</p>
          </motion.div>
            <div className="contact-content glass-section">
            <motion.div 
              className="section-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUpVariants}
            >
              {showSuccess ? (
                <ContactSuccess />
              ) : (                <div className="contact-content-inner">
                  <div className="contact-info">                    {selectedPackage && (
                      <>
                        <h2>Selected Package: {selectedPackage.title}</h2>
                        <div className="package-summary">                          <h3>Included Features:</h3>
                          <ul className="package-features">
                            {selectedPackage.features.map((feature, index) => (
                              <li key={index}><span className="feature-bullet">●</span>{feature}</li>
                            ))}
                          </ul>{selectedAddons && selectedAddons.length > 0 && (
                            <>
                              <h3>Add-Ons:</h3>
                              <ul className="package-addons">                                {selectedAddons.map((addon, index) => (
                                  <li key={index}>
                                    <div className="addon-item">
                                      <span className="addon-text">
                                        {addon.name} (+${addon.price})
                                      </span>
                                      <button 
                                        type="button" 
                                        className="remove-addon-btn"
                                        onClick={() => handleRemoveAddon(index)}
                                        aria-label={`Remove ${addon.name}`}
                                      >
                                        ❌
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}                          <p className="package-price">Total Price: ${totalPrice}</p>
                            <div className="package-details">
                            <div className="package-info">
                              <p><strong>Coverage:</strong> {selectedPackage.info.coverage}</p>
                              <p><strong>Turnaround:</strong> {selectedPackage.info.turnaround}</p>
                              <p className="edit-package-link">
                                <a href={`/services/${selectedPackage.slug}?customize=true`}>Edit Package</a>
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                
                <div className="contact-form-container">
                  <form className="contact-form" ref={form} onSubmit={handleSubmit} autoComplete="off">
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
                    
                    {/* Only show service selection if not coming from service customization */}
                    {!selectedPackage && (
                      <div className="form-group" ref={serviceDropdownRef}>
                        <label htmlFor="service">Service Interested In</label>
                        <input 
                          type="hidden" 
                          name="serviceLabel" 
                          value={formData.serviceLabel} 
                        />
                        <div className="custom-select-container" style={{ position: 'relative' }}>
                          <div
                            className="custom-select-input"
                            role="combobox"
                            aria-expanded={serviceDropdownOpen}
                            aria-haspopup="listbox"
                            aria-controls="service-options"
                            tabIndex={0}
                            onClick={() => setServiceDropdownOpen(prev => !prev)}
                            onKeyDown={handleKeyDown}
                          >
                            {serviceOptions.find(opt => opt.value === formData.service)?.label || 'Select a Service'}
                          </div>
                          {serviceDropdownOpen && (
                            <div 
                              className="custom-select-dropdown"
                              role="listbox"
                              id="service-options"
                            >
                              {serviceOptions.map(opt => (
                                <div
                                  key={opt.value}
                                  className={`custom-select-option ${formData.service === opt.value ? 'selected' : ''}`}
                                  role="option"
                                  aria-selected={formData.service === opt.value}
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleServiceChange(opt.value);
                                  }}
                                  onKeyDown={(e) => handleOptionKeyDown(e, opt)}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        placeholder={messagePlaceholder}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="privacy-notice">
                      <p>Your privacy matters to us. We will never sell or share your information with third parties.</p>
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className="submit-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </form>
                </div>                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Contact;