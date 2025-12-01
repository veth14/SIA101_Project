import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  limit,
} from "firebase/firestore";

interface AttendanceRecord {
  id: string;
  TimeIn: Timestamp;
  TimeOut: Timestamp | null;
  classification: string;
  date: Timestamp;
  fullName: string;
  rfid: string;
  staffId: string;
  working: boolean;
}

let attendanceCache: AttendanceRecord[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const OnDutyStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<AttendanceRecord[]>([]);
  const [onDutyCount, setOnDutyCount] = useState(0);
  const [offDutyCount, setOffDutyCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isFetching = useRef(false);
  const ITEMS_PER_PAGE = 5;

  // Filter staff based on search and filters
  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch = searchQuery === "" || 
      staffMember.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.classification.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClassification = classificationFilter === "" || 
      staffMember.classification === classificationFilter;
    
    const currentStatus = getStaffStatus(staffMember);
    const matchesStatus = statusFilter === "" || currentStatus === statusFilter;
    
    return matchesSearch && matchesClassification && matchesStatus;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / ITEMS_PER_PAGE));
  const displayedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchStaff = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        const now = Date.now();
        if (attendanceCache && (now - cacheTimestamp) < CACHE_DURATION) {
          console.log("📦 Using cached attendance data");
          processStaffData(attendanceCache);
          isFetching.current = false;
          return;
        }

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        const attendanceRef = collection(db, "attendance");
        const q = query(
          attendanceRef,
          where("date", ">=", new Date(todayString)),
          where("working", "==", true),
          limit(100)
        );

        console.log("🔥 Fetching fresh data from Firestore...");
        const querySnapshot = await getDocs(q);
        const staffList: AttendanceRecord[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          staffList.push({ 
            id: docSnap.id,
            TimeIn: data.TimeIn || Timestamp.now(),
            TimeOut: data.TimeOut || null,
            classification: data.classification || "",
            date: data.date || Timestamp.now(),
            fullName: data.fullName || "",
            rfid: data.rfid || "",
            staffId: data.staffId || "",
            working: data.working || false
          });
        });

        attendanceCache = staffList;
        cacheTimestamp = now;
        
        processStaffData(staffList);
        setLastUpdated(new Date());

      } catch (error) {
        console.error("Error fetching attendance records:", error);
        
        if (attendanceCache) {
          processStaffData(attendanceCache);
        }
      } finally {
        isFetching.current = false;
      }
    };

    const processStaffData = (staffList: AttendanceRecord[]) => {
      setStaff(staffList);

      const currentTime = new Date();
      const onDuty = staffList.filter((s) => {
        const timeIn = s.TimeIn.toDate();
        const timeOut = s.TimeOut ? s.TimeOut.toDate() : null;
        
        if (!timeOut) return true;
        return currentTime >= timeIn && currentTime <= timeOut;
      }).length;

      const offDuty = staffList.length - onDuty;

      setOnDutyCount(onDuty);
      setOffDutyCount(offDuty);
    };

    fetchStaff();

    const interval = setInterval(fetchStaff, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStaffStatus = (staff: AttendanceRecord): string => {
    const currentTime = new Date();
    const timeIn = staff.TimeIn.toDate();
    const timeOut = staff.TimeOut ? staff.TimeOut.toDate() : null;

    if (!timeOut) {
      return "present";
    }

    if (currentTime >= timeIn && currentTime <= timeOut) {
      return "present";
    } else {
      return "off";
    }
  };

  const getShiftTime = (staff: AttendanceRecord): string => {
    const timeIn = staff.TimeIn.toDate();
    const timeOut = staff.TimeOut ? staff.TimeOut.toDate() : null;
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    };

    if (timeOut) {
      return `${formatTime(timeIn)} - ${formatTime(timeOut)}`;
    } else {
      return `${formatTime(timeIn)} - Present`;
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setClassificationFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Last updated indicator */}
        <div className="text-right text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>

        {/* Status Summary Cards - DashboardStats design */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* On Duty Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 group overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-white/80 to-emerald-50 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/3 animate-pulse delay-700"></div>

              {/* Decorative dots */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-400/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-emerald-500/40 rounded-full animate-ping delay-500"></div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full"></div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Currently On Duty</p>
                  </div>
                  <p className="text-4xl font-black text-emerald-700 drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500">
                    {onDutyCount}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full mr-2 inline-block bg-emerald-500"></span>
                    Active
                  </div>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-300/40 to-emerald-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Off Duty Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 group overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-white/80 to-rose-50 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-200/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-100/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/3 animate-pulse delay-700"></div>

              {/* Decorative dots */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-rose-400/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-rose-500/40 rounded-full animate-ping delay-500"></div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-rose-700 rounded-full"></div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Off Duty</p>
                  </div>
                  <p className="text-4xl font-black text-rose-700 drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500">
                    {offDutyCount}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <span className="w-2 h-2 rounded-full mr-2 inline-block bg-rose-500"></span>
                    Inactive
                  </div>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-rose-300/40 to-rose-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff List with Filters - Modern Table Design */}
        <div className="flex flex-col h-full overflow-hidden bg-white border shadow-lg rounded-2xl border-gray-200/70">
          {/* Header with Search and Controls */}
          <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                  <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                    <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Active Staff Members
                </h3>
                <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                    {filteredStaff.length} {filteredStaff.length === 1 ? 'staff' : 'staff members'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>Currently on shift</span>
                </p>
              </div>
            </div>

            {/* Search and Filter Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
                />
              </div>

              {/* Classification Filter */}
              <select
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
              >
                <option value="">📊 All Roles</option>
                <option value="Maintenance">🔧 Maintenance</option>
                <option value="Housekeeping">🏠 Housekeeping</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
              >
                <option value="">📋 All Status</option>
                <option value="present">🟢 On Duty</option>
                <option value="off">🔴 Off Duty</option>
              </select>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            {displayedStaff.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-5xl text-gray-400">👥</div>
                <p className="font-medium text-gray-500">No staff members found</p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                  <tr>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Staff Member</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Role</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Shift Time</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Attendance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedStaff.map((staffMember, index) => {
                    const status = getStaffStatus(staffMember);
                    const shiftTime = getShiftTime(staffMember);
                    
                    return (
                      <tr 
                        key={staffMember.id}
                        style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                        className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                              <span className="text-sm font-medium text-gray-700">
                                {staffMember.fullName ? staffMember.fullName.split(" ").map((w: string) => w[0]).join("") : "?"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                                {staffMember.fullName}
                              </div>
                              <div className="text-xs text-gray-500">ID: {staffMember.staffId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              staffMember.classification === "Maintenance" 
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {staffMember.classification}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{shiftTime}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            status === "present" 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 mr-2 rounded-full ${
                              status === "present" ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            {status === "present" ? "On Duty" : "Off Duty"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {staffMember.TimeIn.toDate().toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 bg-white/50">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#82A33D] text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnDutyStaffPage;
