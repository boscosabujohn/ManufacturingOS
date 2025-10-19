# HR & Employee Masters - Complete Implementation Guide

This document provides complete implementation details for all HR Master components.

## ✅ Completed Components

1. **Employee Master** - `src/components/hr-masters/EmployeeMaster.tsx`

## 📋 Components to Implement

### 2. Designation Master
**File**: `src/components/hr-masters/DesignationMaster.tsx`

**Interface**:
```typescript
interface Designation {
  id: string;
  designationCode: string;
  designationName: string;
  departmentId: string;
  departmentName: string;

  hierarchy: {
    level: number;
    parentDesignationId?: string;
    parentDesignation?: string;
    reportingTo?: string[];
  };

  responsibilities: {
    keyResponsibilities: string[];
    authority: string[];
    decisionMakingLevel: 'Strategic' | 'Tactical' | 'Operational';
  };

  requirements: {
    minimumEducation: string;
    preferredEducation?: string;
    minimumExperience: number;
    requiredSkills: string[];
    certifications?: string[];
  };

  compensation: {
    gradeId: string;
    gradeName: string;
    salaryRangeMin: number;
    salaryRangeMax: number;
    currency: string;
  };

  statistics: {
    totalEmployees: number;
    activeEmployees: number;
    vacantPositions: number;
  };

  status: 'Active' | 'Inactive' | 'On Hold';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockDesignations = [
  {
    id: 'DES001',
    designationCode: 'SSE',
    designationName: 'Senior Software Engineer',
    departmentId: 'DEPT001',
    departmentName: 'Technology',
    hierarchy: {
      level: 3,
      parentDesignationId: 'DES010',
      parentDesignation: 'Team Lead',
      reportingTo: ['Team Lead', 'Engineering Manager']
    },
    responsibilities: {
      keyResponsibilities: [
        'Design and develop software solutions',
        'Code review and mentoring junior developers',
        'Technical documentation'
      ],
      authority: ['Code approval', 'Technical decisions'],
      decisionMakingLevel: 'Tactical'
    },
    requirements: {
      minimumEducation: "Bachelor's in Computer Science",
      preferredEducation: "Master's in Computer Science",
      minimumExperience: 5,
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      certifications: ['AWS Certified']
    },
    compensation: {
      gradeId: 'GRD003',
      gradeName: 'E3',
      salaryRangeMin: 800000,
      salaryRangeMax: 1200000,
      currency: 'INR'
    },
    statistics: {
      totalEmployees: 45,
      activeEmployees: 42,
      vacantPositions: 5
    },
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'HR Admin',
      updatedBy: 'HR Manager'
    }
  }
  // Add more designations...
];
```

---

### 3. Grade Master
**File**: `src/components/hr-masters/GradeMaster.tsx`

**Interface**:
```typescript
interface Grade {
  id: string;
  gradeCode: string;
  gradeName: string;
  gradeLevel: number;

  category: {
    gradeCategory: 'Entry Level' | 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Manager' | 'Executive';
    employeeType: 'Staff' | 'Management' | 'Executive';
  };

  compensation: {
    salaryBandMin: number;
    salaryBandMax: number;
    currency: string;
    incrementPercentage: number;
    bonusEligibility: boolean;
    maxBonusPercentage?: number;
  };

  benefits: {
    leaveEntitlement: {
      casualLeave: number;
      sickLeave: number;
      earnedLeave: number;
      maternityLeave?: number;
      paternityLeave?: number;
    };
    allowances: string[];
    insuranceCoverage: number;
    retirementBenefits: boolean;
  };

  progression: {
    minimumYearsForPromotion: number;
    nextGradeId?: string;
    nextGrade?: string;
    performanceThreshold: number;
  };

  statistics: {
    totalEmployees: number;
    avgSalary: number;
    avgExperience: number;
  };

  status: 'Active' | 'Inactive' | 'Deprecated';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

---

### 4. Shift Master
**File**: `src/components/hr-masters/ShiftMaster.tsx`

**Interface**:
```typescript
interface Shift {
  id: string;
  shiftCode: string;
  shiftName: string;
  shiftType: 'General' | 'Rotational' | 'Night' | 'Flexible' | 'Split';

  timing: {
    startTime: string;
    endTime: string;
    duration: number;
    graceTime: number;
    breakDuration: number;
    breakTime?: string;
  };

  schedule: {
    workingDays: string[];
    weeklyOffs: string[];
    rotationCycle?: number;
    overtimeAllowed: boolean;
    maxOvertimeHours?: number;
  };

  allowances: {
    shiftAllowance?: number;
    nightShiftAllowance?: number;
    overtimeRate: number;
  };

  location: {
    applicableLocations: string[];
    departments: string[];
  };

  statistics: {
    totalEmployees: number;
    avgAttendance: number;
    overtimeHours: number;
  };

  status: 'Active' | 'Inactive';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockShifts = [
  {
    id: 'SHIFT001',
    shiftCode: 'GEN-DAY',
    shiftName: 'General Day Shift',
    shiftType: 'General',
    timing: {
      startTime: '09:00',
      endTime: '18:00',
      duration: 9,
      graceTime: 15,
      breakDuration: 60,
      breakTime: '13:00'
    },
    schedule: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      weeklyOffs: ['Saturday', 'Sunday'],
      overtimeAllowed: true,
      maxOvertimeHours: 4
    },
    allowances: {
      overtimeRate: 2.0
    },
    location: {
      applicableLocations: ['Mumbai Office', 'Bengaluru Office'],
      departments: ['All']
    },
    statistics: {
      totalEmployees: 450,
      avgAttendance: 94.5,
      overtimeHours: 1250
    },
    status: 'Active'
  },
  {
    id: 'SHIFT002',
    shiftCode: 'NIGHT',
    shiftName: 'Night Shift',
    shiftType: 'Night',
    timing: {
      startTime: '22:00',
      endTime: '06:00',
      duration: 8,
      graceTime: 30,
      breakDuration: 30
    },
    schedule: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weeklyOffs: ['Sunday'],
      overtimeAllowed: true,
      maxOvertimeHours: 2
    },
    allowances: {
      nightShiftAllowance: 5000,
      overtimeRate: 2.5
    },
    location: {
      applicableLocations: ['Mumbai Office'],
      departments: ['Production', 'Operations']
    },
    statistics: {
      totalEmployees: 85,
      avgAttendance: 91.2,
      overtimeHours: 450
    },
    status: 'Active'
  }
];
```

---

### 5. Holiday Master
**File**: `src/components/hr-masters/HolidayMaster.tsx`

**Interface**:
```typescript
interface Holiday {
  id: string;
  holidayName: string;
  holidayDate: Date;
  holidayType: 'National' | 'Festival' | 'Regional' | 'Optional' | 'Company';

  applicability: {
    countryId?: string;
    country?: string;
    stateId?: string;
    state?: string;
    locations: string[];
    departments?: string[];
  };

  settings: {
    isPaid: boolean;
    isOptional: boolean;
    isRecurring: boolean;
    recurrencePattern?: 'Yearly' | 'Lunar' | 'Custom';
  };

  description?: string;
  year: number;

  status: 'Active' | 'Inactive' | 'Cancelled';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockHolidays = [
  {
    id: 'HOL001',
    holidayName: 'Republic Day',
    holidayDate: new Date('2024-01-26'),
    holidayType: 'National',
    applicability: {
      country: 'India',
      locations: ['All'],
      departments: ['All']
    },
    settings: {
      isPaid: true,
      isOptional: false,
      isRecurring: true,
      recurrencePattern: 'Yearly'
    },
    description: 'Indian Republic Day',
    year: 2024,
    status: 'Active'
  },
  {
    id: 'HOL002',
    holidayName: 'Diwali',
    holidayDate: new Date('2024-11-01'),
    holidayType: 'Festival',
    applicability: {
      country: 'India',
      locations: ['All']
    },
    settings: {
      isPaid: true,
      isOptional: false,
      isRecurring: true,
      recurrencePattern: 'Lunar'
    },
    year: 2024,
    status: 'Active'
  },
  {
    id: 'HOL003',
    holidayName: 'Ganesh Chaturthi',
    holidayDate: new Date('2024-09-07'),
    holidayType: 'Regional',
    applicability: {
      country: 'India',
      state: 'Maharashtra',
      locations: ['Mumbai Office', 'Pune Office']
    },
    settings: {
      isPaid: true,
      isOptional: true,
      isRecurring: true,
      recurrencePattern: 'Lunar'
    },
    year: 2024,
    status: 'Active'
  }
];
```

---

### 6. Leave Type Master
**File**: `src/components/hr-masters/LeaveTypeMaster.tsx`

**Interface**:
```typescript
interface LeaveType {
  id: string;
  leaveCode: string;
  leaveName: string;
  leaveCategory: 'Paid' | 'Unpaid' | 'Compensatory' | 'Medical';

  entitlement: {
    annualEntitlement: number;
    proRataApplicable: boolean;
    accrualType: 'Monthly' | 'Quarterly' | 'Yearly' | 'At Joining';
    monthlyAccrual?: number;
  };

  rules: {
    minDaysPerRequest: number;
    maxDaysPerRequest: number;
    maxConsecutiveDays?: number;
    advanceNoticeDays: number;
    requiresApproval: boolean;
    approvalLevels: number;
    documentRequired: boolean;
    documentRequiredAfterDays?: number;
  };

  carryForward: {
    allowed: boolean;
    maxCarryForwardDays?: number;
    expiryMonths?: number;
    encashmentAllowed?: boolean;
  };

  applicability: {
    employeeTypes: string[];
    grades: string[];
    minServiceMonths?: number;
  };

  calculations: {
    includeWeekends: boolean;
  includeHolidays: boolean;
    halfDayAllowed: boolean;
    sandwichRuleApplicable: boolean;
  };

  statistics: {
    totalAvailed: number;
    avgDaysPerEmployee: number;
    pendingRequests: number;
  };

  status: 'Active' | 'Inactive';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockLeaveTypes = [
  {
    id: 'LT001',
    leaveCode: 'CL',
    leaveName: 'Casual Leave',
    leaveCategory: 'Paid',
    entitlement: {
      annualEntitlement: 12,
      proRataApplicable: true,
      accrualType: 'Monthly',
      monthlyAccrual: 1
    },
    rules: {
      minDaysPerRequest: 0.5,
      maxDaysPerRequest: 3,
      maxConsecutiveDays: 3,
      advanceNoticeDays: 1,
      requiresApproval: true,
      approvalLevels: 1,
      documentRequired: false
    },
    carryForward: {
      allowed: false
    },
    applicability: {
      employeeTypes: ['Permanent', 'Contract'],
      grades: ['All'],
      minServiceMonths: 3
    },
    calculations: {
      includeWeekends: false,
      includeHolidays: false,
      halfDayAllowed: true,
      sandwichRuleApplicable: true
    },
    statistics: {
      totalAvailed: 1245,
      avgDaysPerEmployee: 8.5,
      pendingRequests: 25
    },
    status: 'Active'
  },
  {
    id: 'LT002',
    leaveCode: 'EL',
    leaveName: 'Earned Leave',
    leaveCategory: 'Paid',
    entitlement: {
      annualEntitlement: 18,
      proRataApplicable: true,
      accrualType: 'Monthly',
      monthlyAccrual: 1.5
    },
    rules: {
      minDaysPerRequest: 1,
      maxDaysPerRequest: 15,
      advanceNoticeDays: 7,
      requiresApproval: true,
      approvalLevels: 2,
      documentRequired: false
    },
    carryForward: {
      allowed: true,
      maxCarryForwardDays: 30,
      expiryMonths: 12,
      encashmentAllowed: true
    },
    applicability: {
      employeeTypes: ['Permanent'],
      grades: ['All'],
      minServiceMonths: 12
    },
    calculations: {
      includeWeekends: false,
      includeHolidays: false,
      halfDayAllowed: false,
      sandwichRuleApplicable: false
    },
    statistics: {
      totalAvailed: 2850,
      avgDaysPerEmployee: 12.3,
      pendingRequests: 42
    },
    status: 'Active'
  }
];
```

---

### 7. Allowance Master
**File**: `src/components/hr-masters/AllowanceMaster.tsx`

**Interface**:
```typescript
interface Allowance {
  id: string;
  allowanceCode: string;
  allowanceName: string;
  allowanceType: 'Fixed' | 'Variable' | 'Percentage' | 'Reimbursement';

  calculation: {
    calculationType: 'Fixed Amount' | 'Percentage of Basic' | 'Percentage of Gross' | 'Formula';
    fixedAmount?: number;
    percentage?: number;
    formula?: string;
    minAmount?: number;
    maxAmount?: number;
  };

  taxation: {
    isTaxable: boolean;
    taxExemptUpTo?: number;
    taxCategory?: string;
  };

  applicability: {
    employeeTypes: string[];
    grades: string[];
    departments?: string[];
    locations?: string[];
  };

  payroll: {
    includeInGross: boolean;
    includeInCTC: boolean;
    paymentFrequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'On Claim';
    effectiveFrom?: Date;
    effectiveTo?: Date;
  };

  documentation: {
    requiresProof: boolean;
    proofDocuments?: string[];
    approvalRequired: boolean;
  };

  statistics: {
    totalEmployees: number;
    totalAmount: number;
    avgPerEmployee: number;
  };

  status: 'Active' | 'Inactive';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockAllowances = [
  {
    id: 'ALW001',
    allowanceCode: 'HRA',
    allowanceName: 'House Rent Allowance',
    allowanceType: 'Percentage',
    calculation: {
      calculationType: 'Percentage of Basic',
      percentage: 50,
      maxAmount: 50000
    },
    taxation: {
      isTaxable: true,
      taxExemptUpTo: 25000,
      taxCategory: 'HRA Exemption'
    },
    applicability: {
      employeeTypes: ['Permanent', 'Contract'],
      grades: ['All']
    },
    payroll: {
      includeInGross: true,
      includeInCTC: true,
      paymentFrequency: 'Monthly'
    },
    documentation: {
      requiresProof: true,
      proofDocuments: ['Rent Agreement', 'Rent Receipts'],
      approvalRequired: false
    },
    statistics: {
      totalEmployees: 450,
      totalAmount: 18750000,
      avgPerEmployee: 41667
    },
    status: 'Active'
  },
  {
    id: 'ALW002',
    allowanceCode: 'TA',
    allowanceName: 'Transport Allowance',
    allowanceType: 'Fixed',
    calculation: {
      calculationType: 'Fixed Amount',
      fixedAmount: 3000
    },
    taxation: {
      isTaxable: true,
      taxExemptUpTo: 1600
    },
    applicability: {
      employeeTypes: ['Permanent'],
      grades: ['All']
    },
    payroll: {
      includeInGross: true,
      includeInCTC: true,
      paymentFrequency: 'Monthly'
    },
    documentation: {
      requiresProof: false,
      approvalRequired: false
    },
    statistics: {
      totalEmployees: 420,
      totalAmount: 1260000,
      avgPerEmployee: 3000
    },
    status: 'Active'
  }
];
```

---

### 8. Deduction Master
**File**: `src/components/hr-masters/DeductionMaster.tsx`

**Interface**:
```typescript
interface Deduction {
  id: string;
  deductionCode: string;
  deductionName: string;
  deductionType: 'Statutory' | 'Voluntary' | 'Recovery' | 'Advance' | 'Loan';

  calculation: {
    calculationType: 'Fixed Amount' | 'Percentage of Basic' | 'Percentage of Gross' | 'Formula';
    fixedAmount?: number;
    percentage?: number;
    formula?: string;
    employeeContribution?: number;
    employerContribution?: number;
  };

  statutory: {
    isStatutory: boolean;
    statutoryType?: 'PF' | 'ESI' | 'PT' | 'TDS' | 'LWF';
    governmentId?: string;
    registrationNumber?: string;
  };

  limits: {
    minAmount?: number;
    maxAmount?: number;
    cappingAmount?: number;
  };

  applicability: {
    employeeTypes: string[];
    grades?: string[];
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    mandatory: boolean;
  };

  payroll: {
    deductionFrequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-Time';
    effectiveFrom?: Date;
    effectiveTo?: Date;
    priority: number;
  };

  recovery: {
    isRecovery: boolean;
    installments?: number;
    interestRate?: number;
  };

  statistics: {
    totalEmployees: number;
    totalAmount: number;
    avgPerEmployee: number;
  };

  status: 'Active' | 'Inactive';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data**:
```typescript
const mockDeductions = [
  {
    id: 'DED001',
    deductionCode: 'PF',
    deductionName: 'Provident Fund',
    deductionType: 'Statutory',
    calculation: {
      calculationType: 'Percentage of Basic',
      percentage: 12,
      employeeContribution: 12,
      employerContribution: 12
    },
    statutory: {
      isStatutory: true,
      statutoryType: 'PF',
      registrationNumber: 'MHMUM1234567890'
    },
    limits: {
      cappingAmount: 15000
    },
    applicability: {
      employeeTypes: ['Permanent'],
      mandatory: true
    },
    payroll: {
      deductionFrequency: 'Monthly',
      priority: 1
    },
    recovery: {
      isRecovery: false
    },
    statistics: {
      totalEmployees: 420,
      totalAmount: 5040000,
      avgPerEmployee: 12000
    },
    status: 'Active'
  },
  {
    id: 'DED002',
    deductionCode: 'PT',
    deductionName: 'Professional Tax',
    deductionType: 'Statutory',
    calculation: {
      calculationType: 'Fixed Amount',
      fixedAmount: 200
    },
    statutory: {
      isStatutory: true,
      statutoryType: 'PT'
    },
    applicability: {
      employeeTypes: ['Permanent', 'Contract'],
      salaryRangeMin: 10000,
      mandatory: true
    },
    payroll: {
      deductionFrequency: 'Monthly',
      priority: 2
    },
    recovery: {
      isRecovery: false
    },
    statistics: {
      totalEmployees: 450,
      totalAmount: 90000,
      avgPerEmployee: 200
    },
    status: 'Active'
  }
];
```

---

## Implementation Guidelines

### Common UI Patterns

**Table Headers Template**:
```typescript
<thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Column Name
    </th>
  </tr>
</thead>
```

**Modal Tabs Template**:
```typescript
<div className="flex border-b border-gray-200">
  {['tab1', 'tab2', 'tab3'].map((tab) => (
    <button
      key={tab}
      onClick={() => setCurrentTab(tab)}
      className={`px-4 py-2 font-medium capitalize ${
        currentTab === tab
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

---

## Color Scheme

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow/Amber (#F59E0B)
- **Danger**: Red (#EF4444)
- **Info**: Purple (#8B5CF6)
- **Neutral**: Gray (#6B7280)

---

## Icons Reference (lucide-react)

- **HR**: Users, User, UserCheck, UserPlus
- **Time**: Calendar, Clock, Timer
- **Money**: DollarSign, CreditCard, TrendingUp
- **Documents**: FileText, File, Shield
- **Status**: CheckCircle2, XCircle, AlertCircle, AlertTriangle
- **Actions**: Edit2, Trash2, Eye, Plus, Download, Upload

---

## Testing Checklist

- [ ] All CRUD operations working
- [ ] Search and filters functional
- [ ] Modal forms with proper validation
- [ ] Status badges display correctly
- [ ] Statistics cards showing accurate data
- [ ] Responsive design on all screens
- [ ] Export/Import buttons (UI only)
- [ ] Proper TypeScript typing
- [ ] Mock data realistic and comprehensive

