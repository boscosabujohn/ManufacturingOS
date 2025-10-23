# Button Content Specification

## Overview

This document provides comprehensive text content for all 664 buttons identified in the BUTTONS_CONTENT_AUDIT.md that currently have only icons. Each button should display visible text alongside or instead of the icon to improve usability and clarity.

---

## Table of Contents

1. [Standard Button Text Patterns](#standard-button-text-patterns)
2. [Module-Specific Button Content](#module-specific-button-content)
3. [Implementation Patterns](#implementation-patterns)
4. [Design Guidelines](#design-guidelines)

---

## Standard Button Text Patterns

### Common Action Buttons

| Icon | Button Text | Alternative Text | Use Case |
|------|-------------|------------------|----------|
| **Eye** | "View" | "View Details", "Preview" | Viewing records, documents |
| **Edit** / **Edit2** / **Edit3** | "Edit" | "Modify", "Update" | Editing any record |
| **Trash2** | "Delete" | "Remove" | Deleting records |
| **Download** | "Download" | "Export" | Downloading files/reports |
| **Copy** | "Copy" | "Duplicate" | Copying/duplicating records |
| **Send** | "Send" | "Submit" | Sending messages/forms |
| **Plus** / **PlusCircle** | "Add New" | "Create" | Adding new records |
| **Save** | "Save" | "Save Changes" | Saving data |
| **X** / **XCircle** | "Cancel" | "Close", "Dismiss" | Closing modals/canceling |
| **Check** / **CheckCircle** | "Approve" | "Confirm", "Accept" | Approving items |

### Navigation Buttons

| Icon | Button Text | Context-Specific |
|------|-------------|------------------|
| **ChevronLeft** | "Previous" | "Previous Month", "Back" |
| **ChevronRight** | "Next" | "Next Month", "Forward" |
| **ArrowLeft** | "Back" | "Go Back", "Return" |
| **Home** | "Home" | "Dashboard" |

### Communication Buttons

| Icon | Button Text | Alternative |
|------|-------------|-------------|
| **Mail** | "Email" | "Send Email" |
| **Phone** | "Call" | "Phone" |
| **MessageSquare** | "Message" | "Chat" |
| **Bell** | "Notifications" | "Alerts" |

### Utility Buttons

| Icon | Button Text | Alternative |
|------|-------------|-------------|
| **Settings** / **Cog** | "Settings" | "Configure" |
| **Filter** | "Filter" | "Apply Filters" |
| **RefreshCw** | "Refresh" | "Reload" |
| **Search** | "Search" | "Find" |
| **Print** | "Print" | - |
| **Upload** | "Upload" | "Upload File" |
| **MoreVertical** / **MoreHorizontal** | "More" | "Options", "Actions" |

### Media Controls

| Icon | Button Text |
|------|-------------|
| **Play** | "Start" / "Play" |
| **Pause** | "Pause" |
| **ZoomIn** | "Zoom In" |
| **ZoomOut** | "Zoom Out" |

---

## Module-Specific Button Content

### 1. After-Sales Service Module

#### Billing (Pending Page)
```tsx
// Line 406
<button>
  <Download className="h-5 w-5" />
  <span>Download Invoice</span>
</button>

// Line 409
<button>
  <Eye className="h-5 w-5" />
  <span>View Details</span>
</button>
```

#### Feedback (NPS/Ratings/Surveys Pages)
```tsx
// Download button
<button>
  <Download className="h-5 w-5" />
  <span>Export Data</span>
</button>

// View button
<button>
  <Eye className="h-5 w-5" />
  <span>View Survey</span>
</button>

// Analytics button
<button>
  <BarChart3 className="h-5 w-5" />
  <span>View Analytics</span>
</button>
```

#### Installations (Calendar Page)
```tsx
// Navigation buttons
<button onClick={previousMonth}>
  <ChevronLeft className="w-5 h-5" />
  <span>Previous Month</span>
</button>

<button onClick={nextMonth}>
  <ChevronRight className="w-5 h-5" />
  <span>Next Month</span>
</button>
```

#### Knowledge Base (Articles Page)
```tsx
// Action buttons in table
<button>
  <Eye className="h-5 w-5" />
  <span>View Article</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>
```

#### Warranties (Claims Detail Page)
```tsx
<button>
  <Download className="w-5 h-5" />
  <span>Download Document</span>
</button>
```

---

### 2. CPQ Module

#### Contracts (Templates Page)
```tsx
<button>
  <Eye className="h-4 w-4" />
  <span>View Template</span>
</button>

<button>
  <Edit className="h-4 w-4" />
  <span>Edit</span>
</button>

<button>
  <Copy className="h-4 w-4" />
  <span>Duplicate</span>
</button>
```

#### Guided Selling (Playbooks Page)
```tsx
<button>
  <Eye className="h-4 w-4" />
  <span>View Playbook</span>
</button>

<button>
  <Edit className="h-4 w-4" />
  <span>Edit</span>
</button>

<button>
  <Copy className="h-4 w-4" />
  <span>Copy</span>
</button>
```

#### Pricing (Rules/Models Pages)
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Rule</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>

<button>
  <Copy className="h-5 w-5" />
  <span>Duplicate</span>
</button>
```

#### Products (Catalog/Configuration Pages)
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Product</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Settings className="h-5 w-5" />
  <span>Configure</span>
</button>
```

#### Quotes
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Quote</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Copy className="h-5 w-5" />
  <span>Clone Quote</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download PDF</span>
</button>

<button>
  <Send className="h-5 w-5" />
  <span>Send to Customer</span>
</button>
```

---

### 3. CRM Module

#### Activities
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Activity</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>
```

#### Contacts
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Contact</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Mail className="h-5 w-5" />
  <span>Email</span>
</button>

<button>
  <Phone className="h-5 w-5" />
  <span>Call</span>
</button>

<button>
  <MessageSquare className="h-5 w-5" />
  <span>Message</span>
</button>
```

#### Leads
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Lead</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <UserPlus className="h-5 w-5" />
  <span>Convert to Contact</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>
```

#### Opportunities
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Opportunity</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <TrendingUp className="h-5 w-5" />
  <span>View Pipeline</span>
</button>

<button>
  <FileText className="h-5 w-5" />
  <span>Create Quote</span>
</button>
```

---

### 4. Finance Module

#### Accounts Receivable
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Invoice</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download PDF</span>
</button>

<button>
  <Send className="h-5 w-5" />
  <span>Send to Customer</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>
```

#### General Ledger
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Entry</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit Entry</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export</span>
</button>
```

#### Budget Management
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Budget</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <BarChart3 className="h-5 w-5" />
  <span>View Analysis</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export Report</span>
</button>
```

#### Tax Management
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Tax Details</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download Return</span>
</button>
```

---

### 5. HR Module

#### Employees
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Profile</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Mail className="h-5 w-5" />
  <span>Email</span>
</button>

<button>
  <FileText className="h-5 w-5" />
  <span>View Documents</span>
</button>
```

#### Attendance
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Details</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export Report</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Adjust</span>
</button>
```

#### Leave Management
```tsx
<button>
  <Check className="h-5 w-5" />
  <span>Approve</span>
</button>

<button>
  <X className="h-5 w-5" />
  <span>Reject</span>
</button>

<button>
  <Eye className="h-5 w-5" />
  <span>View Request</span>
</button>
```

---

### 6. Inventory Module

#### Stock Management
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Item</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Adjust Stock</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export Report</span>
</button>

<button>
  <Truck className="h-5 w-5" />
  <span>Track Movement</span>
</button>
```

#### Warehouse Management
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Location</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <BarChart3 className="h-5 w-5" />
  <span>View Analytics</span>
</button>
```

---

### 7. Procurement Module

#### Purchase Orders
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View PO</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download PDF</span>
</button>

<button>
  <Send className="h-5 w-5" />
  <span>Send to Vendor</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Approve</span>
</button>
```

#### Vendors
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Vendor</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <BarChart3 className="h-5 w-5" />
  <span>View Performance</span>
</button>

<button>
  <Mail className="h-5 w-5" />
  <span>Contact</span>
</button>
```

#### RFQ/RFP
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View RFQ</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Send className="h-5 w-5" />
  <span>Send to Vendors</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download Responses</span>
</button>
```

---

### 8. Production Module

#### Work Orders
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Work Order</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Play className="h-5 w-5" />
  <span>Start</span>
</button>

<button>
  <Pause className="h-5 w-5" />
  <span>Pause</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Complete</span>
</button>
```

#### Quality Control
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Inspection</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Pass</span>
</button>

<button>
  <X className="h-5 w-5" />
  <span>Fail</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export Report</span>
</button>
```

---

### 9. Sales Module

#### Orders
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Order</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download Invoice</span>
</button>

<button>
  <Truck className="h-5 w-5" />
  <span>Track Shipment</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Confirm</span>
</button>
```

#### Quotations
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Quote</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Copy className="h-5 w-5" />
  <span>Duplicate</span>
</button>

<button>
  <Send className="h-5 w-5" />
  <span>Send to Customer</span>
</button>

<button>
  <FileText className="h-5 w-5" />
  <span>Convert to Order</span>
</button>
```

---

### 10. Support Module

#### Tickets
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Ticket</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <MessageSquare className="h-5 w-5" />
  <span>Reply</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Resolve</span>
</button>

<button>
  <UserPlus className="h-5 w-5" />
  <span>Assign</span>
</button>
```

#### Knowledge Base
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Article</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>

<button>
  <Share className="h-5 w-5" />
  <span>Share</span>
</button>
```

---

### 11. Logistics Module

#### Shipments
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Shipment</span>
</button>

<button>
  <Truck className="h-5 w-5" />
  <span>Track</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Download Label</span>
</button>
```

#### Fleet Management
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Vehicle</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Settings className="h-5 w-5" />
  <span>Maintenance</span>
</button>
```

---

### 12. Project Management Module

#### Projects
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Project</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <BarChart3 className="h-5 w-5" />
  <span>View Progress</span>
</button>

<button>
  <FileText className="h-5 w-5" />
  <span>View Documents</span>
</button>
```

#### Tasks
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View Task</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Check className="h-5 w-5" />
  <span>Mark Complete</span>
</button>

<button>
  <UserPlus className="h-5 w-5" />
  <span>Assign</span>
</button>
```

---

### 13. Common Masters Components

#### All Master Tables (Vendors, Items, Categories, etc.)
```tsx
<button>
  <Eye className="h-5 w-5" />
  <span>View</span>
</button>

<button>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

<button>
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>

<button>
  <Copy className="h-5 w-5" />
  <span>Duplicate</span>
</button>

<button>
  <Download className="h-5 w-5" />
  <span>Export</span>
</button>
```

---

## Implementation Patterns

### Pattern 1: Icon + Text (Recommended for most buttons)

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <Eye className="h-5 w-5" />
  <span>View Details</span>
</button>
```

**Pros**:
- Clear visual and textual indication
- Best for accessibility
- Works for primary actions

### Pattern 2: Icon + Text (Compact)

```tsx
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
  <Download className="h-4 w-4" />
  <span>Download</span>
</button>
```

**Pros**:
- Space-efficient
- Good for secondary actions in tables
- Maintains clarity

### Pattern 3: Icon with Tooltip + aria-label (For space-constrained areas)

```tsx
<button
  className="p-2 hover:bg-gray-100 rounded-lg"
  aria-label="View details"
  title="View details"
>
  <Eye className="h-5 w-5" />
</button>
```

**Use only when**:
- Extreme space constraints in mobile
- Icon meaning is universally understood (e.g., ✕ for close)
- Grouped action buttons in a clear context

### Pattern 4: Button Group with Labels

```tsx
<div className="flex items-center gap-2">
  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
    <Eye className="h-4 w-4" />
    <span>View</span>
  </button>

  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-md">
    <Edit className="h-4 w-4" />
    <span>Edit</span>
  </button>

  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md">
    <Trash2 className="h-4 w-4" />
    <span>Delete</span>
  </button>
</div>
```

### Pattern 5: Responsive Button (Text on desktop, Icon on mobile)

```tsx
<button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <Download className="h-5 w-5" />
  <span className="hidden sm:inline">Download Report</span>
</button>
```

**Note**: Always include aria-label when hiding text:

```tsx
<button
  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  aria-label="Download Report"
>
  <Download className="h-5 w-5" />
  <span className="hidden sm:inline">Download Report</span>
</button>
```

---

## Design Guidelines

### Button Sizing

#### Large Buttons (Primary Actions)
```tsx
<button className="inline-flex items-center gap-2 px-6 py-3 text-base">
  <Plus className="h-5 w-5" />
  <span>Create New Order</span>
</button>
```

#### Medium Buttons (Standard)
```tsx
<button className="inline-flex items-center gap-2 px-4 py-2 text-sm">
  <Eye className="h-5 w-5" />
  <span>View Details</span>
</button>
```

#### Small Buttons (Table Actions)
```tsx
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs">
  <Edit className="h-4 w-4" />
  <span>Edit</span>
</button>
```

### Color Coding by Action Type

```tsx
// View/Read (Blue/Gray)
<button className="text-blue-600 hover:bg-blue-50">
  <Eye className="h-5 w-5" />
  <span>View</span>
</button>

// Edit/Update (Amber/Yellow)
<button className="text-amber-600 hover:bg-amber-50">
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

// Delete/Remove (Red)
<button className="text-red-600 hover:bg-red-50">
  <Trash2 className="h-5 w-5" />
  <span>Delete</span>
</button>

// Success/Approve (Green)
<button className="text-green-600 hover:bg-green-50">
  <Check className="h-5 w-5" />
  <span>Approve</span>
</button>

// Download/Export (Emerald)
<button className="text-emerald-600 hover:bg-emerald-50">
  <Download className="h-5 w-5" />
  <span>Download</span>
</button>
```

### Button States

```tsx
// Default
<button className="inline-flex items-center gap-2">
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

// Hover
<button className="inline-flex items-center gap-2 hover:bg-gray-100">
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

// Active/Pressed
<button className="inline-flex items-center gap-2 active:scale-95">
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

// Disabled
<button
  disabled
  className="inline-flex items-center gap-2 opacity-50 cursor-not-allowed"
>
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>

// Loading
<button
  disabled
  className="inline-flex items-center gap-2"
>
  <RefreshCw className="h-5 w-5 animate-spin" />
  <span>Saving...</span>
</button>
```

---

## Dashboard & Navigation

### Dashboard Header (Bell Notification)
```tsx
<button className="relative inline-flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
  <Bell className="h-6 w-6" />
  <span className="sr-only sm:not-sr-only">Notifications</span>
  {notificationCount > 0 && (
    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
  )}
</button>
```

### Breadcrumb Navigation
```tsx
<Link href="/" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
  <Home className="h-4 w-4" />
  <span>Home</span>
</Link>
```

### Sidebar Navigation
```tsx
<button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg">
  <Settings className="h-5 w-5" />
  <span>Settings</span>
</button>
```

---

## Special Cases

### Close/Cancel Buttons in Modals
```tsx
// Header close button
<button
  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
  aria-label="Close dialog"
>
  <X className="h-5 w-5" />
</button>

// Footer cancel button
<button className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
  <X className="h-5 w-5" />
  <span>Cancel</span>
</button>
```

### Dropdown Menu Triggers
```tsx
<button className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
  <MoreVertical className="h-5 w-5" />
  <span>More Actions</span>
</button>
```

### Filter Buttons
```tsx
<button className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
  <Filter className="h-5 w-5" />
  <span>Filter Results</span>
  {activeFiltersCount > 0 && (
    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
      {activeFiltersCount}
    </span>
  )}
</button>
```

---

## Migration Strategy

### Phase 1: High-Impact Areas (Week 1)
1. **Common Masters Components** (29 files)
   - All master data tables
   - Benefits entire system

2. **Shared Layout** (3 files)
   - Breadcrumbs
   - Sidebar
   - Dashboard layout

**Expected Result**: ~90 buttons fixed

### Phase 2: Critical Business Modules (Weeks 2-3)
1. **Finance Module** (18 files, ~90 buttons)
2. **Procurement Module** (19 files, ~85 buttons)
3. **CRM Module** (28 files, ~75 buttons)

**Expected Result**: ~250 buttons fixed

### Phase 3: Remaining Modules (Weeks 4-5)
1. Logistics, Sales, Production, Support
2. CPQ, Inventory, HR, IT Admin
3. Project Management, Reports

**Expected Result**: All 664 buttons fixed

---

## Quality Checklist

Before marking a button as complete, verify:

- [ ] Button has visible text content OR aria-label
- [ ] Text clearly describes the action
- [ ] Icon and text are semantically aligned
- [ ] Button maintains visual hierarchy
- [ ] Color coding matches action type
- [ ] Hover and active states work correctly
- [ ] Button works with keyboard navigation
- [ ] Mobile responsiveness is maintained
- [ ] Loading states are handled (if applicable)
- [ ] Disabled state is clear (if applicable)

---

## Testing Requirements

### Visual Testing
- [ ] Button text is readable at all screen sizes
- [ ] Icon and text are properly aligned
- [ ] Colors meet contrast requirements (WCAG AA)
- [ ] Buttons don't overflow containers

### Functional Testing
- [ ] Click/tap actions work correctly
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Focus indicators are visible
- [ ] Tooltips appear on hover (if used)

### Accessibility Testing
- [ ] Screen reader announces button purpose
- [ ] Button has accessible name
- [ ] Role is correctly identified
- [ ] Focus order is logical

---

## Reference Examples

### Before (Icon Only - Needs Fix)
```tsx
<button className="p-2 hover:bg-gray-100">
  <Edit className="h-5 w-5" />
</button>
```

### After (Icon + Text - Correct)
```tsx
<button className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
  <Edit className="h-5 w-5" />
  <span>Edit</span>
</button>
```

### Alternative (Compact with Tooltip)
```tsx
<button
  className="p-2 hover:bg-gray-100 rounded-lg"
  aria-label="Edit item"
  title="Edit item"
>
  <Edit className="h-5 w-5" />
</button>
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Total Buttons to Update**: 664
**Estimated Completion Time**: 4-5 weeks
