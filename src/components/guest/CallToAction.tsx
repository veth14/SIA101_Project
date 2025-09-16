import React from 'react';
import { Link } from 'react-router-dom';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-heritage-green text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-6">Experience Filipino Hospitality</h2>
        <p className="text-lg mb-8">Book your stay now and create lasting memories at Balay Ginhawa.</p>
        <Link
          to="/booking"
          className="inline-block bg-white text-heritage-green px-8 py-3 rounded-md hover:bg-opacity-90 transition-all"
        >
          Reserve Now
        </Link>
      </div>
    </section>
  );
};
