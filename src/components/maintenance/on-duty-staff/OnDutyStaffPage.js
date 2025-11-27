import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { collection, query, where, getDocs, } from "firebase/firestore";
const OnDutyStaffPage = () => {
    const [staff, setStaff] = useState([]);
    const [onDutyCount, setOnDutyCount] = useState(0);
    const [onBreakCount, setOnBreakCount] = useState(0);
    const [offDutyCount, setOffDutyCount] = useState(0);
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const today = new Date();
                const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
                const schedulesRef = collection(db, "staff_schedules");
                const q = query(schedulesRef, where("day", "==", dayName));
                const querySnapshot = await getDocs(q);
                const staffList = [];
                querySnapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    staffList.push({
                        id: docSnap.id,
                        classification: data.classification || "",
                        createdAt: data.createdAt || "",
                        day: data.day || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                        shift: data.shift || "",
                        shiftTime: data.shiftTime || "",
                        staffId: data.staffId || "",
                        staffName: data.staffName || "",
                        staffRef: data.staffRef || null,
                        status: data.status || "off",
                        week: data.week || 0,
                        year: data.year || 0
                    });
                });
                setStaff(staffList);
                setOnDutyCount(staffList.filter((s) => s.status === "scheduled" || s.status === "present").length);
                setOnBreakCount(staffList.filter((s) => s.status === "break").length);
                setOffDutyCount(staffList.filter((s) => s.status === "absent" || s.status === "off").length);
            }
            catch (error) {
                console.error("Error fetching staff schedules:", error);
            }
        };
        fetchStaff();
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-[#F9F6EE]", children: _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Currently On Duty" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: onDutyCount })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-yellow-100 rounded-lg", children: _jsx("svg", { className: "w-6 h-6 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "On Break" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: onBreakCount })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-red-100 rounded-lg", children: _jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Off Duty" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: offDutyCount })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Active Staff Members" }) }), _jsx("div", { className: "p-6 space-y-4", children: staff.map((s) => (_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm font-medium text-gray-700", children: s.staffName ? s.staffName.split(" ").map((w) => w[0]).join("") : "?" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: s.staffName }), _jsx("p", { className: "text-sm text-gray-500", children: s.classification }), _jsx("p", { className: "text-xs text-gray-400", children: s.shiftTime })] })] }), _jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${s.status === "present" || s.status === "scheduled"
                                            ? "bg-green-100 text-green-800"
                                            : s.status === "break"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"}`, children: s.status === "scheduled" ? "on duty" : s.status })] }, s.id))) })] })] }) }));
};
export default OnDutyStaffPage;
