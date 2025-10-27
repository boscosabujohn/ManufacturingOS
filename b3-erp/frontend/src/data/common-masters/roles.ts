export interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  category: 'system' | 'hr' | 'finance' | 'operations' | 'sales' | 'it';
  description: string;
  permissions: {
    module: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove?: boolean;
  }[];
  assignedUsers: number;
  isActive: boolean;
}

export const mockRoles: Role[] = [
  {
    id: '1',
    roleCode: 'ADMIN',
    roleName: 'System Administrator',
    category: 'system',
    description: 'Full system access with all permissions',
    permissions: [
      { module: 'All Modules', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true }
    ],
    assignedUsers: 3,
    isActive: true
  },
  {
    id: '2',
    roleCode: 'HR-MGR',
    roleName: 'HR Manager',
    category: 'hr',
    description: 'Manages all HR operations including recruitment, leave, and payroll',
    permissions: [
      { module: 'HR - All', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Leave', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true }
    ],
    assignedUsers: 2,
    isActive: true
  },
  {
    id: '3',
    roleCode: 'HR-EXEC',
    roleName: 'HR Executive',
    category: 'hr',
    description: 'HR operations and employee data management',
    permissions: [
      { module: 'Employee Master', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Leave Management', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Attendance', canView: true, canCreate: true, canEdit: true, canDelete: false }
    ],
    assignedUsers: 5,
    isActive: true
  },
  {
    id: '4',
    roleCode: 'FIN-MGR',
    roleName: 'Finance Manager',
    category: 'finance',
    description: 'Manages financial operations, payroll, and accounting',
    permissions: [
      { module: 'Finance - All', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Expenses', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true }
    ],
    assignedUsers: 2,
    isActive: true
  },
  {
    id: '5',
    roleCode: 'PROD-MGR',
    roleName: 'Production Manager',
    category: 'operations',
    description: 'Oversees manufacturing operations and production planning',
    permissions: [
      { module: 'Production', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Inventory', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Machines', canView: true, canCreate: false, canEdit: true, canDelete: false },
      { module: 'Quality', canView: true, canCreate: true, canEdit: true, canDelete: false }
    ],
    assignedUsers: 4,
    isActive: true
  },
  {
    id: '6',
    roleCode: 'SALES-MGR',
    roleName: 'Sales Manager',
    category: 'sales',
    description: 'Manages sales team and customer relationships',
    permissions: [
      { module: 'Sales', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Customers', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Quotations', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Orders', canView: true, canCreate: true, canEdit: true, canDelete: false }
    ],
    assignedUsers: 3,
    isActive: true
  },
  {
    id: '7',
    roleCode: 'EMP',
    roleName: 'Employee',
    category: 'hr',
    description: 'Standard employee with self-service access',
    permissions: [
      { module: 'My Profile', canView: true, canCreate: false, canEdit: true, canDelete: false },
      { module: 'My Leave', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'My Attendance', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'My Payslip', canView: true, canCreate: false, canEdit: false, canDelete: false }
    ],
    assignedUsers: 150,
    isActive: true
  },
  {
    id: '8',
    roleCode: 'SUPV',
    roleName: 'Supervisor',
    category: 'operations',
    description: 'Team lead with approval rights for team members',
    permissions: [
      { module: 'Team Leave', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true },
      { module: 'Team Attendance', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Production', canView: true, canCreate: true, canEdit: true, canDelete: false }
    ],
    assignedUsers: 15,
    isActive: true
  },
  {
    id: '9',
    roleCode: 'IT-ADMIN',
    roleName: 'IT Administrator',
    category: 'it',
    description: 'System configuration and user management',
    permissions: [
      { module: 'System Settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'User Management', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'Masters', canView: true, canCreate: true, canEdit: true, canDelete: true }
    ],
    assignedUsers: 2,
    isActive: true
  },
  {
    id: '10',
    roleCode: 'ACCT',
    roleName: 'Accountant',
    category: 'finance',
    description: 'Financial data entry and reporting',
    permissions: [
      { module: 'Accounting', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Expenses', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'Reports', canView: true, canCreate: false, canEdit: false, canDelete: false }
    ],
    assignedUsers: 4,
    isActive: true
  }
];
