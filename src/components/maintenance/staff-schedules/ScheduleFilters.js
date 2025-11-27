import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MAINTENANCE_CLASSIFICATIONS, HOUSEKEEPING_CLASSIFICATIONS } from './constants';
import { formatWeekRange } from './utils';
const ScheduleFilters = ({ onCreateSchedule, currentWeekOffset, setCurrentWeekOffset, currentWeekRange, selectedDepartment, setSelectedDepartment, selectedClassification, setSelectedClassification, uniqueClassifications }) => {
    const getFilteredClassifications = () => {
        if (selectedDepartment === 'maintenance') {
            return uniqueClassifications.filter(c => MAINTENANCE_CLASSIFICATIONS.includes(c));
        }
        else if (selectedDepartment === 'housekeeping') {
            return uniqueClassifications.filter(c => HOUSEKEEPING_CLASSIFICATIONS.includes(c));
        }
        return uniqueClassifications;
    };
    return (_jsxs("div", { className: "mb-6 flex flex-wrap gap-4 items-center", children: [_jsx("button", { onClick: onCreateSchedule, className: "bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors", children: "Create Schedule" }), _jsxs("div", { className: "flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2", children: [_jsx("button", { onClick: () => setCurrentWeekOffset(prev => prev - 1), className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Previous week", children: _jsx("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsxs("div", { className: "flex flex-col items-center min-w-[200px]", children: [_jsx("span", { className: "text-sm font-semibold text-gray-800", children: currentWeekRange.label }), _jsx("span", { className: "text-xs text-gray-500", children: formatWeekRange(currentWeekRange.start, currentWeekRange.end) })] }), _jsx("button", { onClick: () => setCurrentWeekOffset(prev => prev + 1), className: "p-1 hover:bg-gray-100 rounded transition-colors", title: "Next week", children: _jsx("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) }), currentWeekOffset !== 0 && (_jsx("button", { onClick: () => setCurrentWeekOffset(0), className: "ml-2 px-2 py-1 text-xs bg-[#82A33D] text-white rounded hover:bg-[#6d8a33] transition-colors", title: "Go to current week", children: "Today" }))] }), _jsxs("select", { value: selectedDepartment, onChange: (e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedClassification('all');
                }, className: "border border-gray-300 rounded-lg px-3 py-2", children: [_jsx("option", { value: "all", children: "All Departments" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "housekeeping", children: "Housekeeping" })] }), _jsxs("select", { value: selectedClassification, onChange: (e) => setSelectedClassification(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2", children: [_jsx("option", { value: "all", children: "All Classifications" }), getFilteredClassifications().map(classification => (_jsx("option", { value: classification, children: classification }, classification)))] })] }));
};
export default ScheduleFilters;
