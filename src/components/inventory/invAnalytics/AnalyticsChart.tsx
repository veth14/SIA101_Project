import React from 'react';

const AnalyticsChart: React.FC = () => {
  
  // Full year data for inventory usage trends
  const usageData = [
    { month: 'Jan', linens: 2400, cleaning: 1400, food: 2400, maintenance: 800 },
    { month: 'Feb', linens: 1398, cleaning: 2210, food: 2290, maintenance: 1200 },
    { month: 'Mar', linens: 2800, cleaning: 2290, food: 2000, maintenance: 1500 },
    { month: 'Apr', linens: 3908, cleaning: 2000, food: 2181, maintenance: 900 },
    { month: 'May', linens: 4800, cleaning: 2181, food: 2500, maintenance: 1100 },
    { month: 'Jun', linens: 3800, cleaning: 2500, food: 2100, maintenance: 1300 },
    { month: 'Jul', linens: 4300, cleaning: 2100, food: 2800, maintenance: 1000 },
    { month: 'Aug', linens: 4100, cleaning: 2350, food: 2650, maintenance: 1150 },
    { month: 'Sep', linens: 3600, cleaning: 2400, food: 2300, maintenance: 1250 },
    { month: 'Oct', linens: 3200, cleaning: 2150, food: 2450, maintenance: 950 },
    { month: 'Nov', linens: 2900, cleaning: 1950, food: 2200, maintenance: 1050 },
    { month: 'Dec', linens: 3500, cleaning: 2300, food: 2600, maintenance: 1200 }
  ];

  const maxValue = Math.max(...usageData.flatMap(d => [d.linens, d.cleaning, d.food, d.maintenance]));

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-heritage-green/5 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
      {/* Ultra-Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-heritage-green/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-40 w-2 h-2 bg-blue-500/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-500/20 rounded-full animate-pulse delay-300"></div>
      
      <div className="relative p-6">
        {/* Ultra-Premium Header */}
        <div className="mb-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Glassmorphism Icon */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-heritage-green to-green-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-heritage-green/90 to-green-600/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              
              {/* Enhanced Title */}
              <div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-heritage-green to-slate-800 bg-clip-text text-transparent drop-shadow-sm">
                  Inventory Usage Trends
                </h3>
                <div className="flex items-center space-x-4 mt-3">
                  <p className="text-slate-600 text-lg font-semibold">Full Year Performance Analytics</p>
                  <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
                    <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-700">2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Live Status */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex items-center space-x-3 bg-gradient-to-r from-emerald-50/90 to-green-50/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/30 shadow-xl">
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">Live Data</span>
                </div>
              </div>
              
              {/* Export Button */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <button className="relative flex items-center space-x-3 bg-white/80 backdrop-blur-xl hover:bg-white/90 px-5 py-3 rounded-2xl border border-white/40 shadow-xl transition-all duration-300 group">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-heritage-green transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-heritage-green transition-colors duration-300">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ultra-Wide Chart Container */}
        <div className="relative h-[28rem] bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
          {/* Chart Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/2 via-transparent to-blue-500/2"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full blur-2xl"></div>
          
          {/* Maximum Width Chart SVG */}
          <svg className="w-full h-full p-2" viewBox="0 0 1800 450" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Simple gradients */}
            <linearGradient id="linensGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#82A33D" />
              <stop offset="100%" stopColor="#65A30D" />
            </linearGradient>
            <linearGradient id="cleaningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="foodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="maintenanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          
          {/* Ultra-Wide Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="30"
              y1={60 + (i * 60)}
              x2="1770"
              y2={60 + (i * 60)}
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}
          
          {/* Enhanced Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <text
              key={i}
              x="25"
              y={65 + (i * 60)}
              textAnchor="end"
              className="text-sm fill-slate-600 font-semibold"
              dominantBaseline="middle"
            >
              {Math.round(maxValue - (i * maxValue / 5)).toLocaleString()}
            </text>
          ))}
          
          {/* Ultra-Wide X-axis labels */}
          {usageData.map((data, index) => (
            <text
              key={data.month}
              x={30 + (index * 150)}
              y="420"
              textAnchor="middle"
              className="text-base fill-slate-700 font-bold"
            >
              {data.month}
            </text>
          ))}
          
          {/* Ultra-Wide Premium Line paths */}
          {/* Linens Line with Glow Effect */}
          <polyline
            fill="none"
            stroke="url(#linensGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(130, 163, 61, 0.3))"
            points={usageData.map((data, index) => 
              `${30 + (index * 150)},${360 - ((data.linens / maxValue) * 240)}`
            ).join(' ')}
          />
          
          {/* Cleaning Line with Glow Effect */}
          <polyline
            fill="none"
            stroke="url(#cleaningGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))"
            points={usageData.map((data, index) => 
              `${30 + (index * 150)},${360 - ((data.cleaning / maxValue) * 240)}`
            ).join(' ')}
          />
          
          {/* Food Line with Glow Effect */}
          <polyline
            fill="none"
            stroke="url(#foodGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))"
            points={usageData.map((data, index) => 
              `${30 + (index * 150)},${360 - ((data.food / maxValue) * 240)}`
            ).join(' ')}
          />
          
          {/* Maintenance Line with Glow Effect */}
          <polyline
            fill="none"
            stroke="url(#maintenanceGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))"
            points={usageData.map((data, index) => 
              `${30 + (index * 150)},${360 - ((data.maintenance / maxValue) * 240)}`
            ).join(' ')}
          />
          
          {/* Ultra-Premium Data points */}
          {usageData.map((data, index) => (
            <g key={data.month}>
              {/* Linens point with enhanced styling */}
              <circle
                cx={30 + (index * 150)}
                cy={360 - ((data.linens / maxValue) * 240)}
                r="8"
                fill="#82A33D"
                stroke="white"
                strokeWidth="4"
                filter="drop-shadow(0 4px 8px rgba(130, 163, 61, 0.3))"
                className="cursor-pointer hover:r-10 transition-all duration-300"
              >
                <title>Linens ({data.month}): {data.linens.toLocaleString()}</title>
              </circle>
              
              {/* Cleaning point with enhanced styling */}
              <circle
                cx={30 + (index * 150)}
                cy={360 - ((data.cleaning / maxValue) * 240)}
                r="8"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="4"
                filter="drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))"
                className="cursor-pointer hover:r-10 transition-all duration-300"
              >
                <title>Cleaning ({data.month}): {data.cleaning.toLocaleString()}</title>
              </circle>
              
              {/* Food point with enhanced styling */}
              <circle
                cx={30 + (index * 150)}
                cy={360 - ((data.food / maxValue) * 240)}
                r="8"
                fill="#F97316"
                stroke="white"
                strokeWidth="4"
                filter="drop-shadow(0 4px 8px rgba(249, 115, 22, 0.3))"
                className="cursor-pointer hover:r-10 transition-all duration-300"
              >
                <title>Food ({data.month}): {data.food.toLocaleString()}</title>
              </circle>
              
              {/* Maintenance point with enhanced styling */}
              <circle
                cx={30 + (index * 150)}
                cy={360 - ((data.maintenance / maxValue) * 240)}
                r="8"
                fill="#8B5CF6"
                stroke="white"
                strokeWidth="4"
                filter="drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))"
                className="cursor-pointer hover:r-10 transition-all duration-300"
              >
                <title>Maintenance ({data.month}): {data.maintenance.toLocaleString()}</title>
              </circle>
            </g>
          ))}
        </svg>
        </div>
        
        {/* Ultra-Premium Legend */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-8">
          <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-5 h-5 bg-gradient-to-r from-heritage-green to-green-600 rounded-full shadow-lg"></div>
            <span className="text-base font-bold text-slate-800">Linens & Textiles</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
            <span className="text-base font-bold text-slate-800">Cleaning Supplies</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"></div>
            <span className="text-base font-bold text-slate-800">Food & Beverage</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg"></div>
            <span className="text-base font-bold text-slate-800">Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
