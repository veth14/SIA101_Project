import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export const RevenueChart = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '₱' + value.toLocaleString();
                    }
                }
            }
        }
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Revenue" }), _jsx("div", { className: "relative", children: _jsx("input", { type: "date", className: "border rounded-md px-3 py-1.5 text-sm", defaultValue: new Date().toISOString().split('T')[0] }) })] }), _jsx("div", { className: "h-[300px]", children: _jsx(Line, { options: options, data: data }) })] }));
};
