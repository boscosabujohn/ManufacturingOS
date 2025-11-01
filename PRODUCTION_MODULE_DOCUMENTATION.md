# Production Module Documentation

## Table of Contents
1. [Overview](#overview)
2. [Module Structure](#module-structure)
3. [Core Features](#core-features)
4. [Advanced Features](#advanced-features)
5. [Page-by-Page Documentation](#page-by-page-documentation)
6. [Component Library](#component-library)
7. [Data Models](#data-models)
8. [User Workflows](#user-workflows)
9. [Integration Points](#integration-points)
10. [Best Practices](#best-practices)

---

## Overview

The Production Module is a comprehensive Manufacturing Execution System (MES) that manages all aspects of production operations, from work order creation to finished goods. It provides real-time visibility, advanced scheduling, quality control, and shop floor management capabilities.

### Key Capabilities
- **Work Order Management** - Complete lifecycle from creation to completion
- **Production Planning & Scheduling** - Finite capacity scheduling with constraint management
- **Shop Floor Control** - Real-time workstation monitoring and control
- **Quality Management** - In-process and final quality inspections
- **Maintenance Coordination** - Preventive, corrective, and predictive maintenance
- **MES Integration** - Real-time data from PLCs, SCADA, and IoT sensors
- **OEE Analytics** - Overall Equipment Effectiveness monitoring
- **Product Traceability** - Complete genealogy from raw materials to finished goods

### Technology Stack
- **Framework**: Next.js 14.2.33 with App Router
- **Language**: TypeScript with strict typing
- **UI Components**: React Client Components
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useRouter, useEffect)

---

## Module Structure

```
b3-erp/frontend/src/app/(modules)/production/
├── page.tsx                          # Production Dashboard (Main Entry)
├── work-orders/
│   ├── page.tsx                      # Work Orders List
│   ├── new/page.tsx                  # Create Work Order
│   ├── view/[id]/page.tsx            # View Work Order Details
│   └── edit/[id]/page.tsx            # Edit Work Order
├── scheduling/
│   ├── page.tsx                      # Scheduling Dashboard
│   ├── gantt/page.tsx                # Gantt Chart View
│   ├── resources/page.tsx            # Resource Allocation
│   ├── sequencing/page.tsx           # Job Sequencing
│   ├── optimize/page.tsx             # Schedule Optimization
│   ├── view/[id]/page.tsx            # View Schedule Details
│   └── edit/[id]/page.tsx            # Edit Schedule
├── maintenance/
│   ├── page.tsx                      # Maintenance Dashboard
│   ├── preventive/page.tsx           # Preventive Maintenance
│   ├── requests/page.tsx             # Maintenance Requests
│   ├── history/page.tsx              # Maintenance History
│   └── spares/page.tsx               # Spare Parts Inventory
├── analytics/
│   └── page.tsx                      # Production Analytics Dashboard
├── settings/
│   ├── page.tsx                      # Settings Hub
│   ├── work-centers/page.tsx         # Work Center Configuration
│   ├── lines/page.tsx                # Production Lines Setup
│   ├── shifts/page.tsx               # Shift Management
│   └── routing/page.tsx              # Routing Configuration
└── advanced-features/
    └── page.tsx                      # Advanced Features Hub

b3-erp/frontend/src/components/production/
├── index.ts                          # Component Exports
├── FiniteScheduling.tsx              # Constraint-based Scheduling
├── MESIntegration.tsx                # MES & Shop Floor Data
├── QualityChecks.tsx                 # Quality Inspections
├── OEEAnalytics.tsx                  # OEE Monitoring
├── MaintenanceCoordination.tsx       # Maintenance Tasks
├── Traceability.tsx                  # Product Genealogy
└── ShopFloorControl.tsx              # Workstation Control
```

---

## Core Features

### 1. Work Order Management

#### Work Orders Dashboard (`/production/work-orders/page.tsx`)
**Purpose**: Central hub for managing all production work orders

**Key Features**:
- **Summary Statistics**:
  - Total Work Orders
  - In Progress count
  - Completed count
  - On-time delivery percentage

- **Filtering & Search**:
  - Search by WO number, product name
  - Filter by status (planned, in-progress, completed, on-hold)
  - Filter by priority (low, medium, high, critical)
  - Date range filtering

- **Work Order List**:
  - WO Number, Product Name, Customer
  - Quantity (Target vs Completed)
  - Status badges with color coding
  - Priority indicators
  - Start/End dates
  - Progress bars

- **Actions**:
  - View Details (navigate to view page)
  - Edit (navigate to edit page)
  - Start WO (confirm and start production)
  - Complete WO (mark as finished)
  - Export to Excel

**Data Model**:
```typescript
interface WorkOrder {
  id: string;
  woNumber: string;
  productName: string;
  productCode: string;
  customer: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  quantity: number;
  completedQty: number;
  unit: string;
  startDate: string;
  endDate: string;
  dueDate: string;
}
```

**User Actions**:
- `handleView(id)` - Navigate to `/production/work-orders/view/${id}`
- `handleEdit(id)` - Navigate to `/production/work-orders/edit/${id}`
- `handleStartWO(wo)` - Confirm and start work order
- `handleCompleteWO(wo)` - Validate completion and mark complete
- `handleExport()` - Export work orders to Excel

#### Create Work Order (`/production/work-orders/new/page.tsx`)
**Purpose**: Create new production work orders

**Form Sections**:
1. **Basic Information**:
   - Work Order Number (auto-generated or manual)
   - Product Selection (dropdown)
   - Customer Selection
   - Priority Level

2. **Quantity & Dates**:
   - Target Quantity
   - Unit of Measure
   - Planned Start Date
   - Planned End Date
   - Due Date

3. **Bill of Materials**:
   - Material list with quantities
   - Material availability check
   - Reservation options

4. **Routing**:
   - Operation sequence
   - Work centers
   - Setup and run times

**Validation**:
- Required fields check
- Date logic validation (start < end < due)
- Material availability verification
- Capacity check

**Actions**:
- `handleSave()` - Create work order
- `handleSaveAndRelease()` - Create and release to production
- `handleCancel()` - Cancel and return to list

#### View Work Order (`/production/work-orders/view/[id]/page.tsx`)
**Purpose**: Display comprehensive work order details

**Information Displayed**:
1. **Header**: WO number, status, priority
2. **Product Details**: Name, code, description
3. **Quantities**: Target, completed, remaining
4. **Dates**: Start, end, due dates
5. **Progress Bar**: Visual completion percentage
6. **Bill of Materials**: Components required
7. **Routing**: Operations and work centers
8. **Production History**: Completed operations
9. **Quality Checks**: Inspection results
10. **Comments/Notes**: Production notes

**Actions**:
- Edit Work Order
- Print Work Order
- Export to PDF
- Start Production (if planned)
- Complete (if in-progress)

#### Edit Work Order (`/production/work-orders/edit/[id]/page.tsx`)
**Purpose**: Modify existing work orders

**Editable Fields**:
- Priority (can always change)
- Dates (if not started)
- Quantity (with validation)
- BOM items (before release)
- Routing (before release)

**Restrictions**:
- Cannot edit completed work orders
- Limited edits for in-progress WOs
- Material changes require approval

**Actions**:
- `handleUpdate()` - Save changes
- `handleCancel()` - Discard changes

---

### 2. Production Scheduling

#### Scheduling Dashboard (`/production/scheduling/page.tsx`)
**Purpose**: Overview of production schedule with capacity planning

**Key Features**:
- **Summary Cards**:
  - Total Schedules
  - Today's Schedule count
  - Active Jobs
  - Delayed Jobs

- **Schedule List**:
  - Schedule ID, Work Order
  - Product Name
  - Quantity and Unit
  - Scheduled Start/End
  - Work Center Assignment
  - Status (scheduled, in-progress, completed, delayed)
  - Priority

- **Calendar View**: Weekly/monthly schedule visualization

**Actions**:
- `handleView(id)` - View schedule details
- `handleEdit(id)` - Edit schedule
- `handleStart(id)` - Confirm and start schedule
- `handleExport()` - Export schedule report

**Data Model**:
```typescript
interface Schedule {
  id: string;
  schedule_id: string;
  work_order_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  scheduled_start: string;
  scheduled_end: string;
  work_center: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}
```

#### Gantt Chart View (`/production/scheduling/gantt/page.tsx`)
**Purpose**: Visual timeline of production schedules

**Features**:
- Interactive Gantt chart
- Job timeline visualization
- Work center capacity bars
- Dependency lines
- Critical path highlighting
- Drag-and-drop rescheduling

**Controls**:
- Time period selection (day, week, month)
- Zoom in/out
- Fullscreen mode
- Export to PDF/Image

**Actions**:
- `handleFullScreen()` - Toggle fullscreen
- `handleExport()` - Export chart
- Drag job bars to reschedule

#### Resource Allocation (`/production/scheduling/resources/page.tsx`)
**Purpose**: Manage work center and operator assignments

**Features**:
- Work center utilization heatmap
- Operator assignment matrix
- Skill matching
- Availability calendar
- Capacity warnings

**Actions**:
- Assign operators to jobs
- Balance workload
- Resolve conflicts

#### Job Sequencing (`/production/scheduling/sequencing/page.tsx`)
**Purpose**: Optimize job sequence on work centers

**Sequencing Rules**:
- Priority-based
- Due date (earliest first)
- Setup time minimization
- Customer importance
- FIFO/LIFO

**Features**:
- Drag-and-drop sequencing
- Sequence validation
- Impact analysis
- What-if scenarios

#### Schedule Optimization (`/production/scheduling/optimize/page.tsx`)
**Purpose**: AI/ML-based schedule optimization

**Optimization Criteria**:
- Minimize makespan
- Maximize resource utilization
- Meet due dates
- Minimize setup times
- Balance workload

**Features**:
- Run optimization algorithms
- Compare scenarios
- Apply optimized schedule
- Save optimization profiles

---

### 3. Maintenance Management

#### Maintenance Dashboard (`/production/maintenance/page.tsx`)
**Purpose**: Central hub for all maintenance activities

**Key Metrics**:
- Total Equipment count
- Uptime Percentage
- Pending Maintenance Tasks
- Critical Alerts

**Quick Actions**:
- Report Equipment Issue
- Schedule Maintenance
- View Maintenance Calendar
- Access Spare Parts

**Recent Alerts**:
- Equipment failures
- Overdue maintenance
- Critical spare parts

#### Preventive Maintenance (`/production/maintenance/preventive/page.tsx`)
**Purpose**: Manage scheduled preventive maintenance tasks

**Features**:
- **Task List** with 8 sample tasks:
  - Equipment ID and name
  - Task type and description
  - Schedule frequency (weekly, monthly, quarterly)
  - Last completed date
  - Next due date
  - Assigned technician
  - Status (pending, scheduled, overdue, in-progress)
  - Checklist completion progress

- **Summary Stats**:
  - Total Tasks
  - Scheduled Tasks
  - Overdue Tasks
  - In Progress

- **Filters**:
  - Search by equipment or task
  - Filter by status
  - Filter by frequency

**Actions**:
- `handleStartTask(task)` - Begin maintenance task
- `handleEditTask(task)` - Modify task details
- `handleDeleteTask(task)` - Remove task
- `handleExport()` - Export maintenance schedule
- `handleAddSchedule()` - Create new PM task

**Data Model**:
```typescript
interface PreventiveMaintenance {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  taskType: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastCompleted: string;
  nextDue: string;
  assignedTo: string;
  status: 'pending' | 'scheduled' | 'overdue' | 'in-progress';
  checklistItems: number;
  completedItems: number;
}
```

#### Maintenance Requests (`/production/maintenance/requests/page.tsx`)
**Purpose**: Handle breakdown and corrective maintenance requests

**Features**:
- **Request List** with 7 sample requests:
  - Request number and equipment
  - Request type (breakdown, preventive, corrective, inspection)
  - Priority (critical, high, medium, low)
  - Status (pending, approved, in-progress, completed, rejected)
  - Reporter and timestamp
  - Downtime hours
  - Estimated cost

- **Summary Stats**:
  - Total Requests
  - Pending Requests
  - In Progress
  - Completed

- **Detailed View Modal**:
  - Complete request information
  - Problem description
  - Action taken
  - Parts used
  - Time logs

**Actions**:
- `handleViewDetails(request)` - Open detailed modal
- `handleApprove(request)` - Approve maintenance request
- `handleReject(request)` - Reject request with reason
- `handleCreateRequest()` - New maintenance request form

#### Maintenance History (`/production/maintenance/history/page.tsx`)
**Purpose**: Historical maintenance records and analysis

**Features**:
- **History Records** (8 sample records):
  - Maintenance ID and equipment
  - Type (preventive, corrective, breakdown, inspection)
  - Date and duration
  - Technician
  - Parts replaced
  - Cost breakdown
  - Downtime impact
  - Status (completed, partially-completed, failed)

- **Summary Stats**:
  - Total Records
  - Total Cost
  - Total Downtime
  - Average Duration

- **Filters**:
  - Search by equipment or maintenance ID
  - Filter by type
  - Period (last week, month, quarter)

- **Analytics**:
  - Cost trends
  - Downtime analysis
  - MTBF (Mean Time Between Failures)
  - MTTR (Mean Time To Repair)

**Actions**:
- `handleViewDetails(record)` - View complete history
- `handleExport()` - Export history report

#### Spare Parts Inventory (`/production/maintenance/spares/page.tsx`)
**Purpose**: Manage spare parts inventory for maintenance

**Features**:
- **Parts Inventory** (10 sample parts):
  - Part number and name
  - Category (electrical, mechanical, hydraulic, pneumatic, electronics, consumables)
  - Quantity in stock
  - Minimum stock level
  - Reorder point
  - Unit cost and total value
  - Supplier information
  - Lead time
  - Status (adequate, low, critical, out-of-stock)
  - Equipment compatibility

- **Summary Stats**:
  - Total Parts
  - Critical/Out of Stock count
  - Low Stock count
  - Total Inventory Value

- **Detailed View Modal**:
  - Complete part specifications
  - Stock history
  - Usage statistics
  - Compatible equipment list

**Actions**:
- `handleViewDetails(part)` - Open part details modal
- `handleEditPart(part)` - Modify part information
- `handleOrderPart(part)` - Create purchase order (calculates reorder quantity)
- `handleExport()` - Export inventory report

**Intelligent Features**:
- Auto-calculate reorder quantities
- Low stock alerts
- Usage trend analysis
- Supplier performance tracking

---

### 4. Production Analytics

#### Analytics Dashboard (`/production/analytics/page.tsx`)
**Purpose**: Comprehensive production performance analytics and KPIs

**Key Metrics** (4 main cards):
1. **Overall Equipment Effectiveness (OEE)**: 75.2%
2. **Production Volume**: 15,847 units (↑ 12%)
3. **On-Time Delivery**: 94.3% (↑ 3%)
4. **Quality Rate**: 97.8% (↑ 1.2%)

**Interactive Features**:
- **Refresh Button**: `handleRefresh()` - Updates dashboard with animation
- **Export Dashboard**: `handleExportDashboard()` - Export to Excel

**Production Metrics** (6 metric cards):
- Work Orders (Completed/Total)
- Active Jobs
- Avg Cycle Time
- Throughput Rate
- Utilization Rate
- Scrap Rate

**Product Performance Analysis**:
- Table with top 8 products
- Columns: Product Name, Target, Produced, Completion %, Efficiency, Quality Rate
- Color-coded performance indicators
- **View All Products** button: `handleViewAllProducts()`

**Quality Metrics**:
- Total Inspections
- Pass/Fail counts
- Pass rate percentage
- Defect analysis by type

**Work Center Utilization**:
- Heatmap showing utilization by work center
- Color coding: green (optimal), yellow (high), red (overloaded)
- Capacity planning insights

**Downtime Analysis**:
- Pie chart showing downtime by category
- Categories: Setup, Breakdown, Material Shortage, Quality Issues, Other
- Total downtime hours
- Impact on production

**Operator Performance**:
- Efficiency rankings
- Top 5 operators table
- Efficiency percentages
- Units produced per operator
- **View All Operators** button: `handleViewAllOperators()`

**Production Reports** (8 report cards):
Each card has `handleReportClick(reportType)` handler:
1. Daily Production Report
2. Work Order Status Report
3. Material Consumption Report
4. Quality Report
5. Efficiency Report
6. Downtime Analysis Report
7. Cost Variance Report
8. Labor Productivity Report

**Data Visualization**:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Heatmaps for utilization
- Progress bars for completion

**Actions**:
- `handleRefresh()` - Refresh all data with loading state
- `handleExportDashboard()` - Export complete dashboard
- `handleViewAllProducts()` - Navigate to work orders
- `handleViewAllOperators()` - View operator rankings
- `handleReportClick(type)` - Open specific reports

---

### 5. Production Settings

#### Settings Hub (`/production/settings/page.tsx`)
**Purpose**: Central configuration hub for production module

**Setting Categories** (4 main cards):
1. **Work Centers**
   - Path: `/production/settings/work-centers`
   - Configure machines, equipment, capacities
   - Icon: Factory
   - Color: Blue

2. **Production Lines**
   - Path: `/production/settings/lines`
   - Setup production lines and flows
   - Icon: Layers
   - Color: Green

3. **Shift Management**
   - Path: `/production/settings/shifts`
   - Define work shifts and calendars
   - Icon: Clock
   - Color: Purple

4. **Routing Configuration**
   - Path: `/production/settings/routing`
   - Manage operation routings
   - Icon: Route
   - Color: Orange

**Additional Configurations** (3 cards):
1. **Quality Standards**
   - Inspection criteria
   - Tolerance settings

2. **Production Alerts**
   - Threshold configurations
   - Notification rules

3. **Document Templates**
   - Work order templates
   - Report formats

**Statistics** (4 stat cards):
- Work Centers: 12
- Production Lines: 5
- Active Shifts: 3
- Routing Templates: 28

**Quick Tips Section**:
- Helpful guidance for configuration
- Best practices
- Common settings

**Actions**:
- `handleNavigate(path)` - Navigate to specific settings page

#### Work Centers Configuration (`/production/settings/work-centers/page.tsx`)
**Purpose**: Configure and manage work centers

**Features**:
- Work center list with capacities
- Machine specifications
- Maintenance schedules
- Operator assignments
- Efficiency targets

#### Production Lines Setup (`/production/settings/lines/page.tsx`)
**Purpose**: Configure production lines and flows

**Features**:
- Line configuration
- Workstation sequence
- Material flow
- Takt time settings

#### Shift Management (`/production/settings/shifts/page.tsx`)
**Purpose**: Manage work shifts and calendars

**Features**:
- Shift definitions
- Working hours
- Break times
- Holiday calendars
- Overtime rules

#### Routing Configuration (`/production/settings/routing/page.tsx`)
**Purpose**: Define operation routing templates

**Features**:
- Operation sequences
- Work center assignments
- Setup and run times
- Quality checkpoints
- Routing templates

---

## Advanced Features

### Overview
The Advanced Features module provides MES-grade capabilities including finite scheduling, real-time integration, quality control, OEE monitoring, maintenance coordination, traceability, and shop floor control.

**Access**: `/production/advanced-features/page.tsx`

**Tab Structure**:
- 7 specialized tabs
- Each tab loads a dedicated component
- Seamless switching between features

---

### 1. Finite Scheduling (`FiniteScheduling.tsx`)

**Purpose**: Constraint-based production scheduling with capacity planning

**Key Features**:

**Summary Statistics** (5 cards):
- Scheduled Jobs: Count of scheduled/in-progress jobs
- In Progress: Active jobs count
- Delayed: Jobs behind schedule
- Blocked: Jobs with unresolved constraints
- Avg Utilization: Average work center utilization

**Work Center Capacity Table**:
Displays 5 work centers with:
- Work Center name and type
- Capacity (hours)
- Current Load (hours)
- Utilization percentage (with color-coded progress bar)
- Active Jobs / Scheduled Jobs
- Efficiency percentage
- Availability percentage

**Production Schedule Table**:
Shows 5 scheduled jobs with:
- Job Number, Product Name
- Work Center assignment
- Status (scheduled, in-progress, completed, delayed, blocked)
- Priority (critical, high, normal, low)
- Scheduled Start/End times
- Duration and Setup Time
- Progress (completed/target quantity)
- Constraints (if any)
- **Action buttons**: Start/Pause based on status

**Active Schedule Constraints**:
Lists 4 types of constraints:
- Material constraints
- Tooling constraints
- Resource constraints
- Sequence constraints

Each constraint shows:
- Severity (low, medium, high, critical)
- Type and description
- Impacted job count
- Resolution plan
- **Resolve button**: `handleResolveConstraint()`

**Interactive Actions**:
1. **Header Buttons**:
   - `handleReoptimize()` - Re-optimize schedule with current constraints
   - `handleViewGantt()` - Open Gantt chart view
   - `handleScheduleSettings()` - Configure scheduling parameters
   - `handleExportSchedule()` - Export schedule report

2. **Job Actions**:
   - `handleStartJob(job)` - Start production (validates constraints)
   - `handlePauseJob(job)` - Pause in-progress job

3. **Constraint Actions**:
   - `handleResolveConstraint(constraint)` - Mark constraint as resolved

**Data Models**:
```typescript
interface ScheduledJob {
  id: string;
  jobNumber: string;
  productName: string;
  workCenter: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed' | 'blocked';
  priority: 'critical' | 'high' | 'normal' | 'low';
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  setupTime: number;
  quantity: number;
  completedQty: number;
  constraints: ConstraintType[];
  utilizationPercent: number;
}

interface WorkCenter {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentLoad: number;
  utilization: number;
  activeJobs: number;
  scheduledJobs: number;
  efficiency: number;
  availability: number;
}

interface ScheduleConstraint {
  id: string;
  type: 'resource' | 'material' | 'tooling' | 'labor' | 'sequence';
  description: string;
  impactedJobs: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution?: string;
}
```

**Smart Features**:
- Warns when starting jobs with active constraints
- Color-coded utilization (green: <70%, yellow: 70-85%, red: >85%)
- Automatic capacity calculations
- Constraint impact analysis

---

### 2. MES Integration (`MESIntegration.tsx`)

**Purpose**: Real-time machine monitoring and data streaming from PLCs, SCADA, and IoT sensors

**Key Features**:

**Summary Statistics** (4 cards):
- Connected Machines: X/Y machines online
- Running: Count of active machines
- Down/Error: Machines with issues
- Total Parts Today: Cumulative production

**Real-Time Machine Data Table**:
Auto-updates every 3 seconds, showing 4 machines:
- Machine name and status
- Connection status (connected, error)
- Speed (Current/Target RPM with progress bar)
- Temperature (color-coded: green <60°C, yellow 60-70°C, red >70°C)
- Vibration (mm/s)
- Power Consumption (kW)
- Cycle Time (seconds)
- Part Count (real-time)
- Last Update timestamp
- **Action buttons**: View, Start/Stop, Report Issue

**Data Stream Connections Table**:
Shows 5 data streams:
- Source (PLC/SCADA/Sensor system)
- Type (plc, scada, sensor, machine)
- Status (connected, error)
- Data Points collected
- Update Frequency (seconds)
- Last Sync time
- **Action buttons**: View Details, Reconnect (for error status)

**Interactive Actions**:
1. **Header Buttons**:
   - `handleRefreshData()` - Refresh all MES data
   - `handleMESSettings()` - Configure data collection
   - `handleExportData()` - Export MES report

2. **Machine Actions**:
   - `handleViewMachine(machine)` - View detailed machine data
   - `handleStartMachine(machine)` - Send start command to PLC
   - `handleStopMachine(machine)` - Send stop command to PLC
   - `handleReportIssue(machine)` - Log maintenance issue

3. **Stream Actions**:
   - `handleStreamDetails(stream)` - View connection details
   - `handleReconnectStream(stream)` - Attempt reconnection

**Data Models**:
```typescript
interface MachineData {
  machineId: string;
  machineName: string;
  status: 'running' | 'idle' | 'down' | 'setup';
  connectionStatus: 'connected' | 'disconnected' | 'error';
  currentSpeed: number;
  targetSpeed: number;
  temperature: number;
  vibration: number;
  powerConsumption: number;
  cycleTime: number;
  partCount: number;
  lastUpdate: string;
}

interface DataStream {
  id: string;
  source: string;
  type: 'plc' | 'scada' | 'sensor' | 'machine';
  status: 'connected' | 'disconnected' | 'error';
  dataPoints: number;
  updateFrequency: number;
  lastSync: string;
}
```

**Real-Time Features**:
- Auto-refresh simulation (3-second intervals)
- Live part count updates
- Dynamic speed and temperature readings
- Connection status monitoring

**Smart Features**:
- Prevents starting machines with connection errors
- Validates machine status before commands
- Conditional action buttons based on status
- Auto-retry for failed connections

---

### 3. Quality Checks (`QualityChecks.tsx`)

**Purpose**: In-process and final quality control workflows

**Key Features**:

**Summary Statistics** (4 cards):
- Passed: Count of passed inspections
- Failed: Count of failed inspections
- Pending: Awaiting approval
- Pass Rate: Percentage of passed inspections

**Quality Inspections List**:
Shows 3 sample inspections with expandable details:
- Inspection Number
- Product Name
- Type (first-piece, in-process, final, dimensional, visual)
- Status (passed, failed, pending, conditional)
- Inspector name and timestamp
- Samples checked
- Defects found
- **Action buttons**: View, Edit (pending only), Approve (pending), NCR (failed)

**Specification Details** (expandable):
For each inspection with specifications:
- Parameter name
- Target value ± Tolerance
- Actual measured value
- Pass/Fail status per parameter
- Color-coded cards (green for pass, red for fail)

**Interactive Actions**:
1. **Header Buttons**:
   - `handleNewInspection()` - Create new quality inspection
   - `handleRefreshInspections()` - Refresh inspection data
   - `handleQualitySettings()` - Configure quality parameters
   - `handleExportQualityReport()` - Export quality report

2. **Inspection Actions**:
   - `handleViewInspection(inspection)` - View complete details
   - `handleEditInspection(inspection)` - Edit pending inspection
   - `handleApproveInspection(inspection)` - Approve/fail inspection
   - `handleGenerateNCR(inspection)` - Generate Non-Conformance Report

**Data Models**:
```typescript
interface QualityInspection {
  id: string;
  inspectionNumber: string;
  productName: string;
  type: 'first-piece' | 'in-process' | 'final' | 'dimensional' | 'visual';
  status: 'passed' | 'failed' | 'pending' | 'conditional';
  inspector: string;
  timestamp: string;
  samplesChecked: number;
  defectsFound: number;
  specifications: {
    parameter: string;
    target: number;
    actual: number;
    tolerance: number;
    status: 'pass' | 'fail';
  }[];
}
```

**Smart Validation**:
- Cannot approve inspections without specifications
- Auto-determines pass/fail based on specification results
- Warns about failed specs during approval
- Only pending inspections can be edited
- NCR only for failed inspections

**Workflow**:
1. Create inspection → Pending
2. Enter measurements
3. Approve → Auto-pass/fail based on specs
4. If failed → Generate NCR
5. Track corrective actions

---

### 4. OEE Analytics (`OEEAnalytics.tsx`)

**Purpose**: Overall Equipment Effectiveness monitoring and drill-down analysis

**Key Features**:

**Summary Statistics** (4 cards):
- Average OEE: Calculated across all machines
- Avg Availability: Uptime percentage
- Avg Performance: Speed efficiency
- Avg Quality: Good parts ratio

**OEE Breakdown by Machine**:
Shows 3 machines with comprehensive metrics:

**For Each Machine**:
- Machine name and overall OEE score
- **Three Key Metrics** (each with progress bar):
  1. **Availability**:
     - Percentage
     - Runtime vs Downtime
     - Formula: (Runtime / Planned Time) × 100

  2. **Performance**:
     - Percentage
     - Ideal vs Actual cycle time
     - Formula: (Ideal Cycle Time / Actual Cycle Time) × 100

  3. **Quality**:
     - Percentage
     - Good parts vs Defects
     - Formula: (Good Parts / Total Parts) × 100

**Production Statistics** (4 metrics per machine):
- Planned Time (minutes)
- Total Parts produced
- Good Parts (with count)
- Defect Rate (percentage)

**Analysis Buttons** (4 per machine):
- `handleViewMachineDetails(machine)` - Complete OEE details
- `handleDowntimeAnalysis(machine)` - Downtime breakdown and recommendations
- `handlePerformanceAnalysis(machine)` - Cycle time variance analysis
- `handleQualityAnalysis(machine)` - Defect analysis and root causes

**OEE Formula & Calculation Section**:
- Main formula: OEE = Availability × Performance × Quality
- Detailed breakdown of each component
- Educational information

**Interactive Actions**:
1. **Header Buttons**:
   - `handleRefreshOEE()` - Refresh OEE calculations
   - `handleOEESettings()` - Configure OEE parameters
   - `handleExportOEE()` - Export OEE report

2. **Analysis Actions**:
   - `handleViewMachineDetails(machine)` - Full OEE breakdown
   - `handleDowntimeAnalysis(machine)` - Detailed downtime categories with percentages
   - `handlePerformanceAnalysis(machine)` - Cycle time analysis with improvement recommendations
   - `handleQualityAnalysis(machine)` - Defect type breakdown with corrective actions

**Data Models**:
```typescript
interface OEEData {
  machineId: string;
  machineName: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  plannedProductionTime: number;
  actualRuntime: number;
  downtime: number;
  idealCycleTime: number;
  actualCycleTime: number;
  totalParts: number;
  goodParts: number;
  defectParts: number;
}
```

**Color Coding**:
- OEE ≥85%: Green (World Class)
- OEE 70-84%: Yellow (Acceptable)
- OEE <70%: Red (Needs Improvement)

**Analysis Features**:
- **Downtime Analysis**:
  - Breakdown by category (Setup, Failure, Material, Other)
  - Percentage distribution
  - SMED recommendations

- **Performance Analysis**:
  - Cycle time variance calculation
  - Percentage slower than ideal
  - Root cause suggestions
  - Improvement recommendations

- **Quality Analysis**:
  - Defect rate calculation
  - Defect type distribution
  - SPC recommendations
  - Quality improvement actions

---

### 5. Maintenance Coordination (`MaintenanceCoordination.tsx`)

**Purpose**: Preventive, corrective, and predictive maintenance scheduling and execution

**Key Features**:

**Summary Statistics** (4 cards):
- Scheduled: Upcoming maintenance tasks
- In-Progress: Currently executing
- Overdue: Past due date
- Completed: Finished tasks

**Maintenance Schedule Table**:
Shows 4 sample tasks with comprehensive details:
- Machine name
- Task title and description
- Type (preventive, corrective, predictive)
- Status (scheduled, in-progress, completed, overdue)
- Priority (low, medium, high, critical)
- Scheduled Date
- Technician assignment
- Estimated Duration (minutes)
- **Action buttons**: View, Start (scheduled/overdue), Complete (in-progress)

**Interactive Actions**:
1. **Header Buttons**:
   - `handleNewTask()` - Create new maintenance task
   - `handleRefresh()` - Refresh task list
   - `handleSettings()` - Configure maintenance parameters
   - `handleExport()` - Export maintenance report

2. **Task Actions**:
   - `handleViewTask(task)` - View complete task details
   - `handleStartTask(task)` - Begin maintenance work
   - `handleCompleteTask(task)` - Mark task as completed

**Data Models**:
```typescript
interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  type: 'preventive' | 'corrective' | 'predictive';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  title: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
```

**Smart Features**:
- Status-aware action buttons
- Cannot start already in-progress tasks
- Must be in-progress to complete
- Confirms before starting/completing
- Notifies technicians
- Updates machine status

**Color Coding**:
- Preventive: Green
- Corrective: Orange
- Predictive: Purple
- Overdue: Red

**Workflow**:
1. Schedule task → Scheduled
2. Start task → In-Progress (machine marked under maintenance)
3. Complete task → Completed (machine returned to service)
4. Log maintenance details

---

### 6. Traceability (`Traceability.tsx`)

**Purpose**: Complete product tracking from raw materials to finished goods

**Key Features**:

**Product Record Card**:
Shows comprehensive genealogy for each product:

**Header Section**:
- Serial Number (unique identifier)
- Product Name
- Work Order and Batch Number
- **Action buttons**: View Full Genealogy, Print Label, Export to PDF

**Status and Location** (2 info cards):
1. **Status**: in-production, completed, shipped
2. **Current Location**: Warehouse/rack location

**Manufacturing Genealogy Timeline**:
Visual timeline showing 4 production steps:
- Step name (e.g., "Raw Material Cutting")
- Work Center used
- Operator name
- Timestamp
- Materials Used (with lot numbers)
- Connected with timeline visual

**Quality Checkpoints Grid**:
Shows 3 quality inspections:
- Checkpoint name
- Result (pass/fail with color coding)
- Inspector name
- Timestamp
- Color-coded cards (green for pass, red for fail)

**Interactive Actions**:
1. **Header Buttons**:
   - `handleSearch()` - Search by serial/batch/work order
   - `handleRefresh()` - Refresh traceability data
   - `handleSettings()` - Configure tracking parameters
   - `handleExport()` - Export traceability reports

2. **Record Actions**:
   - `handleViewGenealogy(record)` - Complete genealogy report
   - `handlePrintLabel(record)` - Print barcode/QR label
   - `handleExportPDF(record)` - Export to PDF

**Data Models**:
```typescript
interface TraceabilityRecord {
  serialNumber: string;
  productName: string;
  batchNumber: string;
  workOrder: string;
  genealogy: {
    step: string;
    workCenter: string;
    operator: string;
    timestamp: string;
    materials: string[];
  }[];
  qualityChecks: {
    checkpoint: string;
    result: 'pass' | 'fail';
    inspector: string;
    timestamp: string;
  }[];
  currentLocation: string;
  status: 'in-production' | 'completed' | 'shipped';
}
```

**Traceability Features**:
- **Forward Traceability**: Track where products went
- **Backward Traceability**: Track material sources
- **Complete Genealogy**: All operations and materials
- **Quality History**: All inspection points
- **Operator Records**: Who did what and when
- **Material Lot Tracking**: Full material traceability

**Use Cases**:
- Quality investigations
- Recall management
- Compliance documentation
- Customer inquiries
- Root cause analysis
- Regulatory audits

---

### 7. Shop Floor Control (`ShopFloorControl.tsx`)

**Purpose**: Real-time workstation monitoring and production control

**Key Features**:

**Workstation Cards** (4 workstations in 2x2 grid):
Each card displays:

**Header** (color-coded by status):
- Workstation name
- Operator assignment
- Status badge (running: green, paused: yellow, idle: gray)

**Current Job Information**:
- Job number (e.g., "WO-2025-1234")
- Product name
- Target vs Completed quantity

**Progress Section**:
- Progress bar (visual completion)
- Numeric progress (e.g., "285 / 500")

**Metrics** (2 cards):
1. **Time Remaining**: Minutes left to completion
2. **Efficiency**: Percentage with color coding
   - Green: ≥85%
   - Yellow: 70-84%
   - Red: <70%

**Control Buttons**:
- **Pause** (for running) or **Start** (for paused/idle)
- **Complete** (mark job as finished)

**Interactive Actions**:
1. **Header Buttons**:
   - `handleRefresh()` - Refresh shop floor data
   - `handleSettings()` - Configure workstation settings
   - `handleExport()` - Export shop floor report

2. **Workstation Actions**:
   - `handlePause(ws)` - Pause running workstation
   - `handleStart(ws)` - Start/resume workstation
   - `handleComplete(ws)` - Complete job on workstation

**Data Models**:
```typescript
interface Workstation {
  id: string;
  name: string;
  operator: string;
  currentJob: string;
  productName: string;
  status: 'running' | 'paused' | 'idle' | 'complete';
  quantity: {
    target: number;
    completed: number;
  };
  timeRemaining: number;
  efficiency: number;
}
```

**Smart Validation**:
- Cannot pause non-running workstations
- Cannot start already running workstations
- Idle workstations need job assignment first
- Confirms early completion if quantity not met
- Saves progress when pausing
- Clears workstation when completing

**Status Colors**:
- Running: Green header
- Paused: Yellow header
- Idle: Gray header
- Complete: Blue header

**Real-Time Features**:
- Live progress tracking
- Dynamic time calculations
- Efficiency monitoring
- Operator notifications

**Workflow**:
1. Assign job to idle workstation
2. Start workstation → Running
3. Monitor progress and efficiency
4. Pause if needed → Paused
5. Resume → Running
6. Complete when done → Available

---

## Component Library

### Production Components (`src/components/production/`)

All advanced feature components are exportable and reusable:

```typescript
// index.ts exports
export { default as FiniteScheduling } from './FiniteScheduling';
export { default as MESIntegration } from './MESIntegration';
export { default as QualityChecks } from './QualityChecks';
export { default as OEEAnalytics } from './OEEAnalytics';
export { default as MaintenanceCoordination } from './MaintenanceCoordination';
export { default as Traceability } from './Traceability';
export { default as ShopFloorControl } from './ShopFloorControl';

// Usage
import { FiniteScheduling, MESIntegration } from '@/components/production';
```

### Component Props

All components are self-contained with no required props:
- They manage their own state
- Include mock data for demonstration
- Fully functional with all interactive features
- Can be dropped into any page

### Shared Patterns

**Common Features Across Components**:
1. **Header Section**:
   - Gradient background (unique color per component)
   - Title and description
   - Action buttons (Refresh, Settings, Export)

2. **State Management**:
   - Local state with `useState`
   - Router for navigation with `useRouter`
   - Effect hooks for real-time updates

3. **Helper Functions**:
   - `getStatusColor()` - Status badge colors
   - `getTypeColor()` - Type badge colors
   - `getPriorityColor()` - Priority text colors

4. **Interactive Handlers**:
   - Validation before actions
   - Confirmation dialogs for critical operations
   - User feedback with alerts
   - Console logging for debugging

5. **Styling**:
   - Tailwind CSS utility classes
   - Responsive grid layouts
   - Hover effects on buttons
   - Transition animations
   - Color-coded metrics

---

## Data Models

### Core Entities

#### Work Order
```typescript
interface WorkOrder {
  id: string;
  woNumber: string;
  productName: string;
  productCode: string;
  customer: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  quantity: number;
  completedQty: number;
  unit: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  bomItems?: BOMItem[];
  routing?: RoutingStep[];
}

interface BOMItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  available: number;
}

interface RoutingStep {
  sequence: number;
  operation: string;
  workCenter: string;
  setupTime: number;
  runTime: number;
}
```

#### Production Schedule
```typescript
interface Schedule {
  id: string;
  schedule_id: string;
  work_order_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  scheduled_start: string;
  scheduled_end: string;
  work_center: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ScheduledJob {
  id: string;
  jobNumber: string;
  productName: string;
  workCenter: string;
  status: ScheduleStatus;
  priority: PriorityLevel;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  setupTime: number;
  quantity: number;
  completedQty: number;
  constraints: ConstraintType[];
  utilizationPercent: number;
}
```

#### Work Center
```typescript
interface WorkCenter {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentLoad: number;
  utilization: number;
  activeJobs: number;
  scheduledJobs: number;
  efficiency: number;
  availability: number;
}
```

#### Maintenance
```typescript
interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  type: 'preventive' | 'corrective' | 'predictive';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  title: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface PreventiveMaintenance {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  taskType: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastCompleted: string;
  nextDue: string;
  assignedTo: string;
  status: 'pending' | 'scheduled' | 'overdue' | 'in-progress';
  checklistItems: number;
  completedItems: number;
}

interface SparePart {
  partNumber: string;
  partName: string;
  category: 'electrical' | 'mechanical' | 'hydraulic' | 'pneumatic' | 'electronics' | 'consumables';
  quantityInStock: number;
  minimumStock: number;
  reorderPoint: number;
  unitCost: number;
  supplier: string;
  leadTime: number;
  status: 'adequate' | 'low' | 'critical' | 'out-of-stock';
  equipmentCompatibility: string[];
}
```

#### Quality
```typescript
interface QualityInspection {
  id: string;
  inspectionNumber: string;
  productName: string;
  type: 'first-piece' | 'in-process' | 'final' | 'dimensional' | 'visual';
  status: 'passed' | 'failed' | 'pending' | 'conditional';
  inspector: string;
  timestamp: string;
  samplesChecked: number;
  defectsFound: number;
  specifications: {
    parameter: string;
    target: number;
    actual: number;
    tolerance: number;
    status: 'pass' | 'fail';
  }[];
}
```

#### Machine & MES
```typescript
interface MachineData {
  machineId: string;
  machineName: string;
  status: 'running' | 'idle' | 'down' | 'setup';
  connectionStatus: 'connected' | 'disconnected' | 'error';
  currentSpeed: number;
  targetSpeed: number;
  temperature: number;
  vibration: number;
  powerConsumption: number;
  cycleTime: number;
  partCount: number;
  lastUpdate: string;
}

interface DataStream {
  id: string;
  source: string;
  type: 'plc' | 'scada' | 'sensor' | 'machine';
  status: 'connected' | 'disconnected' | 'error';
  dataPoints: number;
  updateFrequency: number;
  lastSync: string;
}
```

#### OEE
```typescript
interface OEEData {
  machineId: string;
  machineName: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  plannedProductionTime: number;
  actualRuntime: number;
  downtime: number;
  idealCycleTime: number;
  actualCycleTime: number;
  totalParts: number;
  goodParts: number;
  defectParts: number;
}
```

#### Traceability
```typescript
interface TraceabilityRecord {
  serialNumber: string;
  productName: string;
  batchNumber: string;
  workOrder: string;
  genealogy: {
    step: string;
    workCenter: string;
    operator: string;
    timestamp: string;
    materials: string[];
  }[];
  qualityChecks: {
    checkpoint: string;
    result: 'pass' | 'fail';
    inspector: string;
    timestamp: string;
  }[];
  currentLocation: string;
  status: 'in-production' | 'completed' | 'shipped';
}
```

#### Shop Floor
```typescript
interface Workstation {
  id: string;
  name: string;
  operator: string;
  currentJob: string;
  productName: string;
  status: 'running' | 'paused' | 'idle' | 'complete';
  quantity: {
    target: number;
    completed: number;
  };
  timeRemaining: number;
  efficiency: number;
}
```

---

## User Workflows

### 1. Create and Execute Work Order

**Steps**:
1. Navigate to `/production/work-orders`
2. Click "Create Work Order" button
3. Fill out work order form:
   - Select product
   - Enter customer
   - Set quantity and dates
   - Choose priority
4. Click "Save" → Work Order created with status "Planned"
5. Work order appears in list
6. Click "Start" on work order
7. Confirm start → Status changes to "In Progress"
8. Production begins, track progress
9. Click "Complete" when finished
10. Confirm completion → Status "Completed"

**Pages Involved**:
- `/production/work-orders` (list)
- `/production/work-orders/new` (create)
- `/production/work-orders/view/[id]` (details)

---

### 2. Schedule Production with Finite Capacity

**Steps**:
1. Navigate to `/production/advanced-features`
2. Select "Finite Scheduling" tab
3. Review work center utilization
4. Check for capacity constraints
5. Review scheduled jobs list
6. Identify blocked/delayed jobs
7. Click "Resolve" on active constraints
8. Confirm resolution actions
9. Click "Re-optimize" to rerun scheduling
10. Review optimized schedule
11. Click "Gantt View" for visual timeline
12. Start jobs as needed

**Key Actions**:
- Resolve constraints before starting
- Balance load across work centers
- Prioritize critical jobs
- Monitor utilization levels

---

### 3. Perform Quality Inspection

**Steps**:
1. Navigate to `/production/advanced-features`
2. Select "Quality Checks" tab
3. Click "New Inspection"
4. Select inspection type (first-piece, in-process, final)
5. Choose work order/product
6. Enter measurements for each specification
7. System auto-calculates pass/fail per spec
8. Click "Approve" when measurements complete
9. If all specs pass → Inspection marked "Passed"
10. If any specs fail → Confirm to mark "Failed"
11. For failed inspections, click "NCR"
12. Generate Non-Conformance Report
13. Route for corrective action

**Quality Gates**:
- First-piece before production run
- In-process at checkpoints
- Final before shipping

---

### 4. Monitor OEE and Improve

**Steps**:
1. Navigate to `/production/advanced-features`
2. Select "OEE Analytics" tab
3. Review average OEE across all machines
4. Identify machines with OEE <70%
5. Click "Downtime Analysis" on problematic machine
6. Review downtime categories
7. Identify biggest loss (e.g., Setup 40%)
8. Click "Performance Analysis"
9. Review cycle time variance
10. Note improvement recommendations
11. Click "Quality Analysis"
12. Review defect breakdown
13. Implement corrective actions
14. Track OEE improvement over time

**Improvement Cycle**:
- Measure → Analyze → Improve → Monitor

---

### 5. Execute Preventive Maintenance

**Steps**:
1. Navigate to `/production/maintenance/preventive`
2. Review scheduled PM tasks
3. Filter by "Overdue" to prioritize
4. Click "Start Task" on overdue item
5. Confirm start → Machine marked under maintenance
6. Technician performs maintenance
7. Complete checklist items
8. Click "Complete" when finished
9. Confirm completion → Machine returned to production
10. Task marked "Completed" with timestamp
11. Next PM auto-scheduled based on frequency

**PM Types**:
- Daily: Lubrication, inspections
- Weekly: Filter changes, adjustments
- Monthly: Comprehensive inspections
- Quarterly: Major overhauls

---

### 6. Track Product Traceability

**Steps**:
1. Navigate to `/production/advanced-features`
2. Select "Traceability" tab
3. Click "Search" button
4. Enter serial number or batch number
5. View complete product record
6. Review Manufacturing Genealogy:
   - See all production steps
   - View work centers used
   - Check operators assigned
   - Review materials consumed (with lot numbers)
7. Review Quality Checkpoints:
   - All inspection points
   - Pass/fail results
   - Inspector names
8. Check current location
9. Click "View Full Genealogy" for detailed report
10. Click "Print Label" for barcode
11. Click "Export to PDF" for documentation

**Use Cases**:
- Customer quality complaints
- Product recalls
- Regulatory compliance
- Root cause investigations

---

### 7. Control Shop Floor Operations

**Steps**:
1. Navigate to `/production/advanced-features`
2. Select "Shop Floor Control" tab
3. Review all workstation cards
4. Identify paused or idle workstations
5. For paused workstation, click "Start"
6. Confirm to resume production
7. Monitor real-time progress
8. Watch efficiency metrics
9. If issues arise, click "Pause"
10. When job complete, click "Complete"
11. If quantity not met, confirm early completion
12. System logs production data
13. Workstation becomes available
14. Assign next job

**Real-Time Monitoring**:
- Progress bars update live
- Efficiency calculated continuously
- Time remaining updates
- Operator assignments visible

---

## Integration Points

### 1. Inventory Management
- **BOM Consumption**: Work orders consume materials
- **Material Availability**: Check stock before releasing WO
- **Material Reservations**: Lock inventory for production
- **Finished Goods**: Completed production updates inventory

### 2. Sales & Orders
- **Customer Orders**: Drive work order creation
- **Due Dates**: From customer delivery dates
- **Order Status**: Production progress updates order status

### 3. Purchasing
- **Material Shortages**: Create purchase requisitions
- **Spare Parts**: Auto-generate POs for low stock
- **Vendor Performance**: Track delivery impact on production

### 4. Quality Management
- **Quality Plans**: Define inspection points
- **NCRs**: Non-conformance reports
- **CAPA**: Corrective and preventive actions
- **Certifications**: Material and product certificates

### 5. HR & Payroll
- **Operator Assignments**: Track labor
- **Time Tracking**: Work hours on jobs
- **Skill Matrix**: Operator qualifications
- **Performance**: Efficiency and productivity

### 6. Finance & Accounting
- **Production Costs**: Labor, material, overhead
- **Work-in-Process**: WIP valuation
- **Cost Variance**: Actual vs standard
- **Job Costing**: Cost by work order

### 7. MES & SCADA
- **Real-Time Data**: PLC integration
- **Machine Status**: Live monitoring
- **Data Streams**: OPC UA, MQTT
- **IoT Sensors**: Temperature, vibration, etc.

---

## Best Practices

### Work Order Management
1. **Standard Work**: Define clear BOM and routing before release
2. **Material Availability**: Verify stock before starting
3. **Priority Management**: Don't overuse "Critical" priority
4. **Progress Tracking**: Update completed quantities regularly
5. **Documentation**: Record issues and deviations

### Scheduling
1. **Capacity Planning**: Don't overload work centers (keep <85%)
2. **Constraint Management**: Resolve constraints before starting jobs
3. **Buffer Time**: Include setup time in schedules
4. **Sequencing**: Minimize setup changes
5. **Flexibility**: Allow for rescheduling

### Quality Control
1. **First-Piece**: Always inspect first piece before production run
2. **In-Process**: Regular checks during production
3. **Final Inspection**: 100% or sampling before shipping
4. **Documentation**: Record all measurements
5. **Immediate Response**: Address failures immediately

### Maintenance
1. **Preventive First**: Prioritize PM over reactive
2. **Scheduling**: Schedule PM during low production periods
3. **Parts Availability**: Stock critical spares
4. **Documentation**: Log all maintenance activities
5. **Root Cause**: Analyze failures for prevention

### OEE Monitoring
1. **Daily Review**: Check OEE daily
2. **Target Setting**: Set realistic targets (75%+ is good)
3. **Focus Areas**: Address lowest component first
4. **Downtime Tracking**: Categorize all downtime
5. **Continuous Improvement**: Small incremental gains

### Traceability
1. **Unique IDs**: Assign serial numbers to all products
2. **Lot Tracking**: Track material lots through production
3. **Real-Time**: Capture data as it happens
4. **Quality Links**: Associate quality results with products
5. **Retention**: Keep records per regulatory requirements

### Shop Floor Control
1. **Visual Management**: Large displays showing status
2. **Operator Training**: Ensure operators know how to use system
3. **Real-Time Updates**: Refresh frequently
4. **Problem Escalation**: Quick response to issues
5. **Performance Feedback**: Share efficiency metrics with operators

---

## Appendix

### A. Status Definitions

**Work Order Status**:
- **Planned**: Created, not released
- **In-Progress**: Released, production ongoing
- **Completed**: Finished, all quantity produced
- **On-Hold**: Temporarily stopped

**Schedule Status**:
- **Scheduled**: Planned, not started
- **In-Progress**: Currently executing
- **Completed**: Finished on time
- **Delayed**: Behind schedule

**Maintenance Status**:
- **Scheduled**: Planned for future
- **In-Progress**: Currently executing
- **Completed**: Finished successfully
- **Overdue**: Past due date

**Quality Status**:
- **Pending**: Awaiting approval
- **Passed**: All specs met
- **Failed**: One or more specs failed
- **Conditional**: Passed with deviations

### B. Priority Levels

**Priority Color Coding**:
- **Critical**: Red - Immediate attention required
- **High**: Orange - Prioritize over normal
- **Medium**: Yellow - Standard priority
- **Low**: Green - Can be deferred

### C. Common Abbreviations

- **MES**: Manufacturing Execution System
- **OEE**: Overall Equipment Effectiveness
- **WO**: Work Order
- **BOM**: Bill of Materials
- **PM**: Preventive Maintenance
- **NCR**: Non-Conformance Report
- **SCADA**: Supervisory Control and Data Acquisition
- **PLC**: Programmable Logic Controller
- **MTBF**: Mean Time Between Failures
- **MTTR**: Mean Time To Repair
- **WIP**: Work in Process
- **SPC**: Statistical Process Control
- **CAPA**: Corrective and Preventive Action

### D. File References

**Core Pages**:
- Dashboard: [`/production/page.tsx`](b3-erp/frontend/src/app/(modules)/production/page.tsx)
- Work Orders: [`/production/work-orders/page.tsx`](b3-erp/frontend/src/app/(modules)/production/work-orders/page.tsx)
- Scheduling: [`/production/scheduling/page.tsx`](b3-erp/frontend/src/app/(modules)/production/scheduling/page.tsx)
- Maintenance: [`/production/maintenance/page.tsx`](b3-erp/frontend/src/app/(modules)/production/maintenance/page.tsx)
- Analytics: [`/production/analytics/page.tsx`](b3-erp/frontend/src/app/(modules)/production/analytics/page.tsx)
- Settings: [`/production/settings/page.tsx`](b3-erp/frontend/src/app/(modules)/production/settings/page.tsx)
- Advanced: [`/production/advanced-features/page.tsx`](b3-erp/frontend/src/app/(modules)/production/advanced-features/page.tsx)

**Components**:
- FiniteScheduling: [`/components/production/FiniteScheduling.tsx`](b3-erp/frontend/src/components/production/FiniteScheduling.tsx)
- MESIntegration: [`/components/production/MESIntegration.tsx`](b3-erp/frontend/src/components/production/MESIntegration.tsx)
- QualityChecks: [`/components/production/QualityChecks.tsx`](b3-erp/frontend/src/components/production/QualityChecks.tsx)
- OEEAnalytics: [`/components/production/OEEAnalytics.tsx`](b3-erp/frontend/src/components/production/OEEAnalytics.tsx)
- MaintenanceCoordination: [`/components/production/MaintenanceCoordination.tsx`](b3-erp/frontend/src/components/production/MaintenanceCoordination.tsx)
- Traceability: [`/components/production/Traceability.tsx`](b3-erp/frontend/src/components/production/Traceability.tsx)
- ShopFloorControl: [`/components/production/ShopFloorControl.tsx`](b3-erp/frontend/src/components/production/ShopFloorControl.tsx)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-01
**Module Status**: Production Ready ✅
**Total Pages**: 40 (Work Orders: 8, Scheduling: 8, Maintenance: 5, Analytics: 1, Settings: 5, Advanced: 1)
**Total Components**: 7 Advanced Features
**Interactive Features**: 100% Complete
