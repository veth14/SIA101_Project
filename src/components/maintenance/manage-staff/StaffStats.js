import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StatsCard from '../overview/StatsCard';
import { UsersIcon } from '../shared/icons';
// Staff-specific icon
const HousekeepingIcon = () => (_jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }));
const MaintenanceIcon = () => (_jsxs("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }));
const StaffStats = () => {
    const statsData = [
        {
            title: "Total Staff",
            value: 8,
            badge: "All Departments",
            icon: _jsx(UsersIcon, {}),
            iconBg: 'bg-green-100'
        },
        {
            title: "Housekeeping",
            value: 2,
            badge: "Active",
            icon: _jsx(HousekeepingIcon, {}),
            iconBg: 'bg-blue-100'
        },
        {
            title: "Maintenance",
            value: 5,
            badge: "On Duty",
            icon: _jsx(MaintenanceIcon, {}),
            iconBg: 'bg-purple-100'
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: statsData.map((stat, index) => (_jsx(StatsCard, { title: stat.title, value: stat.value, badge: stat.badge, icon: stat.icon, iconBg: stat.iconBg, index: index }, stat.title))) }));
};
export default StaffStats;
