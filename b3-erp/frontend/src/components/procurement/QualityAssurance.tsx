'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Package, AlertTriangle, CheckCircle,
  XCircle, Clock, TrendingUp, Shield, FileText, Camera,
  Settings, Download, Upload, Calendar, Filter, Search,
  BarChart3, PieChart, Activity, Users, Zap, AlertCircle,
  Target, Award, Gauge, ChevronRight, Eye, Edit3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter, Treemap, Sankey
} from 'recharts';

interface QualityAssuranceProps {}

const QualityAssurance: React.FC<QualityAssuranceProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for quality metrics
  const qualityMetrics = {
    passRate: 96.5,
    defectRate: 3.5,
    inspectionsToday: 45,
    pendingInspections: 12,
    avgInspectionTime: '24 min',
    complianceScore: 98.2
  };

  // Mock data for inspection queue
  const inspectionQueue = [
    {
      id: 'INS001',
      poNumber: 'PO2024-001',
      supplier: 'Tech Components Ltd',
      items: 'Electronic Components',
      quantity: 5000,
      priority: 'high',
      dueDate: '2024-12-20',
      status: 'pending',
      inspector: null,
      riskLevel: 'medium'
    },
    {
      id: 'INS002',
      poNumber: 'PO2024-002',
      supplier: 'Metal Works Inc',
      items: 'Steel Plates',
      quantity: 200,
      priority: 'medium',
      dueDate: '2024-12-21',
      status: 'in_progress',
      inspector: 'John Smith',
      riskLevel: 'low'
    },
    {
      id: 'INS003',
      poNumber: 'PO2024-003',
      supplier: 'Chemical Supply Co',
      items: 'Raw Chemicals',
      quantity: 1000,
      priority: 'critical',
      dueDate: '2024-12-19',
      status: 'pending',
      inspector: null,
      riskLevel: 'high'
    }
  ];

  // Mock data for quality trends
  const qualityTrends = [
    { month: 'Jul', passRate: 95.2, defectRate: 4.8, inspections: 320 },
    { month: 'Aug', passRate: 96.1, defectRate: 3.9, inspections: 345 },
    { month: 'Sep', passRate: 95.8, defectRate: 4.2, inspections: 358 },
    { month: 'Oct', passRate: 96.5, defectRate: 3.5, inspections: 372 },
    { month: 'Nov', passRate: 96.3, defectRate: 3.7, inspections: 385 },
    { month: 'Dec', passRate: 96.5, defectRate: 3.5, inspections: 390 }
  ];

  // Mock data for defect categories
  const defectCategories = [
    { name: 'Dimensional', value: 35, color: '#3B82F6' },
    { name: 'Surface Finish', value: 25, color: '#10B981' },
    { name: 'Material', value: 20, color: '#F59E0B' },
    { name: 'Packaging', value: 12, color: '#EF4444' },
    { name: 'Documentation', value: 8, color: '#8B5CF6' }
  ];

  // Mock data for supplier quality scores
  const supplierQualityScores = [
    { supplier: 'Tech Components Ltd', score: 98.5, trend: 'up', inspections: 45 },
    { supplier: 'Metal Works Inc', score: 97.2, trend: 'stable', inspections: 38 },
    { supplier: 'Chemical Supply Co', score: 95.8, trend: 'down', inspections: 52 },
    { supplier: 'Plastic Solutions', score: 99.1, trend: 'up', inspections: 29 },
    { supplier: 'Global Electronics', score: 96.4, trend: 'up', inspections: 41 }
  ];

  // Mock data for inspection templates
  const inspectionTemplates = [
    {
      id: 'TPL001',
      name: 'Electronics Inspection',
      category: 'Electronics',
      checkpoints: 25,
      lastUsed: '2024-12-15',
      usage: 156
    },
    {
      id: 'TPL002',
      name: 'Raw Material Quality Check',
      category: 'Materials',
      checkpoints: 18,
      lastUsed: '2024-12-14',
      usage: 203
    },
    {
      id: 'TPL003',
      name: 'Packaging Verification',
      category: 'Packaging',
      checkpoints: 12,
      lastUsed: '2024-12-16',
      usage: 89
    }
  ];

  // Mock data for compliance standards
  const complianceStandards = [
    { standard: 'ISO 9001', status: 'compliant', score: 98, lastAudit: '2024-11-15' },
    { standard: 'ISO 14001', status: 'compliant', score: 96, lastAudit: '2024-10-20' },
    { standard: 'OHSAS 18001', status: 'pending', score: 94, lastAudit: '2024-09-10' },
    { standard: 'Industry Specific', status: 'compliant', score: 97, lastAudit: '2024-11-01' }
  ];

  // Handler 1: Create Inspection - Comprehensive inspection creation wizard with template selection and assignment
  const handleCreateInspection = () => {
    alert(`🔍 CREATE NEW QUALITY INSPECTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: INSPECTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inspection ID: INS-2024-0456
Created: ${new Date().toLocaleString()}

📋 BASIC INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Purchase Order: PO2024-004
• Supplier: Tech Components Ltd
• Material/Item: Electronic Circuit Boards
• Quantity: 2,500 units
• Batch Number: BATCH-2024-Q4-1234
• Expected Delivery: 2024-12-22

📊 INSPECTION TYPE SELECTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☑️ Incoming Material Inspection (IMI)
☐ First Article Inspection (FAI)
☐ In-Process Quality Inspection (IPQI)
☐ Final Product Inspection (FPI)
☐ Supplier Audit Inspection

🎯 INSPECTION TEMPLATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Selected: "Electronics Inspection Template"
• 25 Quality Checkpoints
• 12 Dimensional Measurements
• 8 Functional Tests
• 5 Visual Criteria

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: RISK & PRIORITY ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ RISK EVALUATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk Level: 🔴 HIGH
Factors:
• Critical component for production line
• New supplier (3 months history)
• Complex technical specifications
• Safety-critical application
• High-value batch ($125,000)

🎯 PRIORITY CLASSIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priority: CRITICAL ⚡
Justification:
• Production scheduled to start in 48 hours
• No alternative suppliers available
• Customer delivery commitment
• Quality issues would halt assembly line

⏰ INSPECTION TIMELINE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Due Date: 2024-12-20 (2 days)
• Target Completion: Within 24 hours
• Sample Size: 125 units (5% of batch)
• Inspection Method: AQL 2.5 (Level II)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: INSPECTOR ASSIGNMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 ASSIGNED INSPECTOR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary: Jane Doe (Quality Inspector III)
• Certification: ASQ CQI, IPC-A-610
• Electronics Expertise: 8 years
• Performance Rating: 92%
• Current Workload: 3 active inspections

Backup: John Smith (Quality Inspector II)
• Availability: On-call
• Specialization: Electronics & PCB

📅 SCHEDULED START:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Date: 2024-12-19 08:00 AM
• Location: Receiving Dock - Bay 3
• Equipment: CMM, Multimeter, Visual Aids
• Estimated Duration: 6-8 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: QUALITY CRITERIA & ACCEPTANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📏 ACCEPTANCE CRITERIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visual Inspection:
• No physical damage or defects
• Proper component placement (±0.5mm)
• Clean solder joints (IPC-A-610 Class 2)
• No contamination or oxidation

Dimensional Verification:
• Board dimensions: ±0.2mm tolerance
• Hole positions: ±0.1mm tolerance
• Component heights: Per specification
• Trace widths: Min 0.15mm

Functional Testing:
• Continuity test: 100% pass required
• Insulation resistance: >100MΩ
• Voltage withstand: 1000V AC, 60 sec
• Electrical parameters: ±5% tolerance

🎯 ACCEPTANCE LIMITS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Critical Defects: 0 allowed (Auto-reject)
• Major Defects: AQL 1.5% (Max 4 in sample)
• Minor Defects: AQL 4.0% (Max 10 in sample)
• Overall Pass Rate: ≥95% required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: NOTIFICATIONS & WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 AUTO-NOTIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notify on Creation:
✅ Inspector (Jane Doe)
✅ Procurement Manager (Sarah Williams)
✅ Quality Manager (Michael Chen)
✅ Supplier Contact (Tech Components Ltd)

Notify on Completion:
✅ Warehouse Supervisor
✅ Production Planning
✅ Engineering (if defects found)

🔔 ESCALATION RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• If not started within 4 hours → Alert Quality Manager
• If >5% defect rate → Immediate escalation
• If critical defects found → Hold batch, notify stakeholders
• If delayed >24 hours → Executive notification

📊 DOCUMENTATION REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Required Attachments:
☑️ Inspection photos (min 10)
☑️ Measurement data sheets
☑️ Test equipment calibration certificates
☑️ Supplier COC (Certificate of Conformance)
☑️ Material certifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ INSPECTION CREATED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inspection ID: INS-2024-0456
Status: PENDING ⏳
Next Action: Inspector assignment confirmed

📱 Notifications sent to 4 stakeholders
🔗 Integration: ERP, WMS, QMS systems updated
📅 Calendar event created for inspector`);
  };

  // Handler 2: Record Results - Record detailed inspection results with measurements and defect tracking
  const handleRecordResults = () => {
    alert(`📝 RECORD INSPECTION RESULTS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSPECTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inspection ID: INS-2024-0456
Inspector: Jane Doe
Date/Time: ${new Date().toLocaleString()}
Duration: 6 hours 45 minutes

Material: Electronic Circuit Boards
Batch: BATCH-2024-Q4-1234
Sample Size: 125 units (5% of 2,500)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: VISUAL INSPECTION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Physical Condition Assessment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checkpoint 1: Surface Cleanliness
Result: ✅ PASS (122/125 units)
• Clean: 122 units (97.6%)
• Minor contamination: 3 units (2.4%)
• Cleaned and re-inspected: 3 units now PASS

Checkpoint 2: Component Placement
Result: ✅ PASS (125/125 units)
• Perfect placement: 125 units (100%)
• Tolerance: ±0.5mm specification
• Actual variance: Max 0.28mm

Checkpoint 3: Solder Joint Quality (IPC-A-610 Class 2)
Result: ⚠️ MINOR ISSUES (118/125 units)
• Excellent: 102 units (81.6%)
• Acceptable: 16 units (12.8%)
• Minor defects: 7 units (5.6%)
  - Cold solder joints: 4 units
  - Insufficient solder: 3 units
• Defect rate within AQL 4.0% limit ✅

Checkpoint 4: PCB Damage/Cracks
Result: ✅ PASS (125/125 units)
• No cracks detected: 100%
• Board integrity: Excellent

Checkpoint 5: Component Orientation
Result: ❌ FAILED (120/125 units)
• Correct orientation: 120 units (96%)
• Reversed polarity: 5 units (4%) 🔴 CRITICAL
• Components affected: Electrolytic capacitors
• Action: REJECT affected units

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: DIMENSIONAL MEASUREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📏 Measured with CMM (Coordinate Measuring Machine):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Parameter 1: Board Length
Specification: 100.0mm ±0.2mm
Measured Range: 99.92mm - 100.15mm
Result: ✅ PASS (All within tolerance)
Cpk: 1.45 (Capable process)

Parameter 2: Board Width
Specification: 75.0mm ±0.2mm
Measured Range: 74.88mm - 75.11mm
Result: ✅ PASS (All within tolerance)
Cpk: 1.38 (Capable process)

Parameter 3: Mounting Hole Positions
Specification: ±0.1mm positional tolerance
Results: ✅ PASS
• Max deviation: 0.078mm
• Average: 0.042mm

Parameter 4: Component Height
Specification: ≤8.5mm max height
Measured Max: 8.32mm
Result: ✅ PASS

Parameter 5: Trace Width (Critical paths)
Specification: 0.15mm minimum
Measured Range: 0.152mm - 0.168mm
Result: ✅ PASS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: FUNCTIONAL TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Electrical Performance Tests:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test 1: Continuity Test
Tested: 125 units
Result: ✅ PASS (125/125)
• All circuits complete: 100%
• No open circuits detected

Test 2: Insulation Resistance
Specification: >100MΩ
Measured Range: 245MΩ - 520MΩ
Result: ✅ PASS (All exceed spec)

Test 3: Hi-Pot Test (1000V AC, 60 sec)
Result: ✅ PASS (125/125)
• No breakdown detected
• Leakage current: <1mA (spec: <5mA)

Test 4: Electrical Parameters
Power Supply Rails:
• +5V: Measured 4.98V - 5.02V ✅
• +12V: Measured 11.94V - 12.06V ✅
• -12V: Measured -11.96V to -12.04V ✅
All within ±5% tolerance

Signal Integrity:
• Rise time: 2.8ns (spec: <5ns) ✅
• Crosstalk: -42dB (spec: <-35dB) ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: DEFECT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Defect Classification:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL DEFECTS: 5 (4.0%)
• Type: Component polarity reversed
• Location: Capacitors C12, C15, C23, C28, C34
• Impact: Circuit malfunction/damage
• Disposition: REJECT units

🟡 MAJOR DEFECTS: 4 (3.2%)
• Type: Cold solder joints
• Impact: Reliability concern
• Disposition: REWORK required

🟢 MINOR DEFECTS: 3 (2.4%)
• Type: Surface contamination (cleaned)
• Type: Insufficient solder (cosmetic only)
• Disposition: ACCEPTED after cleanup

TOTAL DEFECT RATE: 9.6%
AQL Compliance:
• Critical (0 allowed): ❌ FAILED
• Major (AQL 1.5%): ❌ FAILED (3.2% > 1.5%)
• Minor (AQL 4.0%): ✅ PASS (2.4% < 4.0%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 BATCH STATUS: REJECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reason: Critical defects exceed acceptance criteria
• 5 critical defects found (0 allowed)
• Quality risk unacceptable for production

📋 REQUIRED ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ⚠️ IMMEDIATE: Quarantine entire batch (2,500 units)
2. 📧 NOTIFY: Supplier (Tech Components Ltd)
3. 📝 ISSUE: Non-Conformance Report (NCR-2024-089)
4. 🔄 REQUEST: 100% inspection or batch replacement
5. 🚫 HOLD: Payment pending resolution
6. 📊 ESCALATE: Quality Manager & Procurement

💰 FINANCIAL IMPACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Batch Value: $125,000
• Inspection Cost: $2,450
• Potential Rework: $8,500 - $12,000
• Production Delay: 3-5 days
• Alternative Supplier: Investigating

📸 DOCUMENTATION CAPTURED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 47 inspection photos
✅ CMM measurement reports (PDF)
✅ Test equipment calibration certs
✅ Defect location diagrams
✅ Statistical analysis charts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ INSPECTION RESULTS RECORDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Timestamp: ${new Date().toLocaleString()}
Inspector Signature: Jane Doe (Digital)
Next Step: NCR generation & supplier notification`);
  };

  // Handler 3: Reject Material - Material rejection workflow with NCR generation and supplier notification
  const handleRejectMaterial = () => {
    alert(`🚫 MATERIAL REJECTION PROCESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REJECTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 MATERIAL REJECTED
Rejection ID: REJ-2024-0234
Date: ${new Date().toLocaleString()}
Inspector: Jane Doe

Material Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Inspection ID: INS-2024-0456
• PO Number: PO2024-004
• Supplier: Tech Components Ltd
• Item: Electronic Circuit Boards
• Batch Number: BATCH-2024-Q4-1234
• Quantity: 2,500 units
• Value: $125,000
• Location: Receiving Dock - Bay 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REJECTION REASONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 PRIMARY REASON: Critical Quality Defects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Defect Type: Component Polarity Reversal
Severity: CRITICAL
Defect Rate: 4.0% (5 units in 125 sample)
Acceptance Limit: 0% (Zero tolerance for critical)

Affected Components:
• Electrolytic Capacitors (5 instances)
  - C12: Unit #023
  - C15: Unit #047
  - C23: Unit #089
  - C28: Unit #102
  - C34: Unit #118

Impact Assessment:
• Circuit malfunction if powered
• Potential component damage
• Fire/safety hazard
• Cannot be used in production

🟡 SECONDARY ISSUES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Cold solder joints: 3.2% (Exceeds AQL 1.5%)
• Workmanship concerns
• Quality system inadequacy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMMEDIATE ACTIONS TAKEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ QUARANTINE PROCEDURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Material moved to Quarantine Area Q-7
✅ Red rejection tags applied to all pallets
✅ Physical barriers placed around batch
✅ "DO NOT USE" labels affixed (12 locations)
✅ Warehouse system updated: STATUS = REJECTED
✅ Inventory blocked in SAP/ERP

🔒 SECURITY MEASURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Area access restricted to QA personnel only
✅ Video surveillance activated
✅ Daily count verification scheduled
✅ Quarantine log initiated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL & BUSINESS IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 COST ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Material Cost: $125,000
Inspection Cost: $2,450
Handling/Storage: $850
Total Direct Cost: $128,300

Indirect Costs:
• Production delay: 3-5 days
• Expediting fees: Est. $5,000-$8,000
• Overtime for rescheduling: $3,200
• Customer penalty risk: $15,000

Total Estimated Impact: $151,500 - $156,500

📅 PRODUCTION IMPACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Affected Production Orders:
• MO-2024-1567 (Qty: 500) - DELAYED
• MO-2024-1584 (Qty: 750) - DELAYED
• MO-2024-1602 (Qty: 1,250) - AT RISK

Customer Deliveries Impacted:
• Customer A: Order #4523 (Due: 12/28)
• Customer B: Order #4589 (Due: 01/05)
• Customer C: Order #4601 (Due: 01/12)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 OFFICIAL REJECTION NOTICE SENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To: Tech Components Ltd
Contact: David Chen (Quality Manager)
Email: quality@techcomponents.com
CC: Procurement, Engineering, Executive Team

Subject: URGENT - Material Rejection & NCR
Rejection Notice #: REJ-2024-0234
NCR #: NCR-2024-089

Summary Provided:
• Detailed defect analysis with photos
• Statistical data and measurements
• AQL failure documentation
• Required corrective actions
• Disposition options

⚠️ SUPPLIER REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Root Cause Analysis (due in 48 hours)
2. Corrective Action Plan (due in 72 hours)
3. Disposition proposal:
   a) 100% inspection & sorting at supplier cost
   b) Replacement batch (expedited)
   c) Credit memo processing

4. Preventive measures implementation
5. Quality system improvement plan

🔄 DISPOSITION OPTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Option 1: RETURN TO SUPPLIER (RECOMMENDED)
• Cost: $3,200 (shipping + handling)
• Timeline: 2 days
• Credit: Full $125,000
• Supplier bears all costs

Option 2: 100% INSPECTION ON-SITE
• Cost: $18,500 (labor + equipment)
• Timeline: 5 days
• Supplier pays inspection cost
• Defective units returned

Option 3: SCRAP/DISPOSE
• Cost: $1,500 (disposal fees)
• Credit: Negotiate with supplier
• Last resort option

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL ACTIONS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DOCUMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Non-Conformance Report (NCR-2024-089) - ISSUED
✅ Rejection report with photo evidence
✅ Inspection data package compiled
✅ Supplier notification letter sent
✅ Financial impact analysis completed

👥 STAKEHOLDER NOTIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notified within 1 hour:
✅ Quality Manager: Michael Chen
✅ Procurement Manager: Sarah Williams
✅ Production Manager: Tom Rodriguez
✅ Finance Controller: Lisa Anderson
✅ Supply Chain Director: Robert Kim
✅ Engineering Manager: Dr. Emily Watson

Emergency Meeting Scheduled:
📅 Date: Today, 3:00 PM
📍 Location: Conference Room B
🎯 Agenda: Recovery plan & supplier escalation

🔄 ALTERNATIVE SOURCING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backup Supplier Options Activated:
• Supplier B: Global Electronics
  - Lead time: 10 days
  - Price: +8% premium
  - Quality rating: 98.5%

• Supplier C: Advanced Circuits Inc
  - Lead time: 7 days (expedited)
  - Price: +12% premium
  - Quality rating: 99.1%

Procurement team evaluating emergency PO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY MANAGEMENT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUPPLIER PERFORMANCE UPDATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tech Components Ltd - Quality Score Adjusted:
• Previous Score: 95.8%
• New Score: 87.2% (-8.6 points) 🔴
• Status: PROBATION
• Next Review: 2025-01-15

Automatic Triggers Activated:
⚠️ Increased incoming inspection (100% for 3 months)
⚠️ Supplier audit scheduled (30 days)
⚠️ Payment terms revised (Net 60 → Net 90)
⚠️ Alternative supplier qualification expedited

🎯 CONTINUOUS IMPROVEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lessons Learned Session: Scheduled 12/23
Root Cause Team: Assigned
Process Review: Supplier onboarding procedure
8D Report: Initiated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MATERIAL REJECTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: REJECTED & QUARANTINED
NCR Issued: NCR-2024-089
Supplier Notified: ${new Date().toLocaleString()}
Next Review: 48 hours (awaiting supplier RCA)

🔔 All notifications sent successfully
📊 All systems updated
🔒 Material secured in quarantine`);
  };

  // Handler 4: Issue NCR - Generate Non-Conformance Report with root cause analysis and CAPA
  const handleIssueNCR = () => {
    alert(`📋 NON-CONFORMANCE REPORT (NCR)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NCR HEADER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NCR Number: NCR-2024-089
Date Issued: ${new Date().toLocaleString()}
Issued By: Jane Doe (Quality Inspector III)
Status: OPEN 🔴
Priority: CRITICAL ⚡

Related Documents:
• Inspection ID: INS-2024-0456
• Rejection ID: REJ-2024-0234
• Purchase Order: PO2024-004
• Batch Number: BATCH-2024-Q4-1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: NON-CONFORMANCE DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 DEFECT IDENTIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type: Component Assembly Error
Category: Manufacturing Defect
Severity: CRITICAL

Detailed Description:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Electronic circuit boards received from Tech Components Ltd
exhibit critical component polarity reversal defects. During
incoming inspection, 5 out of 125 sampled units (4.0%) were
found to have electrolytic capacitors installed with reversed
polarity.

Affected Components:
• Part Number: CAP-ELEC-100UF-25V
• Designators: C12, C15, C23, C28, C34
• Supplier Part: EC-100-25-TH
• Units Affected: 5 in sample (potential 100 in full batch)

Discovery Method:
Visual inspection during incoming quality control identified
polarity markings inconsistent with PCB silkscreen and
component datasheet specifications.

🎯 SPECIFICATION REFERENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Drawing: DWG-ECB-2024-045 Rev C
• IPC Standard: IPC-A-610 Class 2
• Component Orientation: Per BOM Item 23
• Acceptance Criteria: 0% critical defects allowed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: IMPACT ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ QUALITY IMPACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity Level: CRITICAL
Quality Risk: HIGH

Potential Consequences if Used:
1. Immediate circuit failure upon power-up
2. Capacitor damage/explosion risk
3. Damage to adjacent components
4. Fire hazard (electrolytic capacitor reversal)
5. Complete board failure
6. Safety risk to end users

Defect Rate Analysis:
• Sample size: 125 units (5% of batch)
• Defects found: 5 units
• Observed defect rate: 4.0%
• Projected batch defects: ~100 units (Est.)
• AQL limit: 0% for critical defects
• Conclusion: FAILED inspection ❌

💰 FINANCIAL IMPACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Direct Costs:
• Rejected material value: $125,000
• Inspection costs: $2,450
• Quarantine/handling: $850
• Subtotal: $128,300

Indirect Costs:
• Production delay (3-5 days): $12,000
• Expediting alternative source: $6,500
• Rescheduling/overtime: $3,200
• Storage costs: $400
• Potential customer penalties: $15,000

Total Estimated Impact: $165,400

📅 SCHEDULE IMPACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Production Orders Delayed: 3
Manufacturing lead time impact: 3-5 days
Customer deliveries at risk: 3 orders
Potential late delivery penalty: Yes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: ROOT CAUSE ANALYSIS (8D Process)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 5-WHY ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Why 1: Why were capacitors installed backwards?
→ Assembly operator did not verify polarity marking

Why 2: Why didn't operator verify polarity?
→ Work instruction photos were unclear/ambiguous

Why 3: Why were work instructions unclear?
→ Recent component supplier change; new marking style

Why 4: Why wasn't new component marking identified?
→ First Article Inspection (FAI) not performed for
   component supplier change

Why 5: Why was FAI not performed?
→ Supplier change notification process breakdown;
   Procurement did not trigger engineering review

ROOT CAUSE IDENTIFIED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Process Failure: Supplier change management
Missing Control: First Article Inspection requirement
Contributing Factor: Inadequate work instruction update process

🎯 CONTRIBUTING FACTORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Supplier quality management gap
2. Component approval process inadequate
3. Visual work aid outdated
4. Operator training on new component insufficient
5. No verification step in assembly process

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: CONTAINMENT ACTIONS (IMMEDIATE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ACTIONS TAKEN (Within 4 hours):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 1. Material Quarantine
   • Full batch (2,500 units) moved to quarantine area
   • Red tag applied, system blocked
   • Status: COMPLETE (12:45 PM)

✅ 2. Supplier Notification
   • Tech Components Ltd notified
   • Stop shipment request issued
   • Status: COMPLETE (1:15 PM)

✅ 3. Inventory Check
   • No other batches from this supplier in stock
   • Status: COMPLETE (2:00 PM)

✅ 4. Production Hold
   • All work orders using this material: ON HOLD
   • Production planning notified
   • Status: COMPLETE (2:30 PM)

✅ 5. Customer Notification Preparation
   • Draft communications prepared
   • Awaiting management approval
   • Status: IN PROGRESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: CORRECTIVE ACTIONS (CAPA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 SHORT-TERM CORRECTIVE ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CA-1: Supplier Corrective Action
Owner: Procurement Manager (Sarah Williams)
Due Date: 2024-12-23
Actions:
• Require supplier 8D report (48 hours)
• Demand 100% inspection of existing inventory
• Request process audit at supplier facility
Status: ASSIGNED

CA-2: Material Disposition
Owner: Quality Manager (Michael Chen)
Due Date: 2024-12-22
Actions:
• Evaluate disposition options with supplier
• Coordinate return or replacement
• Process credit memo
Status: ASSIGNED

CA-3: Alternative Source Activation
Owner: Procurement Manager
Due Date: 2024-12-21
Actions:
• Issue emergency PO to backup supplier
• Expedite delivery (7-10 days)
• Arrange quality verification
Status: IN PROGRESS

🛡️ LONG-TERM PREVENTIVE ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PA-1: Supplier Change Management Process
Owner: Supply Chain Director (Robert Kim)
Due Date: 2025-01-15
Actions:
• Revise supplier change notification procedure
• Implement mandatory engineering review
• Require First Article Inspection for changes
• Update procurement policy (SOP-PRO-003)
Status: PLANNED

PA-2: Enhanced Incoming Inspection
Owner: Quality Manager
Due Date: 2025-01-05
Actions:
• Increase inspection frequency for this supplier (100%)
• Update inspection checklist for polarity-sensitive parts
• Implement photo verification in inspection system
Status: PLANNED

PA-3: Work Instruction Improvement
Owner: Manufacturing Engineering (Dr. Emily Watson)
Due Date: 2025-01-10
Actions:
• Update all work instructions with component photos
• Add polarity verification checkpoints
• Implement operator self-check requirement
• Conduct refresher training
Status: PLANNED

PA-4: Supplier Quality Rating System
Owner: Quality Manager
Due Date: 2025-01-20
Actions:
• Place supplier on probation status
• Require monthly quality reports
• Schedule supplier audit (Q1 2025)
• Evaluate supplier certification status
Status: PLANNED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: VERIFICATION & CLOSURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 VERIFICATION PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Effectiveness Check (30 days after CAPA):
• Verify supplier change process implementation
• Review next 3 incoming inspections (100% pass rate)
• Audit work instruction compliance
• Review supplier performance metrics

Success Criteria:
✓ No repeat occurrences for 90 days
✓ Supplier quality score >95%
✓ Process audit findings: 0 major
✓ All preventive actions implemented

Target Closure Date: 2025-02-15

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROVAL & SIGN-OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prepared By:
Jane Doe, Quality Inspector III
Date: ${new Date().toLocaleString()}

Reviewed By:
Michael Chen, Quality Manager
Status: PENDING REVIEW

Approved By:
[Awaiting Director Approval]

Distribution List:
✅ Quality Manager
✅ Procurement Manager
✅ Production Manager
✅ Engineering Manager
✅ Supply Chain Director
✅ Finance Controller
☐ Supplier (after approval)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 NCR TRACKING METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NCR Category: Supplier Quality
Supplier NCRs (YTD): 3 (This is the 3rd)
Cost Impact: $165,400
Days Open: 0 (Target: <30 days)

Previous NCRs for this supplier:
• NCR-2024-067 (Oct): Packaging damage
• NCR-2024-045 (Aug): Dimensional variance

⚠️ TREND ALERT: Supplier quality declining
Recommendation: Consider supplier replacement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ NCR ISSUED & DISTRIBUTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NCR #: NCR-2024-089
Status: OPEN 🔴
Next Review: 2024-12-20 (48 hours)
CAPA Due: Various dates (see Section 5)`);
  };

  // Handler 5: Track Trends - Analyze quality trends with statistical process control and predictive analytics
  const handleTrackTrends = () => {
    alert(`📈 QUALITY TRENDS ANALYSIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TREND ANALYSIS DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Period: Last 6 Months (Jul - Dec 2024)
Generated: ${new Date().toLocaleString()}
Analysis Type: Statistical Process Control (SPC)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: KEY PERFORMANCE INDICATORS (KPIs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 OVERALL QUALITY METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

First Pass Yield (FPY):
Current: 96.5%
Target: 95.0%
Trend: ↗ IMPROVING (+1.3% vs 6 months ago)
Status: ✅ ABOVE TARGET

Defect Rate:
Current: 3.5%
Target: <5.0%
Trend: ↘ IMPROVING (-1.3% vs 6 months ago)
Status: ✅ MEETING TARGET

Inspection Pass Rate:
Current: 91.2%
6-Month Average: 92.8%
Trend: ↘ DECLINING (-1.6%)
Status: ⚠️ ATTENTION NEEDED

Cost of Poor Quality (COPQ):
Current: $45,230/month
Target: <$40,000/month
Trend: ↗ INCREASING (+5.1%)
Status: 🔴 ABOVE TARGET

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: MONTHLY TREND ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 MONTH-BY-MONTH BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JULY 2024:
• Inspections: 320
• Pass Rate: 95.2%
• Defect Rate: 4.8%
• NCRs Issued: 4
• Top Defect: Dimensional variance (42%)

AUGUST 2024:
• Inspections: 345 (+7.8%)
• Pass Rate: 96.1% (↗ +0.9%)
• Defect Rate: 3.9% (↘ -0.9%)
• NCRs Issued: 3
• Top Defect: Surface finish (38%)

SEPTEMBER 2024:
• Inspections: 358 (+3.8%)
• Pass Rate: 95.8% (↘ -0.3%)
• Defect Rate: 4.2% (↗ +0.3%)
• NCRs Issued: 5
• Top Defect: Material quality (35%)

OCTOBER 2024:
• Inspections: 372 (+3.9%)
• Pass Rate: 96.5% (↗ +0.7%)
• Defect Rate: 3.5% (↘ -0.7%)
• NCRs Issued: 2
• Top Defect: Packaging (40%)

NOVEMBER 2024:
• Inspections: 385 (+3.5%)
• Pass Rate: 96.3% (↘ -0.2%)
• Defect Rate: 3.7% (↗ +0.2%)
• NCRs Issued: 4
• Top Defect: Documentation (45%)

DECEMBER 2024 (MTD):
• Inspections: 390 (+1.3%)
• Pass Rate: 96.5% (↗ +0.2%)
• Defect Rate: 3.5% (↘ -0.2%)
• NCRs Issued: 3 (including NCR-2024-089)
• Top Defect: Assembly error (48%)

📊 STATISTICAL SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mean Pass Rate: 96.1%
Standard Deviation: 0.46%
Process Capability (Cpk): 1.42
Control Status: ✅ IN CONTROL (No special causes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: DEFECT CATEGORY ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 TOP 5 DEFECT CATEGORIES (6-Month Total):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DIMENSIONAL DEFECTS: 35%
   • Count: 287 occurrences
   • Impact: Medium
   • Trend: ↘ DECREASING (-5% vs prior period)
   • Primary Causes:
     - Tooling wear (42%)
     - Supplier process variation (38%)
     - Measurement uncertainty (20%)

2. SURFACE FINISH: 25%
   • Count: 205 occurrences
   • Impact: Low-Medium
   • Trend: → STABLE
   • Primary Causes:
     - Handling damage (55%)
     - Storage conditions (30%)
     - Manufacturing process (15%)

3. MATERIAL DEFECTS: 20%
   • Count: 164 occurrences
   • Impact: High
   • Trend: ↗ INCREASING (+8% vs prior period) ⚠️
   • Primary Causes:
     - Raw material quality (60%)
     - Supplier issues (25%)
     - Specification changes (15%)

4. PACKAGING DEFECTS: 12%
   • Count: 98 occurrences
   • Impact: Low
   • Trend: ↘ DECREASING (-3%)
   • Primary Causes:
     - Shipping damage (70%)
     - Inadequate packaging (30%)

5. DOCUMENTATION ERRORS: 8%
   • Count: 66 occurrences
   • Impact: Low
   • Trend: → STABLE
   • Primary Causes:
     - Missing COC (45%)
     - Incorrect labeling (35%)
     - Drawing revisions (20%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: SUPPLIER QUALITY TRENDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUPPLIER PERFORMANCE TRENDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECH COMPONENTS LTD:
Current Score: 95.8%
6-Month Trend: ↘ DECLINING
Starting Score (Jul): 98.2%
Change: -2.4 points 🔴
NCRs: 3 (Above average)
Status: ⚠️ PROBATION
Action: Supplier audit scheduled

METAL WORKS INC:
Current Score: 97.2%
6-Month Trend: → STABLE
Variance: ±0.5%
NCRs: 1
Status: ✅ APPROVED
Action: Continue monitoring

CHEMICAL SUPPLY CO:
Current Score: 95.8%
6-Month Trend: ↘ SLIGHT DECLINE
Starting Score (Jul): 97.1%
Change: -1.3 points
NCRs: 2
Status: ⚠️ WATCH LIST
Action: Increase inspection frequency

PLASTIC SOLUTIONS:
Current Score: 99.1%
6-Month Trend: ↗ IMPROVING
Starting Score (Jul): 97.8%
Change: +1.3 points ✅
NCRs: 0
Status: ✅ STRATEGIC PARTNER
Action: None - exemplary performance

GLOBAL ELECTRONICS:
Current Score: 96.4%
6-Month Trend: ↗ IMPROVING
Starting Score (Jul): 95.2%
Change: +1.2 points
NCRs: 1
Status: ✅ APPROVED
Action: Continue monitoring

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: STATISTICAL PROCESS CONTROL (SPC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📉 CONTROL CHART ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pass Rate Control Chart (X-bar Chart):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UCL (Upper Control Limit): 97.4%
Center Line (Mean): 96.1%
LCL (Lower Control Limit): 94.8%

Process Status: ✅ IN CONTROL
• All points within control limits
• No runs or trends detected
• Normal variation observed
• Process capability: CAPABLE (Cpk = 1.42)

Defect Rate Control Chart (p-Chart):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UCL: 5.2%
Center Line: 3.9%
LCL: 2.6%

Process Status: ✅ IN CONTROL
• One point near UCL (Dec: polarity defect)
• No assignable causes beyond recent NCR
• Process stable overall

🎯 PROCESS CAPABILITY ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cp (Process Capability): 1.56
Cpk (Process Capability Index): 1.42
Interpretation: CAPABLE PROCESS
• Cp > 1.33: Capable
• Cpk > 1.33: Centered and capable
• Sigma Level: ~4.2σ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: PREDICTIVE ANALYTICS & FORECASTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔮 3-MONTH FORECAST (Jan - Mar 2025):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on Linear Regression Model:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
R² = 0.78 (Good fit)

Predicted Pass Rate:
• January 2025: 96.7% (±0.5%)
• February 2025: 96.8% (±0.5%)
• March 2025: 96.9% (±0.6%)
Trend: ↗ CONTINUED IMPROVEMENT expected

Predicted Defect Rate:
• January 2025: 3.3% (±0.5%)
• February 2025: 3.2% (±0.5%)
• March 2025: 3.1% (±0.6%)
Trend: ↘ CONTINUED DECLINE expected

Predicted Inspection Volume:
• January 2025: 405 inspections
• February 2025: 418 inspections
• March 2025: 432 inspections
Trend: ↗ INCREASING workload

⚠️ RISK FACTORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Supplier quality declining (Tech Components)
2. Material defects trending upward
3. Inspection volume increasing (resource constraint)
4. Cost of poor quality above target

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: KEY INSIGHTS & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 POSITIVE TRENDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Overall quality improving (+1.3% FPY improvement)
✅ Defect rate declining consistently
✅ Process in statistical control
✅ Most suppliers performing well
✅ Dimensional defects decreasing

⚠️ AREAS OF CONCERN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 Material defects increasing (+8%)
🔴 Cost of poor quality above target (+5.1%)
🔴 Tech Components Ltd quality declining
⚠️ Inspection volume growing faster than capacity
⚠️ Three suppliers on watch list/probation

📋 RECOMMENDED ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGH PRIORITY (Next 30 days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Conduct supplier audit: Tech Components Ltd
2. Root cause analysis: Material defect increase
3. Resource planning: Add 1 inspector (Q1 2025)
4. COPQ reduction initiative: Target $10K/month
5. Implement automated inspection (reduce time 30%)

MEDIUM PRIORITY (Next 90 days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. Supplier development program for 3 at-risk suppliers
7. Update incoming inspection procedures
8. Invest in measurement equipment (CMM upgrade)
9. Launch Six Sigma project: Reduce material defects
10. Implement real-time SPC dashboards

LOW PRIORITY (Next 6 months):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. Supplier consolidation analysis
12. ISO 9001 certification renewal preparation
13. Advanced analytics implementation (AI/ML)
14. Quality training program expansion
15. Benchmark against industry standards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: BENCHMARKING & INDUSTRY COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INDUSTRY BENCHMARKS (Electronics Manufacturing):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metric              | Our Performance | Industry Avg | Best-in-Class
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First Pass Yield    | 96.5%          | 94.2%       | 98.5%
Defect Rate         | 3.5%           | 5.8%        | 1.5%
Inspection Pass     | 91.2%          | 88.5%       | 95.0%
COPQ (% of sales)   | 2.1%           | 2.8%        | 1.2%
Supplier Quality    | 97.2%          | 95.0%       | 99.0%

ASSESSMENT:
✅ ABOVE AVERAGE: FPY, Defect Rate, Supplier Quality
⚠️ AVERAGE: Inspection Pass Rate
🎯 TARGET: Reach best-in-class within 18 months

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TREND ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Generated: ${new Date().toLocaleString()}
Next Scheduled Analysis: Monthly (1st of month)
Distribution: Quality Team, Management, Suppliers

📊 Interactive Dashboard Available in QMS
📧 Monthly report emailed to stakeholders
🔔 Alerts configured for out-of-control conditions`);
  };

  // Handler 6: View Supplier Report - Detailed supplier quality performance report
  const handleViewSupplierReport = (supplierName: string) => {
    alert(`📊 SUPPLIER QUALITY REPORT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier: ${supplierName}
Report Period: Last 12 Months
Generated: ${new Date().toLocaleString()}
Report ID: SQR-2024-${Math.floor(Math.random() * 1000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Quality Score: 98.5%
Status: ✅ APPROVED
Tier Classification: Strategic Partner
Trend: ↗ IMPROVING (+2.1% YoY)

Key Highlights:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Zero critical defects in 12 months
✅ On-time delivery: 99.2%
✅ Inspection pass rate: 97.8%
✅ No NCRs issued in Q4 2024
✅ ISO 9001:2015 certified
✅ Responsive to quality issues

Areas for Improvement:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Minor packaging issues (3 instances)
⚠️ Documentation completeness (95% vs 100% target)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INSPECTION PERFORMANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Inspections Conducted: 45
Batches Received: 38
Total Units Inspected: 5,650

Pass Rate Breakdown:
• Passed First Time: 44 (97.8%)
• Passed After Rework: 1 (2.2%)
• Rejected: 0 (0%)

Defect Analysis:
• Critical Defects: 0
• Major Defects: 2 (0.04% of units)
• Minor Defects: 12 (0.21% of units)
• Total Defect Rate: 0.25% ✅

Average Inspection Time: 18 minutes
Target: <30 minutes ✅

💰 FINANCIAL PERFORMANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Spend (12 months): $2,450,000
Average Order Value: $64,474
On-Time Payment Rating: 100%

Cost of Poor Quality:
• Rework costs: $850
• Inspection costs: $2,200
• Total COPQ: $3,050 (0.12% of spend) ✅
Industry Average: 2-3%

Return Rate: 0% ✅
Credit Memos Issued: 0

📅 DELIVERY PERFORMANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On-Time Delivery: 99.2% (38/38 deliveries)
• Early: 5 deliveries (13%)
• On-Time: 32 deliveries (84%)
• Late: 1 delivery (3%) - Weather delay, excused

Average Lead Time: 14 days
Lead Time Reliability: ±2 days (Excellent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT HISTORY & TRENDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 QUARTERLY BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q1 2024 (Jan-Mar):
• Inspections: 12
• Pass Rate: 91.7%
• Defects: 1 major (dimensional)
• Quality Score: 96.5%

Q2 2024 (Apr-Jun):
• Inspections: 11
• Pass Rate: 100%
• Defects: 0
• Quality Score: 99.0%

Q3 2024 (Jul-Sep):
• Inspections: 10
• Pass Rate: 100%
• Defects: 0
• Quality Score: 99.5%

Q4 2024 (Oct-Dec):
• Inspections: 12
• Pass Rate: 100%
• Defects: 0
• Quality Score: 99.8% ✅ BEST QUARTER

TREND ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Direction: ↗ STRONGLY IMPROVING
Consistency: Excellent (3 consecutive perfect quarters)
Reliability: Very High

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLIANCE & CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ISO 9001:2015 (Valid until: 2026-08-15)
✅ ISO 14001:2015 (Environmental)
✅ RoHS Compliant
✅ REACH Compliant
✅ Conflict Minerals: Certified
✅ UL Listed Components

Last Audit: 2024-06-10 (Passed with 0 findings)
Next Audit: 2025-06-10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORRECTIVE ACTIONS & RESPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NCRs Issued (12 months): 0
CARs Issued: 1 (Q1 2024 - Dimensional defect)

CAR Response Performance:
• Response Time: 24 hours (Target: 48 hours) ✅
• Root Cause Provided: Yes, with 8D report
• Corrective Action: Tooling replacement
• Effectiveness: 100% (No recurrence)

Supplier Responsiveness Rating: 10/10
Communication Quality: Excellent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 STRATEGIC ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✅ MAINTAIN Strategic Partner status
2. ✅ CONSIDER Volume increase opportunities
3. ✅ EXPLORE Long-term agreement (3-year)
4. ✅ REDUCE Incoming inspection frequency (from 100% to sampling)
5. ✅ NOMINATE For "Supplier Excellence Award 2024"

Suggested Changes:
• Inspection Level: Reduce to AQL sampling (Cost savings: $15K/year)
• Payment Terms: Improve to Net 45 (from Net 60)
• Partnership: Joint development projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARATIVE RANKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ranking Among All Suppliers: #1 out of 47
Category Ranking: #1 (Electronics Components)

Performance vs. Average:
• Quality Score: +3.5% above average
• Delivery: +4.2% above average
• Responsiveness: Top tier
• Cost Competitiveness: Market competitive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUPPLIER REPORT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Assessment: EXCELLENT SUPPLIER
Recommendation: CONTINUE & EXPAND PARTNERSHIP
Next Review: 2025-01-15

📊 Detailed charts and graphs available in full report
📧 Report shared with Procurement & Management`);
  };

  // Handler 7: New Inspection Button - Start creating a new inspection
  const handleNewInspection = () => {
    handleCreateInspection();
  };

  // Handler 8: Generate Report - Generate quality reports
  const handleGenerateReport = () => {
    alert(`📄 GENERATING QUALITY REPORT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORT GENERATION WIZARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Type: Inspection Summary Report
Date Range: Last 30 Days (Nov 17 - Dec 16, 2024)
Format: PDF
Generated By: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORT CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 EXECUTIVE SUMMARY (Page 1):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Inspections: 195
• Pass Rate: 96.5%
• Defect Rate: 3.5%
• NCRs Issued: 3
• Critical Defects: 5
• Major Defects: 12
• Minor Defects: 28

📈 TREND CHARTS (Pages 2-4):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Daily inspection volume trend
• Pass/Fail rate over time
• Defect category distribution (pie chart)
• Supplier quality comparison (bar chart)
• Inspector performance metrics

📋 DETAILED INSPECTION LOG (Pages 5-12):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Complete list of all 195 inspections
• Inspection results summary
• Defect details and classifications
• Inspector assignments
• Disposition records

🏭 SUPPLIER ANALYSIS (Pages 13-15):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Quality scores by supplier
• Trend analysis
• NCR summary
• Performance rankings

📊 STATISTICAL ANALYSIS (Pages 16-18):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Control charts (X-bar, p-chart)
• Process capability (Cp, Cpk)
• Pareto analysis
• Six Sigma metrics

🎯 ACTION ITEMS & RECOMMENDATIONS (Page 19):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Areas requiring attention
• Improvement opportunities
• Supplier development needs
• Process optimization suggestions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCESSING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Progress:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Gathering inspection data... (Complete)
✅ Analyzing quality metrics... (Complete)
✅ Generating charts and graphs... (Complete)
✅ Compiling supplier performance... (Complete)
✅ Creating statistical summaries... (Complete)
✅ Formatting PDF document... (Complete)

🎨 REPORT FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Professional formatting
• Interactive table of contents
• Color-coded status indicators
• High-resolution charts
• Embedded photos (top defects)
• Hyperlinked NCR references

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ REPORT GENERATED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 File Name: QualityReport_InspectionSummary_Dec2024.pdf
📏 File Size: 2.3 MB
📄 Pages: 19

📧 DISTRIBUTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email sent to:
✅ Quality Manager (Michael Chen)
✅ Procurement Manager (Sarah Williams)
✅ Production Manager (Tom Rodriguez)
✅ Engineering Manager (Dr. Emily Watson)
✅ Supply Chain Director (Robert Kim)

💾 SAVED LOCATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Quality Management System (QMS)
✅ SharePoint: /Quality/Reports/2024/December/
✅ Network Drive: Q:\\QualityReports\\2024\\
✅ Available for download in browser

🔗 Quick Actions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Download PDF
• Email to additional recipients
• Schedule recurring report (monthly)
• Export data to Excel
• Print physical copy

Next Scheduled Report: January 15, 2025`);
  };

  // Handler 9: Create Template - Create a new inspection template
  const handleCreateTemplate = () => {
    alert(`📝 CREATE INSPECTION TEMPLATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSPECTION TEMPLATE BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Template ID: TPL-2024-${Math.floor(Math.random() * 1000)}
Created: ${new Date().toLocaleString()}
Status: DRAFT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: BASIC INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Template Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Template Name: "Mechanical Parts Inspection"
Category: Raw Materials / Mechanical Components
Applies To: Machined parts, castings, forgings

Description:
Comprehensive inspection template for mechanical components
including dimensional verification, surface finish, and
material certification review.

Target Industries:
☑️ Automotive
☑️ Aerospace
☑️ Industrial Equipment
☐ Electronics
☐ Medical Devices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: INSPECTION CHECKPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SECTION A: VISUAL INSPECTION (8 checkpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 1. Surface Finish Quality
   Type: Visual/Tactile
   Acceptance: Ra ≤ 3.2 μm (or per drawing)
   Tools: Surface roughness tester
   Critical: No

✅ 2. Cracks/Defects
   Type: Visual/Dye Penetrant
   Acceptance: Zero tolerance
   Tools: Magnifier, dye penetrant kit
   Critical: Yes

✅ 3. Burrs/Sharp Edges
   Type: Visual/Tactile
   Acceptance: Deburred per MIL-STD-45662
   Tools: Visual inspection
   Critical: No

✅ 4. Corrosion/Oxidation
   Type: Visual
   Acceptance: None visible
   Tools: Visual inspection
   Critical: No

✅ 5. Coating/Plating (if applicable)
   Type: Visual/Thickness gauge
   Acceptance: Per specification
   Tools: Coating thickness gauge
   Critical: No

✅ 6. Part Marking/Identification
   Type: Visual
   Acceptance: Clear, legible, correct
   Tools: Visual inspection
   Critical: Yes

✅ 7. Packaging Condition
   Type: Visual
   Acceptance: Intact, no damage
   Tools: Visual inspection
   Critical: No

✅ 8. Cleanliness
   Type: Visual
   Acceptance: Free of oils, chips, contaminants
   Tools: Visual inspection
   Critical: No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SECTION B: DIMENSIONAL VERIFICATION (12 checkpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 9. Overall Length
   Nominal: [Per drawing]
   Tolerance: ±0.1mm
   Measurement Tool: Caliper/Micrometer
   Critical: Yes

✅ 10. Overall Width
   Nominal: [Per drawing]
   Tolerance: ±0.1mm
   Measurement Tool: Caliper
   Critical: Yes

✅ 11. Overall Height/Thickness
   Nominal: [Per drawing]
   Tolerance: ±0.05mm
   Measurement Tool: Micrometer
   Critical: Yes

✅ 12. Hole Diameters (Critical)
   Nominal: [Per drawing]
   Tolerance: H7/g6 per ISO 286
   Measurement Tool: Pin gauges/CMM
   Critical: Yes

✅ 13. Thread Dimensions
   Specification: [Per drawing - M6x1.0]
   Acceptance: GO/NO-GO gauges
   Measurement Tool: Thread gauges
   Critical: Yes

✅ 14. Perpendicularity/Parallelism
   Tolerance: Per GD&T on drawing
   Measurement Tool: CMM/Surface plate
   Critical: Yes

✅ 15. Concentricity/Runout
   Tolerance: Per GD&T on drawing
   Measurement Tool: CMM/Dial indicator
   Critical: No

✅ 16. Flatness
   Tolerance: Per GD&T on drawing
   Measurement Tool: Surface plate/CMM
   Critical: No

✅ 17. Angular Dimensions
   Tolerance: ±0.5°
   Measurement Tool: Protractor/CMM
   Critical: No

✅ 18. Radii/Chamfers
   Nominal: Per drawing
   Tolerance: ±0.2mm
   Measurement Tool: Radius gauge/Profile projector
   Critical: No

✅ 19. Keyway Dimensions
   Nominal: Per drawing
   Tolerance: ±0.05mm
   Measurement Tool: Caliper/Depth micrometer
   Critical: Yes

✅ 20. Weight (if specified)
   Nominal: [Per specification]
   Tolerance: ±5%
   Measurement Tool: Calibrated scale
   Critical: No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SECTION C: MATERIAL VERIFICATION (5 checkpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 21. Material Certification Review
   Required: Mill Test Report (MTR)
   Verification: Match material grade to spec
   Critical: Yes

✅ 22. Hardness Testing (if required)
   Specification: HRC 45-50 (example)
   Measurement Tool: Rockwell hardness tester
   Critical: Yes (if specified)

✅ 23. Material Traceability
   Required: Heat/Lot number marking
   Verification: Traceable to MTR
   Critical: Yes

✅ 24. Chemical Composition (if required)
   Method: Spectroscopy/XRF
   Acceptance: Per ASTM/SAE specification
   Critical: Yes (if specified)

✅ 25. Tensile Properties (if required)
   Method: Destructive testing (sample basis)
   Acceptance: Per material standard
   Critical: Yes (if specified)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SECTION D: FUNCTIONAL TESTING (3 checkpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 26. Fit Testing (if applicable)
   Method: Trial assembly with mating part
   Acceptance: Smooth fit, no binding
   Critical: No

✅ 27. Thread Engagement Test
   Method: Assemble with mating thread
   Acceptance: Full engagement, no cross-threading
   Critical: Yes

✅ 28. Operational Test (if applicable)
   Method: Function test per work instruction
   Acceptance: Performs as intended
   Critical: Yes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 SECTION E: DOCUMENTATION REVIEW (4 checkpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 29. Certificate of Conformance (COC)
   Required: Yes
   Verification: Signed by supplier QA
   Critical: Yes

✅ 30. Material Test Report (MTR)
   Required: Yes (for critical materials)
   Verification: Complete and accurate
   Critical: Yes

✅ 31. Inspection Report from Supplier
   Required: Preferred
   Verification: Review data
   Critical: No

✅ 32. Compliance Certificates (RoHS, REACH, etc.)
   Required: As specified
   Verification: Current and valid
   Critical: Yes (if required)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: SAMPLING PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INSPECTION LEVEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☑️ AQL Sampling (ANSI/ASQ Z1.4)
☐ 100% Inspection
☐ Skip Lot (for trusted suppliers)

AQL Parameters:
• Inspection Level: II (General)
• Critical Defects: AQL 0 (Zero acceptance)
• Major Defects: AQL 1.5
• Minor Defects: AQL 4.0

Sample Size Determination:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lot Size 1-50: Sample 5 units
Lot Size 51-150: Sample 13 units
Lot Size 151-500: Sample 32 units
Lot Size 501-1200: Sample 50 units
Lot Size 1201+: Sample 80 units

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: EQUIPMENT & TOOLS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 REQUIRED EQUIPMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Digital Caliper (0-150mm, ±0.01mm)
✅ Micrometer Set (0-75mm, ±0.001mm)
✅ CMM (Coordinate Measuring Machine)
✅ Thread Gauges (GO/NO-GO)
✅ Pin Gauge Set
✅ Surface Roughness Tester
✅ Hardness Tester (Rockwell/Brinell)
✅ Dial Indicator with Magnetic Base
✅ Surface Plate (Grade A)
✅ Calibrated Scale (0-5kg, ±0.1g)

Optional Equipment:
☐ Optical Comparator/Profile Projector
☐ XRF Analyzer (material verification)
☐ Dye Penetrant Kit (crack detection)

Calibration Requirements:
All measurement equipment must have valid
calibration certificates (±6 months)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: INSPECTOR QUALIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Required Certifications/Training:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Quality Inspector Level II or higher
✅ GD&T Training (ASME Y14.5)
✅ Measurement equipment training
✅ Material identification training
☑️ CMM operation certification (preferred)
☑️ ISO 9001 awareness training (preferred)

Minimum Experience: 2 years in mechanical inspection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TEMPLATE CREATED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Template ID: TPL-2024-004
Template Name: Mechanical Parts Inspection
Total Checkpoints: 32
  • Critical: 14
  • Non-Critical: 18

Status: READY FOR USE

📋 Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Review and approve template
• Assign to material categories
• Train inspectors
• Begin using in inspections

💾 Template saved to Quality Management System
🔗 Available in template library`);
  };

  // Handler 10: Use Template - Use an existing template for inspection
  const handleUseTemplate = (templateName: string) => {
    alert(`🔍 USING INSPECTION TEMPLATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMPLATE SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selected Template: ${templateName}
Template ID: TPL-001
Category: Electronics
Checkpoints: 25

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATING NEW INSPECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Loading template configuration...
✅ 25 checkpoints loaded
✅ Acceptance criteria configured
✅ Equipment list prepared
✅ Sample size calculated

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Enter inspection details (PO, supplier, batch)
2. Assign inspector
3. Set inspection schedule
4. Begin inspection process

Template ready to use!
Redirecting to inspection creation wizard...`);
  };

  // Handler 11: Edit Template - Edit an existing inspection template
  const handleEditTemplate = (templateId: string) => {
    alert(`✏️ EDIT INSPECTION TEMPLATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMPLATE EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Template ID: ${templateId}
Template Name: Electronics Inspection Template
Last Modified: 2024-12-14
Version: 2.3

Current Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Checkpoints: 25
• Critical Checkpoints: 10
• Equipment Required: 8 items
• Estimated Time: 45 minutes
• Usage Count: 156 inspections

Available Actions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ Add new checkpoints
✏️ Modify existing checkpoints
✏️ Update acceptance criteria
✏️ Change sampling plan
✏️ Update equipment list
✏️ Modify inspector requirements

📝 EDITING INTERFACE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section A: Visual Inspection
[Edit] Checkpoint 1: Physical damage check
[Edit] Checkpoint 2: Component placement
[Edit] Checkpoint 3: Solder joint quality
[Edit] Checkpoint 4: PCB damage/cracks
[Add New Checkpoint]

Section B: Functional Testing
[Edit] Checkpoint 5: Power-on test
[Edit] Checkpoint 6: Voltage measurements
[Edit] Checkpoint 7: Signal integrity
[Edit] Checkpoint 8: Temperature testing
[Add New Checkpoint]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ VERSION CONTROL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes will create new version 2.4
Previous versions remain accessible
Active inspections using v2.3 unaffected

💾 Save Options:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Save as Draft
• Save and Activate (new version)
• Save as New Template (copy)

Ready to edit template...`);
  };

  // Handler 12: Compliance Monitoring - Monitor compliance standards and audit readiness
  const handleComplianceMonitoring = () => {
    alert(`📊 COMPLIANCE MONITORING DASHBOARD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLIANCE STATUS OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Compliance Score: 98.2%
Status: ✅ COMPLIANT
Last Updated: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: QUALITY STANDARDS COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ ISO 9001:2015 - Quality Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ CERTIFIED
Certificate #: QMS-2022-8945
Issued: 2022-11-15
Valid Until: 2025-11-15
Certification Body: SGS

Compliance Score: 98%
Last Audit: 2024-11-10 (Surveillance)
Audit Result: PASSED (2 minor observations)
Next Audit: 2025-05-15 (Surveillance)

Key Requirements Status:
✅ Quality Manual: Current (Rev 4.2)
✅ Documented Procedures: 45/45 updated
✅ Process Maps: Complete and approved
✅ Management Review: Conducted quarterly
✅ Internal Audits: On schedule (12/year)
✅ Corrective Actions: 15 open, 142 closed
✅ Calibration Program: 100% compliance
✅ Training Records: Current

Minor Observations from Last Audit:
⚠️ Obs 1: Update quality objectives for 2025
   Due: 2025-01-31
   Owner: Quality Manager
   Status: IN PROGRESS

⚠️ Obs 2: One training record missing signature
   Due: 2024-12-20
   Owner: HR Manager
   Status: CLOSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 ISO 14001:2015 - Environmental Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ CERTIFIED
Certificate #: EMS-2023-2156
Issued: 2023-03-20
Valid Until: 2026-03-20

Compliance Score: 96%
Last Audit: 2024-10-20
Audit Result: PASSED (0 findings)
Next Audit: 2025-04-20

Environmental Aspects:
✅ Waste Management: Compliant
✅ Energy Consumption: Tracking operational
✅ Chemical Storage: Proper procedures
✅ Emissions Monitoring: Within limits
✅ Recycling Program: 85% recycling rate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ OHSAS 18001 / ISO 45001 - Occupational Safety
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ⚠️ TRANSITION IN PROGRESS
Current: OHSAS 18001:2007 (Valid)
Target: ISO 45001:2018
Transition Deadline: 2025-03-31

Compliance Score: 94%
Last Audit: 2024-09-10
Next Audit: 2025-03-10

Safety Performance:
✅ Lost Time Injuries (LTI): 0 (12 months)
✅ Near Miss Reports: 24 (all investigated)
✅ Safety Training: 98% completion
✅ PPE Compliance: 100%
⚠️ Risk Assessments: 8 pending updates

Transition Actions:
✓ Gap analysis completed
✓ Training plan developed
⏳ Documentation updates (60% complete)
⏳ Internal audits to new standard (scheduled)
⏳ Certification audit (Feb 2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Industry-Specific Standards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ COMPLIANT
Compliance Score: 97%
Last Review: 2024-11-01

Applicable Standards:
• IPC-A-610: Acceptability of Electronics (Class 2)
• J-STD-001: Soldering Requirements
• AS9100: Aerospace Quality (if applicable)
• IATF 16949: Automotive Quality (if applicable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: REGULATORY COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌍 RoHS - Restriction of Hazardous Substances
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ COMPLIANT (EU Directive 2011/65/EU)
Last Verification: 2024-12-01

Restricted Substances Monitoring:
✅ Lead (Pb): <1000 ppm
✅ Mercury (Hg): <1000 ppm
✅ Cadmium (Cd): <100 ppm
✅ Hexavalent Chromium (Cr6+): <1000 ppm
✅ PBB/PBDE: <1000 ppm

Supplier Compliance: 100%
• All suppliers certified RoHS compliant
• Material declarations on file
• Testing conducted quarterly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 REACH - Chemical Regulation (EU)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ COMPLIANT (EC 1907/2006)
Last Update: 2024-11-15

SVHC (Substances of Very High Concern):
• Total SVHC on candidate list: 235
• Products screened: 100%
• Substances detected: 0 above threshold (0.1% w/w)

Supplier Declarations:
✅ 100% suppliers provided REACH declarations
✅ Updated within last 12 months
✅ No conflicts identified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛏️ Conflict Minerals - Dodd-Frank Act
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ COMPLIANT
Reporting Period: 2024
Last Filing: 2024-05-31

3TG Minerals Status:
✅ Tin (Sn): Sourcing documented, conflict-free
✅ Tantalum (Ta): Sourcing documented, conflict-free
✅ Tungsten (W): Sourcing documented, conflict-free
✅ Gold (Au): Sourcing documented, conflict-free

Supplier Compliance:
• CMRT (Conflict Minerals Reporting Template): 100%
• Smelter validation: Complete
• Conflict-free certification: 98% of suppliers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: AUDIT READINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 UPCOMING AUDITS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ISO 9001 Surveillance Audit
   Date: 2025-01-15
   Auditor: SGS (External)
   Duration: 2 days
   Readiness: ✅ 95%

   Preparation Status:
   ✅ Pre-audit checklist complete
   ✅ Document review complete
   ✅ Mock audit conducted (passed)
   ⏳ Final management review (Dec 20)

2. Internal Quality Audit (Q1 2025)
   Date: 2024-12-28
   Lead Auditor: Michael Chen
   Scope: All departments
   Readiness: ✅ 100%

   Preparation Status:
   ✅ Audit schedule published
   ✅ Auditees notified
   ✅ Checklists prepared
   ✅ Previous CARs closed (12/12)

3. Customer Audit (Automotive OEM)
   Date: 2025-02-10
   Customer: [Major Automotive Company]
   Focus: PPAP/Production capability
   Readiness: ⚠️ 85%

   Preparation Status:
   ✅ PPAP documentation complete
   ✅ Process capability studies done
   ⏳ Corrective action demos prepared
   ⏳ Facility tour route finalized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: CORRECTIVE ACTIONS TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CAPA SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total CAPAs (YTD 2024): 157
• Closed: 142 (90.4%)
• Open: 15 (9.6%)
• Overdue: 2 (1.3%) ⚠️

Average Closure Time: 28 days (Target: 30 days) ✅

CAPA Categories:
• Internal Audit Findings: 45
• External Audit Findings: 8
• Customer Complaints: 32
• Supplier NCRs: 28
• Process Improvements: 44

⚠️ OVERDUE ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAR-2024-145:
Issue: Calibration procedure update
Due Date: 2024-12-10 (6 days overdue)
Owner: Quality Manager
Status: Documentation in final review

CAR-2024-149:
Issue: Supplier audit completion
Due Date: 2024-12-15 (1 day overdue)
Owner: Procurement Manager
Status: Audit scheduled for 2024-12-18

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: COMPLIANCE METRICS & KPIs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 PERFORMANCE INDICATORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit Performance:
• Internal Audits Completed: 12/12 (100%) ✅
• External Audits Passed: 3/3 (100%) ✅
• Average Audit Score: 96.5%
• Finding Closure Rate: 98%

Documentation Compliance:
• Procedures Updated: 100%
• Records Retention: 100%
• Training Records Current: 98%
• Calibration Records: 100%

Management System Effectiveness:
• Management Reviews: 4/4 completed ✅
• Quality Objectives Met: 8/10 (80%)
• Customer Satisfaction: 4.8/5.0
• Process Capability (Avg Cpk): 1.42

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: RISK ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 COMPLIANCE RISKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGH RISK:
🔴 ISO 45001 Transition (Due: March 2025)
   Impact: Potential certification lapse
   Mitigation: Accelerated transition project
   Status: 60% complete

MEDIUM RISK:
🟡 Audit Scheduling Conflicts (Q1 2025)
   Impact: Resource constraints
   Mitigation: Coordinate schedules, add temp resources
   Status: Monitoring

🟡 CAPA Closure Rate Declining
   Impact: Audit findings accumulation
   Mitigation: Weekly review meetings implemented
   Status: Improving

LOW RISK:
🟢 Regulatory Changes Tracking
   Impact: Potential non-compliance with new regs
   Mitigation: Subscription to regulatory update service
   Status: Managed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 IMMEDIATE ACTIONS (Next 30 days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Close 2 overdue CAPAs by Dec 20
2. Complete ISO 45001 documentation (Target: 80%)
3. Finalize customer audit preparation
4. Conduct pre-audit for ISO 9001 surveillance

📋 SHORT-TERM ACTIONS (Next 90 days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. Complete ISO 45001 transition
6. Execute all planned Q1 audits
7. Achieve 95% CAPA closure rate
8. Update quality objectives for 2025

🔮 LONG-TERM INITIATIVES (Next 12 months):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. Pursue AS9100 certification (if entering aerospace)
10. Implement automated compliance tracking system
11. Conduct supplier compliance audits (5 suppliers)
12. Benchmark against industry best practices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLIANCE MONITORING COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status: ✅ COMPLIANT
System Maturity: HIGH
Audit Readiness: GOOD

Next Review: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
Report Distribution: Management, Quality Team

🔔 Alerts configured for compliance deadlines
📊 Dashboard available 24/7 in QMS portal`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quality Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pass Rate</p>
              <p className="text-2xl font-bold">{qualityMetrics.passRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Defect Rate</p>
              <p className="text-2xl font-bold">{qualityMetrics.defectRate}%</p>
            </div>
            <XCircle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Today's Inspections</p>
              <p className="text-2xl font-bold">{qualityMetrics.inspectionsToday}</p>
            </div>
            <ClipboardCheck className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">{qualityMetrics.pendingInspections}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Time</p>
              <p className="text-2xl font-bold">{qualityMetrics.avgInspectionTime}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Compliance</p>
              <p className="text-2xl font-bold">{qualityMetrics.complianceScore}%</p>
            </div>
            <Shield className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quality Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="passRate" stroke="#10B981" name="Pass Rate %" strokeWidth={2} />
              <Line type="monotone" dataKey="defectRate" stroke="#EF4444" name="Defect Rate %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Defect Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Defect Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={defectCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {defectCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Quality Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Supplier Quality Scores</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Supplier</th>
                <th className="text-left py-2">Quality Score</th>
                <th className="text-left py-2">Trend</th>
                <th className="text-left py-2">Inspections</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplierQualityScores.map((supplier, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">{supplier.supplier}</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <span className="font-semibold">{supplier.score}%</span>
                      <div className="ml-2 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            supplier.score >= 98 ? 'bg-green-500' :
                            supplier.score >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${supplier.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      supplier.trend === 'up' ? 'bg-green-100 text-green-800' :
                      supplier.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.trend === 'up' ? '↑' : supplier.trend === 'down' ? '↓' : '→'}
                      {supplier.trend}
                    </span>
                  </td>
                  <td className="py-2">{supplier.inspections}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleViewSupplierReport(supplier.supplier)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      {/* Inspection Queue Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Inspection Queue</h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search inspections..."
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleNewInspection}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Inspection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {inspectionQueue.map((inspection) => (
          <div key={inspection.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{inspection.id}</h4>
                <p className="text-gray-600 text-sm">{inspection.poNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                inspection.priority === 'critical' ? 'bg-red-100 text-red-800' :
                inspection.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                inspection.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {inspection.priority.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Supplier:</span>
                <span className="text-sm font-medium">{inspection.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Items:</span>
                <span className="text-sm">{inspection.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Quantity:</span>
                <span className="text-sm">{inspection.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Due Date:</span>
                <span className="text-sm">{inspection.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Risk Level:</span>
                <span className={`text-sm font-medium ${
                  inspection.riskLevel === 'high' ? 'text-red-600' :
                  inspection.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {inspection.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className={`px-2 py-1 rounded-full text-xs ${
                inspection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                inspection.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                inspection.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {inspection.status.replace('_', ' ').toUpperCase()}
              </span>

              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">View</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                  <ClipboardCheck className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Check</span>
                </button>
              </div>
            </div>

            {inspection.inspector && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-gray-600">
                  Inspector: <span className="font-medium">{inspection.inspector}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inspection Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Inspection Volume</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={qualityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="inspections" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Priority Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { priority: 'Critical', count: 5 },
              { priority: 'High', count: 12 },
              { priority: 'Medium', count: 18 },
              { priority: 'Low', count: 10 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Inspector Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">John Smith</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Jane Doe</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-sm text-gray-600">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Mike Johnson</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
                <span className="text-sm text-gray-600">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Templates Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Inspection Templates</h3>
        <button
          onClick={handleCreateTemplate}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {/* Template Categories */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">All Templates</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Electronics</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Materials</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Packaging</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Chemicals</button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspectionTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <FileText className="h-10 w-10 text-blue-500" />
              <span className="text-xs text-gray-500">{template.id}</span>
            </div>

            <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
            <p className="text-gray-600 text-sm mb-4">Category: {template.category}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Checkpoints:</span>
                <span className="font-medium">{template.checkpoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Used:</span>
                <span>{template.lastUsed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Usage:</span>
                <span className="font-medium">{template.usage} times</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUseTemplate(template.name)}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
              >
                Use Template
              </button>
              <button
                onClick={() => handleEditTemplate(template.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <Edit3 className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Checklist Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold text-lg mb-4">Electronics Inspection Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium mb-3">Visual Inspection</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Check for physical damage</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Verify component placement</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Inspect solder joints</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Check for contamination</span>
              </label>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3">Functional Testing</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Power-on test</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Voltage measurements</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Signal integrity check</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Temperature testing</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceStandards.map((standard, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <Shield className={`h-8 w-8 ${
                standard.status === 'compliant' ? 'text-green-500' :
                standard.status === 'pending' ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              <span className={`px-2 py-1 rounded-full text-xs ${
                standard.status === 'compliant' ? 'bg-green-100 text-green-800' :
                standard.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {standard.status.toUpperCase()}
              </span>
            </div>

            <h4 className="font-semibold mb-2">{standard.standard}</h4>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Score</span>
                <span className="font-medium">{standard.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    standard.score >= 95 ? 'bg-green-500' :
                    standard.score >= 90 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${standard.score}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Last Audit: {standard.lastAudit}
            </p>
          </div>
        ))}
      </div>

      {/* Compliance Requirements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Requirements Tracking</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Requirement</th>
                <th className="text-left py-2">Standard</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Due Date</th>
                <th className="text-left py-2">Evidence</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Quality Manual Update</td>
                <td className="py-2">ISO 9001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Completed
                  </span>
                </td>
                <td className="py-2">2024-12-01</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View
                  </button>
                </td>
                <td className="py-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Internal Audit</td>
                <td className="py-2">ISO 14001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    In Progress
                  </span>
                </td>
                <td className="py-2">2024-12-15</td>
                <td className="py-2">
                  <button className="text-gray-400">
                    <Upload className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    Update
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Safety Training Records</td>
                <td className="py-2">OHSAS 18001</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td className="py-2">2024-12-20</td>
                <td className="py-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Upload className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Upload</span>
                  </button>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    Upload
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Upcoming Audits</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">ISO 9001 Surveillance Audit</p>
                  <p className="text-sm text-gray-600">External Auditor: SGS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Jan 15, 2025</p>
                <p className="text-xs text-gray-500">In 30 days</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Internal Quality Audit</p>
                  <p className="text-sm text-gray-600">Lead: Quality Team</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Dec 28, 2024</p>
                <p className="text-xs text-gray-500">In 12 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Conformance Tracking */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Non-Conformance Report</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { month: 'Jul', major: 2, minor: 5 },
              { month: 'Aug', major: 1, minor: 4 },
              { month: 'Sep', major: 1, minor: 3 },
              { month: 'Oct', major: 0, minor: 2 },
              { month: 'Nov', major: 1, minor: 2 },
              { month: 'Dec', major: 0, minor: 1 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="major" stroke="#EF4444" name="Major NCR" strokeWidth={2} />
              <Line type="monotone" dataKey="minor" stroke="#F59E0B" name="Minor NCR" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Quality Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Inspection Summary</option>
              <option>Supplier Quality Report</option>
              <option>Defect Analysis</option>
              <option>Compliance Status</option>
              <option>Quality Metrics Dashboard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
              <option>Word</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerateReport}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Report Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Generated By</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Size</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Monthly Quality Summary Dec 2024</td>
                <td className="py-2">Quality Metrics</td>
                <td className="py-2">John Smith</td>
                <td className="py-2">2024-12-15</td>
                <td className="py-2">2.3 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Supplier Quality Report Q4 2024</td>
                <td className="py-2">Supplier Analysis</td>
                <td className="py-2">Jane Doe</td>
                <td className="py-2">2024-12-10</td>
                <td className="py-2">3.1 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">ISO 9001 Compliance Report</td>
                <td className="py-2">Compliance</td>
                <td className="py-2">Mike Johnson</td>
                <td className="py-2">2024-12-05</td>
                <td className="py-2">1.8 MB</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Metrics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Quality KPI Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <span>First Pass Yield</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">96.5%</p>
                <p className="text-xs text-green-600">↑ 2.3%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-purple-500" />
                <span>Customer Satisfaction</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">4.8/5.0</p>
                <p className="text-xs text-green-600">↑ 0.2</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Cost of Quality</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">$45,230</p>
                <p className="text-xs text-red-600">↑ 5.1%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-500" />
                <span>Supplier Quality Rating</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">97.2%</p>
                <p className="text-xs text-green-600">↑ 1.8%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Scheduled Reports</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weekly Quality Summary</p>
                <p className="text-sm text-gray-600">Every Monday, 9:00 AM</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Monthly Supplier Scorecard</p>
                <p className="text-sm text-gray-600">1st of each month</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Quarterly Compliance Report</p>
                <p className="text-sm text-gray-600">End of each quarter</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Plus = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Quality Assurance & Inspection</h2>
        <p className="text-gray-600">Ensure product quality and compliance standards</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleCreateInspection}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ClipboardCheck className="h-5 w-5" />
          Create Inspection
        </button>
        <button
          onClick={handleRecordResults}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="h-5 w-5" />
          Record Results
        </button>
        <button
          onClick={handleRejectMaterial}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <XCircle className="h-5 w-5" />
          Reject Material
        </button>
        <button
          onClick={handleIssueNCR}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <AlertTriangle className="h-5 w-5" />
          Issue NCR
        </button>
        <button
          onClick={handleTrackTrends}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <TrendingUp className="h-5 w-5" />
          Track Trends
        </button>
        <button
          onClick={handleComplianceMonitoring}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Shield className="h-5 w-5" />
          Compliance
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'inspections', 'templates', 'compliance', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'inspections' && renderInspections()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
};

export default QualityAssurance;