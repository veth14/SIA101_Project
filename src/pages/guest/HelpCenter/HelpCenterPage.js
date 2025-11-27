import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, Shield, FileText, Info, Mail } from 'lucide-react';
import { FaqsTab } from '../../../components/guest/helpCenter/FaqsTab';
import { PrivacyTab } from '../../../components/guest/helpCenter/PrivacyTab';
import { TermsTab } from '../../../components/guest/helpCenter/TermsTab';
import { AboutTab } from '../../../components/guest/helpCenter/AboutTab';
import { ContactTab } from '../../../components/guest/helpCenter/ContactTab';
export const HelpCenterPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('faqs');
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Set active tab based on URL path and scroll to top
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('privacy')) {
            setActiveTab('privacy');
        }
        else if (path.includes('terms')) {
            setActiveTab('terms');
        }
        else if (path.includes('contact')) {
            setActiveTab('contact');
        }
        else if (path.includes('about')) {
            setActiveTab('about');
        }
        else {
            setActiveTab('faqs');
        }
        // Scroll to top when URL changes (e.g., from footer navigation)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);
    const handleTabChange = (tab) => {
        // Start transition animation
        setIsTransitioning(true);
        // Small delay to show fade out effect
        setTimeout(() => {
            setActiveTab(tab);
            // Update URL based on tab
            const urlMap = {
                faqs: '/faqs',
                privacy: '/privacy-policy',
                terms: '/terms-conditions',
                about: '/about',
                contact: '/contact'
            };
            navigate(urlMap[tab]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // End transition after content loads
            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 150);
    };
    const tabs = [
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'contact', label: 'Contact', icon: Mail },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-heritage-green/5 pt-20", children: [_jsx("div", { className: "fixed inset-0 pointer-events-none overflow-hidden opacity-40", children: _jsx("div", { className: "absolute inset-0", style: {
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(var(--heritage-green-rgb, 76 130 89) / 0.08) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    } }) }), _jsx("div", { className: "relative z-10 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white py-16 mb-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm", children: _jsx(HelpCircle, { className: "w-10 h-10" }) }), _jsx("h1", { className: "text-5xl md:text-6xl font-bold mb-4 tracking-tight", children: "Help Center" }), _jsx("p", { className: "text-xl text-white/90 max-w-2xl mx-auto", children: "Find answers, explore our policies, and get in touch with our team" })] }) }), _jsxs("div", { className: "relative z-10 w-full px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8", children: [_jsx("div", { className: "mb-12", children: _jsx("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-100 p-2", children: _jsx("div", { className: "flex flex-wrap justify-center gap-2", children: tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (_jsxs("button", { onClick: () => handleTabChange(tab.id), className: `group relative flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-heritage-green text-white shadow-lg shadow-heritage-green/30'
                                            : 'text-gray-600 hover:text-heritage-green hover:bg-heritage-green/5'}`, children: [_jsx(Icon, { className: `w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}` }), _jsx("span", { children: tab.label }), activeTab === tab.id && (_jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-heritage-green rounded-full" }))] }, tab.id));
                                }) }) }) }), _jsx("div", { className: "max-w-6xl mx-auto", children: _jsxs("div", { className: `transition-all duration-300 ${isTransitioning
                                ? 'opacity-0 transform translate-y-4'
                                : 'opacity-100 transform translate-y-0'}`, children: [activeTab === 'faqs' && _jsx(FaqsTab, {}, "faqs"), activeTab === 'privacy' && _jsx(PrivacyTab, {}, "privacy"), activeTab === 'terms' && _jsx(TermsTab, {}, "terms"), activeTab === 'about' && _jsx(AboutTab, {}, "about"), activeTab === 'contact' && _jsx(ContactTab, { onNavigateToTab: handleTabChange }, "contact")] }) })] })] }));
};
export default HelpCenterPage;
