export interface LeaveBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  leaveTypeId: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  leaveTypeIcon: string;
  leaveTypeColor: string;
  totalEntitlement: number;
  opening: number;
  accrued: number;
  taken: number;
  pending: number;
  balance: number;
  carryForward: number;
  encashable: number;
  year: number;
  lastUpdated: string;
}

// Mock data for current user's leave balances
export const mockMyLeaveBalances: LeaveBalance[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '1',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    leaveTypeColor: 'bg-green-100 text-green-800',
    totalEntitlement: 18,
    opening: 5,
    accrued: 12,
    taken: 8,
    pending: 2,
    balance: 7,
    carryForward: 5,
    encashable: 7,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '2',
    leaveTypeCode: 'CL',
    leaveTypeName: 'Casual Leave',
    leaveTypeIcon: '📅',
    leaveTypeColor: 'bg-blue-100 text-blue-800',
    totalEntitlement: 12,
    opening: 0,
    accrued: 12,
    taken: 5,
    pending: 0,
    balance: 7,
    carryForward: 0,
    encashable: 0,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '3',
    leaveTypeCode: 'SL',
    leaveTypeName: 'Sick Leave',
    leaveTypeIcon: '🏥',
    leaveTypeColor: 'bg-red-100 text-red-800',
    totalEntitlement: 12,
    opening: 3,
    accrued: 12,
    taken: 2,
    pending: 0,
    balance: 13,
    carryForward: 3,
    encashable: 0,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  },
  {
    id: '4',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '7',
    leaveTypeCode: 'CH',
    leaveTypeName: 'Compensatory Off',
    leaveTypeIcon: '⏰',
    leaveTypeColor: 'bg-purple-100 text-purple-800',
    totalEntitlement: 24,
    opening: 2,
    accrued: 8,
    taken: 3,
    pending: 0,
    balance: 7,
    carryForward: 2,
    encashable: 7,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  },
  {
    id: '5',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '11',
    leaveTypeCode: 'FL',
    leaveTypeName: 'Festival Leave',
    leaveTypeIcon: '🎉',
    leaveTypeColor: 'bg-amber-100 text-amber-800',
    totalEntitlement: 3,
    opening: 0,
    accrued: 3,
    taken: 1,
    pending: 0,
    balance: 2,
    carryForward: 0,
    encashable: 0,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  },
  {
    id: '6',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    employeeCode: 'EMP001',
    department: 'Production',
    designation: 'Production Supervisor',
    leaveTypeId: '9',
    leaveTypeCode: 'WFH',
    leaveTypeName: 'Work From Home',
    leaveTypeIcon: '🏠',
    leaveTypeColor: 'bg-indigo-100 text-indigo-800',
    totalEntitlement: 0,
    opening: 0,
    accrued: 0,
    taken: 0,
    pending: 0,
    balance: 0,
    carryForward: 0,
    encashable: 0,
    year: 2025,
    lastUpdated: '2025-10-25T10:30:00Z'
  }
];

export interface LeaveTransaction {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  leaveTypeIcon?: string;
  fromDate: string;
  toDate: string;
  days: number;
  durationType?: 'full-day' | 'half-day-first' | 'half-day-second';
  reason: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'withdrawn';
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectedBy?: string;
  rejectedOn?: string;
  rejectionReason?: string;
  cancelledOn?: string;
  emergencyContact?: string;
  hasAttachment?: boolean;
}

export const mockLeaveTransactions: LeaveTransaction[] = [
  {
    id: 'LT001',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    fromDate: '2025-10-20',
    toDate: '2025-10-22',
    days: 3,
    durationType: 'full-day',
    reason: 'Family function in hometown',
    status: 'approved',
    appliedOn: '2025-10-15T09:00:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-10-15T14:30:00Z',
    emergencyContact: '+91 98765 43210',
    hasAttachment: false
  },
  {
    id: 'LT002',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'CL',
    leaveTypeName: 'Casual Leave',
    leaveTypeIcon: '📅',
    fromDate: '2025-11-05',
    toDate: '2025-11-05',
    days: 1,
    durationType: 'full-day',
    reason: 'Personal work - bank visit',
    status: 'pending',
    appliedOn: '2025-10-25T08:30:00Z',
    emergencyContact: '+91 98765 43210',
    hasAttachment: false
  },
  {
    id: 'LT003',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'FL',
    leaveTypeName: 'Festival Leave',
    leaveTypeIcon: '🎉',
    fromDate: '2025-11-12',
    toDate: '2025-11-12',
    days: 1,
    durationType: 'full-day',
    reason: 'Diwali celebration with family',
    status: 'approved',
    appliedOn: '2025-10-20T10:00:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-10-21T11:00:00Z',
    hasAttachment: false
  },
  {
    id: 'LT004',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'SL',
    leaveTypeName: 'Sick Leave',
    leaveTypeIcon: '🏥',
    fromDate: '2025-09-10',
    toDate: '2025-09-12',
    days: 3,
    durationType: 'full-day',
    reason: 'Fever and body ache',
    status: 'approved',
    appliedOn: '2025-09-10T07:15:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-09-10T08:45:00Z',
    emergencyContact: '+91 98765 43210',
    hasAttachment: true
  },
  {
    id: 'LT005',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'CH',
    leaveTypeName: 'Compensatory Off',
    leaveTypeIcon: '⏰',
    fromDate: '2025-08-15',
    toDate: '2025-08-15',
    days: 1,
    durationType: 'full-day',
    reason: 'Comp off for working on Independence Day',
    status: 'approved',
    appliedOn: '2025-08-16T09:00:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-08-16T10:15:00Z',
    hasAttachment: false
  },
  {
    id: 'LT006',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    fromDate: '2025-07-22',
    toDate: '2025-07-26',
    days: 5,
    durationType: 'full-day',
    reason: 'Summer vacation with family',
    status: 'approved',
    appliedOn: '2025-07-10T11:20:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-07-11T09:30:00Z',
    emergencyContact: '+91 98765 43210',
    hasAttachment: false
  },
  {
    id: 'LT007',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'CL',
    leaveTypeName: 'Casual Leave',
    leaveTypeIcon: '📅',
    fromDate: '2025-06-18',
    toDate: '2025-06-18',
    days: 0.5,
    durationType: 'half-day-second',
    reason: 'Doctor appointment',
    status: 'approved',
    appliedOn: '2025-06-17T08:00:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-06-17T09:45:00Z',
    hasAttachment: false
  },
  {
    id: 'LT008',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'WFH',
    leaveTypeName: 'Work From Home',
    leaveTypeIcon: '🏠',
    fromDate: '2025-12-20',
    toDate: '2025-12-20',
    days: 1,
    durationType: 'full-day',
    reason: 'Internet installation at home',
    status: 'rejected',
    appliedOn: '2025-10-24T10:15:00Z',
    rejectedBy: 'Suresh Iyer (Production Manager)',
    rejectedOn: '2025-10-24T15:20:00Z',
    rejectionReason: 'WFH not applicable for production supervisors. Physical presence required on factory floor.',
    hasAttachment: false
  },
  {
    id: 'LT009',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    fromDate: '2025-12-24',
    toDate: '2025-12-26',
    days: 3,
    durationType: 'full-day',
    reason: 'Christmas holidays',
    status: 'pending',
    appliedOn: '2025-10-25T14:00:00Z',
    emergencyContact: '+91 98765 43210',
    hasAttachment: false
  },
  {
    id: 'LT010',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    leaveTypeCode: 'CL',
    leaveTypeName: 'Casual Leave',
    leaveTypeIcon: '📅',
    fromDate: '2025-05-10',
    toDate: '2025-05-10',
    days: 1,
    durationType: 'full-day',
    reason: 'Child school admission',
    status: 'withdrawn',
    appliedOn: '2025-05-05T09:30:00Z',
    approvedBy: 'Suresh Iyer (Production Manager)',
    approvedOn: '2025-05-05T11:00:00Z',
    cancelledOn: '2025-05-08T08:00:00Z',
    hasAttachment: false
  }
];

// Team member summary for supervisor view
export interface TeamMemberLeaveSummary {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  shift?: string;
  totalEntitlement: number;
  totalTaken: number;
  totalPending: number;
  totalBalance: number;
  lastLeaveDate?: string;
  upcomingLeave?: {
    fromDate: string;
    toDate: string;
    leaveType: string;
    days: number;
  };
  status: 'active' | 'on-leave' | 'upcoming-leave';
}

export const mockTeamLeaveSummary: TeamMemberLeaveSummary[] = [
  {
    id: 'TM001',
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    employeeCode: 'EMP002',
    department: 'Production',
    designation: 'Assembly Line Operator',
    shift: 'A',
    totalEntitlement: 45,
    totalTaken: 12,
    totalPending: 0,
    totalBalance: 33,
    lastLeaveDate: '2025-09-15',
    status: 'active'
  },
  {
    id: 'TM002',
    employeeId: 'EMP003',
    employeeName: 'Amit Patel',
    employeeCode: 'EMP003',
    department: 'Production',
    designation: 'Quality Inspector',
    shift: 'B',
    totalEntitlement: 45,
    totalTaken: 18,
    totalPending: 2,
    totalBalance: 25,
    lastLeaveDate: '2025-10-10',
    upcomingLeave: {
      fromDate: '2025-11-08',
      toDate: '2025-11-10',
      leaveType: 'EL',
      days: 3
    },
    status: 'upcoming-leave'
  },
  {
    id: 'TM003',
    employeeId: 'EMP004',
    employeeName: 'Sunita Devi',
    employeeCode: 'EMP004',
    department: 'Production',
    designation: 'Machine Operator',
    shift: 'A',
    totalEntitlement: 45,
    totalTaken: 8,
    totalPending: 0,
    totalBalance: 37,
    lastLeaveDate: '2025-08-22',
    status: 'active'
  },
  {
    id: 'TM004',
    employeeId: 'EMP005',
    employeeName: 'Ramesh Singh',
    employeeCode: 'EMP005',
    department: 'Production',
    designation: 'Assembly Line Operator',
    shift: 'C',
    totalEntitlement: 45,
    totalTaken: 15,
    totalPending: 3,
    totalBalance: 27,
    upcomingLeave: {
      fromDate: '2025-10-26',
      toDate: '2025-10-27',
      leaveType: 'CL',
      days: 2
    },
    status: 'on-leave'
  },
  {
    id: 'TM005',
    employeeId: 'EMP006',
    employeeName: 'Kavita Reddy',
    employeeCode: 'EMP006',
    department: 'Production',
    designation: 'Quality Inspector',
    shift: 'B',
    totalEntitlement: 45,
    totalTaken: 20,
    totalPending: 0,
    totalBalance: 25,
    lastLeaveDate: '2025-10-18',
    status: 'active'
  },
  {
    id: 'TM006',
    employeeId: 'EMP007',
    employeeName: 'Suresh Kumar',
    employeeCode: 'EMP007',
    department: 'Production',
    designation: 'Machine Operator',
    shift: 'A',
    totalEntitlement: 45,
    totalTaken: 10,
    totalPending: 1,
    totalBalance: 34,
    lastLeaveDate: '2025-09-28',
    status: 'active'
  },
  {
    id: 'TM007',
    employeeId: 'EMP008',
    employeeName: 'Deepa Nair',
    employeeCode: 'EMP008',
    department: 'Production',
    designation: 'Assembly Line Operator',
    shift: 'C',
    totalEntitlement: 45,
    totalTaken: 14,
    totalPending: 0,
    totalBalance: 31,
    lastLeaveDate: '2025-10-05',
    status: 'active'
  },
  {
    id: 'TM008',
    employeeId: 'EMP009',
    employeeName: 'Vijay Rao',
    employeeCode: 'EMP009',
    department: 'Production',
    designation: 'Quality Inspector',
    shift: 'A',
    totalEntitlement: 45,
    totalTaken: 22,
    totalPending: 2,
    totalBalance: 21,
    lastLeaveDate: '2025-10-12',
    upcomingLeave: {
      fromDate: '2025-11-15',
      toDate: '2025-11-17',
      leaveType: 'EL',
      days: 3
    },
    status: 'upcoming-leave'
  }
];

// Pending leave applications for approval (Team member applications)
export const mockPendingLeaveApprovals: LeaveTransaction[] = [
  {
    id: 'LT101',
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    fromDate: '2025-11-08',
    toDate: '2025-11-10',
    days: 3,
    durationType: 'full-day',
    reason: 'Family wedding in hometown',
    status: 'pending',
    appliedOn: '2025-10-24T09:15:00Z',
    emergencyContact: '+91 98765 11111',
    hasAttachment: false
  },
  {
    id: 'LT102',
    employeeId: 'EMP003',
    employeeName: 'Amit Patel',
    leaveTypeCode: 'SL',
    leaveTypeName: 'Sick Leave',
    leaveTypeIcon: '🏥',
    fromDate: '2025-10-26',
    toDate: '2025-10-26',
    days: 1,
    durationType: 'full-day',
    reason: 'Severe headache and fever',
    status: 'pending',
    appliedOn: '2025-10-26T07:00:00Z',
    emergencyContact: '+91 98765 22222',
    hasAttachment: false
  },
  {
    id: 'LT103',
    employeeId: 'EMP005',
    employeeName: 'Ramesh Singh',
    leaveTypeCode: 'FL',
    leaveTypeName: 'Festival Leave',
    leaveTypeIcon: '🎉',
    fromDate: '2025-11-14',
    toDate: '2025-11-14',
    days: 1,
    durationType: 'full-day',
    reason: 'Chhath Puja celebration',
    status: 'pending',
    appliedOn: '2025-10-25T11:30:00Z',
    emergencyContact: '+91 98765 33333',
    hasAttachment: false
  },
  {
    id: 'LT104',
    employeeId: 'EMP007',
    employeeName: 'Suresh Kumar',
    leaveTypeCode: 'CL',
    leaveTypeName: 'Casual Leave',
    leaveTypeIcon: '📅',
    fromDate: '2025-11-01',
    toDate: '2025-11-01',
    days: 0.5,
    durationType: 'half-day-second',
    reason: 'Child parent-teacher meeting',
    status: 'pending',
    appliedOn: '2025-10-25T14:20:00Z',
    emergencyContact: '+91 98765 44444',
    hasAttachment: false
  },
  {
    id: 'LT105',
    employeeId: 'EMP009',
    employeeName: 'Vijay Rao',
    leaveTypeCode: 'EL',
    leaveTypeName: 'Earned Leave',
    leaveTypeIcon: '🌴',
    fromDate: '2025-11-15',
    toDate: '2025-11-17',
    days: 3,
    durationType: 'full-day',
    reason: 'Personal travel - pre-planned vacation',
    status: 'pending',
    appliedOn: '2025-10-23T10:00:00Z',
    emergencyContact: '+91 98765 55555',
    hasAttachment: false
  }
];

// Department-wise leave summary
export interface DepartmentLeaveSummary {
  id: string;
  department: string;
  departmentCode: string;
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  upcomingLeave: number;
  totalEntitlement: number;
  totalTaken: number;
  totalPending: number;
  totalBalance: number;
  avgUtilization: number;
  topLeaveType: string;
  criticalCount: number; // employees with low leave balance
}

export const mockDepartmentLeaveSummary: DepartmentLeaveSummary[] = [
  {
    id: 'DEPT001',
    department: 'Production',
    departmentCode: 'PROD',
    totalEmployees: 45,
    activeEmployees: 42,
    onLeave: 2,
    upcomingLeave: 5,
    totalEntitlement: 2025,
    totalTaken: 680,
    totalPending: 85,
    totalBalance: 1260,
    avgUtilization: 34,
    topLeaveType: 'EL',
    criticalCount: 3
  },
  {
    id: 'DEPT002',
    department: 'Quality Control',
    departmentCode: 'QC',
    totalEmployees: 12,
    activeEmployees: 11,
    onLeave: 1,
    upcomingLeave: 2,
    totalEntitlement: 540,
    totalTaken: 210,
    totalPending: 18,
    totalBalance: 312,
    avgUtilization: 39,
    topLeaveType: 'CL',
    criticalCount: 1
  },
  {
    id: 'DEPT003',
    department: 'Warehouse',
    departmentCode: 'WH',
    totalEmployees: 18,
    activeEmployees: 17,
    onLeave: 0,
    upcomingLeave: 3,
    totalEntitlement: 810,
    totalTaken: 290,
    totalPending: 25,
    totalBalance: 495,
    avgUtilization: 36,
    topLeaveType: 'EL',
    criticalCount: 2
  },
  {
    id: 'DEPT004',
    department: 'Maintenance',
    departmentCode: 'MAINT',
    totalEmployees: 8,
    activeEmployees: 8,
    onLeave: 0,
    upcomingLeave: 1,
    totalEntitlement: 360,
    totalTaken: 145,
    totalPending: 12,
    totalBalance: 203,
    avgUtilization: 40,
    topLeaveType: 'CH',
    criticalCount: 0
  },
  {
    id: 'DEPT005',
    department: 'Administration',
    departmentCode: 'ADMIN',
    totalEmployees: 6,
    activeEmployees: 6,
    onLeave: 0,
    upcomingLeave: 1,
    totalEntitlement: 270,
    totalTaken: 95,
    totalPending: 8,
    totalBalance: 167,
    avgUtilization: 35,
    topLeaveType: 'CL',
    criticalCount: 0
  },
  {
    id: 'DEPT006',
    department: 'HR',
    departmentCode: 'HR',
    totalEmployees: 4,
    activeEmployees: 4,
    onLeave: 0,
    upcomingLeave: 0,
    totalEntitlement: 180,
    totalTaken: 68,
    totalPending: 5,
    totalBalance: 107,
    avgUtilization: 38,
    topLeaveType: 'EL',
    criticalCount: 0
  },
  {
    id: 'DEPT007',
    department: 'IT',
    departmentCode: 'IT',
    totalEmployees: 3,
    activeEmployees: 3,
    onLeave: 0,
    upcomingLeave: 1,
    totalEntitlement: 135,
    totalTaken: 52,
    totalPending: 6,
    totalBalance: 77,
    avgUtilization: 39,
    topLeaveType: 'WFH',
    criticalCount: 0
  }
];
