import React from 'react';
import StaffCard from './StaffCard';

const StaffGrid: React.FC = () => {
  const staffData = [
    {
      name: "Maria Clara",
      email: "maria.clara@hotel.com",
      position: "Maintenance",
      department: "Maintenance",
      age: 35,
      gender: "female",
      phone: "555-010",
      status: 'active' as const,
      initials: "MC",
      colorScheme: 'emerald' as const
    },
    {
      name: "Jose Bato",
      email: "jose.bato@hotel.com",
      position: "Housekeeping",
      department: "Housekeeping",
      age: 30,
      gender: "male",
      phone: "555-205",
      status: 'active' as const,
      initials: "JB",
      colorScheme: 'purple' as const
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@hotel.com",
      position: "Front Desk",
      department: "Front Desk",
      age: 28,
      gender: "female",
      phone: "555-090",
      status: 'active' as const,
      initials: "SJ",
      colorScheme: 'blue' as const
    },
    {
      name: "Lisa Chen",
      email: "lisa.chen@hotel.com",
      position: "Security",
      department: "Security",
      age: 28,
      gender: "female",
      phone: "555-120",
      status: 'active' as const,
      initials: "LC",
      colorScheme: 'pink' as const
    },
    {
      name: "Alex Rodriguez",
      email: "alex.rodriguez@hotel.com",
      position: "Cook",
      department: "Kitchen",
      age: 30,
      gender: "male",
      phone: "555-150",
      status: 'on-leave' as const,
      initials: "AR",
      colorScheme: 'amber' as const
    },
    {
      name: "Emily Davis",
      email: "emily.davis@hotel.com",
      position: "Housekeeping",
      department: "Housekeeping",
      age: 26,
      gender: "female",
      phone: "555-180",
      status: 'active' as const,
      initials: "ED",
      colorScheme: 'emerald' as const
    }
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-15"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-green-50/30 backdrop-blur-xl rounded-3xl border border-green-200/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#82A33D] to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Staff Directory
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{staffData.length} members</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{staffData.filter(staff => staff.status === 'active').length} active</span>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffData.map((staff) => (
              <StaffCard
                key={staff.email}
                name={staff.name}
                email={staff.email}
                position={staff.position}
                department={staff.department}
                age={staff.age}
                gender={staff.gender}
                phone={staff.phone}
                status={staff.status}
                initials={staff.initials}
                colorScheme={staff.colorScheme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffGrid;
