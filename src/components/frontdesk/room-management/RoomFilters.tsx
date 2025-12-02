import React, { useState, useRef, useEffect } from 'react';

// --- Types ---
interface RoomFiltersProps {
  // Search & Filters
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  roomTypeFilter?: string;
  onRoomTypeChange?: (type: string) => void;
  
  // Options
  statusOptions?: Array<{ value: string; label: string; count: number }>;
  roomTypeOptions?: Array<{ value: string; label: string }>;
  
  // Pagination / Stats for Header
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

// --- Component: Room Type Dropdown ---
const RoomTypeDropdown: React.FC<{
  selectedType: string;
  onTypeChange: (type: string) => void;
  typeOptions: Array<{ value: string; label: string }>;
}> = ({ selectedType, onTypeChange, typeOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onTypeChange(val);
    setIsOpen(false);
  };

  const currentLabel = typeOptions.find(opt => opt.value === selectedType)?.label || 'All Room Types';

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          // UPDATED: Changed shadow-sm to shadow-lg
          className="relative flex items-center justify-between px-6 py-3 w-56 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800 truncate">
              {currentLabel}
            </span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` } 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedType === option.value 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedType === option.value 
                    ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                    : 'bg-gray-300'
                }`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              
              {/* Checkmark for selected item */}
              {selectedType === option.value && (
                <svg className="w-4 h-4 text-heritage-green ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Click Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

// --- Component: Status Dropdown ---
const StatusDropdown: React.FC<{
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  statusOptions: Array<{ value: string; label: string; count: number }>;
}> = ({ selectedStatus, onStatusChange, statusOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onStatusChange(val);
    setIsOpen(false);
  };

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus);
  const currentLabel = currentOption ? currentOption.label : 'All Status';

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          // UPDATED: Changed shadow-sm to shadow-lg
          className="relative flex items-center justify-between px-6 py-3 w-52 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
            <span className="text-gray-800 truncate">{currentLabel}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` } 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedStatus === option.value 
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedStatus === option.value 
                    ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                    : 'bg-gray-300'
                }`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Count Badge */}
                {option.value !== 'all' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                )}
                
                {/* Checkmark */}
                {selectedStatus === option.value && (
                  <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Click Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

// --- Main Component ---
const RoomFilters: React.FC<RoomFiltersProps> = ({
  searchTerm = '',
  onSearchChange = () => {},
  statusFilter = 'all',
  onStatusChange = () => {},
  roomTypeFilter = 'all',
  onRoomTypeChange = () => {},
  statusOptions = [],
  roomTypeOptions = [],
  startIndex,
  endIndex,
  totalItems
}) => {
  return (
    <div className="p-5 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* LEFT SIDE: Title & Stats */}
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-[#82A33D]/10 rounded-xl">
             <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              Hotel Rooms
            </h3>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {totalItems > 0
                  ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
                  : '0 results'}
              </span>
              <span className="text-gray-400">•</span>
              <span>Paginated view</span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Search, Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[260px] max-w-xl group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search room number, type, or guest..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
            />
          </div>

          <RoomTypeDropdown 
            selectedType={roomTypeFilter} 
            onTypeChange={onRoomTypeChange} 
            typeOptions={roomTypeOptions} 
          />
          
          <StatusDropdown 
            selectedStatus={statusFilter} 
            onStatusChange={onStatusChange} 
            statusOptions={statusOptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default RoomFilters;