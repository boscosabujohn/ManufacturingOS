export interface Grade {
  id: string;
  gradeCode: string;
  gradeName: string;
  level: number;
  category: 'executive' | 'management' | 'supervisory' | 'staff' | 'worker';
  salaryRange: {
    minSalary: number;
    maxSalary: number;
    currency: string;
  };
  benefits: {
    pfApplicable: boolean;
    esiApplicable: boolean;
    gratuityApplicable: boolean;
    bonusApplicable: boolean;
    medicalInsurance: boolean;
  };
  leaveEntitlement: {
    earnedLeave: number;
    casualLeave: number;
    sickLeave: number;
  };
  perks: string[];
  probationPeriod: number; // in months
  noticePeriod: number; // in months
  appraisalCycle: 'quarterly' | 'half-yearly' | 'annual';
  eligibleDesignations: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockGrades: Grade[] = [
  {
    id: '1',
    gradeCode: 'EXEC-1',
    gradeName: 'Executive Level 1',
    level: 1,
    category: 'executive',
    salaryRange: {
      minSalary: 3000000,
      maxSalary: 5000000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 30,
      casualLeave: 12,
      sickLeave: 12
    },
    perks: [
      'Company Car',
      'Fuel Allowance',
      'Mobile & Data',
      'Club Membership',
      'Stock Options',
      'Executive Health Checkup'
    ],
    probationPeriod: 6,
    noticePeriod: 3,
    appraisalCycle: 'annual',
    eligibleDesignations: ['CEO', 'COO', 'CFO', 'CTO', 'Vice President'],
    description: 'Senior executive leadership responsible for strategic direction and P&L',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    gradeCode: 'EXEC-2',
    gradeName: 'Executive Level 2',
    level: 2,
    category: 'executive',
    salaryRange: {
      minSalary: 1800000,
      maxSalary: 3000000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 28,
      casualLeave: 12,
      sickLeave: 12
    },
    perks: [
      'Car Allowance',
      'Mobile & Data',
      'Health Insurance (Family)',
      'Performance Bonus',
      'Executive Checkup'
    ],
    probationPeriod: 6,
    noticePeriod: 3,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Director', 'General Manager', 'Senior Vice President'],
    description: 'Senior management responsible for department/function leadership',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    gradeCode: 'MGT-1',
    gradeName: 'Management Grade 1',
    level: 3,
    category: 'management',
    salaryRange: {
      minSalary: 1200000,
      maxSalary: 1800000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 24,
      casualLeave: 10,
      sickLeave: 10
    },
    perks: [
      'Transport Allowance',
      'Mobile Reimbursement',
      'Health Insurance (Family)',
      'Annual Bonus'
    ],
    probationPeriod: 6,
    noticePeriod: 2,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Manager', 'Senior Manager', 'Assistant Manager'],
    description: 'Middle management responsible for team management and execution',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    gradeCode: 'MGT-2',
    gradeName: 'Management Grade 2',
    level: 4,
    category: 'management',
    salaryRange: {
      minSalary: 800000,
      maxSalary: 1200000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 21,
      casualLeave: 10,
      sickLeave: 10
    },
    perks: [
      'Transport Allowance',
      'Mobile Reimbursement',
      'Health Insurance (Self + Spouse)',
      'Performance Incentive'
    ],
    probationPeriod: 6,
    noticePeriod: 2,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Deputy Manager', 'Team Lead', 'Assistant Manager'],
    description: 'Junior management responsible for team coordination and delivery',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '5',
    gradeCode: 'SUP-1',
    gradeName: 'Supervisory Grade 1',
    level: 5,
    category: 'supervisory',
    salaryRange: {
      minSalary: 500000,
      maxSalary: 800000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 18,
      casualLeave: 8,
      sickLeave: 8
    },
    perks: [
      'Transport Allowance',
      'Mobile Reimbursement',
      'Health Insurance (Self)',
      'Shift Allowance (if applicable)'
    ],
    probationPeriod: 3,
    noticePeriod: 1,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Supervisor', 'Senior Executive', 'Coordinator'],
    description: 'Supervisory role managing operations and worker teams',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '6',
    gradeCode: 'STF-1',
    gradeName: 'Staff Grade 1',
    level: 6,
    category: 'staff',
    salaryRange: {
      minSalary: 350000,
      maxSalary: 500000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: false,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 15,
      casualLeave: 7,
      sickLeave: 7
    },
    perks: [
      'Transport Allowance',
      'Health Insurance (Self)',
      'Annual Bonus'
    ],
    probationPeriod: 3,
    noticePeriod: 1,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Executive', 'Senior Associate', 'Officer'],
    description: 'Staff positions handling specialized work and support functions',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '7',
    gradeCode: 'STF-2',
    gradeName: 'Staff Grade 2',
    level: 7,
    category: 'staff',
    salaryRange: {
      minSalary: 250000,
      maxSalary: 350000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: true,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: true
    },
    leaveEntitlement: {
      earnedLeave: 15,
      casualLeave: 7,
      sickLeave: 7
    },
    perks: [
      'Transport Allowance',
      'Health Insurance (Self)',
      'Attendance Bonus'
    ],
    probationPeriod: 3,
    noticePeriod: 1,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Junior Executive', 'Associate', 'Assistant'],
    description: 'Junior staff roles handling routine operations',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '8',
    gradeCode: 'WKR-1',
    gradeName: 'Skilled Worker',
    level: 8,
    category: 'worker',
    salaryRange: {
      minSalary: 180000,
      maxSalary: 250000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: true,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: false
    },
    leaveEntitlement: {
      earnedLeave: 12,
      casualLeave: 7,
      sickLeave: 7
    },
    perks: [
      'Shift Allowance',
      'Overtime Pay',
      'Attendance Bonus',
      'Safety Equipment'
    ],
    probationPeriod: 3,
    noticePeriod: 1,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Skilled Worker', 'Technician', 'Operator - Grade A'],
    description: 'Skilled production workers with specialized training',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '9',
    gradeCode: 'WKR-2',
    gradeName: 'Semi-Skilled Worker',
    level: 9,
    category: 'worker',
    salaryRange: {
      minSalary: 150000,
      maxSalary: 180000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: true,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: false
    },
    leaveEntitlement: {
      earnedLeave: 12,
      casualLeave: 7,
      sickLeave: 7
    },
    perks: [
      'Shift Allowance',
      'Overtime Pay',
      'Attendance Bonus',
      'Safety Equipment'
    ],
    probationPeriod: 2,
    noticePeriod: 1,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Semi-Skilled Worker', 'Operator - Grade B', 'Helper'],
    description: 'Production workers with basic training',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '10',
    gradeCode: 'WKR-3',
    gradeName: 'Unskilled Worker',
    level: 10,
    category: 'worker',
    salaryRange: {
      minSalary: 120000,
      maxSalary: 150000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: true,
      esiApplicable: true,
      gratuityApplicable: true,
      bonusApplicable: true,
      medicalInsurance: false
    },
    leaveEntitlement: {
      earnedLeave: 12,
      casualLeave: 7,
      sickLeave: 7
    },
    perks: [
      'Shift Allowance',
      'Overtime Pay',
      'Attendance Bonus',
      'Safety Equipment'
    ],
    probationPeriod: 1,
    noticePeriod: 0,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Unskilled Worker', 'Trainee', 'Peon', 'Cleaner'],
    description: 'Entry-level workers requiring minimal specialized skills',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '11',
    gradeCode: 'CONT-1',
    gradeName: 'Contractor Grade',
    level: 11,
    category: 'worker',
    salaryRange: {
      minSalary: 100000,
      maxSalary: 180000,
      currency: 'INR'
    },
    benefits: {
      pfApplicable: false,
      esiApplicable: true,
      gratuityApplicable: false,
      bonusApplicable: false,
      medicalInsurance: false
    },
    leaveEntitlement: {
      earnedLeave: 0,
      casualLeave: 0,
      sickLeave: 0
    },
    perks: [
      'Shift Allowance',
      'Safety Equipment'
    ],
    probationPeriod: 0,
    noticePeriod: 0,
    appraisalCycle: 'annual',
    eligibleDesignations: ['Contract Worker', 'Temporary Staff'],
    description: 'Contract workers hired through third-party vendors',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  }
];
