import React from 'react';
import { FaCamera, FaVideo, FaHome } from 'react-icons/fa';

// Centralized services data
export const services = [
  {    id: 1,
    slug: "launch-package",
    title: "Launch Package",
    status: "active",
    shortDesc: "Perfect for residential listings and small commercial properties, our Launch Package provides high-quality aerial photography.",
    fullDesc: "Perfect for residential listings and small commercial properties, our Launch Package delivers high-quality aerial photography with professional color correction and quick turnaround time.",
    iconName: "FaCamera",
    videoSrc: "/videos/Town.mp4",
    features: [
      "10 High-quality aerial photos",
      "Professional color correction",
      "Property boundary shots",
      "24-hour delivery",
      "One flight location (30–45 mins)"
    ],
    process: [
      { step: 1, title: "Booking", desc: "Schedule your shoot at a convenient time" },
      { step: 2, title: "Planning", desc: "Brief consultation about property highlights" },
      { step: 3, title: "Capture", desc: "Professional drone photography session" },
      { step: 4, title: "Editing", desc: "Image enhancement and color correction" },
      { step: 5, title: "Delivery", desc: "Digital delivery of final images" }
    ],    info: {
      turnaround: "24 hours",
      coverage: "Up to 1 acre",
      pricing: "$175",
      availability: "7 days a week"
    },
    relatedServices: [2, 3]
  },  {
    id: 2,
    slug: "elevate-package",
    title: "Elevate Package",
    status: "active",
    shortDesc: "Comprehensive photo and video package combining aerial and ground coverage for a complete property showcase.",
    fullDesc: "Our Elevate Package combines aerial and ground photography with video for a complete property showcase. Includes high-quality photos and a professionally edited video tour optimized for social media.",
    iconName: "FaVideo",    videoSrc: "/videos/Real%20Estate%20Summergrove.mp4",
    features: [
      "Launch Package included plus:",
      "20 High-quality aerial photos",
      "15 Ground-level photos",
      "2-3 minute edited video tour",
      "Social media edits",
      "Property highlights feature"
    ],
    process: [
      { step: 1, title: "Consultation", desc: "Detailed planning of photo and video coverage" },
      { step: 2, title: "Location Scout", desc: "Virtual or in-person property assessment" },
      { step: 3, title: "Production", desc: "Complete photo and video capture" },
      { step: 4, title: "Post-Production", desc: "Professional editing and enhancement" },
      { step: 5, title: "Review & Delivery", desc: "Final approval and file delivery" }
    ],    info: {
      turnaround: "24 hours",
      coverage: "Up to 2 acres",
      pricing: "$350",
      availability: "7 days a week"
    },
    relatedServices: [1, 3]
  },  {
    id: 3,
    slug: "skyline-premium",
    title: "Skyline Premium",
    status: "active",
    shortDesc: "Our most comprehensive package with premium features for luxury properties and high-end real estate.",
    fullDesc: "Our Skyline Premium package delivers the ultimate property showcase with comprehensive aerial and ground coverage, cinematic video tours, twilight photography, and virtual tours. Perfect for luxury properties and high-end real estate.",
    iconName: "FaHome",    videoSrc: "/videos/City.mp4",
    features: [
      "Elevate Package included plus:",
      "30 High-quality aerial shots",
      "25 Ground-level photos",
      "5 minute cinematic video tour",
      "Social Media Optimized Clips",
      "Virtual property tour"
    ],
    process: [
      { step: 1, title: "Strategy", desc: "Comprehensive marketing plan development" },
      { step: 2, title: "Pre-Production", desc: "Detailed shot list and timeline planning" },
      { step: 3, title: "Day Shoot", desc: "Main photo and video production" },
      { step: 4, title: "Twilight Shoot", desc: "Evening/sunset photography session" },
      { step: 5, title: "Post-Production", desc: "Advanced editing and content preparation" },
      { step: 6, title: "Delivery", desc: "Complete marketing package handoff" }    ],    info: {
      turnaround: "24 hours",
      coverage: "Up to 5 acres",
      pricing: "$650",
      availability: "7 days a week"
    },
    relatedServices: [1, 2]
  }
];

// Add a helper for mapping icon names to components
export const iconMap = {
  FaCamera,
  FaVideo,
  FaHome
};

// Helper function to get service by slug
export const getServiceBySlug = (slug) => {
  return services.find(service => service.slug === slug);
};

// Helper function to get service by id
export const getServiceById = (id) => {
  return services.find(service => service.id === parseInt(id, 10));
};