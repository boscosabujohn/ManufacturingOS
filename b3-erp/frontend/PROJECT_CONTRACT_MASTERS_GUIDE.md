# Project & Contract Masters - Complete Implementation Guide

## 9. Project & Contract Masters

### 1. Project Type Master
**File**: `src/components/project-masters/ProjectTypeMaster.tsx`

**Interface**:
```typescript
interface ProjectType {
  id: string;
  projectTypeCode: string;
  projectTypeName: string;
  category: 'Internal' | 'External' | 'R&D' | 'Maintenance' | 'Infrastructure';

  characteristics: {
    duration: {
      typicalDurationMin: number;
      typicalDurationMax: number;
      unit: 'Days' | 'Weeks' | 'Months' | 'Years';
    };
    budgetRange: {
      minBudget?: number;
      maxBudget?: number;
      currency: string;
    };
    complexity: 'Low' | 'Medium' | 'High' | 'Critical';
  };

  deliverables: {
    standardDeliverables: string[];
    requiresDocumentation: boolean;
    requiresTesting: boolean;
    requiresDeployment: boolean;
  };

  resources: {
    typicalTeamSize: number;
    requiredSkills: string[];
    requiredRoles: string[];
  };

  workflow: {
    defaultWorkflowId?: string;
    defaultWorkflow?: string;
    requiresApproval: boolean;
    approvalLevels: number;
    milestoneTemplateId?: string;
  };

  financial: {
    billingType: 'Fixed Price' | 'Time & Material' | 'Milestone Based' | 'Retainer';
    paymentTerms: string;
    advancePercentage?: number;
  };

  statistics: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    avgSuccessRate: number;
    avgProfitMargin: number;
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
const mockProjectTypes = [
  {
    id: 'PT001',
    projectTypeCode: 'SW-DEV',
    projectTypeName: 'Software Development',
    category: 'External',
    characteristics: {
      duration: {
        typicalDurationMin: 2,
        typicalDurationMax: 12,
        unit: 'Months'
      },
      budgetRange: {
        minBudget: 500000,
        maxBudget: 10000000,
        currency: 'INR'
      },
      complexity: 'High'
    },
    deliverables: {
      standardDeliverables: [
        'Requirement Specification',
        'Design Documents',
        'Source Code',
        'Test Cases',
        'Deployment Guide',
        'User Manual'
      ],
      requiresDocumentation: true,
      requiresTesting: true,
      requiresDeployment: true
    },
    resources: {
      typicalTeamSize: 8,
      requiredSkills: ['Full Stack Development', 'Testing', 'DevOps', 'UI/UX'],
      requiredRoles: ['Project Manager', 'Tech Lead', 'Developers', 'QA Engineers']
    },
    workflow: {
      defaultWorkflow: 'Agile - Scrum',
      requiresApproval: true,
      approvalLevels: 2
    },
    financial: {
      billingType: 'Time & Material',
      paymentTerms: 'Net 30',
      advancePercentage: 20
    },
    statistics: {
      totalProjects: 45,
      activeProjects: 12,
      completedProjects: 33,
      avgSuccessRate: 87.5,
      avgProfitMargin: 22.3
    },
    status: 'Active'
  },
  {
    id: 'PT002',
    projectTypeCode: 'ERP-IMPL',
    projectTypeName: 'ERP Implementation',
    category: 'External',
    characteristics: {
      duration: {
        typicalDurationMin: 6,
        typicalDurationMax: 18,
        unit: 'Months'
      },
      budgetRange: {
        minBudget: 2000000,
        maxBudget: 50000000,
        currency: 'INR'
      },
      complexity: 'Critical'
    },
    deliverables: {
      standardDeliverables: [
        'Business Process Mapping',
        'System Configuration',
        'Data Migration',
        'User Training',
        'Go-Live Support',
        'Post Go-Live Support'
      ],
      requiresDocumentation: true,
      requiresTesting: true,
      requiresDeployment: true
    },
    resources: {
      typicalTeamSize: 15,
      requiredSkills: ['ERP Consulting', 'Change Management', 'Training', 'Data Migration'],
      requiredRoles: ['Program Manager', 'Functional Consultants', 'Technical Consultants', 'Trainers']
    },
    workflow: {
      defaultWorkflow: 'Waterfall',
      requiresApproval: true,
      approvalLevels: 3
    },
    financial: {
      billingType: 'Milestone Based',
      paymentTerms: 'As per milestones',
      advancePercentage: 30
    },
    statistics: {
      totalProjects: 12,
      activeProjects: 5,
      completedProjects: 7,
      avgSuccessRate: 92.0,
      avgProfitMargin: 28.5
    },
    status: 'Active'
  }
];
```

---

### 2. Project Status Master
**File**: `src/components/project-masters/ProjectStatusMaster.tsx`

**Interface**:
```typescript
interface ProjectStatus {
  id: string;
  statusCode: string;
  statusName: string;
  category: 'Planning' | 'Execution' | 'Monitoring' | 'Closure' | 'OnHold' | 'Cancelled';

  stage: {
    stageOrder: number;
    isInitialStatus: boolean;
    isFinalStatus: boolean;
    allowedNextStatuses: string[];
    allowedPreviousStatuses: string[];
  };

  characteristics: {
    healthIndicator: 'Green' | 'Yellow' | 'Red' | 'Blue' | 'Gray';
    requiresAction: boolean;
    isBlocker: boolean;
    autoProgressionAllowed: boolean;
  };

  triggers: {
    entryConditions: string[];
    exitConditions: string[];
    notifications: {
      notifyProjectManager: boolean;
      notifyTeam: boolean;
      notifyClient: boolean;
      notifyStakeholders: boolean;
    };
  };

  workflow: {
    requiresApproval: boolean;
    approvers: string[];
    escalationDays?: number;
  };

  reporting: {
    includeInDashboard: boolean;
    reportingCategory: string;
    kpiImpact: 'Positive' | 'Neutral' | 'Negative';
  };

  statistics: {
    totalProjects: number;
    avgDurationInStatus: number;
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
const mockProjectStatuses = [
  {
    id: 'PS001',
    statusCode: 'INITIATED',
    statusName: 'Initiated',
    category: 'Planning',
    stage: {
      stageOrder: 1,
      isInitialStatus: true,
      isFinalStatus: false,
      allowedNextStatuses: ['PS002', 'PS010'],
      allowedPreviousStatuses: []
    },
    characteristics: {
      healthIndicator: 'Blue',
      requiresAction: true,
      isBlocker: false,
      autoProgressionAllowed: false
    },
    triggers: {
      entryConditions: ['Project created'],
      exitConditions: ['Project plan approved'],
      notifications: {
        notifyProjectManager: true,
        notifyTeam: false,
        notifyClient: false,
        notifyStakeholders: false
      }
    },
    workflow: {
      requiresApproval: true,
      approvers: ['PMO Head', 'Sponsor']
    },
    reporting: {
      includeInDashboard: true,
      reportingCategory: 'Pipeline',
      kpiImpact: 'Neutral'
    },
    statistics: {
      totalProjects: 25,
      avgDurationInStatus: 7
    },
    status: 'Active'
  },
  {
    id: 'PS002',
    statusCode: 'IN_PROGRESS',
    statusName: 'In Progress',
    category: 'Execution',
    stage: {
      stageOrder: 2,
      isInitialStatus: false,
      isFinalStatus: false,
      allowedNextStatuses: ['PS003', 'PS007', 'PS009'],
      allowedPreviousStatuses: ['PS001']
    },
    characteristics: {
      healthIndicator: 'Green',
      requiresAction: false,
      isBlocker: false,
      autoProgressionAllowed: false
    },
    triggers: {
      entryConditions: ['Project plan approved', 'Resources allocated'],
      exitConditions: ['All deliverables completed'],
      notifications: {
        notifyProjectManager: true,
        notifyTeam: true,
        notifyClient: true,
        notifyStakeholders: true
      }
    },
    workflow: {
      requiresApproval: false,
      approvers: []
    },
    reporting: {
      includeInDashboard: true,
      reportingCategory: 'Active',
      kpiImpact: 'Positive'
    },
    statistics: {
      totalProjects: 42,
      avgDurationInStatus: 90
    },
    status: 'Active'
  }
];
```

---

### 3. Contract Type Master
**File**: `src/components/project-masters/ContractTypeMaster.tsx`

**Interface**:
```typescript
interface ContractType {
  id: string;
  contractTypeCode: string;
  contractTypeName: string;
  category: 'Service' | 'Product' | 'Maintenance' | 'Consulting' | 'Licensing' | 'Partnership';

  terms: {
    durationBased: boolean;
    typicalDuration?: number;
    durationUnit?: 'Months' | 'Years';
    autoRenewal: boolean;
    renewalNoticeDays?: number;
  };

  financial: {
    pricingModel: 'Fixed' | 'Variable' | 'Hybrid' | 'Subscription' | 'Usage Based';
    paymentStructure: 'Upfront' | 'Milestone' | 'Periodic' | 'On Completion';
    advancePayment: boolean;
    advancePercentage?: number;
    retentionPercentage?: number;
  };

  legal: {
    requiresNDA: boolean;
    requiresSLA: boolean;
    penaltyClause: boolean;
    disputeResolution: string;
    governingLaw: string;
    jurisdiction: string;
  };

  deliverables: {
    deliverableTypes: string[];
    acceptanceCriteria: string[];
    warrantyPeriod?: number;
    supportPeriod?: number;
  };

  compliance: {
    requiresApproval: boolean;
    approvalAuthority: string[];
    legalReviewRequired: boolean;
    financialReviewRequired: boolean;
  };

  templates: {
    contractTemplateId?: string;
    clauseLibraryIds: string[];
  };

  statistics: {
    totalContracts: number;
    activeContracts: number;
    totalValue: number;
    avgContractValue: number;
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
const mockContractTypes = [
  {
    id: 'CT001',
    contractTypeCode: 'AMC',
    contractTypeName: 'Annual Maintenance Contract',
    category: 'Maintenance',
    terms: {
      durationBased: true,
      typicalDuration: 12,
      durationUnit: 'Months',
      autoRenewal: true,
      renewalNoticeDays: 30
    },
    financial: {
      pricingModel: 'Subscription',
      paymentStructure: 'Periodic',
      advancePayment: true,
      advancePercentage: 100,
      retentionPercentage: 0
    },
    legal: {
      requiresNDA: false,
      requiresSLA: true,
      penaltyClause: true,
      disputeResolution: 'Arbitration',
      governingLaw: 'Indian Contract Act',
      jurisdiction: 'Mumbai'
    },
    deliverables: {
      deliverableTypes: ['Preventive Maintenance', 'Breakdown Support', 'Spare Parts'],
      acceptanceCriteria: ['Uptime > 99%', 'Response time < 4 hours'],
      warrantyPeriod: 12,
      supportPeriod: 12
    },
    compliance: {
      requiresApproval: true,
      approvalAuthority: ['Sales Head', 'Finance Manager'],
      legalReviewRequired: true,
      financialReviewRequired: true
    },
    templates: {
      clauseLibraryIds: ['CL001', 'CL002', 'CL003']
    },
    statistics: {
      totalContracts: 125,
      activeContracts: 98,
      totalValue: 12500000,
      avgContractValue: 127551
    },
    status: 'Active'
  }
];
```

---

### 4. Milestone Master
**File**: `src/components/project-masters/MilestoneMaster.tsx`

**Interface**:
```typescript
interface Milestone {
  id: string;
  milestoneCode: string;
  milestoneName: string;
  projectTypeId?: string;
  projectType?: string;

  sequence: {
    sequenceOrder: number;
    isFirstMilestone: boolean;
    isLastMilestone: boolean;
    dependsOn: string[];
  };

  deliverables: {
    deliverableItems: string[];
    acceptanceCriteria: string[];
    requiresClientApproval: boolean;
    requiresInternalReview: boolean;
  };

  timeline: {
    plannedDuration: number;
    durationUnit: 'Days' | 'Weeks' | 'Months';
    bufferDays: number;
    criticalPath: boolean;
  };

  financial: {
    paymentPercentage?: number;
    invoiceTrigger: 'On Start' | 'On Completion' | 'On Approval' | 'Manual';
    retentionPercentage?: number;
  };

  quality: {
    qualityChecks: string[];
    testingRequired: boolean;
    documentationRequired: boolean;
  };

  notifications: {
    notifyOnStart: boolean;
    notifyOnCompletion: boolean;
    notifyOnDelay: boolean;
    escalationDays: number;
  };

  statistics: {
    avgCompletionDays: number;
    onTimeCompletionRate: number;
    totalOccurrences: number;
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

---

### 5. Task Category Master
**File**: `src/components/project-masters/TaskCategoryMaster.tsx`

**Interface**:
```typescript
interface TaskCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategoryId?: string;
  level: number;

  classification: {
    taskType: 'Development' | 'Testing' | 'Documentation' | 'Deployment' | 'Support' | 'Management';
    complexity: 'Simple' | 'Medium' | 'Complex';
    skillLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Expert';
  };

  estimation: {
    standardEffortHours: number;
    minEffortHours: number;
    maxEffortHours: number;
    varianceFactor: number;
  };

  resources: {
    requiredSkills: string[];
    preferredRoles: string[];
    minTeamSize: number;
    maxTeamSize: number;
  };

  workflow: {
    defaultWorkflow?: string;
    requiresReview: boolean;
    requiresApproval: boolean;
    reviewers: string[];
  };

  tracking: {
    timeTrackingRequired: boolean;
    progressMeasurement: 'Percentage' | 'Hours' | 'Story Points' | 'Binary';
    qualityMetrics: string[];
  };

  statistics: {
    totalTasks: number;
    completedTasks: number;
    avgCompletionTime: number;
    avgEffortVariance: number;
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

---

### 6. Resource Master
**File**: `src/components/project-masters/ResourceMaster.tsx`

**Interface**:
```typescript
interface Resource {
  id: string;
  resourceCode: string;
  resourceName: string;
  resourceType: 'Human' | 'Equipment' | 'Material' | 'Service' | 'Facility';

  // For Human Resources
  human?: {
    employeeId?: string;
    skills: string[];
    certifications: string[];
    experienceYears: number;
    costPerHour: number;
    availabilityPercentage: number;
  };

  // For Equipment
  equipment?: {
    equipmentId?: string;
    model: string;
    capacity: string;
    costPerHour: number;
    maintenanceSchedule: string;
  };

  allocation: {
    isAllocatable: boolean;
    maxAllocationPercentage: number;
    currentAllocation: number;
    availableCapacity: number;
  };

  costing: {
    costType: 'Hourly' | 'Daily' | 'Fixed' | 'Unit Based';
    standardRate: number;
    overtimeRate?: number;
    currency: string;
  };

  availability: {
    availableFrom: Date;
    availableTo?: Date;
    workingHours: string;
    holidays: string[];
  };

  performance: {
    utilizationRate: number;
    efficiency: number;
    qualityRating: number;
  };

  statistics: {
    totalProjects: number;
    activeProjects: number;
    totalHoursLogged: number;
    avgProjectRating: number;
  };

  status: 'Available' | 'Allocated' | 'On Leave' | 'Unavailable';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

---

### 7. Client Master
**File**: `src/components/project-masters/ClientMaster.tsx`

**Interface**:
```typescript
interface Client {
  id: string;
  clientCode: string;
  clientName: string;
  clientType: 'Corporate' | 'SME' | 'Government' | 'Individual' | 'Non-Profit';

  company: {
    legalName: string;
    industry: string;
    companySize: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
    website?: string;
    establishedYear?: number;
  };

  contact: {
    primaryContact: {
      name: string;
      designation: string;
      email: string;
      phone: string;
    };
    billingContact?: {
      name: string;
      email: string;
      phone: string;
    };
    technicalContact?: {
      name: string;
      email: string;
      phone: string;
    };
  };

  address: {
    registered: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pinCode: string;
      country: string;
    };
    billing?: {
      line1: string;
      city: string;
      state: string;
      pinCode: string;
    };
  };

  financial: {
    creditLimit: number;
    paymentTerms: string;
    currency: string;
    taxId: string;
    gstNumber?: string;
    panNumber?: string;
  };

  relationship: {
    clientSince: Date;
    accountManager: string;
    relationshipType: 'Strategic' | 'Key' | 'Standard' | 'Transactional';
    priority: 'High' | 'Medium' | 'Low';
  };

  performance: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    outstandingAmount: number;
    avgPaymentDays: number;
    satisfactionScore: number;
  };

  compliance: {
    ndaSigned: boolean;
    ndaExpiryDate?: Date;
    msaSigned: boolean;
    securityClearance?: string;
  };

  status: 'Active' | 'Inactive' | 'Blocked' | 'Prospect';

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
const mockClients = [
  {
    id: 'CLI001',
    clientCode: 'ACME-CORP',
    clientName: 'Acme Corporation',
    clientType: 'Corporate',
    company: {
      legalName: 'Acme Corporation Private Limited',
      industry: 'Manufacturing',
      companySize: 'Large',
      website: 'www.acmecorp.com',
      establishedYear: 1995
    },
    contact: {
      primaryContact: {
        name: 'John Smith',
        designation: 'VP - Technology',
        email: 'john.smith@acmecorp.com',
        phone: '+91-9876543210'
      },
      billingContact: {
        name: 'Jane Doe',
        email: 'accounts@acmecorp.com',
        phone: '+91-9876543211'
      }
    },
    address: {
      registered: {
        line1: '123, Industrial Area',
        line2: 'Phase 2',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
        country: 'India'
      }
    },
    financial: {
      creditLimit: 10000000,
      paymentTerms: 'Net 45',
      currency: 'INR',
      taxId: 'AAACA1234A',
      gstNumber: '27AAACA1234A1Z5',
      panNumber: 'AAACA1234A'
    },
    relationship: {
      clientSince: new Date('2018-03-15'),
      accountManager: 'Rajesh Kumar',
      relationshipType: 'Strategic',
      priority: 'High'
    },
    performance: {
      totalProjects: 28,
      activeProjects: 5,
      completedProjects: 23,
      totalRevenue: 45000000,
      outstandingAmount: 2500000,
      avgPaymentDays: 38,
      satisfactionScore: 4.5
    },
    compliance: {
      ndaSigned: true,
      ndaExpiryDate: new Date('2025-12-31'),
      msaSigned: true
    },
    status: 'Active'
  }
];
```

---

## Common Features Across All Masters

### Statistics Dashboard
All masters include 4 KPI cards showing:
- Total count
- Active/In-use count
- Financial metrics (where applicable)
- Performance metrics

### Search & Filter
- Full-text search across key fields
- Category/Type filters
- Status filters
- Date range filters (where applicable)

### Table View
- Sortable columns
- Pagination
- Action buttons (Edit, Delete, View)
- Status badges with color coding
- Type/Category badges

### Modal Forms
- Multi-tab forms for complex data
- Validation on required fields
- Auto-save drafts (optional)
- Cancel and Save buttons

### Import/Export
- Excel/CSV import
- Excel/CSV export
- PDF export for reports
- Bulk operations

---

## Implementation Priority

**Phase 1 (High Priority)**:
1. Client Master
2. Project Type Master
3. Project Status Master

**Phase 2 (Medium Priority)**:
4. Contract Type Master
5. Resource Master
6. Milestone Master

**Phase 3 (Low Priority)**:
7. Task Category Master

---

## Integration Points

### With Other Modules
- **Client Master** → Sales, Invoicing, CRM
- **Project Type** → Project Management, Resource Planning
- **Resource Master** → HR, Timesheet, Project Allocation
- **Contract Type** → Legal, Finance, Procurement
- **Milestone Master** → Project Tracking, Billing

### APIs Required
- GET /api/projects/types
- POST /api/projects/types
- PUT /api/projects/types/:id
- DELETE /api/projects/types/:id
(Similar for all other masters)

