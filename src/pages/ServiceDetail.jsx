import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCamera, FaVideo, FaHome, FaBuilding, FaSearchPlus, FaRing,
  FaArrowLeft, FaCheck, FaClock , FaMapMarkerAlt, FaMoneyBillWave
} from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import '../styles/ServiceDetail.css';

// Service data - this should match what's in App.jsx and Services.jsx
// In a real application, this would come from a central data store or API
const services = [
  {
    id: 1,
    title: "Aerial Photography",
    shortDesc: "Stunning high-resolution aerial imagery for any project.",
    fullDesc: "Our professional aerial photography services deliver breathtaking high-resolution images from unique perspectives that ground-based photography simply cannot achieve. Perfect for real estate listings, construction documentation, event coverage, or artistic landscape shots.",
    icon: <FaCamera />,
    videoSrc: "/videos/Houses.mp4",
    features: [
      "Ultra high-resolution 48MP images",
      "Multiple angles and elevations",
      "Professional editing and color grading",
      "Quick turnaround times",
      "Commercial licensing available"
    ],
    process: [
      { step: 1, title: "Consultation", desc: "We discuss your specific needs and desired outcomes" },
      { step: 2, title: "Planning", desc: "We plan the shoot based on location, weather, and light conditions" },
      { step: 3, title: "Execution", desc: "Our pilots capture the images following the approved plan" },
      { step: 4, title: "Post-Processing", desc: "Professional editing and enhancement of the photos" },
      { step: 5, title: "Delivery", desc: "Final images delivered in your preferred format" }
    ],
    info: {
      turnaround: "2-3 business days",
      coverage: "Up to 50 acres",
      pricing: "Starting at $299",
      availability: "7 days a week"
    },
    relatedServices: [2, 3, 4]
  },
  {
    id: 2,
    title: "Drone Videography",
    shortDesc: "Cinematic 4K aerial footage for stunning visual content.",
    fullDesc: "Capture your projects in motion with our cinematic drone videography services. From smooth fly-overs to dynamic tracking shots, we create breathtaking footage that engages your audience with professional video quality suitable for commercials, promotional content, and social media.",
    icon: <FaVideo />,
    videoSrc: "/videos/City.mp4",
    features: [
      "4K/60fps video capability",
      "Smooth cinematic movements",
      "Custom motion graphics available",
      "Professional editing and color grading",
      "Multiple delivery formats"
    ],
    process: [
      { step: 1, title: "Creative Brief", desc: "We discuss your vision, audience, and creative direction" },
      { step: 2, title: "Storyboarding", desc: "We plan each shot sequence to maximize impact" },
      { step: 3, title: "Filming", desc: "Our pilots execute the plan with precision flying" },
      { step: 4, title: "Post-Production", desc: "Professional editing, color grading, and sound design" },
      { step: 5, title: "Revision & Delivery", desc: "Final approval and delivery in requested formats" }
    ],
    info: {
      turnaround: "3-5 business days",
      coverage: "Up to 1 hour of flight time",
      pricing: "Starting at $499",
      availability: "7 days a week"
    },
    relatedServices: [1, 3, 6]
  },
  {
    id: 3,
    title: "Real Estate Tours",
    shortDesc: "Comprehensive property showcases from every angle.",
    fullDesc: "Elevate your property listings with our comprehensive real estate aerial tours. We combine exterior drone footage with interior walkthroughs to create complete property showcases that highlight every feature and help properties sell faster by giving potential buyers a true sense of the space.",
    icon: <FaHome />,
    videoSrc: "/videos/Residential.mp4",
    features: [
      "Exterior aerial footage and photography",
      "Property boundary visualization",
      "Neighborhood overview shots",
      "Interactive tour integration",
      "Same-day delivery options"
    ],
    process: [
      { step: 1, title: "Property Assessment", desc: "We evaluate the property's best features and angles" },
      { step: 2, title: "Capture Plan", desc: "We develop a shot list to showcase the property" },
      { step: 3, title: "Filming", desc: "Our team captures both aerial and ground footage" },
      { step: 4, title: "Editing", desc: "Professional compilation of footage with listing information" },
      { step: 5, title: "Distribution", desc: "Delivery in formats ready for your listing platforms" }
    ],
    info: {
      turnaround: "1-2 business days",
      coverage: "Properties up to 10 acres",
      pricing: "Starting at $349",
      availability: "7 days a week"
    },
    relatedServices: [1, 2, 4]
  },
  {
    id: 4,
    title: "Construction Monitoring",
    shortDesc: "Regular site documentation for project management.",
    fullDesc: "Keep your construction projects on track with our comprehensive aerial monitoring services. We provide regular site documentation through aerial imagery and 3D mapping to track progress, identify potential issues, and maintain records for stakeholders.",
    icon: <FaBuilding />,
    videoSrc: "/videos/Construction.mp4",
    features: [
      "Weekly or monthly progress documentation",
      "3D site mapping and modeling",
      "Measurement and volumetric calculations",
      "Before and after comparisons",
      "Secure online delivery portal"
    ],
    process: [
      { step: 1, title: "Initial Assessment", desc: "We map the entire site and establish baseline data" },
      { step: 2, title: "Schedule Setup", desc: "We establish a regular monitoring schedule" },
      { step: 3, title: "Data Capture", desc: "Regular flights to document progress consistently" },
      { step: 4, title: "Processing", desc: "Images processed into 3D models and progress reports" },
      { step: 5, title: "Ongoing Reporting", desc: "Secure access to all historical and current site data" }
    ],
    info: {
      turnaround: "Within 24 hours of capture",
      coverage: "Sites up to 100 acres",
      pricing: "Starting at $599/month",
      availability: "Scheduled weekly or monthly"
    },
    relatedServices: [1, 5]
  },
  {
    id: 5,
    title: "Inspection Services",
    shortDesc: "Safe, efficient inspections of hard-to-reach areas.",
    fullDesc: "Our drone inspection services provide a safe and cost-effective alternative to traditional inspection methods. We can access difficult or dangerous areas without scaffolding or lifts, delivering detailed imagery of roofs, towers, power lines, bridges, and other structures.",
    icon: <FaSearchPlus />,
    videoSrc: "/videos/Scaffolding.mp4",
    features: [
      "Thermal imaging capability",
      "Detailed visual reports",
      "No equipment rental needed",
      "Reduced safety risks",
      "High-resolution zoom capabilities"
    ],
    process: [
      { step: 1, title: "Inspection Planning", desc: "We discuss specific inspection requirements" },
      { step: 2, title: "Site Assessment", desc: "We identify potential challenges and flight paths" },
      { step: 3, title: "Data Collection", desc: "Our pilots capture detailed visual data of all areas" },
      { step: 4, title: "Analysis", desc: "Our team analyzes imagery for defects or issues" },
      { step: 5, title: "Reporting", desc: "Comprehensive report with findings and recommendations" }
    ],
    info: {
      turnaround: "2-3 business days",
      coverage: "Unlimited within structure limitations",
      pricing: "Starting at $449",
      availability: "Monday-Friday"
    },
    relatedServices: [4, 1]
  },
  {
    id: 6,
    title: "Wedding & Event Coverage",
    shortDesc: "Capture special moments from spectacular perspectives.",
    fullDesc: "Make your special events unforgettable with our drone event coverage services. Whether it's a wedding, concert, festival, or sporting event, our skilled pilots can capture the scale and excitement from above while documenting those once-in-a-lifetime moments from perspectives your guests will never forget.",
    icon: <FaRing />,
    videoSrc: "/videos/Wedding.mp4",
    features: [
      "Live-streaming capability",
      "Crowd shots and venue overview",
      "Coordination with event timeline",
      "Multiple drone options available",
      "Same-day highlight reels"
    ],
    process: [
      { step: 1, title: "Event Consultation", desc: "We plan coverage around your event schedule" },
      { step: 2, title: "Site Visit", desc: "We scout the venue to optimize flight paths" },
      { step: 3, title: "Coordination", desc: "We coordinate with your other vendors and venue" },
      { step: 4, title: "Capture", desc: "Our discreet pilots capture key moments from above" },
      { step: 5, title: "Production", desc: "Professional editing with your music and style preferences" }
    ],
    info: {
      turnaround: "3-7 business days",
      coverage: "Up to 3 hours of event time",
      pricing: "Starting at $799",
      availability: "Based on event schedule"
    },
    relatedServices: [1, 2]
  }
];

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  
  // Get the service based on the ID in the URL
  useEffect(() => {
    const serviceId = parseInt(id, 10);
    const foundService = services.find(s => s.id === serviceId);
    setService(foundService);
    
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  // Function to get service by ID for related services
  const getServiceById = (serviceId) => {
    return services.find(s => s.id === serviceId);
  };

  if (!service) {
    return (
      <PageTransition>
        <div className="service-detail-page">
          <div className="service-not-found">
            <h1>Service Not Found</h1>
            <p>The service you're looking for doesn't exist or has been removed.</p>
            <motion.button 
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="service-detail-page">
        {/* Hero Section */}
        <div className="service-detail-hero" style={{ backgroundImage: `url(${service.heroImage || '/images/services-hero.jpg'})` }}>
          <div className="service-detail-hero-overlay"></div>
          <div className="service-detail-hero-content">
            <h1>{service.title}</h1>
            <p>{service.shortDesc}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="service-detail-container">
          <div className="back-section">
            <motion.button 
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
            >
              <FaArrowLeft /> Back to Services
            </motion.button>
          </div>
          
          <div className="service-detail-content">
            <div className="service-detail-main">
              <div className="service-detail-intro">
                <div className="service-detail-icon">
                  {service.icon}
                </div>
                <h2>Overview</h2>
                <p>{service.fullDesc}</p>
              </div>
              
              <div className="service-detail-video">
                <video 
                  className="detail-video" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src={service.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="service-key-features">
                <h2>Key Features</h2>
                <ul className="detail-feature-list">
                  {service.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="feature-check"><FaCheck /></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="service-detail-section">
                <h2>Our Process</h2>
                <div className="service-process">
                  {service.process.map((step) => (
                    <motion.div 
                      className="process-step"
                      key={step.step}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ delay: (step.step - 1) * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="step-number">{step.step}</div>
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="service-sidebar">
              <motion.div 
                className="service-cta-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3>Ready to Get Started?</h3>
                <p>Contact us today to discuss your project requirements and receive a customized quote.</p>
                <motion.button 
                  className="cta-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                >
                  Request a Quote
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="service-info-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3>Service Details</h3>
                <div className="info-item">
                  <span><FaClock /> Turnaround Time</span>
                  <span>{service.info.turnaround}</span>
                </div>
                <div className="info-item">
                  <span><FaMapMarkerAlt /> Coverage</span>
                  <span>{service.info.coverage}</span>
                </div>
                <div className="info-item">
                  <span><FaMoneyBillWave /> Pricing</span>
                  <span>{service.info.pricing}</span>
                </div>
                <div className="info-item">
                  <span>Availability</span>
                  <span>{service.info.availability}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="related-services"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3>Related Services</h3>
                <ul>
                  {service.relatedServices.map((relatedId) => {
                    const relatedService = getServiceById(relatedId);
                    return (
                      <li key={relatedId}>
                        <Link to={`/services/${relatedId}`}>
                          {relatedService ? relatedService.title : 'Unknown Service'}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="service-detail-cta"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>Ready to Elevate Your Perspective?</h2>
            <p>Our professional drone pilots are ready to bring your vision to life with cutting-edge equipment and years of expertise.</p>
            <motion.button 
              className="cta-btn-large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ServiceDetail;