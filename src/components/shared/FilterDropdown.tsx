import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

interface FilterDropdownProps {
  selected: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  widthClass?: string; // e.g. 'w-48'
  ariaLabel?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ selected, onChange, options, widthClass = 'w-48', ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = dropdownRef.current && dropdownRef.current.contains(target);
      const clickedMenu = menuRef.current && menuRef.current.contains(target);
      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.top + rect.height + 8,
        left: rect.left,
        width: rect.width,
      });
    } else {
      setMenuStyle(null);
    }
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const currentLabel = options.find(o => o.value === selected)?.label ?? selected;

  return (
    <div className="relative" ref={dropdownRef} aria-label={ariaLabel}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-between px-6 py-3 ${widthClass} border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800">{currentLabel}</span>
          </div>
          <svg
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && dropdownRef.current && menuStyle && createPortal(
        <div ref={menuRef} style={menuStyle} className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100000]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selected === option.value
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selected === option.value ? 'bg-gradient-to-r from-heritage-green to-emerald-500' : 'bg-gray-300'
                }`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {typeof option.count === 'number' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{option.count}</span>
                )}
                {selected === option.value && (
                  <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};

export default FilterDropdown;
