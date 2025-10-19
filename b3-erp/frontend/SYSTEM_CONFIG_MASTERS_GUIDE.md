# System & Configuration Masters - Implementation Guide

This guide provides complete TypeScript interfaces and implementation patterns for all 9 System & Configuration Master components in the Manufacturing ERP system.

## Table of Contents
1. [User Master](#1-user-master)
2. [Role Master](#2-role-master)
3. [Menu Master](#3-menu-master)
4. [Document Type Master](#4-document-type-master)
5. [Number Series Master](#5-number-series-master)
6. [Approval Workflow Master](#6-approval-workflow-master)
7. [Email Template Master](#7-email-template-master)
8. [Report Master](#8-report-master)
9. [Dashboard Configuration Master](#9-dashboard-configuration-master)

---

## 1. User Master

**Purpose**: System users management with authentication and authorization

### TypeScript Interface

```typescript
interface User {
  id: string;
  userCode: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    phoneNumber?: string;
    mobileNumber: string;
    department?: string;
    designation?: string;
    employeeCode?: string;
  };
  authentication: {
    passwordHash: string;
    passwordLastChanged: Date;
    requirePasswordChange: boolean;
    twoFactorEnabled: boolean;
    twoFactorMethod?: 'SMS' | 'Email' | 'Authenticator';
    lastLogin?: Date;
    lastLoginIP?: string;
    failedLoginAttempts: number;
    accountLockedUntil?: Date;
  };
  authorization: {
    roles: string[];
    primaryRole: string;
    permissions: string[];
    accessLevel: 'Admin' | 'Manager' | 'User' | 'Viewer' | 'Custom';
    restrictedModules?: string[];
    allowedBranches?: string[];
    allowedPlants?: string[];
  };
  settings: {
    theme: 'Light' | 'Dark' | 'Auto';
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    defaultDashboard?: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  session: {
    sessionTimeout: number; // minutes
    concurrentLoginAllowed: boolean;
    maxConcurrentSessions?: number;
    ipRestriction?: string[];
    allowedDevices?: string[];
  };
  auditLog: {
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    lastPasswordChange: Date;
    lastProfileUpdate: Date;
  };
  status: 'Active' | 'Inactive' | 'Locked' | 'Suspended' | 'Pending Activation';
  validFrom: Date;
  validTo?: Date;
  notes?: string;
}
```

### Mock Data

```typescript
const mockUsers: User[] = [
  {
    id: '1',
    userCode: 'USR-001',
    username: 'admin',
    email: 'admin@manufacturing.com',
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      displayName: 'Admin',
      mobileNumber: '+91-9876543210',
      department: 'IT',
      designation: 'System Admin'
    },
    authentication: {
      passwordHash: 'hashed_password',
      passwordLastChanged: new Date('2024-01-01'),
      requirePasswordChange: false,
      twoFactorEnabled: true,
      twoFactorMethod: 'Authenticator',
      lastLogin: new Date('2024-02-15T09:30:00Z'),
      lastLoginIP: '192.168.1.100',
      failedLoginAttempts: 0
    },
    authorization: {
      roles: ['System Admin', 'Super User'],
      primaryRole: 'System Admin',
      permissions: ['*'],
      accessLevel: 'Admin'
    },
    settings: {
      theme: 'Dark',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'en-IN',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },
    session: {
      sessionTimeout: 30,
      concurrentLoginAllowed: true,
      maxConcurrentSessions: 3
    },
    auditLog: {
      createdDate: new Date('2024-01-01'),
      createdBy: 'system',
      modifiedDate: new Date('2024-02-10'),
      modifiedBy: 'admin',
      lastPasswordChange: new Date('2024-01-01'),
      lastProfileUpdate: new Date('2024-02-10')
    },
    status: 'Active',
    validFrom: new Date('2024-01-01')
  },
  {
    id: '2',
    userCode: 'USR-002',
    username: 'john.doe',
    email: 'john.doe@manufacturing.com',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      mobileNumber: '+91-9876543211',
      department: 'Production',
      designation: 'Production Manager',
      employeeCode: 'EMP-1025'
    },
    authentication: {
      passwordHash: 'hashed_password',
      passwordLastChanged: new Date('2024-02-01'),
      requirePasswordChange: false,
      twoFactorEnabled: false,
      lastLogin: new Date('2024-02-14T14:20:00Z'),
      lastLoginIP: '192.168.1.150',
      failedLoginAttempts: 0
    },
    authorization: {
      roles: ['Production Manager', 'User'],
      primaryRole: 'Production Manager',
      permissions: ['production.*', 'inventory.view', 'quality.manage'],
      accessLevel: 'Manager',
      allowedPlants: ['PLANT-001', 'PLANT-002']
    },
    settings: {
      theme: 'Light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD-MM-YYYY',
      numberFormat: 'en-IN',
      defaultDashboard: 'production-dashboard',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    session: {
      sessionTimeout: 60,
      concurrentLoginAllowed: false
    },
    auditLog: {
      createdDate: new Date('2024-01-15'),
      createdBy: 'admin',
      modifiedDate: new Date('2024-02-01'),
      modifiedBy: 'admin',
      lastPasswordChange: new Date('2024-02-01'),
      lastProfileUpdate: new Date('2024-01-20')
    },
    status: 'Active',
    validFrom: new Date('2024-01-15')
  }
];
```

### Statistics Cards

```typescript
const statistics = [
  {
    label: 'Total Users',
    value: users.length,
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Active Users',
    value: users.filter(u => u.status === 'Active').length,
    icon: CheckCircle,
    color: 'green'
  },
  {
    label: 'Online Now',
    value: users.filter(u => u.authentication.lastLogin &&
      new Date().getTime() - u.authentication.lastLogin.getTime() < 900000).length,
    icon: Activity,
    color: 'purple'
  },
  {
    label: '2FA Enabled',
    value: users.filter(u => u.authentication.twoFactorEnabled).length,
    icon: Shield,
    color: 'orange'
  }
];
```

---

## 2. Role Master

**Purpose**: User permissions and role-based access control

### TypeScript Interface

```typescript
interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  roleType: 'System' | 'Functional' | 'Department' | 'Custom';
  description: string;
  level: number; // 1=Highest, 5=Lowest
  category: 'Admin' | 'Manager' | 'Executive' | 'Supervisor' | 'User' | 'Viewer';
  permissions: {
    module: string;
    moduleDisplayName: string;
    access: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
      export: boolean;
      print: boolean;
    };
    fieldRestrictions?: {
      fieldName: string;
      viewOnly: boolean;
      hidden: boolean;
    }[];
    dataFilters?: {
      filterType: 'Branch' | 'Plant' | 'Department' | 'CostCenter' | 'Custom';
      allowedValues: string[];
    }[];
  }[];
  approvalLimits: {
    purchaseOrder?: number;
    salesOrder?: number;
    payment?: number;
    expenseClaim?: number;
    leaveRequest?: boolean;
    materialIssue?: number;
  };
  reporting: {
    accessibleReports: string[];
    canScheduleReports: boolean;
    canExportData: boolean;
    canViewAuditLogs: boolean;
  };
  hierarchy: {
    parentRole?: string;
    childRoles: string[];
    canDelegateAuthority: boolean;
  };
  restrictions: {
    timeBasedAccess?: {
      allowedDays: string[];
      allowedHours: { start: string; end: string };
    };
    ipRestriction?: string[];
    deviceRestriction?: string[];
  };
  statistics: {
    totalUsers: number;
    activeUsers: number;
    lastAssigned?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
    isSystemRole: boolean;
  };
  status: 'Active' | 'Inactive' | 'Deprecated';
}
```

### Mock Data

```typescript
const mockRoles: Role[] = [
  {
    id: '1',
    roleCode: 'ROLE-ADMIN',
    roleName: 'System Administrator',
    roleType: 'System',
    description: 'Full system access with all permissions',
    level: 1,
    category: 'Admin',
    permissions: [
      {
        module: 'all',
        moduleDisplayName: 'All Modules',
        access: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true,
          print: true
        }
      }
    ],
    approvalLimits: {
      purchaseOrder: 999999999,
      salesOrder: 999999999,
      payment: 999999999,
      expenseClaim: 999999999,
      leaveRequest: true
    },
    reporting: {
      accessibleReports: ['*'],
      canScheduleReports: true,
      canExportData: true,
      canViewAuditLogs: true
    },
    hierarchy: {
      childRoles: ['ROLE-MANAGER', 'ROLE-EXEC'],
      canDelegateAuthority: true
    },
    restrictions: {},
    statistics: {
      totalUsers: 2,
      activeUsers: 2,
      lastAssigned: new Date('2024-02-10')
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'system',
      updatedAt: new Date('2024-01-01'),
      updatedBy: 'system',
      version: 1,
      isSystemRole: true
    },
    status: 'Active'
  },
  {
    id: '2',
    roleCode: 'ROLE-PROD-MGR',
    roleName: 'Production Manager',
    roleType: 'Functional',
    description: 'Manages production operations and planning',
    level: 2,
    category: 'Manager',
    permissions: [
      {
        module: 'production',
        moduleDisplayName: 'Production',
        access: {
          view: true,
          create: true,
          edit: true,
          delete: false,
          approve: true,
          export: true,
          print: true
        }
      },
      {
        module: 'inventory',
        moduleDisplayName: 'Inventory',
        access: {
          view: true,
          create: true,
          edit: true,
          delete: false,
          approve: false,
          export: true,
          print: true
        }
      },
      {
        module: 'quality',
        moduleDisplayName: 'Quality Control',
        access: {
          view: true,
          create: true,
          edit: true,
          delete: false,
          approve: true,
          export: false,
          print: true
        }
      }
    ],
    approvalLimits: {
      materialIssue: 500000,
      purchaseOrder: 100000
    },
    reporting: {
      accessibleReports: ['production-*', 'inventory-*', 'quality-*'],
      canScheduleReports: true,
      canExportData: true,
      canViewAuditLogs: false
    },
    hierarchy: {
      parentRole: 'ROLE-ADMIN',
      childRoles: ['ROLE-PROD-SUPERVISOR'],
      canDelegateAuthority: true
    },
    restrictions: {
      timeBasedAccess: {
        allowedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        allowedHours: { start: '06:00', end: '22:00' }
      }
    },
    statistics: {
      totalUsers: 5,
      activeUsers: 5,
      lastAssigned: new Date('2024-02-12')
    },
    metadata: {
      createdAt: new Date('2024-01-05'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-25'),
      updatedBy: 'admin',
      version: 2,
      isSystemRole: false
    },
    status: 'Active'
  },
  {
    id: '3',
    roleCode: 'ROLE-VIEWER',
    roleName: 'Report Viewer',
    roleType: 'Custom',
    description: 'View-only access to reports and dashboards',
    level: 5,
    category: 'Viewer',
    permissions: [
      {
        module: 'reports',
        moduleDisplayName: 'Reports',
        access: {
          view: true,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false,
          print: true
        }
      },
      {
        module: 'dashboard',
        moduleDisplayName: 'Dashboard',
        access: {
          view: true,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false,
          print: false
        }
      }
    ],
    approvalLimits: {},
    reporting: {
      accessibleReports: ['summary-*', 'dashboard-*'],
      canScheduleReports: false,
      canExportData: false,
      canViewAuditLogs: false
    },
    hierarchy: {
      parentRole: 'ROLE-EXEC',
      childRoles: [],
      canDelegateAuthority: false
    },
    restrictions: {},
    statistics: {
      totalUsers: 12,
      activeUsers: 10,
      lastAssigned: new Date('2024-02-14')
    },
    metadata: {
      createdAt: new Date('2024-01-10'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 3,
      isSystemRole: false
    },
    status: 'Active'
  }
];
```

---

## 3. Menu Master

**Purpose**: Navigation structure and menu hierarchy management

### TypeScript Interface

```typescript
interface MenuItem {
  id: string;
  menuCode: string;
  menuName: string;
  displayName: string;
  menuType: 'Module' | 'Group' | 'Page' | 'Report' | 'External Link' | 'Action';
  level: number; // 0=Root, 1=Main Menu, 2=Submenu, 3=Sub-submenu
  parentMenu?: string;
  parentMenuName?: string;
  path?: string;
  route?: string;
  externalUrl?: string;
  icon: string; // Lucide icon name
  iconColor?: string;
  badge?: {
    text: string;
    color: string;
    showCount: boolean;
  };
  positioning: {
    sequenceNumber: number;
    grouping?: string;
    sidebar: boolean;
    topBar: boolean;
    quickAccess: boolean;
    mobileMenu: boolean;
  };
  access: {
    requiredRoles: string[];
    requiredPermissions: string[];
    minimumAccessLevel: 'Admin' | 'Manager' | 'User' | 'Viewer';
    guestAccess: boolean;
  };
  behavior: {
    openInNewTab: boolean;
    showInBreadcrumb: boolean;
    cacheEnabled: boolean;
    requiresConfirmation: boolean;
    confirmationMessage?: string;
  };
  children: string[]; // Child menu IDs
  metadata: {
    module: string;
    feature?: string;
    keywords: string[];
    helpUrl?: string;
    shortcutKey?: string;
  };
  analytics: {
    trackClicks: boolean;
    totalClicks: number;
    uniqueUsers: number;
    lastAccessed?: Date;
    popularityScore: number;
  };
  settings: {
    visible: boolean;
    enabled: boolean;
    deprecated: boolean;
    betaFeature: boolean;
    requiresLicense: boolean;
  };
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  status: 'Active' | 'Inactive' | 'Hidden' | 'Coming Soon';
}
```

### Mock Data

```typescript
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    menuCode: 'MENU-DASHBOARD',
    menuName: 'Dashboard',
    displayName: 'Dashboard',
    menuType: 'Page',
    level: 1,
    route: '/dashboard',
    icon: 'LayoutDashboard',
    iconColor: 'text-blue-600',
    positioning: {
      sequenceNumber: 1,
      sidebar: true,
      topBar: false,
      quickAccess: true,
      mobileMenu: true
    },
    access: {
      requiredRoles: [],
      requiredPermissions: [],
      minimumAccessLevel: 'Viewer',
      guestAccess: false
    },
    behavior: {
      openInNewTab: false,
      showInBreadcrumb: true,
      cacheEnabled: true,
      requiresConfirmation: false
    },
    children: [],
    metadata: {
      module: 'Core',
      keywords: ['dashboard', 'home', 'overview'],
      shortcutKey: 'Ctrl+H'
    },
    analytics: {
      trackClicks: true,
      totalClicks: 15420,
      uniqueUsers: 245,
      lastAccessed: new Date('2024-02-15T10:30:00Z'),
      popularityScore: 98
    },
    settings: {
      visible: true,
      enabled: true,
      deprecated: false,
      betaFeature: false,
      requiresLicense: false
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system',
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'system',
    status: 'Active'
  },
  {
    id: '2',
    menuCode: 'MENU-MASTERS',
    menuName: 'Masters',
    displayName: 'Masters',
    menuType: 'Module',
    level: 1,
    icon: 'Database',
    iconColor: 'text-green-600',
    positioning: {
      sequenceNumber: 10,
      sidebar: true,
      topBar: false,
      quickAccess: false,
      mobileMenu: true
    },
    access: {
      requiredRoles: [],
      requiredPermissions: ['masters.view'],
      minimumAccessLevel: 'User',
      guestAccess: false
    },
    behavior: {
      openInNewTab: false,
      showInBreadcrumb: true,
      cacheEnabled: false,
      requiresConfirmation: false
    },
    children: ['3', '4', '5'],
    metadata: {
      module: 'Masters',
      keywords: ['masters', 'setup', 'configuration']
    },
    analytics: {
      trackClicks: true,
      totalClicks: 8540,
      uniqueUsers: 125,
      lastAccessed: new Date('2024-02-15T09:15:00Z'),
      popularityScore: 75
    },
    settings: {
      visible: true,
      enabled: true,
      deprecated: false,
      betaFeature: false,
      requiresLicense: false
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system',
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'admin',
    status: 'Active'
  },
  {
    id: '3',
    menuCode: 'MENU-COMMON-MASTERS',
    menuName: 'Common Masters',
    displayName: 'Common Masters',
    menuType: 'Group',
    level: 2,
    parentMenu: '2',
    parentMenuName: 'Masters',
    icon: 'FolderOpen',
    positioning: {
      sequenceNumber: 1,
      sidebar: true,
      topBar: false,
      quickAccess: false,
      mobileMenu: true
    },
    access: {
      requiredRoles: [],
      requiredPermissions: ['masters.common.view'],
      minimumAccessLevel: 'User',
      guestAccess: false
    },
    behavior: {
      openInNewTab: false,
      showInBreadcrumb: true,
      cacheEnabled: false,
      requiresConfirmation: false
    },
    children: ['6', '7', '8'],
    metadata: {
      module: 'Masters',
      feature: 'Common',
      keywords: ['common', 'general', 'basic']
    },
    analytics: {
      trackClicks: true,
      totalClicks: 4250,
      uniqueUsers: 85,
      popularityScore: 65
    },
    settings: {
      visible: true,
      enabled: true,
      deprecated: false,
      betaFeature: false,
      requiresLicense: false
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system',
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'system',
    status: 'Active'
  },
  {
    id: '6',
    menuCode: 'MENU-COUNTRY',
    menuName: 'Country Master',
    displayName: 'Country Master',
    menuType: 'Page',
    level: 3,
    parentMenu: '3',
    parentMenuName: 'Common Masters',
    route: '/masters/common/country',
    icon: 'Globe',
    positioning: {
      sequenceNumber: 1,
      sidebar: true,
      topBar: false,
      quickAccess: false,
      mobileMenu: false
    },
    access: {
      requiredRoles: [],
      requiredPermissions: ['masters.common.country'],
      minimumAccessLevel: 'User',
      guestAccess: false
    },
    behavior: {
      openInNewTab: false,
      showInBreadcrumb: true,
      cacheEnabled: true,
      requiresConfirmation: false
    },
    children: [],
    metadata: {
      module: 'Masters',
      feature: 'Common',
      keywords: ['country', 'geography', 'location'],
      helpUrl: '/help/masters/country'
    },
    analytics: {
      trackClicks: true,
      totalClicks: 1250,
      uniqueUsers: 45,
      lastAccessed: new Date('2024-02-14T16:20:00Z'),
      popularityScore: 55
    },
    settings: {
      visible: true,
      enabled: true,
      deprecated: false,
      betaFeature: false,
      requiresLicense: false
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system',
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'system',
    status: 'Active'
  }
];
```

---

## 4. Document Type Master

**Purpose**: Document categorization and numbering configuration

### TypeScript Interface

```typescript
interface DocumentType {
  id: string;
  documentTypeCode: string;
  documentTypeName: string;
  category: 'Transactional' | 'Master' | 'Report' | 'System' | 'Legal' | 'HR' | 'Financial';
  module: string;
  subModule?: string;
  description: string;
  numbering: {
    autoNumbering: boolean;
    numberSeriesCode?: string;
    numberSeriesName?: string;
    prefix?: string;
    suffix?: string;
    numberLength: number;
    currentNumber: number;
    separator: string;
    resetFrequency?: 'Never' | 'Daily' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Financial Year';
    sampleFormat: string; // e.g., "PO-2024-0001"
  };
  workflow: {
    approvalRequired: boolean;
    approvalLevels?: number;
    approvalWorkflowCode?: string;
    canEdit: boolean;
    canDelete: boolean;
    canCancel: boolean;
    canAmend: boolean;
  };
  storage: {
    attachmentsAllowed: boolean;
    maxAttachments?: number;
    allowedFileTypes?: string[];
    maxFileSize?: number; // MB
    mandatoryAttachment: boolean;
    storageLocation: 'Database' | 'FileSystem' | 'Cloud';
    retentionPeriod?: number; // months
  };
  printing: {
    printEnabled: boolean;
    defaultTemplate?: string;
    letterhead: boolean;
    copies: number;
    printOnSave: boolean;
    emailOnPrint: boolean;
  };
  integration: {
    emailEnabled: boolean;
    emailTemplateCode?: string;
    smsEnabled: boolean;
    smsTemplateCode?: string;
    webhookEnabled: boolean;
    webhookUrl?: string;
  };
  validation: {
    mandatoryFields: string[];
    uniqueFields: string[];
    customValidations?: {
      fieldName: string;
      validationType: string;
      validationRule: string;
    }[];
  };
  settings: {
    allowDuplicates: boolean;
    allowBackdating: boolean;
    allowFutureDating: boolean;
    lockAfterApproval: boolean;
    auditTrailEnabled: boolean;
  };
  statistics: {
    totalDocuments: number;
    documentsThisMonth: number;
    documentsThisYear: number;
    lastGenerated?: Date;
    avgProcessingTime?: number; // minutes
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
  };
  status: 'Active' | 'Inactive' | 'Deprecated';
}
```

### Mock Data

```typescript
const mockDocumentTypes: DocumentType[] = [
  {
    id: '1',
    documentTypeCode: 'PO',
    documentTypeName: 'Purchase Order',
    category: 'Transactional',
    module: 'Procurement',
    description: 'Purchase orders for material procurement',
    numbering: {
      autoNumbering: true,
      numberSeriesCode: 'PO-SERIES',
      numberSeriesName: 'Purchase Order Series',
      prefix: 'PO',
      numberLength: 6,
      currentNumber: 1254,
      separator: '-',
      resetFrequency: 'Yearly',
      sampleFormat: 'PO-2024-001254'
    },
    workflow: {
      approvalRequired: true,
      approvalLevels: 3,
      approvalWorkflowCode: 'PO-APPROVAL',
      canEdit: true,
      canDelete: false,
      canCancel: true,
      canAmend: true
    },
    storage: {
      attachmentsAllowed: true,
      maxAttachments: 10,
      allowedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png'],
      maxFileSize: 5,
      mandatoryAttachment: false,
      storageLocation: 'Cloud',
      retentionPeriod: 84
    },
    printing: {
      printEnabled: true,
      defaultTemplate: 'PO-Template-Standard',
      letterhead: true,
      copies: 3,
      printOnSave: false,
      emailOnPrint: true
    },
    integration: {
      emailEnabled: true,
      emailTemplateCode: 'PO-EMAIL',
      smsEnabled: false,
      webhookEnabled: true,
      webhookUrl: 'https://api.example.com/webhook/po'
    },
    validation: {
      mandatoryFields: ['supplierCode', 'deliveryDate', 'items', 'totalAmount'],
      uniqueFields: ['poNumber'],
      customValidations: [
        {
          fieldName: 'deliveryDate',
          validationType: 'Date',
          validationRule: 'Must be future date'
        }
      ]
    },
    settings: {
      allowDuplicates: false,
      allowBackdating: false,
      allowFutureDating: true,
      lockAfterApproval: true,
      auditTrailEnabled: true
    },
    statistics: {
      totalDocuments: 12540,
      documentsThisMonth: 245,
      documentsThisYear: 1254,
      lastGenerated: new Date('2024-02-15T11:30:00Z'),
      avgProcessingTime: 45
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 3
    },
    status: 'Active'
  },
  {
    id: '2',
    documentTypeCode: 'INV',
    documentTypeName: 'Sales Invoice',
    category: 'Financial',
    module: 'Sales',
    description: 'Customer sales invoices',
    numbering: {
      autoNumbering: true,
      numberSeriesCode: 'INV-SERIES',
      numberSeriesName: 'Invoice Series',
      prefix: 'INV',
      suffix: 'FY24',
      numberLength: 5,
      currentNumber: 8547,
      separator: '/',
      resetFrequency: 'Financial Year',
      sampleFormat: 'INV/08547/FY24'
    },
    workflow: {
      approvalRequired: false,
      canEdit: false,
      canDelete: false,
      canCancel: true,
      canAmend: false
    },
    storage: {
      attachmentsAllowed: true,
      maxAttachments: 5,
      allowedFileTypes: ['.pdf', '.jpg', '.png'],
      maxFileSize: 3,
      mandatoryAttachment: false,
      storageLocation: 'Database',
      retentionPeriod: 120
    },
    printing: {
      printEnabled: true,
      defaultTemplate: 'INV-Template-GST',
      letterhead: true,
      copies: 2,
      printOnSave: true,
      emailOnPrint: true
    },
    integration: {
      emailEnabled: true,
      emailTemplateCode: 'INV-EMAIL',
      smsEnabled: true,
      smsTemplateCode: 'INV-SMS',
      webhookEnabled: false
    },
    validation: {
      mandatoryFields: ['customerCode', 'invoiceDate', 'items', 'taxAmount', 'totalAmount'],
      uniqueFields: ['invoiceNumber'],
      customValidations: [
        {
          fieldName: 'invoiceDate',
          validationType: 'Date',
          validationRule: 'Cannot be future date'
        },
        {
          fieldName: 'totalAmount',
          validationType: 'Number',
          validationRule: 'Must be greater than 0'
        }
      ]
    },
    settings: {
      allowDuplicates: false,
      allowBackdating: true,
      allowFutureDating: false,
      lockAfterApproval: true,
      auditTrailEnabled: true
    },
    statistics: {
      totalDocuments: 85470,
      documentsThisMonth: 1254,
      documentsThisYear: 8547,
      lastGenerated: new Date('2024-02-15T14:45:00Z'),
      avgProcessingTime: 15
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-15'),
      updatedBy: 'admin',
      version: 2
    },
    status: 'Active'
  }
];
```

---

## 5. Number Series Master

**Purpose**: Auto-numbering configuration for documents

### TypeScript Interface

```typescript
interface NumberSeries {
  id: string;
  seriesCode: string;
  seriesName: string;
  description: string;
  applicableTo: {
    documentTypes: string[];
    modules: string[];
    branches?: string[];
    companies?: string[];
  };
  format: {
    prefix?: string;
    suffix?: string;
    numberLength: number;
    separator: string;
    includeBranchCode: boolean;
    includeCompanyCode: boolean;
    includeYear: boolean;
    includeMonth: boolean;
    yearFormat?: '2-digit' | '4-digit';
    monthFormat?: 'MM' | 'MMM' | 'MMMM';
    sampleOutput: string;
  };
  sequence: {
    startNumber: number;
    currentNumber: number;
    endNumber?: number;
    increment: number;
    padWithZeros: boolean;
  };
  reset: {
    resetEnabled: boolean;
    resetFrequency?: 'Never' | 'Daily' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Financial Year';
    lastResetDate?: Date;
    nextResetDate?: Date;
    resetTo: number;
  };
  allocation: {
    allocationType: 'Sequential' | 'Pool' | 'Range-Based';
    poolSize?: number;
    preAllocate: boolean;
    allowGaps: boolean;
    allowManualEntry: boolean;
    validateUniqueness: boolean;
  };
  multiCompany: {
    enabled: boolean;
    sharedAcrossCompanies: boolean;
    companySpecificFormat: {
      companyCode: string;
      prefix?: string;
      suffix?: string;
    }[];
  };
  conditions: {
    effectiveFrom: Date;
    effectiveTo?: Date;
    activeInBranches?: string[];
    activeForUserRoles?: string[];
  };
  tracking: {
    totalGenerated: number;
    lastGeneratedNumber: string;
    lastGeneratedDate?: Date;
    lastGeneratedBy?: string;
    remainingNumbers?: number;
    utilisationPercentage: number;
  };
  alerts: {
    warnAtPercentage?: number;
    warnAtRemaining?: number;
    notifyUsers: string[];
    emailAlerts: boolean;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    isSystemSeries: boolean;
  };
  status: 'Active' | 'Inactive' | 'Exhausted' | 'Suspended';
}
```

### Mock Data

```typescript
const mockNumberSeries: NumberSeries[] = [
  {
    id: '1',
    seriesCode: 'PO-2024',
    seriesName: 'Purchase Order 2024',
    description: 'Purchase order numbering for FY 2024',
    applicableTo: {
      documentTypes: ['PO'],
      modules: ['Procurement']
    },
    format: {
      prefix: 'PO',
      numberLength: 6,
      separator: '-',
      includeBranchCode: false,
      includeCompanyCode: false,
      includeYear: true,
      includeMonth: false,
      yearFormat: '4-digit',
      sampleOutput: 'PO-2024-001254'
    },
    sequence: {
      startNumber: 1,
      currentNumber: 1254,
      increment: 1,
      padWithZeros: true
    },
    reset: {
      resetEnabled: true,
      resetFrequency: 'Yearly',
      lastResetDate: new Date('2024-01-01'),
      nextResetDate: new Date('2025-01-01'),
      resetTo: 1
    },
    allocation: {
      allocationType: 'Sequential',
      preAllocate: false,
      allowGaps: false,
      allowManualEntry: false,
      validateUniqueness: true
    },
    multiCompany: {
      enabled: false,
      sharedAcrossCompanies: false,
      companySpecificFormat: []
    },
    conditions: {
      effectiveFrom: new Date('2024-01-01'),
      effectiveTo: new Date('2024-12-31')
    },
    tracking: {
      totalGenerated: 1254,
      lastGeneratedNumber: 'PO-2024-001254',
      lastGeneratedDate: new Date('2024-02-15T11:30:00Z'),
      lastGeneratedBy: 'john.doe',
      utilisationPercentage: 12.54
    },
    alerts: {
      warnAtPercentage: 90,
      notifyUsers: ['admin@company.com'],
      emailAlerts: true
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-01'),
      updatedBy: 'admin',
      isSystemSeries: false
    },
    status: 'Active'
  },
  {
    id: '2',
    seriesCode: 'INV-FY24',
    seriesName: 'Sales Invoice FY 2024',
    description: 'Sales invoice numbering for financial year 2024',
    applicableTo: {
      documentTypes: ['INV', 'CREDIT-NOTE', 'DEBIT-NOTE'],
      modules: ['Sales', 'Finance'],
      branches: ['BR-001', 'BR-002']
    },
    format: {
      prefix: 'INV',
      suffix: 'FY24',
      numberLength: 5,
      separator: '/',
      includeBranchCode: true,
      includeCompanyCode: false,
      includeYear: false,
      includeMonth: false,
      sampleOutput: 'INV/BR001/08547/FY24'
    },
    sequence: {
      startNumber: 1,
      currentNumber: 8547,
      endNumber: 99999,
      increment: 1,
      padWithZeros: true
    },
    reset: {
      resetEnabled: true,
      resetFrequency: 'Financial Year',
      lastResetDate: new Date('2024-04-01'),
      nextResetDate: new Date('2025-04-01'),
      resetTo: 1
    },
    allocation: {
      allocationType: 'Sequential',
      preAllocate: false,
      allowGaps: false,
      allowManualEntry: true,
      validateUniqueness: true
    },
    multiCompany: {
      enabled: true,
      sharedAcrossCompanies: false,
      companySpecificFormat: [
        { companyCode: 'C001', prefix: 'INV', suffix: 'C1-FY24' },
        { companyCode: 'C002', prefix: 'INV', suffix: 'C2-FY24' }
      ]
    },
    conditions: {
      effectiveFrom: new Date('2024-04-01'),
      effectiveTo: new Date('2025-03-31'),
      activeInBranches: ['BR-001', 'BR-002']
    },
    tracking: {
      totalGenerated: 8547,
      lastGeneratedNumber: 'INV/BR001/08547/FY24',
      lastGeneratedDate: new Date('2024-02-15T14:45:00Z'),
      lastGeneratedBy: 'sales.user',
      remainingNumbers: 91453,
      utilisationPercentage: 8.55
    },
    alerts: {
      warnAtPercentage: 95,
      warnAtRemaining: 5000,
      notifyUsers: ['admin@company.com', 'accounts@company.com'],
      emailAlerts: true
    },
    metadata: {
      createdAt: new Date('2024-04-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-04-05'),
      updatedBy: 'admin',
      isSystemSeries: false
    },
    status: 'Active'
  }
];
```

---

## 6. Approval Workflow Master

**Purpose**: Multi-level approval process configuration

### TypeScript Interface

```typescript
interface ApprovalWorkflow {
  id: string;
  workflowCode: string;
  workflowName: string;
  description: string;
  applicableTo: {
    documentTypes: string[];
    modules: string[];
    transactionTypes?: string[];
  };
  levels: {
    levelNumber: number;
    levelName: string;
    approverType: 'Role' | 'User' | 'Department' | 'Designation' | 'Dynamic' | 'Manager';
    approvers: {
      type: string;
      code: string;
      name: string;
      isPrimary: boolean;
      sequence?: number;
    }[];
    approvalMode: 'Any One' | 'All' | 'Majority' | 'Sequential' | 'Parallel';
    conditions?: {
      fieldName: string;
      operator: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'contains' | 'between';
      value: any;
      valueType: 'fixed' | 'dynamic' | 'formula';
    }[];
    actions: {
      onApprove: 'Next Level' | 'Complete' | 'Trigger Action';
      onReject: 'End Workflow' | 'Send Back' | 'Previous Level';
      onHold: 'Wait' | 'Escalate' | 'Notify';
    };
    escalation?: {
      enabled: boolean;
      escalateAfterHours: number;
      escalateTo: string[];
      notificationFrequency: number; // hours
    };
    sla: {
      expectedResponseTime: number; // hours
      warningTime: number; // hours
      breachAction: 'Escalate' | 'Auto-Approve' | 'Notify' | 'None';
    };
    notifications: {
      notifyOnSubmit: boolean;
      notifyOnApprove: boolean;
      notifyOnReject: boolean;
      emailTemplate?: string;
      smsTemplate?: string;
    };
  }[];
  routing: {
    routingType: 'Sequential' | 'Parallel' | 'Conditional' | 'Dynamic';
    allowSkipLevels: boolean;
    allowDelegation: boolean;
    allowRecall: boolean;
    requireComments: boolean;
    allowAttachments: boolean;
  };
  delegation: {
    enabled: boolean;
    maxDelegationDays?: number;
    delegationRequiresApproval: boolean;
    notifyOriginalApprover: boolean;
  };
  statistics: {
    totalSubmitted: number;
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
    averageApprovalTime: number; // hours
    currentlyPending: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
    isSystemWorkflow: boolean;
  };
  status: 'Active' | 'Inactive' | 'Draft' | 'Testing';
}
```

### Mock Data

```typescript
const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: '1',
    workflowCode: 'PO-APPROVAL-3L',
    workflowName: 'Purchase Order - 3 Level Approval',
    description: 'Three-level approval for purchase orders based on amount',
    applicableTo: {
      documentTypes: ['PO'],
      modules: ['Procurement'],
      transactionTypes: ['Material Purchase', 'Service Purchase']
    },
    levels: [
      {
        levelNumber: 1,
        levelName: 'Department Approval',
        approverType: 'Manager',
        approvers: [
          {
            type: 'Manager',
            code: 'DEPT-MGR',
            name: 'Department Manager',
            isPrimary: true
          }
        ],
        approvalMode: 'Any One',
        conditions: [
          {
            fieldName: 'totalAmount',
            operator: '<=',
            value: 100000,
            valueType: 'fixed'
          }
        ],
        actions: {
          onApprove: 'Next Level',
          onReject: 'End Workflow',
          onHold: 'Wait'
        },
        sla: {
          expectedResponseTime: 24,
          warningTime: 20,
          breachAction: 'Escalate'
        },
        notifications: {
          notifyOnSubmit: true,
          notifyOnApprove: true,
          notifyOnReject: true,
          emailTemplate: 'PO-L1-EMAIL'
        }
      },
      {
        levelNumber: 2,
        levelName: 'Finance Approval',
        approverType: 'Role',
        approvers: [
          {
            type: 'Role',
            code: 'FIN-MGR',
            name: 'Finance Manager',
            isPrimary: true
          },
          {
            type: 'Role',
            code: 'FIN-HEAD',
            name: 'Finance Head',
            isPrimary: false
          }
        ],
        approvalMode: 'Any One',
        conditions: [
          {
            fieldName: 'totalAmount',
            operator: '>',
            value: 50000,
            valueType: 'fixed'
          }
        ],
        actions: {
          onApprove: 'Next Level',
          onReject: 'Send Back',
          onHold: 'Escalate'
        },
        escalation: {
          enabled: true,
          escalateAfterHours: 48,
          escalateTo: ['CFO'],
          notificationFrequency: 12
        },
        sla: {
          expectedResponseTime: 48,
          warningTime: 40,
          breachAction: 'Escalate'
        },
        notifications: {
          notifyOnSubmit: true,
          notifyOnApprove: true,
          notifyOnReject: true,
          emailTemplate: 'PO-L2-EMAIL'
        }
      },
      {
        levelNumber: 3,
        levelName: 'Director Approval',
        approverType: 'Designation',
        approvers: [
          {
            type: 'Designation',
            code: 'DIR',
            name: 'Director',
            isPrimary: true,
            sequence: 1
          }
        ],
        approvalMode: 'All',
        conditions: [
          {
            fieldName: 'totalAmount',
            operator: '>',
            value: 500000,
            valueType: 'fixed'
          }
        ],
        actions: {
          onApprove: 'Complete',
          onReject: 'End Workflow',
          onHold: 'Notify'
        },
        sla: {
          expectedResponseTime: 72,
          warningTime: 60,
          breachAction: 'Notify'
        },
        notifications: {
          notifyOnSubmit: true,
          notifyOnApprove: true,
          notifyOnReject: true,
          emailTemplate: 'PO-L3-EMAIL',
          smsTemplate: 'PO-L3-SMS'
        }
      }
    ],
    routing: {
      routingType: 'Conditional',
      allowSkipLevels: true,
      allowDelegation: true,
      allowRecall: true,
      requireComments: true,
      allowAttachments: true
    },
    delegation: {
      enabled: true,
      maxDelegationDays: 30,
      delegationRequiresApproval: false,
      notifyOriginalApprover: true
    },
    statistics: {
      totalSubmitted: 1254,
      totalApproved: 1120,
      totalRejected: 85,
      totalPending: 49,
      averageApprovalTime: 36,
      currentlyPending: 49
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 2,
      isSystemWorkflow: false
    },
    status: 'Active'
  }
];
```

---

## 7. Email Template Master

**Purpose**: Email communication template management

### TypeScript Interface

```typescript
interface EmailTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  category: 'Transactional' | 'Notification' | 'Alert' | 'Marketing' | 'System' | 'Approval' | 'Report';
  module: string;
  description: string;
  trigger: {
    triggerEvent: string;
    triggerConditions?: {
      field: string;
      operator: string;
      value: any;
    }[];
    autoSend: boolean;
    requireApproval: boolean;
  };
  content: {
    subject: string;
    subjectVariables: string[];
    bodyHtml: string;
    bodyPlainText: string;
    bodyVariables: string[];
    attachmentAllowed: boolean;
    defaultAttachments?: string[];
  };
  recipients: {
    toAddresses: {
      type: 'Fixed' | 'Dynamic' | 'User Field' | 'Role' | 'Custom';
      value: string;
    }[];
    ccAddresses?: {
      type: 'Fixed' | 'Dynamic' | 'User Field' | 'Role' | 'Custom';
      value: string;
    }[];
    bccAddresses?: {
      type: 'Fixed' | 'Dynamic' | 'User Field' | 'Role' | 'Custom';
      value: string;
    }[];
    replyTo?: string;
  };
  design: {
    layout: 'Simple' | 'Professional' | 'Marketing' | 'Custom';
    headerIncluded: boolean;
    footerIncluded: boolean;
    logoIncluded: boolean;
    companyBranding: boolean;
    customCSS?: string;
  };
  variables: {
    variableName: string;
    variableKey: string;
    dataType: 'String' | 'Number' | 'Date' | 'Boolean' | 'Object';
    source: 'Document' | 'User' | 'System' | 'Custom';
    defaultValue?: any;
    isRequired: boolean;
  }[];
  settings: {
    priority: 'High' | 'Normal' | 'Low';
    sendImmediately: boolean;
    scheduleDelay?: number; // minutes
    maxRetries: number;
    trackOpens: boolean;
    trackClicks: boolean;
    unsubscribeLink: boolean;
  };
  localization: {
    multiLanguageSupport: boolean;
    defaultLanguage: string;
    translations?: {
      language: string;
      subject: string;
      body: string;
    }[];
  };
  statistics: {
    totalSent: number;
    sentThisMonth: number;
    totalOpens: number;
    totalClicks: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    lastSent?: Date;
  };
  testing: {
    testRecipients: string[];
    lastTestDate?: Date;
    testResults?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
  };
  status: 'Active' | 'Inactive' | 'Draft' | 'Testing';
}
```

### Mock Data

```typescript
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    templateCode: 'PO-APPROVAL-REQ',
    templateName: 'Purchase Order - Approval Request',
    category: 'Approval',
    module: 'Procurement',
    description: 'Email sent to approvers when a purchase order is submitted for approval',
    trigger: {
      triggerEvent: 'PO Submitted for Approval',
      autoSend: true,
      requireApproval: false
    },
    content: {
      subject: 'Purchase Order {{poNumber}} requires your approval',
      subjectVariables: ['poNumber'],
      bodyHtml: `
        <h2>Purchase Order Approval Request</h2>
        <p>Dear {{approverName}},</p>
        <p>A new purchase order <strong>{{poNumber}}</strong> has been submitted for your approval.</p>

        <table>
          <tr><td>Supplier:</td><td>{{supplierName}}</td></tr>
          <tr><td>Total Amount:</td><td>{{totalAmount}}</td></tr>
          <tr><td>Delivery Date:</td><td>{{deliveryDate}}</td></tr>
          <tr><td>Requested By:</td><td>{{requestedBy}}</td></tr>
        </table>

        <p><a href="{{approvalLink}}">Click here to review and approve</a></p>

        <p>Please review and take action at your earliest convenience.</p>
      `,
      bodyPlainText: 'Purchase Order {{poNumber}} requires your approval. Total Amount: {{totalAmount}}. Click {{approvalLink}} to review.',
      bodyVariables: ['approverName', 'poNumber', 'supplierName', 'totalAmount', 'deliveryDate', 'requestedBy', 'approvalLink'],
      attachmentAllowed: true,
      defaultAttachments: ['PO Document']
    },
    recipients: {
      toAddresses: [
        {
          type: 'Dynamic',
          value: 'currentApprover.email'
        }
      ],
      ccAddresses: [
        {
          type: 'Dynamic',
          value: 'requestedBy.email'
        }
      ],
      replyTo: 'noreply@manufacturing.com'
    },
    design: {
      layout: 'Professional',
      headerIncluded: true,
      footerIncluded: true,
      logoIncluded: true,
      companyBranding: true
    },
    variables: [
      {
        variableName: 'PO Number',
        variableKey: 'poNumber',
        dataType: 'String',
        source: 'Document',
        isRequired: true
      },
      {
        variableName: 'Approver Name',
        variableKey: 'approverName',
        dataType: 'String',
        source: 'User',
        isRequired: true
      },
      {
        variableName: 'Total Amount',
        variableKey: 'totalAmount',
        dataType: 'Number',
        source: 'Document',
        isRequired: true
      }
    ],
    settings: {
      priority: 'High',
      sendImmediately: true,
      maxRetries: 3,
      trackOpens: true,
      trackClicks: true,
      unsubscribeLink: false
    },
    localization: {
      multiLanguageSupport: false,
      defaultLanguage: 'en'
    },
    statistics: {
      totalSent: 1254,
      sentThisMonth: 245,
      totalOpens: 1180,
      totalClicks: 1120,
      openRate: 94.1,
      clickRate: 89.3,
      bounceRate: 0.5,
      lastSent: new Date('2024-02-15T11:30:00Z')
    },
    testing: {
      testRecipients: ['test@manufacturing.com'],
      lastTestDate: new Date('2024-02-01'),
      testResults: 'Success'
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 3
    },
    status: 'Active'
  },
  {
    id: '2',
    templateCode: 'INV-CUSTOMER',
    templateName: 'Sales Invoice - Customer Notification',
    category: 'Transactional',
    module: 'Sales',
    description: 'Email sent to customers when an invoice is generated',
    trigger: {
      triggerEvent: 'Invoice Generated',
      autoSend: true,
      requireApproval: false
    },
    content: {
      subject: 'Invoice {{invoiceNumber}} from {{companyName}}',
      subjectVariables: ['invoiceNumber', 'companyName'],
      bodyHtml: `
        <h2>Invoice</h2>
        <p>Dear {{customerName}},</p>
        <p>Thank you for your business. Please find your invoice details below:</p>

        <table>
          <tr><td>Invoice Number:</td><td>{{invoiceNumber}}</td></tr>
          <tr><td>Invoice Date:</td><td>{{invoiceDate}}</td></tr>
          <tr><td>Due Date:</td><td>{{dueDate}}</td></tr>
          <tr><td>Total Amount:</td><td>{{totalAmount}}</td></tr>
        </table>

        <p>The invoice PDF is attached to this email.</p>

        <p>Please make the payment by {{dueDate}}.</p>

        <p>Thank you for your business!</p>
      `,
      bodyPlainText: 'Invoice {{invoiceNumber}} for {{totalAmount}} is attached. Due date: {{dueDate}}',
      bodyVariables: ['customerName', 'invoiceNumber', 'invoiceDate', 'dueDate', 'totalAmount', 'companyName'],
      attachmentAllowed: true,
      defaultAttachments: ['Invoice PDF']
    },
    recipients: {
      toAddresses: [
        {
          type: 'Dynamic',
          value: 'customer.email'
        }
      ],
      ccAddresses: [
        {
          type: 'Fixed',
          value: 'accounts@manufacturing.com'
        }
      ],
      replyTo: 'sales@manufacturing.com'
    },
    design: {
      layout: 'Professional',
      headerIncluded: true,
      footerIncluded: true,
      logoIncluded: true,
      companyBranding: true
    },
    variables: [
      {
        variableName: 'Invoice Number',
        variableKey: 'invoiceNumber',
        dataType: 'String',
        source: 'Document',
        isRequired: true
      },
      {
        variableName: 'Customer Name',
        variableKey: 'customerName',
        dataType: 'String',
        source: 'Document',
        isRequired: true
      },
      {
        variableName: 'Total Amount',
        variableKey: 'totalAmount',
        dataType: 'Number',
        source: 'Document',
        isRequired: true
      }
    ],
    settings: {
      priority: 'Normal',
      sendImmediately: false,
      scheduleDelay: 5,
      maxRetries: 3,
      trackOpens: true,
      trackClicks: false,
      unsubscribeLink: true
    },
    localization: {
      multiLanguageSupport: true,
      defaultLanguage: 'en',
      translations: [
        {
          language: 'hi',
          subject: 'चालान {{invoiceNumber}} - {{companyName}}',
          body: 'प्रिय {{customerName}}, आपका चालान संलग्न है।'
        }
      ]
    },
    statistics: {
      totalSent: 8547,
      sentThisMonth: 1254,
      totalOpens: 7892,
      totalClicks: 245,
      openRate: 92.3,
      clickRate: 2.9,
      bounceRate: 1.2,
      lastSent: new Date('2024-02-15T14:45:00Z')
    },
    testing: {
      testRecipients: ['test@manufacturing.com'],
      lastTestDate: new Date('2024-01-15'),
      testResults: 'Success'
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-01-20'),
      updatedBy: 'admin',
      version: 2
    },
    status: 'Active'
  }
];
```

---

## 8. Report Master

**Purpose**: System reports configuration and management

### TypeScript Interface

```typescript
interface Report {
  id: string;
  reportCode: string;
  reportName: string;
  category: 'Operational' | 'Financial' | 'Analytical' | 'Statutory' | 'MIS' | 'Executive' | 'Custom';
  module: string;
  subModule?: string;
  description: string;
  reportType: 'Tabular' | 'Summary' | 'Chart' | 'Dashboard' | 'Pivot' | 'Matrix' | 'Form';
  dataSource: {
    sourceType: 'Database' | 'API' | 'File' | 'Multiple Sources';
    tables: string[];
    views?: string[];
    storedProcedures?: string[];
    apiEndpoints?: string[];
    refreshType: 'Real-time' | 'Scheduled' | 'On-demand';
    cacheEnabled: boolean;
    cacheDuration?: number; // minutes
  };
  parameters: {
    parameterName: string;
    parameterKey: string;
    dataType: 'String' | 'Number' | 'Date' | 'Boolean' | 'List' | 'MultiSelect';
    controlType: 'TextBox' | 'Dropdown' | 'DatePicker' | 'Checkbox' | 'RadioButton' | 'MultiSelect';
    defaultValue?: any;
    isRequired: boolean;
    isMandatory: boolean;
    validValues?: any[];
    dependsOn?: string;
    visibleToUser: boolean;
  }[];
  columns: {
    columnName: string;
    displayName: string;
    dataType: 'String' | 'Number' | 'Date' | 'Currency' | 'Percentage' | 'Boolean';
    format?: string;
    alignment: 'Left' | 'Center' | 'Right';
    width?: number;
    isVisible: boolean;
    isSortable: boolean;
    isFilterable: boolean;
    aggregation?: 'Sum' | 'Average' | 'Count' | 'Min' | 'Max' | 'None';
    colorCoding?: {
      condition: string;
      color: string;
    }[];
  }[];
  filters: {
    filterName: string;
    filterType: 'Quick' | 'Advanced' | 'Preset';
    fields: string[];
    operators: string[];
    defaultFilter?: any;
  }[];
  sorting: {
    defaultSortColumn: string;
    defaultSortOrder: 'ASC' | 'DESC';
    allowMultiSort: boolean;
  };
  grouping: {
    allowGrouping: boolean;
    defaultGroupBy?: string[];
    showGroupSummary: boolean;
    showGrandTotal: boolean;
  };
  visualization: {
    chartEnabled: boolean;
    chartTypes?: ('Line' | 'Bar' | 'Pie' | 'Area' | 'Scatter' | 'Gauge')[];
    defaultChartType?: string;
    chartSettings?: any;
  };
  export: {
    exportFormats: ('PDF' | 'Excel' | 'CSV' | 'Word' | 'HTML' | 'JSON')[];
    defaultFormat: string;
    includeCharts: boolean;
    includeFilters: boolean;
    orientation: 'Portrait' | 'Landscape';
    pageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  };
  scheduling: {
    schedulingEnabled: boolean;
    frequencies: ('Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly')[];
    emailDelivery: boolean;
    emailRecipients?: string[];
    ftpDelivery?: boolean;
    ftpLocation?: string;
  };
  access: {
    requiredRoles: string[];
    requiredPermissions: string[];
    dataFilters?: {
      filterType: string;
      allowedValues: string[];
    }[];
    rowLevelSecurity: boolean;
  };
  performance: {
    estimatedExecutionTime: number; // seconds
    maxRows?: number;
    paginationEnabled: boolean;
    pageSize?: number;
    indexingRequired: boolean;
  };
  statistics: {
    totalExecutions: number;
    executionsThisMonth: number;
    uniqueUsers: number;
    averageExecutionTime: number;
    lastExecuted?: Date;
    lastExecutedBy?: string;
    popularityScore: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
    isSystemReport: boolean;
    tags: string[];
  };
  status: 'Active' | 'Inactive' | 'Under Development' | 'Deprecated';
}
```

### Mock Data

```typescript
const mockReports: Report[] = [
  {
    id: '1',
    reportCode: 'RPT-INV-SUMMARY',
    reportName: 'Inventory Summary Report',
    category: 'Operational',
    module: 'Inventory',
    description: 'Summary of inventory levels, stock value, and movement',
    reportType: 'Tabular',
    dataSource: {
      sourceType: 'Database',
      tables: ['inventory_master', 'stock_ledger', 'item_master'],
      views: ['vw_inventory_summary'],
      refreshType: 'Real-time',
      cacheEnabled: false
    },
    parameters: [
      {
        parameterName: 'As On Date',
        parameterKey: 'asOnDate',
        dataType: 'Date',
        controlType: 'DatePicker',
        defaultValue: 'TODAY',
        isRequired: true,
        isMandatory: true,
        visibleToUser: true
      },
      {
        parameterName: 'Warehouse',
        parameterKey: 'warehouse',
        dataType: 'MultiSelect',
        controlType: 'MultiSelect',
        validValues: ['WH-001', 'WH-002', 'WH-003'],
        isRequired: false,
        isMandatory: false,
        visibleToUser: true
      },
      {
        parameterName: 'Item Category',
        parameterKey: 'itemCategory',
        dataType: 'List',
        controlType: 'Dropdown',
        validValues: ['Raw Material', 'Finished Goods', 'Semi-Finished'],
        isRequired: false,
        isMandatory: false,
        visibleToUser: true
      }
    ],
    columns: [
      {
        columnName: 'item_code',
        displayName: 'Item Code',
        dataType: 'String',
        alignment: 'Left',
        width: 120,
        isVisible: true,
        isSortable: true,
        isFilterable: true,
        aggregation: 'None'
      },
      {
        columnName: 'item_name',
        displayName: 'Item Name',
        dataType: 'String',
        alignment: 'Left',
        width: 250,
        isVisible: true,
        isSortable: true,
        isFilterable: true,
        aggregation: 'None'
      },
      {
        columnName: 'current_stock',
        displayName: 'Current Stock',
        dataType: 'Number',
        format: '#,##0.00',
        alignment: 'Right',
        width: 120,
        isVisible: true,
        isSortable: true,
        isFilterable: true,
        aggregation: 'Sum',
        colorCoding: [
          { condition: '< reorder_level', color: 'red' },
          { condition: '> reorder_level AND < max_level', color: 'orange' },
          { condition: '>= max_level', color: 'green' }
        ]
      },
      {
        columnName: 'stock_value',
        displayName: 'Stock Value',
        dataType: 'Currency',
        format: '₹ #,##0.00',
        alignment: 'Right',
        width: 150,
        isVisible: true,
        isSortable: true,
        isFilterable: false,
        aggregation: 'Sum'
      }
    ],
    filters: [
      {
        filterName: 'Quick Filters',
        filterType: 'Quick',
        fields: ['item_code', 'item_name', 'warehouse'],
        operators: ['contains', 'equals', 'starts with']
      }
    ],
    sorting: {
      defaultSortColumn: 'item_code',
      defaultSortOrder: 'ASC',
      allowMultiSort: true
    },
    grouping: {
      allowGrouping: true,
      defaultGroupBy: ['item_category'],
      showGroupSummary: true,
      showGrandTotal: true
    },
    visualization: {
      chartEnabled: true,
      chartTypes: ['Bar', 'Pie'],
      defaultChartType: 'Bar'
    },
    export: {
      exportFormats: ['PDF', 'Excel', 'CSV'],
      defaultFormat: 'Excel',
      includeCharts: true,
      includeFilters: true,
      orientation: 'Landscape',
      pageSize: 'A4'
    },
    scheduling: {
      schedulingEnabled: true,
      frequencies: ['Daily', 'Weekly', 'Monthly'],
      emailDelivery: true,
      emailRecipients: ['inventory@manufacturing.com']
    },
    access: {
      requiredRoles: ['Inventory Manager', 'Admin'],
      requiredPermissions: ['reports.inventory.view'],
      rowLevelSecurity: true
    },
    performance: {
      estimatedExecutionTime: 5,
      maxRows: 50000,
      paginationEnabled: true,
      pageSize: 100,
      indexingRequired: true
    },
    statistics: {
      totalExecutions: 2540,
      executionsThisMonth: 245,
      uniqueUsers: 25,
      averageExecutionTime: 4.5,
      lastExecuted: new Date('2024-02-15T10:30:00Z'),
      lastExecutedBy: 'inventory.manager',
      popularityScore: 85
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 3,
      isSystemReport: false,
      tags: ['inventory', 'stock', 'summary']
    },
    status: 'Active'
  }
];
```

---

## 9. Dashboard Configuration Master

**Purpose**: User dashboard layout and widget configuration

### TypeScript Interface

```typescript
interface DashboardConfiguration {
  id: string;
  dashboardCode: string;
  dashboardName: string;
  category: 'Executive' | 'Operational' | 'Analytical' | 'Personal' | 'Department' | 'Role-Based';
  module: string;
  description: string;
  layout: {
    layoutType: 'Grid' | 'Flexible' | 'Fixed' | 'Responsive';
    columns: number;
    rows: number;
    gridSize: number; // pixels
    responsiveBreakpoints: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
  };
  widgets: {
    widgetId: string;
    widgetCode: string;
    widgetName: string;
    widgetType: 'KPI' | 'Chart' | 'Table' | 'List' | 'Calendar' | 'Map' | 'Custom' | 'IFrame';
    position: {
      row: number;
      column: number;
      rowSpan: number;
      columnSpan: number;
    };
    dataSource: {
      sourceType: 'Report' | 'API' | 'Query' | 'Static';
      sourceCode?: string;
      refreshInterval?: number; // seconds
      autoRefresh: boolean;
    };
    visualization: {
      chartType?: 'Line' | 'Bar' | 'Pie' | 'Area' | 'Gauge' | 'Donut' | 'Scatter';
      colorScheme?: string[];
      showLegend: boolean;
      showLabels: boolean;
      showValues: boolean;
    };
    interactivity: {
      clickable: boolean;
      drillDownEnabled: boolean;
      drillDownTarget?: string;
      filterEnabled: boolean;
      exportEnabled: boolean;
    };
    settings: {
      title: string;
      showTitle: boolean;
      showBorder: boolean;
      backgroundColor?: string;
      titleColor?: string;
      refreshButton: boolean;
      expandButton: boolean;
      settingsButton: boolean;
    };
  }[];
  filters: {
    globalFilters: {
      filterName: string;
      filterType: string;
      defaultValue?: any;
      affectedWidgets: string[];
    }[];
    dateRange: {
      enabled: boolean;
      defaultRange: 'Today' | 'This Week' | 'This Month' | 'This Quarter' | 'This Year' | 'Custom';
      allowCustom: boolean;
    };
  };
  access: {
    accessType: 'Public' | 'Role-Based' | 'User-Specific' | 'Custom';
    allowedRoles?: string[];
    allowedUsers?: string[];
    isDefault: boolean;
    defaultForRoles?: string[];
  };
  personalization: {
    allowUserCustomization: boolean;
    customizableElements: ('Layout' | 'Widgets' | 'Colors' | 'Filters')[];
    saveUserPreferences: boolean;
  };
  scheduling: {
    emailDeliveryEnabled: boolean;
    emailFrequency?: 'Daily' | 'Weekly' | 'Monthly';
    emailRecipients?: string[];
    emailFormat?: 'PDF' | 'Image' | 'Link';
    pdfExportEnabled: boolean;
  };
  performance: {
    lazyLoadWidgets: boolean;
    cacheEnabled: boolean;
    cacheDuration?: number; // minutes
    maxLoadTime: number; // seconds
    parallelLoading: boolean;
  };
  statistics: {
    totalViews: number;
    viewsThisMonth: number;
    uniqueUsers: number;
    averageLoadTime: number;
    lastViewed?: Date;
    lastViewedBy?: string;
    popularityScore: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
    isSystemDashboard: boolean;
    tags: string[];
  };
  status: 'Active' | 'Inactive' | 'Draft' | 'Under Development';
}
```

### Mock Data

```typescript
const mockDashboardConfigurations: DashboardConfiguration[] = [
  {
    id: '1',
    dashboardCode: 'DASH-EXEC',
    dashboardName: 'Executive Dashboard',
    category: 'Executive',
    module: 'Core',
    description: 'High-level overview for executives with key business metrics',
    layout: {
      layoutType: 'Grid',
      columns: 12,
      rows: 6,
      gridSize: 100,
      responsiveBreakpoints: {
        desktop: 1200,
        tablet: 768,
        mobile: 480
      }
    },
    widgets: [
      {
        widgetId: 'W1',
        widgetCode: 'REVENUE-KPI',
        widgetName: 'Total Revenue',
        widgetType: 'KPI',
        position: {
          row: 1,
          column: 1,
          rowSpan: 1,
          columnSpan: 3
        },
        dataSource: {
          sourceType: 'Report',
          sourceCode: 'RPT-REVENUE-SUMMARY',
          refreshInterval: 300,
          autoRefresh: true
        },
        visualization: {
          chartType: 'Gauge',
          colorScheme: ['#10b981', '#f59e0b', '#ef4444'],
          showLegend: false,
          showLabels: true,
          showValues: true
        },
        interactivity: {
          clickable: true,
          drillDownEnabled: true,
          drillDownTarget: 'revenue-detail',
          filterEnabled: false,
          exportEnabled: false
        },
        settings: {
          title: 'Total Revenue (This Month)',
          showTitle: true,
          showBorder: true,
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          refreshButton: true,
          expandButton: true,
          settingsButton: false
        }
      },
      {
        widgetId: 'W2',
        widgetCode: 'ORDERS-KPI',
        widgetName: 'Total Orders',
        widgetType: 'KPI',
        position: {
          row: 1,
          column: 4,
          rowSpan: 1,
          columnSpan: 3
        },
        dataSource: {
          sourceType: 'Report',
          sourceCode: 'RPT-ORDERS-SUMMARY',
          refreshInterval: 180,
          autoRefresh: true
        },
        visualization: {
          showLegend: false,
          showLabels: true,
          showValues: true
        },
        interactivity: {
          clickable: true,
          drillDownEnabled: true,
          drillDownTarget: 'orders-detail',
          filterEnabled: false,
          exportEnabled: false
        },
        settings: {
          title: 'Total Orders (Today)',
          showTitle: true,
          showBorder: true,
          backgroundColor: '#ffffff',
          refreshButton: true,
          expandButton: true,
          settingsButton: false
        }
      },
      {
        widgetId: 'W3',
        widgetCode: 'SALES-TREND',
        widgetName: 'Sales Trend',
        widgetType: 'Chart',
        position: {
          row: 2,
          column: 1,
          rowSpan: 2,
          columnSpan: 6
        },
        dataSource: {
          sourceType: 'Report',
          sourceCode: 'RPT-SALES-TREND',
          refreshInterval: 600,
          autoRefresh: true
        },
        visualization: {
          chartType: 'Line',
          colorScheme: ['#3b82f6', '#10b981', '#f59e0b'],
          showLegend: true,
          showLabels: true,
          showValues: false
        },
        interactivity: {
          clickable: true,
          drillDownEnabled: true,
          drillDownTarget: 'sales-detail',
          filterEnabled: true,
          exportEnabled: true
        },
        settings: {
          title: 'Sales Trend (Last 12 Months)',
          showTitle: true,
          showBorder: true,
          backgroundColor: '#ffffff',
          refreshButton: true,
          expandButton: true,
          settingsButton: true
        }
      },
      {
        widgetId: 'W4',
        widgetCode: 'TOP-PRODUCTS',
        widgetName: 'Top Products',
        widgetType: 'Table',
        position: {
          row: 2,
          column: 7,
          rowSpan: 2,
          columnSpan: 6
        },
        dataSource: {
          sourceType: 'Report',
          sourceCode: 'RPT-TOP-PRODUCTS',
          refreshInterval: 900,
          autoRefresh: true
        },
        visualization: {
          showLegend: false,
          showLabels: true,
          showValues: true
        },
        interactivity: {
          clickable: true,
          drillDownEnabled: true,
          drillDownTarget: 'product-detail',
          filterEnabled: true,
          exportEnabled: true
        },
        settings: {
          title: 'Top 10 Products by Revenue',
          showTitle: true,
          showBorder: true,
          backgroundColor: '#ffffff',
          refreshButton: true,
          expandButton: true,
          settingsButton: true
        }
      }
    ],
    filters: {
      globalFilters: [
        {
          filterName: 'Date Range',
          filterType: 'DateRange',
          defaultValue: 'This Month',
          affectedWidgets: ['W1', 'W2', 'W3', 'W4']
        },
        {
          filterName: 'Branch',
          filterType: 'MultiSelect',
          affectedWidgets: ['W1', 'W3', 'W4']
        }
      ],
      dateRange: {
        enabled: true,
        defaultRange: 'This Month',
        allowCustom: true
      }
    },
    access: {
      accessType: 'Role-Based',
      allowedRoles: ['Executive', 'Director', 'CEO', 'CFO'],
      isDefault: true,
      defaultForRoles: ['Executive', 'Director']
    },
    personalization: {
      allowUserCustomization: true,
      customizableElements: ['Widgets', 'Filters'],
      saveUserPreferences: true
    },
    scheduling: {
      emailDeliveryEnabled: true,
      emailFrequency: 'Daily',
      emailRecipients: ['executives@manufacturing.com'],
      emailFormat: 'PDF',
      pdfExportEnabled: true
    },
    performance: {
      lazyLoadWidgets: true,
      cacheEnabled: true,
      cacheDuration: 5,
      maxLoadTime: 10,
      parallelLoading: true
    },
    statistics: {
      totalViews: 5420,
      viewsThisMonth: 342,
      uniqueUsers: 12,
      averageLoadTime: 3.2,
      lastViewed: new Date('2024-02-15T09:30:00Z'),
      lastViewedBy: 'ceo',
      popularityScore: 95
    },
    metadata: {
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-01'),
      updatedBy: 'admin',
      version: 4,
      isSystemDashboard: false,
      tags: ['executive', 'kpi', 'overview']
    },
    status: 'Active'
  },
  {
    id: '2',
    dashboardCode: 'DASH-PROD',
    dashboardName: 'Production Dashboard',
    category: 'Operational',
    module: 'Production',
    description: 'Real-time production monitoring and performance metrics',
    layout: {
      layoutType: 'Grid',
      columns: 12,
      rows: 8,
      gridSize: 80,
      responsiveBreakpoints: {
        desktop: 1200,
        tablet: 768,
        mobile: 480
      }
    },
    widgets: [
      {
        widgetId: 'P1',
        widgetCode: 'PROD-EFFICIENCY',
        widgetName: 'Production Efficiency',
        widgetType: 'KPI',
        position: {
          row: 1,
          column: 1,
          rowSpan: 1,
          columnSpan: 3
        },
        dataSource: {
          sourceType: 'Report',
          sourceCode: 'RPT-PROD-EFFICIENCY',
          refreshInterval: 60,
          autoRefresh: true
        },
        visualization: {
          chartType: 'Gauge',
          colorScheme: ['#10b981', '#f59e0b', '#ef4444'],
          showLegend: false,
          showLabels: true,
          showValues: true
        },
        interactivity: {
          clickable: false,
          drillDownEnabled: false,
          filterEnabled: false,
          exportEnabled: false
        },
        settings: {
          title: 'Overall Efficiency',
          showTitle: true,
          showBorder: true,
          refreshButton: true,
          expandButton: false,
          settingsButton: false
        }
      },
      {
        widgetId: 'P2',
        widgetCode: 'MACHINE-STATUS',
        widgetName: 'Machine Status',
        widgetType: 'Chart',
        position: {
          row: 2,
          column: 1,
          rowSpan: 2,
          columnSpan: 6
        },
        dataSource: {
          sourceType: 'API',
          sourceCode: '/api/machines/status',
          refreshInterval: 30,
          autoRefresh: true
        },
        visualization: {
          chartType: 'Donut',
          colorScheme: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
          showLegend: true,
          showLabels: true,
          showValues: true
        },
        interactivity: {
          clickable: true,
          drillDownEnabled: true,
          drillDownTarget: 'machine-detail',
          filterEnabled: false,
          exportEnabled: true
        },
        settings: {
          title: 'Machine Status (Real-time)',
          showTitle: true,
          showBorder: true,
          refreshButton: true,
          expandButton: true,
          settingsButton: false
        }
      }
    ],
    filters: {
      globalFilters: [
        {
          filterName: 'Plant',
          filterType: 'Dropdown',
          affectedWidgets: ['P1', 'P2']
        }
      ],
      dateRange: {
        enabled: true,
        defaultRange: 'Today',
        allowCustom: false
      }
    },
    access: {
      accessType: 'Role-Based',
      allowedRoles: ['Production Manager', 'Plant Manager', 'Supervisor'],
      isDefault: true,
      defaultForRoles: ['Production Manager']
    },
    personalization: {
      allowUserCustomization: false,
      customizableElements: [],
      saveUserPreferences: false
    },
    scheduling: {
      emailDeliveryEnabled: false,
      pdfExportEnabled: true
    },
    performance: {
      lazyLoadWidgets: false,
      cacheEnabled: false,
      maxLoadTime: 5,
      parallelLoading: true
    },
    statistics: {
      totalViews: 12540,
      viewsThisMonth: 1254,
      uniqueUsers: 25,
      averageLoadTime: 2.1,
      lastViewed: new Date('2024-02-15T14:30:00Z'),
      lastViewedBy: 'prod.manager',
      popularityScore: 88
    },
    metadata: {
      createdAt: new Date('2024-01-05'),
      createdBy: 'admin',
      updatedAt: new Date('2024-02-10'),
      updatedBy: 'prod.manager',
      version: 5,
      isSystemDashboard: false,
      tags: ['production', 'manufacturing', 'real-time']
    },
    status: 'Active'
  }
];
```

---

## Common UI Patterns

All System & Configuration Masters follow these patterns:

### Statistics Cards (4 KPIs)

```typescript
// User Master
- Total Users
- Active Users
- Online Now
- 2FA Enabled

// Role Master
- Total Roles
- Active Roles
- Users Assigned
- System Roles

// Menu Master
- Total Menu Items
- Active Items
- Top Level Menus
- Total Clicks (This Month)

// Document Type Master
- Total Document Types
- Active Types
- Documents Generated (This Month)
- Avg Processing Time

// Number Series Master
- Total Series
- Active Series
- Numbers Generated (This Month)
- Exhausted Series

// Approval Workflow Master
- Total Workflows
- Active Workflows
- Pending Approvals
- Avg Approval Time

// Email Template Master
- Total Templates
- Active Templates
- Emails Sent (This Month)
- Avg Open Rate

// Report Master
- Total Reports
- Active Reports
- Executions (This Month)
- Avg Execution Time

// Dashboard Configuration Master
- Total Dashboards
- Active Dashboards
- Total Views (This Month)
- Avg Load Time
```

### Color Scheme

```typescript
const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Draft: 'bg-yellow-100 text-yellow-800',
  Locked: 'bg-red-100 text-red-800',
  Suspended: 'bg-orange-100 text-orange-800',
  Testing: 'bg-blue-100 text-blue-800',
  Deprecated: 'bg-purple-100 text-purple-800',
  'Coming Soon': 'bg-pink-100 text-pink-800'
};

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Normal: 'bg-blue-100 text-blue-800',
  Low: 'bg-gray-100 text-gray-800'
};
```

### Common Lucide Icons

```typescript
import {
  Users, Shield, Menu, FileText, Hash, GitBranch,
  Mail, BarChart3, LayoutDashboard, Settings,
  CheckCircle, XCircle, Clock, AlertCircle,
  Search, Plus, Edit3, Eye, Download, Upload,
  Trash2, Copy, RefreshCw, Filter, Calendar
} from 'lucide-react';
```

---

## Implementation Notes

1. **Security**: All system masters require admin-level access
2. **Audit Trail**: All modifications must be tracked
3. **Versioning**: Maintain version history for critical configurations
4. **Testing**: Test configurations in sandbox before production
5. **Backup**: Regular backups of all configuration data
6. **Documentation**: Maintain inline documentation for complex logic
7. **Performance**: Optimize queries and enable caching where applicable
8. **Validation**: Implement strict validation rules
9. **Notifications**: Alert admins of critical configuration changes
10. **Integration**: Ensure seamless integration with other modules

---

This completes the System & Configuration Masters implementation guide. All interfaces, mock data, and UI patterns are production-ready and follow the established ERP system standards.
