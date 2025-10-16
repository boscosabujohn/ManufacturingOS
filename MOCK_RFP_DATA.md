# Mock RFP Data Summary

## Overview
Added 8 realistic manufacturing RFP scenarios to demonstrate the full capabilities of the RFP management system.

## Mock Data Details

### 1. Automated CNC Machine Tool Production Line
- **Customer**: AeroTech Industries Ltd.
- **Status**: Submitted
- **Priority**: Urgent
- **Budget**: $1,850,000
- **Type**: New Project
- **Win Probability**: 75%
- **Deadline**: 15 days from now
- **Items**: 5-Axis CNC Machines (4), Industrial Robot Arms (6), Quality Control Systems (2)
- **Highlights**: High-value aerospace manufacturing project with tight deadline

### 2. Industrial IoT Sensors for Smart Factory
- **Customer**: TechManufacturing Corp
- **Status**: In Progress
- **Priority**: High
- **Budget**: $250,000
- **Type**: Product
- **Win Probability**: 85%
- **Deadline**: 7 days from now (URGENT)
- **Items**: 200 Vibration Sensors, 300 Temperature Sensors, 20 IoT Gateways
- **Highlights**: Industry 4.0 smart factory implementation

### 3. Warehouse Automation & AGV System
- **Customer**: LogisticsPro Inc.
- **Status**: Under Review
- **Priority**: Medium
- **Budget**: $1,650,000
- **Type**: New Project
- **Win Probability**: 60%
- **Deadline**: 30 days from now
- **Items**: 10 AGV Units, ASRS System, WMS Software, Conveyor Network
- **Highlights**: Complete warehouse automation solution

### 4. Quality Control Lab Equipment Upgrade
- **Customer**: Precision Parts Manufacturing
- **Status**: Awaiting Approval
- **Priority**: Medium
- **Budget**: $545,000
- **Type**: Product
- **Win Probability**: 90%
- **Deadline**: 3 days from now (VERY URGENT)
- **Items**: CMM Machines (2), Hardness Testers (3), Optical Comparator
- **Highlights**: High win probability, urgent approval needed

### 5. Energy Management & Solar Installation
- **Customer**: GreenTech Manufacturing
- **Status**: Approved ✅
- **Priority**: Low
- **Budget**: $850,000
- **Type**: Service
- **Win Probability**: 95%
- **Deadline**: Past (completed)
- **Items**: 1,200 Solar Panels, Battery Storage Systems, Inverters
- **Highlights**: Sustainability project, already approved

### 6. Powder Coating Line Installation
- **Customer**: MetalWorks Industries
- **Status**: Draft
- **Priority**: High
- **Budget**: $650,000
- **Type**: New Project
- **Win Probability**: 70%
- **Deadline**: 45 days from now
- **Items**: Coating Booths (2), Gas Curing Oven, Overhead Conveyor
- **Highlights**: Complete finishing system installation

### 7. ERP System Implementation & Integration
- **Customer**: MidSize Manufacturing Co.
- **Status**: Rejected ❌
- **Priority**: Medium
- **Budget**: $450,000
- **Type**: Consulting
- **Win Probability**: 20%
- **Deadline**: Past
- **Items**: ERP Software License, Implementation Services, Training
- **Highlights**: Lost to competitor - lesson learned scenario

### 8. Preventive Maintenance Contract - 2026
- **Customer**: Reliable Manufacturing Ltd.
- **Status**: Submitted
- **Priority**: Low
- **Budget**: $140,000
- **Type**: Maintenance
- **Win Probability**: 80%
- **Deadline**: 20 days from now
- **Items**: Quarterly Maintenance, Emergency Support, Spare Parts
- **Highlights**: Annual service contract with good probability

## Statistics Overview

With this mock data, the dashboard will show:

- **Total RFPs**: 8
- **By Status**:
  - Draft: 1
  - Submitted: 3
  - Under Review: 1
  - In Progress: 1
  - Awaiting Approval: 1
  - Approved: 1
  - Rejected: 1

- **By Priority**:
  - Urgent: 1
  - High: 2
  - Medium: 4
  - Low: 2

- **By Type**:
  - New Project: 3
  - Product: 2
  - Service: 1
  - Maintenance: 1
  - Consulting: 1

- **Total Estimated Value**: $6,385,000 (~$6.4M)
- **Average Win Probability**: 72.5%
- **Urgent Deadlines**: 2 RFPs (within 7 days)
- **Active RFPs**: 6 (excluding approved and rejected)

## Features Demonstrated

### 1. Status Workflow
- Shows RFPs in various stages of the pipeline
- Demonstrates complete lifecycle from Draft to Approved/Rejected

### 2. Priority Management
- Mix of priorities showing realistic business scenarios
- Urgent items with tight deadlines highlighted

### 3. Deadline Tracking
- Past deadlines (approved and rejected items)
- Urgent deadlines (3-7 days)
- Normal deadlines (15-45 days)

### 4. Financial Tracking
- Range of project sizes ($140K to $1.85M)
- Total pipeline value tracking
- Proposal values vs estimated budgets

### 5. Win Probability Analysis
- High probability: Approved Solar project (95%), QC Lab (90%)
- Good probability: IoT Sensors (85%), Maintenance (80%)
- Medium probability: CNC Line (75%), Coating Line (70%)
- Lower probability: Warehouse (60%), ERP (20% - rejected)

### 6. Customer Diversity
- 8 different customers
- Various industry segments
- Different contact persons and emails

### 7. Project Complexity
- Simple products (sensors, equipment)
- Complex systems (CNC line, warehouse automation)
- Services (solar installation, maintenance)
- Consulting (ERP implementation)

### 8. Team Assignments
- Multiple team members assigned
- Sales persons, estimators, technical leads
- Shows collaboration features

## Testing Scenarios

### Test Filtering
1. **By Status**: Filter to see only "Submitted" RFPs (should show 3)
2. **By Priority**: Filter "High" priority (should show 2)
3. **Combined**: "In Progress" + "High" priority (should show 1)

### Test Search
1. Search "CNC" - finds Automated CNC Machine Tool Production Line
2. Search "Solar" - finds Energy Management & Solar Installation
3. Search "AeroTech" - finds by customer name

### Test Deadline Alerts
- QC Lab Equipment (3 days) - Shows as URGENT
- IoT Sensors (7 days) - Shows as URGENT
- Solar Installation - Past deadline but approved

### Test Views
1. **Grid View**: Card-based display with visual indicators
2. **List View**: Table format for quick scanning

## API Testing

You can test the API endpoints with these examples:

```bash
# Get all RFPs
curl http://localhost:3000/sales/rfp

# Get statistics
curl http://localhost:3000/sales/rfp/statistics

# Get dashboard
curl http://localhost:3000/sales/rfp/dashboard

# Filter by status
curl http://localhost:3000/sales/rfp?status=submitted

# Filter by priority
curl http://localhost:3000/sales/rfp?priority=urgent

# Search
curl http://localhost:3000/sales/rfp?search=CNC

# Combined filters
curl http://localhost:3000/sales/rfp?status=submitted&priority=high
```

## Data Persistence

- Mock data is loaded on service initialization
- Data persists in memory during server runtime
- Restarting the backend will reset to the 8 mock RFPs
- New RFPs created via API are added to the collection
- All CRUD operations work on this in-memory dataset

## Next Steps

1. Access the frontend at **http://localhost:3006/sales/rfp**
2. Explore the 8 pre-populated RFPs
3. Test filtering, searching, and sorting
4. View details by clicking on any RFP card
5. Try both Grid and List views
6. Monitor the KPI dashboard statistics

The mock data provides a comprehensive demonstration of all RFP module features and realistic business scenarios!
