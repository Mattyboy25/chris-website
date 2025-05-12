import React from 'react';
import { FaCamera, FaVideo, FaHome, FaBuilding, FaSearchPlus, FaRing } from 'react-icons/fa';

// Centralized services data
export const services = [
  {
    id: 1,
    slug: "aerial-photography",
    title: "Aerial Photography",
    shortDesc: "Stunning high-resolution aerial imagery for any project.",
    fullDesc: "Our professional aerial photography services deliver breathtaking high-resolution images from unique perspectives that ground-based photography simply cannot achieve. Perfect for real estate listings, construction documentation, event coverage, or artistic landscape shots.",
    iconName: "FaCamera",
    videoSrc: "/videos/Town.mp4",
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
    slug: "drone-videography",
    title: "Drone Videography",
    shortDesc: "Cinematic 4K aerial footage for stunning visual content.",
    fullDesc: "Capture your projects in motion with our cinematic drone videography services. From smooth fly-overs to dynamic tracking shots, we create breathtaking footage that engages your audience with professional video quality suitable for commercials, promotional content, and social media.",
    iconName: "FaVideo",
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
    slug: "real-estate-tours",
    title: "Real Estate Tours",
    shortDesc: "Comprehensive property showcases from every angle.",
    fullDesc: "Elevate your property listings with our comprehensive real estate aerial tours. We combine exterior drone footage with interior walkthroughs to create complete property showcases that highlight every feature and help properties sell faster by giving potential buyers a true sense of the space.",
    iconName: "FaHome",
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
    slug: "construction-monitoring",
    title: "Construction Monitoring",
    shortDesc: "Regular site documentation for project management.",
    fullDesc: "Keep your construction projects on track with our comprehensive aerial monitoring services. We provide regular site documentation through aerial imagery and 3D mapping to track progress, identify potential issues, and maintain records for stakeholders.",
    iconName: "FaBuilding",
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
    slug: "inspection-services",
    title: "Inspection Services",
    shortDesc: "Safe, efficient inspections of hard-to-reach areas.",
    fullDesc: "Our drone inspection services provide a safe and cost-effective alternative to traditional inspection methods. We can access difficult or dangerous areas without scaffolding or lifts, delivering detailed imagery of roofs, towers, power lines, bridges, and other structures.",
    iconName: "FaSearchPlus",
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
    slug: "wedding-event-coverage",
    title: "Wedding & Event Coverage",
    shortDesc: "Capture special moments from spectacular perspectives.",
    fullDesc: "Make your special events unforgettable with our drone event coverage services. Whether it's a wedding, concert, festival, or sporting event, our skilled pilots can capture the scale and excitement from above while documenting those once-in-a-lifetime moments from perspectives your guests will never forget.",
    iconName: "FaRing",
    videoSrc: "/videos/Weddingrings.mp4",
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

// Add a helper for mapping icon names to components
export const iconMap = {
  FaCamera,
  FaVideo,
  FaHome,
  FaBuilding,
  FaSearchPlus,
  FaRing
};

// Helper function to get service by slug
export const getServiceBySlug = (slug) => {
  return services.find(service => service.slug === slug);
};

// Helper function to get service by id
export const getServiceById = (id) => {
  return services.find(service => service.id === parseInt(id, 10));
};