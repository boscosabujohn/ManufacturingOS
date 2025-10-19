'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  UserCog,
  ShoppingBag,
  Calculator,
  Truck,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Wrench,
  FolderKanban,
  LucideIcon,
  Database,
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  name: string;
  href: string;
  description?: string;
  subItems?: SubMenuItem[]; // Support for nested sub-menus
}

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  href?: string;
  color: string;
  bgColor: string; // Background color for active state
  hoverColor: string; // Hover background color
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    subItems: [
      { id: 'customers', name: 'Customers', href: '/crm/customers', description: 'Customer database' },
      { id: 'leads', name: 'Leads', href: '/crm/leads', description: 'Lead management' },
      { id: 'contacts', name: 'Contacts', href: '/crm/contacts', description: 'Contact management' },
      { id: 'interactions', name: 'Interactions', href: '/crm/interactions', description: 'Customer interactions' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    subItems: [
      { id: 'quotations', name: 'Quotations', href: '/sales/quotations', description: 'Create quotations' },
      { id: 'orders', name: 'Sales Orders', href: '/sales/orders', description: 'Manage orders' },
    ],
  },
  {
    id: 'rfq',
    name: 'RFQ Management',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    hoverColor: 'hover:bg-amber-100',
    subItems: [
      { id: 'rfq-list', name: 'RFQ List', href: '/rfq', description: 'All RFQs' },
    ],
  },
  {
    id: 'estimation',
    name: 'Estimation',
    icon: Calculator,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    subItems: [
      { id: 'boq', name: 'BOQ Analysis', href: '/estimation/boq', description: 'Bill of quantities' },
      { id: 'costing', name: 'Cost Estimation', href: '/estimation/costing', description: 'Calculate costs' },
      { id: 'pricing', name: 'Pricing', href: '/estimation/pricing', description: 'Price calculation' },
    ],
  },
  {
    id: 'production',
    name: 'Production',
    icon: Factory,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    subItems: [
      { id: 'ppg', name: 'PPG Planning', href: '/production/ppg', description: 'Production planning' },
      { id: 'work-orders', name: 'Work Orders', href: '/production/work-orders', description: 'Production orders' },
      { id: 'bom', name: 'Bill of Materials', href: '/production/bom', description: 'BOM management' },
      { id: 'scheduling', name: 'Scheduling', href: '/production/scheduling', description: 'Schedule production' },
      { id: 'mrp', name: 'MRP', href: '/production/mrp', description: 'Material requirements' },
      { id: 'floor', name: 'Shop Floor', href: '/production/floor', description: 'Floor operations' },
      { id: 'quality', name: 'Quality Control', href: '/production/quality', description: 'Quality checks' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    subItems: [
      { id: 'warehouse', name: 'Warehouse', href: '/inventory/warehouse', description: 'Warehouse management' },
      { id: 'stock', name: 'Stock Management', href: '/inventory/stock', description: 'Stock levels' },
      { id: 'movements', name: 'Stock Movements', href: '/inventory/movements', description: 'Track movements' },
      { id: 'transfers', name: 'Transfers', href: '/inventory/transfers', description: 'Inter-warehouse' },
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    icon: ShoppingBag,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    hoverColor: 'hover:bg-cyan-100',
    subItems: [
      { id: 'po', name: 'Purchase Orders', href: '/procurement/po', description: 'PO management' },
      { id: 'orders', name: 'Orders', href: '/procurement/orders', description: 'Order tracking' },
      { id: 'requisitions', name: 'Requisitions', href: '/procurement/requisitions', description: 'Purchase requests' },
      { id: 'vendors', name: 'Vendors', href: '/procurement/vendors', description: 'Vendor management' },
      { id: 'vendor-management', name: 'Vendor Management', href: '/procurement/vendor-management', description: 'Vendor relations' },
      { id: 'grn', name: 'GRN', href: '/procurement/grn', description: 'Goods receipt notes' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: FolderKanban,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100',
    subItems: [
      { id: 'planning', name: 'Planning', href: '/projects/planning', description: 'Project planning' },
      { id: 'tracking', name: 'Tracking', href: '/projects/tracking', description: 'Track progress' },
      { id: 'resources', name: 'Resources', href: '/projects/resources', description: 'Resource allocation' },
      { id: 'commissioning', name: 'Commissioning', href: '/projects/commissioning', description: 'Project commissioning' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100',
    subItems: [
      { id: 'invoices', name: 'Invoices', href: '/finance/invoices', description: 'Invoice management' },
      { id: 'payments', name: 'Payments', href: '/finance/payments', description: 'Payment processing' },
      { id: 'payables', name: 'Payables', href: '/finance/payables', description: 'Accounts payable' },
      { id: 'receivables', name: 'Receivables', href: '/finance/receivables', description: 'Accounts receivable' },
      { id: 'accounting', name: 'Accounting', href: '/finance/accounting', description: 'General ledger' },
      { id: 'ledger-report', name: 'Ledger Report', href: '/finance/accounting/ledger-report', description: 'Ledger reports' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    icon: UserCog,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    subItems: [
      {
        id: 'employee-management',
        name: 'Employee Management',
        href: '#',
        description: 'Employee data & organization',
        subItems: [
          {
            id: 'employee-directory',
            name: 'Employee Directory',
            href: '#',
            description: 'All employees',
            subItems: [
              { id: 'all-employees', name: 'All Employees', href: '/hr/employees/directory/all', description: 'Complete employee list' },
              { id: 'active-employees', name: 'Active Employees', href: '/hr/employees/directory/active', description: 'Currently working' },
              { id: 'inactive-employees', name: 'Inactive Employees', href: '/hr/employees/directory/inactive', description: 'Separated employees' },
              { id: 'probation-employees', name: 'On Probation', href: '/hr/employees/directory/probation', description: 'Probation period' },
              { id: 'contract-employees', name: 'Contract Employees', href: '/hr/employees/directory/contract', description: 'Contract workers' },
            ],
          },
          { id: 'employee-profiles', name: 'Employee Profiles', href: '/hr/employees/profiles', description: 'Detailed employee information' },
          {
            id: 'organization-structure',
            name: 'Organization Structure',
            href: '#',
            description: 'Hierarchy & structure',
            subItems: [
              { id: 'org-chart', name: 'Organization Chart', href: '/hr/employees/org-chart', description: 'Visual hierarchy' },
              { id: 'departments', name: 'Departments', href: '/hr/employees/departments', description: 'Department management' },
              { id: 'teams', name: 'Teams', href: '/hr/employees/teams', description: 'Team structure' },
              { id: 'designations', name: 'Designations', href: '/hr/employees/designations', description: 'Job positions' },
            ],
          },
          { id: 'transfers-promotions', name: 'Transfers & Promotions', href: '/hr/employees/transfers-promotions', description: 'Employee movements' },
          { id: 'separations', name: 'Separations', href: '/hr/employees/separations', description: 'Exit management' },
        ],
      },
      {
        id: 'time-attendance',
        name: 'Time & Attendance',
        href: '#',
        description: 'Attendance tracking',
        subItems: [
          {
            id: 'attendance',
            name: 'Attendance',
            href: '#',
            description: 'Daily attendance',
            subItems: [
              { id: 'mark-attendance', name: 'Mark Attendance', href: '/hr/attendance/mark', description: 'Check in/out' },
              { id: 'daily-attendance', name: 'Daily Attendance', href: '/hr/attendance/daily', description: 'Today\'s attendance' },
              { id: 'monthly-register', name: 'Monthly Register', href: '/hr/attendance/monthly', description: 'Monthly view' },
              { id: 'attendance-calendar', name: 'Attendance Calendar', href: '/hr/attendance/calendar', description: 'Calendar view' },
              { id: 'attendance-reports', name: 'Attendance Reports', href: '/hr/attendance/reports', description: 'Analytics & reports' },
            ],
          },
          {
            id: 'shift-management',
            name: 'Shift Management',
            href: '#',
            description: 'Work shifts',
            subItems: [
              { id: 'shift-master', name: 'Shift Master', href: '/hr/shifts/master', description: 'Define shifts' },
              { id: 'shift-roster', name: 'Shift Roster', href: '/hr/shifts/roster', description: 'Shift schedule' },
              { id: 'shift-assignment', name: 'Shift Assignment', href: '/hr/shifts/assignment', description: 'Assign shifts' },
              { id: 'shift-swaps', name: 'Shift Swaps', href: '/hr/shifts/swaps', description: 'Exchange shifts' },
            ],
          },
          {
            id: 'overtime',
            name: 'Overtime Management',
            href: '#',
            description: 'OT tracking',
            subItems: [
              { id: 'ot-requests', name: 'OT Requests', href: '/hr/overtime/requests', description: 'Request overtime' },
              { id: 'ot-approval', name: 'OT Approval', href: '/hr/overtime/approval', description: 'Approve OT' },
              { id: 'ot-reports', name: 'OT Reports', href: '/hr/overtime/reports', description: 'OT analytics' },
              { id: 'compensatory-off', name: 'Compensatory Off', href: '/hr/overtime/comp-off', description: 'Comp off management' },
            ],
          },
          {
            id: 'timesheets',
            name: 'Timesheets',
            href: '#',
            description: 'Project hours',
            subItems: [
              { id: 'timesheet-entry', name: 'Timesheet Entry', href: '/hr/timesheets/entry', description: 'Log hours' },
              { id: 'timesheet-approval', name: 'Timesheet Approval', href: '/hr/timesheets/approval', description: 'Approve timesheets' },
              { id: 'project-hours', name: 'Project Hours', href: '/hr/timesheets/project-hours', description: 'Project-wise tracking' },
            ],
          },
          {
            id: 'attendance-settings',
            name: 'Settings',
            href: '#',
            description: 'Configuration',
            subItems: [
              { id: 'attendance-policies', name: 'Attendance Policies', href: '/hr/attendance/policies', description: 'Policy setup' },
              { id: 'working-hours', name: 'Working Hours', href: '/hr/attendance/working-hours', description: 'Define work hours' },
              { id: 'biometric-devices', name: 'Biometric Devices', href: '/hr/attendance/biometric', description: 'Device management' },
            ],
          },
        ],
      },
      {
        id: 'leave-management',
        name: 'Leave Management',
        href: '#',
        description: 'Leave tracking',
        subItems: [
          {
            id: 'leave-application',
            name: 'Leave Application',
            href: '#',
            description: 'Apply & manage',
            subItems: [
              { id: 'apply-leave', name: 'Apply Leave', href: '/hr/leave/apply', description: 'New leave request' },
              { id: 'my-leave-history', name: 'My Leave History', href: '/hr/leave/history', description: 'Past leaves' },
              { id: 'team-calendar', name: 'Team Leave Calendar', href: '/hr/leave/team-calendar', description: 'Team availability' },
              { id: 'leave-status', name: 'Leave Status', href: '/hr/leave/status', description: 'Request status' },
            ],
          },
          { id: 'leave-approvals', name: 'Leave Approvals', href: '/hr/leave/approvals', description: 'Pending approvals' },
          {
            id: 'leave-balance',
            name: 'Leave Balance',
            href: '#',
            description: 'Available leaves',
            subItems: [
              { id: 'my-balance', name: 'My Balance', href: '/hr/leave/balance/my', description: 'Personal balance' },
              { id: 'team-balance', name: 'Team Balance', href: '/hr/leave/balance/team', description: 'Team balances' },
              { id: 'department-balance', name: 'Department Balance', href: '/hr/leave/balance/department', description: 'Dept balances' },
            ],
          },
          {
            id: 'leave-encashment',
            name: 'Leave Encashment',
            href: '#',
            description: 'Encash leaves',
            subItems: [
              { id: 'encashment-requests', name: 'Encashment Requests', href: '/hr/leave/encashment/requests', description: 'Apply for encashment' },
              { id: 'encashment-approval', name: 'Encashment Approval', href: '/hr/leave/encashment/approval', description: 'Approve requests' },
              { id: 'encashment-history', name: 'Encashment History', href: '/hr/leave/encashment/history', description: 'Past encashments' },
            ],
          },
          { id: 'leave-types', name: 'Leave Types', href: '/hr/leave/types', description: 'Leave categories' },
          { id: 'leave-policies', name: 'Leave Policies', href: '/hr/leave/policies', description: 'Policy configuration' },
          {
            id: 'leave-reports',
            name: 'Leave Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'leave-summary', name: 'Leave Summary', href: '/hr/leave/reports/summary', description: 'Overall summary' },
              { id: 'department-report', name: 'Department Report', href: '/hr/leave/reports/department', description: 'Dept-wise report' },
              { id: 'leave-analytics', name: 'Analytics', href: '/hr/leave/reports/analytics', description: 'Trends & insights' },
            ],
          },
        ],
      },
      {
        id: 'payroll',
        name: 'Payroll Management',
        href: '#',
        description: 'Salary processing',
        subItems: [
          {
            id: 'salary-structure',
            name: 'Salary Structure',
            href: '#',
            description: 'Components & templates',
            subItems: [
              { id: 'components-master', name: 'Components Master', href: '/hr/payroll/components', description: 'Salary components' },
              { id: 'salary-templates', name: 'Salary Templates', href: '/hr/payroll/templates', description: 'Template management' },
              { id: 'employee-assignments', name: 'Employee Assignments', href: '/hr/payroll/assignments', description: 'Assign templates' },
              { id: 'revision-history', name: 'Revision History', href: '/hr/payroll/revisions', description: 'Past revisions' },
            ],
          },
          {
            id: 'payroll-processing',
            name: 'Payroll Processing',
            href: '#',
            description: 'Monthly payroll',
            subItems: [
              { id: 'run-payroll', name: 'Run Payroll', href: '/hr/payroll/run', description: 'Process payroll' },
              { id: 'payroll-calendar', name: 'Payroll Calendar', href: '/hr/payroll/calendar', description: 'Payroll schedule' },
              { id: 'payroll-verification', name: 'Payroll Verification', href: '/hr/payroll/verification', description: 'Verify before disbursement' },
              { id: 'salary-disbursement', name: 'Salary Disbursement', href: '/hr/payroll/disbursement', description: 'Payment processing' },
            ],
          },
          {
            id: 'statutory-compliance',
            name: 'Statutory Compliance',
            href: '#',
            description: 'Tax & compliance',
            subItems: [
              {
                id: 'income-tax',
                name: 'Income Tax',
                href: '#',
                description: 'TDS & returns',
                subItems: [
                  { id: 'tds-calculation', name: 'TDS Calculation', href: '/hr/payroll/tax/tds', description: 'Calculate TDS' },
                  { id: 'tax-declarations', name: 'Tax Declarations', href: '/hr/payroll/tax/declarations', description: 'Employee declarations' },
                  { id: 'form-16', name: 'Form 16', href: '/hr/payroll/tax/form16', description: 'Generate Form 16' },
                  { id: 'tax-reports', name: 'Tax Reports', href: '/hr/payroll/tax/reports', description: 'Tax analytics' },
                ],
              },
              {
                id: 'provident-fund',
                name: 'Provident Fund',
                href: '#',
                description: 'PF management',
                subItems: [
                  { id: 'pf-contribution', name: 'PF Contribution', href: '/hr/payroll/pf/contribution', description: 'Monthly PF' },
                  { id: 'pf-returns', name: 'PF Returns (ECR)', href: '/hr/payroll/pf/returns', description: 'ECR filing' },
                  { id: 'uan-management', name: 'UAN Management', href: '/hr/payroll/pf/uan', description: 'Universal account numbers' },
                ],
              },
              {
                id: 'esi',
                name: 'ESI',
                href: '#',
                description: 'Employee insurance',
                subItems: [
                  { id: 'esi-contribution', name: 'ESI Contribution', href: '/hr/payroll/esi/contribution', description: 'Monthly ESI' },
                  { id: 'esi-returns', name: 'ESI Returns', href: '/hr/payroll/esi/returns', description: 'ESI filing' },
                ],
              },
              { id: 'professional-tax', name: 'Professional Tax', href: '/hr/payroll/pt', description: 'PT calculation' },
            ],
          },
          {
            id: 'salary-revisions',
            name: 'Salary Revisions',
            href: '#',
            description: 'Increments',
            subItems: [
              { id: 'annual-increment', name: 'Annual Increment', href: '/hr/payroll/increment/annual', description: 'Yearly increment' },
              { id: 'performance-increment', name: 'Performance Increment', href: '/hr/payroll/increment/performance', description: 'Merit increase' },
              { id: 'arrears', name: 'Arrears Calculation', href: '/hr/payroll/increment/arrears', description: 'Backpay calculation' },
              { id: 'revision-letters', name: 'Revision Letters', href: '/hr/payroll/increment/letters', description: 'Generate letters' },
            ],
          },
          {
            id: 'bonus-incentives',
            name: 'Bonus & Incentives',
            href: '#',
            description: 'Variable pay',
            subItems: [
              { id: 'annual-bonus', name: 'Annual Bonus', href: '/hr/payroll/bonus/annual', description: 'Yearly bonus' },
              { id: 'performance-bonus', name: 'Performance Bonus', href: '/hr/payroll/bonus/performance', description: 'Based on KPIs' },
              { id: 'incentive-schemes', name: 'Incentive Schemes', href: '/hr/payroll/bonus/schemes', description: 'Sales & production' },
              { id: 'bonus-processing', name: 'Processing', href: '/hr/payroll/bonus/processing', description: 'Calculate & disburse' },
            ],
          },
          {
            id: 'loans-advances',
            name: 'Loans & Advances',
            href: '#',
            description: 'Employee loans',
            subItems: [
              { id: 'loan-requests', name: 'Loan Requests', href: '/hr/payroll/loans/requests', description: 'Apply for loan' },
              { id: 'loan-approval', name: 'Loan Approval', href: '/hr/payroll/loans/approval', description: 'Approve loans' },
              { id: 'emi-schedule', name: 'EMI Schedule', href: '/hr/payroll/loans/emi', description: 'Repayment schedule' },
              { id: 'advance-requests', name: 'Advance Requests', href: '/hr/payroll/advances/requests', description: 'Salary advance' },
              { id: 'recovery-tracking', name: 'Recovery Tracking', href: '/hr/payroll/loans/recovery', description: 'Track recoveries' },
            ],
          },
          {
            id: 'payroll-reports',
            name: 'Payroll Reports',
            href: '#',
            description: 'Reports & analytics',
            subItems: [
              { id: 'payslips', name: 'Payslips', href: '/hr/payroll/reports/payslips', description: 'Generate payslips' },
              { id: 'salary-register', name: 'Salary Register', href: '/hr/payroll/reports/register', description: 'Monthly register' },
              { id: 'bank-statement', name: 'Bank Statement', href: '/hr/payroll/reports/bank', description: 'Bank transfer file' },
              { id: 'department-cost', name: 'Department Cost', href: '/hr/payroll/reports/dept-cost', description: 'Dept-wise cost' },
              { id: 'pf-report', name: 'PF Report', href: '/hr/payroll/reports/pf', description: 'PF summary' },
              { id: 'esi-report', name: 'ESI Report', href: '/hr/payroll/reports/esi', description: 'ESI summary' },
              { id: 'tds-report', name: 'TDS Report', href: '/hr/payroll/reports/tds', description: 'TDS summary' },
            ],
          },
        ],
      },
      {
        id: 'expenses-travel',
        name: 'Expenses & Travel',
        href: '#',
        description: 'Claims & reimbursements',
        subItems: [
          {
            id: 'expense-management',
            name: 'Expense Management',
            href: '#',
            description: 'Expense claims',
            subItems: [
              { id: 'submit-expense', name: 'Submit Expense', href: '/hr/expenses/submit', description: 'New expense claim' },
              { id: 'my-expenses', name: 'My Expenses', href: '/hr/expenses/my', description: 'My submissions' },
              { id: 'pending-approvals', name: 'Pending Approvals', href: '/hr/expenses/pending', description: 'Awaiting approval' },
              { id: 'approved-expenses', name: 'Approved Expenses', href: '/hr/expenses/approved', description: 'Approved claims' },
              { id: 'rejected-expenses', name: 'Rejected Expenses', href: '/hr/expenses/rejected', description: 'Rejected claims' },
            ],
          },
          {
            id: 'travel-management',
            name: 'Travel Management',
            href: '#',
            description: 'Business travel',
            subItems: [
              { id: 'travel-requests', name: 'Travel Requests', href: '/hr/travel/requests', description: 'Request travel' },
              {
                id: 'travel-bookings',
                name: 'Travel Bookings',
                href: '#',
                description: 'Book travel',
                subItems: [
                  { id: 'flight-booking', name: 'Flight Booking', href: '/hr/travel/booking/flight', description: 'Book flights' },
                  { id: 'hotel-booking', name: 'Hotel Booking', href: '/hr/travel/booking/hotel', description: 'Book hotels' },
                  { id: 'cab-booking', name: 'Cab Booking', href: '/hr/travel/booking/cab', description: 'Book cabs' },
                ],
              },
              { id: 'travel-advances', name: 'Travel Advances', href: '/hr/travel/advances', description: 'Travel advance' },
              { id: 'travel-history', name: 'Travel History', href: '/hr/travel/history', description: 'Past travels' },
            ],
          },
          {
            id: 'reimbursements',
            name: 'Reimbursements',
            href: '#',
            description: 'Payment processing',
            subItems: [
              { id: 'pending-claims', name: 'Pending Claims', href: '/hr/reimbursement/pending', description: 'Awaiting payment' },
              { id: 'processing-claims', name: 'Processing', href: '/hr/reimbursement/processing', description: 'In progress' },
              { id: 'paid-claims', name: 'Paid Claims', href: '/hr/reimbursement/paid', description: 'Completed payments' },
              { id: 'settlement', name: 'Settlement', href: '/hr/reimbursement/settlement', description: 'Final settlement' },
            ],
          },
          {
            id: 'corporate-cards',
            name: 'Corporate Cards',
            href: '#',
            description: 'Card management',
            subItems: [
              { id: 'card-management', name: 'Card Management', href: '/hr/cards/management', description: 'Manage cards' },
              { id: 'card-transactions', name: 'Transactions', href: '/hr/cards/transactions', description: 'Card transactions' },
              { id: 'card-reconciliation', name: 'Reconciliation', href: '/hr/cards/reconciliation', description: 'Reconcile expenses' },
            ],
          },
          {
            id: 'expense-settings',
            name: 'Settings',
            href: '#',
            description: 'Configuration',
            subItems: [
              { id: 'expense-categories', name: 'Expense Categories', href: '/hr/expenses/settings/categories', description: 'Define categories' },
              { id: 'expense-policies', name: 'Expense Policies', href: '/hr/expenses/settings/policies', description: 'Policy rules' },
              { id: 'per-diem-rates', name: 'Per Diem Rates', href: '/hr/expenses/settings/per-diem', description: 'Daily allowances' },
              { id: 'approval-matrix', name: 'Approval Matrix', href: '/hr/expenses/settings/approval', description: 'Approval workflow' },
            ],
          },
          {
            id: 'expense-reports',
            name: 'Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'expense-summary', name: 'Expense Summary', href: '/hr/expenses/reports/summary', description: 'Overall summary' },
              { id: 'travel-analytics', name: 'Travel Analytics', href: '/hr/expenses/reports/travel', description: 'Travel insights' },
              { id: 'dept-expenses', name: 'Department Expenses', href: '/hr/expenses/reports/department', description: 'Dept-wise expenses' },
              { id: 'budget-actual', name: 'Budget vs Actual', href: '/hr/expenses/reports/budget', description: 'Budget comparison' },
            ],
          },
        ],
      },
      {
        id: 'onboarding-offboarding',
        name: 'Onboarding & Offboarding',
        href: '#',
        description: 'Employee lifecycle',
        subItems: [
          {
            id: 'onboarding',
            name: 'Onboarding',
            href: '#',
            description: 'New joiners',
            subItems: [
              {
                id: 'pre-joining',
                name: 'Pre-joining',
                href: '#',
                description: 'Before joining',
                subItems: [
                  { id: 'offer-management', name: 'Offer Management', href: '/hr/onboarding/offers', description: 'Manage offers' },
                  { id: 'document-collection', name: 'Document Collection', href: '/hr/onboarding/documents', description: 'Collect docs' },
                  { id: 'background-verification', name: 'Background Verification', href: '/hr/onboarding/verification', description: 'BGV process' },
                  { id: 'medical-checkup', name: 'Medical Checkup', href: '/hr/onboarding/medical', description: 'Health checkup' },
                ],
              },
              {
                id: 'joining-process',
                name: 'Joining Process',
                href: '#',
                description: 'First day',
                subItems: [
                  { id: 'first-day-setup', name: 'First Day Setup', href: '/hr/onboarding/first-day', description: 'Day 1 checklist' },
                  { id: 'id-card', name: 'ID Card Generation', href: '/hr/onboarding/id-card', description: 'Generate ID' },
                  { id: 'system-access', name: 'System Access', href: '/hr/onboarding/access', description: 'Provision access' },
                  { id: 'welcome-kit', name: 'Welcome Kit', href: '/hr/onboarding/welcome-kit', description: 'Welcome package' },
                ],
              },
              {
                id: 'orientation',
                name: 'Orientation',
                href: '#',
                description: 'Induction program',
                subItems: [
                  { id: 'hr-induction', name: 'HR Induction', href: '/hr/onboarding/induction/hr', description: 'HR orientation' },
                  { id: 'dept-induction', name: 'Department Induction', href: '/hr/onboarding/induction/department', description: 'Dept introduction' },
                  { id: 'training-schedule', name: 'Training Schedule', href: '/hr/onboarding/training', description: 'Initial training' },
                  { id: 'policy-acknowledgment', name: 'Policy Acknowledgment', href: '/hr/onboarding/policies', description: 'Accept policies' },
                ],
              },
              { id: 'onboarding-checklist', name: 'Onboarding Checklist', href: '/hr/onboarding/checklist', description: 'Track progress' },
            ],
          },
          {
            id: 'probation',
            name: 'Probation Management',
            href: '#',
            description: 'Probation period',
            subItems: [
              { id: 'probation-tracking', name: 'Probation Tracking', href: '/hr/probation/tracking', description: 'Monitor probation' },
              { id: 'review-schedule', name: 'Review Schedule', href: '/hr/probation/reviews', description: 'Performance reviews' },
              { id: 'feedback-collection', name: 'Feedback Collection', href: '/hr/probation/feedback', description: 'Gather feedback' },
              { id: 'confirmation', name: 'Confirmation Process', href: '/hr/probation/confirmation', description: 'Confirm employment' },
            ],
          },
          {
            id: 'offboarding',
            name: 'Offboarding',
            href: '#',
            description: 'Employee exit',
            subItems: [
              {
                id: 'resignations',
                name: 'Resignations',
                href: '#',
                description: 'Exit requests',
                subItems: [
                  { id: 'resignation-requests', name: 'Resignation Requests', href: '/hr/offboarding/resignations', description: 'Submit resignation' },
                  { id: 'notice-period', name: 'Notice Period', href: '/hr/offboarding/notice-period', description: 'Track notice' },
                  { id: 'early-release', name: 'Early Release', href: '/hr/offboarding/early-release', description: 'Waive notice' },
                  { id: 'acceptance', name: 'Acceptance', href: '/hr/offboarding/acceptance', description: 'Accept resignation' },
                ],
              },
              {
                id: 'exit-clearance',
                name: 'Exit Clearance',
                href: '#',
                description: 'Clearance process',
                subItems: [
                  { id: 'clearance-checklist', name: 'Clearance Checklist', href: '/hr/offboarding/clearance/checklist', description: 'Exit checklist' },
                  { id: 'it-clearance', name: 'IT Clearance', href: '/hr/offboarding/clearance/it', description: 'IT assets return' },
                  { id: 'hr-clearance', name: 'HR Clearance', href: '/hr/offboarding/clearance/hr', description: 'HR formalities' },
                  { id: 'finance-clearance', name: 'Finance Clearance', href: '/hr/offboarding/clearance/finance', description: 'Pending dues' },
                  { id: 'asset-return', name: 'Asset Return', href: '/hr/offboarding/clearance/assets', description: 'Return all assets' },
                ],
              },
              { id: 'exit-interview', name: 'Exit Interview', href: '/hr/offboarding/exit-interview', description: 'Conduct interview' },
              {
                id: 'fnf-settlement',
                name: 'Full & Final Settlement',
                href: '#',
                description: 'Final dues',
                subItems: [
                  { id: 'salary-calculation', name: 'Salary Calculation', href: '/hr/offboarding/fnf/salary', description: 'Calculate final salary' },
                  { id: 'leave-encashment', name: 'Leave Encashment', href: '/hr/offboarding/fnf/leave', description: 'Encash leaves' },
                  { id: 'gratuity', name: 'Gratuity', href: '/hr/offboarding/fnf/gratuity', description: 'Calculate gratuity' },
                  { id: 'final-payment', name: 'Final Payment', href: '/hr/offboarding/fnf/payment', description: 'Process payment' },
                ],
              },
              {
                id: 'exit-documents',
                name: 'Exit Documents',
                href: '#',
                description: 'Certificates',
                subItems: [
                  { id: 'experience-certificate', name: 'Experience Certificate', href: '/hr/offboarding/docs/experience', description: 'Issue experience cert' },
                  { id: 'relieving-letter', name: 'Relieving Letter', href: '/hr/offboarding/docs/relieving', description: 'Issue relieving letter' },
                  { id: 'service-certificate', name: 'Service Certificate', href: '/hr/offboarding/docs/service', description: 'Issue service cert' },
                ],
              },
            ],
          },
          {
            id: 'alumni',
            name: 'Alumni Management',
            href: '#',
            description: 'Ex-employees',
            subItems: [
              { id: 'alumni-directory', name: 'Alumni Directory', href: '/hr/alumni/directory', description: 'Alumni database' },
              { id: 'rehire-process', name: 'Rehire Process', href: '/hr/alumni/rehire', description: 'Rehire alumni' },
              { id: 'alumni-network', name: 'Alumni Network', href: '/hr/alumni/network', description: 'Stay connected' },
            ],
          },
        ],
      },
      {
        id: 'assets',
        name: 'Asset Management',
        href: '#',
        description: 'Company assets',
        subItems: [
          {
            id: 'asset-allocation',
            name: 'Asset Allocation',
            href: '#',
            description: 'Allocate assets',
            subItems: [
              {
                id: 'it-assets',
                name: 'IT Assets',
                href: '#',
                description: 'IT equipment',
                subItems: [
                  { id: 'laptops', name: 'Laptops', href: '/hr/assets/it/laptops', description: 'Laptop allocation' },
                  { id: 'desktops', name: 'Desktops', href: '/hr/assets/it/desktops', description: 'Desktop allocation' },
                  { id: 'mobile-phones', name: 'Mobile Phones', href: '/hr/assets/it/mobiles', description: 'Phone allocation' },
                  { id: 'monitors', name: 'Monitors', href: '/hr/assets/it/monitors', description: 'Monitor allocation' },
                  { id: 'accessories', name: 'Accessories', href: '/hr/assets/it/accessories', description: 'IT accessories' },
                ],
              },
              {
                id: 'office-assets',
                name: 'Office Assets',
                href: '#',
                description: 'Office items',
                subItems: [
                  { id: 'furniture', name: 'Furniture', href: '/hr/assets/office/furniture', description: 'Office furniture' },
                  { id: 'stationery', name: 'Stationery', href: '/hr/assets/office/stationery', description: 'Office supplies' },
                  { id: 'id-cards', name: 'ID Cards', href: '/hr/assets/office/id-cards', description: 'Identity cards' },
                  { id: 'access-cards', name: 'Access Cards', href: '/hr/assets/office/access-cards', description: 'Access control' },
                ],
              },
              {
                id: 'vehicles',
                name: 'Vehicles',
                href: '#',
                description: 'Company vehicles',
                subItems: [
                  { id: 'company-vehicles', name: 'Company Vehicles', href: '/hr/assets/vehicles/list', description: 'Vehicle list' },
                  { id: 'vehicle-assignment', name: 'Assignment', href: '/hr/assets/vehicles/assignment', description: 'Assign vehicles' },
                  { id: 'fuel-management', name: 'Fuel Management', href: '/hr/assets/vehicles/fuel', description: 'Fuel tracking' },
                ],
              },
            ],
          },
          { id: 'asset-requests', name: 'Asset Requests', href: '/hr/assets/requests', description: 'Request assets' },
          { id: 'asset-transfer', name: 'Asset Transfer', href: '/hr/assets/transfer', description: 'Transfer assets' },
          { id: 'asset-return', name: 'Asset Return', href: '/hr/assets/return', description: 'Return assets' },
          {
            id: 'maintenance',
            name: 'Maintenance & Repairs',
            href: '#',
            description: 'Asset maintenance',
            subItems: [
              { id: 'service-requests', name: 'Service Requests', href: '/hr/assets/maintenance/requests', description: 'Raise service request' },
              { id: 'preventive-maintenance', name: 'Preventive Maintenance', href: '/hr/assets/maintenance/preventive', description: 'Scheduled maintenance' },
              { id: 'amc-management', name: 'AMC Management', href: '/hr/assets/maintenance/amc', description: 'AMC contracts' },
              { id: 'repair-history', name: 'Repair History', href: '/hr/assets/maintenance/history', description: 'Past repairs' },
            ],
          },
          {
            id: 'asset-inventory',
            name: 'Asset Inventory',
            href: '#',
            description: 'Stock management',
            subItems: [
              { id: 'stock-management', name: 'Stock Management', href: '/hr/assets/inventory/stock', description: 'Available stock' },
              { id: 'stock-requests', name: 'Stock Requests', href: '/hr/assets/inventory/requests', description: 'Request from stock' },
              { id: 'stock-allocation', name: 'Stock Allocation', href: '/hr/assets/inventory/allocation', description: 'Allocate stock' },
              { id: 'stock-audit', name: 'Stock Audit', href: '/hr/assets/inventory/audit', description: 'Audit inventory' },
            ],
          },
          {
            id: 'asset-reports',
            name: 'Asset Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'asset-register', name: 'Asset Register', href: '/hr/assets/reports/register', description: 'Complete register' },
              { id: 'allocation-report', name: 'Allocation Report', href: '/hr/assets/reports/allocation', description: 'Allocation status' },
              { id: 'employee-assets', name: 'Employee Assets', href: '/hr/assets/reports/employee', description: 'Employee-wise assets' },
              { id: 'department-assets', name: 'Department Assets', href: '/hr/assets/reports/department', description: 'Dept-wise assets' },
              { id: 'maintenance-costs', name: 'Maintenance Costs', href: '/hr/assets/reports/costs', description: 'Maintenance expenses' },
            ],
          },
        ],
      },
      {
        id: 'documents',
        name: 'Document Management',
        href: '#',
        description: 'Digital documents',
        subItems: [
          {
            id: 'employee-documents',
            name: 'Employee Documents',
            href: '#',
            description: 'Personal docs',
            subItems: [
              { id: 'personal-documents', name: 'Personal Documents', href: '/hr/documents/personal', description: 'ID proofs, photos' },
              { id: 'educational-documents', name: 'Educational Documents', href: '/hr/documents/education', description: 'Degrees, certificates' },
              { id: 'employment-documents', name: 'Employment Documents', href: '/hr/documents/employment', description: 'Employment records' },
              { id: 'upload-documents', name: 'Upload Documents', href: '/hr/documents/upload', description: 'Upload new docs' },
            ],
          },
          {
            id: 'compliance-documents',
            name: 'Compliance Documents',
            href: '#',
            description: 'Statutory docs',
            subItems: [
              { id: 'statutory-forms', name: 'Statutory Forms', href: '/hr/documents/statutory', description: 'PF, ESI forms' },
              { id: 'declarations', name: 'Declarations', href: '/hr/documents/declarations', description: 'Tax declarations' },
              { id: 'nominations', name: 'Nominations', href: '/hr/documents/nominations', description: 'PF, Gratuity nominations' },
              { id: 'insurance-forms', name: 'Insurance Forms', href: '/hr/documents/insurance', description: 'Insurance docs' },
            ],
          },
          {
            id: 'hr-policies',
            name: 'HR Policies',
            href: '#',
            description: 'Company policies',
            subItems: [
              { id: 'employee-handbook', name: 'Employee Handbook', href: '/hr/documents/policies/handbook', description: 'Company handbook' },
              { id: 'leave-policy', name: 'Leave Policy', href: '/hr/documents/policies/leave', description: 'Leave guidelines' },
              { id: 'attendance-policy', name: 'Attendance Policy', href: '/hr/documents/policies/attendance', description: 'Attendance rules' },
              { id: 'expense-policy', name: 'Expense Policy', href: '/hr/documents/policies/expense', description: 'Expense guidelines' },
              { id: 'code-of-conduct', name: 'Code of Conduct', href: '/hr/documents/policies/conduct', description: 'Conduct policy' },
              { id: 'other-policies', name: 'Other Policies', href: '/hr/documents/policies/other', description: 'Other policies' },
            ],
          },
          {
            id: 'document-repository',
            name: 'Document Repository',
            href: '#',
            description: 'Document storage',
            subItems: [
              { id: 'browse-documents', name: 'Browse Documents', href: '/hr/documents/repository/browse', description: 'Browse all docs' },
              { id: 'search-documents', name: 'Search Documents', href: '/hr/documents/repository/search', description: 'Search docs' },
              { id: 'upload-docs', name: 'Upload Documents', href: '/hr/documents/repository/upload', description: 'Upload files' },
              { id: 'document-archive', name: 'Document Archive', href: '/hr/documents/repository/archive', description: 'Archived docs' },
            ],
          },
          {
            id: 'certificate-requests',
            name: 'Certificate Requests',
            href: '#',
            description: 'Request certificates',
            subItems: [
              { id: 'experience-cert-request', name: 'Experience Certificate', href: '/hr/documents/certificates/experience', description: 'Request experience cert' },
              { id: 'salary-cert-request', name: 'Salary Certificate', href: '/hr/documents/certificates/salary', description: 'Request salary cert' },
              { id: 'employment-cert-request', name: 'Employment Certificate', href: '/hr/documents/certificates/employment', description: 'Request employment cert' },
              { id: 'request-status', name: 'Request Status', href: '/hr/documents/certificates/status', description: 'Track requests' },
            ],
          },
          {
            id: 'compliance-tracking',
            name: 'Compliance Tracking',
            href: '#',
            description: 'Document compliance',
            subItems: [
              { id: 'missing-documents', name: 'Missing Documents', href: '/hr/documents/compliance/missing', description: 'Docs not uploaded' },
              { id: 'expired-documents', name: 'Expired Documents', href: '/hr/documents/compliance/expired', description: 'Expired docs' },
              { id: 'renewal-reminders', name: 'Renewal Reminders', href: '/hr/documents/compliance/renewals', description: 'Renewal alerts' },
              { id: 'audit-trail', name: 'Audit Trail', href: '/hr/documents/compliance/audit', description: 'Document audit log' },
            ],
          },
        ],
      },
      {
        id: 'performance',
        name: 'Performance Management',
        href: '#',
        description: 'Performance & appraisals',
        subItems: [
          {
            id: 'goal-setting',
            name: 'Goal Setting & OKRs',
            href: '#',
            description: 'Objectives & key results',
            subItems: [
              { id: 'set-goals', name: 'Set Goals', href: '/hr/performance/goals/set', description: 'Create objectives' },
              { id: 'my-goals', name: 'My Goals', href: '/hr/performance/goals/my', description: 'Personal goals' },
              { id: 'team-goals', name: 'Team Goals', href: '/hr/performance/goals/team', description: 'Team objectives' },
              { id: 'department-goals', name: 'Department Goals', href: '/hr/performance/goals/department', description: 'Dept objectives' },
              { id: 'goal-alignment', name: 'Goal Alignment', href: '/hr/performance/goals/alignment', description: 'Cascade goals' },
              { id: 'goal-tracking', name: 'Goal Tracking', href: '/hr/performance/goals/tracking', description: 'Progress tracking' },
            ],
          },
          {
            id: 'performance-reviews',
            name: 'Performance Reviews',
            href: '#',
            description: 'Appraisal cycles',
            subItems: [
              { id: 'review-cycles', name: 'Review Cycles', href: '/hr/performance/reviews/cycles', description: 'Appraisal periods' },
              { id: 'self-appraisal', name: 'Self Appraisal', href: '/hr/performance/reviews/self', description: 'Employee self-review' },
              { id: 'manager-review', name: 'Manager Review', href: '/hr/performance/reviews/manager', description: 'Manager assessment' },
              { id: 'peer-review', name: 'Peer Review', href: '/hr/performance/reviews/peer', description: '360-degree feedback' },
              { id: 'final-rating', name: 'Final Rating', href: '/hr/performance/reviews/rating', description: 'Consolidated ratings' },
              { id: 'review-meetings', name: 'Review Meetings', href: '/hr/performance/reviews/meetings', description: 'Schedule discussions' },
            ],
          },
          {
            id: 'continuous-feedback',
            name: 'Continuous Feedback',
            href: '#',
            description: 'Real-time feedback',
            subItems: [
              { id: 'give-feedback', name: 'Give Feedback', href: '/hr/performance/feedback/give', description: 'Provide feedback' },
              { id: 'received-feedback', name: 'Received Feedback', href: '/hr/performance/feedback/received', description: 'View feedback' },
              { id: 'feedback-requests', name: 'Feedback Requests', href: '/hr/performance/feedback/requests', description: 'Request feedback' },
              { id: 'recognition', name: 'Recognition & Praise', href: '/hr/performance/feedback/recognition', description: 'Appreciate colleagues' },
            ],
          },
          {
            id: 'kpi-management',
            name: 'KPI Management',
            href: '#',
            description: 'Key performance indicators',
            subItems: [
              { id: 'kpi-master', name: 'KPI Master', href: '/hr/performance/kpi/master', description: 'Define KPIs' },
              { id: 'kpi-assignment', name: 'KPI Assignment', href: '/hr/performance/kpi/assignment', description: 'Assign KPIs' },
              { id: 'kpi-tracking', name: 'KPI Tracking', href: '/hr/performance/kpi/tracking', description: 'Monitor KPIs' },
              { id: 'kpi-dashboard', name: 'KPI Dashboard', href: '/hr/performance/kpi/dashboard', description: 'KPI analytics' },
            ],
          },
          {
            id: 'pip',
            name: 'Performance Improvement',
            href: '#',
            description: 'PIP management',
            subItems: [
              { id: 'pip-creation', name: 'Create PIP', href: '/hr/performance/pip/create', description: 'Improvement plans' },
              { id: 'pip-tracking', name: 'PIP Tracking', href: '/hr/performance/pip/tracking', description: 'Monitor progress' },
              { id: 'pip-review', name: 'PIP Review', href: '/hr/performance/pip/review', description: 'Review outcomes' },
            ],
          },
          {
            id: 'performance-reports',
            name: 'Performance Reports',
            href: '#',
            description: 'Analytics & insights',
            subItems: [
              { id: 'performance-analytics', name: 'Performance Analytics', href: '/hr/performance/reports/analytics', description: 'Overall analytics' },
              { id: 'rating-distribution', name: 'Rating Distribution', href: '/hr/performance/reports/distribution', description: 'Rating spread' },
              { id: 'department-performance', name: 'Department Performance', href: '/hr/performance/reports/department', description: 'Dept-wise analysis' },
              { id: 'trend-analysis', name: 'Trend Analysis', href: '/hr/performance/reports/trends', description: 'Historical trends' },
            ],
          },
        ],
      },
      {
        id: 'training',
        name: 'Training & Development',
        href: '#',
        description: 'Learning & growth',
        subItems: [
          {
            id: 'training-programs',
            name: 'Training Programs',
            href: '#',
            description: 'Training catalog',
            subItems: [
              { id: 'program-catalog', name: 'Program Catalog', href: '/hr/training/programs/catalog', description: 'Available programs' },
              { id: 'create-program', name: 'Create Program', href: '/hr/training/programs/create', description: 'New training' },
              { id: 'program-schedule', name: 'Program Schedule', href: '/hr/training/programs/schedule', description: 'Training calendar' },
              { id: 'external-training', name: 'External Training', href: '/hr/training/programs/external', description: 'Outside programs' },
            ],
          },
          {
            id: 'training-enrollment',
            name: 'Enrollment & Attendance',
            href: '#',
            description: 'Registration',
            subItems: [
              { id: 'enroll-training', name: 'Enroll in Training', href: '/hr/training/enrollment/enroll', description: 'Register for training' },
              { id: 'my-trainings', name: 'My Trainings', href: '/hr/training/enrollment/my', description: 'Enrolled programs' },
              { id: 'training-attendance', name: 'Training Attendance', href: '/hr/training/enrollment/attendance', description: 'Mark attendance' },
              { id: 'waiting-list', name: 'Waiting List', href: '/hr/training/enrollment/waiting', description: 'Training waitlist' },
            ],
          },
          {
            id: 'skill-development',
            name: 'Skill Development',
            href: '#',
            description: 'Competency building',
            subItems: [
              { id: 'skill-matrix', name: 'Skill Matrix', href: '/hr/training/skills/matrix', description: 'Competency framework' },
              { id: 'skill-assessment', name: 'Skill Assessment', href: '/hr/training/skills/assessment', description: 'Evaluate skills' },
              { id: 'skill-gap-analysis', name: 'Skill Gap Analysis', href: '/hr/training/skills/gap', description: 'Identify gaps' },
              { id: 'certification-tracking', name: 'Certification Tracking', href: '/hr/training/skills/certifications', description: 'Track certifications' },
            ],
          },
          {
            id: 'training-effectiveness',
            name: 'Training Effectiveness',
            href: '#',
            description: 'Evaluation',
            subItems: [
              { id: 'training-feedback', name: 'Training Feedback', href: '/hr/training/effectiveness/feedback', description: 'Participant feedback' },
              { id: 'assessments', name: 'Assessments & Tests', href: '/hr/training/effectiveness/assessments', description: 'Evaluate learning' },
              { id: 'training-impact', name: 'Training Impact', href: '/hr/training/effectiveness/impact', description: 'Measure effectiveness' },
            ],
          },
          {
            id: 'elearning',
            name: 'E-Learning',
            href: '#',
            description: 'Online learning',
            subItems: [
              { id: 'course-library', name: 'Course Library', href: '/hr/training/elearning/library', description: 'Online courses' },
              { id: 'my-courses', name: 'My Courses', href: '/hr/training/elearning/my', description: 'Enrolled courses' },
              { id: 'course-progress', name: 'Course Progress', href: '/hr/training/elearning/progress', description: 'Learning progress' },
              { id: 'certifications', name: 'Certifications', href: '/hr/training/elearning/certifications', description: 'Course certificates' },
            ],
          },
          {
            id: 'training-budget',
            name: 'Training Budget',
            href: '#',
            description: 'Budget management',
            subItems: [
              { id: 'budget-allocation', name: 'Budget Allocation', href: '/hr/training/budget/allocation', description: 'Allocate budget' },
              { id: 'budget-tracking', name: 'Budget Tracking', href: '/hr/training/budget/tracking', description: 'Track spending' },
              { id: 'training-costs', name: 'Training Costs', href: '/hr/training/budget/costs', description: 'Cost analysis' },
            ],
          },
          {
            id: 'training-reports',
            name: 'Training Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'training-summary', name: 'Training Summary', href: '/hr/training/reports/summary', description: 'Overall summary' },
              { id: 'employee-training', name: 'Employee Training', href: '/hr/training/reports/employee', description: 'Employee-wise report' },
              { id: 'department-training', name: 'Department Training', href: '/hr/training/reports/department', description: 'Dept-wise report' },
              { id: 'training-hours', name: 'Training Hours', href: '/hr/training/reports/hours', description: 'Hours analytics' },
            ],
          },
        ],
      },
      {
        id: 'succession',
        name: 'Succession Planning',
        href: '#',
        description: 'Leadership pipeline',
        subItems: [
          {
            id: 'critical-positions',
            name: 'Critical Positions',
            href: '#',
            description: 'Key roles',
            subItems: [
              { id: 'identify-positions', name: 'Identify Positions', href: '/hr/succession/positions/identify', description: 'Define critical roles' },
              { id: 'position-profiles', name: 'Position Profiles', href: '/hr/succession/positions/profiles', description: 'Role requirements' },
              { id: 'risk-assessment', name: 'Risk Assessment', href: '/hr/succession/positions/risk', description: 'Succession risk' },
            ],
          },
          {
            id: 'talent-pool',
            name: 'Talent Pool',
            href: '#',
            description: 'High potential employees',
            subItems: [
              { id: 'identify-talent', name: 'Identify Talent', href: '/hr/succession/talent/identify', description: 'HiPo identification' },
              { id: 'talent-profiles', name: 'Talent Profiles', href: '/hr/succession/talent/profiles', description: 'Successor profiles' },
              { id: 'readiness-assessment', name: 'Readiness Assessment', href: '/hr/succession/talent/readiness', description: 'Successor readiness' },
              { id: 'talent-development', name: 'Talent Development', href: '/hr/succession/talent/development', description: 'Development plans' },
            ],
          },
          {
            id: 'succession-plans',
            name: 'Succession Plans',
            href: '#',
            description: 'Succession strategies',
            subItems: [
              { id: 'create-plan', name: 'Create Plan', href: '/hr/succession/plans/create', description: 'New succession plan' },
              { id: 'plan-tracking', name: 'Plan Tracking', href: '/hr/succession/plans/tracking', description: 'Monitor plans' },
              { id: 'succession-matrix', name: 'Succession Matrix', href: '/hr/succession/plans/matrix', description: '9-box grid' },
            ],
          },
          {
            id: 'development-programs',
            name: 'Development Programs',
            href: '#',
            description: 'Leadership development',
            subItems: [
              { id: 'leadership-programs', name: 'Leadership Programs', href: '/hr/succession/development/leadership', description: 'Leadership training' },
              { id: 'mentoring', name: 'Mentoring Programs', href: '/hr/succession/development/mentoring', description: 'Mentorship' },
              { id: 'job-rotation', name: 'Job Rotation', href: '/hr/succession/development/rotation', description: 'Cross-functional moves' },
            ],
          },
          {
            id: 'succession-reports',
            name: 'Succession Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'bench-strength', name: 'Bench Strength', href: '/hr/succession/reports/bench-strength', description: 'Talent depth' },
              { id: 'succession-coverage', name: 'Succession Coverage', href: '/hr/succession/reports/coverage', description: 'Coverage ratio' },
              { id: 'talent-analytics', name: 'Talent Analytics', href: '/hr/succession/reports/analytics', description: 'Talent insights' },
            ],
          },
        ],
      },
      {
        id: 'health-safety',
        name: 'Health & Safety',
        href: '#',
        description: 'Workplace safety',
        subItems: [
          {
            id: 'safety-management',
            name: 'Safety Management',
            href: '#',
            description: 'Safety programs',
            subItems: [
              { id: 'safety-policies', name: 'Safety Policies', href: '/hr/safety/management/policies', description: 'Safety guidelines' },
              { id: 'safety-procedures', name: 'Safety Procedures', href: '/hr/safety/management/procedures', description: 'SOP documents' },
              { id: 'safety-training', name: 'Safety Training', href: '/hr/safety/management/training', description: 'Safety programs' },
              { id: 'safety-committee', name: 'Safety Committee', href: '/hr/safety/management/committee', description: 'Committee management' },
            ],
          },
          {
            id: 'incident-management',
            name: 'Incident Management',
            href: '#',
            description: 'Incident tracking',
            subItems: [
              { id: 'report-incident', name: 'Report Incident', href: '/hr/safety/incidents/report', description: 'Log incidents' },
              { id: 'incident-investigation', name: 'Incident Investigation', href: '/hr/safety/incidents/investigation', description: 'Root cause analysis' },
              { id: 'incident-tracking', name: 'Incident Tracking', href: '/hr/safety/incidents/tracking', description: 'Monitor incidents' },
              { id: 'near-miss', name: 'Near Miss Reports', href: '/hr/safety/incidents/near-miss', description: 'Near miss logging' },
            ],
          },
          {
            id: 'risk-assessment',
            name: 'Risk Assessment',
            href: '#',
            description: 'Hazard identification',
            subItems: [
              { id: 'hazard-identification', name: 'Hazard Identification', href: '/hr/safety/risk/hazards', description: 'Identify hazards' },
              { id: 'risk-evaluation', name: 'Risk Evaluation', href: '/hr/safety/risk/evaluation', description: 'Assess risks' },
              { id: 'control-measures', name: 'Control Measures', href: '/hr/safety/risk/controls', description: 'Risk mitigation' },
              { id: 'risk-register', name: 'Risk Register', href: '/hr/safety/risk/register', description: 'Risk database' },
            ],
          },
          {
            id: 'inspections-audits',
            name: 'Inspections & Audits',
            href: '#',
            description: 'Safety audits',
            subItems: [
              { id: 'safety-inspections', name: 'Safety Inspections', href: '/hr/safety/audits/inspections', description: 'Conduct inspections' },
              { id: 'audit-schedule', name: 'Audit Schedule', href: '/hr/safety/audits/schedule', description: 'Plan audits' },
              { id: 'audit-findings', name: 'Audit Findings', href: '/hr/safety/audits/findings', description: 'Findings & actions' },
              { id: 'corrective-actions', name: 'Corrective Actions', href: '/hr/safety/audits/actions', description: 'CAPA tracking' },
            ],
          },
          {
            id: 'ppe-management',
            name: 'PPE Management',
            href: '#',
            description: 'Personal protective equipment',
            subItems: [
              { id: 'ppe-issuance', name: 'PPE Issuance', href: '/hr/safety/ppe/issuance', description: 'Issue PPE' },
              { id: 'ppe-tracking', name: 'PPE Tracking', href: '/hr/safety/ppe/tracking', description: 'Track PPE usage' },
              { id: 'ppe-inventory', name: 'PPE Inventory', href: '/hr/safety/ppe/inventory', description: 'Stock management' },
            ],
          },
          {
            id: 'emergency-response',
            name: 'Emergency Response',
            href: '#',
            description: 'Emergency preparedness',
            subItems: [
              { id: 'emergency-plans', name: 'Emergency Plans', href: '/hr/safety/emergency/plans', description: 'Response plans' },
              { id: 'evacuation-drills', name: 'Evacuation Drills', href: '/hr/safety/emergency/drills', description: 'Drill management' },
              { id: 'emergency-contacts', name: 'Emergency Contacts', href: '/hr/safety/emergency/contacts', description: 'Contact list' },
            ],
          },
          {
            id: 'health-wellness',
            name: 'Health & Wellness',
            href: '#',
            description: 'Employee wellbeing',
            subItems: [
              { id: 'health-checkups', name: 'Health Checkups', href: '/hr/safety/wellness/checkups', description: 'Medical exams' },
              { id: 'wellness-programs', name: 'Wellness Programs', href: '/hr/safety/wellness/programs', description: 'Wellness initiatives' },
              { id: 'occupational-health', name: 'Occupational Health', href: '/hr/safety/wellness/occupational', description: 'Work-related health' },
              { id: 'ergonomics', name: 'Ergonomics', href: '/hr/safety/wellness/ergonomics', description: 'Workplace ergonomics' },
            ],
          },
          {
            id: 'safety-reports',
            name: 'Safety Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'incident-analytics', name: 'Incident Analytics', href: '/hr/safety/reports/analytics', description: 'Incident trends' },
              { id: 'safety-kpi', name: 'Safety KPIs', href: '/hr/safety/reports/kpi', description: 'Safety metrics' },
              { id: 'compliance-reports', name: 'Compliance Reports', href: '/hr/safety/reports/compliance', description: 'Regulatory compliance' },
            ],
          },
        ],
      },
      {
        id: 'hr-compliance',
        name: 'HR Compliance',
        href: '#',
        description: 'Legal & regulatory',
        subItems: [
          {
            id: 'labor-laws',
            name: 'Labor Laws',
            href: '#',
            description: 'Labor compliance',
            subItems: [
              { id: 'compliance-tracker', name: 'Compliance Tracker', href: '/hr/compliance/labor/tracker', description: 'Track compliance' },
              { id: 'labor-registers', name: 'Labor Registers', href: '/hr/compliance/labor/registers', description: 'Statutory registers' },
              { id: 'compliance-calendar', name: 'Compliance Calendar', href: '/hr/compliance/labor/calendar', description: 'Due dates' },
            ],
          },
          {
            id: 'statutory-returns',
            name: 'Statutory Returns',
            href: '#',
            description: 'Government filings',
            subItems: [
              { id: 'pf-returns', name: 'PF Returns', href: '/hr/compliance/returns/pf', description: 'PF filing' },
              { id: 'esi-returns', name: 'ESI Returns', href: '/hr/compliance/returns/esi', description: 'ESI filing' },
              { id: 'tds-returns', name: 'TDS Returns', href: '/hr/compliance/returns/tds', description: 'TDS filing' },
              { id: 'pt-returns', name: 'PT Returns', href: '/hr/compliance/returns/pt', description: 'Professional tax' },
              { id: 'lwf-returns', name: 'LWF Returns', href: '/hr/compliance/returns/lwf', description: 'Labor welfare fund' },
            ],
          },
          {
            id: 'license-registrations',
            name: 'Licenses & Registrations',
            href: '#',
            description: 'License management',
            subItems: [
              { id: 'license-master', name: 'License Master', href: '/hr/compliance/licenses/master', description: 'All licenses' },
              { id: 'renewal-tracking', name: 'Renewal Tracking', href: '/hr/compliance/licenses/renewals', description: 'License renewals' },
              { id: 'compliance-certificates', name: 'Compliance Certificates', href: '/hr/compliance/licenses/certificates', description: 'Certificates' },
            ],
          },
          {
            id: 'policy-compliance',
            name: 'Policy Compliance',
            href: '#',
            description: 'Internal policies',
            subItems: [
              { id: 'policy-acknowledgment', name: 'Policy Acknowledgment', href: '/hr/compliance/policy/acknowledgment', description: 'Employee acceptance' },
              { id: 'policy-violations', name: 'Policy Violations', href: '/hr/compliance/policy/violations', description: 'Track violations' },
              { id: 'disciplinary-actions', name: 'Disciplinary Actions', href: '/hr/compliance/policy/disciplinary', description: 'Disciplinary process' },
            ],
          },
          {
            id: 'equal-opportunity',
            name: 'Equal Opportunity',
            href: '#',
            description: 'Diversity & inclusion',
            subItems: [
              { id: 'diversity-metrics', name: 'Diversity Metrics', href: '/hr/compliance/diversity/metrics', description: 'D&I analytics' },
              { id: 'eeo-reports', name: 'EEO Reports', href: '/hr/compliance/diversity/eeo', description: 'Equal opportunity' },
              { id: 'grievance-redressal', name: 'Grievance Redressal', href: '/hr/compliance/diversity/grievance', description: 'Complaint handling' },
              { id: 'posh-compliance', name: 'POSH Compliance', href: '/hr/compliance/diversity/posh', description: 'Sexual harassment prevention' },
            ],
          },
          {
            id: 'audit-compliance',
            name: 'Audit & Compliance',
            href: '#',
            description: 'Compliance audits',
            subItems: [
              { id: 'compliance-audits', name: 'Compliance Audits', href: '/hr/compliance/audit/audits', description: 'Schedule audits' },
              { id: 'audit-findings', name: 'Audit Findings', href: '/hr/compliance/audit/findings', description: 'Audit results' },
              { id: 'remediation', name: 'Remediation Plans', href: '/hr/compliance/audit/remediation', description: 'Fix non-compliance' },
            ],
          },
          {
            id: 'compliance-reports',
            name: 'Compliance Reports',
            href: '#',
            description: 'Reporting',
            subItems: [
              { id: 'compliance-dashboard', name: 'Compliance Dashboard', href: '/hr/compliance/reports/dashboard', description: 'Overall status' },
              { id: 'statutory-reports', name: 'Statutory Reports', href: '/hr/compliance/reports/statutory', description: 'Legal reports' },
              { id: 'compliance-alerts', name: 'Compliance Alerts', href: '/hr/compliance/reports/alerts', description: 'Due date alerts' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    hoverColor: 'hover:bg-lime-100',
    subItems: [
      { id: 'shipping', name: 'Shipping', href: '/logistics/shipping', description: 'Shipment management' },
      { id: 'tracking', name: 'Tracking', href: '/logistics/tracking', description: 'Track shipments' },
      { id: 'carriers', name: 'Carriers', href: '/logistics/carriers', description: 'Carrier management' },
      { id: 'transporter-master', name: 'Transporter Master', href: '/logistics/transporter-master', description: 'Transport companies' },
      { id: 'vehicle-master', name: 'Vehicle Master', href: '/logistics/vehicle-master', description: 'Fleet management' },
      { id: 'driver-master', name: 'Driver Master', href: '/logistics/driver-master', description: 'Driver database' },
      { id: 'route-master', name: 'Route Master', href: '/logistics/route-master', description: 'Delivery routes' },
      { id: 'packaging-master', name: 'Packaging Master', href: '/logistics/packaging-master', description: 'Packaging types' },
      { id: 'freight-master', name: 'Freight Master', href: '/logistics/freight-master', description: 'Freight terms' },
      { id: 'port-master', name: 'Port/Terminal Master', href: '/logistics/port-master', description: 'Ports & terminals' },
    ],
  },
  {
    id: 'after-sales-service',
    name: 'After Sales Service',
    icon: Wrench,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100',
    subItems: [
      { id: 'ass-dashboard', name: 'Service Dashboard', href: '/after-sales-service/dashboard', description: 'Main overview' },
      { id: 'ass-analytics', name: 'Analytics', href: '/after-sales-service/dashboard/analytics', description: 'Service analytics' },
      { id: 'ass-reports', name: 'Reports', href: '/after-sales-service/dashboard/reports', description: 'Service reports' },
      { id: 'service-contracts', name: 'Service Contracts', href: '/after-sales-service/service-contracts', description: 'AMC management' },
      { id: 'contract-terms', name: 'Contract Terms', href: '/after-sales-service/service-contracts/terms', description: 'Contract terms' },
      { id: 'warranties', name: 'Warranties', href: '/after-sales-service/warranties', description: 'Warranty tracking' },
      { id: 'warranty-claims', name: 'Warranty Claims', href: '/after-sales-service/warranties/claims', description: 'Claim processing' },
      { id: 'service-requests', name: 'Service Requests', href: '/after-sales-service/service-requests', description: 'Ticket management' },
      { id: 'sla-dashboard', name: 'SLA Dashboard', href: '/after-sales-service/service-requests/sla-dashboard', description: 'SLA tracking' },
      { id: 'installations', name: 'Installations', href: '/after-sales-service/installations', description: 'Installation jobs' },
      { id: 'installation-calendar', name: 'Installation Calendar', href: '/after-sales-service/installations/calendar', description: 'Schedule calendar' },
      { id: 'field-service', name: 'Field Service', href: '/after-sales-service/field-service', description: 'Field operations' },
      { id: 'field-dispatch', name: 'Dispatch', href: '/after-sales-service/field-service/dispatch', description: 'Dispatch management' },
      { id: 'field-schedule', name: 'Schedule', href: '/after-sales-service/field-service/schedule', description: 'Field scheduling' },
      { id: 'billing', name: 'Service Billing', href: '/after-sales-service/billing', description: 'Invoice management' },
      { id: 'billing-payments', name: 'Payments', href: '/after-sales-service/billing/payments', description: 'Payment tracking' },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: Headphones,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    hoverColor: 'hover:bg-rose-100',
    subItems: [
      { id: 'tickets', name: 'Support Tickets', href: '/support/tickets', description: 'Ticket management' },
      { id: 'incidents', name: 'Incidents', href: '/support/incidents', description: 'Incident tracking' },
      { id: 'knowledge', name: 'Knowledge Base', href: '/support/knowledge', description: 'Documentation' },
    ],
  },
  {
    id: 'common-masters',
    name: 'Common Masters',
    icon: Database,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    hoverColor: 'hover:bg-slate-100',
    subItems: [
      {
        id: 'organization-masters',
        name: 'Organization Masters',
        href: '#',
        description: 'Company & branch setup',
        subItems: [
          { id: 'company-master', name: 'Company Master', href: '/common-masters/company-master', description: 'Multiple company/entity management' },
          { id: 'branch-master', name: 'Branch/Location Master', href: '/common-masters/branch-master', description: 'All operational locations' },
          { id: 'department-master', name: 'Department Master', href: '/common-masters/department-master', description: 'Organizational departments' },
          { id: 'cost-center-master', name: 'Cost Center Master', href: '/common-masters/cost-center-master', description: 'Cost allocation centers' },
          { id: 'plant-master', name: 'Plant/Factory Master', href: '/common-masters/plant-master', description: 'Manufacturing facilities' },
          { id: 'warehouse-master', name: 'Warehouse Master', href: '/common-masters/warehouse-master', description: 'Storage locations' },
          { id: 'currency-master', name: 'Currency Master', href: '/common-masters/currency-master', description: 'Multi-currency support' },
          { id: 'exchange-rate-master', name: 'Exchange Rate Master', href: '/common-masters/exchange-rate-master', description: 'Currency conversion rates' },
        ],
      },
      {
        id: 'product-item-masters',
        name: 'Product & Item Masters',
        href: '#',
        description: 'Product catalog & materials',
        subItems: [
          { id: 'item-master', name: 'Item Master', href: '/common-masters/item-master', description: 'Complete product/material catalog' },
          { id: 'item-category-master', name: 'Item Category Master', href: '/common-masters/item-category-master', description: 'Product categorization' },
          { id: 'item-group-master', name: 'Item Group Master', href: '/common-masters/item-group-master', description: 'Product grouping' },
          { id: 'brand-master', name: 'Brand Master', href: '/common-masters/brand-master', description: 'Product brands' },
          { id: 'uom-master', name: 'Unit of Measure Master', href: '/common-masters/uom-master', description: 'Measurement units' },
          { id: 'uom-conversion-master', name: 'UOM Conversion Master', href: '/common-masters/uom-conversion-master', description: 'Unit conversions' },
          { id: 'hsn-sac-master', name: 'HSN/SAC Code Master', href: '/common-masters/hsn-sac-master', description: 'Tax classification codes' },
          { id: 'barcode-master', name: 'Barcode Master', href: '/common-masters/barcode-master', description: 'Product identification' },
        ],
      },
      {
        id: 'customer-vendor-masters',
        name: 'Customer & Vendor Masters',
        href: '#',
        description: 'Business partners',
        subItems: [
          { id: 'customer-master', name: 'Customer Master', href: '/common-masters/customer-master', description: 'Client database' },
          { id: 'customer-category-master', name: 'Customer Category Master', href: '/common-masters/customer-category-master', description: 'Customer classification' },
          { id: 'vendor-master', name: 'Vendor/Supplier Master', href: '/common-masters/vendor-master', description: 'Supplier database' },
          { id: 'vendor-category-master', name: 'Vendor Category Master', href: '/common-masters/vendor-category-master', description: 'Supplier classification' },
        ],
      },
      {
        id: 'financial-masters',
        name: 'Financial Masters',
        href: '#',
        description: 'Accounting & finance',
        subItems: [
          { id: 'chart-of-accounts-master', name: 'Chart of Accounts Master', href: '/common-masters/chart-of-accounts-master', description: 'Account structure' },
          { id: 'bank-master', name: 'Bank Master', href: '/common-masters/bank-master', description: 'Banking information' },
          { id: 'tax-master', name: 'Tax Master', href: '/common-masters/tax-master', description: 'Tax codes and rates' },
          { id: 'payment-terms-master', name: 'Payment Terms Master', href: '/common-masters/payment-terms-master', description: 'Payment conditions' },
          { id: 'price-list-master', name: 'Price List Master', href: '/common-masters/price-list-master', description: 'Pricing structures' },
        ],
      },
      {
        id: 'geographic-masters',
        name: 'Geographic Masters',
        href: '#',
        description: 'Locations & territories',
        subItems: [
          { id: 'country-master', name: 'Country Master', href: '/common-masters/country-master', description: 'Global locations' },
          { id: 'state-master', name: 'State/Province Master', href: '/common-masters/state-master', description: 'Regional divisions' },
          { id: 'city-master', name: 'City Master', href: '/common-masters/city-master', description: 'City database' },
          { id: 'territory-master', name: 'Territory Master', href: '/common-masters/territory-master', description: 'Sales territories' },
        ],
      },
      {
        id: 'hr-masters',
        name: 'HR Masters',
        href: '#',
        description: 'Human resources',
        subItems: [
          { id: 'employee-master', name: 'Employee Master', href: '/common-masters/employee-master', description: 'Personnel database' },
          { id: 'designation-master', name: 'Designation Master', href: '/common-masters/designation-master', description: 'Job positions' },
          { id: 'shift-master', name: 'Shift Master', href: '/common-masters/shift-master', description: 'Work schedules' },
          { id: 'holiday-master', name: 'Holiday Master', href: '/common-masters/holiday-master', description: 'Calendar management' },
        ],
      },
      {
        id: 'manufacturing-masters',
        name: 'Manufacturing Masters',
        href: '#',
        description: 'Production resources',
        subItems: [
          { id: 'machine-master', name: 'Machine Master', href: '/common-masters/machine-master', description: 'Equipment database' },
          { id: 'work-center-master', name: 'Work Center Master', href: '/common-masters/work-center-master', description: 'Production centers' },
          { id: 'operation-master', name: 'Operation Master', href: '/common-masters/operation-master', description: 'Manufacturing processes' },
          { id: 'routing-master', name: 'Routing Master', href: '/common-masters/routing-master', description: 'Process routing' },
          { id: 'tool-master', name: 'Tool Master', href: '/common-masters/tool-master', description: 'Manufacturing tools' },
          { id: 'quality-parameter-master', name: 'Quality Parameter Master', href: '/common-masters/quality-parameter-master', description: 'Quality standards' },
          { id: 'skill-master', name: 'Skill Master', href: '/common-masters/skill-master', description: 'Worker skills' },
          { id: 'batch-lot-master', name: 'Batch/Lot Master', href: '/common-masters/batch-lot-master', description: 'Batch tracking' },
        ],
      },
      {
        id: 'kitchen-masters',
        name: 'Kitchen Manufacturing',
        href: '#',
        description: 'Kitchen specific masters',
        subItems: [
          { id: 'cabinet-type-master', name: 'Cabinet Type Master', href: '/common-masters/cabinet-type-master', description: 'Cabinet categories' },
          { id: 'hardware-master', name: 'Hardware Master', href: '/common-masters/hardware-master', description: 'Fittings & accessories' },
          { id: 'finish-master', name: 'Finish Master', href: '/common-masters/finish-master', description: 'Surface treatments' },
          { id: 'material-grade-master', name: 'Material Grade Master', href: '/common-masters/material-grade-master', description: 'Quality grades' },
          { id: 'kitchen-layout-master', name: 'Kitchen Layout Master', href: '/common-masters/kitchen-layout-master', description: 'Layout templates' },
          { id: 'installation-type-master', name: 'Installation Type Master', href: '/common-masters/installation-type-master', description: 'Installation methods' },
          { id: 'appliance-master', name: 'Appliance Master', href: '/common-masters/appliance-master', description: 'Appliance catalog' },
          { id: 'counter-material-master', name: 'Counter Material Master', href: '/common-masters/counter-material-master', description: 'Counter materials' },
        ],
      },
      {
        id: 'system-masters',
        name: 'System Masters',
        href: '#',
        description: 'System configuration',
        subItems: [
          { id: 'user-master', name: 'User Master', href: '/common-masters/user-master', description: 'System users' },
          { id: 'role-master', name: 'Role Master', href: '/common-masters/role-master', description: 'User permissions' },
          { id: 'document-type-master', name: 'Document Type Master', href: '/common-masters/document-type-master', description: 'Document categories' },
          { id: 'number-series-master', name: 'Number Series Master', href: '/common-masters/number-series-master', description: 'Auto-numbering' },
        ],
      },
    ],
  },
  {
    id: 'it-admin',
    name: 'IT Admin',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    subItems: [
      { id: 'users', name: 'User Management', href: '/it-admin/users', description: 'Manage users' },
      { id: 'roles', name: 'Roles & Permissions', href: '/it-admin/roles', description: 'Role management' },
      { id: 'system', name: 'System Settings', href: '/it-admin/system', description: 'System config' },
      { id: 'audit', name: 'Audit Logs', href: '/it-admin/audit', description: 'Activity logs' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);

    // Auto-close other menus
    if (!newExpanded.has(itemId)) {
      newExpanded.clear();
      newExpanded.add(itemId);
    } else {
      newExpanded.delete(itemId);
      // Clear sub-items when closing main item
      const newSubExpanded = new Set(expandedSubItems);
      newSubExpanded.forEach(subId => {
        if (subId.startsWith(itemId + '-')) {
          newSubExpanded.delete(subId);
        }
      });
      setExpandedSubItems(newSubExpanded);
    }

    setExpandedItems(newExpanded);
  };

  const toggleSubItem = (parentId: string, subItemId: string) => {
    const fullId = `${parentId}-${subItemId}`;
    const newExpanded = new Set(expandedSubItems);

    if (newExpanded.has(fullId)) {
      newExpanded.delete(fullId);
    } else {
      newExpanded.add(fullId);
    }

    setExpandedSubItems(newExpanded);
  };

  const renderSubMenu = (subItems: SubMenuItem[], parentId: string, level: number = 1) => {
    return (
      <div className={`${level === 1 ? 'bg-gradient-to-r from-slate-50 to-white' : 'bg-white'} border-l-2 border-slate-300 ml-4`}>
        {subItems.map((subItem) => {
          const hasNestedItems = subItem.subItems && subItem.subItems.length > 0;
          const fullId = `${parentId}-${subItem.id}`;
          const isExpanded = expandedSubItems.has(fullId);

          return (
            <div key={subItem.id}>
              {hasNestedItems ? (
                <button
                  onClick={() => toggleSubItem(parentId, subItem.id)}
                  className={`w-full flex items-center justify-between px-${6 + level * 2} py-2.5 text-sm hover:bg-slate-100 transition-all duration-200 group ${
                    isExpanded ? 'bg-slate-100 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChevronRight className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {subItem.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={subItem.href}
                  className={`block px-${6 + level * 2} py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {subItem.name}
                    </span>
                  </div>
                  {subItem.description && (
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {subItem.description}
                    </span>
                  )}
                </Link>
              )}

              {/* Nested sub-items */}
              {hasNestedItems && isExpanded && isOpen && (
                <div className="animate-slideDown">
                  {renderSubMenu(subItem.subItems!, parentId, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0 lg:w-20'
        } overflow-hidden flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          {isOpen && (
            <h2 className="text-lg font-bold text-white tracking-wide">B3 MACBIS</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} className="mb-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 ${
                      isExpanded
                        ? `${item.bgColor} border-l-4 border-${item.color.replace('text-', '')}`
                        : item.hoverColor
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${item.color} ${isExpanded ? 'scale-110' : ''} transition-transform duration-200`} />
                      {isOpen && (
                        <span className={`font-medium ${isExpanded ? item.color : 'text-gray-700'} transition-colors duration-200`}>
                          {item.name}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        className={`h-4 w-4 ${item.color} transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`flex items-center space-x-3 px-4 py-3 ${item.hoverColor} transition-all duration-200 border-l-4 border-transparent hover:border-${item.color.replace('text-', '')}`}
                  >
                    <Icon className={`h-5 w-5 ${item.color} hover:scale-110 transition-transform duration-200`} />
                    {isOpen && (
                      <span className="font-medium text-gray-700">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Sub-items with smooth animation */}
                {hasSubItems && isExpanded && isOpen && (
                  <div className="animate-slideDown">
                    {renderSubMenu(item.subItems!, item.id)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-slate-50 to-white">
            <p className="text-xs text-gray-600 text-center font-semibold">
              B3 MACBIS - Kitchen Manufacturing ERP
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Powered by KreupAI Technologies LLC
            </p>
          </div>
        )}
      </aside>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </>
  );
}
