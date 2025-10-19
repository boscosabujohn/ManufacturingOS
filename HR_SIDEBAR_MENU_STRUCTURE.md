# 🏢 HR Module - Sidebar Menu Structure

**For Implementation in**: `b3-erp/frontend/src/components/Sidebar.tsx`
**Version**: 1.0
**Date**: 2025-10-19

---

## 📋 Complete HR Menu Hierarchy

```
HR
├── 👥 Employee Management
│   ├── Employee Directory
│   │   ├── All Employees
│   │   ├── Active Employees
│   │   ├── Inactive Employees
│   │   ├── On Probation
│   │   └── Contract Employees
│   ├── Employee Profiles
│   ├── Organization Structure
│   │   ├── Organization Chart
│   │   ├── Departments
│   │   ├── Teams
│   │   └── Designations
│   ├── Transfers & Promotions
│   └── Separations
│
├── ⏰ Time & Attendance
│   ├── Attendance
│   │   ├── Mark Attendance
│   │   ├── Daily Attendance
│   │   ├── Monthly Register
│   │   ├── Attendance Calendar
│   │   └── Attendance Reports
│   ├── Shift Management
│   │   ├── Shift Master
│   │   ├── Shift Roster
│   │   ├── Shift Assignment
│   │   └── Shift Swaps
│   ├── Overtime Management
│   │   ├── OT Requests
│   │   ├── OT Approval
│   │   ├── OT Reports
│   │   └── Compensatory Off
│   ├── Timesheets
│   │   ├── Timesheet Entry
│   │   ├── Timesheet Approval
│   │   └── Project Hours
│   └── Settings
│       ├── Attendance Policies
│       ├── Working Hours
│       └── Biometric Devices
│
├── 🌴 Leave Management
│   ├── Leave Application
│   │   ├── Apply Leave
│   │   ├── My Leave History
│   │   ├── Team Leave Calendar
│   │   └── Leave Status
│   ├── Leave Approvals
│   ├── Leave Balance
│   │   ├── My Balance
│   │   ├── Team Balance
│   │   └── Department Balance
│   ├── Leave Encashment
│   │   ├── Encashment Requests
│   │   ├── Encashment Approval
│   │   └── Encashment History
│   ├── Leave Types
│   ├── Leave Policies
│   └── Leave Reports
│       ├── Leave Summary
│       ├── Department Report
│       └── Analytics
│
├── 💰 Payroll Management
│   ├── Salary Structure
│   │   ├── Components Master
│   │   ├── Salary Templates
│   │   ├── Employee Assignments
│   │   └── Revision History
│   ├── Payroll Processing
│   │   ├── Run Payroll
│   │   ├── Payroll Calendar
│   │   ├── Payroll Verification
│   │   └── Salary Disbursement
│   ├── Statutory Compliance
│   │   ├── Income Tax
│   │   │   ├── TDS Calculation
│   │   │   ├── Tax Declarations
│   │   │   ├── Form 16
│   │   │   └── Tax Reports
│   │   ├── Provident Fund
│   │   │   ├── PF Contribution
│   │   │   ├── PF Returns (ECR)
│   │   │   └── UAN Management
│   │   ├── ESI
│   │   │   ├── ESI Contribution
│   │   │   └── ESI Returns
│   │   └── Professional Tax
│   ├── Salary Revisions
│   │   ├── Annual Increment
│   │   ├── Performance Increment
│   │   ├── Arrears Calculation
│   │   └── Revision Letters
│   ├── Bonus & Incentives
│   │   ├── Annual Bonus
│   │   ├── Performance Bonus
│   │   ├── Incentive Schemes
│   │   └── Processing
│   ├── Loans & Advances
│   │   ├── Loan Requests
│   │   ├── Loan Approval
│   │   ├── EMI Schedule
│   │   ├── Advance Requests
│   │   └── Recovery Tracking
│   └── Payroll Reports
│       ├── Payslips
│       ├── Salary Register
│       ├── Bank Statement
│       ├── Department Cost
│       ├── PF Report
│       ├── ESI Report
│       └── TDS Report
│
├── 🧳 Expenses & Travel
│   ├── Expense Management
│   │   ├── Submit Expense
│   │   ├── My Expenses
│   │   ├── Pending Approvals
│   │   ├── Approved Expenses
│   │   └── Rejected Expenses
│   ├── Travel Management
│   │   ├── Travel Requests
│   │   ├── Travel Bookings
│   │   │   ├── Flight Booking
│   │   │   ├── Hotel Booking
│   │   │   └── Cab Booking
│   │   ├── Travel Advances
│   │   └── Travel History
│   ├── Reimbursements
│   │   ├── Pending Claims
│   │   ├── Processing
│   │   ├── Paid Claims
│   │   └── Settlement
│   ├── Corporate Cards
│   │   ├── Card Management
│   │   ├── Transactions
│   │   └── Reconciliation
│   ├── Settings
│   │   ├── Expense Categories
│   │   ├── Expense Policies
│   │   ├── Per Diem Rates
│   │   └── Approval Matrix
│   └── Reports
│       ├── Expense Summary
│       ├── Travel Analytics
│       ├── Department Expenses
│       └── Budget vs Actual
│
├── 🚪 Onboarding & Offboarding
│   ├── Onboarding
│   │   ├── Pre-joining
│   │   │   ├── Offer Management
│   │   │   ├── Document Collection
│   │   │   ├── Background Verification
│   │   │   └── Medical Checkup
│   │   ├── Joining Process
│   │   │   ├── First Day Setup
│   │   │   ├── ID Card Generation
│   │   │   ├── System Access
│   │   │   └── Welcome Kit
│   │   ├── Orientation
│   │   │   ├── HR Induction
│   │   │   ├── Department Induction
│   │   │   ├── Training Schedule
│   │   │   └── Policy Acknowledgment
│   │   └── Onboarding Checklist
│   ├── Probation Management
│   │   ├── Probation Tracking
│   │   ├── Review Schedule
│   │   ├── Feedback Collection
│   │   └── Confirmation Process
│   ├── Offboarding
│   │   ├── Resignations
│   │   │   ├── Resignation Requests
│   │   │   ├── Notice Period
│   │   │   ├── Early Release
│   │   │   └── Acceptance
│   │   ├── Exit Clearance
│   │   │   ├── Clearance Checklist
│   │   │   ├── IT Clearance
│   │   │   ├── HR Clearance
│   │   │   ├── Finance Clearance
│   │   │   └── Asset Return
│   │   ├── Exit Interview
│   │   ├── Full & Final Settlement
│   │   │   ├── Salary Calculation
│   │   │   ├── Leave Encashment
│   │   │   ├── Gratuity
│   │   │   └── Final Payment
│   │   └── Exit Documents
│   │       ├── Experience Certificate
│   │       ├── Relieving Letter
│   │       └── Service Certificate
│   └── Alumni Management
│       ├── Alumni Directory
│       ├── Rehire Process
│       └── Alumni Network
│
├── 💼 Asset Management
│   ├── Asset Allocation
│   │   ├── IT Assets
│   │   │   ├── Laptops
│   │   │   ├── Desktops
│   │   │   ├── Mobile Phones
│   │   │   ├── Monitors
│   │   │   └── Accessories
│   │   ├── Office Assets
│   │   │   ├── Furniture
│   │   │   ├── Stationery
│   │   │   ├── ID Cards
│   │   │   └── Access Cards
│   │   └── Vehicles
│   │       ├── Company Vehicles
│   │       ├── Assignment
│   │       └── Fuel Management
│   ├── Asset Requests
│   ├── Asset Transfer
│   ├── Asset Return
│   ├── Maintenance & Repairs
│   │   ├── Service Requests
│   │   ├── Preventive Maintenance
│   │   ├── AMC Management
│   │   └── Repair History
│   ├── Asset Inventory
│   │   ├── Stock Management
│   │   ├── Stock Requests
│   │   ├── Stock Allocation
│   │   └── Stock Audit
│   └── Asset Reports
│       ├── Asset Register
│       ├── Allocation Report
│       ├── Employee Assets
│       ├── Department Assets
│       └── Maintenance Costs
│
└── 📄 Document Management
    ├── Employee Documents
    │   ├── Personal Documents
    │   ├── Educational Documents
    │   ├── Employment Documents
    │   └── Upload Documents
    ├── Compliance Documents
    │   ├── Statutory Forms
    │   ├── Declarations
    │   ├── Nominations
    │   └── Insurance Forms
    ├── HR Policies
    │   ├── Employee Handbook
    │   ├── Leave Policy
    │   ├── Attendance Policy
    │   ├── Expense Policy
    │   ├── Code of Conduct
    │   └── Other Policies
    ├── Document Repository
    │   ├── Browse Documents
    │   ├── Search Documents
    │   ├── Upload Documents
    │   └── Document Archive
    ├── Certificate Requests
    │   ├── Experience Certificate
    │   ├── Salary Certificate
    │   ├── Employment Certificate
    │   └── Request Status
    └── Compliance Tracking
        ├── Missing Documents
        ├── Expired Documents
        ├── Renewal Reminders
        └── Audit Trail
```

---

## 📊 Page Count Summary

| Sub-Module | Level 1 Categories | Level 2 Pages | Level 3 Pages | Total |
|------------|-------------------|---------------|---------------|-------|
| Employee Management | 4 | 12 | 8 | 24 |
| Time & Attendance | 5 | 18 | 12 | 35 |
| Leave Management | 7 | 15 | 8 | 30 |
| Payroll Management | 7 | 25 | 18 | 50 |
| Expenses & Travel | 6 | 18 | 10 | 34 |
| Onboarding & Offboarding | 4 | 20 | 15 | 39 |
| Asset Management | 7 | 16 | 12 | 35 |
| Document Management | 6 | 14 | 8 | 28 |
| **Total** | **46** | **138** | **91** | **275** |

---

## 🎨 Color Scheme for HR Module

```typescript
{
  id: 'hr',
  name: 'HR',
  icon: UserCog,
  color: 'text-pink-600',
  bgColor: 'bg-pink-50',
  hoverColor: 'hover:bg-pink-100',
}
```

---

## 📱 Route Structure

### URL Pattern
```
/hr/{sub-module}/{category}/{page}
```

### Examples
```
/hr/employees/directory/all
/hr/employees/directory/active
/hr/employees/profiles
/hr/time-attendance/attendance/mark
/hr/time-attendance/overtime/requests
/hr/leave/application/apply
/hr/leave/balance/my-balance
/hr/payroll/processing/run-payroll
/hr/payroll/statutory/income-tax/tds
/hr/expenses/travel/requests
/hr/expenses/reimbursements/pending
/hr/onboarding/pre-joining/offers
/hr/onboarding/orientation/hr-induction
/hr/offboarding/resignations/requests
/hr/offboarding/exit-clearance/checklist
/hr/assets/allocation/it-assets
/hr/assets/maintenance/service-requests
/hr/documents/employee/personal
/hr/documents/policies/handbook
```

---

## 🔗 Page Relationships

### Parent-Child Relationships
```
Employee Directory (List)
  → Employee Details (View)
    → Edit Employee (Form)
    → Employee History (Report)

Leave Application (Form)
  → Leave Status (List)
    → Leave Details (View)
      → Cancel Leave (Action)

Payroll Processing (Dashboard)
  → Run Payroll (Wizard)
    → Payroll Verification (Review)
      → Generate Payslips (Action)

Asset Allocation (List)
  → Allocate Asset (Form)
    → Asset Details (View)
      → Return Asset (Action)
```

---

## 🎯 Implementation Priority

### Phase 1 (MVP) - Must Have
1. **Employee Management**
   - Employee Directory
   - Employee Profiles
   - Organization Structure

2. **Time & Attendance**
   - Mark Attendance
   - Daily Attendance
   - Monthly Register

3. **Leave Management**
   - Apply Leave
   - Leave Approvals
   - Leave Balance

4. **Payroll Management**
   - Salary Structure
   - Run Payroll
   - Payslips

### Phase 2 - Should Have
5. **Expenses & Travel**
   - Submit Expense
   - Travel Requests
   - Reimbursements

6. **Onboarding**
   - Pre-joining
   - First Day Setup
   - Orientation

### Phase 3 - Nice to Have
7. **Offboarding**
   - Resignations
   - Exit Clearance
   - F&F Settlement

8. **Asset Management**
   - Asset Allocation
   - Asset Requests
   - Asset Reports

9. **Document Management**
   - Document Repository
   - Certificate Requests
   - Compliance Tracking

---

## 📝 Implementation Notes

### TypeScript Interface
```typescript
interface HRMenuItem {
  id: string;
  name: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  subItems?: HRMenuItem[];
}
```

### Menu Structure in Code
```typescript
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
            {
              id: 'all-employees',
              name: 'All Employees',
              href: '/hr/employees/directory/all',
              description: 'Complete employee list'
            },
            // ... more items
          ]
        },
        // ... more categories
      ]
    },
    // ... more sub-modules
  ]
}
```

---

## 🚀 Next Steps

1. ✅ Review and approve this structure
2. ⏳ Update Sidebar.tsx with HR menu structure
3. ⏳ Create route files for each page
4. ⏳ Implement UI components
5. ⏳ Add backend APIs
6. ⏳ Test navigation flow
7. ⏳ Deploy to development

---

**Document Version**: 1.0
**Status**: ✅ Ready for Implementation
**Estimated Pages**: 275+
**Estimated Development Time**: 6-8 months (full team)

