export interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}
export declare const FAQ_CATEGORIES: readonly ["All", "Booking", "Check-in", "Rooms", "Facilities", "Dining", "Payment", "Services"];
export declare const FAQS_DATA: FAQItem[];
