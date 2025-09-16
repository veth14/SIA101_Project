import React from 'react';

export const WelcomeSection: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif text-heritage-green">Welcome to Balay Ginhawa</h2>
          <p className="text-gray-700 leading-relaxed">
            Nestled in the heart of the city, Balay Ginhawa combines the warmth of Filipino hospitality with modern luxury.
            Our heritage-inspired design and contemporary amenities create an unforgettable stay that celebrates Filipino culture.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Experience the perfect blend of tradition and comfort, where every detail tells a story of our rich heritage.
          </p>
        </div>
        <div className="relative h-96">
          <img
            src="/images/lobby.jpg"
            alt="Balay Ginhawa Lobby"
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};
