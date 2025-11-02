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
      name: 'Silid Payapa – Standard Room',
      description: 'Cozy and simple, perfect for solo travelers or couples.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱2,500/night'
    },
    {
      id: 2,
      name: 'Silid Marahuyo – Deluxe Room',
      description: 'Spacious with modern amenities, designed for comfort and relaxation.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱3,800/night'
    },
    {
      id: 3,
      name: 'Silid Ginhawa – Suite Room',
      description: 'Features a living area, elegant interiors, and added privacy.',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      price: '₱5,500/night'
    },
    {
      id: 4,
      name: 'Silid Haraya – Premium Family Suite',
      description: 'Large room with multiple beds, ideal for families or groups seeking both luxury and togetherness.',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: '₱8,000/night'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Maria Santos',
      rating: 5,
      text: 'Amazing Filipino hospitality and luxury. Will definitely return!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80'
    },
    {
      id: 2,
      name: 'John Cruz',
      rating: 5,
      text: 'Outstanding service and beautiful cultural touches throughout the hotel.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
      id: 3,
      name: 'Sarah Lee',
      rating: 5,
      text: 'A truly unique experience that showcases the best of Filipino heritage.',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
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
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <WelcomeSection />
      </section>
      <section id="amenities">
        <AmenitiesSection amenities={amenities} />
      </section>
      <section id="rooms">
        <RoomCarousel rooms={rooms} currentRoom={currentRoom} />
      </section>
      <section id="testimonials">
        <TestimonialsSection testimonials={testimonials} currentTestimonial={currentTestimonial} />
      </section>
      <section id="contact">
        <CallToAction />
      </section>
    </div>
  );
};
