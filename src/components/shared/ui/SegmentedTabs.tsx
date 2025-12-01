import React from 'react';

type TabId = string | number;

export interface SegmentedTabItem {
  id: TabId;
  label: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTabItem[];
  activeId: TabId;
  onChange: (id: TabId) => void;
  className?: string;
  ariaLabel?: string;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
  ariaLabel = 'Segmented tabs'
}) => {
  const activeIndex = Math.max(0, tabs.findIndex(t => t.id === activeId));
  const widthPercent = tabs.length > 0 ? 100 / tabs.length : 100;

  return (
    <div className={`w-full max-w-3xl p-2 border shadow-lg rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-green-100/20 border-emerald-200/40 backdrop-blur-sm ${className}`}>
      <div className="relative flex items-center justify-center px-3 py-3 overflow-hidden rounded-2xl bg-gradient-to-b from-white/50 to-emerald-50/30">
        {/* Sliding indicator */}
        <div
          aria-hidden
          className="absolute top-1.5 bottom-1.5 rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
          style={{
            left: 6,
            width: `calc(${widthPercent}% - 12px)`,
            transform: `translateX(${activeIndex * 100}%)`,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
            boxShadow:
              '0 4px 12px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
          }}
        />

        <div
          role="tablist"
          aria-label={ariaLabel}
          className="relative z-10 flex items-center justify-center w-full gap-3"
        >
          {tabs.map((tab) => (
            <button
              key={String(tab.id)}
              role="tab"
              aria-selected={activeId === tab.id}
              tabIndex={0}
              onClick={() => onChange(tab.id)}
              className={`group z-20 flex items-center justify-center flex-1 text-center px-4 sm:px-6 py-2.5 text-[13px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                activeId === tab.id
                  ? 'text-emerald-900 scale-[1.02]'
                  : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
              }`}
            >
              <span className="font-extrabold tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegmentedTabs;
