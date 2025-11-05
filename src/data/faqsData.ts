export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES = ['All', 'Booking', 'Check-in', 'Rooms', 'Facilities', 'Dining', 'Payment', 'Services'] as const;

export const FAQS_DATA: FAQItem[] = [
  {
    id: 1,
    category: 'Booking',
    question: 'How do I make a reservation?',
    answer: 'You can make a reservation through our website by clicking the "Book Now" button, selecting your preferred room type, check-in and check-out dates, and completing the booking form. You can also call us directly at +63 912 345 6789 or email our reservations team.'
  },
  {
    id: 2,
    category: 'Booking',
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation is available up to 48 hours before check-in. Cancellations within 48 hours will incur a one night charge. No-shows will be charged the full reservation amount.'
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
    answer: 'Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request (additional charges may apply).'
  },
  {
    id: 5,
    category: 'Check-in',
    question: 'What documents do I need?',
    answer: 'Please bring a valid government-issued ID (passport, driver\'s license, or national ID) and the credit card used for booking. International guests should have their passport and visa documentation if required.'
  },
  {
    id: 6,
    category: 'Rooms',
    question: 'What amenities are included?',
    answer: 'All rooms include free Wi-Fi, air conditioning, flat-screen TV, mini-fridge, coffee/tea maker, complimentary toiletries, and safe deposit box. Upgraded rooms may include additional amenities such as bathtubs, balconies, and living areas.'
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
    question: 'Is parking available?',
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
    answer: 'Yes, we serve a complimentary Filipino-inspired breakfast buffet from 6:30 AM to 10:30 AM daily, featuring both local and international dishes. In-room breakfast service is also available for an additional fee.'
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
    answer: 'We accept cash (PHP), all major credit cards (Visa, Mastercard, American Express, JCB), debit cards, and bank transfers. A valid credit card is required to guarantee your reservation.'
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
