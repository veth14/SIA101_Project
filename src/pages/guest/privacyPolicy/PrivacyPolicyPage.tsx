import React from 'react';
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl opacity-25 rounded-full"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl opacity-20 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 py-16 mx-auto max-w-7xl sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-3xl">
                <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-black text-heritage-green">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700">
            Last Updated: November 4, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <FileText className="w-6 h-6 text-heritage-green" />
            </div>
            <div>
              <h2 className="mb-3 text-2xl font-black text-heritage-green">Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                At Balay Ginhawa Hotel, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our hotel, use our website, or engage with our services.
              </p>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <Eye className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Personal Information</h3>
              <p className="mb-2 text-gray-700">When you make a reservation or use our services, we may collect:</p>
              <ul className="ml-6 space-y-1 text-gray-700 list-disc">
                <li>Full name and contact details (email, phone number, address)</li>
                <li>Government-issued ID information for check-in verification</li>
                <li>Payment and billing information</li>
                <li>Date of birth and nationality</li>
                <li>Special requests or preferences (dietary requirements, room preferences)</li>
              </ul>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Automatically Collected Information</h3>
              <p className="mb-2 text-gray-700">When you visit our website, we automatically collect:</p>
              <ul className="ml-6 space-y-1 text-gray-700 list-disc">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website and search terms used</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Hotel Stay Information</h3>
              <p className="mb-2 text-gray-700">During your stay, we may collect:</p>
              <ul className="ml-6 space-y-1 text-gray-700 list-disc">
                <li>Check-in and check-out dates</li>
                <li>Room preferences and services used</li>
                <li>Feedback and survey responses</li>
                <li>CCTV footage for security purposes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <UserCheck className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">How We Use Your Information</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <p>We use your information to:</p>
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed">Process and manage your reservations and bookings</li>
              <li className="leading-relaxed">Provide and improve our hotel services and facilities</li>
              <li className="leading-relaxed">Communicate with you about your stay, bookings, and special offers</li>
              <li className="leading-relaxed">Process payments and prevent fraudulent transactions</li>
              <li className="leading-relaxed">Comply with legal obligations and regulatory requirements</li>
              <li className="leading-relaxed">Respond to your inquiries and provide customer support</li>
              <li className="leading-relaxed">Send you marketing communications (with your consent)</li>
              <li className="leading-relaxed">Analyze usage patterns to improve our website and services</li>
              <li className="leading-relaxed">Ensure the safety and security of our guests and property</li>
            </ul>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <Lock className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Information Sharing and Disclosure</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed"><strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations (payment processors, booking platforms, marketing services)</li>
              <li className="leading-relaxed"><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li className="leading-relaxed"><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of business assets</li>
              <li className="leading-relaxed"><strong>Protection:</strong> To protect our rights, property, or safety, and that of our guests and staff</li>
              <li className="leading-relaxed"><strong>With Your Consent:</strong> When you have given explicit permission to share your information</li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <Shield className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Data Security</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed">SSL/TLS encryption for data transmission</li>
              <li className="leading-relaxed">Secure servers with firewall protection</li>
              <li className="leading-relaxed">Regular security audits and updates</li>
              <li className="leading-relaxed">Restricted access to personal information</li>
              <li className="leading-relaxed">Staff training on data protection practices</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Your Privacy Rights</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">You have the right to:</p>
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed"><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li className="leading-relaxed"><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li className="leading-relaxed"><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li className="leading-relaxed"><strong>Objection:</strong> Object to processing of your personal information</li>
              <li className="leading-relaxed"><strong>Data Portability:</strong> Request transfer of your data to another service provider</li>
              <li className="leading-relaxed"><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </div>
        </div>

        {/* Cookies */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Cookies and Tracking Technologies</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Note that disabling cookies may affect website functionality.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Children's Privacy</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </div>
        </div>

        {/* Changes to Policy */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Changes to This Privacy Policy</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl p-10 mx-auto border shadow-xl bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10 rounded-3xl border-heritage-green/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <Mail className="w-6 h-6 text-heritage-green" />
            </div>
            <div>
              <h2 className="mb-3 text-2xl font-black text-heritage-green">Contact Us</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Balay Ginhawa Hotel</strong></p>
                <p>123 Heritage Street, Manila, Philippines 1000</p>
                <p>Email: privacy@balayginhawa.com</p>
                <p>Phone: +63 912 345 6789</p>
                <p>Data Protection Officer: dpo@balayginhawa.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
