import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-heritage-green/5 to-heritage-neutral/5 rounded-2xl p-8 border border-heritage-green/10">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-2xl bg-heritage-green shadow-lg shadow-heritage-green/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Privacy Policy</h2>
            <p className="text-sm text-gray-500">Last Updated: November 4, 2025</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Introduction
          </h3>
          <p className="leading-relaxed text-gray-600">
            At Balay Ginhawa Hotel, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Information We Collect
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Personal information (name, email, phone, address)</li>
            <li>Government-issued ID for check-in verification</li>
            <li>Payment and billing information</li>
            <li>Booking and stay preferences</li>
            <li>Website usage data and cookies</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            How We Use Your Information
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Process and manage your reservations</li>
            <li>Provide and improve our services</li>
            <li>Communicate about bookings and offers</li>
            <li>Process payments and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-heritage-green rounded-full"></div>
            Your Rights
          </h3>
          <ul className="ml-6 space-y-2 text-gray-600 list-disc marker:text-heritage-green">
            <li>Access and review your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability rights</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl p-6 shadow-lg text-white">
          <h3 className="mb-4 text-xl font-semibold">Contact Us</h3>
          <p className="leading-relaxed text-white/90">
            For privacy concerns, contact us at: <strong>privacy@balayginhawa.com</strong> or call <strong>+63 912 345 6789</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
