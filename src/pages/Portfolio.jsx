import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import '../styles/Portfolio.css'; // Updated import to use Portfolio.css

function Portfolio() {
  // This would ideally be populated from a database or CMS
  const portfolioItems = [
    {
      id: 1,
      title: 'Beachfront Property',
      category: 'Real Estate',
      imageUrl: '/images/portfolio-1.jpg',
      description: 'Aerial photography of luxury beachfront property'
    },
    {
      id: 2,
      title: 'Mountain Wedding',
      category: 'Events',
      imageUrl: '/images/portfolio-2.jpg',
      description: 'Drone footage of a scenic mountain wedding ceremony'
    },
    {
      id: 3,
      title: 'City Skyline',
      category: 'Commercial',
      imageUrl: '/images/portfolio-3.jpg',
      description: 'Panoramic view of downtown at sunset'
    },
    {
      id: 4,
      title: 'Construction Site Progress',
      category: 'Construction',
      imageUrl: '/images/portfolio-4.jpg',
      description: 'Monthly progress tracking of commercial development'
    },
    {
      id: 5,
      title: 'Golf Course Flyover',
      category: 'Sports',
      imageUrl: '/images/portfolio-5.jpg',
      description: 'Complete aerial tour of championship golf course'
    },
    {
      id: 6,
      title: 'Coastal Highway',
      category: 'Travel',
      imageUrl: '/images/portfolio-6.jpg',
      description: 'Scenic coastal highway footage for tourism board'
    }
  ];

  return (
    <PageTransition>
      <div className="portfolio-container">
        <h1>OUR WORK</h1>
        <div className="portfolio-filter">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Real Estate</button>
          <button className="filter-btn">Events</button>
          <button className="filter-btn">Commercial</button>
        </div>
        <div className="portfolio-grid">
          {portfolioItems.map(item => (
            <div key={item.id} className="portfolio-item">
              <div className="portfolio-img-container">
                <img src={item.imageUrl} alt={item.title} className="portfolio-img" />
              </div>
              <div className="portfolio-content">
                <h3>{item.title}</h3>
                <p className="portfolio-category">{item.category}</p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

export default Portfolio;