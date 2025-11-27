import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ActivityItem from './ActivityItem';
import { EditIcon, UsersIcon, BulbIcon, CalendarIcon, MailIcon } from '../shared/icons';
const RecentActivity = () => {
    const activities = [
        {
            title: "John Doe stuck in elevator",
            description: "Elevator B",
            timeAgo: "5 min ago",
            status: "In Progress",
            icon: _jsx(EditIcon, {}),
            colorScheme: 'blue'
        },
        {
            title: "New ticket assigned to Mike Johnson",
            description: "HVAC System",
            timeAgo: "15 min ago",
            status: "Assigned",
            icon: _jsx(UsersIcon, {}),
            colorScheme: 'emerald'
        },
        {
            title: "New member add salary John Wilson",
            description: "HR Department",
            timeAgo: "32 min ago",
            status: "Pending",
            icon: _jsx(BulbIcon, {}),
            colorScheme: 'amber'
        },
        {
            title: "Weekly schedule updated",
            description: "All Staff",
            timeAgo: "1 hr ago",
            status: "Updated",
            icon: _jsx(CalendarIcon, {}),
            colorScheme: 'pink'
        },
        {
            title: "Safety fire completed maintenance task",
            description: "Fire Safety",
            timeAgo: "2 hr ago",
            status: "Completed",
            icon: _jsx(MailIcon, {}),
            colorScheme: 'red'
        }
    ];
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20" }), _jsxs("div", { className: "relative bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-xl rounded-3xl border border-green-200/40 shadow-2xl overflow-hidden", children: [_jsx("div", { className: "px-8 py-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-br from-[#82A33D] to-green-600 rounded-xl shadow-lg", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsx("h2", { className: "text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent", children: "Recent Activity" })] }), _jsx("button", { className: "px-4 py-2 bg-gradient-to-r from-[#82A33D] to-green-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105", children: "View All" })] }) }), _jsx("div", { className: "p-8", children: _jsx("div", { className: "space-y-6", children: activities.map((activity) => (_jsx(ActivityItem, { title: activity.title, description: activity.description, timeAgo: activity.timeAgo, status: activity.status, icon: activity.icon, colorScheme: activity.colorScheme }, activity.title))) }) })] })] }));
};
export default RecentActivity;
