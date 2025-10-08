import React from 'react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Revenue',
    value: '$245,800',
    change: '+12.5% from last month',
    changeType: 'positive',
    iconBg: 'bg-green-100',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    title: 'Net Profit',
    value: '$89,240',
    change: '+8.3% from last month',
    changeType: 'positive',
    iconBg: 'bg-blue-100',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: 'Total Expenses',
    value: '$156,560',
    change: '+2.1% from last month',
    changeType: 'positive',
    iconBg: 'bg-orange-100',
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
      </svg>
    )
  },
  {
    title: 'Cash Flow',
    value: '$45,320',
    change: '-3.2% from last month',
    changeType: 'negative',
    iconBg: 'bg-purple-100',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  }
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative p-8 overflow-hidden transition-all duration-700 border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl border-white/30 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 group"
        >
          <div className="absolute inset-0 transition-opacity duration-700 opacity-50 bg-gradient-to-br from-[#82A33D]/10 via-emerald-50/40 to-[#82A33D]/5 rounded-3xl group-hover:opacity-100"></div>
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-[#82A33D]/20 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-100/30 to-transparent animate-pulse"></div>
          
          <div className="absolute w-2 h-2 rounded-full top-4 left-4 bg-[#82A33D]/30 animate-ping"></div>
          <div className="absolute w-1 h-1 delay-500 rounded-full bottom-4 right-4 bg-emerald-400/40 animate-ping"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-3 space-x-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#82A33D] to-emerald-600"></div>
                <p className="text-sm font-bold tracking-wider text-gray-700 uppercase">{stat.title}</p>
              </div>
              <p className="mb-3 text-4xl font-black transition-transform duration-500 text-[#82A33D] drop-shadow-sm group-hover:scale-105">{stat.value}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                stat.changeType === 'positive' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : stat.changeType === 'negative' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    stat.changeType === 'positive' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V8"
                  } />
                </svg>
                {stat.change}
              </div>
            </div>
            <div className="relative">
              <div className={`w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {stat.icon}
              </div>
              <div className="absolute transition-opacity duration-500 opacity-0 -inset-2 bg-gradient-to-r from-[#82A33D]/30 to-emerald-400/30 rounded-2xl blur-lg group-hover:opacity-60"></div>
              <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#82A33D] animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
export { DashboardStats };