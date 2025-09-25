import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  badge?: string;
  icon: React.ReactNode;
  colorScheme: 'red' | 'emerald' | 'blue' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  badge,
  icon,
  colorScheme
}) => {
  const colorConfig = {
    red: {
      gradient: 'from-red-500 to-orange-500',
      background: 'to-red-50/50',
      border: 'border-red-200/30',
      iconBg: 'from-red-500 to-red-600',
      badgeColor: 'text-red-600 bg-red-100'
    },
    emerald: {
      gradient: 'from-emerald-500 to-green-500',
      background: 'to-emerald-50/50',
      border: 'border-emerald-200/30',
      iconBg: 'from-emerald-500 to-emerald-600',
      badgeColor: 'text-emerald-600 bg-emerald-100'
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      background: 'to-blue-50/50',
      border: 'border-blue-200/30',
      iconBg: 'from-blue-500 to-blue-600',
      badgeColor: 'text-blue-600 bg-blue-100'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      background: 'to-purple-50/50',
      border: 'border-purple-200/30',
      iconBg: 'from-purple-500 to-purple-600',
      badgeColor: 'text-purple-600 bg-purple-100'
    }
  };

  const colors = colorConfig[colorScheme];

  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500`}></div>
      <div className={`relative bg-gradient-to-br from-white/90 ${colors.background} backdrop-blur-xl rounded-2xl p-6 ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-3 bg-gradient-to-br ${colors.iconBg} rounded-xl shadow-lg`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-black text-gray-900">{value}</p>
              {badge && (
                <span className={`text-xs font-bold ${colors.badgeColor} px-2 py-1 rounded-full`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
