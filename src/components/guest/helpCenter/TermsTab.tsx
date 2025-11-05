import React from 'react';
import { FileText } from 'lucide-react';

export const TermsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-heritage-green/5 to-heritage-neutral/5 rounded-2xl p-8 border border-heritage-green/10">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-2xl bg-heritage-green shadow-lg shadow-heritage-green/30">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Terms & Conditions</h2>
            <p className="text-sm text-gray-500">Last Updated: November 4, 2025</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Booking & Reservations
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Guests must be at least 18 years old to book</li>
            <li>Valid ID required at check-in</li>
            <li>Reservations confirmed upon receipt of booking reference</li>
            <li>We reserve the right to refuse any booking</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Check-in & Check-out
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Check-in: 2:00 PM | Check-out: 12:00 PM</li>
            <li>Early check-in/late check-out subject to availability</li>
            <li>Additional charges may apply for extended hours</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Cancellation Policy
          </h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl">
              <p className="font-bold text-emerald-900">Free Cancellation</p>
              <p className="text-sm text-emerald-800">48+ hours before check-in</p>
            </div>
            <div className="p-3 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-lg">
              <p className="font-bold text-amber-900">One Night Charge</p>
              <p className="text-sm text-amber-800">Within 48 hours of check-in</p>
            </div>
            <div className="p-3 border-l-4 border-red-500 bg-red-50/50 rounded-r-lg">
              <p className="font-bold text-red-900">Full Charge</p>
              <p className="text-sm text-red-800">No-show without cancellation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Payment Terms
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>All major credit cards accepted</li>
            <li>Security deposit may be required</li>
            <li>Prices include 12% VAT and 10% service charge</li>
            <li>Rates quoted in Philippine Peso (₱)</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Guest Responsibilities
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Respect other guests and quiet hours (10 PM - 7 AM)</li>
            <li>No smoking in rooms (₱5,000 fine)</li>
            <li>Report damages immediately</li>
            <li>Do not exceed maximum occupancy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
