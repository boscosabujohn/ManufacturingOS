'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, XCircle, Clock,
  FileText, Award, Users, Target, Activity, BarChart3,
  Settings, Download, Upload, Eye, Edit3, Plus, Search,
  Filter, Bell, Calendar, Globe, Lock, Key, Database, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface ProcurementComplianceProps {}

const ProcurementCompliance: React.FC<ProcurementComplianceProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompliance, setSelectedCompliance] = useState<any>(null);

  // Mock compliance data
  const complianceMetrics = {
    overallScore: 94.2,
    totalRequirements: 156,
    compliant: 147,
    nonCompliant: 6,
    pending: 3,
    auditScore: 96.8,
    policiesUpdated: 12,
    incidentsThisMonth: 2
  };

  // Mock compliance requirements
  const complianceRequirements = [
    {
      id: 'REQ001',
      category: 'Data Protection',
      requirement: 'GDPR Compliance',
      status: 'compliant',
      score: 98,
      lastAudit: '2024-11-15',
      nextReview: '2025-05-15',
      owner: 'Legal Team'
    },
    {
      id: 'REQ002',
      category: 'Financial',
      requirement: 'SOX Controls',
      status: 'compliant',
      score: 95,
      lastAudit: '2024-10-20',
      nextReview: '2025-04-20',
      owner: 'Finance Team'
    },
    {
      id: 'REQ003',
      category: 'Environmental',
      requirement: 'ISO 14001',
      status: 'pending',
      score: 88,
      lastAudit: '2024-09-10',
      nextReview: '2025-03-10',
      owner: 'Operations'
    }
  ];

  // Handler Functions
  const handleRunAudit = () => {
    console.log('Running compliance audit...');

    alert(`Run Procurement Compliance Audit\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUDIT SCOPE SELECTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSelect Audit Type:\n\n1. COMPREHENSIVE AUDIT (Full Scope):\n   Duration: 3-5 business days\n   Coverage: All ${complianceMetrics.totalRequirements} compliance requirements\n   \n   Includes:\n   ✓ Data Protection (GDPR, CCPA)\n   ✓ Financial Controls (SOX, Internal)\n   ✓ Environmental Standards (ISO 14001)\n   ✓ Labor & Ethics (Fair Labor, Anti-Corruption)\n   ✓ Supply Chain Security\n   ✓ Quality Management (ISO 9001)\n   ✓ Information Security (ISO 27001)\n   ✓ Procurement Policies & Procedures\n   \n   Recommended: Annual comprehensive audit\n\n2. FOCUSED AUDIT (Specific Category):\n   Duration: 1-2 business days\n   Coverage: Selected category only\n   \n   Select Category:\n   □ Data Protection\n   □ Financial Controls\n   □ Environmental\n   □ Labor & Ethics\n   □ Supply Chain Security\n   □ Quality Management\n   □ Information Security\n   □ Procurement Policies\n   \n   Recommended: Quarterly focused audits\n\n3. RISK-BASED AUDIT:\n   Duration: 2-3 business days\n   Coverage: High-risk areas and recent violations\n   \n   Focus Areas:\n   ✓ Non-compliant items (${complianceMetrics.nonCompliant})\n   ✓ Pending reviews (${complianceMetrics.pending})\n   ✓ Expired certifications\n   ✓ Recent incidents (${complianceMetrics.incidentsThisMonth} this month)\n   ✓ Overdue policy updates\n   ✓ Supplier compliance gaps\n   \n   Recommended: Monthly or as-needed\n\n4. SUPPLIER COMPLIANCE AUDIT:\n   Duration: 2-4 business days\n   Coverage: Supplier compliance verification\n   \n   Verification Points:\n   ✓ Certificate validity\n   ✓ Code of conduct adherence\n   ✓ Environmental standards\n   ✓ Labor practices\n   ✓ Conflict minerals\n   ✓ Data security\n   \n   Recommended: New suppliers + annual reviews\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUDIT METHODOLOGY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAUDIT PROCESS:\n\n1. PLANNING (Day 1):\n   - Define audit scope\n   - Identify stakeholders\n   - Schedule interviews\n   - Request documentation\n   - Prepare audit checklist\n\n2. DATA COLLECTION (Days 2-3):\n   - Review policies and procedures\n   - Examine transaction samples\n   - Interview process owners\n   - Test control effectiveness\n   - Analyze compliance metrics\n   - Verify documentation\n\n3. ANALYSIS (Day 4):\n   - Identify gaps and violations\n   - Assess root causes\n   - Evaluate severity levels\n   - Compare to benchmarks\n   - Calculate compliance scores\n\n4. REPORTING (Day 5):\n   - Draft audit findings\n   - Classify issues (Critical/High/Med/Low)\n   - Provide recommendations\n   - Create action plans\n   - Schedule follow-up\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUDIT TEAM\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nInternal Audit Team:\n□ Compliance Manager (Lead)\n□ Procurement Director\n□ Legal Counsel\n□ Internal Auditor\n□ IT Security Specialist\n□ Quality Manager\n\nExternal Resources (if needed):\n□ Third-party auditor\n□ Industry specialist\n□ Legal consultant\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUDIT DELIVERABLES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nReports Generated:\n\n1. Executive Summary:\n   - Overall compliance score\n   - Key findings\n   - Critical violations\n   - Improvement trends\n\n2. Detailed Audit Report:\n   - Methodology\n   - Scope and limitations\n   - Findings by category\n   - Evidence and samples\n   - Root cause analysis\n   - Recommendations\n\n3. Action Plan:\n   - Corrective actions\n   - Responsible parties\n   - Target completion dates\n   - Resource requirements\n   - Follow-up schedule\n\n4. Compliance Dashboard:\n   - Visual metrics\n   - Trend analysis\n   - Risk heat map\n   - Progress tracking\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCURRENT COMPLIANCE STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Score: ${complianceMetrics.overallScore}%\nCompliant: ${complianceMetrics.compliant}/${complianceMetrics.totalRequirements}\nNon-Compliant: ${complianceMetrics.nonCompliant}\nPending: ${complianceMetrics.pending}\nLast Audit Score: ${complianceMetrics.auditScore}%\n\n${complianceMetrics.nonCompliant > 0 || complianceMetrics.pending > 0 ? `⚠️ ACTION ITEMS:\n- ${complianceMetrics.nonCompliant} non-compliant items need remediation\n- ${complianceMetrics.pending} pending reviews\n- ${complianceMetrics.incidentsThisMonth} incidents reported this month\n\nRECOMMENDATION: Risk-Based Audit\n` : '✓ All requirements currently compliant\n\nRECOMMENDATION: Comprehensive Annual Audit\n'}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNEXT STEPS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. Select audit type and scope\n2. Assign audit team members\n3. Set start date (suggest: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]})\n4. Notify stakeholders\n5. Prepare audit materials\n\nProceed with audit setup?`);
  };

  const handleViewViolations = () => {
    console.log('Viewing compliance violations...');

    const mockViolations = [
      { id: 'V001', date: '2025-10-20', category: 'Environmental', severity: 'Medium', description: 'Supplier XYZ missing ISO 14001 certification renewal', status: 'Open', dueDate: '2025-11-15' },
      { id: 'V002', date: '2025-10-18', category: 'Data Protection', severity: 'High', description: 'GDPR data retention policy violation - 3 suppliers', status: 'In Progress', dueDate: '2025-10-30' },
      { id: 'V003', date: '2025-10-10', category: 'Financial', severity: 'Low', description: 'Late SOX control documentation', status: 'Resolved', dueDate: '2025-10-25' },
      { id: 'V004', date: '2025-10-05', category: 'Labor & Ethics', severity: 'Critical', description: 'Conflict minerals declaration missing for 2 suppliers', status: 'Open', dueDate: '2025-10-28' },
      { id: 'V005', date: '2025-09-28', category: 'Supply Chain', severity: 'Medium', description: 'Supplier code of conduct acknowledgment overdue', status: 'Resolved', dueDate: '2025-10-20' }
    ];

    alert(`Compliance Violations & Non-Conformances\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVIOLATION SUMMARY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTotal Violations (Last 90 Days): ${mockViolations.length}\n❌ Critical: ${mockViolations.filter(v => v.severity === 'Critical').length}\n⚠️ High: ${mockViolations.filter(v => v.severity === 'High').length}\n⚡ Medium: ${mockViolations.filter(v => v.severity === 'Medium').length}\n○ Low: ${mockViolations.filter(v => v.severity === 'Low').length}\n\nSTATUS BREAKDOWN:\n🔴 Open: ${mockViolations.filter(v => v.status === 'Open').length}\n🟡 In Progress: ${mockViolations.filter(v => v.status === 'In Progress').length}\n✓ Resolved: ${mockViolations.filter(v => v.status === 'Resolved').length}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nACTIVE VIOLATIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${mockViolations.filter(v => v.status !== 'Resolved').map((v, idx) =>
  `${idx + 1}. [${v.severity.toUpperCase()}] ${v.id}\n   Date: ${v.date}\n   Category: ${v.category}\n   Status: ${v.status}\n   \n   Description:\n   ${v.description}\n   \n   Due Date: ${v.dueDate}\n   Days Remaining: ${Math.ceil((new Date(v.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}\n   ${Math.ceil((new Date(v.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 7 ? '⏰ URGENT - Due within 7 days' : Math.ceil((new Date(v.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 0 ? '❌ OVERDUE' : '📅 On track'}`
).join('\n\n')}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVIOLATION CATEGORIES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${Array.from(new Set(mockViolations.map(v => v.category))).map(cat =>
  `${cat}: ${mockViolations.filter(v => v.category === cat).length} violation(s)`
).join('\n')}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSEVERITY CLASSIFICATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCRITICAL:\n- Immediate legal/regulatory risk\n- Potential for significant fines\n- Requires executive notification\n- Resolution: < 7 days\n\nHIGH:\n- Compliance breach with moderate risk\n- Could lead to penalties\n- Requires management escalation\n- Resolution: < 14 days\n\nMEDIUM:\n- Process non-conformance\n- Limited immediate risk\n- Standard remediation process\n- Resolution: < 30 days\n\nLOW:\n- Minor documentation issues\n- Preventive actions recommended\n- Standard follow-up\n- Resolution: < 60 days\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREMEDIATION ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRequired Actions:\n\n1. IMMEDIATE (Critical Violations):\n   ${mockViolations.filter(v => v.severity === 'Critical').length > 0 ? mockViolations.filter(v => v.severity === 'Critical').map(v => `- ${v.description}\n   Owner: ${v.category} Team\n   Due: ${v.dueDate}`).join('\n   ') : '✓ No critical violations'}\n\n2. SHORT-TERM (High & Medium):\n   - Review supplier documentation\n   - Update policy acknowledgments\n   - Schedule compliance training\n   - Implement corrective actions\n\n3. PREVENTIVE MEASURES:\n   - Strengthen pre-qualification\n   - Automate compliance tracking\n   - Enhance supplier monitoring\n   - Update audit procedures\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREPORTING & ESCALATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nNotifications Sent:\n✉ Compliance Manager\n✉ Procurement Director\n${mockViolations.filter(v => v.severity === 'Critical').length > 0 ? '✉ Chief Compliance Officer\n✉ Legal Department\n✉ Executive Team' : ''}\n\nREGULATORY REPORTING:\n${mockViolations.filter(v => v.severity === 'Critical' || v.severity === 'High').length > 0 ? '⚠️ May require regulatory notification\nConsult Legal before external reporting' : '✓ No regulatory reporting required'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQUICK ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• View violation details\n• Assign remediation owner\n• Update resolution status\n• Add notes and evidence\n• Generate violation report\n• Schedule follow-up audit\n• Export violation log`);
  };

  const handleGenerateReport = () => {
    console.log('Generating compliance report...');

    alert(`Generate Compliance Report\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREPORT TYPE SELECTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. EXECUTIVE COMPLIANCE DASHBOARD:\n   Format: PDF, PowerPoint\n   Audience: C-Level, Board\n   Length: 5-10 pages\n   \n   Includes:\n   ✓ Overall compliance score (${complianceMetrics.overallScore}%)\n   ✓ Compliance trends (YTD)\n   ✓ Critical violations summary\n   ✓ Key risk indicators\n   ✓ Audit results comparison\n   ✓ Strategic recommendations\n   ✓ Industry benchmarks\n   \n   Delivery: Monthly or Quarterly\n\n2. DETAILED COMPLIANCE REPORT:\n   Format: PDF, Excel\n   Audience: Compliance Team, Managers\n   Length: 20-40 pages\n   \n   Includes:\n   ✓ Compliance by category (${complianceRequirements.length} categories)\n   ✓ All ${complianceMetrics.totalRequirements} requirements with status\n   ✓ Violation details and remediation\n   ✓ Audit findings and evidence\n   ✓ Policy compliance tracking\n   ✓ Supplier compliance scorecard\n   ✓ Training completion rates\n   ✓ Document expiry tracking\n   ✓ Incident log and analysis\n   ✓ Corrective action status\n   \n   Delivery: Monthly\n\n3. REGULATORY COMPLIANCE REPORT:\n   Format: PDF (formal)\n   Audience: Regulatory Bodies\n   Length: 15-30 pages\n   \n   Covers:\n   ✓ GDPR/Data Protection compliance\n   ✓ SOX financial controls\n   ✓ Environmental regulations (ISO 14001)\n   ✓ Labor & ethics standards\n   ✓ Conflict minerals (Dodd-Frank)\n   ✓ Import/export compliance\n   ✓ Anti-corruption measures\n   \n   Delivery: Annual or as required\n\n4. SUPPLIER COMPLIANCE REPORT:\n   Format: Excel, PDF\n   Audience: Procurement Team, Suppliers\n   Length: 10-20 pages\n   \n   Tracks:\n   ✓ Supplier compliance scores\n   ✓ Certificate status (valid/expired)\n   ✓ Code of conduct adherence\n   ✓ Audit results by supplier\n   ✓ Non-conformances\n   ✓ Improvement actions\n   ✓ Re-certification schedules\n   \n   Delivery: Quarterly\n\n5. AUDIT FINDINGS REPORT:\n   Format: PDF, Word\n   Audience: Audit Committee, Management\n   Length: 15-25 pages\n   \n   Contains:\n   ✓ Audit scope and methodology\n   ✓ Findings by severity\n   ✓ Control effectiveness\n   ✓ Gap analysis\n   ✓ Root cause analysis\n   ✓ Recommendations\n   ✓ Management response\n   ✓ Action plan with timeline\n   \n   Delivery: Per audit cycle\n\n6. POLICY ADHERENCE REPORT:\n   Format: Excel, PDF\n   Audience: Department Heads\n   Length: 8-15 pages\n   \n   Shows:\n   ✓ Policy compliance by department\n   ✓ Acknowledgment tracking\n   ✓ Exception requests\n   ✓ Policy violations\n   ✓ Training completion\n   ✓ Policy updates needed\n   \n   Delivery: Quarterly\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREPORT CUSTOMIZATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDate Range:\n□ Last 30 days\n● Last 90 days (Current Quarter)\n□ Last 6 months\n□ Last 12 months (YTD)\n□ Custom date range\n\nCategories to Include:\n☑ All Categories\n□ Data Protection only\n□ Financial Controls only\n□ Environmental only\n□ Labor & Ethics only\n□ Supply Chain Security only\n□ Custom selection\n\nDetail Level:\n○ Summary (High-level overview)\n● Standard (Balanced detail)\n○ Comprehensive (Full details)\n\nVisualizations:\n☑ Compliance score charts\n☑ Trend analysis graphs\n☑ Category breakdown pie charts\n☑ Risk heat maps\n□ Supplier scorecards\n□ Control effectiveness radar\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSCHEDULED REPORTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAutomate Report Generation:\n\n□ Daily: Violation alerts\n☑ Weekly: Open violations summary\n☑ Monthly: Executive dashboard\n☑ Quarterly: Detailed compliance report\n□ Annual: Regulatory filing report\n\nDelivery Method:\n☑ Email to distribution list\n□ Upload to SharePoint\n□ Post to compliance portal\n□ Export to GRC system\n\nDistribution List:\n- compliance@company.com\n- procurement-director@company.com\n- legal@company.com\n- audit-committee@company.com\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCURRENT METRICS (For Report)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Compliance: ${complianceMetrics.overallScore}%\nCompliant Items: ${complianceMetrics.compliant}/${complianceMetrics.totalRequirements}\nNon-Compliant: ${complianceMetrics.nonCompliant}\nPending Reviews: ${complianceMetrics.pending}\nRecent Audit Score: ${complianceMetrics.auditScore}%\nIncidents This Month: ${complianceMetrics.incidentsThisMonth}\nPolicies Updated: ${complianceMetrics.policiesUpdated} (last quarter)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREPORT GENERATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEstimated generation time: 2-5 minutes\nFile size: ~5-15 MB\nFormat options: PDF, Excel, PowerPoint, Word\n\nSelect report type and proceed?`);
  };

  const handleSetPolicies = () => {
    console.log('Setting compliance policies...');

    alert(`Compliance Policy Management\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPOLICY CATEGORIES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. DATA PROTECTION & PRIVACY:\n   □ GDPR Compliance Policy\n   □ Data Retention Policy\n   □ Privacy by Design\n   □ Data Subject Rights\n   □ Cross-border Data Transfer\n   □ Breach Notification Protocol\n   Last Updated: 2025-09-15\n   Next Review: 2026-03-15\n\n2. FINANCIAL CONTROLS:\n   □ SOX Compliance Policy\n   □ Segregation of Duties\n   □ Purchase Authorization Matrix\n   □ Expense Approval Limits\n   □ Conflict of Interest\n   □ Fraud Prevention\n   Last Updated: 2025-08-01\n   Next Review: 2026-02-01\n\n3. ENVIRONMENTAL SUSTAINABILITY:\n   □ ISO 14001 Requirements\n   □ Sustainable Procurement\n   □ Waste Management\n   □ Carbon Footprint Reduction\n   □ Hazardous Materials\n   □ Environmental Reporting\n   Last Updated: 2025-07-20\n   Next Review: 2026-01-20\n\n4. LABOR & ETHICS:\n   □ Code of Conduct\n   □ Fair Labor Standards\n   □ Anti-Discrimination\n   □ Health & Safety\n   □ Anti-Bribery & Corruption\n   □ Whistleblower Protection\n   Last Updated: 2025-06-10\n   Next Review: 2025-12-10\n\n5. SUPPLY CHAIN SECURITY:\n   □ Supplier Code of Conduct\n   □ Vendor Risk Management\n   □ Cybersecurity Requirements\n   □ Business Continuity\n   □ Conflict Minerals\n   □ Import/Export Compliance\n   Last Updated: 2025-10-05\n   Next Review: 2026-04-05\n\n6. QUALITY MANAGEMENT:\n   □ ISO 9001 Requirements\n   □ Quality Assurance Standards\n   □ Inspection & Testing\n   □ Non-Conformance Handling\n   □ Continuous Improvement\n   □ Supplier Quality Requirements\n   Last Updated: 2025-05-15\n   Next Review: 2025-11-15\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPOLICY LIFECYCLE MANAGEMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCREATE NEW POLICY:\n\n1. Policy Details:\n   - Policy name and ID\n   - Category/classification\n   - Effective date\n   - Review cycle (annual, biennial)\n   - Owner/responsible party\n   - Approval authority\n\n2. Policy Content:\n   - Purpose and scope\n   - Definitions\n   - Policy statements\n   - Procedures and controls\n   - Roles and responsibilities\n   - Monitoring and enforcement\n   - Exceptions process\n\n3. Attachments:\n   - Supporting procedures\n   - Forms and templates\n   - Training materials\n   - Reference documents\n\nUPDATE EXISTING POLICY:\n\n1. Change Management:\n   - Document changes (track versions)\n   - Obtain approvals\n   - Communication plan\n   - Training requirements\n   - Implementation timeline\n\n2. Acknowledgment:\n   - Require re-acknowledgment\n   - Track completion rates\n   - Follow up on non-compliance\n\nARCHIVE/RETIRE POLICY:\n\n1. Sunset Process:\n   - Approval to retire\n   - Archive historical version\n   - Update policy index\n   - Communicate sunset\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPOLICY ENFORCEMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nACKNOWLEDGMENT TRACKING:\n- Require annual acknowledgment\n- Track by employee/supplier\n- Automated reminders\n- Escalation for non-compliance\n- Reporting dashboards\n\nCOMPLIANCE MONITORING:\n- Automated controls\n- Periodic audits\n- Self-assessments\n- Violation tracking\n- Corrective actions\n\nTRAINING REQUIREMENTS:\n- Online training modules\n- Completion tracking\n- Quiz/assessments\n- Certificates of completion\n- Refresher training\n\nEXCEPTIONS PROCESS:\n- Request form\n- Risk assessment\n- Approval workflow\n- Time-limited\n- Periodic review\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPOLICY TEMPLATES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nPre-built Templates:\n✓ Standard policy format\n✓ Procedure document template\n✓ Training presentation\n✓ Acknowledgment form\n✓ Exception request form\n✓ Policy change log\n\nCustomization:\n- Add company branding\n- Tailor to industry\n- Adjust approval levels\n- Define roles\n- Set review frequencies\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCURRENT POLICY STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTotal Policies: 42\nActive: 38\nUnder Review: 3\nDraft: 1\nArchived: 15\n\nRecent Updates: ${complianceMetrics.policiesUpdated} policies (last quarter)\nPending Reviews: 5 policies\nAcknowledgment Rate: 94.2%\n\nUPCOMING REVIEWS:\n- Data Retention Policy (Due: 2025-11-30)\n- Anti-Corruption Policy (Due: 2025-12-10)\n- Supplier Code of Conduct (Due: 2025-12-15)\n- Health & Safety Policy (Due: 2026-01-05)\n- Cybersecurity Policy (Due: 2026-01-20)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPOLICY ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• Create new policy\n• Update existing policy\n• Review policy for renewal\n• Archive retired policy\n• View policy library\n• Generate policy report\n• Track acknowledgments\n• Manage exceptions\n• Configure approval workflow\n\nSelect action to continue?`);
  };

  const handleViewRequirement = (req: any) => {
    console.log('Viewing requirement:', req.id);

    alert(`Compliance Requirement Details: ${req.requirement}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREQUIREMENT INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRequirement ID: ${req.id}\nTitle: ${req.requirement}\nCategory: ${req.category}\nStatus: ${req.status.toUpperCase()}\nCompliance Score: ${req.score}%\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUDIT HISTORY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLast Audit: ${req.lastAudit}\nNext Review: ${req.nextReview}\nAudit Frequency: ${req.category === 'Financial' ? 'Quarterly' : req.category === 'Data Protection' ? 'Semi-annual' : 'Annual'}\nOwner: ${req.owner}\n\nAudit Results Trend:\n${new Date(req.lastAudit) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) ? 'Q4 2025: ' + req.score + '%\nQ3 2025: ' + (req.score - 2) + '%\nQ2 2025: ' + (req.score - 3) + '%\nQ1 2025: ' + (req.score - 5) + '%\nTrend: ↗ Improving' : 'Last 4 quarters: ' + (req.score - 4) + '%, ' + (req.score - 2) + '%, ' + (req.score - 1) + '%, ' + req.score + '%\nTrend: ↗ Improving'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREQUIREMENT DETAILS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${req.category === 'Data Protection' ? `GDPR COMPLIANCE REQUIREMENTS:\n\n✓ Legal Basis for Processing:\n  - Documented consent mechanisms\n  - Legitimate interest assessments\n  - Contract performance justifications\n\n✓ Data Subject Rights:\n  - Access request procedures\n  - Right to erasure process\n  - Data portability workflows\n  - Objection handling\n\n✓ Data Protection Measures:\n  - Encryption at rest and in transit\n  - Access controls and authentication\n  - Data minimization practices\n  - Retention policies\n\n✓ Vendor Management:\n  - Data Processing Agreements (DPAs)\n  - Vendor security assessments\n  - Sub-processor management\n  - International transfer safeguards\n\n✓ Breach Response:\n  - Incident detection\n  - 72-hour notification procedure\n  - Documentation requirements\n  - Communication templates` : req.category === 'Financial' ? `SOX CONTROLS REQUIREMENTS:\n\n✓ Access Controls:\n  - Segregation of duties\n  - User access reviews\n  - Privileged access management\n  - Audit logging\n\n✓ Financial Reporting:\n  - Month-end close procedures\n  - Account reconciliations\n  - Journal entry controls\n  - Management review\n\n✓ Procurement Controls:\n  - Purchase authorization matrix\n  - Three-way match (PO, receipt, invoice)\n  - Vendor master data management\n  - Contract approval workflows\n\n✓ Documentation:\n  - Control descriptions\n  - Process flowcharts\n  - Testing evidence\n  - Exception documentation` : req.category === 'Environmental' ? `ISO 14001 REQUIREMENTS:\n\n✓ Environmental Policy:\n  - Commitment to compliance\n  - Pollution prevention\n  - Continual improvement\n  - Communication to stakeholders\n\n✓ Planning:\n  - Environmental aspects\n  - Legal requirements\n  - Objectives and targets\n  - Environmental programs\n\n✓ Implementation:\n  - Resources and responsibilities\n  - Competence and training\n  - Operational controls\n  - Emergency preparedness\n\n✓ Monitoring:\n  - Performance measurement\n  - Compliance evaluation\n  - Internal audits\n  - Management review` : 'Requirement-specific details...'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPLIANCE STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${req.status === 'compliant' ? `✓ COMPLIANT (${req.score}%)\n\nStrengths:\n- Controls operating effectively\n- Documentation complete\n- Training up to date\n- No violations in last 12 months\n- Audit findings addressed\n\nMaintenance Actions:\n- Continue monitoring\n- Annual policy review (${req.nextReview})\n- Ongoing training\n- Periodic self-assessments` : req.status === 'pending' ? `⏳ PENDING REVIEW (${req.score}%)\n\nOutstanding Items:\n- Final audit report pending\n- Management response required\n- Evidence collection in progress\n- Corrective actions being implemented\n\nNext Steps:\n- Complete audit by ${req.nextReview}\n- Address identified gaps\n- Document remediation\n- Update compliance status` : `❌ NON-COMPLIANT (${req.score}%)\n\nGaps Identified:\n- Control deficiencies\n- Missing documentation\n- Training incomplete\n- Policy violations\n- Audit findings unresolved\n\nRemediation Plan:\n1. Root cause analysis\n2. Corrective action plan\n3. Implementation (30 days)\n4. Validation audit\n5. Status update`}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDOCUMENTATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRequired Documents:\n${req.category === 'Data Protection' ? '- Privacy Policy\n- Data Processing Agreements\n- Consent forms\n- Data mapping\n- Risk assessments' : req.category === 'Financial' ? '- SOX control matrix\n- Process narratives\n- Test results\n- Issue logs\n- Sign-off documentation' : '- ISO certificate\n- Environmental policy\n- Aspect/impact register\n- Audit reports\n- Training records'}\n\nDocument Status:\n✓ All required documents on file\n✓ Current and approved\n✓ Accessible to auditors\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nACTIONS AVAILABLE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• Update compliance status\n• Schedule audit\n• Upload documentation\n• Add notes/comments\n• Assign action items\n• View audit history\n• Generate compliance certificate\n• Export requirement details`);
  };

  const handleRefresh = () => {
    console.log('Refreshing compliance data...');
    alert('Refreshing Procurement Compliance Data...\n\nUpdating:\n- Compliance scores and metrics\n- Requirement statuses\n- Violation tracking\n- Policy acknowledgments\n- Audit schedules\n- Certificate expiries\n- Supplier compliance\n\nSyncing with:\n- Compliance management system\n- Document repository\n- Training platform\n- Audit management tool\n- Supplier portal\n- ERP system\n\nEstimated time: 10-15 seconds\n\nData refresh completed ✓');
  };

  const handleSettings = () => {
    console.log('Opening compliance settings...');
    alert('Compliance Management Settings\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. COMPLIANCE FRAMEWORK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nActive Frameworks:\n☑ GDPR (EU Data Protection)\n☑ SOX (Financial Controls)\n☑ ISO 9001 (Quality Management)\n☑ ISO 14001 (Environmental)\n□ ISO 27001 (Information Security)\n□ HIPAA (Healthcare)\n□ PCI DSS (Payment Card)\n□ FCPA (Anti-Corruption)\n\nCustom Requirements:\n- Add industry-specific requirements\n- Define custom categories\n- Set compliance thresholds\n- Configure scoring methodology\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n2. AUDIT CONFIGURATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAudit Schedules:\n- Annual comprehensive audit\n- Quarterly focused audits\n- Monthly risk-based reviews\n- Ad-hoc supplier audits\n\nAudit Team:\n- Internal audit resources\n- External audit firms\n- Subject matter experts\n- Rotation policy\n\nAudit Scope:\n- Sampling methodology\n- Evidence requirements\n- Testing procedures\n- Reporting templates\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n3. VIOLATION MANAGEMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSeverity Levels:\n- Critical: 0-7 day resolution\n- High: 0-14 day resolution\n- Medium: 0-30 day resolution\n- Low: 0-60 day resolution\n\nEscalation Rules:\n□ Auto-escalate overdue violations\n□ Notify management for critical issues\n□ Alert legal for regulatory violations\n□ Board reporting threshold\n\nRemediation Tracking:\n- Corrective action plans\n- Root cause analysis\n- Preventive measures\n- Closure verification\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n4. POLICY MANAGEMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nPolicy Lifecycle:\n- Review frequency (annual/biennial)\n- Approval workflow\n- Version control\n- Archive policy\n\nAcknowledgment:\n☑ Require annual re-acknowledgment\n☑ Track completion rates\n☑ Automated reminders (7, 14, 30 days)\n□ Consequences for non-compliance\n\nExceptions:\n- Request form template\n- Approval authority matrix\n- Time limits (30/60/90 days)\n- Periodic review\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n5. NOTIFICATIONS & ALERTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAlert Types:\n☑ New violations detected\n☑ Audit due dates approaching\n☑ Certificate expiring (30 days)\n☑ Policy review required\n☑ Acknowledgment overdue\n☑ Compliance score below threshold\n□ Daily digest\n□ Weekly summary\n\nRecipients:\n- Compliance Manager\n- Department owners\n- Executive team (critical only)\n- Audit committee\n\nDelivery:\n☑ Email notifications\n☑ In-app alerts\n□ SMS (critical only)\n□ Slack integration\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n6. REPORTING & DASHBOARDS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nStandard Reports:\n☑ Executive compliance dashboard\n☑ Violation summary\n☑ Audit findings\n☑ Policy adherence\n□ Supplier compliance\n□ Training completion\n\nCustom Reports:\n- Report builder\n- Saved templates\n- Scheduled delivery\n- Export formats (PDF, Excel)\n\nDashboards:\n- Real-time metrics\n- Trend analysis\n- Risk heat maps\n- Drill-down capabilities\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n7. INTEGRATION SETTINGS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSystem Integrations:\n☑ ERP system (procurement data)\n☑ Document management\n☑ Training platform\n□ GRC system\n□ Audit management tool\n□ Risk management system\n\nData Sync:\n- Real-time vs scheduled\n- Sync frequency\n- Data mapping\n- Error handling\n\nAPI Configuration:\n- API keys and authentication\n- Webhook endpoints\n- Rate limits\n- Logging\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n8. USER PERMISSIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRole-Based Access:\n- Compliance Manager: Full access\n- Auditor: View + audit functions\n- Department Owner: View own + update\n- Executive: Dashboard + reports\n- Viewer: Read-only\n\nPermissions:\n□ Create/edit requirements\n□ Run audits\n□ Manage violations\n□ Update policies\n□ Generate reports\n□ Configure settings\n\nSave configuration changes?');
  };

  const handleExport = () => {
    console.log('Exporting compliance data...');
    alert('Export Compliance Data\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEXPORT OPTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. COMPLIANCE DASHBOARD:\n   Format: PDF, PowerPoint\n   Includes: Overall scores, trends, key metrics\n\n2. REQUIREMENTS MATRIX:\n   Format: Excel, CSV\n   Includes: All ' + complianceMetrics.totalRequirements + ' requirements with status\n\n3. VIOLATIONS LOG:\n   Format: Excel, PDF\n   Includes: All violations with remediation status\n\n4. AUDIT REPORTS:\n   Format: PDF, Word\n   Includes: Findings, evidence, action plans\n\n5. POLICY LIBRARY:\n   Format: ZIP (PDFs)\n   Includes: All active policies and procedures\n\n6. COMPLIANCE CERTIFICATES:\n   Format: PDF\n   Includes: ISO, GDPR, SOX certifications\n\nDate Range: Last 90 days (configurable)\nDelivery: Download immediately or email\n\nProceed with export?');
  };

  const handleMonitorCompliance = () => {
    console.log('Opening compliance monitoring...');
    alert(`Compliance Monitoring Dashboard\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREAL-TIME MONITORING\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCURRENT STATUS:\n\nOverall Compliance: ${complianceMetrics.overallScore}% ${complianceMetrics.overallScore >= 95 ? '✓ Excellent' : complianceMetrics.overallScore >= 90 ? '⚠️ Good' : '❌ Needs Attention'}\n\nBreakdown by Category:\n✓ Data Protection: 98.5%\n✓ Financial Controls: 95.2%\n⚠️ Environmental: 88.3% (Improvement needed)\n✓ Labor & Ethics: 96.8%\n✓ Supply Chain Security: 94.1%\n✓ Quality Management: 97.5%\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nALERTS & NOTIFICATIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔴 CRITICAL (Immediate Action):\n${complianceMetrics.nonCompliant > 3 ? `- ${complianceMetrics.nonCompliant - 3} critical violations open\n` : ''}${complianceMetrics.incidentsThisMonth > 1 ? `- ${complianceMetrics.incidentsThisMonth} compliance incidents this month\n` : ''}- 2 certificates expiring in < 30 days\n\n🟡 WARNINGS:\n- 5 audit reviews overdue\n- 12 policy acknowledgments pending\n- 3 corrective actions nearing deadline\n\n🟢 RECENT ACHIEVEMENTS:\n- ${complianceMetrics.policiesUpdated} policies successfully updated\n- ISO 9001 audit passed (${complianceMetrics.auditScore}%)\n- Zero critical findings last quarter\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPLIANCE TRENDS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLast 6 Months:\nOct: ${complianceMetrics.overallScore}%\nSep: ${(complianceMetrics.overallScore - 1.2).toFixed(1)}%\nAug: ${(complianceMetrics.overallScore - 2.1).toFixed(1)}%\nJul: ${(complianceMetrics.overallScore - 3.5).toFixed(1)}%\nJun: ${(complianceMetrics.overallScore - 4.2).toFixed(1)}%\nMay: ${(complianceMetrics.overallScore - 5.8).toFixed(1)}%\nTrend: ↗ Improving (+5.8% since May)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nUPCOMING MILESTONES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nNext 30 Days:\n- Nov 15: GDPR annual audit\n- Nov 20: Environmental policy review\n- Nov 25: Supplier compliance checks\n- Nov 30: Q4 compliance report due\n- Dec 05: ISO 14001 surveillance audit\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nKEY PERFORMANCE INDICATORS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✓ Compliance Rate: ${((complianceMetrics.compliant / complianceMetrics.totalRequirements) * 100).toFixed(1)}%\n✓ Audit Score: ${complianceMetrics.auditScore}%\n✓ Policy Adherence: 94.2%\n✓ Training Completion: 96.5%\n⚠️ Violation Resolution Time: 18 days avg (Target: < 15)\n✓ Certificate Renewal Rate: 98%\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMONITORING ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• View detailed metrics\n• Drill down by category\n• Review open violations\n• Check audit schedule\n• Track corrective actions\n• Generate status report\n• Set up custom alerts\n• Configure thresholds`);
  };

  const handleTrainingCompliance = () => {
    console.log('Managing training compliance...');
    alert(`Compliance Training Management\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTRAINING OVERVIEW\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Completion: 96.5%\nActive Employees: 450\nCompleted Training: 434\nPending: 12\nOverdue: 4\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREQUIRED TRAINING MODULES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. CODE OF CONDUCT (Annual):\n   Completion: 98.2%\n   Avg Score: 92%\n   Duration: 45 minutes\n   Last Updated: 2025-01-15\n\n2. DATA PROTECTION & PRIVACY (Annual):\n   Completion: 95.8%\n   Avg Score: 89%\n   Duration: 60 minutes\n   Includes: GDPR, data handling, breach response\n\n3. ANTI-CORRUPTION & BRIBERY (Annual):\n   Completion: 97.1%\n   Avg Score: 94%\n   Duration: 30 minutes\n   Includes: FCPA, gift policies, reporting\n\n4. PROCUREMENT POLICIES (Biennial):\n   Completion: 94.2%\n   Avg Score: 91%\n   Duration: 90 minutes\n   Includes: Authorization, conflicts, supplier ethics\n\n5. INFORMATION SECURITY (Annual):\n   Completion: 96.7%\n   Avg Score: 88%\n   Duration: 45 minutes\n   Includes: Passwords, phishing, data security\n\n6. ENVIRONMENTAL COMPLIANCE (Annual):\n   Completion: 93.5%\n   Avg Score: 90%\n   Duration: 40 minutes\n   Includes: ISO 14001, waste, sustainability\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTRAINING DELIVERY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFormats:\n☑ Online e-learning modules\n□ In-person workshops\n□ Virtual instructor-led\n□ Video tutorials\n□ Reading materials\n□ Webinars\n\nFeatures:\n✓ Mobile-friendly\n✓ Progress tracking\n✓ Quizzes and assessments\n✓ Certificates of completion\n✓ Automated reminders\n✓ Manager dashboards\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPLETION TRACKING\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBy Department:\n- Procurement: 99.2% ✓\n- Finance: 98.5% ✓\n- Operations: 95.8% ✓\n- IT: 97.2% ✓\n- Legal: 100% ✓\n- Sales: 94.1% ⚠️\n- HR: 96.8% ✓\n\nOverdue Training:\n⚠️ 4 employees with overdue modules\n- 2 in Sales\n- 1 in Operations\n- 1 in IT\n\nReminder sent: 7, 14, 30 days before due\nEscalation: Manager notification at overdue\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNEW HIRE ONBOARDING\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nMandatory Training (First 30 Days):\n□ Code of Conduct (Day 1)\n□ Data Protection (Week 1)\n□ Information Security (Week 1)\n□ Department-specific policies (Week 2)\n□ Role-based compliance (Week 3-4)\n\nCompletion Requirement:\n✓ Pass all modules (80% minimum)\n✓ Acknowledge policies\n✓ Certificate of completion\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREFRESHER & UPDATES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRecurring Schedule:\n- Annual: Most compliance topics\n- Biennial: Specialized topics\n- Ad-hoc: Policy updates, incidents\n\nUpdate Triggers:\n□ Policy changes\n□ Regulatory changes\n□ Compliance incidents\n□ Audit findings\n□ Industry best practices\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREPORTING & ANALYTICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nMetrics Tracked:\n- Completion rates\n- Time to complete\n- Quiz scores\n- Pass/fail rates\n- Overdue count\n- Department comparisons\n\nReports:\n□ Executive dashboard\n□ Department scorecard\n□ Individual transcripts\n□ Compliance certificates\n□ Overdue list\n□ Trend analysis\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTRAINING ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n• Assign training to users\n• Create new course\n• Update existing module\n• Send reminders\n• View completion status\n• Generate certificates\n• Export training records\n• Configure requirements`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Procurement Compliance Management</h2>
              <p className="text-blue-100">Ensure regulatory compliance and policy adherence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Run Compliance Audit"
            >
              <Activity className="h-4 w-4" />
              <span>Run Audit</span>
            </button>
            <button
              onClick={handleViewViolations}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="View Violations"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Violations</span>
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Generate Report"
            >
              <FileText className="h-4 w-4" />
              <span>Report</span>
            </button>
            <button
              onClick={handleSetPolicies}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Manage Policies"
            >
              <Lock className="h-4 w-4" />
              <span>Policies</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'requirements', 'audits', 'policies'].map((tab) => (
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

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Compliance Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-green-500" />
                <span className="text-sm text-green-600">+2.3%</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.overallScore}%</p>
              <p className="text-sm text-gray-600">Overall Compliance</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <span className="text-sm text-blue-600">{complianceMetrics.compliant}/{complianceMetrics.totalRequirements}</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.compliant}</p>
              <p className="text-sm text-gray-600">Compliant Items</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <span className="text-sm text-yellow-600">Action needed</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.nonCompliant}</p>
              <p className="text-sm text-gray-600">Non-Compliant</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-purple-500" />
                <span className="text-sm text-purple-600">Recent audit</span>
              </div>
              <p className="text-2xl font-bold">{complianceMetrics.auditScore}%</p>
              <p className="text-sm text-gray-600">Audit Score</p>
            </div>
          </div>

          {/* Compliance Requirements Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Requirements Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Requirement</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Next Review</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceRequirements.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{req.requirement}</td>
                      <td className="py-2">{req.category}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          req.status === 'compliant' ? 'bg-green-100 text-green-800' :
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2">{req.score}%</td>
                      <td className="py-2">{req.nextReview}</td>
                      <td className="py-2">{req.owner}</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleViewRequirement(req)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                          title="View Requirement Details"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementCompliance;