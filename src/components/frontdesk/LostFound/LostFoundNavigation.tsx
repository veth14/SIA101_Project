import React from 'react';

interface LostFoundNavigationProps {
  activeTab: 'found' | 'lost';
  onTabChange: (tab: 'found' | 'lost') => void;
}

export const LostFoundNavigation: React.FC<LostFoundNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'found' as const,
      label: 'Found Items',
      description: 'Items reported as found',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m8.485-8.485h-2M5.515 12H3.515m13.07-6.364l-1.414 1.414M7.343 16.657l-1.414 1.414M16.657 16.657l1.414 1.414M7.343 7.343L5.929 5.929" />
        </svg>
      ),
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'lost' as const,
      label: 'Lost Items',
      description: 'Items reported as lost',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 7h-6l3-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14a1 1 0 001-1v-2a6 6 0 00-6-6H10a6 6 0 00-6 6v2a1 1 0 001 1z" />
        </svg>
      ),
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                activeTab === tab.id
                  ? `${tab.bgColor} ${tab.borderColor} shadow-lg scale-105`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-5 rounded-2xl`}></div>
              )}

              <div className="relative flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                    : 'bg-white text-gray-500 group-hover:text-gray-700 shadow-md'
                }`}>
                  {tab.icon}
                </div>

                <div>
                  <h3 className={`font-bold text-lg transition-colors ${
                    activeTab === tab.id ? tab.textColor : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </h3>
                  <p className={`text-sm mt-1 transition-colors ${
                    activeTab === tab.id ? tab.textColor + '/70' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {tab.description}
                  </p>
                </div>

                {activeTab === tab.id && (
                  <div className={`w-8 h-1 bg-gradient-to-r ${tab.color} rounded-full`}></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LostFoundNavigation;
