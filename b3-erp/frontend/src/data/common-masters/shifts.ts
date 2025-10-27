export interface Shift {
  id: string;
  shiftCode: string;
  shiftName: string;
  shiftType: 'general' | 'production' | 'rotational' | 'flexible' | 'night';
  timing: {
    startTime: string;
    endTime: string;
    duration: number; // in hours
  };
  breaks: {
    type: 'lunch' | 'tea' | 'dinner';
    startTime: string;
    duration: number; // in minutes
  }[];
  workingDays: string[];
  applicableFor: 'all' | 'factory' | 'office' | 'showroom' | 'warehouse';
  allowances: {
    shiftAllowance: number;
    nightAllowance?: number;
    overtimeMultiplier: number;
  };
  attendance: {
    graceTime: number; // in minutes
    minimumHours: number;
    halfDayThreshold: number; // in hours
  };
  color: string;
  isActive: boolean;
  effectiveFrom: string;
  notes?: string;
}

export const mockShifts: Shift[] = [
  {
    id: '1',
    shiftCode: 'GEN-DAY',
    shiftName: 'General Day Shift',
    shiftType: 'general',
    timing: {
      startTime: '09:00',
      endTime: '18:00',
      duration: 9
    },
    breaks: [
      {
        type: 'tea',
        startTime: '11:00',
        duration: 15
      },
      {
        type: 'lunch',
        startTime: '13:00',
        duration: 60
      },
      {
        type: 'tea',
        startTime: '16:00',
        duration: 15
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableFor: 'office',
    allowances: {
      shiftAllowance: 0,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 15,
      minimumHours: 8,
      halfDayThreshold: 4
    },
    color: '#3B82F6',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Standard office hours for administrative and sales staff'
  },
  {
    id: '2',
    shiftCode: 'PROD-A',
    shiftName: 'Production Shift A (Morning)',
    shiftType: 'production',
    timing: {
      startTime: '06:00',
      endTime: '14:00',
      duration: 8
    },
    breaks: [
      {
        type: 'tea',
        startTime: '08:30',
        duration: 15
      },
      {
        type: 'lunch',
        startTime: '11:00',
        duration: 30
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableFor: 'factory',
    allowances: {
      shiftAllowance: 2000, // per month
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 10,
      minimumHours: 7,
      halfDayThreshold: 4
    },
    color: '#10B981',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Morning production shift for manufacturing operations'
  },
  {
    id: '3',
    shiftCode: 'PROD-B',
    shiftName: 'Production Shift B (Afternoon)',
    shiftType: 'production',
    timing: {
      startTime: '14:00',
      endTime: '22:00',
      duration: 8
    },
    breaks: [
      {
        type: 'tea',
        startTime: '16:30',
        duration: 15
      },
      {
        type: 'dinner',
        startTime: '19:00',
        duration: 30
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableFor: 'factory',
    allowances: {
      shiftAllowance: 2500, // per month
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 10,
      minimumHours: 7,
      halfDayThreshold: 4
    },
    color: '#F59E0B',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Afternoon production shift for manufacturing operations'
  },
  {
    id: '4',
    shiftCode: 'PROD-C',
    shiftName: 'Production Shift C (Night)',
    shiftType: 'night',
    timing: {
      startTime: '22:00',
      endTime: '06:00',
      duration: 8
    },
    breaks: [
      {
        type: 'tea',
        startTime: '00:30',
        duration: 15
      },
      {
        type: 'dinner',
        startTime: '03:00',
        duration: 30
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableFor: 'factory',
    allowances: {
      shiftAllowance: 3000, // per month
      nightAllowance: 1500, // additional
      overtimeMultiplier: 2.5
    },
    attendance: {
      graceTime: 10,
      minimumHours: 7,
      halfDayThreshold: 4
    },
    color: '#8B5CF6',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Night production shift with additional allowances as per Factories Act'
  },
  {
    id: '5',
    shiftCode: 'SR-DAY',
    shiftName: 'Showroom Day Shift',
    shiftType: 'general',
    timing: {
      startTime: '10:00',
      endTime: '20:00',
      duration: 10
    },
    breaks: [
      {
        type: 'tea',
        startTime: '12:00',
        duration: 15
      },
      {
        type: 'lunch',
        startTime: '14:30',
        duration: 45
      },
      {
        type: 'tea',
        startTime: '17:30',
        duration: 15
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    applicableFor: 'showroom',
    allowances: {
      shiftAllowance: 1500,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 10,
      minimumHours: 9,
      halfDayThreshold: 5
    },
    color: '#EC4899',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Showroom staff working 7 days with rotational weekly off'
  },
  {
    id: '6',
    shiftCode: 'WH-DAY',
    shiftName: 'Warehouse Day Shift',
    shiftType: 'general',
    timing: {
      startTime: '08:00',
      endTime: '17:00',
      duration: 9
    },
    breaks: [
      {
        type: 'tea',
        startTime: '10:30',
        duration: 15
      },
      {
        type: 'lunch',
        startTime: '13:00',
        duration: 45
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableFor: 'warehouse',
    allowances: {
      shiftAllowance: 1000,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 15,
      minimumHours: 8,
      halfDayThreshold: 4
    },
    color: '#06B6D4',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Warehouse operations shift for material handling and dispatch'
  },
  {
    id: '7',
    shiftCode: 'FLEX-1',
    shiftName: 'Flexible Shift (10-7)',
    shiftType: 'flexible',
    timing: {
      startTime: '10:00',
      endTime: '19:00',
      duration: 9
    },
    breaks: [
      {
        type: 'lunch',
        startTime: '14:00',
        duration: 60
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    applicableFor: 'office',
    allowances: {
      shiftAllowance: 0,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 30,
      minimumHours: 8,
      halfDayThreshold: 4
    },
    color: '#6366F1',
    isActive: true,
    effectiveFrom: '2024-01-01',
    notes: 'Flexible timing for senior staff and special projects'
  },
  {
    id: '8',
    shiftCode: 'FLEX-2',
    shiftName: 'Flexible Shift (11-8)',
    shiftType: 'flexible',
    timing: {
      startTime: '11:00',
      endTime: '20:00',
      duration: 9
    },
    breaks: [
      {
        type: 'lunch',
        startTime: '15:00',
        duration: 60
      }
    ],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    applicableFor: 'office',
    allowances: {
      shiftAllowance: 0,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 30,
      minimumHours: 8,
      halfDayThreshold: 4
    },
    color: '#14B8A6',
    isActive: true,
    effectiveFrom: '2024-01-01',
    notes: 'Late flexible timing option for work-life balance'
  },
  {
    id: '9',
    shiftCode: 'ROT-WK',
    shiftName: 'Rotational Weekly Shift',
    shiftType: 'rotational',
    timing: {
      startTime: '08:00',
      endTime: '17:00',
      duration: 9
    },
    breaks: [
      {
        type: 'tea',
        startTime: '10:30',
        duration: 15
      },
      {
        type: 'lunch',
        startTime: '13:00',
        duration: 45
      }
    ],
    workingDays: ['All days (rotational off)'],
    applicableFor: 'all',
    allowances: {
      shiftAllowance: 2000,
      overtimeMultiplier: 2.0
    },
    attendance: {
      graceTime: 15,
      minimumHours: 8,
      halfDayThreshold: 4
    },
    color: '#EF4444',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'Rotating shift pattern with weekly off on rotation basis'
  },
  {
    id: '10',
    shiftCode: 'MAINT-ON',
    shiftName: 'Maintenance On-Call',
    shiftType: 'flexible',
    timing: {
      startTime: '00:00',
      endTime: '23:59',
      duration: 24
    },
    breaks: [],
    workingDays: ['As required'],
    applicableFor: 'factory',
    allowances: {
      shiftAllowance: 5000,
      nightAllowance: 2000,
      overtimeMultiplier: 3.0
    },
    attendance: {
      graceTime: 0,
      minimumHours: 0,
      halfDayThreshold: 0
    },
    color: '#78350F',
    isActive: true,
    effectiveFrom: '2023-01-01',
    notes: 'On-call maintenance staff for emergency breakdowns'
  }
];
