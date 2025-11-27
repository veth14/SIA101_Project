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
export declare const TestimonialsSection: React.FC<TestimonialsSectionProps>;
export {};
