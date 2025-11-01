'use client';

import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Calendar, Shield, Settings, RefreshCw, Download, Plus, Edit, Eye, Bell, Flag, FileCheck } from 'lucide-react';

export type ContractStatus = 'active' | 'expiring' | 'expired' | 'renewed' | 'terminated';
export type ComplianceStatus = 'compliant' | 'at-risk' | 'non-compliant';
export type ContractType = 'master-agreement' | 'purchase-agreement' | 'blanket-po' | 'service-contract' | 'nda';

export interface Contract {
  id: string;
  contractNumber: string;
  supplier: string;
  contractType: ContractType;
  status: ContractStatus;
  complianceStatus: ComplianceStatus;
  startDate: string;
  endDate: string;
  value: number;
  spendToDate: number;
  utilizationPercent: number;
  autoRenewal: boolean;
  notificationDays: number;
  owner: string;
  lastAudit: string;
  nextReview: string;
}

export interface ComplianceMetric {
  metric: string;
  target: number;
  actual: number;
  status: 'pass' | 'warning' | 'fail';
  impact: string;
}

export interface ContractObligation {
  id: string;
  contractId: string;
  obligation: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}

const ContractCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');

  // Mock data - Contracts
  const contracts: Contract[] = [
    {
      id: 'CNT001',
      contractNumber: 'MA-2024-001',
      supplier: 'Acme Manufacturing Co.',
      contractType: 'master-agreement',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      value: 5000000,
      spendToDate: 2450000,
      utilizationPercent: 49,
      autoRenewal: true,
      notificationDays: 90,
      owner: 'Sarah Johnson',
      lastAudit: '2025-07-15',
      nextReview: '2025-11-15',
    },
    {
      id: 'CNT002',
      contractNumber: 'PA-2023-045',
      supplier: 'Global Components Ltd.',
      contractType: 'purchase-agreement',
      status: 'expiring',
      complianceStatus: 'at-risk',
      startDate: '2023-06-01',
      endDate: '2025-11-30',
      value: 2500000,
      spendToDate: 2380000,
      utilizationPercent: 95.2,
      autoRenewal: false,
      notificationDays: 60,
      owner: 'Michael Chen',
      lastAudit: '2025-05-20',
      nextReview: '2025-10-30',
    },
    {
      id: 'CNT003',
      contractNumber: 'BPO-2024-012',
      supplier: 'Quality Steel Industries',
      contractType: 'blanket-po',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      value: 3000000,
      spendToDate: 1850000,
      utilizationPercent: 61.7,
      autoRenewal: true,
      notificationDays: 90,
      owner: 'Emily Davis',
      lastAudit: '2025-08-10',
      nextReview: '2025-11-30',
    },
    {
      id: 'CNT004',
      contractNumber: 'SC-2022-089',
      supplier: 'Tech Solutions Inc.',
      contractType: 'service-contract',
      status: 'expired',
      complianceStatus: 'non-compliant',
      startDate: '2022-01-01',
      endDate: '2025-10-15',
      value: 1200000,
      spendToDate: 1180000,
      utilizationPercent: 98.3,
      autoRenewal: false,
      notificationDays: 60,
      owner: 'Robert Wilson',
      lastAudit: '2025-04-15',
      nextReview: '2025-10-01',
    },
    {
      id: 'CNT005',
      contractNumber: 'MA-2025-003',
      supplier: 'Precision Parts Manufacturing',
      contractType: 'master-agreement',
      status: 'active',
      complianceStatus: 'compliant',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      value: 4500000,
      spendToDate: 1320000,
      utilizationPercent: 29.3,
      autoRenewal: true,
      notificationDays: 120,
      owner: 'Lisa Anderson',
      lastAudit: '2025-09-01',
      nextReview: '2026-01-15',
    },
  ];

  // Mock data - Compliance metrics
  const complianceMetrics: ComplianceMetric[] = [
    { metric: 'On-time Delivery', target: 95, actual: 96.5, status: 'pass', impact: 'Low' },
    { metric: 'Quality Acceptance Rate', target: 98, actual: 97.2, status: 'warning', impact: 'Medium' },
    { metric: 'Price Variance', target: 2, actual: 1.5, status: 'pass', impact: 'Low' },
    { metric: 'Invoice Accuracy', target: 99, actual: 98.8, status: 'warning', impact: 'Low' },
    { metric: 'SLA Response Time (hrs)', target: 24, actual: 28, status: 'fail', impact: 'High' },
    { metric: 'Contract Spend vs Budget', target: 100, actual: 103.5, status: 'fail', impact: 'High' },
  ];

  // Mock data - Contract obligations
  const obligations: ContractObligation[] = [
    {
      id: 'OBL001',
      contractId: 'CNT001',
      obligation: 'Quarterly Business Review Meeting',
      dueDate: '2025-10-31',
      status: 'pending',
      assignedTo: 'Sarah Johnson',
      priority: 'medium',
    },
    {
      id: 'OBL002',
      contractId: 'CNT002',
      obligation: 'Annual Performance Audit',
      dueDate: '2025-10-15',
      status: 'overdue',
      assignedTo: 'Michael Chen',
      priority: 'high',
    },
    {
      id: 'OBL003',
      contractId: 'CNT003',
      obligation: 'Price Review and Adjustment',
      dueDate: '2025-11-15',
      status: 'pending',
      assignedTo: 'Emily Davis',
      priority: 'high',
    },
    {
      id: 'OBL004',
      contractId: 'CNT001',
      obligation: 'Insurance Certificate Renewal',
      dueDate: '2025-09-30',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      priority: 'medium',
    },
    {
      id: 'OBL005',
      contractId: 'CNT005',
      obligation: 'Compliance Documentation Update',
      dueDate: '2025-12-01',
      status: 'pending',
      assignedTo: 'Lisa Anderson',
      priority: 'low',
    },
  ];

  // Handler 1: Monitor Compliance - Real-time compliance monitoring across all contracts
  const handleMonitorCompliance = () => {
    alert(`📊 Contract Compliance Monitoring Dashboard

COMPLIANCE STATUS OVERVIEW:
✅ Compliant Contracts: 3 (60%)
⚠️  At-Risk Contracts: 1 (20%)
❌ Non-Compliant Contracts: 1 (20%)

KEY COMPLIANCE METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• On-Time Delivery: 96.5% ✅ (Target: 95%)
• Quality Acceptance: 97.2% ⚠️  (Target: 98%)
• Price Variance: 1.5% ✅ (Target: 2%)
• Invoice Accuracy: 98.8% ⚠️  (Target: 99%)
• SLA Response Time: 28 hrs ❌ (Target: 24 hrs)
• Spend vs Budget: 103.5% ❌ (Target: 100%)

CRITICAL ISSUES IDENTIFIED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ⚠️  PA-2023-045 (Global Components Ltd.)
   • Status: Expiring Soon (30 days)
   • Utilization: 95.2% - approaching limit
   • Action Required: Renewal negotiation needed

2. ❌ SC-2022-089 (Tech Solutions Inc.)
   • Status: Expired Contract
   • Compliance: Non-compliant
   • Action Required: Immediate contract closure/renewal

3. ❌ SLA Response Time Failure
   • Current: 28 hours (Target: 24 hours)
   • Impact: High - affecting service delivery
   • Suppliers Affected: 2 contracts

OVERDUE OBLIGATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• OBL002: Annual Performance Audit
  Contract: PA-2023-045
  Due: 2025-10-15 (OVERDUE)
  Owner: Michael Chen

RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Schedule immediate review for expiring contracts
2. Flag non-compliant suppliers for escalation
3. Implement automated SLA monitoring
4. Conduct performance improvement plans

Monitoring Dashboard: Real-time updates enabled
Next automated scan: 1 hour
Last updated: ${new Date().toLocaleString()}`);
  };

  // Handler 2: Flag Violations - Identify and flag contract violations
  const handleFlagViolations = () => {
    alert(`🚩 Contract Violation Flagging System

ACTIVE CONTRACT VIOLATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL VIOLATIONS (2):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contract SC-2022-089 (Tech Solutions Inc.)
   • Violation Type: Contract Expired
   • Status: Non-Compliant
   • Spend After Expiry: $180,000
   • Days Overdue: 46 days
   • Risk Level: HIGH
   • Action: Suspend all POs immediately

2. Contract PA-2023-045 (Global Components Ltd.)
   • Violation Type: SLA Response Time Breach
   • Target: 24 hours | Actual: 28 hours
   • Breach Frequency: 8 times in last 30 days
   • Impact: High - Production delays
   • Financial Impact: $45,000 estimated
   • Action: Issue non-conformance notice

🟡 WARNING VIOLATIONS (3):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contract PA-2023-045 (Global Components Ltd.)
   • Violation Type: Approaching Contract Limit
   • Utilization: 95.2% (Warning at >90%)
   • Remaining Value: $120,000
   • Estimated Depletion: 25 days
   • Action: Negotiate additional capacity

2. Contract MA-2024-001 (Acme Manufacturing)
   • Violation Type: Quality Acceptance Below Target
   • Target: 98% | Actual: 97.2%
   • Defect Increase: +0.8% from last quarter
   • Impact: Medium
   • Action: Quality improvement meeting required

3. Contract BPO-2024-012 (Quality Steel)
   • Violation Type: Invoice Accuracy Issues
   • Target: 99% | Actual: 98.8%
   • Errors Last Month: 12 invoices
   • Processing Delays: 5 days average
   • Action: Invoice reconciliation process review

COMPLIANCE OBLIGATIONS OVERDUE (1):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Annual Performance Audit - PA-2023-045
  Owner: Michael Chen
  Due Date: 2025-10-15 (2 days overdue)
  Priority: HIGH

FLAGGING ACTIONS TAKEN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 2 critical violations flagged for executive review
✓ 3 warning notifications sent to contract owners
✓ 1 overdue obligation escalated to manager
✓ All stakeholders notified via email
✓ Violation reports added to compliance dashboard

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Initiate contract termination/renewal for expired contract
2. Schedule supplier performance review meetings
3. Implement corrective action plans
4. Update violation tracking log
5. Set automated alerts for future violations

Violation flagging completed successfully!
Timestamp: ${new Date().toLocaleString()}`);
  };

  // Handler 3: Generate Audit Trail - Create comprehensive audit trail documentation
  const handleGenerateAuditTrail = () => {
    alert(`📋 Contract Compliance Audit Trail Report

AUDIT TRAIL GENERATION - COMPLETE
Report Period: Last 90 Days
Generated: ${new Date().toLocaleString()}
Report ID: AUDIT-2024-11-${Math.floor(Math.random() * 1000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Contracts Monitored: 5
Total Audit Events Logged: 247
Compliance Issues Identified: 6
Resolved Issues: 3
Pending Issues: 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRACT ACTIVITY AUDIT LOG:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 MA-2024-001 (Acme Manufacturing Co.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-07-15] Contract audit performed by Sarah Johnson
  • Compliance Status: PASS
  • Quality Score: 97.2%
  • Spend Utilization: 49% of $5M
  • Audit Notes: All obligations met, renewal on track

[2025-08-20] Purchase Order PO-2024-456 processed
  • Amount: $125,000
  • Approved by: Sarah Johnson
  • Delivery Date: 2025-09-15
  • Status: Completed on time

[2025-09-10] Price variance review
  • Variance: +1.2% above agreed pricing
  • Investigation: Supply chain cost increase
  • Resolution: Approved with documentation
  • Approved by: Finance Director

[2025-10-01] Quarterly Business Review scheduled
  • Meeting Date: 2025-10-31
  • Attendees: Sarah Johnson, Supplier Rep
  • Agenda: Performance, pricing, 2026 forecast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 PA-2023-045 (Global Components Ltd.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-05-20] Annual contract audit
  • Compliance Status: AT RISK
  • Quality Issues: 3 minor defects noted
  • SLA Breaches: 8 incidents in 90 days
  • Audit Notes: Performance improvement plan initiated

[2025-07-12] SLA Breach Event #6
  • Response Time: 28 hours (Target: 24 hours)
  • Impact: Production delay - 4 hours
  • Root Cause: Supplier resource shortage
  • Corrective Action: Additional staffing committed

[2025-09-18] Contract approaching limit alert
  • Current Utilization: 95.2%
  • Remaining Value: $120,000
  • Alert Sent To: Michael Chen, Procurement Director
  • Action: Renewal negotiation initiated

[2025-10-15] ⚠️  Annual Performance Audit OVERDUE
  • Due Date: 2025-10-15
  • Status: OVERDUE (2 days)
  • Owner: Michael Chen
  • Escalation: Sent to management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 SC-2022-089 (Tech Solutions Inc.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-04-15] Contract audit - expiring soon
  • Compliance Status: WARNING
  • Expiry Date: 2025-10-15
  • Renewal Status: No renewal request submitted
  • Action: Renewal negotiation recommended

[2025-10-15] 🚨 CONTRACT EXPIRED
  • Contract Status: EXPIRED
  • Compliance: NON-COMPLIANT
  • Audit Alert: Critical violation flagged
  • Action Required: Immediate contract closure

[2025-10-20] Post-expiry spend detected
  • Amount: $180,000 spent after expiry
  • POs Processed: 3 purchase orders
  • Status: UNAUTHORIZED SPENDING
  • Investigation: Finance audit initiated
  • Responsible Party: Robert Wilson notified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLIANCE METRIC CHANGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• On-Time Delivery: 95.8% → 96.5% ✅ (+0.7%)
• Quality Acceptance: 98.1% → 97.2% ⚠️  (-0.9%)
• Invoice Accuracy: 99.2% → 98.8% ⚠️  (-0.4%)
• SLA Compliance: 92% → 88% ❌ (-4%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER ACCESS & CHANGES LOG:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-07-15] Sarah Johnson - Contract audit MA-2024-001
[2025-07-20] Michael Chen - Modified notification settings PA-2023-045
[2025-08-10] Emily Davis - Contract audit BPO-2024-012
[2025-09-01] Lisa Anderson - Contract audit MA-2025-003
[2025-09-18] System Auto - Generated expiry alert PA-2023-045
[2025-10-15] System Auto - Expired contract flag SC-2022-089
[2025-10-17] Finance Dept - Investigation initiated SC-2022-089

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Immediate action required for expired contract SC-2022-089
2. Complete overdue performance audit for PA-2023-045
3. Implement automated SLA monitoring system
4. Review and update contract renewal workflows
5. Enhance pre-expiry notification process
6. Conduct supplier performance improvement review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT TRAIL EXPORT OPTIONS:
• PDF Report (Comprehensive)
• Excel Spreadsheet (Data Analysis)
• JSON (System Integration)
• CSV (Database Import)

✅ Audit trail generated successfully
📧 Report emailed to: compliance@company.com
🔒 Audit trail securely stored in compliance database
📅 Next scheduled audit: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  };

  // Handler 4: Set Alerts - Configure automated compliance alerts
  const handleSetAlerts = () => {
    alert(`🔔 Contract Compliance Alert Configuration

ALERT SYSTEM SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 EXPIRATION ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 90-Day Expiry Warning
   • Recipients: Contract Owner, Procurement Manager
   • Frequency: Initial alert + weekly reminders
   • Priority: Medium
   • Contracts Monitored: 5 active contracts

✅ 60-Day Expiry Warning
   • Recipients: Contract Owner, Procurement Director
   • Frequency: Initial alert + daily reminders
   • Priority: High
   • Escalation: Copy CFO at 45 days

✅ 30-Day Critical Expiry Alert
   • Recipients: All stakeholders + Executive team
   • Frequency: Daily reminders
   • Priority: Critical
   • Escalation: Board notification at 15 days

💰 SPEND UTILIZATION ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 75% Utilization Warning
   • Notify contract owner to plan renewal
   • Alert: 3 contracts currently at 75%+

✅ 90% Utilization Critical Alert
   • Immediate notification to procurement
   • Auto-flag for urgent capacity expansion
   • Current: 1 contract at 95.2% (PA-2023-045)

✅ Budget Overrun Alert
   • Threshold: >100% of contract value
   • Alert: Real-time notification + approval required
   • Financial controls: Auto-block POs exceeding limit

⚠️  COMPLIANCE METRIC ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SLA Breach Detection
   • Monitor: Response time, delivery performance
   • Alert after: 2 consecutive breaches
   • Current: 2 contracts with active alerts
   • Action: Auto-schedule performance review

✅ Quality Issues Alert
   • Threshold: Quality < 95%
   • Frequency: Weekly quality score reports
   • Recipients: Quality team, Contract owner
   • Trend Analysis: Flag declining patterns

✅ Invoice Accuracy Alert
   • Threshold: Accuracy < 98%
   • Alert: Monthly summary + trend analysis
   • Action: Invoice reconciliation review
   • Integration: Auto-flag in accounting system

📋 OBLIGATION & MILESTONE ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Upcoming Obligations (7 days before)
   • Quarterly Business Reviews
   • Annual Performance Audits
   • Price Review Meetings
   • Insurance Renewals
   • Compliance Documentation Updates

✅ Overdue Obligations
   • Alert: Immediate notification on due date
   • Escalation: Daily reminders to manager
   • Current: 1 overdue obligation (OBL002)

✅ Contract Milestone Tracking
   • Auto-renewal dates
   • Option exercise periods
   • Price adjustment dates
   • Renegotiation windows

🚨 COMPLIANCE VIOLATION ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Contract Expired - Spending Detected
   • Alert: Real-time notification
   • Action: Auto-block all new POs
   • Escalation: Immediate executive notification
   • Current: 1 active alert (SC-2022-089)

✅ Non-Compliant Supplier Status
   • Monitor: Quality, delivery, SLA metrics
   • Alert: Automatic supplier status change
   • Action: Performance improvement plan
   • Review: Monthly compliance status meetings

✅ Unauthorized Contract Modifications
   • Alert: Any contract changes without approval
   • Notification: Compliance officer, Legal team
   • Audit Log: All changes tracked and reported

📊 ALERT DELIVERY CHANNELS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Email Notifications (Primary)
✅ SMS for Critical Alerts
✅ Dashboard Notifications
✅ Slack/Teams Integration
✅ Mobile App Push Notifications
✅ Weekly Compliance Digest Email

🎯 CURRENT ACTIVE ALERTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 🔴 CRITICAL: SC-2022-089 contract expired
   • Sent to: Robert Wilson, Procurement Director, CFO

2. 🟡 WARNING: PA-2023-045 expiring in 30 days
   • Sent to: Michael Chen, Procurement Manager

3. 🟡 WARNING: PA-2023-045 utilization at 95.2%
   • Sent to: Michael Chen

4. 🔴 OVERDUE: Annual Performance Audit OBL002
   • Sent to: Michael Chen, Manager

📈 ALERT STATISTICS (Last 30 Days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Alerts Sent: 87 alerts
• Critical Alerts: 5 alerts
• Warnings: 23 alerts
• Informational: 59 alerts
• Average Response Time: 4.2 hours
• Resolved Alerts: 78 (89.7%)

✅ Alert configuration updated successfully!
🔔 All alert channels active and monitoring
📧 Test alerts sent to verify delivery
Next system check: 1 hour
Configuration saved: ${new Date().toLocaleString()}`);
  };

  // Handler 5: View Contract Details - Detailed contract information view
  const handleViewContract = (contract: Contract) => {
    alert(`📄 Contract Details - ${contract.contractNumber}

GENERAL INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract ID: ${contract.id}
Contract Number: ${contract.contractNumber}
Supplier: ${contract.supplier}
Contract Type: ${contract.contractType.toUpperCase()}
Contract Owner: ${contract.owner}

STATUS & COMPLIANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Status: ${contract.status.toUpperCase()}
Compliance Status: ${contract.complianceStatus.toUpperCase()}
${contract.complianceStatus === 'compliant' ? '✅' : contract.complianceStatus === 'at-risk' ? '⚠️' : '❌'} Risk Level: ${contract.complianceStatus === 'compliant' ? 'Low' : contract.complianceStatus === 'at-risk' ? 'Medium' : 'High'}

FINANCIAL DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Value: $${(contract.value / 1000000).toFixed(2)}M
Spend to Date: $${(contract.spendToDate / 1000000).toFixed(2)}M
Remaining Value: $${((contract.value - contract.spendToDate) / 1000000).toFixed(2)}M
Utilization: ${contract.utilizationPercent}%
${contract.utilizationPercent > 90 ? '⚠️  WARNING: Approaching contract limit!' : ''}

CONTRACT PERIOD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start Date: ${contract.startDate}
End Date: ${contract.endDate}
Days Until Expiry: ${Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
Auto-Renewal: ${contract.autoRenewal ? 'Yes ✅' : 'No ❌'}
Notification Period: ${contract.notificationDays} days before expiry

AUDIT & REVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last Audit: ${contract.lastAudit}
Next Review: ${contract.nextReview}
Audit Frequency: Quarterly
Compliance Score: ${contract.complianceStatus === 'compliant' ? '95%' : contract.complianceStatus === 'at-risk' ? '75%' : '45%'}

PERFORMANCE METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• On-Time Delivery: 96.5%
• Quality Rating: 97.2%
• Invoice Accuracy: 98.8%
• SLA Compliance: ${contract.complianceStatus === 'at-risk' ? '88%' : '96%'}

Click "Edit" to modify contract details
Click "Audit" to generate audit report`);
  };

  // Handler 6: Edit Contract - Modify contract details
  const handleEditContract = (contract: Contract) => {
    alert(`✏️  Edit Contract - ${contract.contractNumber}

EDITABLE FIELDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Basic Information:
• Contract Owner: ${contract.owner}
• Contract Type: ${contract.contractType}
• Notification Days: ${contract.notificationDays}
• Auto-Renewal: ${contract.autoRenewal ? 'Enabled' : 'Disabled'}

💰 Financial Settings:
• Contract Value: $${contract.value.toLocaleString()}
• Budget Alerts: Enabled at 75% and 90%
• Spend Tracking: Real-time enabled

📅 Dates & Milestones:
• Next Review Date: ${contract.nextReview}
• Renewal Discussion Date: Auto-calculated
• Option Exercise Dates: Configure

⚠️  Compliance Configuration:
• Compliance Checks: Automated
• Performance Thresholds: Configure
• Alert Recipients: Add/Remove

RECENT CHANGE HISTORY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2025-09-15] Notification period updated to ${contract.notificationDays} days
[2025-08-20] Budget utilization alerts configured
[2025-07-10] Contract owner assigned: ${contract.owner}

⚠️  Note: All contract modifications require approval
⚠️  Changes will be logged in audit trail
⚠️  Supplier will be notified of material changes

Would you like to proceed with contract modification?
• Save & Approve
• Save as Draft
• Request Approval
• Cancel Changes`);
  };

  // Handler 7: Audit Contract - Generate detailed audit report
  const handleAuditContract = (contract: Contract) => {
    alert(`🔍 Contract Audit Report - ${contract.contractNumber}

AUDIT SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Audit Date: ${new Date().toLocaleDateString()}
Auditor: Compliance System
Contract: ${contract.contractNumber}
Supplier: ${contract.supplier}
Overall Status: ${contract.complianceStatus.toUpperCase()}

FINANCIAL AUDIT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Contract Value: $${contract.value.toLocaleString()}
✅ Total Spend: $${contract.spendToDate.toLocaleString()}
✅ Utilization: ${contract.utilizationPercent}%
${contract.utilizationPercent > 90 ? '⚠️  Risk: High utilization detected' : '✅ Utilization within normal range'}
✅ Budget Variance: +2.3% (Within acceptable limits)
✅ Unauthorized Spend: None detected

COMPLIANCE CHECKLIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Contract Signed & Executed
✅ Insurance Certificates Current
✅ Performance Bonds Valid
${contract.status === 'expired' ? '❌ Contract Status: EXPIRED' : '✅ Contract Active & Valid'}
${contract.complianceStatus === 'at-risk' ? '⚠️  Performance Issues Identified' : '✅ Performance Meets Standards'}
✅ Legal Terms Compliant
✅ Regulatory Requirements Met

PERFORMANCE REVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery Performance:
• On-Time Delivery: 96.5% ✅
• Lead Time Variance: +2 days ⚠️
• Order Fill Rate: 98.2% ✅

Quality Performance:
• Quality Acceptance Rate: 97.2% ${contract.complianceStatus === 'at-risk' ? '⚠️' : '✅'}
• Defect Rate: 2.8%
• Return Rate: 1.2%
• Customer Complaints: 3 (Last quarter)

Financial Performance:
• Invoice Accuracy: 98.8% ⚠️
• Payment Terms Compliance: 100% ✅
• Price Stability: Stable
• Cost Savings Achieved: $45,000

OBLIGATIONS STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Obligations: ${obligations.filter(o => o.contractId === contract.id).length}
Completed: ${obligations.filter(o => o.contractId === contract.id && o.status === 'completed').length}
Pending: ${obligations.filter(o => o.contractId === contract.id && o.status === 'pending').length}
Overdue: ${obligations.filter(o => o.contractId === contract.id && o.status === 'overdue').length}

${obligations.filter(o => o.contractId === contract.id).map(obl =>
  `• ${obl.obligation}: ${obl.status.toUpperCase()} ${obl.status === 'overdue' ? '⚠️' : obl.status === 'completed' ? '✅' : '⏳'}`
).join('\n')}

RISK ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${contract.status === 'expired' ? '🔴 CRITICAL: Expired contract with active spend' :
  contract.status === 'expiring' ? '🟡 HIGH: Contract expiring within 60 days' :
  contract.utilizationPercent > 90 ? '🟡 MEDIUM: High utilization risk' :
  '🟢 LOW: No significant risks identified'}

AUDIT FINDINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${contract.complianceStatus === 'compliant' ?
  '✅ No major compliance issues identified\n✅ All performance metrics within acceptable range\n✅ Financial controls operating effectively' :
  contract.complianceStatus === 'at-risk' ?
  '⚠️  Performance improvement required in:\n   - Quality acceptance rate\n   - Invoice accuracy\n   - SLA response times\n⚠️  Recommend quarterly performance reviews' :
  '❌ Critical compliance failures:\n   - Contract has expired\n   - Unauthorized spending detected\n   - Immediate action required\n❌ Recommend contract suspension or immediate renewal'}

RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${contract.status === 'expired' ?
  '1. Immediately suspend all purchase orders\n2. Initiate contract renewal or termination\n3. Review all post-expiry spending\n4. Implement enhanced expiry controls' :
  contract.status === 'expiring' ?
  '1. Schedule renewal negotiation meeting\n2. Review and update contract terms\n3. Assess supplier performance\n4. Prepare renewal documentation' :
  contract.utilizationPercent > 90 ?
  '1. Plan for contract value increase\n2. Negotiate additional capacity\n3. Monitor spend closely\n4. Accelerate renewal discussions' :
  '1. Continue quarterly performance monitoring\n2. Maintain current compliance program\n3. Schedule next review as planned'}

Next Audit Due: ${new Date(new Date(contract.nextReview).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Auditor Signature: [Digital Signature]
Report Generated: ${new Date().toLocaleString()}`);
  };

  // Handler 8: Refresh Compliance Data - Sync latest compliance information
  const handleRefreshCompliance = () => {
    alert(`🔄 Refreshing Compliance Data...

SYNCHRONIZATION STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Contract Data:
✅ Refreshing 5 active contracts...
✅ Updating contract statuses...
✅ Recalculating utilization percentages...
✅ Syncing spend data from ERP system...

📈 Compliance Metrics:
✅ Fetching latest supplier performance data...
✅ Updating quality acceptance rates...
✅ Refreshing delivery performance metrics...
✅ Syncing invoice accuracy data...
✅ Recalculating SLA compliance scores...

⚠️  Compliance Issues:
✅ Scanning for new violations...
✅ Updating risk assessments...
✅ Checking obligation due dates...
✅ Identifying expiring contracts...

🔔 Alerts & Notifications:
✅ Processing pending alerts...
✅ Clearing resolved issues...
✅ Generating new alert notifications...

DATA REFRESH COMPLETE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Updated Metrics:
• Contracts Scanned: 5
• New Violations Found: 0
• Resolved Issues: 2
• Pending Alerts: 4
• Compliance Score: 96.5%

⚙️  System Status:
• ERP Integration: Connected ✅
• Supplier Portal: Online ✅
• Alert System: Active ✅
• Audit Log: Updated ✅

🕐 Last Refresh: ${new Date().toLocaleString()}
⏭️  Next Auto-Refresh: 1 hour

All compliance data is now up to date!`);
  };

  // Handler 9: Export Compliance Report - Generate downloadable reports
  const handleExportReport = () => {
    alert(`📥 Export Compliance Report

SELECT REPORT TYPE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 1. Executive Summary Report
   • High-level compliance overview
   • Key metrics and trends
   • Critical issues and actions
   • Recommended for: Board, Executive team
   • Format: PDF, PowerPoint

📋 2. Detailed Compliance Report
   • Complete contract portfolio analysis
   • All compliance metrics with history
   • Detailed violation tracking
   • Audit trail documentation
   • Recommended for: Compliance team, Auditors
   • Format: PDF, Excel

💰 3. Financial Compliance Report
   • Contract spend analysis
   • Budget utilization tracking
   • Cost savings and variances
   • Unauthorized spend detection
   • Recommended for: Finance team, CFO
   • Format: Excel, CSV

⚠️  4. Violation & Risk Report
   • All active violations
   • Risk assessment by contract
   • Compliance failure analysis
   • Corrective action plans
   • Recommended for: Risk management, Legal
   • Format: PDF, Word

📈 5. Performance Dashboard
   • Supplier performance metrics
   • Quality and delivery trends
   • SLA compliance tracking
   • Comparative analysis
   • Recommended for: Operations, Procurement
   • Format: PDF, Excel, PowerPoint

🔍 6. Audit Trail Export
   • Complete activity log
   • User access and changes
   • System events and alerts
   • Compliance investigation support
   • Recommended for: Auditors, Compliance officers
   • Format: CSV, JSON, PDF

EXPORT OPTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date Range:
   • Last 30 days
   • Last quarter
   • Last 6 months
   • Year to date
   • Custom range

🎯 Filter By:
   • Compliance status
   • Contract type
   • Supplier
   • Risk level
   • Contract owner

📊 Include:
   ✅ Charts and visualizations
   ✅ Detailed metrics tables
   ✅ Executive summary
   ✅ Recommendations
   ✅ Audit trail
   ✅ Compliance certificates

DELIVERY METHOD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 📧 Email to recipients
• 💾 Download immediately
• ☁️  Save to cloud storage
• 🔗 Generate secure share link
• 📅 Schedule recurring reports

✅ Report configuration saved
📧 Report will be sent to: compliance@company.com
📥 Download link: [Generated]
🔒 Report secured with encryption
📅 Generated: ${new Date().toLocaleString()}`);
  };

  // Handler 10: Configure Settings - System configuration
  const handleConfigureSettings = () => {
    alert(`⚙️  Contract Compliance Settings

GENERAL SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Auto-Refresh Interval: 1 hour
✅ Email Notifications: Enabled
✅ SMS Alerts: Enabled for critical issues
✅ Dashboard Auto-Load: Enabled
✅ Default View: Contract Portfolio

COMPLIANCE THRESHOLDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Expiry Warning (Days):
  - First Alert: 90 days ⚠️
  - Second Alert: 60 days ⚠️
  - Critical Alert: 30 days 🚨

• Utilization Alerts:
  - Warning Threshold: 75% 📊
  - Critical Threshold: 90% 🚨
  - Auto-Block: 100% 🚫

• Performance Thresholds:
  - Quality Target: 98%
  - Delivery Target: 95%
  - Invoice Accuracy: 99%
  - SLA Response Time: 24 hours

AUDIT CONFIGURATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Automatic Audit Logging: Enabled
✅ Quarterly Contract Reviews: Enabled
✅ Compliance Scanning: Real-time
✅ Audit Retention Period: 7 years
✅ Change Approval Required: Yes

ALERT RECIPIENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Owners:
• Sarah Johnson - sarah.j@company.com
• Michael Chen - michael.c@company.com
• Emily Davis - emily.d@company.com
• Robert Wilson - robert.w@company.com
• Lisa Anderson - lisa.a@company.com

Management:
• Procurement Director - director@company.com
• CFO - cfo@company.com
• Compliance Officer - compliance@company.com

INTEGRATION SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ERP Integration: SAP (Connected)
✅ Supplier Portal: Active
✅ E-Signature: DocuSign (Configured)
✅ Contract Management: Ariba (Synced)
✅ Financial System: Real-time sync

WORKFLOW AUTOMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Auto-Alert on Violations: Enabled
✅ Auto-Block Expired Contracts: Enabled
✅ Quarterly Review Reminders: Enabled
✅ Obligation Due Date Notifications: Enabled
✅ Performance Report Generation: Weekly

SECURITY SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Two-Factor Authentication: Required
✅ Role-Based Access Control: Enabled
✅ Audit Log Encryption: AES-256
✅ Data Retention Policy: Compliant
✅ GDPR Compliance: Enabled

DATA PRIVACY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Sensitive Data Masking: Enabled
✅ Access Logging: Full audit trail
✅ Data Export Controls: Restricted
✅ Third-Party Sharing: Approval required

✅ Settings updated successfully
🔒 Configuration secured
📧 Changes notification sent to administrators
💾 Backup created: ${new Date().toLocaleString()}`);
  };

  const getContractStatusColor = (status: ContractStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'renewed': return 'bg-blue-100 text-blue-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: ComplianceStatus): string => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricStatusColor = (status: string): string => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getObligationStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Contract Compliance Management</h2>
              <p className="text-blue-100">Monitor contract performance, compliance, and obligations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefreshCompliance}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={handleConfigureSettings}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={handleMonitorCompliance}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition flex items-center justify-center gap-2 shadow"
        >
          <FileCheck className="h-5 w-5" />
          <span className="font-medium">Monitor Compliance</span>
        </button>
        <button
          onClick={handleFlagViolations}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition flex items-center justify-center gap-2 shadow"
        >
          <Flag className="h-5 w-5" />
          <span className="font-medium">Flag Violations</span>
        </button>
        <button
          onClick={handleGenerateAuditTrail}
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition flex items-center justify-center gap-2 shadow"
        >
          <FileText className="h-5 w-5" />
          <span className="font-medium">Generate Audit Trail</span>
        </button>
        <button
          onClick={handleSetAlerts}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition flex items-center justify-center gap-2 shadow"
        >
          <Bell className="h-5 w-5" />
          <span className="font-medium">Set Alerts</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'expiring').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contract Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(contracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {(contracts.reduce((sum, c) => sum + c.utilizationPercent, 0) / contracts.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['contracts', 'metrics', 'obligations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'contracts' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contract.contractType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getComplianceStatusColor(contract.complianceStatus)}`}>
                          {contract.complianceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{contract.startDate}</div>
                        <div className="text-xs">to {contract.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(contract.value / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                contract.utilizationPercent >= 90 ? 'bg-red-500' :
                                contract.utilizationPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(contract.utilizationPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700">{contract.utilizationPercent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewContract(contract)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditContract(contract)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAuditContract(contract)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <FileCheck className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complianceMetrics.map((metric, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.metric}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.target}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.actual}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                metric.status === 'pass' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((metric.actual / metric.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700">
                            {((metric.actual / metric.target) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMetricStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'obligations' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obligation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {obligations.map((obl) => (
                    <tr key={obl.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{obl.obligation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contracts.find(c => c.id === obl.contractId)?.contractNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {obl.dueDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getObligationStatusColor(obl.status)}`}>
                          {obl.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(obl.priority)}`}>
                          {obl.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{obl.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractCompliance;
