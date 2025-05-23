import React from 'react';
import { FaCamera, FaVideo, FaHome } from 'react-icons/fa';

// Centralized services data
export const services = [
  {
    id: 1,
    slug: "basic-drone-photography",
    title: "Basic Drone Photography",
    shortDesc: "Essential aerial photography for real estate listings.",
    fullDesc: "Our basic drone photography package provides essential aerial views of your property with 10-12 high-quality images that highlight your property's best features and its surrounding context. Perfect for residential listings and small commercial properties.",
    iconName: "FaCamera",
    videoSrc: "/videos/Town.mp4",
    features: [
      "10-12 High-quality aerial images",
      "Professional editing and color correction",
      "24-48 hour turnaround time",
      "Property boundary visualization",
      "Multiple angles and elevations"
    ],
    process: [
      { step: 1, title: "Booking", desc: "Schedule your shoot at a convenient time" },
      { step: 2, title: "Planning", desc: "Brief consultation about property highlights" },
      { step: 3, title: "Capture", desc: "Professional drone photography session" },
      { step: 4, title: "Editing", desc: "Image enhancement and quality control" },
      { step: 5, title: "Delivery", desc: "Digital delivery of final images" }
    ],
    info: {
      turnaround: "24-48 hours",
      coverage: "Up to 1 acre",
      pricing: "$150",
      availability: "7 days a week"
    },
    relatedServices: [2, 3]
  },
  {
    id: 2,
    slug: "standard-photo-video",
    title: "Standard Package",
    shortDesc: "Comprehensive photo and video coverage for properties.",
    fullDesc: "Our standard package combines aerial photography and video for a complete property showcase. Includes high-resolution photos and a professionally edited video tour that highlights your property's key features from both air and ground perspectives.",
    iconName: "FaVideo",    videoSrc: "/videos/Real%20Estate%20Summergrove.mp4",
    features: [
      "15-20 High-quality aerial photos",
      "2-3 minute edited video tour",
      "Ground-level shots included",
      "Advanced editing and color grading",
      "Social media optimized formats",
      "Aerial property overview shots"
    ],
    process: [
      { step: 1, title: "Consultation", desc: "Detailed planning of photo and video coverage" },
      { step: 2, title: "Location Scout", desc: "Virtual or in-person property assessment" },
      { step: 3, title: "Production", desc: "Complete photo and video capture" },
      { step: 4, title: "Post-Production", desc: "Professional editing and enhancement" },
      { step: 5, title: "Review & Delivery", desc: "Final approval and file delivery" }
    ],
    info: {
      turnaround: "2-3 business days",
      coverage: "Up to 2 acres",
      pricing: "$250-$600",
      availability: "7 days a week"
    },
    relatedServices: [1, 3]
  },
  {
    id: 3,
    slug: "premium-full-production",
    title: "Premium Package",
    shortDesc: "Full-service real estate marketing package.",
    fullDesc: "Our premium package delivers the ultimate property showcase with comprehensive aerial and ground coverage, cinematic video tours, 3D virtual tours, and twilight photography. Perfect for luxury properties, large estates, and high-end commercial real estate.",
    iconName: "FaHome",
    videoSrc: "/videos/City.mp4",
    features: [
      "25+ High-resolution aerial & ground photos",
      "5-7 minute cinematic video tour",
      "3D Matterport virtual tour",
      "Twilight/sunset shots",
      "Drone orbit panoramas",
      "Interior videography",
      "Professional voice-over option",
      "Aerial neighborhood overview"
    ],
    process: [
      { step: 1, title: "Strategy", desc: "Comprehensive marketing plan development" },
      { step: 2, title: "Pre-Production", desc: "Detailed shot list and timeline planning" },
      { step: 3, title: "Day Shoot", desc: "Main photo and video production" },
      { step: 4, title: "Twilight Shoot", desc: "Evening/sunset photography session" },
      { step: 5, title: "Post-Production", desc: "Advanced editing and content preparation" },
      { step: 6, title: "Delivery", desc: "Complete marketing package handoff" }
    ],
    info: {
      turnaround: "3-5 business days",
      coverage: "Up to 5 acres",
      pricing: "$600-$2000",
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