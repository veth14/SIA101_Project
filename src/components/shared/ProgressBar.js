import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const ProgressBar = ({ currentStep, totalSteps, showPercentage = false, size = 'md', color = 'green' }) => {
    const percentage = Math.round((currentStep / totalSteps) * 100);
    const heightClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };
    const colorClasses = {
        green: 'bg-heritage-green',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600'
    };
    return (_jsxs("div", { className: "w-full", children: [showPercentage && (_jsxs("div", { className: "flex justify-between mb-2 text-sm font-medium text-gray-700", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [percentage, "%"] })] })), _jsx("div", { className: `relative w-full ${heightClasses[size]} bg-gray-200 rounded-full overflow-hidden`, children: _jsx("div", { className: `${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`, style: { width: `${percentage}%` }, children: _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" }) }) })] }));
};
export const StepProgress = ({ steps, currentStep }) => {
    return (_jsx("div", { className: "flex items-center justify-between", children: steps.map((step, index) => (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${index < currentStep
                                ? 'bg-heritage-green border-heritage-green text-white'
                                : index === currentStep
                                    ? 'bg-white border-heritage-green text-heritage-green'
                                    : 'bg-white border-gray-300 text-gray-400'}`, children: step.completed ? (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })) : (_jsx("span", { className: "text-sm font-bold", children: index + 1 })) }), _jsx("span", { className: `mt-2 text-xs font-medium ${index <= currentStep ? 'text-heritage-green' : 'text-gray-400'}`, children: step.label })] }), index < steps.length - 1 && (_jsx("div", { className: `flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-heritage-green' : 'bg-gray-300'}` }))] }, index))) }));
};
export const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = '#10B981', showText = true }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center", children: [_jsxs("svg", { width: size, height: size, className: "transform -rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: "#E5E7EB", strokeWidth: strokeWidth, fill: "none" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: color, strokeWidth: strokeWidth, fill: "none", strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", className: "transition-all duration-500 ease-out" })] }), showText && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-2xl font-bold text-gray-700", children: [percentage, "%"] }) }))] }));
};
