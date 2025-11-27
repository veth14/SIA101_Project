import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import useGetInvDashboard from '../../../api/getInvDashboard';
const getActivityIcon = (type) => {
    switch (type) {
        case 'approved':
            return (_jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }));
        case 'submitted':
            return (_jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }));
        case 'delivered':
            return (_jsx("div", { className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }));
        case 'replenished':
            return (_jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }) }));
        default:
            return null;
    }
};
export const DashboardActivity = () => {
    const [recentActivities, setRecentActivities] = useState([]);
    const { getInvDashboardActivity, loadingForGetInvDashboardActivity, } = useGetInvDashboard();
    useEffect(() => {
        const useGetInvDashboardActivityFunc = async () => {
            const response = await getInvDashboardActivity();
            console.log(response);
            if (!response.data) {
                alert(response.message);
                return;
            }
            setRecentActivities(response.data);
        };
        useGetInvDashboardActivityFunc();
    }, []);
    return (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-emerald-50/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-6 left-6 w-2 h-2 bg-heritage-green/40 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-6 right-6 w-1 h-1 bg-emerald-400/50 rounded-full animate-ping delay-700" }), _jsx("div", { className: "relative mb-8", children: _jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-heritage-green drop-shadow-sm", children: "Recent Procurement Activities" }), _jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Latest inventory and procurement updates" })] })] }) }), _jsx("div", { className: "space-y-4", children: recentActivities.map((activity) => (_jsxs("div", { className: "flex items-start space-x-3", children: [getActivityIcon(activity.type), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.title }), _jsxs("p", { className: "text-sm text-gray-500", children: [activity.code, " \u2022 ", activity.department] })] }), _jsx("span", { className: "text-xs text-gray-400", children: activity.timestamp })] }) })] }, activity.id))) })] }));
};
