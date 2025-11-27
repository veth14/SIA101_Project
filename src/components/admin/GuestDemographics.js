import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
export const GuestDemographics = ({ localGuests, foreignGuests, }) => {
    const data = {
        labels: ['Local', 'Foreign'],
        datasets: [
            {
                data: [localGuests, foreignGuests],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        cutout: '70%',
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsx("h2", { className: "text-lg font-semibold", children: "Guests Demographic" }) }), _jsx("div", { className: "h-[200px] flex items-center justify-center", children: _jsx(Doughnut, { data: data, options: options }) }), _jsxs("div", { className: "flex justify-center gap-8 mt-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-semibold text-teal-600", children: localGuests }), _jsx("div", { className: "text-sm text-gray-600", children: "Local" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-semibold text-teal-600", children: foreignGuests }), _jsx("div", { className: "text-sm text-gray-600", children: "Foreign" })] })] })] }));
};
