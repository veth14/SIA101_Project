export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'frontdesk' | 'inventory-manager' | 'accounting' | 'staff';
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'inactive';
  hireDate: string;
  lastLogin?: string;
  avatar?: string;
  permissions: string[];
  salary: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'completed' | 'no-show' | 'cancelled';
  notes?: string;
}

export interface AuditLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export const sampleStaff: Staff[] = [
  {
    id: 'STAFF001',
    name: 'Admin User',
    email: 'balayginhawaAdmin123@gmail.com',
    phone: '+63 917 123 4567',
    role: 'admin',
    department: 'Administration',
    position: 'Hotel Manager',
    status: 'active',
    hireDate: '2023-01-15',
    lastLogin: '2024-01-19T08:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    permissions: ['all'],
    salary: 80000,
    emergencyContact: {
      name: 'Maria Admin',
      phone: '+63 918 234 5678',
      relationship: 'Spouse',
    },
  },
  {
    id: 'STAFF002',
    name: 'Maria Santos',
    email: 'maria.santos@balayginhawahotel.com',
    phone: '+63 918 234 5678',
    role: 'frontdesk',
    department: 'Front Office',
    position: 'Front Desk Supervisor',
    status: 'active',
    hireDate: '2023-03-20',
    lastLogin: '2024-01-19T07:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    permissions: ['reservations', 'check-in', 'check-out', 'guest-services'],
    salary: 35000,
    emergencyContact: {
      name: 'Juan Santos',
      phone: '+63 919 345 6789',
      relationship: 'Husband',
    },
  },
  {
    id: 'STAFF003',
    name: 'John Dela Cruz',
    email: 'john.delacruz@balayginhawahotel.com',
    phone: '+63 919 345 6789',
    role: 'inventory-manager',
    department: 'Operations',
    position: 'Inventory Manager',
    status: 'active',
    hireDate: '2023-02-10',
    lastLogin: '2024-01-18T16:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    permissions: ['inventory', 'stock-management', 'suppliers', 'reports'],
    salary: 40000,
    emergencyContact: {
      name: 'Ana Dela Cruz',
      phone: '+63 920 456 7890',
      relationship: 'Wife',
    },
  },
  {
    id: 'STAFF004',
    name: 'Anna Reyes',
    email: 'anna.reyes@balayginhawahotel.com',
    phone: '+63 920 456 7890',
    role: 'accounting',
    department: 'Finance',
    position: 'Accounting Manager',
    status: 'active',
    hireDate: '2023-01-25',
    lastLogin: '2024-01-19T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    permissions: ['analytics', 'reports', 'transactions', 'revenue'],
    salary: 45000,
    emergencyContact: {
      name: 'Carlos Reyes',
      phone: '+63 921 567 8901',
      relationship: 'Brother',
    },
  },
  {
    id: 'STAFF005',
    name: 'Robert Garcia',
    email: 'robert.garcia@balayginhawahotel.com',
    phone: '+63 921 567 8901',
    role: 'staff',
    department: 'Maintenance',
    position: 'Maintenance Technician',
    status: 'active',
    hireDate: '2023-04-12',
    lastLogin: '2024-01-18T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    permissions: ['maintenance-requests', 'room-status'],
    salary: 28000,
    emergencyContact: {
      name: 'Elena Garcia',
      phone: '+63 922 678 9012',
      relationship: 'Mother',
    },
  },
  {
    id: 'STAFF006',
    name: 'Lisa Mendoza',
    email: 'lisa.mendoza@balayginhawahotel.com',
    phone: '+63 922 678 9012',
    role: 'frontdesk',
    department: 'Front Office',
    position: 'Front Desk Agent',
    status: 'active',
    hireDate: '2023-05-18',
    lastLogin: '2024-01-19T06:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    permissions: ['reservations', 'check-in', 'check-out'],
    salary: 25000,
    emergencyContact: {
      name: 'Pedro Mendoza',
      phone: '+63 923 789 0123',
      relationship: 'Father',
    },
  },
  {
    id: 'STAFF007',
    name: 'Michael Torres',
    email: 'michael.torres@balayginhawahotel.com',
    phone: '+63 923 789 0123',
    role: 'staff',
    department: 'Housekeeping',
    position: 'Housekeeping Supervisor',
    status: 'on-leave',
    hireDate: '2023-03-08',
    lastLogin: '2024-01-15T17:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150',
    permissions: ['housekeeping', 'room-status'],
    salary: 30000,
    emergencyContact: {
      name: 'Carmen Torres',
      phone: '+63 924 890 1234',
      relationship: 'Wife',
    },
  },
  {
    id: 'STAFF008',
    name: 'Sarah Villanueva',
    email: 'sarah.villanueva@balayginhawahotel.com',
    phone: '+63 924 890 1234',
    role: 'staff',
    department: 'Food & Beverage',
    position: 'Restaurant Supervisor',
    status: 'active',
    hireDate: '2023-06-22',
    lastLogin: '2024-01-18T19:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    permissions: ['restaurant', 'room-service'],
    salary: 32000,
    emergencyContact: {
      name: 'Jose Villanueva',
      phone: '+63 925 901 2345',
      relationship: 'Husband',
    },
  },
];

export const sampleShifts: Shift[] = [
  // Today's shifts
  {
    id: 'SHIFT001',
    staffId: 'STAFF002',
    staffName: 'Maria Santos',
    date: '2024-01-20',
    startTime: '06:00',
    endTime: '14:00',
    position: 'Front Desk',
    status: 'completed',
    notes: 'Handled 15 check-ins, 8 check-outs',
  },
  {
    id: 'SHIFT002',
    staffId: 'STAFF006',
    staffName: 'Lisa Mendoza',
    date: '2024-01-20',
    startTime: '14:00',
    endTime: '22:00',
    position: 'Front Desk',
    status: 'scheduled',
  },
  {
    id: 'SHIFT003',
    staffId: 'STAFF005',
    staffName: 'Robert Garcia',
    date: '2024-01-20',
    startTime: '08:00',
    endTime: '16:00',
    position: 'Maintenance',
    status: 'completed',
    notes: 'Fixed AC in room 203, replaced light bulbs',
  },
  {
    id: 'SHIFT004',
    staffId: 'STAFF008',
    staffName: 'Sarah Villanueva',
    date: '2024-01-20',
    startTime: '10:00',
    endTime: '18:00',
    position: 'Restaurant',
    status: 'scheduled',
  },
  
  // Tomorrow's shifts
  {
    id: 'SHIFT005',
    staffId: 'STAFF006',
    staffName: 'Lisa Mendoza',
    date: '2024-01-21',
    startTime: '06:00',
    endTime: '14:00',
    position: 'Front Desk',
    status: 'scheduled',
  },
  {
    id: 'SHIFT006',
    staffId: 'STAFF002',
    staffName: 'Maria Santos',
    date: '2024-01-21',
    startTime: '14:00',
    endTime: '22:00',
    position: 'Front Desk',
    status: 'scheduled',
  },
  {
    id: 'SHIFT007',
    staffId: 'STAFF005',
    staffName: 'Robert Garcia',
    date: '2024-01-21',
    startTime: '08:00',
    endTime: '16:00',
    position: 'Maintenance',
    status: 'scheduled',
  },
];

export const sampleAuditLogs: AuditLog[] = [
  {
    id: 'LOG001',
    staffId: 'STAFF002',
    staffName: 'Maria Santos',
    action: 'Guest Check-in',
    module: 'Front Desk',
    details: 'Checked in guest John Dela Cruz to room 102',
    timestamp: '2024-01-19T10:30:00Z',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'LOG002',
    staffId: 'STAFF003',
    staffName: 'John Dela Cruz',
    action: 'Inventory Update',
    module: 'Inventory',
    details: 'Updated stock for Bath Towels: -8 units',
    timestamp: '2024-01-19T14:20:00Z',
    ipAddress: '192.168.1.52',
  },
  {
    id: 'LOG003',
    staffId: 'STAFF004',
    staffName: 'Anna Reyes',
    action: 'Report Generated',
    module: 'Analytics',
    details: 'Generated revenue report for January 2024',
    timestamp: '2024-01-19T09:15:00Z',
    ipAddress: '192.168.1.38',
  },
  {
    id: 'LOG004',
    staffId: 'STAFF002',
    staffName: 'Maria Santos',
    action: 'Guest Check-out',
    module: 'Front Desk',
    details: 'Processed check-out for Anna Reyes from room 301',
    timestamp: '2024-01-19T11:45:00Z',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'LOG005',
    staffId: 'STAFF005',
    staffName: 'Robert Garcia',
    action: 'Maintenance Request',
    module: 'Maintenance',
    details: 'Completed AC repair in room 203',
    timestamp: '2024-01-18T16:30:00Z',
    ipAddress: '192.168.1.67',
  },
  {
    id: 'LOG006',
    staffId: 'STAFF003',
    staffName: 'John Dela Cruz',
    action: 'Stock Received',
    module: 'Inventory',
    details: 'Received delivery: 120 bottles of water',
    timestamp: '2024-01-19T08:15:00Z',
    ipAddress: '192.168.1.52',
  },
  {
    id: 'LOG007',
    staffId: 'STAFF006',
    staffName: 'Lisa Mendoza',
    action: 'Reservation Modified',
    module: 'Front Desk',
    details: 'Modified reservation BK2024006 - extended stay by 1 night',
    timestamp: '2024-01-18T15:20:00Z',
    ipAddress: '192.168.1.45',
  },
];

export const getStaffByRole = (role: Staff['role']) => {
  return sampleStaff.filter(staff => staff.role === role);
};

export const getActiveStaff = () => {
  return sampleStaff.filter(staff => staff.status === 'active');
};

export const getStaffById = (id: string) => {
  return sampleStaff.find(staff => staff.id === id);
};

export const getShiftsByDate = (date: string) => {
  return sampleShifts.filter(shift => shift.date === date);
};

export const getShiftsByStaffId = (staffId: string) => {
  return sampleShifts.filter(shift => shift.staffId === staffId);
};

export const getAuditLogsByStaffId = (staffId: string) => {
  return sampleAuditLogs.filter(log => log.staffId === staffId);
};

export const departments = [
  'Administration',
  'Front Office',
  'Operations',
  'Finance',
  'Maintenance',
  'Housekeeping',
  'Food & Beverage',
];

export const positions = [
  'Hotel Manager',
  'Front Desk Supervisor',
  'Front Desk Agent',
  'Inventory Manager',
  'Accounting Manager',
  'Maintenance Technician',
  'Housekeeping Supervisor',
  'Restaurant Supervisor',
];
