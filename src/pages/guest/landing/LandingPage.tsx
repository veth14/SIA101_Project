import React, { useState, useEffect } from 'react';
import { FaWifi, FaSwimmingPool, FaSpa, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
import { HeroSection } from '../../../components/guest/HeroSection';
import { WelcomeSection } from '../../../components/guest/WelcomeSection';
import { AmenitiesSection } from '../../../components/guest/AmenitiesSection';
import { RoomCarousel } from '../../../components/guest/RoomCarousel';
import { TestimonialsSection } from '../../../components/guest/TestimonialsSection';
import { CallToAction } from '../../../components/guest/CallToAction';

interface Room {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
}

export const LandingPage: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const amenities = [
    { icon: FaWifi, name: 'Free Wi-Fi', description: 'High-speed internet throughout' },
    { icon: FaSwimmingPool, name: 'Infinity Pool', description: 'With Manila Bay view' },
    { icon: FaSpa, name: 'Spa Services', description: 'Traditional Filipino treatments' },
    { icon: FaUtensils, name: 'Restaurant', description: 'Local & international cuisine' },
    { icon: FaCalendarAlt, name: 'Events', description: 'Modern function rooms' }
  ];

  const rooms: Room[] = [
    {
      id: 1,
      name: 'Deluxe Room',
      description: 'Experience modern comfort with traditional Filipino design elements',
      image: '/images/deluxe-room.jpg',
      price: '₱4,500/night'
    },
    {
      id: 2,
      name: 'Heritage Suite',
      description: 'Immerse yourself in Filipino luxury with panoramic views',
      image: '/images/heritage-suite.jpg',
      price: '₱8,500/night'
    },
    {
      id: 3,
      name: 'Family Room',
      description: 'Spacious accommodation perfect for family gatherings',
      image: '/images/family-room.jpg',
      price: '₱6,500/night'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Maria Santos',
      rating: 5,
      text: 'The perfect blend of Filipino hospitality and modern luxury. Will definitely come back!',
      image: '/images/testimonial1.jpg'
    },
    {
      id: 2,
      name: 'John Cruz',
      rating: 5,
      text: 'Outstanding service and beautiful cultural touches throughout the hotel.',
      image: '/images/testimonial2.jpg'
    },
    {
      id: 3,
      name: 'Sarah Lee',
      rating: 5,
      text: 'A truly unique experience that showcases the best of Filipino heritage.',
      image: '/images/testimonial3.jpg'
    }
  ];

  useEffect(() => {
    const roomInterval = setInterval(() => {
      setCurrentRoom((prev) => (prev + 1) % rooms.length);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(roomInterval);
      clearInterval(testimonialInterval);
    };
  }, [rooms.length, testimonials.length]);

  return (
    <div className="min-h-screen bg-heritage-light">
      <HeroSection />
      <WelcomeSection />
      <AmenitiesSection amenities={amenities} />
      <RoomCarousel rooms={rooms} currentRoom={currentRoom} />
      <TestimonialsSection testimonials={testimonials} currentTestimonial={currentTestimonial} />
      <CallToAction />
    </div>
  );
};
