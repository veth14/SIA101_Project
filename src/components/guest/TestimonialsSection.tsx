import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  currentTestimonial: number;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, currentTestimonial }) => {
  return (
    <section className="w-full py-10 sm:py-12 md:py-16 bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Section Header - MOBILE RESPONSIVE */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-heritage-green/10 text-heritage-green text-sm sm:text-base md:text-lg font-medium rounded-full border border-heritage-green/20">
              Guest Reviews
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            What Our <span className="bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent">Guests Say</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Discover why travelers from around the world choose Balay Ginhawa for their Philippine experience
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-none px-2 sm:px-4">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-heritage-light/20">
                    {/* Rating Stars - MOBILE RESPONSIVE */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-full flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-bold">★</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quote Icon - MOBILE RESPONSIVE */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-heritage-green/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-heritage-green" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Testimonial Text - MOBILE RESPONSIVE */}
                    <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 font-medium text-center leading-relaxed mb-6 sm:mb-8 italic px-2 sm:px-4">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Guest Info */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 sm:border-4 border-heritage-light shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=4ade80&color=ffffff&size=128`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-heritage-green rounded-full flex items-center justify-center border-2 border-white">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="text-left">
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm sm:text-base text-heritage-neutral font-medium">Verified Guest</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-heritage-green scale-125' 
                  : 'bg-heritage-neutral/40 hover:bg-heritage-neutral/60'
              }`}
            />
          ))}
        </div>

        {/* Trust Indicators - MOBILE RESPONSIVE */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white/60 rounded-2xl border border-heritage-light/20">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-heritage-green mb-1 sm:mb-2">4.9/5</div>
            <div className="text-sm sm:text-base text-heritage-neutral font-medium">Average Rating</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white/60 rounded-2xl border border-heritage-light/20">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-heritage-green mb-1 sm:mb-2">2,500+</div>
            <div className="text-sm sm:text-base text-heritage-neutral font-medium">Happy Guests</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white/60 rounded-2xl border border-heritage-light/20">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-heritage-green mb-1 sm:mb-2">98%</div>
            <div className="text-sm sm:text-base text-heritage-neutral font-medium">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
};
