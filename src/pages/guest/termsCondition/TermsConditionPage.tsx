import React from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle, DollarSign, Calendar } from 'lucide-react';

export const TermsConditionPage: React.FC = () => {
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
                <FileText className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-black text-heritage-green">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-700">
            Last Updated: November 4, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <AlertCircle className="w-6 h-6 text-heritage-green" />
            </div>
            <div>
              <h2 className="mb-3 text-2xl font-black text-heritage-green">Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                Welcome to Balay Ginhawa Hotel. These Terms and Conditions ("Terms") govern your use of our hotel services, facilities, and website. By making a reservation or using our services, you agree to comply with and be bound by these Terms. Please read them carefully before booking.
              </p>
            </div>
          </div>
        </div>

        {/* Reservations and Bookings */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <Calendar className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Reservations and Bookings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Booking Confirmation</h3>
              <p className="leading-relaxed text-gray-700">
                A reservation is confirmed only upon receipt of a confirmation email or booking reference number. All bookings are subject to availability and our acceptance. We reserve the right to refuse any booking at our discretion.
              </p>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Minimum Age Requirement</h3>
              <p className="leading-relaxed text-gray-700">
                Guests must be at least 18 years old to make a reservation or check in. Guests under 18 must be accompanied by a parent or legal guardian throughout their stay.
              </p>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Valid Identification</h3>
              <p className="leading-relaxed text-gray-700">
                Upon check-in, all guests must present valid government-issued identification (passport, driver's license, or national ID). The name on the ID must match the booking name. Failure to provide valid identification may result in denial of check-in without refund.
              </p>
            </div>
          </div>
        </div>

        {/* Check-in and Check-out */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Check-in and Check-out</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="flex-shrink-0 w-6 h-6 mt-1 text-heritage-green" />
              <div>
                <p className="font-bold text-gray-900">Check-in Time:</p>
                <p className="text-gray-700">2:00 PM. Early check-in is subject to availability and may incur additional charges.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="flex-shrink-0 w-6 h-6 mt-1 text-heritage-green" />
              <div>
                <p className="font-bold text-gray-900">Check-out Time:</p>
                <p className="text-gray-700">12:00 PM (noon). Late check-out is subject to availability and may incur charges equivalent to half-day or full-day rates.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="flex-shrink-0 w-6 h-6 mt-1 text-heritage-green" />
              <div>
                <p className="font-bold text-gray-900">Express Check-out:</p>
                <p className="text-gray-700">Available through our mobile app or by notifying the front desk the night before departure.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <DollarSign className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Payment Terms</h2>
          </div>
          
          <div className="space-y-3 text-gray-700">
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed">
                <strong>Payment Methods:</strong> We accept cash (Philippine Peso), major credit cards (Visa, Mastercard, American Express, JCB), debit cards, and bank transfers.
              </li>
              <li className="leading-relaxed">
                <strong>Credit Card Authorization:</strong> A valid credit card is required to guarantee your reservation. The card will be pre-authorized for the total amount of your stay plus incidental charges.
              </li>
              <li className="leading-relaxed">
                <strong>Security Deposit:</strong> A refundable security deposit of ₱2,000 (or one night's room rate, whichever is higher) may be required upon check-in to cover incidental charges and potential damages.
              </li>
              <li className="leading-relaxed">
                <strong>Currency:</strong> All rates are quoted in Philippine Peso (₱). Foreign currency payments are subject to the prevailing exchange rate at the time of payment.
              </li>
              <li className="leading-relaxed">
                <strong>Taxes and Fees:</strong> All rates are subject to applicable government taxes and service charges. Current rates include 12% VAT and 10% service charge unless otherwise specified.
              </li>
            </ul>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <XCircle className="w-6 h-6 text-heritage-green" />
            </div>
            <h2 className="text-2xl font-black text-heritage-green">Cancellation and Modification Policy</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/50 rounded-r-xl">
              <p className="mb-2 font-bold text-emerald-900">Free Cancellation Period</p>
              <p className="text-emerald-800">Cancellations made 48 hours or more before check-in date are eligible for full refund.</p>
            </div>

            <div className="p-4 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-xl">
              <p className="mb-2 font-bold text-amber-900">Late Cancellation</p>
              <p className="text-amber-800">Cancellations made within 48 hours of check-in will incur a charge equivalent to one night's stay.</p>
            </div>

            <div className="p-4 border-l-4 border-red-500 bg-red-50/50 rounded-r-xl">
              <p className="mb-2 font-bold text-red-900">No-Show Policy</p>
              <p className="text-red-800">Failure to check in without prior cancellation will result in charges for the entire reserved stay with no refund.</p>
            </div>

            <div className="mt-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>Special Bookings:</strong> Non-refundable rates, promotional packages, and group bookings may have different cancellation policies as specified at the time of booking.
              </p>
              <p className="mt-2 leading-relaxed">
                <strong>Modifications:</strong> Reservation changes are subject to availability. Date changes may require rate adjustments based on new dates' pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Guest Conduct */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Guest Conduct and Responsibilities</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">Guests are expected to:</p>
            <ul className="ml-6 space-y-2 list-disc">
              <li className="leading-relaxed">Respect other guests and maintain reasonable noise levels, especially during quiet hours (10:00 PM - 7:00 AM)</li>
              <li className="leading-relaxed">Comply with all hotel rules and regulations</li>
              <li className="leading-relaxed">Not smoke in non-designated areas (₱5,000 fine applies)</li>
              <li className="leading-relaxed">Report any damages or issues immediately to hotel staff</li>
              <li className="leading-relaxed">Not bring illegal substances, weapons, or prohibited items onto the property</li>
              <li className="leading-relaxed">Maintain responsibility for personal belongings</li>
              <li className="leading-relaxed">Not exceed maximum room occupancy (varies by room type)</li>
              <li className="leading-relaxed">Register all guests at the front desk, including visitors</li>
            </ul>
          </div>
        </div>

        {/* Liability and Damages */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Liability and Damages</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Guest Liability</h3>
              <p className="leading-relaxed">
                Guests are financially responsible for any damage, loss, or excessive cleaning required beyond normal wear and tear. Charges will be assessed and billed to the credit card on file.
              </p>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Hotel Liability</h3>
              <p className="leading-relaxed">
                While we take reasonable precautions, Balay Ginhawa Hotel is not liable for loss, theft, or damage to personal belongings. We strongly recommend using in-room safes for valuables. The hotel's liability is limited to the extent permitted by law.
              </p>
            </div>

            <div className="pl-4 border-l-4 border-heritage-green">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Force Majeure</h3>
              <p className="leading-relaxed">
                We are not responsible for failure to perform our obligations due to circumstances beyond our control, including natural disasters, pandemics, government actions, or other force majeure events.
              </p>
            </div>
          </div>
        </div>

        {/* Pets and Service Animals */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Pets and Service Animals</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Balay Ginhawa Hotel is currently not pet-friendly. However, service animals for guests with disabilities are welcome with proper documentation. Please inform us at the time of booking.
            </p>
          </div>
        </div>

        {/* Smoking Policy */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Smoking Policy</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Balay Ginhawa Hotel is a smoke-free property. Smoking is only permitted in designated outdoor areas. Smoking in guest rooms or non-designated areas will result in a ₱5,000 deep-cleaning fee.
            </p>
          </div>
        </div>

        {/* Privacy and Data Protection */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Privacy and Data Protection</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data. By using our services, you consent to our data practices as described in the Privacy Policy.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Amendments to Terms</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Balay Ginhawa Hotel reserves the right to modify these Terms and Conditions at any time. Updated terms will be posted on our website with a revised "Last Updated" date. Continued use of our services constitutes acceptance of any changes.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-white/60">
          <h2 className="mb-6 text-2xl font-black text-heritage-green">Governing Law and Disputes</h2>
          
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              These Terms and Conditions are governed by the laws of the Republic of the Philippines. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Manila, Philippines.
            </p>
            <p className="leading-relaxed">
              We encourage guests to resolve concerns directly with our management before pursuing legal action.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl p-10 mx-auto mb-10 border shadow-xl bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10 rounded-3xl border-heritage-green/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-2xl bg-heritage-green/10">
              <AlertCircle className="w-6 h-6 text-heritage-green" />
            </div>
            <div>
              <h2 className="mb-3 text-2xl font-black text-heritage-green">Questions About These Terms?</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have any questions regarding these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Balay Ginhawa Hotel</strong></p>
                <p>123 Heritage Street, Manila, Philippines 1000</p>
                <p>Email: info@balayginhawa.com</p>
                <p>Phone: +63 912 345 6789</p>
                <p>Front Desk: Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="max-w-6xl p-8 mx-auto border-2 border-heritage-green/30 bg-heritage-green/5 rounded-3xl">
          <p className="text-sm font-semibold leading-relaxed text-center text-gray-700">
            By making a reservation or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionPage;
