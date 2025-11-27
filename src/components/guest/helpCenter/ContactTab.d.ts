import React from 'react';
type TabType = 'faqs' | 'privacy' | 'terms' | 'about' | 'contact';
interface ContactTabProps {
    onNavigateToTab?: (tab: TabType) => void;
}
export declare const ContactTab: React.FC<ContactTabProps>;
export {};
