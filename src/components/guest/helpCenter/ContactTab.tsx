import React from 'react';
import { Mail } from 'lucide-react';

type TabType = 'faqs' | 'privacy' | 'terms' | 'about' | 'contact';

interface ContactTabProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({ onNavigateToTab }) => {
  return (
    <div className="p-8 space-y-6 border shadow-xl animate-fade-in bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
          <Mail className="w-6 h-6 text-heritage-green" />
        </div>
        <div>
          <h2 className="mb-2 text-3xl font-black text-heritage-green">Contact Us</h2>
          <p className="text-sm text-gray-600">We're here to help 24/7</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border-2 rounded-2xl border-heritage-green/20 bg-heritage-green/5">
          <h3 className="mb-4 text-xl font-bold text-heritage-green">Hotel Address</h3>
          <div className="space-y-3 text-gray-700">
            <p className="font-semibold">Balay Ginhawa Hotel</p>
            <p>123 Heritage Street</p>
            <p>Manila, Philippines 1000</p>
          </div>
        </div>

        <div className="p-6 border-2 rounded-2xl border-heritage-green/20 bg-heritage-green/5">
          <h3 className="mb-4 text-xl font-bold text-heritage-green">Contact Information</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Phone:</strong> +63 912 345 6789</p>
            <p><strong>Email:</strong> info@balayginhawa.com</p>
            <p><strong>Reservations:</strong> reservations@balayginhawa.com</p>
          </div>
        </div>

        <div className="p-6 border-2 rounded-2xl border-heritage-green/20 bg-heritage-green/5">
          <h3 className="mb-4 text-xl font-bold text-heritage-green">Operating Hours</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Front Desk:</strong> 24/7</p>
            <p><strong>Restaurant:</strong> 6:30 AM - 11:00 PM</p>
            <p><strong>Pool:</strong> 6:00 AM - 10:00 PM</p>
            <p><strong>Gym:</strong> 24/7 (Hotel Guests)</p>
          </div>
        </div>

        <div className="p-6 border-2 rounded-2xl border-heritage-green/20 bg-heritage-green/5">
          <h3 className="mb-4 text-xl font-bold text-heritage-green">Quick Links</h3>
          <div className="space-y-2">
            {onNavigateToTab && (
              <>
                <button
                  onClick={() => onNavigateToTab('faqs')}
                  className="block w-full px-4 py-2 text-left transition-colors rounded-lg text-heritage-green hover:bg-heritage-green hover:text-white"
                >
                  → View FAQs
                </button>
                <button
                  onClick={() => onNavigateToTab('privacy')}
                  className="block w-full px-4 py-2 text-left transition-colors rounded-lg text-heritage-green hover:bg-heritage-green hover:text-white"
                >
                  → Privacy Policy
                </button>
                <button
                  onClick={() => onNavigateToTab('terms')}
                  className="block w-full px-4 py-2 text-left transition-colors rounded-lg text-heritage-green hover:bg-heritage-green hover:text-white"
                >
                  → Terms & Conditions
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 text-center border-2 rounded-2xl border-heritage-green/20 bg-gradient-to-br from-heritage-green/5 to-heritage-light/10">
        <h3 className="mb-3 text-xl font-bold text-heritage-green">Need Immediate Assistance?</h3>
        <p className="mb-4 text-gray-700">Our team is available 24/7 to assist you</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+639123456789"
            className="px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:shadow-xl hover:scale-105"
          >
            Call Now
          </a>
          <a
            href="mailto:info@balayginhawa.com"
            className="px-6 py-3 font-bold transition-all duration-300 border-2 bg-white text-heritage-green border-heritage-green rounded-xl hover:bg-heritage-green hover:text-white"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
};
