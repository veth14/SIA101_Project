import React from 'react';
import { Info } from 'lucide-react';

export const AboutTab: React.FC = () => {
  return (
    <div className="p-8 space-y-6 border shadow-xl animate-fade-in bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
          <Info className="w-6 h-6 text-heritage-green" />
        </div>
        <div>
          <h2 className="mb-2 text-3xl font-black text-heritage-green">About Balay Ginhawa</h2>
          <p className="text-sm text-gray-600">Where Heritage Meets Modern Comfort</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Our Story</h3>
          <p className="leading-relaxed text-gray-700">
            Balay Ginhawa, which translates to "House of Comfort" in Filipino, was established with a vision to create a sanctuary where Filipino heritage and modern hospitality converge. Located in the heart of Manila, our hotel embodies the warmth and richness of Filipino culture while providing world-class amenities and service.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Our Mission</h3>
          <p className="leading-relaxed text-gray-700">
            To provide guests with an authentic Filipino experience through exceptional hospitality, cultural immersion, and comfortable accommodations that celebrate our heritage while embracing contemporary comfort.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Why Choose Us</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border-l-4 rounded-r-lg border-heritage-green bg-heritage-green/5">
              <h4 className="mb-2 font-bold text-heritage-green">Filipino Heritage</h4>
              <p className="text-sm text-gray-700">Authentic cultural experience with traditional Filipino design and hospitality</p>
            </div>
            <div className="p-4 border-l-4 rounded-r-lg border-heritage-green bg-heritage-green/5">
              <h4 className="mb-2 font-bold text-heritage-green">Modern Comfort</h4>
              <p className="text-sm text-gray-700">State-of-the-art amenities and facilities for your convenience</p>
            </div>
            <div className="p-4 border-l-4 rounded-r-lg border-heritage-green bg-heritage-green/5">
              <h4 className="mb-2 font-bold text-heritage-green">Prime Location</h4>
              <p className="text-sm text-gray-700">Strategic location in Manila with easy access to key attractions</p>
            </div>
            <div className="p-4 border-l-4 rounded-r-lg border-heritage-green bg-heritage-green/5">
              <h4 className="mb-2 font-bold text-heritage-green">Exceptional Service</h4>
              <p className="text-sm text-gray-700">24/7 dedicated staff committed to making your stay memorable</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Our Values</h3>
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li><strong>Malasakit (Care):</strong> We genuinely care about every guest's experience</li>
            <li><strong>Pagkakaisa (Unity):</strong> We work together as one family</li>
            <li><strong>Husay (Excellence):</strong> We strive for excellence in everything we do</li>
            <li><strong>Pagka-mapagkumbaba (Humility):</strong> We serve with grace and humility</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
