import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ContactSuccess from '../components/ContactSuccess';
import { sendOrderConfirmation } from '../utils/orderUtils';
import '../styles/Contact.css';

function Contact() {
  const navigate = useNavigate();
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

    // Get package data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceSlug = urlParams.get('service');
    const customPrice = urlParams.get('customPrice');
    
    console.log(`Loading package: ${serviceSlug} with price: ${customPrice}`);
    
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
              
              // If we have a customPrice from URL, use that first
              if (customPrice) {
                const price = parseFloat(customPrice);
                setTotalPrice(price);
                
                // Also set in formData
                setFormData(prev => ({
                  ...prev,
                  customPrice: price.toString()
                }));
              } else {
                // If no customPrice in URL, calculate from base price + addons
                let basePrice = parseInt(pkg.info.pricing.replace(/[^0-9]/g, ''));
                let addonTotal = parsedAddons.reduce((sum, addon) => sum + addon.price, 0);
                const calculatedPrice = basePrice + addonTotal;
                
                setTotalPrice(calculatedPrice);
                
                // Also update formData and URL
                setFormData(prev => ({
                  ...prev,
                  customPrice: calculatedPrice.toString()
                }));
                
                // Update URL to ensure price persistence on refresh
                updateURLWithNewPrice(calculatedPrice, serviceSlug);
              }
            } else if (customPrice) {
              // If no addons in localStorage but we have a customPrice, use that
              const price = parseFloat(customPrice);
              setTotalPrice(price);
              
              // Update formData
              setFormData(prev => ({
                ...prev,
                customPrice: price.toString()
              }));
            } else {
              // Fallback to base package price if no addons or custom price
              const basePrice = parseInt(pkg.info.pricing.replace(/[^0-9]/g, ''));
              setTotalPrice(basePrice);
              
              // Update formData and URL
              setFormData(prev => ({
                ...prev,
                customPrice: basePrice.toString()
              }));
              
              // Update URL with base price for persistence
              updateURLWithNewPrice(basePrice, serviceSlug);
            }
          } catch (error) {
            console.error('Error loading addons from localStorage:', error);
          }
        }
      });
    }
  }, []);
  
  // Function to update URL with new price without refreshing the page
  const updateURLWithNewPrice = (price, packageSlug) => {
    if (!packageSlug) return;
    
    // Update URL parameters
    const url = new URL(window.location);
    url.searchParams.set('customPrice', price.toString());
    url.searchParams.set('service', packageSlug); // Ensure service parameter is always set
    
    // Update browser history without page refresh
    window.history.replaceState({}, '', url.toString());
    
    // Log the price update to help with debugging
    console.log(`Price updated to $${price} for package ${packageSlug}`);
  };
  // Function to handle removing an addon
  const handleRemoveAddon = (addonIndex) => {
    const addonToRemove = selectedAddons[addonIndex];
    
    // Update selected addons
    const updatedAddons = selectedAddons.filter((_, index) => index !== addonIndex);
    setSelectedAddons(updatedAddons);
    
    // Calculate new price
    const newPrice = totalPrice - addonToRemove.price;
    
    // Update total price
    setTotalPrice(newPrice);
    
    // Update localStorage with the updated addons list
    if (selectedPackage) {
      localStorage.setItem(`selected_addons_${selectedPackage.slug}`, JSON.stringify(updatedAddons));
    }
    
    // Update URL with new price - this ensures price persists after page refresh
    if (selectedPackage) {
      updateURLWithNewPrice(newPrice, selectedPackage.slug);
    }
    
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
    packageDetails: ''  });
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [messagePlaceholder, setMessagePlaceholder] = useState('Let us know if there are any additional instructions that we should be aware of!');
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
    }));    if (selectedService === 'custom') {
      setMessagePlaceholder('Please describe your project requirements and any specific needs you have. Include details about location, timeline, and desired outcomes.');
    } else {
      setMessagePlaceholder('Let us know if there are any additional instructions that we should be aware of!');
    }
    setServiceDropdownOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verify agreement checkbox is checked
    if (!agreementChecked) {
      alert("Please agree to the Privacy Policy and Terms of Service before submitting.");
      return;
    }
    
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
    
    // Add a hidden field for terms agreement
    const hiddenAgreementInput = document.createElement('input');
    hiddenAgreementInput.type = 'hidden';
    hiddenAgreementInput.name = 'termsAgreed';
    hiddenAgreementInput.value = 'Yes, agreed to Terms and Privacy Policy';
    form.current.appendChild(hiddenAgreementInput);
    
    console.log('Form data:', formData);
    console.log('Package details:', packageDetailsText);    try {
      // Prepare services list for the email
      let services = [];
      if (selectedPackage) {
        services.push(selectedPackage.title);
        selectedAddons.forEach(addon => services.push(addon.name));
      } else if (formData.service) {
        services.push(formData.service);
      }

      // Send order confirmation
      const result = await sendOrderConfirmation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        services: services,
        message: `${formData.message}\n\n${packageDetailsText}`
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send order confirmation');
      }

      console.log('Order confirmation sent successfully:', result);

      // Navigate to success page with name and order number
      navigate(`/contact-success?name=${encodeURIComponent(formData.name)}&orderNumber=${encodeURIComponent(result.orderNumber)}`);

      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        serviceLabel: '',
        message: '',
        packageDetails: ''
      });

      // Reset checkbox
      setAgreementChecked(false);

      // Clear the addons from localStorage after successful submission
      if (selectedPackage) {
        localStorage.removeItem(`selected_addons_${selectedPackage.slug}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
      
      // Remove the dynamically added hidden inputs
      const hiddenPackageInput = form.current.querySelector('input[name="packageDetails"]');
      if (hiddenPackageInput) {
        form.current.removeChild(hiddenPackageInput);
      }
      
      const hiddenAgreementInput = form.current.querySelector('input[name="termsAgreed"]');
      if (hiddenAgreementInput) {
        form.current.removeChild(hiddenAgreementInput);
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
      console.error('Max retries reached or video element not available. Falling back to static background.');      setVideoError(true);
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
                <ContactSuccess />              ) : (                <div className={`contact-content-inner ${!selectedPackage ? 'contact-direct' : ''}`}>
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
                
                <div className={`contact-form-container ${!selectedPackage ? 'contact-form-centered' : ''}`}>
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
                    
                    <div className="form-group agreement-checkbox">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={agreementChecked}
                          onChange={() => setAgreementChecked(!agreementChecked)}
                          required
                        />
                        <span className="checkmark"></span>                        <span className="agreement-text">
                          I agree to the <Link to="/privacy-policy" target="_blank" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and <Link to="/terms-of-service" target="_blank" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>
                        </span>
                      </label>
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className="submit-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting || !agreementChecked}
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