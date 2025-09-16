import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GuestDemographicsProps {
  localGuests: number;
  foreignGuests: number;
}

export const GuestDemographics: React.FC<GuestDemographicsProps> = ({
  localGuests,
  foreignGuests,
}) => {
  const data: ChartData<'doughnut'> = {
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

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Guests Demographic</h2>
      </div>
      <div className="h-[200px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex justify-center gap-8 mt-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-teal-600">{localGuests}</div>
          <div className="text-sm text-gray-600">Local</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-teal-600">{foreignGuests}</div>
          <div className="text-sm text-gray-600">Foreign</div>
        </div>
      </div>
    </div>
  );
};
