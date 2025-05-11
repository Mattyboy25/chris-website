import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import '../styles/Services.css';
import PageTransition from '../components/PageTransition';

function Services() {
  // Service data with more detailed information
  const services = [
    {
      id: 1,
      title: "Aerial Photography",
      shortDesc: "Stunning high-resolution aerial imagery for any project.",
      fullDesc: "Our professional aerial photography services deliver breathtaking high-resolution images from unique perspectives that ground-based photography simply cannot achieve. Perfect for real estate listings, construction documentation, event coverage, or artistic landscape shots.",
      icon: "📸",
      image: "/images/services-aerial-photo.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "Ultra high-resolution 48MP images",
        "Multiple angles and elevations",
        "Professional editing and color grading",
        "Quick turnaround times",
        "Commercial licensing available"
      ]
    },
    {
      id: 2,
      title: "Drone Videography",
      shortDesc: "Cinematic 4K aerial footage for stunning visual content.",
      fullDesc: "Capture your projects in motion with our cinematic drone videography services. From smooth fly-overs to dynamic tracking shots, we create breathtaking footage that engages your audience with professional video quality suitable for commercials, promotional content, and social media.",
      icon: "🎥",
      image: "/images/services-drone-video.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "4K/60fps video capability",
        "Smooth cinematic movements",
        "Custom motion graphics available",
        "Professional editing and color grading",
        "Multiple delivery formats"
      ]
    },
    {
      id: 3,
      title: "Real Estate Tours",
      shortDesc: "Comprehensive property showcases from every angle.",
      fullDesc: "Elevate your property listings with our comprehensive real estate aerial tours. We combine exterior drone footage with interior walkthroughs to create complete property showcases that highlight every feature and help properties sell faster by giving potential buyers a true sense of the space.",
      icon: "🏠",
      image: "/images/services-real-estate.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "Exterior aerial footage and photography",
        "Property boundary visualization",
        "Neighborhood overview shots",
        "Interactive tour integration",
        "Same-day delivery options"
      ]
    },
    {
      id: 4,
      title: "Construction Monitoring",
      shortDesc: "Regular site documentation for project management.",
      fullDesc: "Keep your construction projects on track with our comprehensive aerial monitoring services. We provide regular site documentation through aerial imagery and 3D mapping to track progress, identify potential issues, and maintain records for stakeholders.",
      icon: "🏢",
      image: "/images/services-construction.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "Weekly or monthly progress documentation",
        "3D site mapping and modeling",
        "Measurement and volumetric calculations",
        "Before and after comparisons",
        "Secure online delivery portal"
      ]
    },
    {
      id: 5,
      title: "Inspection Services",
      shortDesc: "Safe, efficient inspections of hard-to-reach areas.",
      fullDesc: "Our drone inspection services provide a safe and cost-effective alternative to traditional inspection methods. We can access difficult or dangerous areas without scaffolding or lifts, delivering detailed imagery of roofs, towers, power lines, bridges, and other structures.",
      icon: "🔍",
      image: "/images/services-inspection.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "Thermal imaging capability",
        "Detailed visual reports",
        "No equipment rental needed",
        "Reduced safety risks",
        "High-resolution zoom capabilities"
      ]
    },
    {
      id: 6,
      title: "Event Coverage",
      shortDesc: "Capture special moments from spectacular perspectives.",
      fullDesc: "Make your special events unforgettable with our drone event coverage services. Whether it's a wedding, concert, festival, or sporting event, our skilled pilots can capture the scale and excitement from above while documenting those once-in-a-lifetime moments from perspectives your guests will never forget.",
      icon: "🎪",
      image: "/images/services-events.jpg",
      videoSrc: "/videos/clouds.mp4", // Added video source
      features: [
        "Live-streaming capability",
        "Crowd shots and venue overview",
        "Coordination with event timeline",
        "Multiple drone options available",
        "Same-day highlight reels"
      ]
    }
  ];

  // Create refs for each service section
  const serviceSectionRefs = services.map(() => useRef(null));
  const containerRef = useRef(null);
  
  // Track which services are in view
  const [visibleServices, setVisibleServices] = useState({});

  // Check if sections are in view with improved threshold
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.15,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const serviceId = parseInt(entry.target.dataset.serviceId, 10);
          setVisibleServices(prev => ({ ...prev, [serviceId]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    serviceSectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      serviceSectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <PageTransition>
      <div className="services-page" ref={containerRef}>
        <motion.div 
          className="services-hero"
          style={{ 
            y: heroY,
            opacity: heroOpacity
          }}
        >
             <h1>How We Can Help You</h1>
            <p>
              At Upward Drone Services, we provide professional aerial photography, videography, and specialized 
              drone services for clients across various industries. Our FAA-certified pilots use cutting-edge 
              equipment to deliver stunning results that help you stand out.
            </p>
        </motion.div>

      

        <div className="services-banners">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const inView = useInView(serviceSectionRefs[index], { once: false, amount: 0.3 });
            
            return (
              <section 
                key={service.id}
                ref={serviceSectionRefs[index]}
                data-service-id={service.id}
                className={`service-banner ${isEven ? 'text-left' : 'text-right'} ${visibleServices[service.id] ? 'visible' : ''}`}
                style={{ backgroundImage: `url(${service.image})` }}
              >
                {/* Video background container */}
                <div className="banner-video-container">
                  <video
                    className="banner-background-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={service.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="banner-overlay"></div>
                <div className={`banner-content ${isEven ? 'content-left' : 'content-right'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -80 : 80 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="banner-text"
                  >
                    <span className="service-icon">{service.icon}</span>
                    <h2>{service.title}</h2>
                    <p>{service.fullDesc}</p>
                    
                    <ul className="service-feature-list">
                      {service.features.map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -20 : 20 }}
                          transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.button 
                      className="service-btn"
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Request a Quote
                    </motion.button>
                  </motion.div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="custom-services">
          <div className="container">
            <motion.div 
              className="custom-services-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Need a Custom Solution?</h2>
              <p>
                Don't see exactly what you're looking for? We specialize in creating custom drone packages
                tailored to your specific requirements. Contact us today to discuss your project needs.
              </p>
              <motion.button 
                className="contact-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Services;