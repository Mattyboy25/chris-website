import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import { ThemeProvider } from './components/ThemeContext';
import AnimatedLayout from './components/AnimatedLayout';
import './App.css';
import { FaCamera, FaVideo, FaHome, FaBuilding, FaSearchPlus, FaRing } from 'react-icons/fa';

function App() {
  // Service data that will be shared between Services and ServiceDetail components
  const services = [
    {
      id: 1,
      title: "Aerial Photography",
      shortDesc: "Stunning high-resolution aerial imagery for any project.",
      fullDesc: "Our professional aerial photography services deliver breathtaking high-resolution images from unique perspectives that ground-based photography simply cannot achieve. Perfect for real estate listings, construction documentation, event coverage, or artistic landscape shots.",
      icon: <FaCamera />,
      videoSrc: "/videos/Houses.mp4",
      heroImage: "/images/services-hero.jpg",
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
      icon: <FaVideo />,
      videoSrc: "/videos/City.mp4",
      heroImage: "/images/services-hero.jpg",
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
      icon: <FaHome />,
      videoSrc: "/videos/Residential.mp4",
      heroImage: "/images/services-hero.jpg",
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
      icon: <FaBuilding />,
      videoSrc: "/videos/Construction.mp4",
      heroImage: "/images/services-hero.jpg",
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
      icon: <FaSearchPlus />,
      videoSrc: "/videos/Scaffolding.mp4",
      heroImage: "/images/services-hero.jpg",
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
      title: "Weddings",
      shortDesc: "Capture special moments from spectacular perspectives.",
      fullDesc: "Make your special events unforgettable with our drone event coverage services. Whether it's a wedding, concert, festival, or sporting event, our skilled pilots can capture the scale and excitement from above while documenting those once-in-a-lifetime moments from perspectives your guests will never forget.",
      icon: <FaRing />,
      videoSrc: "/videos/Wedding.mp4",
      heroImage: "/images/services-hero.jpg",
      features: [
        "Live-streaming capability",
        "Crowd shots and venue overview",
        "Coordination with event timeline",
        "Multiple drone options available",
        "Same-day highlight reels"
      ]
    }
  ];

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <AnimatedLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail services={services} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatedLayout>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
