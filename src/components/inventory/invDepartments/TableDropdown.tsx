import React, { useState, useRef, useEffect } from 'react';

interface PremiumDepartmentDropdownProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

export const PremiumDepartmentDropdown: React.FC<PremiumDepartmentDropdownProps> = ({
  selectedDepartment,
  onDepartmentChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const departments = [
    'All Departments',
    'Housekeeping', 
    'Maintenance',
    'F&B',
    'Security',
    'Front Desk'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDepartmentSelect = (dept: string) => {
    onDepartmentChange(dept);
    setIsDropdownOpen(false);
  };



  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      {/* Premium Dropdown Button */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          ref={buttonRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800">{selectedDepartment}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Premium Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDepartmentSelect(dept)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedDepartment === dept 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                selectedDepartment === dept 
                  ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                  : 'bg-gray-300'
              }`}></div>
              <span className="flex-1">{dept}</span>
              {selectedDepartment === dept && (
                <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};
