import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FaqsTab: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Booking',
      question: 'How do I make a reservation?',
      answer: 'You can make a reservation through our website by clicking the "Book Now" button, selecting your preferred room type, check-in and check-out dates, and completing the booking form. You can also call us directly at +63 912 345 6789.'
    },
    {
      id: 2,
      category: 'Booking',
      question: 'What is your cancellation policy?',
      answer: 'Free cancellation is available up to 48 hours before check-in. Cancellations within 48 hours will incur a one night charge. No-shows will be charged the full reservation amount.'
    },
    {
      id: 3,
      category: 'Check-in',
      question: 'What time is check-in and check-out?',
      answer: 'Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request (additional charges may apply).'
    },
    {
      id: 4,
      category: 'Check-in',
      question: 'What documents do I need?',
      answer: 'Please bring a valid government-issued ID (passport, driver\'s license, or national ID) and the credit card used for booking.'
    },
    {
      id: 5,
      category: 'Rooms',
      question: 'What amenities are included?',
      answer: 'All rooms include free Wi-Fi, air conditioning, flat-screen TV, mini-fridge, coffee/tea maker, complimentary toiletries, and safe deposit box.'
    },
    {
      id: 6,
      category: 'Facilities',
      question: 'Is parking available?',
      answer: 'Yes, we offer complimentary parking for all guests. Our secure parking area is monitored 24/7.'
    },
    {
      id: 7,
      category: 'Dining',
      question: 'Do you serve breakfast?',
      answer: 'Yes, we serve a complimentary Filipino-inspired breakfast buffet from 6:30 AM to 10:30 AM daily.'
    },
    {
      id: 8,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept cash (PHP), all major credit cards (Visa, Mastercard, American Express, JCB), debit cards, and bank transfers.'
    },
  ];

  const categories = ['All', 'Booking', 'Check-in', 'Rooms', 'Facilities', 'Dining', 'Payment'];

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
    <div className="space-y-8">
      {/* Enhanced Search Bar with Stats */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 p-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-heritage-green/10 ml-2">
                <Search className="w-5 h-5 text-heritage-green" />
              </div>
              <input
                type="text"
                placeholder="Ask a question or search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 pr-6 text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-4 text-gray-400 hover:text-heritage-green transition-colors"
                >
                  <span className="text-sm font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results Counter */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-gray-600 animate-fadeIn">
            <div className="w-1.5 h-1.5 bg-heritage-green rounded-full"></div>
            <span>
              Found <strong className="text-heritage-green">{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Category Pills with Counts */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const count = category === 'All' 
              ? faqs.length 
              : faqs.filter(faq => faq.category === category).length;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`group relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg shadow-heritage-green/30'
                    : 'bg-white text-gray-700 hover:text-heritage-green hover:bg-heritage-green/5 border-2 border-gray-200 hover:border-heritage-green/40 hover:shadow-md'
                }`}
              >
                <span className="flex items-center gap-2">
                  {category}
                  <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold ${
                    activeCategory === category
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-heritage-green/10 group-hover:text-heritage-green'
                  }`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhanced FAQ Cards */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-heritage-green/40 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="flex items-start justify-between w-full p-6 text-left transition-all duration-200"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20 group-hover:bg-heritage-green/20 transition-colors">
                      {faq.category}
                    </span>
                    {activeId === faq.id && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-heritage-green animate-fadeIn">
                        ● Reading
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-heritage-green transition-colors leading-relaxed">
                    {faq.question}
                  </h3>
                </div>
                <div className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  activeId === faq.id
                    ? 'bg-gradient-to-br from-heritage-green to-heritage-neutral text-white shadow-lg shadow-heritage-green/40 rotate-180'
                    : 'bg-gray-50 text-gray-400 group-hover:bg-heritage-green/10 group-hover:text-heritage-green group-hover:scale-110'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <div
                className={`transition-all duration-500 ease-in-out ${
                  activeId === faq.id
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t-2 border-gray-100">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-1 bg-gradient-to-b from-heritage-green to-heritage-neutral rounded-full"></div>
                      <p className="leading-relaxed text-gray-700 text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
