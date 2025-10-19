# Compliance & Regulatory Masters - Implementation Guide

This guide provides complete TypeScript interfaces and implementation patterns for all 6 Compliance & Regulatory Master components in the Manufacturing ERP system.

## Table of Contents
1. [Regulatory Body Master](#1-regulatory-body-master)
2. [License Master](#2-license-master)
3. [Certificate Master](#3-certificate-master)
4. [Audit Master](#4-audit-master)
5. [Policy Master](#5-policy-master)
6. [SOP Master](#6-sop-master)

---

## 1. Regulatory Body Master

**Purpose**: Manage compliance authorities and regulatory organizations

### TypeScript Interface

```typescript
interface RegulatoryBody {
  id: string;
  bodyCode: string;
  bodyName: string;
  shortName: string;
  bodyType: 'Government' | 'Industry' | 'International' | 'Self-Regulatory' | 'Professional';
  jurisdiction: 'National' | 'State' | 'Regional' | 'International' | 'Local';
  category: 'Tax' | 'Labor' | 'Environment' | 'Safety' | 'Quality' | 'Financial' | 'Trade' | 'General';
  contact: {
    registeredAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
    };
    phone: string;
    email: string;
    website?: string;
    helplineNumber?: string;
    complaintsEmail?: string;
  };
  officialDetails: {
    headOfficerName?: string;
    headOfficerDesignation?: string;
    regionalOfficerName?: string;
    regionalOfficerDesignation?: string;
    inspectorName?: string;
    inspectorPhone?: string;
    inspectorEmail?: string;
  };
  compliance: {
    applicableToCompany: boolean;
    applicableToBranches?: string[];
    applicableToPlants?: string[];
    mandatoryCompliance: boolean;
    complianceFrequency?: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'On-Demand' | 'Event-Based';
    nextComplianceDate?: Date;
    returnFilingRequired: boolean;
    inspectionRequired: boolean;
    lastInspectionDate?: Date;
    nextInspectionDate?: Date;
  };
  regulations: {
    regulationCode: string;
    regulationName: string;
    applicableFrom: Date;
    description?: string;
    penaltyForNonCompliance?: string;
  }[];
  filings: {
    filingType: string;
    filingFrequency: string;
    dueDate: string; // Day of month or "Last Day" or "15th"
    lastFiledDate?: Date;
    nextDueDate?: Date;
    responsiblePerson?: string;
  }[];
  documents: {
    documentType: string;
    documentNumber?: string;
    issuedDate?: Date;
    expiryDate?: Date;
    renewalRequired: boolean;
    attachmentPath?: string;
  }[];
  penalties: {
    penaltyType: string;
    penaltyAmount?: number;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
  notifications: {
    notifyBeforeDays: number;
    notifyPersons: string[];
    emailAlerts: boolean;
    smsAlerts: boolean;
    escalationEnabled: boolean;
    escalationAfterDays?: number;
  };
  statistics: {
    totalCompliances: number;
    overdueCompliances: number;
    upcomingCompliances: number;
    totalPenalties: number;
    totalPenaltyAmount: number;
    complianceScore: number; // 0-100
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
  status: 'Active' | 'Inactive' | 'Under Review' | 'Discontinued';
}
```

### Mock Data

```typescript
const mockRegulatoryBodies: RegulatoryBody[] = [
  {
    id: '1',
    bodyCode: 'GST-IND',
    bodyName: 'Goods and Services Tax Network',
    shortName: 'GSTN',
    bodyType: 'Government',
    jurisdiction: 'National',
    category: 'Tax',
    contact: {
      registeredAddress: {
        addressLine1: 'GSTN Bhawan, Sector 29',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        pinCode: '122001'
      },
      phone: '+91-124-4688999',
      email: 'helpdesk@gst.gov.in',
      website: 'https://www.gst.gov.in',
      helplineNumber: '1800-103-4786'
    },
    officialDetails: {
      headOfficerName: 'GST Commissioner',
      regionalOfficerName: 'Regional GST Officer',
      inspectorName: 'GST Inspector - Delhi',
      inspectorPhone: '+91-11-12345678',
      inspectorEmail: 'inspector.delhi@gst.gov.in'
    },
    compliance: {
      applicableToCompany: true,
      applicableToBranches: ['BR-001', 'BR-002'],
      mandatoryCompliance: true,
      complianceFrequency: 'Monthly',
      nextComplianceDate: new Date('2024-03-10'),
      returnFilingRequired: true,
      inspectionRequired: true,
      lastInspectionDate: new Date('2023-11-15'),
      nextInspectionDate: new Date('2024-05-15')
    },
    regulations: [
      {
        regulationCode: 'CGST-ACT-2017',
        regulationName: 'Central Goods and Services Tax Act, 2017',
        applicableFrom: new Date('2017-07-01'),
        description: 'Central GST legislation',
        penaltyForNonCompliance: '100% of tax amount or ₹10,000 whichever is higher'
      },
      {
        regulationCode: 'SGST-ACT-2017',
        regulationName: 'State Goods and Services Tax Act, 2017',
        applicableFrom: new Date('2017-07-01'),
        description: 'State GST legislation'
      }
    ],
    filings: [
      {
        filingType: 'GSTR-1',
        filingFrequency: 'Monthly',
        dueDate: '10th',
        lastFiledDate: new Date('2024-02-09'),
        nextDueDate: new Date('2024-03-10'),
        responsiblePerson: 'Tax Manager'
      },
      {
        filingType: 'GSTR-3B',
        filingFrequency: 'Monthly',
        dueDate: '20th',
        lastFiledDate: new Date('2024-02-18'),
        nextDueDate: new Date('2024-03-20'),
        responsiblePerson: 'Tax Manager'
      }
    ],
    documents: [
      {
        documentType: 'GST Registration Certificate',
        documentNumber: '29ABCDE1234F1Z5',
        issuedDate: new Date('2017-07-01'),
        renewalRequired: false,
        attachmentPath: '/documents/gst-registration.pdf'
      }
    ],
    penalties: [
      {
        penaltyType: 'Late Filing',
        penaltyAmount: 100,
        description: '₹100 per day for GSTR-3B late filing',
        severity: 'Medium'
      },
      {
        penaltyType: 'Tax Evasion',
        description: '100% of tax evaded',
        severity: 'Critical'
      }
    ],
    notifications: {
      notifyBeforeDays: 5,
      notifyPersons: ['tax.manager@company.com', 'accounts@company.com'],
      emailAlerts: true,
      smsAlerts: true,
      escalationEnabled: true,
      escalationAfterDays: 2
    },
    statistics: {
      totalCompliances: 36,
      overdueCompliances: 0,
      upcomingCompliances: 2,
      totalPenalties: 0,
      totalPenaltyAmount: 0,
      complianceScore: 100
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-15'),
      updatedBy: 'tax.manager'
    },
    status: 'Active'
  },
  {
    id: '2',
    bodyCode: 'EPFO-IND',
    bodyName: 'Employees Provident Fund Organisation',
    shortName: 'EPFO',
    bodyType: 'Government',
    jurisdiction: 'National',
    category: 'Labor',
    contact: {
      registeredAddress: {
        addressLine1: 'Bhavishya Nidhi Bhawan, 14 Bhikaji Cama Place',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        pinCode: '110066'
      },
      phone: '+91-11-26172255',
      email: 'contactus@epfindia.gov.in',
      website: 'https://www.epfindia.gov.in',
      helplineNumber: '1800-118-005'
    },
    officialDetails: {
      headOfficerName: 'Central Provident Fund Commissioner',
      regionalOfficerName: 'Regional PF Commissioner - Delhi',
      inspectorName: 'PF Inspector',
      inspectorPhone: '+91-11-98765432',
      inspectorEmail: 'inspector.delhi@epfindia.gov.in'
    },
    compliance: {
      applicableToCompany: true,
      applicableToBranches: ['BR-001', 'BR-002', 'BR-003'],
      mandatoryCompliance: true,
      complianceFrequency: 'Monthly',
      nextComplianceDate: new Date('2024-03-15'),
      returnFilingRequired: true,
      inspectionRequired: true,
      lastInspectionDate: new Date('2023-09-20'),
      nextInspectionDate: new Date('2024-09-20')
    },
    regulations: [
      {
        regulationCode: 'EPF-ACT-1952',
        regulationName: 'Employees Provident Fund and Miscellaneous Provisions Act, 1952',
        applicableFrom: new Date('1952-03-04'),
        description: 'Provident fund and pension regulations',
        penaltyForNonCompliance: 'Imprisonment up to 3 years or fine up to ₹10,000'
      }
    ],
    filings: [
      {
        filingType: 'ECR (Electronic Challan cum Return)',
        filingFrequency: 'Monthly',
        dueDate: '15th',
        lastFiledDate: new Date('2024-02-14'),
        nextDueDate: new Date('2024-03-15'),
        responsiblePerson: 'HR Manager'
      }
    ],
    documents: [
      {
        documentType: 'PF Registration Certificate',
        documentNumber: 'DLCPM1234567000',
        issuedDate: new Date('2015-01-01'),
        renewalRequired: false,
        attachmentPath: '/documents/pf-registration.pdf'
      }
    ],
    penalties: [
      {
        penaltyType: 'Late Payment',
        penaltyAmount: 0,
        description: '12% interest on delayed contributions',
        severity: 'High'
      }
    ],
    notifications: {
      notifyBeforeDays: 7,
      notifyPersons: ['hr.manager@company.com', 'payroll@company.com'],
      emailAlerts: true,
      smsAlerts: false,
      escalationEnabled: true,
      escalationAfterDays: 3
    },
    statistics: {
      totalCompliances: 36,
      overdueCompliances: 0,
      upcomingCompliances: 1,
      totalPenalties: 0,
      totalPenaltyAmount: 0,
      complianceScore: 100
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-10'),
      updatedBy: 'hr.manager'
    },
    status: 'Active'
  },
  {
    id: '3',
    bodyCode: 'ISO-INT',
    bodyName: 'International Organization for Standardization',
    shortName: 'ISO',
    bodyType: 'International',
    jurisdiction: 'International',
    category: 'Quality',
    contact: {
      registeredAddress: {
        addressLine1: 'Chemin de Blandonnet 8',
        city: 'Vernier',
        state: 'Geneva',
        country: 'Switzerland',
        pinCode: '1214'
      },
      phone: '+41-22-749-0111',
      email: 'central@iso.org',
      website: 'https://www.iso.org'
    },
    officialDetails: {
      headOfficerName: 'ISO Secretary-General',
      regionalOfficerName: 'ISO India Representative'
    },
    compliance: {
      applicableToCompany: true,
      applicableToPlants: ['PLANT-001', 'PLANT-002'],
      mandatoryCompliance: false,
      complianceFrequency: 'Yearly',
      returnFilingRequired: false,
      inspectionRequired: true,
      lastInspectionDate: new Date('2023-06-15'),
      nextInspectionDate: new Date('2024-06-15')
    },
    regulations: [
      {
        regulationCode: 'ISO-9001:2015',
        regulationName: 'Quality Management Systems',
        applicableFrom: new Date('2015-09-15'),
        description: 'International standard for quality management systems'
      },
      {
        regulationCode: 'ISO-14001:2015',
        regulationName: 'Environmental Management Systems',
        applicableFrom: new Date('2015-09-15'),
        description: 'International standard for environmental management'
      }
    ],
    filings: [],
    documents: [
      {
        documentType: 'ISO 9001:2015 Certificate',
        documentNumber: 'ISO9001-2023-1234',
        issuedDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-14'),
        renewalRequired: true,
        attachmentPath: '/documents/iso9001-cert.pdf'
      },
      {
        documentType: 'ISO 14001:2015 Certificate',
        documentNumber: 'ISO14001-2023-1234',
        issuedDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-14'),
        renewalRequired: true,
        attachmentPath: '/documents/iso14001-cert.pdf'
      }
    ],
    penalties: [],
    notifications: {
      notifyBeforeDays: 90,
      notifyPersons: ['quality.manager@company.com', 'plant.manager@company.com'],
      emailAlerts: true,
      smsAlerts: false,
      escalationEnabled: false
    },
    statistics: {
      totalCompliances: 2,
      overdueCompliances: 0,
      upcomingCompliances: 0,
      totalPenalties: 0,
      totalPenaltyAmount: 0,
      complianceScore: 100
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-15'),
      updatedBy: 'quality.manager'
    },
    status: 'Active'
  }
];
```

---

## 2. License Master

**Purpose**: Manage business licenses and permits

### TypeScript Interface

```typescript
interface License {
  id: string;
  licenseCode: string;
  licenseName: string;
  licenseType: 'Business' | 'Professional' | 'Trade' | 'Manufacturing' | 'Import-Export' | 'Environment' | 'Safety' | 'Other';
  category: 'Government' | 'Municipal' | 'Industry' | 'Professional Body' | 'Other';
  regulatoryBody: string;
  regulatoryBodyName: string;
  scope: {
    applicableEntity: 'Company' | 'Branch' | 'Plant' | 'Individual';
    entityCode?: string;
    entityName?: string;
    businessActivity: string;
    geographicScope: 'National' | 'State' | 'Regional' | 'Local';
    restrictions?: string;
  };
  licenseDetails: {
    licenseNumber: string;
    issuedDate: Date;
    effectiveDate: Date;
    expiryDate?: Date;
    validityPeriod?: string; // "Lifetime", "5 Years", etc.
    isPerpetual: boolean;
    renewalRequired: boolean;
    renewalFrequency?: 'Yearly' | 'Bi-Yearly' | '3-Yearly' | '5-Yearly' | 'On-Expiry';
    autoRenewal: boolean;
  };
  issuingAuthority: {
    authorityName: string;
    authorityType: string;
    officerName?: string;
    officerDesignation?: string;
    officeAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
    };
    contactPhone: string;
    contactEmail: string;
  };
  fees: {
    applicationFee: number;
    licenseFee: number;
    renewalFee: number;
    lateFee?: number;
    inspectionFee?: number;
    currency: string;
    paymentMode?: 'Online' | 'Offline' | 'Both';
  };
  renewal: {
    nextRenewalDate?: Date;
    renewalNotificationDays: number;
    renewalApplicationDate?: Date;
    renewalStatus?: 'Not Due' | 'Due Soon' | 'Applied' | 'Approved' | 'Rejected' | 'Overdue';
    lastRenewalDate?: Date;
    renewalHistory: {
      renewalDate: Date;
      renewedUpto: Date;
      amountPaid: number;
      receiptNumber?: string;
    }[];
  };
  compliance: {
    inspectionRequired: boolean;
    inspectionFrequency?: 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Bi-Yearly' | 'On-Demand';
    lastInspectionDate?: Date;
    nextInspectionDate?: Date;
    inspectionStatus?: 'Scheduled' | 'Completed' | 'Pending' | 'Not Required';
    complianceReportRequired: boolean;
    reportingFrequency?: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
    lastReportDate?: Date;
    nextReportDueDate?: Date;
  };
  conditions: {
    conditionType: string;
    conditionDescription: string;
    isMandatory: boolean;
    complianceStatus: 'Complied' | 'Pending' | 'Not Complied' | 'Not Applicable';
    verificationDate?: Date;
  }[];
  documents: {
    documentType: string;
    documentName: string;
    uploadedDate?: Date;
    expiryDate?: Date;
    attachmentPath?: string;
    isRequired: boolean;
  }[];
  responsiblePersons: {
    role: 'License Holder' | 'Manager' | 'Coordinator' | 'Approver';
    personName: string;
    designation: string;
    department?: string;
    email: string;
    phone: string;
  }[];
  alerts: {
    expiryAlert: boolean;
    expiryAlertDays: number;
    renewalAlert: boolean;
    renewalAlertDays: number;
    inspectionAlert: boolean;
    inspectionAlertDays: number;
    notificationEmails: string[];
    escalationEnabled: boolean;
    escalationDays?: number;
    escalationTo?: string[];
  };
  penalties: {
    penaltyType: string;
    penaltyAmount?: number;
    penaltyDate?: Date;
    reason: string;
    paidDate?: Date;
    receiptNumber?: string;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    notes?: string;
  };
  status: 'Active' | 'Expired' | 'Suspended' | 'Cancelled' | 'Under Renewal' | 'Applied';
}
```

### Mock Data

```typescript
const mockLicenses: License[] = [
  {
    id: '1',
    licenseCode: 'LIC-FACTORY-001',
    licenseName: 'Factory License',
    licenseType: 'Manufacturing',
    category: 'Government',
    regulatoryBody: 'LABOR-DEPT',
    regulatoryBodyName: 'State Labor Department',
    scope: {
      applicableEntity: 'Plant',
      entityCode: 'PLANT-001',
      entityName: 'Manufacturing Plant - Gurgaon',
      businessActivity: 'Manufacturing of Electronic Components',
      geographicScope: 'State',
      restrictions: 'Maximum 500 workers, No hazardous chemicals'
    },
    licenseDetails: {
      licenseNumber: 'FL/HR/GGN/2020/1234',
      issuedDate: new Date('2020-01-15'),
      effectiveDate: new Date('2020-01-15'),
      expiryDate: new Date('2025-01-14'),
      validityPeriod: '5 Years',
      isPerpetual: false,
      renewalRequired: true,
      renewalFrequency: '5-Yearly',
      autoRenewal: false
    },
    issuingAuthority: {
      authorityName: 'Office of Chief Inspector of Factories',
      authorityType: 'State Government',
      officerName: 'Mr. Rajesh Kumar',
      officerDesignation: 'Deputy Chief Inspector',
      officeAddress: {
        addressLine1: 'Labor Department, Sector 5',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        pinCode: '122001'
      },
      contactPhone: '+91-124-2345678',
      contactEmail: 'factories.ggn@labor.gov.in'
    },
    fees: {
      applicationFee: 5000,
      licenseFee: 25000,
      renewalFee: 20000,
      lateFee: 100,
      inspectionFee: 2000,
      currency: 'INR',
      paymentMode: 'Both'
    },
    renewal: {
      nextRenewalDate: new Date('2024-10-15'),
      renewalNotificationDays: 90,
      renewalStatus: 'Due Soon',
      lastRenewalDate: new Date('2020-01-15'),
      renewalHistory: [
        {
          renewalDate: new Date('2020-01-15'),
          renewedUpto: new Date('2025-01-14'),
          amountPaid: 25000,
          receiptNumber: 'REC/2020/1234'
        }
      ]
    },
    compliance: {
      inspectionRequired: true,
      inspectionFrequency: 'Yearly',
      lastInspectionDate: new Date('2023-11-20'),
      nextInspectionDate: new Date('2024-11-20'),
      inspectionStatus: 'Completed',
      complianceReportRequired: true,
      reportingFrequency: 'Yearly',
      lastReportDate: new Date('2024-01-31'),
      nextReportDueDate: new Date('2025-01-31')
    },
    conditions: [
      {
        conditionType: 'Safety Equipment',
        conditionDescription: 'Fire extinguishers must be installed as per norms',
        isMandatory: true,
        complianceStatus: 'Complied',
        verificationDate: new Date('2023-11-20')
      },
      {
        conditionType: 'Worker Safety',
        conditionDescription: 'Personal protective equipment to be provided to all workers',
        isMandatory: true,
        complianceStatus: 'Complied',
        verificationDate: new Date('2023-11-20')
      },
      {
        conditionType: 'Working Hours',
        conditionDescription: 'Maximum 9 hours per day, 48 hours per week',
        isMandatory: true,
        complianceStatus: 'Complied',
        verificationDate: new Date('2024-02-01')
      }
    ],
    documents: [
      {
        documentType: 'Factory License Certificate',
        documentName: 'Factory License 2020-2025',
        uploadedDate: new Date('2020-01-20'),
        expiryDate: new Date('2025-01-14'),
        attachmentPath: '/documents/factory-license.pdf',
        isRequired: true
      },
      {
        documentType: 'Fire Safety Certificate',
        documentName: 'Fire NOC',
        uploadedDate: new Date('2023-06-15'),
        expiryDate: new Date('2024-06-14'),
        attachmentPath: '/documents/fire-noc.pdf',
        isRequired: true
      },
      {
        documentType: 'Building Plan Approval',
        documentName: 'Approved Building Plan',
        uploadedDate: new Date('2019-11-01'),
        attachmentPath: '/documents/building-plan.pdf',
        isRequired: true
      }
    ],
    responsiblePersons: [
      {
        role: 'License Holder',
        personName: 'Mr. Amit Sharma',
        designation: 'Plant Manager',
        department: 'Operations',
        email: 'amit.sharma@company.com',
        phone: '+91-98765-43210'
      },
      {
        role: 'Coordinator',
        personName: 'Ms. Priya Singh',
        designation: 'Compliance Officer',
        department: 'Legal & Compliance',
        email: 'priya.singh@company.com',
        phone: '+91-98765-43211'
      }
    ],
    alerts: {
      expiryAlert: true,
      expiryAlertDays: 90,
      renewalAlert: true,
      renewalAlertDays: 120,
      inspectionAlert: true,
      inspectionAlertDays: 30,
      notificationEmails: ['compliance@company.com', 'plant.manager@company.com'],
      escalationEnabled: true,
      escalationDays: 60,
      escalationTo: ['coo@company.com']
    },
    penalties: [],
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-10'),
      updatedBy: 'compliance.officer',
      notes: 'Renewal process to be initiated by October 2024'
    },
    status: 'Active'
  },
  {
    id: '2',
    licenseCode: 'LIC-TRADE-001',
    licenseName: 'Trade License',
    licenseType: 'Business',
    category: 'Municipal',
    regulatoryBody: 'MCG',
    regulatoryBodyName: 'Municipal Corporation of Gurgaon',
    scope: {
      applicableEntity: 'Branch',
      entityCode: 'BR-001',
      entityName: 'Head Office - Gurgaon',
      businessActivity: 'Trading and Manufacturing Operations',
      geographicScope: 'Local'
    },
    licenseDetails: {
      licenseNumber: 'TL/MCG/2023/5678',
      issuedDate: new Date('2023-04-01'),
      effectiveDate: new Date('2023-04-01'),
      expiryDate: new Date('2024-03-31'),
      validityPeriod: '1 Year',
      isPerpetual: false,
      renewalRequired: true,
      renewalFrequency: 'Yearly',
      autoRenewal: false
    },
    issuingAuthority: {
      authorityName: 'Municipal Corporation of Gurgaon',
      authorityType: 'Local Government',
      officerName: 'Mr. Suresh Yadav',
      officerDesignation: 'Licensing Officer',
      officeAddress: {
        addressLine1: 'MCG Office, Civil Lines',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        pinCode: '122001'
      },
      contactPhone: '+91-124-2234567',
      contactEmail: 'licensing@mcg.gov.in'
    },
    fees: {
      applicationFee: 500,
      licenseFee: 10000,
      renewalFee: 10000,
      lateFee: 50,
      currency: 'INR',
      paymentMode: 'Both'
    },
    renewal: {
      nextRenewalDate: new Date('2024-02-28'),
      renewalNotificationDays: 30,
      renewalApplicationDate: new Date('2024-02-15'),
      renewalStatus: 'Applied',
      lastRenewalDate: new Date('2023-04-01'),
      renewalHistory: [
        {
          renewalDate: new Date('2023-04-01'),
          renewedUpto: new Date('2024-03-31'),
          amountPaid: 10000,
          receiptNumber: 'MCG/2023/5678'
        }
      ]
    },
    compliance: {
      inspectionRequired: false,
      complianceReportRequired: false
    },
    conditions: [
      {
        conditionType: 'Business Hours',
        conditionDescription: 'Business operations between 6 AM to 10 PM only',
        isMandatory: true,
        complianceStatus: 'Complied'
      },
      {
        conditionType: 'Sanitation',
        conditionDescription: 'Maintain cleanliness in and around premises',
        isMandatory: true,
        complianceStatus: 'Complied'
      }
    ],
    documents: [
      {
        documentType: 'Trade License Certificate',
        documentName: 'Trade License 2023-24',
        uploadedDate: new Date('2023-04-05'),
        expiryDate: new Date('2024-03-31'),
        attachmentPath: '/documents/trade-license.pdf',
        isRequired: true
      },
      {
        documentType: 'Property Tax Receipt',
        documentName: 'Property Tax Paid Receipt',
        uploadedDate: new Date('2023-03-15'),
        attachmentPath: '/documents/property-tax.pdf',
        isRequired: true
      }
    ],
    responsiblePersons: [
      {
        role: 'License Holder',
        personName: 'Mr. Vikram Malhotra',
        designation: 'Branch Manager',
        department: 'Administration',
        email: 'vikram.malhotra@company.com',
        phone: '+91-98765-43212'
      }
    ],
    alerts: {
      expiryAlert: true,
      expiryAlertDays: 30,
      renewalAlert: true,
      renewalAlertDays: 45,
      inspectionAlert: false,
      inspectionAlertDays: 0,
      notificationEmails: ['admin@company.com', 'branch.manager@company.com'],
      escalationEnabled: false
    },
    penalties: [],
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-15'),
      updatedBy: 'branch.manager',
      notes: 'Renewal application submitted on 15-Feb-2024'
    },
    status: 'Under Renewal'
  }
];
```

---

## 3. Certificate Master

**Purpose**: Manage quality, safety, and compliance certifications

### TypeScript Interface

```typescript
interface Certificate {
  id: string;
  certificateCode: string;
  certificateName: string;
  certificateType: 'Quality' | 'Safety' | 'Environment' | 'Security' | 'Product' | 'System' | 'Professional' | 'Other';
  standard: string; // e.g., "ISO 9001:2015", "CE", "UL", etc.
  issuingBody: string;
  issuingBodyName: string;
  scope: {
    applicableEntity: 'Company' | 'Plant' | 'Product' | 'Process' | 'Person';
    entityCode?: string;
    entityName?: string;
    scopeDescription: string;
    inclusions?: string[];
    exclusions?: string[];
    geographicCoverage: 'Global' | 'Regional' | 'National' | 'Local';
  };
  certificateDetails: {
    certificateNumber: string;
    issueDate: Date;
    effectiveDate: Date;
    expiryDate?: Date;
    validityPeriod: string; // "3 Years", "Lifetime", etc.
    isPerpetual: boolean;
    version?: string;
  };
  certificationBody: {
    bodyName: string;
    accreditationNumber?: string;
    accreditedBy?: string; // e.g., "UKAS", "NABCB", etc.
    auditorName?: string;
    auditorId?: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    address: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
    };
  };
  surveillance: {
    surveillanceRequired: boolean;
    surveillanceFrequency?: 'Half-Yearly' | 'Yearly' | 'Bi-Yearly';
    lastAuditDate?: Date;
    lastAuditType?: 'Initial' | 'Surveillance' | 'Re-certification' | 'Special';
    lastAuditResult?: 'Approved' | 'Approved with Observations' | 'Rejected';
    nextAuditDate?: Date;
    nextAuditType?: 'Surveillance' | 'Re-certification';
    observations?: {
      observationType: 'Major NCR' | 'Minor NCR' | 'Observation' | 'OFI';
      description: string;
      closureDate?: Date;
      status: 'Open' | 'Closed' | 'In Progress';
    }[];
  };
  recertification: {
    recertificationRequired: boolean;
    recertificationDueDate?: Date;
    recertificationNotificationDays: number;
    recertificationStatus?: 'Not Due' | 'Due Soon' | 'Applied' | 'Audit Scheduled' | 'Audit Completed' | 'Approved' | 'Rejected';
    recertificationHistory: {
      recertificationDate: Date;
      certificateNumber: string;
      validUpto: Date;
      auditorName: string;
      result: string;
    }[];
  };
  costs: {
    initialCertificationCost: number;
    surveillanceAuditCost?: number;
    recertificationCost?: number;
    consultancyCost?: number;
    trainingCost?: number;
    totalCostIncurred: number;
    currency: string;
  };
  documents: {
    documentType: string;
    documentName: string;
    documentNumber?: string;
    uploadedDate?: Date;
    expiryDate?: Date;
    attachmentPath?: string;
    isRequired: boolean;
  }[];
  benefits: {
    benefit: string;
    category: 'Business' | 'Operational' | 'Market Access' | 'Compliance' | 'Other';
    description?: string;
  }[];
  responsiblePersons: {
    role: 'Certificate Holder' | 'Management Representative' | 'Auditor' | 'Coordinator';
    personName: string;
    designation: string;
    department?: string;
    email: string;
    phone: string;
  }[];
  alerts: {
    expiryAlert: boolean;
    expiryAlertDays: number;
    auditAlert: boolean;
    auditAlertDays: number;
    recertificationAlert: boolean;
    recertificationAlertDays: number;
    notificationEmails: string[];
    escalationEnabled: boolean;
    escalationDays?: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    notes?: string;
  };
  status: 'Active' | 'Expired' | 'Suspended' | 'Withdrawn' | 'Under Renewal';
}
```

### Mock Data

```typescript
const mockCertificates: Certificate[] = [
  {
    id: '1',
    certificateCode: 'CERT-ISO9001',
    certificateName: 'ISO 9001:2015 Quality Management System',
    certificateType: 'Quality',
    standard: 'ISO 9001:2015',
    issuingBody: 'ISO-INT',
    issuingBodyName: 'International Organization for Standardization',
    scope: {
      applicableEntity: 'Company',
      entityCode: 'COMP-001',
      entityName: 'Manufacturing Solutions Pvt Ltd',
      scopeDescription: 'Design, Development, and Manufacturing of Electronic Components',
      inclusions: [
        'Product Design',
        'Manufacturing',
        'Quality Control',
        'Customer Service'
      ],
      exclusions: ['Design of Software Products'],
      geographicCoverage: 'Global'
    },
    certificateDetails: {
      certificateNumber: 'ISO9001-IN-2023-1234',
      issueDate: new Date('2023-06-15'),
      effectiveDate: new Date('2023-06-15'),
      expiryDate: new Date('2026-06-14'),
      validityPeriod: '3 Years',
      isPerpetual: false,
      version: 'ISO 9001:2015'
    },
    certificationBody: {
      bodyName: 'Bureau Veritas Certification',
      accreditationNumber: 'UKAS-001',
      accreditedBy: 'UKAS (United Kingdom Accreditation Service)',
      auditorName: 'Mr. John Smith',
      auditorId: 'BV-AUD-1234',
      contactPerson: 'Ms. Sarah Johnson',
      contactEmail: 'certification@bureauveritas.com',
      contactPhone: '+91-124-4567890',
      address: {
        addressLine1: 'Bureau Veritas House, Sector 29',
        city: 'Gurgaon',
        state: 'Haryana',
        country: 'India',
        pinCode: '122001'
      }
    },
    surveillance: {
      surveillanceRequired: true,
      surveillanceFrequency: 'Yearly',
      lastAuditDate: new Date('2023-06-10'),
      lastAuditType: 'Initial',
      lastAuditResult: 'Approved with Observations',
      nextAuditDate: new Date('2024-06-10'),
      nextAuditType: 'Surveillance',
      observations: [
        {
          observationType: 'Minor NCR',
          description: 'Calibration records for some equipment not up to date',
          closureDate: new Date('2023-07-15'),
          status: 'Closed'
        },
        {
          observationType: 'OFI',
          description: 'Opportunity for improvement in document control process',
          status: 'In Progress'
        }
      ]
    },
    recertification: {
      recertificationRequired: true,
      recertificationDueDate: new Date('2026-03-15'),
      recertificationNotificationDays: 180,
      recertificationStatus: 'Not Due',
      recertificationHistory: []
    },
    costs: {
      initialCertificationCost: 250000,
      surveillanceAuditCost: 75000,
      recertificationCost: 200000,
      consultancyCost: 150000,
      trainingCost: 100000,
      totalCostIncurred: 500000,
      currency: 'INR'
    },
    documents: [
      {
        documentType: 'ISO 9001:2015 Certificate',
        documentName: 'ISO 9001 Certificate',
        documentNumber: 'ISO9001-IN-2023-1234',
        uploadedDate: new Date('2023-06-20'),
        expiryDate: new Date('2026-06-14'),
        attachmentPath: '/documents/iso9001-certificate.pdf',
        isRequired: true
      },
      {
        documentType: 'Audit Report',
        documentName: 'Initial Certification Audit Report',
        uploadedDate: new Date('2023-06-15'),
        attachmentPath: '/documents/iso9001-audit-report.pdf',
        isRequired: true
      },
      {
        documentType: 'Quality Manual',
        documentName: 'Quality Management System Manual',
        uploadedDate: new Date('2023-05-01'),
        attachmentPath: '/documents/quality-manual.pdf',
        isRequired: true
      }
    ],
    benefits: [
      {
        benefit: 'Global Recognition',
        category: 'Market Access',
        description: 'ISO 9001 is globally recognized and opens doors to international markets'
      },
      {
        benefit: 'Improved Customer Satisfaction',
        category: 'Business',
        description: 'Systematic approach to quality management improves customer satisfaction'
      },
      {
        benefit: 'Process Efficiency',
        category: 'Operational',
        description: 'Streamlined processes reduce waste and improve efficiency'
      },
      {
        benefit: 'Regulatory Compliance',
        category: 'Compliance',
        description: 'Helps meet regulatory and statutory requirements'
      }
    ],
    responsiblePersons: [
      {
        role: 'Management Representative',
        personName: 'Ms. Anjali Verma',
        designation: 'Quality Manager',
        department: 'Quality Assurance',
        email: 'anjali.verma@company.com',
        phone: '+91-98765-43220'
      },
      {
        role: 'Coordinator',
        personName: 'Mr. Rahul Gupta',
        designation: 'Quality Executive',
        department: 'Quality Assurance',
        email: 'rahul.gupta@company.com',
        phone: '+91-98765-43221'
      }
    ],
    alerts: {
      expiryAlert: true,
      expiryAlertDays: 180,
      auditAlert: true,
      auditAlertDays: 60,
      recertificationAlert: true,
      recertificationAlertDays: 180,
      notificationEmails: ['quality@company.com', 'management@company.com'],
      escalationEnabled: true,
      escalationDays: 90
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-10'),
      updatedBy: 'quality.manager',
      notes: 'Next surveillance audit scheduled for June 2024'
    },
    status: 'Active'
  },
  {
    id: '2',
    certificateCode: 'CERT-CE',
    certificateName: 'CE Marking Certification',
    certificateType: 'Product',
    standard: 'CE Marking (EU Directive 2014/35/EU)',
    issuingBody: 'TUV-CERT',
    issuingBodyName: 'TUV Rheinland',
    scope: {
      applicableEntity: 'Product',
      entityCode: 'PROD-ECU-100',
      entityName: 'Electronic Control Unit Model ECU-100',
      scopeDescription: 'CE Marking for Electronic Control Unit as per LVD and EMC Directives',
      inclusions: ['Low Voltage Directive', 'EMC Directive'],
      geographicCoverage: 'Regional'
    },
    certificateDetails: {
      certificateNumber: 'CE-TUV-2023-5678',
      issueDate: new Date('2023-08-20'),
      effectiveDate: new Date('2023-08-20'),
      validityPeriod: 'Lifetime (as long as product design unchanged)',
      isPerpetual: true
    },
    certificationBody: {
      bodyName: 'TUV Rheinland India Pvt Ltd',
      accreditationNumber: 'NB-0197',
      accreditedBy: 'European Commission',
      contactPerson: 'Mr. Michael Weber',
      contactEmail: 'ce.certification@tuv.com',
      contactPhone: '+91-80-4147-1000',
      address: {
        addressLine1: 'TUV Rheinland House',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560103'
      }
    },
    surveillance: {
      surveillanceRequired: false
    },
    recertification: {
      recertificationRequired: false,
      recertificationNotificationDays: 0,
      recertificationHistory: []
    },
    costs: {
      initialCertificationCost: 350000,
      consultancyCost: 100000,
      trainingCost: 50000,
      totalCostIncurred: 500000,
      currency: 'INR'
    },
    documents: [
      {
        documentType: 'CE Certificate',
        documentName: 'CE Marking Certificate',
        documentNumber: 'CE-TUV-2023-5678',
        uploadedDate: new Date('2023-08-25'),
        attachmentPath: '/documents/ce-certificate.pdf',
        isRequired: true
      },
      {
        documentType: 'Test Report',
        documentName: 'LVD and EMC Test Report',
        uploadedDate: new Date('2023-08-20'),
        attachmentPath: '/documents/ce-test-report.pdf',
        isRequired: true
      },
      {
        documentType: 'Declaration of Conformity',
        documentName: 'DoC for ECU-100',
        uploadedDate: new Date('2023-08-25'),
        attachmentPath: '/documents/doc-ecu100.pdf',
        isRequired: true
      }
    ],
    benefits: [
      {
        benefit: 'EU Market Access',
        category: 'Market Access',
        description: 'Mandatory for selling electronic products in European Union'
      },
      {
        benefit: 'Product Safety Assurance',
        category: 'Compliance',
        description: 'Confirms product meets EU safety, health, and environmental requirements'
      }
    ],
    responsiblePersons: [
      {
        role: 'Certificate Holder',
        personName: 'Mr. Karthik Reddy',
        designation: 'Product Manager',
        department: 'R&D',
        email: 'karthik.reddy@company.com',
        phone: '+91-98765-43222'
      }
    ],
    alerts: {
      expiryAlert: false,
      expiryAlertDays: 0,
      auditAlert: false,
      auditAlertDays: 0,
      recertificationAlert: false,
      recertificationAlertDays: 0,
      notificationEmails: ['rd@company.com'],
      escalationEnabled: false
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-15'),
      updatedBy: 'product.manager',
      notes: 'Valid as long as product design remains unchanged'
    },
    status: 'Active'
  }
];
```

---

## 4. Audit Master

**Purpose**: Manage internal and external audit schedules

### TypeScript Interface

```typescript
interface Audit {
  id: string;
  auditCode: string;
  auditName: string;
  auditType: 'Internal' | 'External' | 'Statutory' | 'Surveillance' | 'Certification' | 'Compliance' | 'Process' | 'Product' | 'Financial';
  auditCategory: 'Planned' | 'Unplanned' | 'Special' | 'Follow-up';
  standard?: string; // e.g., "ISO 9001:2015", "Internal SOPs", etc.
  scope: {
    auditScope: string;
    departments?: string[];
    processes?: string[];
    locations?: string[];
    inclusions?: string[];
    exclusions?: string[];
  };
  schedule: {
    plannedDate: Date;
    plannedStartTime?: string;
    plannedEndTime?: string;
    actualStartDate?: Date;
    actualEndDate?: Date;
    duration: number; // hours
    frequency?: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'One-time';
    nextAuditDate?: Date;
  };
  auditTeam: {
    leadAuditor: {
      name: string;
      organization: 'Internal' | 'External';
      qualification?: string;
      certificateNumber?: string;
      email: string;
      phone: string;
    };
    teamMembers: {
      name: string;
      role: 'Auditor' | 'Technical Expert' | 'Observer';
      organization: 'Internal' | 'External';
      email: string;
      phone: string;
    }[];
  };
  auditee: {
    department: string;
    responsiblePerson: string;
    designation: string;
    email: string;
    phone: string;
    participants?: {
      name: string;
      designation: string;
      email: string;
    }[];
  };
  checklist: {
    clauseNumber: string;
    requirement: string;
    evidence?: string;
    finding?: 'Conformity' | 'Minor NCR' | 'Major NCR' | 'Observation' | 'OFI' | 'Not Applicable';
    remarks?: string;
    attachments?: string[];
  }[];
  findings: {
    findingId: string;
    findingType: 'Major NCR' | 'Minor NCR' | 'Observation' | 'OFI' | 'Positive Finding';
    clauseReference: string;
    description: string;
    evidence?: string;
    recommendation?: string;
    raisedBy: string;
    raisedDate: Date;
    assignedTo: string;
    targetClosureDate: Date;
    actualClosureDate?: Date;
    correctiveAction?: string;
    rootCause?: string;
    preventiveAction?: string;
    verificationDate?: Date;
    verifiedBy?: string;
    status: 'Open' | 'In Progress' | 'Pending Verification' | 'Closed' | 'Overdue';
  }[];
  documents: {
    documentType: string;
    documentName: string;
    uploadedDate?: Date;
    uploadedBy?: string;
    attachmentPath?: string;
    isRequired: boolean;
  }[];
  reportDetails: {
    reportNumber?: string;
    reportDate?: Date;
    executiveSummary?: string;
    overallResult?: 'Approved' | 'Approved with Observations' | 'Not Approved' | 'Pending';
    majorNCRs: number;
    minorNCRs: number;
    observations: number;
    OFIs: number;
    positiveFindings: number;
    reportAttachment?: string;
  };
  followUp: {
    followUpRequired: boolean;
    followUpDate?: Date;
    followUpAuditor?: string;
    followUpStatus?: 'Scheduled' | 'Completed' | 'Not Required';
    followUpRemarks?: string;
  };
  costs: {
    auditFee: number;
    travelExpenses?: number;
    accommodation?: number;
    otherExpenses?: number;
    totalCost: number;
    currency: string;
  };
  notifications: {
    notifyBeforeDays: number;
    notifyPersons: string[];
    emailAlerts: boolean;
    reminderEnabled: boolean;
    reminderDays?: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    notes?: string;
  };
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Postponed';
}
```

### Mock Data

```typescript
const mockAudits: Audit[] = [
  {
    id: '1',
    auditCode: 'AUD-INT-Q1-2024',
    auditName: 'Q1 2024 Internal Quality Audit',
    auditType: 'Internal',
    auditCategory: 'Planned',
    standard: 'ISO 9001:2015',
    scope: {
      auditScope: 'Quality Management System - Production and Quality Departments',
      departments: ['Production', 'Quality Assurance', 'Warehouse'],
      processes: ['Manufacturing Process', 'Quality Control', 'Material Handling'],
      locations: ['PLANT-001'],
      inclusions: ['Clause 8 - Operation', 'Clause 9 - Performance Evaluation'],
      exclusions: ['Design and Development (Clause 8.3)']
    },
    schedule: {
      plannedDate: new Date('2024-03-15'),
      plannedStartTime: '09:00',
      plannedEndTime: '17:00',
      duration: 8,
      frequency: 'Quarterly',
      nextAuditDate: new Date('2024-06-15')
    },
    auditTeam: {
      leadAuditor: {
        name: 'Ms. Neha Kapoor',
        organization: 'Internal',
        qualification: 'ISO 9001:2015 Lead Auditor',
        certificateNumber: 'LA-QMS-1234',
        email: 'neha.kapoor@company.com',
        phone: '+91-98765-43230'
      },
      teamMembers: [
        {
          name: 'Mr. Sanjay Mehta',
          role: 'Auditor',
          organization: 'Internal',
          email: 'sanjay.mehta@company.com',
          phone: '+91-98765-43231'
        },
        {
          name: 'Ms. Priyanka Sharma',
          role: 'Auditor',
          organization: 'Internal',
          email: 'priyanka.sharma@company.com',
          phone: '+91-98765-43232'
        }
      ]
    },
    auditee: {
      department: 'Production',
      responsiblePerson: 'Mr. Rajesh Kumar',
      designation: 'Production Manager',
      email: 'rajesh.kumar@company.com',
      phone: '+91-98765-43233',
      participants: [
        {
          name: 'Mr. Amit Singh',
          designation: 'Production Supervisor',
          email: 'amit.singh@company.com'
        },
        {
          name: 'Ms. Kavita Rao',
          designation: 'Quality Inspector',
          email: 'kavita.rao@company.com'
        }
      ]
    },
    checklist: [
      {
        clauseNumber: '8.5.1',
        requirement: 'Control of production and service provision',
        evidence: 'Production logs, Work instructions observed',
        finding: 'Conformity',
        remarks: 'Production process well controlled'
      },
      {
        clauseNumber: '8.5.2',
        requirement: 'Identification and traceability',
        finding: 'Minor NCR',
        remarks: 'Some batch numbers not properly marked on finished goods'
      },
      {
        clauseNumber: '8.6',
        requirement: 'Release of products and services',
        evidence: 'Inspection records reviewed',
        finding: 'Conformity',
        remarks: 'Release process properly documented'
      }
    ],
    findings: [
      {
        findingId: 'NCR-2024-001',
        findingType: 'Minor NCR',
        clauseReference: '8.5.2',
        description: 'Batch identification labels missing on 3 out of 20 finished goods pallets observed in warehouse',
        evidence: 'Photos taken, Warehouse location A-15',
        recommendation: 'Ensure all finished goods pallets are properly labeled with batch numbers',
        raisedBy: 'Ms. Neha Kapoor',
        raisedDate: new Date('2024-03-15'),
        assignedTo: 'Mr. Rajesh Kumar',
        targetClosureDate: new Date('2024-03-30'),
        status: 'Open'
      },
      {
        findingId: 'OFI-2024-001',
        findingType: 'OFI',
        clauseReference: '9.1.1',
        description: 'Consider implementing digital monitoring for temperature and humidity in warehouse',
        recommendation: 'Upgrade to automated environmental monitoring system',
        raisedBy: 'Ms. Priyanka Sharma',
        raisedDate: new Date('2024-03-15'),
        assignedTo: 'Mr. Rajesh Kumar',
        targetClosureDate: new Date('2024-06-30'),
        status: 'In Progress'
      }
    ],
    documents: [
      {
        documentType: 'Audit Plan',
        documentName: 'Q1 2024 Internal Audit Plan',
        uploadedDate: new Date('2024-03-01'),
        uploadedBy: 'neha.kapoor',
        attachmentPath: '/documents/audit-plan-q1-2024.pdf',
        isRequired: true
      },
      {
        documentType: 'Audit Checklist',
        documentName: 'ISO 9001:2015 Audit Checklist',
        uploadedDate: new Date('2024-03-01'),
        attachmentPath: '/documents/audit-checklist.xlsx',
        isRequired: true
      }
    ],
    reportDetails: {
      reportNumber: 'AUD-REP-2024-001',
      reportDate: new Date('2024-03-20'),
      executiveSummary: 'Internal audit of Production and Quality departments conducted as per plan. Overall compliance with ISO 9001:2015 requirements observed. One minor NCR and one OFI raised.',
      overallResult: 'Approved with Observations',
      majorNCRs: 0,
      minorNCRs: 1,
      observations: 0,
      OFIs: 1,
      positiveFindings: 3,
      reportAttachment: '/documents/audit-report-q1-2024.pdf'
    },
    followUp: {
      followUpRequired: true,
      followUpDate: new Date('2024-04-15'),
      followUpAuditor: 'Ms. Neha Kapoor',
      followUpStatus: 'Scheduled',
      followUpRemarks: 'Follow-up to verify closure of NCR-2024-001'
    },
    costs: {
      auditFee: 0,
      otherExpenses: 5000,
      totalCost: 5000,
      currency: 'INR'
    },
    notifications: {
      notifyBeforeDays: 15,
      notifyPersons: ['rajesh.kumar@company.com', 'quality@company.com'],
      emailAlerts: true,
      reminderEnabled: true,
      reminderDays: 7
    },
    metadata: {
      createdAt: new Date('2024-02-15'),
      createdBy: 'neha.kapoor',
      updatedAt: new Date('2024-03-20'),
      updatedBy: 'neha.kapoor',
      notes: 'Overall good compliance, minor improvement areas identified'
    },
    status: 'Completed'
  },
  {
    id: '2',
    auditCode: 'AUD-EXT-ISO-2024',
    auditName: 'ISO 9001:2015 Surveillance Audit 2024',
    auditType: 'Surveillance',
    auditCategory: 'Planned',
    standard: 'ISO 9001:2015',
    scope: {
      auditScope: 'Full Quality Management System as per ISO 9001:2015',
      departments: ['All Departments'],
      processes: ['All QMS Processes'],
      locations: ['PLANT-001', 'Head Office'],
      inclusions: ['All clauses of ISO 9001:2015'],
      exclusions: []
    },
    schedule: {
      plannedDate: new Date('2024-06-10'),
      plannedStartTime: '09:00',
      plannedEndTime: '17:00',
      duration: 16,
      frequency: 'Yearly',
      nextAuditDate: new Date('2025-06-10')
    },
    auditTeam: {
      leadAuditor: {
        name: 'Mr. John Smith',
        organization: 'External',
        qualification: 'IRCA Certified QMS Lead Auditor',
        certificateNumber: 'IRCA-123456',
        email: 'john.smith@bureauveritas.com',
        phone: '+91-124-4567890'
      },
      teamMembers: [
        {
          name: 'Ms. Lisa Brown',
          role: 'Auditor',
          organization: 'External',
          email: 'lisa.brown@bureauveritas.com',
          phone: '+91-124-4567891'
        }
      ]
    },
    auditee: {
      department: 'All Departments',
      responsiblePerson: 'Ms. Anjali Verma',
      designation: 'Management Representative',
      email: 'anjali.verma@company.com',
      phone: '+91-98765-43220'
    },
    checklist: [],
    findings: [],
    documents: [
      {
        documentType: 'Audit Notification',
        documentName: 'Surveillance Audit Notification 2024',
        uploadedDate: new Date('2024-04-15'),
        attachmentPath: '/documents/audit-notification-2024.pdf',
        isRequired: true
      }
    ],
    reportDetails: {
      majorNCRs: 0,
      minorNCRs: 0,
      observations: 0,
      OFIs: 0,
      positiveFindings: 0
    },
    followUp: {
      followUpRequired: false
    },
    costs: {
      auditFee: 75000,
      travelExpenses: 10000,
      accommodation: 15000,
      totalCost: 100000,
      currency: 'INR'
    },
    notifications: {
      notifyBeforeDays: 60,
      notifyPersons: ['anjali.verma@company.com', 'management@company.com'],
      emailAlerts: true,
      reminderEnabled: true,
      reminderDays: 30
    },
    metadata: {
      createdAt: new Date('2024-04-15'),
      createdBy: 'admin',
      updatedAt: new Date('2024-04-15'),
      updatedBy: 'admin',
      notes: 'Annual surveillance audit by Bureau Veritas'
    },
    status: 'Scheduled'
  }
];
```

---

## 5. Policy Master

**Purpose**: Manage company policies and guidelines

### TypeScript Interface

```typescript
interface Policy {
  id: string;
  policyCode: string;
  policyName: string;
  policyType: 'HR' | 'IT' | 'Finance' | 'Quality' | 'Safety' | 'Environment' | 'Security' | 'Compliance' | 'Operational' | 'General';
  category: 'Mandatory' | 'Recommended' | 'Guideline' | 'Best Practice';
  scope: {
    applicability: 'Company-wide' | 'Department-specific' | 'Location-specific' | 'Role-specific';
    applicableDepartments?: string[];
    applicableLocations?: string[];
    applicableRoles?: string[];
    exemptions?: string[];
  };
  policyDetails: {
    objective: string;
    description: string;
    keyPoints: string[];
    definitions?: {
      term: string;
      definition: string;
    }[];
  };
  version: {
    versionNumber: string;
    effectiveDate: Date;
    expiryDate?: Date;
    isPerpetual: boolean;
    reviewFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Bi-Yearly' | 'As-Needed';
    nextReviewDate?: Date;
    lastReviewDate?: Date;
  };
  approval: {
    draftedBy: string;
    draftedDate: Date;
    reviewedBy?: string[];
    reviewedDate?: Date;
    approvedBy: string;
    approvedDate?: Date;
    approvalLevel: 'Department Head' | 'Director' | 'CEO' | 'Board';
  };
  content: {
    sections: {
      sectionNumber: string;
      sectionTitle: string;
      sectionContent: string;
      subsections?: {
        subsectionNumber: string;
        subsectionTitle: string;
        subsectionContent: string;
      }[];
    }[];
  };
  compliance: {
    complianceMandatory: boolean;
    acknowledgementRequired: boolean;
    trainingRequired: boolean;
    trainingModuleCode?: string;
    assessmentRequired: boolean;
    assessmentPassPercentage?: number;
  };
  violations: {
    violationType: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    consequences: string;
    disciplinaryAction?: string;
  }[];
  relatedDocuments: {
    documentType: 'SOP' | 'Form' | 'Checklist' | 'Policy' | 'Procedure' | 'Guideline' | 'Other';
    documentCode: string;
    documentName: string;
    relationship: 'Referenced' | 'Superseded' | 'Related' | 'Parent' | 'Child';
  }[];
  distribution: {
    distributionMode: 'Email' | 'Portal' | 'Notice Board' | 'Training Session' | 'All';
    distributionDate?: Date;
    acknowledgements: {
      employeeCode: string;
      employeeName: string;
      acknowledgedDate?: Date;
      status: 'Pending' | 'Acknowledged' | 'Not Required';
    }[];
  };
  revisionHistory: {
    versionNumber: string;
    revisionDate: Date;
    revisedBy: string;
    changesDescription: string;
    reasonForChange: string;
  }[];
  documents: {
    documentType: string;
    documentName: string;
    uploadedDate?: Date;
    attachmentPath?: string;
    isRequired: boolean;
  }[];
  metrics: {
    totalEmployeesApplicable: number;
    totalAcknowledgements: number;
    acknowledgementPercentage: number;
    violations: number;
    lastViolationDate?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    notes?: string;
  };
  status: 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Inactive' | 'Superseded' | 'Archived';
}
```

### Mock Data

```typescript
const mockPolicies: Policy[] = [
  {
    id: '1',
    policyCode: 'POL-HR-001',
    policyName: 'Leave Policy',
    policyType: 'HR',
    category: 'Mandatory',
    scope: {
      applicability: 'Company-wide',
      exemptions: ['Contract Employees', 'Interns']
    },
    policyDetails: {
      objective: 'To establish guidelines for leave entitlement, application, and approval process',
      description: 'This policy outlines the types of leaves available to employees, eligibility criteria, application procedures, and approval guidelines.',
      keyPoints: [
        'Employees are entitled to 24 days of paid leave per year',
        'Leave must be applied minimum 3 days in advance (except medical emergency)',
        'Maximum 15 consecutive days leave at a time (except special cases)',
        'Unused leave can be carried forward up to 15 days',
        'Leave encashment available as per rules'
      ],
      definitions: [
        {
          term: 'Casual Leave (CL)',
          definition: 'Leave for personal matters, maximum 12 days per year'
        },
        {
          term: 'Sick Leave (SL)',
          definition: 'Leave for medical reasons, maximum 12 days per year'
        },
        {
          term: 'Earned Leave (EL)',
          definition: 'Leave earned through service, accumulates annually'
        }
      ]
    },
    version: {
      versionNumber: '2.1',
      effectiveDate: new Date('2024-01-01'),
      isPerpetual: false,
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2025-01-01'),
      lastReviewDate: new Date('2024-01-01')
    },
    approval: {
      draftedBy: 'HR Department',
      draftedDate: new Date('2023-11-01'),
      reviewedBy: ['Legal Team', 'Finance Team'],
      reviewedDate: new Date('2023-11-15'),
      approvedBy: 'CEO',
      approvedDate: new Date('2023-12-01'),
      approvalLevel: 'CEO'
    },
    content: {
      sections: [
        {
          sectionNumber: '1',
          sectionTitle: 'Purpose',
          sectionContent: 'This policy establishes the framework for leave management to ensure business continuity while providing employees with adequate rest and personal time.'
        },
        {
          sectionNumber: '2',
          sectionTitle: 'Scope',
          sectionContent: 'This policy applies to all permanent employees. Contract employees and interns are covered under separate agreements.'
        },
        {
          sectionNumber: '3',
          sectionTitle: 'Types of Leave',
          sectionContent: 'The company provides the following types of leave:',
          subsections: [
            {
              subsectionNumber: '3.1',
              subsectionTitle: 'Casual Leave',
              subsectionContent: 'Employees are entitled to 12 days of casual leave per year for personal matters, family functions, etc.'
            },
            {
              subsectionNumber: '3.2',
              subsectionTitle: 'Sick Leave',
              subsectionContent: 'Employees are entitled to 12 days of sick leave per year. Medical certificate required for leave exceeding 3 consecutive days.'
            },
            {
              subsectionNumber: '3.3',
              subsectionTitle: 'Earned Leave',
              subsectionContent: 'Employees earn 1.5 days of earned leave per month, which can be accumulated and encashed.'
            }
          ]
        },
        {
          sectionNumber: '4',
          sectionTitle: 'Leave Application Process',
          sectionContent: 'All leave requests must be submitted through the HRMS portal minimum 3 days in advance, except in case of medical emergency.'
        },
        {
          sectionNumber: '5',
          sectionTitle: 'Leave Approval',
          sectionContent: 'Leave requests are approved by immediate supervisor. Leave exceeding 7 consecutive days requires additional approval from Department Head.'
        }
      ]
    },
    compliance: {
      complianceMandatory: true,
      acknowledgementRequired: true,
      trainingRequired: false,
      assessmentRequired: false
    },
    violations: [
      {
        violationType: 'Unauthorized Absence',
        severity: 'High',
        consequences: 'Marked as Leave Without Pay (LWP)',
        disciplinaryAction: 'Warning letter; repeated violations may lead to termination'
      },
      {
        violationType: 'Fake Medical Certificate',
        severity: 'Critical',
        consequences: 'Immediate termination',
        disciplinaryAction: 'Termination of employment'
      }
    ],
    relatedDocuments: [
      {
        documentType: 'Form',
        documentCode: 'FORM-HR-001',
        documentName: 'Leave Application Form',
        relationship: 'Referenced'
      },
      {
        documentType: 'SOP',
        documentCode: 'SOP-HR-002',
        documentName: 'Leave Approval Process',
        relationship: 'Referenced'
      }
    ],
    distribution: {
      distributionMode: 'All',
      distributionDate: new Date('2024-01-05'),
      acknowledgements: [
        {
          employeeCode: 'EMP-001',
          employeeName: 'John Doe',
          acknowledgedDate: new Date('2024-01-08'),
          status: 'Acknowledged'
        },
        {
          employeeCode: 'EMP-002',
          employeeName: 'Jane Smith',
          acknowledgedDate: new Date('2024-01-10'),
          status: 'Acknowledged'
        },
        {
          employeeCode: 'EMP-003',
          employeeName: 'Amit Kumar',
          status: 'Pending'
        }
      ]
    },
    revisionHistory: [
      {
        versionNumber: '2.0',
        revisionDate: new Date('2023-01-01'),
        revisedBy: 'HR Department',
        changesDescription: 'Increased casual leave from 10 to 12 days',
        reasonForChange: 'Employee welfare and market standards'
      },
      {
        versionNumber: '2.1',
        revisionDate: new Date('2024-01-01'),
        revisedBy: 'HR Department',
        changesDescription: 'Added provision for leave carry forward',
        reasonForChange: 'Employee request and retention strategy'
      }
    ],
    documents: [
      {
        documentType: 'Policy Document',
        documentName: 'Leave Policy v2.1',
        uploadedDate: new Date('2024-01-01'),
        attachmentPath: '/documents/leave-policy-v2.1.pdf',
        isRequired: true
      }
    ],
    metrics: {
      totalEmployeesApplicable: 250,
      totalAcknowledgements: 247,
      acknowledgementPercentage: 98.8,
      violations: 2,
      lastViolationDate: new Date('2024-01-15')
    },
    metadata: {
      createdAt: new Date('2023-11-01'),
      createdBy: 'hr.manager',
      updatedAt: new Date('2024-01-05'),
      updatedBy: 'hr.manager',
      notes: 'Updated version effective from 1st January 2024'
    },
    status: 'Active'
  },
  {
    id: '2',
    policyCode: 'POL-IT-001',
    policyName: 'Information Security Policy',
    policyType: 'IT',
    category: 'Mandatory',
    scope: {
      applicability: 'Company-wide',
      applicableDepartments: ['All Departments']
    },
    policyDetails: {
      objective: 'To protect company information assets and ensure confidentiality, integrity, and availability of data',
      description: 'This policy establishes requirements and guidelines for protecting company information systems, data, and infrastructure from unauthorized access, disclosure, modification, or destruction.',
      keyPoints: [
        'Strong passwords must be used and changed every 90 days',
        'No sharing of login credentials',
        'Email and internet usage monitored for security',
        'USB drives and external devices require approval',
        'Confidential data must not be shared externally without authorization',
        'Report security incidents immediately to IT department'
      ],
      definitions: [
        {
          term: 'Information Asset',
          definition: 'Any data, system, or resource that has value to the organization'
        },
        {
          term: 'Confidential Information',
          definition: 'Information that if disclosed could harm the organization or its stakeholders'
        },
        {
          term: 'Security Incident',
          definition: 'Any event that threatens confidentiality, integrity, or availability of information assets'
        }
      ]
    },
    version: {
      versionNumber: '1.5',
      effectiveDate: new Date('2023-07-01'),
      isPerpetual: false,
      reviewFrequency: 'Half-Yearly',
      nextReviewDate: new Date('2024-07-01'),
      lastReviewDate: new Date('2023-07-01')
    },
    approval: {
      draftedBy: 'IT Department',
      draftedDate: new Date('2023-05-01'),
      reviewedBy: ['Legal Team', 'Information Security Team'],
      reviewedDate: new Date('2023-05-20'),
      approvedBy: 'CTO',
      approvedDate: new Date('2023-06-15'),
      approvalLevel: 'Director'
    },
    content: {
      sections: [
        {
          sectionNumber: '1',
          sectionTitle: 'Purpose',
          sectionContent: 'To establish a framework for information security to protect company assets from threats and vulnerabilities.'
        },
        {
          sectionNumber: '2',
          sectionTitle: 'Password Policy',
          sectionContent: 'All users must create strong passwords with minimum 12 characters including uppercase, lowercase, numbers, and special characters. Passwords must be changed every 90 days.'
        },
        {
          sectionNumber: '3',
          sectionTitle: 'Access Control',
          sectionContent: 'Access to systems and data will be granted based on role and need-to-know basis. User access rights will be reviewed quarterly.'
        },
        {
          sectionNumber: '4',
          sectionTitle: 'Data Classification',
          sectionContent: 'All data must be classified as Public, Internal, Confidential, or Restricted and handled accordingly.'
        },
        {
          sectionNumber: '5',
          sectionTitle: 'Incident Reporting',
          sectionContent: 'All security incidents must be reported to IT department within 2 hours of detection.'
        }
      ]
    },
    compliance: {
      complianceMandatory: true,
      acknowledgementRequired: true,
      trainingRequired: true,
      trainingModuleCode: 'TRN-IT-SECURITY-001',
      assessmentRequired: true,
      assessmentPassPercentage: 80
    },
    violations: [
      {
        violationType: 'Password Sharing',
        severity: 'High',
        consequences: 'Account suspension and written warning',
        disciplinaryAction: 'First offense: Warning; Second offense: Suspension; Third offense: Termination'
      },
      {
        violationType: 'Data Breach',
        severity: 'Critical',
        consequences: 'Immediate termination and legal action',
        disciplinaryAction: 'Termination and potential legal prosecution'
      },
      {
        violationType: 'Unauthorized Software Installation',
        severity: 'Medium',
        consequences: 'Software removal and written warning',
        disciplinaryAction: 'Warning letter'
      }
    ],
    relatedDocuments: [
      {
        documentType: 'SOP',
        documentCode: 'SOP-IT-001',
        documentName: 'Password Management Procedure',
        relationship: 'Referenced'
      },
      {
        documentType: 'SOP',
        documentCode: 'SOP-IT-002',
        documentName: 'Incident Response Procedure',
        relationship: 'Referenced'
      },
      {
        documentType: 'Guideline',
        documentCode: 'GUIDE-IT-001',
        documentName: 'Data Classification Guidelines',
        relationship: 'Referenced'
      }
    ],
    distribution: {
      distributionMode: 'All',
      distributionDate: new Date('2023-07-05'),
      acknowledgements: []
    },
    revisionHistory: [
      {
        versionNumber: '1.0',
        revisionDate: new Date('2020-01-01'),
        revisedBy: 'IT Department',
        changesDescription: 'Initial version',
        reasonForChange: 'Policy establishment'
      },
      {
        versionNumber: '1.5',
        revisionDate: new Date('2023-07-01'),
        revisedBy: 'IT Department',
        changesDescription: 'Enhanced password requirements and added mandatory security training',
        reasonForChange: 'Industry best practices and recent security incidents'
      }
    ],
    documents: [
      {
        documentType: 'Policy Document',
        documentName: 'Information Security Policy v1.5',
        uploadedDate: new Date('2023-07-01'),
        attachmentPath: '/documents/info-security-policy-v1.5.pdf',
        isRequired: true
      }
    ],
    metrics: {
      totalEmployeesApplicable: 250,
      totalAcknowledgements: 245,
      acknowledgementPercentage: 98.0,
      violations: 5,
      lastViolationDate: new Date('2024-02-01')
    },
    metadata: {
      createdAt: new Date('2020-01-01'),
      createdBy: 'it.admin',
      updatedAt: new Date('2023-07-05'),
      updatedBy: 'it.manager',
      notes: 'Mandatory training completion required by all employees by 31-Aug-2023'
    },
    status: 'Active'
  }
];
```

---

## 6. SOP Master

**Purpose**: Manage Standard Operating Procedures

### TypeScript Interface

```typescript
interface SOP {
  id: string;
  sopCode: string;
  sopTitle: string;
  sopType: 'Process' | 'Technical' | 'Safety' | 'Quality' | 'Administrative' | 'Operational' | 'Maintenance';
  category: 'Critical' | 'Important' | 'Standard' | 'Reference';
  department: string;
  process: string;
  scope: {
    applicability: 'Company-wide' | 'Department-specific' | 'Location-specific' | 'Equipment-specific';
    applicableDepartments?: string[];
    applicableLocations?: string[];
    applicableEquipment?: string[];
  };
  sopDetails: {
    purpose: string;
    objectives: string[];
    applicableStandards?: string[]; // ISO, GMP, etc.
    prerequisites?: string[];
    safetyRequirements?: string[];
  };
  version: {
    versionNumber: string;
    effectiveDate: Date;
    expiryDate?: Date;
    reviewFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Bi-Yearly' | 'As-Needed';
    nextReviewDate?: Date;
    lastReviewDate?: Date;
  };
  approval: {
    preparedBy: string;
    preparedDate: Date;
    checkedBy?: string;
    checkedDate?: Date;
    approvedBy: string;
    approvedDate?: Date;
    approvalLevel: 'Supervisor' | 'Manager' | 'Department Head' | 'Director';
  };
  procedure: {
    steps: {
      stepNumber: string;
      stepTitle: string;
      stepDescription: string;
      responsibleRole: string;
      estimatedDuration?: string;
      tools?: string[];
      materials?: string[];
      safetyPrecautions?: string[];
      checkpoints?: string[];
      images?: string[];
    }[];
    flowchart?: string; // Path to flowchart image
  };
  resources: {
    personnel: {
      role: string;
      qualification?: string;
      trainingRequired: boolean;
    }[];
    equipment: string[];
    materials: string[];
    tools: string[];
    ppe?: string[]; // Personal Protective Equipment
  };
  references: {
    referenceType: 'Policy' | 'SOP' | 'Form' | 'Checklist' | 'Standard' | 'Manual' | 'Other';
    referenceCode: string;
    referenceName: string;
    relationship: 'Parent' | 'Related' | 'Supporting' | 'Referenced';
  }[];
  attachments: {
    attachmentType: 'Flowchart' | 'Checklist' | 'Form' | 'Image' | 'Video' | 'Document' | 'Other';
    attachmentName: string;
    uploadedDate?: Date;
    attachmentPath?: string;
    isRequired: boolean;
  }[];
  training: {
    trainingRequired: boolean;
    trainingModuleCode?: string;
    trainingDuration?: number; // hours
    certificationRequired: boolean;
    retrainingFrequency?: 'Yearly' | 'Bi-Yearly' | 'As-Needed';
    trainedPersonnel: {
      employeeCode: string;
      employeeName: string;
      trainingDate: Date;
      trainerName: string;
      assessmentScore?: number;
      certified: boolean;
      certificationDate?: Date;
      certificationExpiry?: Date;
    }[];
  };
  qualityControls: {
    controlPoint: string;
    acceptanceCriteria: string;
    measurementMethod: string;
    frequency: string;
    responsibleRole: string;
  }[];
  deviations: {
    deviationId: string;
    deviationDate: Date;
    reportedBy: string;
    deviationType: 'Process' | 'Material' | 'Equipment' | 'Personnel' | 'Other';
    description: string;
    impact: 'Low' | 'Medium' | 'High' | 'Critical';
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    closureDate?: Date;
    status: 'Open' | 'Under Investigation' | 'Closed';
  }[];
  revisionHistory: {
    versionNumber: string;
    revisionDate: Date;
    revisedBy: string;
    changesDescription: string;
    reasonForChange: string;
    sectionsAffected: string[];
  }[];
  metrics: {
    totalExecutions?: number;
    successRate?: number;
    averageCompletionTime?: number; // minutes
    deviationRate?: number;
    lastExecutionDate?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    keywords: string[];
    notes?: string;
  };
  status: 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Inactive' | 'Obsolete' | 'Superseded';
}
```

### Mock Data

```typescript
const mockSOPs: SOP[] = [
  {
    id: '1',
    sopCode: 'SOP-PROD-001',
    sopTitle: 'PCB Assembly Process',
    sopType: 'Process',
    category: 'Critical',
    department: 'Production',
    process: 'PCB Assembly',
    scope: {
      applicability: 'Location-specific',
      applicableLocations: ['PLANT-001'],
      applicableEquipment: ['SMT Line 1', 'SMT Line 2', 'Wave Soldering Machine']
    },
    sopDetails: {
      purpose: 'To ensure consistent and quality PCB assembly as per customer specifications and industry standards',
      objectives: [
        'Achieve zero defect assembly',
        'Maintain process consistency',
        'Ensure operator safety',
        'Comply with IPC-A-610 standards'
      ],
      applicableStandards: ['IPC-A-610 Class 3', 'IPC-7711/7721', 'ISO 9001:2015'],
      prerequisites: [
        'Operators must be trained and certified',
        'All equipment must be calibrated',
        'Materials must be verified and approved'
      ],
      safetyRequirements: [
        'Wear ESD wrist strap at all times',
        'Use safety glasses when handling components',
        'Follow electrical safety protocols',
        'Keep work area clean and organized'
      ]
    },
    version: {
      versionNumber: '3.2',
      effectiveDate: new Date('2024-01-15'),
      reviewFrequency: 'Yearly',
      nextReviewDate: new Date('2025-01-15'),
      lastReviewDate: new Date('2024-01-10')
    },
    approval: {
      preparedBy: 'Mr. Suresh Patel',
      preparedDate: new Date('2024-01-05'),
      checkedBy: 'Ms. Kavita Rao',
      checkedDate: new Date('2024-01-08'),
      approvedBy: 'Mr. Rajesh Kumar',
      approvedDate: new Date('2024-01-10'),
      approvalLevel: 'Department Head'
    },
    procedure: {
      steps: [
        {
          stepNumber: '1',
          stepTitle: 'Material Preparation',
          stepDescription: 'Verify all materials, components, and PCBs against BOM and job order. Check for damage, expiry, and quantity.',
          responsibleRole: 'Material Handler',
          estimatedDuration: '15 minutes',
          materials: ['PCB', 'Components as per BOM', 'Solder Paste', 'Flux'],
          tools: ['Material verification checklist'],
          checkpoints: [
            'All materials match BOM',
            'No visible damage',
            'Quantities correct',
            'Materials within shelf life'
          ]
        },
        {
          stepNumber: '2',
          stepTitle: 'Solder Paste Application',
          stepDescription: 'Apply solder paste on PCB using stencil printer. Ensure proper alignment and paste thickness.',
          responsibleRole: 'SMT Operator',
          estimatedDuration: '5 minutes per board',
          equipment: ['Stencil Printer', 'Solder Paste'],
          tools: ['Paste thickness gauge', 'Magnifying glass'],
          safetyPrecautions: ['Wear ESD protection', 'Handle paste as per MSDS'],
          checkpoints: [
            'Paste thickness 100-150 microns',
            'No bridging or insufficient paste',
            'Stencil alignment within tolerance',
            'Paste temperature 20-25°C'
          ]
        },
        {
          stepNumber: '3',
          stepTitle: 'Component Placement',
          stepDescription: 'Place components on PCB using pick and place machine. Verify component orientation and placement accuracy.',
          responsibleRole: 'SMT Operator',
          estimatedDuration: '10 minutes per board',
          equipment: ['Pick and Place Machine'],
          safetyPrecautions: ['Keep hands away from moving parts'],
          checkpoints: [
            'All components placed',
            'Component orientation correct',
            'Placement accuracy ±0.05mm',
            'No missing or wrong components'
          ]
        },
        {
          stepNumber: '4',
          stepTitle: 'Reflow Soldering',
          stepDescription: 'Pass PCB through reflow oven. Monitor and control temperature profile as per solder paste specifications.',
          responsibleRole: 'SMT Operator',
          estimatedDuration: '8 minutes',
          equipment: ['Reflow Oven'],
          safetyPrecautions: ['Do not touch hot surfaces', 'Ensure proper ventilation'],
          checkpoints: [
            'Temperature profile within specification',
            'Preheat: 150-180°C',
            'Peak: 240-260°C',
            'Cooling rate controlled'
          ]
        },
        {
          stepNumber: '5',
          stepTitle: 'Visual Inspection',
          stepDescription: 'Inspect solder joints and component placement using magnifying glass or AOI machine.',
          responsibleRole: 'Quality Inspector',
          estimatedDuration: '10 minutes per board',
          equipment: ['AOI Machine / Magnifying Glass'],
          checkpoints: [
            'Solder joints shiny and smooth',
            'No cold joints or bridges',
            'Component orientation correct',
            'No missing components'
          ]
        },
        {
          stepNumber: '6',
          stepTitle: 'Final Testing',
          stepDescription: 'Perform electrical testing (ICT/FCT) as per test specifications.',
          responsibleRole: 'Test Engineer',
          estimatedDuration: '15 minutes per board',
          equipment: ['ICT/FCT Equipment'],
          checkpoints: [
            'All tests passed',
            'Test results documented',
            'Board labeled with test status'
          ]
        }
      ],
      flowchart: '/documents/sop-prod-001-flowchart.pdf'
    },
    resources: {
      personnel: [
        {
          role: 'SMT Operator',
          qualification: 'ITI or Diploma in Electronics',
          trainingRequired: true
        },
        {
          role: 'Quality Inspector',
          qualification: 'Diploma in Quality Control',
          trainingRequired: true
        },
        {
          role: 'Test Engineer',
          qualification: 'B.Tech in Electronics',
          trainingRequired: true
        }
      ],
      equipment: ['Stencil Printer', 'Pick and Place Machine', 'Reflow Oven', 'AOI Machine', 'ICT/FCT Equipment'],
      materials: ['Solder Paste', 'Flux', 'Cleaning Solution', 'Labels'],
      tools: ['Paste thickness gauge', 'Magnifying glass', 'Tweezers', 'ESD mat'],
      ppe: ['ESD wrist strap', 'Safety glasses', 'Lab coat', 'ESD shoes']
    },
    references: [
      {
        referenceType: 'Standard',
        referenceCode: 'IPC-A-610',
        referenceName: 'Acceptability of Electronic Assemblies',
        relationship: 'Referenced'
      },
      {
        referenceType: 'Form',
        referenceCode: 'FORM-PROD-001',
        referenceName: 'Production Checklist',
        relationship: 'Supporting'
      },
      {
        referenceType: 'SOP',
        referenceCode: 'SOP-QC-001',
        referenceName: 'Visual Inspection Procedure',
        relationship: 'Related'
      }
    ],
    attachments: [
      {
        attachmentType: 'Flowchart',
        attachmentName: 'PCB Assembly Process Flowchart',
        uploadedDate: new Date('2024-01-15'),
        attachmentPath: '/documents/sop-prod-001-flowchart.pdf',
        isRequired: true
      },
      {
        attachmentType: 'Checklist',
        attachmentName: 'Quality Checklist',
        uploadedDate: new Date('2024-01-15'),
        attachmentPath: '/documents/quality-checklist.pdf',
        isRequired: true
      },
      {
        attachmentType: 'Image',
        attachmentName: 'Solder Joint Examples',
        uploadedDate: new Date('2024-01-15'),
        attachmentPath: '/images/solder-joints.jpg',
        isRequired: false
      }
    ],
    training: {
      trainingRequired: true,
      trainingModuleCode: 'TRN-PROD-PCB-001',
      trainingDuration: 8,
      certificationRequired: true,
      retrainingFrequency: 'Yearly',
      trainedPersonnel: [
        {
          employeeCode: 'EMP-101',
          employeeName: 'Mr. Ramesh Sharma',
          trainingDate: new Date('2024-01-20'),
          trainerName: 'Mr. Suresh Patel',
          assessmentScore: 95,
          certified: true,
          certificationDate: new Date('2024-01-20'),
          certificationExpiry: new Date('2025-01-20')
        },
        {
          employeeCode: 'EMP-102',
          employeeName: 'Ms. Priya Singh',
          trainingDate: new Date('2024-01-22'),
          trainerName: 'Mr. Suresh Patel',
          assessmentScore: 88,
          certified: true,
          certificationDate: new Date('2024-01-22'),
          certificationExpiry: new Date('2025-01-22')
        }
      ]
    },
    qualityControls: [
      {
        controlPoint: 'Solder Paste Application',
        acceptanceCriteria: 'Paste thickness 100-150 microns',
        measurementMethod: 'Paste thickness gauge',
        frequency: 'Every board',
        responsibleRole: 'SMT Operator'
      },
      {
        controlPoint: 'Reflow Temperature Profile',
        acceptanceCriteria: 'Peak temp 240-260°C, Time above liquidus 60-120 sec',
        measurementMethod: 'Temperature profiler',
        frequency: 'Once per shift',
        responsibleRole: 'SMT Operator'
      },
      {
        controlPoint: 'Solder Joint Quality',
        acceptanceCriteria: 'As per IPC-A-610 Class 3',
        measurementMethod: 'Visual inspection / AOI',
        frequency: 'Every board',
        responsibleRole: 'Quality Inspector'
      }
    ],
    deviations: [
      {
        deviationId: 'DEV-2024-001',
        deviationDate: new Date('2024-02-05'),
        reportedBy: 'Mr. Ramesh Sharma',
        deviationType: 'Equipment',
        description: 'Reflow oven temperature profile deviated by 5°C due to heating element issue',
        impact: 'Medium',
        rootCause: 'Heating element partial failure',
        correctiveAction: 'Heating element replaced, oven recalibrated',
        preventiveAction: 'Implement weekly oven performance check',
        closureDate: new Date('2024-02-06'),
        status: 'Closed'
      }
    ],
    revisionHistory: [
      {
        versionNumber: '3.0',
        revisionDate: new Date('2023-01-15'),
        revisedBy: 'Mr. Suresh Patel',
        changesDescription: 'Updated reflow temperature profile',
        reasonForChange: 'New solder paste specification',
        sectionsAffected: ['Step 4']
      },
      {
        versionNumber: '3.2',
        revisionDate: new Date('2024-01-15'),
        revisedBy: 'Mr. Suresh Patel',
        changesDescription: 'Added AOI inspection option, updated quality checkpoints',
        reasonForChange: 'New AOI equipment installed',
        sectionsAffected: ['Step 5', 'Quality Controls']
      }
    ],
    metrics: {
      totalExecutions: 1254,
      successRate: 99.2,
      averageCompletionTime: 65,
      deviationRate: 0.8,
      lastExecutionDate: new Date('2024-02-15')
    },
    metadata: {
      createdAt: new Date('2020-01-01'),
      createdBy: 'process.engineer',
      updatedAt: new Date('2024-01-15'),
      updatedBy: 'process.engineer',
      keywords: ['PCB', 'Assembly', 'SMT', 'Soldering', 'Electronics'],
      notes: 'Critical SOP - any deviation requires approval from Production Manager'
    },
    status: 'Active'
  }
];
```

---

## Common UI Patterns

All Compliance & Regulatory Masters follow these patterns:

### Statistics Cards (4 KPIs)

```typescript
// Regulatory Body Master
- Total Regulatory Bodies
- Active Compliances
- Overdue Compliances
- Compliance Score (Avg)

// License Master
- Total Licenses
- Active Licenses
- Due for Renewal (30 days)
- Expired Licenses

// Certificate Master
- Total Certificates
- Active Certificates
- Audits This Year
- Certificates Expiring (90 days)

// Audit Master
- Total Audits
- Completed Audits
- Pending Audits
- Open NCRs

// Policy Master
- Total Policies
- Active Policies
- Acknowledgement Rate (%)
- Policies Due for Review

// SOP Master
- Total SOPs
- Active SOPs
- SOPs Due for Review
- Trained Personnel (%)
```

### Color Scheme

```typescript
const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Expired: 'bg-red-100 text-red-800',
  'Under Renewal': 'bg-yellow-100 text-yellow-800',
  Suspended: 'bg-orange-100 text-orange-800',
  Cancelled: 'bg-red-100 text-red-800',
  Scheduled: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Draft: 'bg-gray-100 text-gray-800',
  Approved: 'bg-green-100 text-green-800',
  Obsolete: 'bg-red-100 text-red-800',
  Superseded: 'bg-purple-100 text-purple-800'
};

const severityColors = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800'
};

const complianceColors = {
  Complied: 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Not Complied': 'bg-red-100 text-red-800',
  'Not Applicable': 'bg-gray-100 text-gray-800'
};
```

### Common Lucide Icons

```typescript
import {
  Shield, FileText, Award, ClipboardCheck, FileCheck, Bookmark,
  Calendar, AlertTriangle, CheckCircle, XCircle, Clock, AlertCircle,
  Bell, Users, Building, MapPin, FileBarChart, TrendingUp,
  Search, Plus, Edit3, Eye, Download, Upload, Printer,
  Trash2, Copy, RefreshCw, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
```

---

## Implementation Notes

1. **Critical Dates**: Implement robust alert system for expiry, renewal, and compliance dates
2. **Document Management**: Integrate with document management system for attachments
3. **Workflow Integration**: Connect with approval workflow for policy and SOP approvals
4. **Training Integration**: Link with training module for compliance training
5. **Audit Trail**: Maintain complete history of all changes
6. **Reporting**: Generate compliance reports, audit reports, and metrics
7. **Notifications**: Automated email/SMS alerts for critical deadlines
8. **Dashboard**: Create compliance dashboard showing overall status
9. **Mobile Access**: Enable mobile access for field audits and inspections
10. **Integration**: Integrate with HR, Quality, and other modules

---

This completes the Compliance & Regulatory Masters implementation guide. All interfaces, mock data, and UI patterns are production-ready and follow the established ERP system standards.
