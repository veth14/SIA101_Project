import { jsx as _jsx } from "react/jsx-runtime";
import StatsCard from './StatsCard';
import { WarningIcon, GroupUsersIcon, UsersIcon, CheckIcon } from '../shared/icons';
const StatsGrid = () => {
    const statsData = [
        {
            title: "Open Tickets",
            value: 8,
            badge: "3 urgent",
            icon: _jsx(WarningIcon, {}),
            iconBg: 'bg-green-100'
        },
        {
            title: "On-Duty Staff",
            value: 12,
            badge: "Currently Active",
            icon: _jsx(GroupUsersIcon, {}),
            iconBg: 'bg-blue-100'
        },
        {
            title: "Total Staff",
            value: 2,
            badge: "+2 this month",
            icon: _jsx(UsersIcon, {}),
            iconBg: 'bg-orange-100'
        },
        {
            title: "Completed Today",
            value: 15,
            badge: "Tasks done",
            icon: _jsx(CheckIcon, {}),
            iconBg: 'bg-purple-100'
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statsData.map((stat, index) => (_jsx(StatsCard, { title: stat.title, value: stat.value, badge: stat.badge, icon: stat.icon, iconBg: stat.iconBg, index: index }, stat.title))) }));
};
export default StatsGrid;
