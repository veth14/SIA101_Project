import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const LoyaltyProgram = () => {
    const [selectedTier, setSelectedTier] = useState('all');
    const loyaltyMembers = [
        {
            id: '1',
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            tier: 'Gold',
            points: 2850,
            totalSpent: 45000,
            joinDate: '2023-03-15',
            lastStay: '2024-01-10',
            status: 'active'
        },
        {
            id: '2',
            name: 'John Rodriguez',
            email: 'john.rodriguez@email.com',
            tier: 'Silver',
            points: 1200,
            totalSpent: 18500,
            joinDate: '2023-08-22',
            lastStay: '2024-01-05',
            status: 'active'
        },
        {
            id: '3',
            name: 'Lisa Chen',
            email: 'lisa.chen@email.com',
            tier: 'Platinum',
            points: 5200,
            totalSpent: 78000,
            joinDate: '2022-11-10',
            lastStay: '2024-01-12',
            status: 'active'
        },
        {
            id: '4',
            name: 'Carlos Mendoza',
            email: 'carlos.mendoza@email.com',
            tier: 'Bronze',
            points: 450,
            totalSpent: 8500,
            joinDate: '2023-12-01',
            lastStay: '2024-01-08',
            status: 'active'
        }
    ];
    const getTierColor = (tier) => {
        const colors = {
            Bronze: 'bg-amber-100 text-amber-800 border-amber-200',
            Silver: 'bg-gray-100 text-gray-800 border-gray-200',
            Gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Platinum: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[tier] || colors.Bronze;
    };
    const getTierIcon = (tier) => {
        switch (tier) {
            case 'Bronze':
                return '🥉';
            case 'Silver':
                return '🥈';
            case 'Gold':
                return '🥇';
            case 'Platinum':
                return '💎';
            default:
                return '🏆';
        }
    };
    const filteredMembers = loyaltyMembers.filter(member => selectedTier === 'all' || member.tier === selectedTier);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("svg", { className: "w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search members, emails, or tiers...", className: "pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80" })] }), _jsxs("select", { value: selectedTier, onChange: (e) => setSelectedTier(e.target.value), className: "px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white", children: [_jsx("option", { value: "all", children: "All Tiers" }), _jsx("option", { value: "Bronze", children: "Bronze" }), _jsx("option", { value: "Silver", children: "Silver" }), _jsx("option", { value: "Gold", children: "Gold" }), _jsx("option", { value: "Platinum", children: "Platinum" })] })] }), _jsxs("button", { className: "bg-heritage-green text-white px-4 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors font-medium flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { children: "Add Member" })] })] }), _jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Member Info" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Tier" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Points Balance" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Total Spent" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Last Stay" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: filteredMembers.map((member) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: member.name }), _jsx("div", { className: "text-sm text-gray-500", children: member.email }), _jsxs("div", { className: "text-xs text-gray-400", children: ["Member since ", new Date(member.joinDate).toLocaleDateString()] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(member.tier)} space-x-1`, children: [_jsx("span", { children: getTierIcon(member.tier) }), _jsx("span", { children: member.tier })] }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-semibold text-gray-900", children: member.points.toLocaleString() }), _jsx("div", { className: "text-xs text-gray-500", children: "points" })] }), _jsxs("td", { className: "px-6 py-4", children: [_jsxs("div", { className: "font-semibold text-gray-900", children: ["\u20B1", member.totalSpent.toLocaleString()] }), _jsx("div", { className: "text-xs text-gray-500", children: "lifetime value" })] }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-700", children: new Date(member.lastStay).toLocaleDateString() }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-heritage-green hover:text-heritage-green/80 transition-colors", children: _jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }) }), _jsx("button", { className: "text-blue-600 hover:text-blue-800 transition-colors", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) })] }) })] }, member.id))) })] }) }) }), filteredMembers.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }) }), _jsx("p", { className: "text-gray-500 font-medium", children: "No loyalty members found for the selected tier." })] }))] }));
};
