import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FaqsPage: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Booking',
      question: 'How do I make a reservation at Balay Ginhawa?',
      answer: 'You can make a reservation through our website by clicking the "Book Now" button, selecting your preferred room type, check-in and check-out dates, and completing the booking form. You can also call us directly or email our reservations team for assistance.'
    },
    {
      id: 2,
      category: 'Booking',
      question: 'What is your cancellation policy?',
      answer: 'Free cancellation is available up to 48 hours before your scheduled check-in time. Cancellations made within 48 hours of arrival will incur a charge equal to one night\'s stay. No-shows will be charged the full reservation amount.'
    },
    {
      id: 3,
      category: 'Booking',
      question: 'Can I modify my reservation after booking?',
      answer: 'Yes, you can modify your reservation up to 24 hours before check-in, subject to availability. Please contact our reservations team or log into your account to make changes. Additional charges may apply for upgrades or extended stays.'
    },
    {
      id: 4,
      category: 'Check-in',
      question: 'What time is check-in and check-out?',
      answer: 'Check-in time is 2:00 PM and check-out time is 12:00 PM (noon). Early check-in and late check-out may be available upon request and subject to availability and additional charges.'
    },
    {
      id: 5,
      category: 'Check-in',
      question: 'What documents do I need for check-in?',
      answer: 'Please bring a valid government-issued ID (passport, driver\'s license, or national ID) and the credit card used for booking. International guests should have their passport and visa documentation if required.'
    },
    {
      id: 6,
      category: 'Rooms',
      question: 'What amenities are included in the rooms?',
      answer: 'All rooms include free Wi-Fi, air conditioning, flat-screen TV with cable channels, mini-fridge, coffee/tea maker, complimentary toiletries, hair dryer, and safe deposit box. Upgraded rooms may include additional amenities such as bathtubs, balconies, and living areas.'
    },
    {
      id: 7,
      category: 'Rooms',
      question: 'Are your rooms family-friendly?',
      answer: 'Yes! We offer family suites with multiple beds and extra space. Children 12 and under stay free when using existing bedding. We can also provide cribs and rollaway beds upon request (additional charges may apply).'
    },
    {
      id: 8,
      category: 'Facilities',
      question: 'Do you have parking available?',
      answer: 'Yes, we offer complimentary parking for all guests. Our secure parking area is monitored 24/7 and can accommodate cars, vans, and small buses. Valet parking service is also available.'
    },
    {
      id: 9,
      category: 'Facilities',
      question: 'Is Wi-Fi available throughout the hotel?',
      answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel, including all guest rooms, common areas, restaurant, and pool area.'
    },
    {
      id: 10,
      category: 'Facilities',
      question: 'Do you have a swimming pool and gym?',
      answer: 'Yes, we have an infinity pool with a stunning Manila Bay view, open from 6:00 AM to 10:00 PM. Our fitness center is equipped with modern equipment and is accessible 24/7 for hotel guests.'
    },
    {
      id: 11,
      category: 'Dining',
      question: 'Do you serve breakfast?',
      answer: 'Yes, we serve a complimentary Filipino-inspired breakfast buffet from 6:30 AM to 10:30 AM, featuring both local and international dishes. In-room breakfast service is also available for an additional fee.'
    },
    {
      id: 12,
      category: 'Dining',
      question: 'Is there a restaurant on-site?',
      answer: 'Yes, our restaurant "Kusina ni Lola" serves authentic Filipino cuisine and international favorites for lunch and dinner. We also have a bar serving cocktails, local beers, and snacks until midnight.'
    },
    {
      id: 13,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept cash (Philippine Peso), all major credit cards (Visa, Mastercard, American Express, JCB), debit cards, and bank transfers. A valid credit card is required to guarantee your reservation.'
    },
    {
      id: 14,
      category: 'Payment',
      question: 'When will I be charged for my reservation?',
      answer: 'Your credit card will be pre-authorized at the time of booking to guarantee your reservation. The full payment will be charged upon check-in. For non-refundable bookings, payment is processed immediately upon confirmation.'
    },
    {
      id: 15,
      category: 'Services',
      question: 'Do you offer airport transfer services?',
      answer: 'Yes, we provide airport shuttle service to and from Ninoy Aquino International Airport (NAIA) for an additional fee. Please contact us at least 24 hours in advance to arrange pickup. Travel time is approximately 30-45 minutes depending on traffic.'
    },
    {
      id: 16,
      category: 'Services',
      question: 'Is laundry service available?',
      answer: 'Yes, we offer same-day laundry and dry cleaning services. Items collected before 9:00 AM will be returned by 6:00 PM the same day. Express service is available for an additional charge.'
    }
  ];

  const categories = ['All', 'Booking', 'Check-in', 'Rooms', 'Facilities', 'Dining', 'Payment', 'Services'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

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
                <HelpCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60"></div>
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-black text-heritage-green">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-700">
            Find answers to common questions about Balay Ginhawa Hotel
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-12 pr-4 text-gray-800 transition-all duration-300 border-2 shadow-lg bg-white/90 rounded-2xl border-heritage-green/20 focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-heritage-green/10 hover:text-heritage-green border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden transition-all duration-300 border shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl border-white/60 hover:shadow-xl hover:-translate-y-1"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex items-center justify-between w-full p-6 text-left transition-colors duration-200 hover:bg-heritage-green/5"
                >
                  <div className="flex-1 pr-4">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-heritage-green/10 text-heritage-green">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    activeId === faq.id
                      ? 'bg-heritage-green text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeId === faq.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    activeId === faq.id
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-200">
                      <p className="leading-relaxed text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-600">No questions found matching your search.</p>
              <p className="mt-2 text-gray-500">Try adjusting your search or browse by category.</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-5xl p-10 mx-auto mt-16 border shadow-xl bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10 rounded-3xl border-heritage-green/20">
          <div className="text-center">
            <h2 className="mb-3 text-2xl font-black text-heritage-green">
              Still have questions?
            </h2>
            <p className="mb-6 text-gray-700">
              Our team is here to help you 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+639123456789"
                className="px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:shadow-xl hover:scale-105"
              >
                Call Us: +63 912 345 6789
              </a>
              <a
                href="mailto:info@balayginhawa.com"
                className="px-6 py-3 font-bold transition-all duration-300 border-2 bg-white/90 text-heritage-green border-heritage-green rounded-xl hover:bg-heritage-green hover:text-white"
              >
                Email: info@balayginhawa.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;
