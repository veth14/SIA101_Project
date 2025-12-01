import React from 'react';

interface AnalyticsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'inventory', label: 'Inventory Analytics' },
    { id: 'procurement', label: 'Procurement Analytics' },
    { id: 'department', label: 'Room/Department Analytics' }
  ];

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab)
  );

  return (
    <div className="bg-transparent my-4 md:my-6">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Tabs container matching Revenue tabs pill style */}
        <div className="relative flex items-center justify-center px-2 md:px-4">
          <div className="relative w-full max-w-3xl bg-emerald-50/40 border border-emerald-100/70 rounded-[2rem] shadow-[0_16px_40px_rgba(16,185,129,0.12)] px-1.5 py-1.5 md:px-3 md:py-2.5 overflow-hidden">
            {/* Sliding indicator */}
            <div
              aria-hidden
              className="absolute top-1.5 bottom-1.5 md:top-2 md:bottom-2 rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
              style={{
                left: 6,
                width: 'calc((100% - 12px) / 3)',
                transform: `translateX(${activeIndex * 100}%)`,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
                boxShadow:
                  '0 4px 12px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)',
              }}
            />

            <div
              role="tablist"
              aria-label="Inventory analytics tabs"
              className="relative z-10 flex items-center justify-center w-full gap-1.5 md:gap-3"
            >
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => onTabChange(tab.id)}
                    className={`group flex-1 flex items-center justify-center text-center px-3.5 md:px-6 py-2.5 md:py-3 text-[13px] md:text-[14px] font-semibold md:font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                      isActive
                        ? 'text-emerald-900 scale-[1.02]'
                        : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
                    }`}
                  >
                    <span className="truncate tracking-wide">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTabs;