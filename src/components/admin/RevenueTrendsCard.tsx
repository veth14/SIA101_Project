import React from 'react';

interface RevenueTrendsProps {
  totalRevenue?: number;
  bookings?: any[];
}

const RevenueTrendsCard: React.FC<RevenueTrendsProps> = ({ 
  totalRevenue = 355000, 
  bookings = [] 
}) => {
  // Calculate weekly revenue from actual bookings
  const calculateWeeklyRevenue = () => {
    const now = new Date();
    const weeks = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekBookings = bookings.filter(booking => {
        if (!booking.createdAt) return false;
        
        let bookingDate;
        try {
          if (booking.createdAt?.toDate) {
            bookingDate = booking.createdAt.toDate();
          } else if (typeof booking.createdAt === 'string') {
            bookingDate = new Date(booking.createdAt);
          } else if (booking.createdAt instanceof Date) {
            bookingDate = booking.createdAt;
          } else {
            return false;
          }
          
          return bookingDate >= weekStart && bookingDate <= weekEnd;
        } catch (error) {
          return false;
        }
      });
      
      const validBookings = weekBookings.filter(booking => booking.status !== 'cancelled');
      const weekRevenue = validBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      const weekNumber = 4 - i;
      
      // Debug logging for ALL weeks
      console.log(`💰 Week ${weekNumber} Revenue Breakdown:`);
      console.log(`- Date range: ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`);
      console.log(`- Total bookings in week: ${weekBookings.length}`);
      console.log(`- Valid bookings (not cancelled): ${validBookings.length}`);
      
      if (validBookings.length > 0) {
        validBookings.forEach((booking, index) => {
          const createdDate = booking.createdAt?.toDate?.() || new Date(booking.createdAt) || 'Unknown';
          console.log(`  ${index + 1}. ${booking.guestName || booking.userName || 'Guest'}: ₱${booking.totalAmount?.toLocaleString() || 0} (${createdDate instanceof Date ? createdDate.toLocaleDateString() : createdDate})`);
        });
      } else {
        console.log(`  No bookings found in Week ${weekNumber}`);
      }
      
      console.log(`- Week ${weekNumber} Total Revenue: ₱${weekRevenue.toLocaleString()}`);
      console.log('---');
      
      weeks.push({
        week: `Week ${4 - i}`,
        revenue: weekRevenue,
        percentage: 0 // Will calculate after we have all weeks
      });
    }
    
    // Calculate percentages based on highest week
    const maxRevenue = Math.max(...weeks.map(w => w.revenue), 1);
    weeks.forEach(week => {
      week.percentage = maxRevenue > 0 ? Math.round((week.revenue / maxRevenue) * 100) : 0;
    });
    
    return weeks;
  };
  
  const weeklyData = calculateWeeklyRevenue();
  
  // Calculate growth percentage
  const currentWeekRevenue = weeklyData[3]?.revenue || 0;
  const previousWeekRevenue = weeklyData[2]?.revenue || 1;
  const growthPercentage = previousWeekRevenue > 0 ? 
    Math.round(((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100) : 0;
  
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 group overflow-hidden h-full min-h-[400px]">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-heritage-green rounded-full animate-pulse border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1 h-8 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full"></div>
                <h3 className="text-xl font-black text-heritage-green drop-shadow-sm">Revenue Trends</h3>
              </div>
              <p className="text-sm text-heritage-neutral/80 font-medium">Weekly performance analytics</p>
            </div>
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${
            isPositiveGrowth 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
              : 'bg-red-100 text-red-800 border-red-200'
          }`}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              {isPositiveGrowth ? (
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            {isPositiveGrowth ? '+' : ''}{growthPercentage}% vs last week
          </div>
        </div>
        
        <div className="space-y-6">
          {weeklyData.map((item, index) => (
            <div key={item.week} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-heritage-green uppercase tracking-wider">{item.week}</span>
                <span className="text-lg font-black text-heritage-green">₱{item.revenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-heritage-light/30 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-heritage-green to-emerald-600 h-3 rounded-full transition-all duration-1000 shadow-sm animate-pulse"
                  style={{ 
                    width: `${item.percentage}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* Enhanced Performance Insight */}
          <div className="mt-8 p-6 bg-heritage-light/30 rounded-2xl border border-heritage-green/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-heritage-green rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-base font-black text-heritage-green">
                  {(() => {
                    const bestWeek = weeklyData.reduce((best, current) => 
                      current.revenue > best.revenue ? current : best, weeklyData[0]);
                    const totalWeeklyRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0);
                    
                    if (totalWeeklyRevenue === 0) {
                      return "No revenue data available";
                    } else if (bestWeek.revenue > 0) {
                      return `Peak performance in ${bestWeek.week}!`;
                    } else {
                      return "Building revenue momentum";
                    }
                  })()}
                </span>
              </div>
              <p className="text-sm text-heritage-neutral font-medium leading-relaxed">
                {(() => {
                  const totalWeeklyRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0);
                  if (totalWeeklyRevenue === 0) {
                    return "Start adding bookings to see revenue trends.";
                  } else if (isPositiveGrowth) {
                    return "Great growth! Consider analyzing successful strategies.";
                  } else {
                    return "Focus on marketing and guest satisfaction to boost revenue.";
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendsCard;
