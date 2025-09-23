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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
        </div>
        <div className={`flex items-center space-x-1 ${isPositiveGrowth ? 'text-emerald-600' : 'text-red-600'}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {isPositiveGrowth ? (
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            )}
          </svg>
          <span className="text-sm font-semibold">
            {isPositiveGrowth ? '+' : ''}{growthPercentage}% vs last week
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {weeklyData.map((item, index) => (
          <div key={item.week} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{item.week}</span>
              <span className="text-sm font-bold text-gray-900">₱{item.revenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-sm"
                style={{ 
                  width: `${item.percentage}%`,
                  animationDelay: `${index * 200}ms`
                }}
              ></div>
            </div>
          </div>
        ))}

        {/* Dynamic Performance Insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-emerald-900">
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
          <p className="text-xs text-emerald-700 leading-relaxed">
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
  );
};

export default RevenueTrendsCard;
