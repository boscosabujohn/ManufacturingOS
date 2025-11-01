'use client';

import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Award, AlertCircle, RefreshCw, Download, Settings, Eye, FileText, CheckCircle, Activity } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SupplierRisk {
  id: string;
  supplierName: string;
  code: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  financialRisk: number;
  operationalRisk: number;
  complianceRisk: number;
  geopoliticalRisk: number;
  cyberSecurityRisk: number;
  totalSpend: number;
  spendAtRisk: number;
  lastAssessment: string;
  nextReview: string;
  mitigationActions: number;
}

export interface RiskFactor {
  category: string;
  weight: number;
  score: number;
  status: 'good' | 'acceptable' | 'concerning' | 'critical';
  factors: string[];
}

const SupplierRiskScoring: React.FC = () => {
  // Mock data - Supplier risk profiles
  const suppliers: SupplierRisk[] = [
    {
      id: 'RISK001',
      supplierName: 'Acme Manufacturing Co.',
      code: 'ACM-001',
      overallRiskScore: 25,
      riskLevel: 'low',
      financialRisk: 20,
      operationalRisk: 25,
      complianceRisk: 15,
      geopoliticalRisk: 35,
      cyberSecurityRisk: 30,
      totalSpend: 2450000,
      spendAtRisk: 612500,
      lastAssessment: '2025-09-15',
      nextReview: '2025-12-15',
      mitigationActions: 2,
    },
    {
      id: 'RISK002',
      supplierName: 'Global Components Ltd.',
      code: 'GCL-002',
      overallRiskScore: 55,
      riskLevel: 'medium',
      financialRisk: 60,
      operationalRisk: 50,
      complianceRisk: 45,
      geopoliticalRisk: 70,
      cyberSecurityRisk: 50,
      totalSpend: 1850000,
      spendAtRisk: 1017500,
      lastAssessment: '2025-08-20',
      nextReview: '2025-11-20',
      mitigationActions: 5,
    },
    {
      id: 'RISK003',
      supplierName: 'Quality Steel Industries',
      code: 'QSI-003',
      overallRiskScore: 18,
      riskLevel: 'low',
      financialRisk: 15,
      operationalRisk: 20,
      complianceRisk: 10,
      geopoliticalRisk: 25,
      cyberSecurityRisk: 20,
      totalSpend: 3200000,
      spendAtRisk: 576000,
      lastAssessment: '2025-10-01',
      nextReview: '2026-01-01',
      mitigationActions: 1,
    },
    {
      id: 'RISK004',
      supplierName: 'Tech Solutions Inc.',
      code: 'TSI-004',
      overallRiskScore: 72,
      riskLevel: 'high',
      financialRisk: 85,
      operationalRisk: 65,
      complianceRisk: 60,
      geopoliticalRisk: 70,
      cyberSecurityRisk: 80,
      totalSpend: 980000,
      spendAtRisk: 705600,
      lastAssessment: '2025-10-10',
      nextReview: '2025-10-30',
      mitigationActions: 8,
    },
    {
      id: 'RISK005',
      supplierName: 'Precision Parts Manufacturing',
      code: 'PPM-005',
      overallRiskScore: 38,
      riskLevel: 'medium',
      financialRisk: 40,
      operationalRisk: 35,
      complianceRisk: 30,
      geopoliticalRisk: 45,
      cyberSecurityRisk: 40,
      totalSpend: 1650000,
      spendAtRisk: 627000,
      lastAssessment: '2025-09-01',
      nextReview: '2025-12-01',
      mitigationActions: 3,
    },
    {
      id: 'RISK006',
      supplierName: 'Eco Packaging Solutions',
      code: 'EPS-006',
      overallRiskScore: 88,
      riskLevel: 'critical',
      financialRisk: 95,
      operationalRisk: 85,
      complianceRisk: 80,
      geopoliticalRisk: 90,
      cyberSecurityRisk: 90,
      totalSpend: 450000,
      spendAtRisk: 396000,
      lastAssessment: '2025-10-15',
      nextReview: '2025-10-25',
      mitigationActions: 12,
    },
  ];

  // Mock data - Risk factors breakdown
  const riskFactors: RiskFactor[] = [
    {
      category: 'Financial Risk',
      weight: 25,
      score: 60,
      status: 'concerning',
      factors: [
        'Credit rating downgrade to B+',
        'Debt-to-equity ratio at 2.5:1',
        'Late payment history (3 instances YTD)',
        'Revenue decline of 12% YoY',
      ],
    },
    {
      category: 'Operational Risk',
      weight: 25,
      score: 50,
      status: 'acceptable',
      factors: [
        'Single source for critical components',
        'Manufacturing capacity at 95% utilization',
        'Quality issues in last 6 months (2 batches)',
        'Average lead time increased by 15%',
      ],
    },
    {
      category: 'Compliance Risk',
      weight: 20,
      score: 45,
      status: 'acceptable',
      factors: [
        'ISO 9001 certification expiring in 45 days',
        'Pending environmental audit',
        'One minor regulatory violation (resolved)',
        'Worker safety record acceptable',
      ],
    },
    {
      category: 'Geopolitical Risk',
      weight: 15,
      score: 70,
      status: 'concerning',
      factors: [
        'Operations in politically unstable region',
        'Exposure to trade tariffs (15%)',
        'Currency volatility (±10% in Q3)',
        'Supply chain disruptions from regional conflicts',
      ],
    },
    {
      category: 'Cybersecurity Risk',
      weight: 15,
      score: 50,
      status: 'acceptable',
      factors: [
        'SOC 2 Type II certified',
        'One data breach incident (2 years ago)',
        'Regular security audits conducted',
        'Limited EDI/API integration security',
      ],
    },
  ];

  const getRiskLevelColor = (level: RiskLevel): string => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'acceptable': return 'bg-yellow-100 text-yellow-800';
      case 'concerning': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number): string => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  // Handler functions
  const handleAssessRisk = (supplier: SupplierRisk) => {
    console.log('Assessing risk for supplier:', supplier.id);

    const riskCategories = [
      { name: 'Financial Risk', current: supplier.financialRisk, target: 'Below 40' },
      { name: 'Operational Risk', current: supplier.operationalRisk, target: 'Below 35' },
      { name: 'Compliance Risk', current: supplier.complianceRisk, target: 'Below 25' },
      { name: 'Geopolitical Risk', current: supplier.geopoliticalRisk, target: 'Below 45' },
      { name: 'Cybersecurity Risk', current: supplier.cyberSecurityRisk, target: 'Below 30' }
    ];

    alert(`Risk Assessment: ${supplier.supplierName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier: ${supplier.supplierName}
Code: ${supplier.code}
Overall Risk Score: ${supplier.overallRiskScore}/100
Risk Level: ${supplier.riskLevel.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK ASSESSMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: DATA COLLECTION
- Gather latest financial statements (Q3 2025)
- Review operational performance metrics
- Check compliance certifications status
- Analyze geopolitical exposure
- Assess cybersecurity posture

STEP 2: RISK CATEGORY EVALUATION
${riskCategories.map(cat =>
  `\n${cat.name}: ${cat.current}/100
   Status: ${cat.current <= 30 ? '✓ Low Risk' : cat.current <= 60 ? '⚠ Moderate Risk' : '✗ High Risk'}
   Target: ${cat.target}`
).join('\n')}

STEP 3: SCORING METHODOLOGY
- Financial Health: Credit rating, debt ratios, cash flow (25%)
- Operations: Capacity, quality, delivery performance (25%)
- Compliance: Certifications, audits, violations (20%)
- Geopolitical: Regional stability, trade policies (15%)
- Cybersecurity: Security controls, incident history (15%)

STEP 4: IMPACT ANALYSIS
Total Annual Spend: $${(supplier.totalSpend / 1000000).toFixed(2)}M
Value at Risk: $${(supplier.spendAtRisk / 1000000).toFixed(2)}M (${((supplier.spendAtRisk / supplier.totalSpend) * 100).toFixed(1)}%)
Active Mitigation Plans: ${supplier.mitigationActions}

STEP 5: RECOMMENDATIONS
${supplier.riskLevel === 'critical' ?
`⚠ CRITICAL RISK - IMMEDIATE ACTION REQUIRED:
- Schedule emergency risk review within 5 business days
- Implement enhanced monitoring protocols
- Develop contingency sourcing plan
- Consider temporary sourcing restrictions
- Executive escalation recommended` :
supplier.riskLevel === 'high' ?
`⚠ HIGH RISK - PRIORITY ACTION NEEDED:
- Complete detailed risk assessment within 15 days
- Increase monitoring frequency to bi-weekly
- Review and update mitigation strategies
- Identify alternative suppliers
- Monthly senior management review` :
supplier.riskLevel === 'medium' ?
`ℹ MODERATE RISK - STANDARD MONITORING:
- Continue quarterly risk assessments
- Monitor key risk indicators monthly
- Maintain existing mitigation actions
- Review supplier performance regularly
- Update risk profile as needed` :
`✓ LOW RISK - ROUTINE OVERSIGHT:
- Annual comprehensive risk assessment sufficient
- Quarterly KPI monitoring adequate
- Standard contract terms appropriate
- Preferred supplier status maintained
- Continue relationship development`}

NEXT STEPS:
1. Initiate formal risk assessment process
2. Assign risk assessment team and timeline
3. Request updated documentation from supplier
4. Schedule supplier interview/audit if needed
5. Update risk scores upon completion
6. Generate detailed assessment report

Last Assessment: ${supplier.lastAssessment}
Next Scheduled Review: ${supplier.nextReview}

Click 'Start Assessment' to begin the formal risk evaluation process.`);
  };

  const handleUpdateRiskScore = (supplier: SupplierRisk) => {
    console.log('Updating risk score for supplier:', supplier.id);

    alert(`Update Risk Score: ${supplier.supplierName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT RISK PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier: ${supplier.supplierName} (${supplier.code})
Current Overall Score: ${supplier.overallRiskScore}/100
Current Risk Level: ${supplier.riskLevel.toUpperCase()}
Last Updated: ${supplier.lastAssessment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY SCORES (Current)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Financial Risk: ${supplier.financialRisk}/100
Operational Risk: ${supplier.operationalRisk}/100
Compliance Risk: ${supplier.complianceRisk}/100
Geopolitical Risk: ${supplier.geopoliticalRisk}/100
Cybersecurity Risk: ${supplier.cyberSecurityRisk}/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATE PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REVIEW RECENT DEVELOPMENTS:
   ☐ Financial statement changes
   ☐ Operational incidents or improvements
   ☐ New compliance certifications or violations
   ☐ Geopolitical events affecting operations
   ☐ Cybersecurity incidents or upgrades

2. UPDATE CATEGORY SCORES:
   Enter new scores for each risk category (0-100):

   Financial Risk: [____] (Current: ${supplier.financialRisk})
   - Credit rating changes
   - Financial ratio analysis
   - Payment performance

   Operational Risk: [____] (Current: ${supplier.operationalRisk})
   - Capacity utilization
   - Quality metrics
   - Delivery performance

   Compliance Risk: [____] (Current: ${supplier.complianceRisk})
   - Certification status
   - Audit findings
   - Regulatory compliance

   Geopolitical Risk: [____] (Current: ${supplier.geopoliticalRisk})
   - Regional stability
   - Trade policy changes
   - Currency volatility

   Cybersecurity Risk: [____] (Current: ${supplier.cyberSecurityRisk})
   - Security controls assessment
   - Incident history
   - Compliance with security standards

3. CALCULATE NEW OVERALL SCORE:
   Weighted Average =
   (Financial × 25%) + (Operational × 25%) +
   (Compliance × 20%) + (Geopolitical × 15%) +
   (Cybersecurity × 15%)

4. RISK LEVEL CLASSIFICATION:
   0-30: Low Risk (Green)
   31-60: Medium Risk (Yellow)
   61-80: High Risk (Orange)
   81-100: Critical Risk (Red)

5. DOCUMENT CHANGES:
   Required Information:
   - Reason for score changes
   - Supporting documentation/evidence
   - Data sources and validation
   - Reviewer name and date
   - Approval authority (if risk level changes)

6. TRIGGER ACTIONS:
   ${supplier.riskLevel === 'low' && supplier.overallRiskScore > 30 ?
   'If new score >30: Notify procurement team, increase monitoring' :
   supplier.riskLevel === 'medium' && supplier.overallRiskScore > 60 ?
   'If new score >60: Escalate to management, initiate mitigation plan' :
   supplier.riskLevel === 'high' && supplier.overallRiskScore > 80 ?
   'If new score >80: Emergency review required, executive notification' :
   'Standard notification to procurement team'}

7. UPDATE DEPENDENCIES:
   - Supplier scorecard
   - Approved supplier list
   - Contract terms review
   - Insurance requirements
   - Monitoring frequency
   - Audit schedule

APPROVAL WORKFLOW:
- Risk Analyst: Review and update scores
- Risk Manager: Validate methodology and data
- Procurement Director: Approve if risk level changes
- CFO/CPO: Approve if critical risk or major spend

After updating, system will:
✓ Recalculate spend at risk
✓ Update risk dashboards
✓ Trigger notifications per escalation matrix
✓ Schedule next review date
✓ Update supplier portal (if applicable)

Enter updated scores and supporting documentation to proceed.`);
  };

  const handleViewRiskFactors = (supplier: SupplierRisk) => {
    console.log('Viewing risk factors for supplier:', supplier.id);

    alert(`Risk Factors Analysis: ${supplier.supplierName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier: ${supplier.supplierName}
Code: ${supplier.code}
Overall Risk Score: ${supplier.overallRiskScore}/100
Risk Level: ${supplier.riskLevel.toUpperCase()}
Assessment Date: ${supplier.lastAssessment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL RISK FACTORS (Score: ${supplier.financialRisk}/100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.financialRisk > 70 ? '⚠ High Risk Indicators:' : supplier.financialRisk > 40 ? 'ℹ Moderate Risk Indicators:' : '✓ Low Risk Indicators:'}
• Credit Rating: ${supplier.financialRisk > 70 ? 'B or below (Concerning)' : supplier.financialRisk > 40 ? 'BBB (Acceptable)' : 'A or above (Strong)'}
• Debt-to-Equity Ratio: ${supplier.financialRisk > 70 ? '>2.5:1 (High leverage)' : supplier.financialRisk > 40 ? '1.5-2.5:1 (Moderate)' : '<1.5:1 (Conservative)'}
• Payment History: ${supplier.financialRisk > 70 ? 'Multiple late payments' : supplier.financialRisk > 40 ? 'Occasional delays' : 'Consistent on-time payments'}
• Revenue Trend: ${supplier.financialRisk > 70 ? 'Declining >10% YoY' : supplier.financialRisk > 40 ? 'Stable to slight growth' : 'Growing >8% YoY'}
• Cash Flow: ${supplier.financialRisk > 70 ? 'Negative operating cash flow' : supplier.financialRisk > 40 ? 'Positive but tight' : 'Strong and growing'}
• Profitability: ${supplier.financialRisk > 70 ? 'Operating losses' : supplier.financialRisk > 40 ? 'Low margins (2-5%)' : 'Healthy margins (>8%)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPERATIONAL RISK FACTORS (Score: ${supplier.operationalRisk}/100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.operationalRisk > 70 ? '⚠ High Risk Indicators:' : supplier.operationalRisk > 40 ? 'ℹ Moderate Risk Indicators:' : '✓ Low Risk Indicators:'}
• Capacity Utilization: ${supplier.operationalRisk > 70 ? '>95% (Overextended)' : supplier.operationalRisk > 40 ? '85-95% (High)' : '<85% (Flexible)'}
• Single Source Dependencies: ${supplier.operationalRisk > 70 ? 'Critical components' : supplier.operationalRisk > 40 ? 'Some dependencies' : 'Multiple sources'}
• Quality Performance: ${supplier.operationalRisk > 70 ? 'Multiple defects/recalls' : supplier.operationalRisk > 40 ? 'Occasional quality issues' : 'Consistent high quality'}
• Delivery Performance: ${supplier.operationalRisk > 70 ? '<85% on-time delivery' : supplier.operationalRisk > 40 ? '85-95% on-time' : '>95% on-time delivery'}
• Lead Time Stability: ${supplier.operationalRisk > 70 ? 'Increasing >20%' : supplier.operationalRisk > 40 ? 'Some fluctuation' : 'Stable and predictable'}
• Technology/Equipment: ${supplier.operationalRisk > 70 ? 'Outdated/aging' : supplier.operationalRisk > 40 ? 'Adequate but aging' : 'Modern and well-maintained'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLIANCE RISK FACTORS (Score: ${supplier.complianceRisk}/100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.complianceRisk > 70 ? '⚠ High Risk Indicators:' : supplier.complianceRisk > 40 ? 'ℹ Moderate Risk Indicators:' : '✓ Low Risk Indicators:'}
• ISO Certifications: ${supplier.complianceRisk > 70 ? 'Expired or none' : supplier.complianceRisk > 40 ? 'Expiring soon' : 'Current and valid'}
• Environmental Compliance: ${supplier.complianceRisk > 70 ? 'Violations/fines' : supplier.complianceRisk > 40 ? 'Pending audits' : 'Fully compliant'}
• Labor Standards: ${supplier.complianceRisk > 70 ? 'Violations reported' : supplier.complianceRisk > 40 ? 'Minor concerns' : 'Meets all standards'}
• Regulatory Compliance: ${supplier.complianceRisk > 70 ? 'Multiple violations' : supplier.complianceRisk > 40 ? '1-2 minor violations' : 'Clean record'}
• Safety Record: ${supplier.complianceRisk > 70 ? 'Poor safety record' : supplier.complianceRisk > 40 ? 'Average safety metrics' : 'Excellent safety culture'}
• Ethics/Conduct: ${supplier.complianceRisk > 70 ? 'Concerns reported' : supplier.complianceRisk > 40 ? 'No major issues' : 'Strong ethics program'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEOPOLITICAL RISK FACTORS (Score: ${supplier.geopoliticalRisk}/100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.geopoliticalRisk > 70 ? '⚠ High Risk Indicators:' : supplier.geopoliticalRisk > 40 ? 'ℹ Moderate Risk Indicators:' : '✓ Low Risk Indicators:'}
• Political Stability: ${supplier.geopoliticalRisk > 70 ? 'Unstable region/regime' : supplier.geopoliticalRisk > 40 ? 'Some uncertainty' : 'Stable democracy'}
• Trade Policies: ${supplier.geopoliticalRisk > 70 ? 'High tariffs/restrictions' : supplier.geopoliticalRisk > 40 ? 'Moderate tariffs' : 'Free trade agreements'}
• Currency Risk: ${supplier.geopoliticalRisk > 70 ? 'High volatility (±15%)' : supplier.geopoliticalRisk > 40 ? 'Moderate volatility' : 'Stable currency'}
• Conflict Risk: ${supplier.geopoliticalRisk > 70 ? 'Active/recent conflicts' : supplier.geopoliticalRisk > 40 ? 'Regional tensions' : 'Peaceful region'}
• Sanctions Exposure: ${supplier.geopoliticalRisk > 70 ? 'Under sanctions' : supplier.geopoliticalRisk > 40 ? 'Potential exposure' : 'No exposure'}
• Infrastructure: ${supplier.geopoliticalRisk > 70 ? 'Poor/unreliable' : supplier.geopoliticalRisk > 40 ? 'Adequate' : 'Modern and reliable'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CYBERSECURITY RISK FACTORS (Score: ${supplier.cyberSecurityRisk}/100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.cyberSecurityRisk > 70 ? '⚠ High Risk Indicators:' : supplier.cyberSecurityRisk > 40 ? 'ℹ Moderate Risk Indicators:' : '✓ Low Risk Indicators:'}
• Security Certifications: ${supplier.cyberSecurityRisk > 70 ? 'None or expired' : supplier.cyberSecurityRisk > 40 ? 'Basic certifications' : 'SOC 2, ISO 27001'}
• Incident History: ${supplier.cyberSecurityRisk > 70 ? 'Recent breach(es)' : supplier.cyberSecurityRisk > 40 ? 'Past incident resolved' : 'No known incidents'}
• Security Controls: ${supplier.cyberSecurityRisk > 70 ? 'Inadequate/outdated' : supplier.cyberSecurityRisk > 40 ? 'Basic controls' : 'Comprehensive program'}
• Data Protection: ${supplier.cyberSecurityRisk > 70 ? 'Poor practices' : supplier.cyberSecurityRisk > 40 ? 'Meeting minimums' : 'Industry-leading practices'}
• Vendor Management: ${supplier.cyberSecurityRisk > 70 ? 'No vendor screening' : supplier.cyberSecurityRisk > 40 ? 'Basic screening' : 'Rigorous vendor program'}
• Integration Security: ${supplier.cyberSecurityRisk > 70 ? 'Weak API/EDI security' : supplier.cyberSecurityRisk > 40 ? 'Standard security' : 'Advanced security protocols'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL EXPOSURE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Annual Spend: $${(supplier.totalSpend / 1000000).toFixed(2)}M
Spend at Risk: $${(supplier.spendAtRisk / 1000000).toFixed(2)}M (${((supplier.spendAtRisk / supplier.totalSpend) * 100).toFixed(1)}%)
Risk-Adjusted Exposure: $${(supplier.spendAtRisk * supplier.overallRiskScore / 100 / 1000000).toFixed(2)}M

Active Mitigation Actions: ${supplier.mitigationActions}
Next Review Date: ${supplier.nextReview}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.riskLevel === 'critical' || supplier.riskLevel === 'high' ?
`Priority Actions Required:
1. Schedule immediate risk review meeting
2. Develop/update mitigation strategies for high-risk categories
3. Consider dual sourcing or backup suppliers
4. Increase monitoring frequency
5. Review contract terms and protections
6. Escalate to senior management` :
`Standard Monitoring Actions:
1. Continue regular assessment schedule
2. Monitor key risk indicators monthly
3. Maintain mitigation actions as planned
4. Annual contract and performance review
5. Update risk profile as changes occur`}

Click 'View Detailed Analysis' to access full risk factor documentation and supporting evidence.`);
  };

  const handleExportRiskReport = () => {
    console.log('Exporting risk report...');

    const totalSuppliers = suppliers.length;
    const criticalCount = suppliers.filter(s => s.riskLevel === 'critical').length;
    const highCount = suppliers.filter(s => s.riskLevel === 'high').length;
    const mediumCount = suppliers.filter(s => s.riskLevel === 'medium').length;
    const lowCount = suppliers.filter(s => s.riskLevel === 'low').length;
    const totalSpendAtRisk = suppliers.reduce((sum, s) => sum + s.spendAtRisk, 0);

    alert(`Export Supplier Risk Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Suppliers Analyzed: ${totalSuppliers}
Report Generation Date: ${new Date().toLocaleDateString()}
Reporting Period: Q4 2025
Department: Procurement Risk Management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPORT FORMAT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXECUTIVE SUMMARY (PDF)
   File: Supplier_Risk_Executive_Summary_${new Date().toISOString().split('T')[0]}.pdf

   Contents:
   • High-level risk overview dashboard
   • Critical risk suppliers (${criticalCount} suppliers)
   • Total spend at risk: $${(totalSpendAtRisk / 1000000).toFixed(2)}M
   • Top 10 risk factors across portfolio
   • Key trends and changes from last quarter
   • Executive recommendations and actions
   • Risk heatmap by category

   Audience: C-Suite, Board of Directors
   Pages: 8-12 pages with visualizations

2. DETAILED RISK ANALYSIS (Excel)
   File: Supplier_Risk_Detailed_Analysis_${new Date().toISOString().split('T')[0]}.xlsx

   Worksheets:
   • Supplier Risk Scores (all ${totalSuppliers} suppliers)
   • Risk Category Breakdown (5 categories per supplier)
   • Financial Exposure Analysis
   • Risk Factor Details
   • Mitigation Action Tracker (${suppliers.reduce((sum, s) => sum + s.mitigationActions, 0)} total actions)
   • Trend Analysis (6-month history)
   • Supplier Comparison Matrix
   • Risk Distribution Charts

   Features:
   ✓ Pivot tables for custom analysis
   ✓ Conditional formatting and color coding
   ✓ Filterable and sortable data
   ✓ Interactive dashboards
   ✓ Formula-driven calculations

3. RISK REGISTER (CSV)
   File: Supplier_Risk_Register_${new Date().toISOString().split('T')[0]}.csv

   Columns:
   • Supplier ID, Name, Code
   • Overall Risk Score and Level
   • Financial, Operational, Compliance, Geopolitical, Cyber scores
   • Total Spend, Spend at Risk
   • Last Assessment, Next Review dates
   • Active Mitigation Actions
   • Risk Owner, Approval Status

   Use Case: Import into risk management systems, databases
   Records: ${totalSuppliers} suppliers

4. COMPLIANCE REPORT (Word/PDF)
   File: Supplier_Risk_Compliance_Report_${new Date().toISOString().split('T')[0]}.docx

   Sections:
   • Regulatory Compliance Overview
   • ISO/Certification Status by Supplier
   • Environmental Compliance Assessment
   • Labor Standards Evaluation
   • Audit Findings and Corrective Actions
   • Non-Compliance Risk Exposure
   • Remediation Plans and Timelines

   Audience: Compliance officers, auditors, regulators
   Pages: 25-35 pages with evidence attachments

5. MANAGEMENT DASHBOARD (PowerPoint)
   File: Supplier_Risk_Dashboard_${new Date().toISOString().split('T')[0]}.pptx

   Slides:
   • Portfolio Risk Summary (1 slide)
   • Risk Distribution by Category (1 slide)
   • Top Risk Suppliers - Critical & High (2 slides)
   • Financial Exposure Analysis (1 slide)
   • Risk Trends - QoQ Comparison (1 slide)
   • Mitigation Actions Status (1 slide)
   • Recommendations and Next Steps (1 slide)

   Audience: Procurement leadership, management meetings
   Format: Executive-ready presentation

6. API DATA EXPORT (JSON)
   File: supplier_risk_data_${new Date().toISOString().split('T')[0]}.json

   Structure:
   • Complete supplier risk profiles
   • Risk factor breakdowns with weights
   • Historical assessment data
   • Mitigation action details
   • Metadata and timestamps

   Use Case: Integration with BI tools, risk systems, analytics platforms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORT STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Distribution:
• Critical Risk: ${criticalCount} suppliers (${((criticalCount/totalSuppliers)*100).toFixed(1)}%)
• High Risk: ${highCount} suppliers (${((highCount/totalSuppliers)*100).toFixed(1)}%)
• Medium Risk: ${mediumCount} suppliers (${((mediumCount/totalSuppliers)*100).toFixed(1)}%)
• Low Risk: ${lowCount} suppliers (${((lowCount/totalSuppliers)*100).toFixed(1)}%)

Financial Exposure:
• Total Portfolio Spend: $${(suppliers.reduce((sum, s) => sum + s.totalSpend, 0) / 1000000).toFixed(2)}M
• Total Spend at Risk: $${(totalSpendAtRisk / 1000000).toFixed(2)}M
• Average Risk Score: ${(suppliers.reduce((sum, s) => sum + s.overallRiskScore, 0) / totalSuppliers).toFixed(1)}

Top Risk Categories (Avg Scores):
• Financial: ${(suppliers.reduce((sum, s) => sum + s.financialRisk, 0) / totalSuppliers).toFixed(1)}
• Operational: ${(suppliers.reduce((sum, s) => sum + s.operationalRisk, 0) / totalSuppliers).toFixed(1)}
• Compliance: ${(suppliers.reduce((sum, s) => sum + s.complianceRisk, 0) / totalSuppliers).toFixed(1)}
• Geopolitical: ${(suppliers.reduce((sum, s) => sum + s.geopoliticalRisk, 0) / totalSuppliers).toFixed(1)}
• Cybersecurity: ${(suppliers.reduce((sum, s) => sum + s.cyberSecurityRisk, 0) / totalSuppliers).toFixed(1)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPORT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Export single format
☐ Export all formats as package
☐ Schedule recurring exports (weekly/monthly)
☐ Email to distribution list
☐ Upload to shared drive/portal
☐ Trigger automated workflows

DISTRIBUTION OPTIONS:
☐ Procurement team (internal)
☐ Risk management department
☐ Finance/CFO office
☐ Executive leadership
☐ External auditors (compliance reports only)
☐ Board of directors (executive summary only)

SECURITY SETTINGS:
• Password protection: [Enabled/Disabled]
• Watermark: "Confidential - Internal Use Only"
• Access expiration: 90 days
• Print restrictions: Yes
• Download tracking: Enabled

Click 'Generate Report' to create selected export formats.
Processing time: 30-60 seconds per format.`);
  };

  const handleRefresh = () => {
    console.log('Refreshing risk scoring data...');

    alert(`Refresh Supplier Risk Scoring Data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA REFRESH OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiating comprehensive data refresh for all supplier risk profiles...

DATA SOURCES TO SYNC:
✓ Supplier master data (ERP system)
✓ Financial risk scores (credit bureau APIs)
✓ Operational performance metrics (procurement system)
✓ Compliance certifications (compliance database)
✓ Geopolitical risk indices (external data feeds)
✓ Cybersecurity assessments (security platform)
✓ Spend data (financial systems)
✓ Contract information (contract management)
✓ Recent incidents/issues (ticketing system)
✓ Mitigation action status (project tracking)

REFRESH PROCESS:
1. Connect to data sources
2. Pull latest updates (last 24 hours)
3. Validate data integrity
4. Recalculate risk scores
5. Update risk levels
6. Refresh visualizations
7. Trigger notifications for significant changes
8. Update dashboards and reports

ESTIMATED TIME:
• Quick Refresh (scores only): 15 seconds
• Standard Refresh (all data): 45 seconds
• Deep Refresh (with recalculation): 2-3 minutes

SUPPLIERS BEING REFRESHED:
${suppliers.length} active supplier risk profiles

RECENT UPDATES DETECTED:
• 2 suppliers with new financial statements
• 1 supplier certification expired
• 3 suppliers with updated operational metrics
• 1 geopolitical risk index change (region-wide)
• 0 new cybersecurity incidents

NOTIFICATION ALERTS:
System will automatically notify stakeholders if:
• Any supplier moves to Critical risk level
• Risk score increases by >15 points
• Spend at risk increases by >$500K
• Major compliance violations detected
• Emergency risk review needed

LAST REFRESH: ${new Date(Date.now() - Math.random() * 3600000).toLocaleString()}
REFRESH FREQUENCY: Every 6 hours (automated)
NEXT SCHEDULED REFRESH: ${new Date(Date.now() + 21600000).toLocaleString()}

Click 'Refresh Now' to manually trigger immediate data sync.
Or enable 'Auto-Refresh' for real-time updates every 15 minutes.`);
  };

  const handleSettings = () => {
    console.log('Opening risk scoring settings...');

    alert(`Supplier Risk Scoring Settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIGURATION MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. RISK SCORING METHODOLOGY

   Current Weights:
   • Financial Risk: 25%
   • Operational Risk: 25%
   • Compliance Risk: 20%
   • Geopolitical Risk: 15%
   • Cybersecurity Risk: 15%

   Options:
   ☐ Use industry standard weights
   ☐ Customize weights by industry/category
   ☐ Enable dynamic weighting based on context
   ☐ Set minimum thresholds per category

   Risk Level Thresholds:
   • Low: 0-30 points
   • Medium: 31-60 points
   • High: 61-80 points
   • Critical: 81-100 points

   ☐ Adjust threshold boundaries
   ☐ Add custom risk levels

2. ASSESSMENT FREQUENCY

   Standard Schedule:
   • Low Risk: Annual full assessment
   • Medium Risk: Quarterly assessment
   • High Risk: Monthly assessment
   • Critical Risk: Weekly monitoring

   Custom Triggers:
   ☐ Spend threshold ($1M+ = more frequent)
   ☐ Strategic supplier designation
   ☐ Sole source suppliers
   ☐ New supplier probation period (first year)

   Automated Alerts:
   ☐ 30 days before next assessment due
   ☐ When assessment is overdue
   ☐ When risk score changes >10 points

3. DATA SOURCE CONFIGURATION

   Internal Systems:
   ☐ ERP system integration (SAP, Oracle, etc.)
   ☐ Procurement/SRM platform
   ☐ Financial management system
   ☐ Compliance management database
   ☐ Contract lifecycle management
   ☐ Supplier portal

   External Data Feeds:
   ☐ Credit rating agencies (D&B, Experian, etc.)
   ☐ Geopolitical risk indices
   ☐ Cybersecurity threat intelligence
   ☐ News and media monitoring
   ☐ Regulatory compliance databases
   ☐ Industry benchmarking data

   API Configurations:
   • Connection status monitoring
   • Authentication and security
   • Data refresh intervals
   • Error handling and fallbacks

4. RISK FACTOR DEFINITIONS

   Financial Risk Metrics:
   ☐ Credit rating weight and scoring
   ☐ Financial ratio thresholds
   ☐ Payment history evaluation
   ☐ Revenue and profitability trends
   ☐ Cash flow analysis parameters

   Operational Risk Metrics:
   ☐ Quality performance KPIs
   ☐ Delivery performance standards
   ☐ Capacity utilization thresholds
   ☐ Lead time variability limits
   ☐ Single source dependency scoring

   Compliance Risk Metrics:
   ☐ Required certifications checklist
   ☐ Violation severity scoring
   ☐ Audit frequency requirements
   ☐ Environmental standards
   ☐ Labor and ethics standards

   Geopolitical Risk Metrics:
   ☐ Country risk index sources
   ☐ Trade policy impact assessment
   ☐ Currency volatility thresholds
   ☐ Conflict/instability indicators
   ☐ Sanctions screening parameters

   Cybersecurity Risk Metrics:
   ☐ Required security certifications
   ☐ Incident history evaluation
   ☐ Security control assessment criteria
   ☐ Vendor management requirements
   ☐ Data protection standards

5. NOTIFICATION AND ESCALATION

   Alert Recipients:
   • Procurement team: [email list]
   • Risk management: [email list]
   • Category managers: [email list]
   • Executive leadership: [email list]

   Escalation Rules:
   ☐ Critical risk → Immediate email + SMS to execs
   ☐ High risk → Daily digest to procurement director
   ☐ Risk increase >20 points → Alert category manager
   ☐ Spend at risk >$1M → CFO notification
   ☐ Compliance violation → Legal team alert

   Notification Preferences:
   ☐ Email alerts
   ☐ In-app notifications
   ☐ SMS for critical alerts
   ☐ Weekly summary reports
   ☐ Monthly executive briefings

6. MITIGATION WORKFLOW

   Action Requirements:
   ☐ Mandatory mitigation plan for High/Critical risk
   ☐ Action owner assignment required
   ☐ Due dates and milestones tracking
   ☐ Progress updates and status reporting
   ☐ Approval workflow for plan completion

   Template Library:
   • Financial risk mitigation templates
   • Operational continuity plans
   • Compliance remediation plans
   • Contingency sourcing strategies
   • Insurance and contract protection

7. REPORTING AND ANALYTICS

   Standard Reports:
   ☐ Executive risk dashboard (weekly)
   ☐ Risk register (monthly)
   ☐ Trend analysis (quarterly)
   ☐ Supplier risk benchmarking (annual)

   Custom Report Builder:
   • Select metrics and dimensions
   • Choose visualization types
   • Set report schedule
   • Define distribution lists

   Data Retention:
   • Assessment history: 5 years
   • Score changes: 3 years
   • Archived reports: 7 years

8. ACCESS CONTROL AND PERMISSIONS

   User Roles:
   • Risk Analyst: View all, edit assessments
   • Procurement Manager: View all, approve changes
   • Category Manager: View assigned suppliers only
   • Executive: View summaries and dashboards
   • Auditor: Read-only access to all data

   Permissions Matrix:
   ☐ View risk scores: [All users]
   ☐ Edit risk scores: [Risk analysts, managers]
   ☐ Override calculations: [Risk manager only]
   ☐ Access financial data: [Approved users only]
   ☐ Export reports: [Manager level and above]
   ☐ Configure settings: [System admin only]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Save changes and apply immediately
☐ Save as draft (review before applying)
☐ Reset to default settings
☐ Export configuration (backup)
☐ Schedule configuration changes for specific date

Select settings categories to configure, or choose 'Guided Setup' for step-by-step configuration wizard.`);
  };

  const handleViewSupplierProfile = (supplier: SupplierRisk) => {
    console.log('Viewing supplier profile:', supplier.id);

    alert(`Supplier Risk Profile: ${supplier.supplierName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER IDENTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier Name: ${supplier.supplierName}
Supplier Code: ${supplier.code}
Risk Profile ID: ${supplier.id}
Status: Active Supplier

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Risk Score: ${supplier.overallRiskScore}/100
Risk Level: ${supplier.riskLevel.toUpperCase()} ${
  supplier.riskLevel === 'critical' ? '⚠ CRITICAL' :
  supplier.riskLevel === 'high' ? '⚠ HIGH' :
  supplier.riskLevel === 'medium' ? 'ℹ MEDIUM' :
  '✓ LOW'
}

Risk Trend: ${
  supplier.overallRiskScore > 70 ? 'Increasing (monitoring required)' :
  supplier.overallRiskScore > 50 ? 'Stable' :
  'Improving'
}

Last Assessment: ${supplier.lastAssessment}
Assessment Status: ${new Date(supplier.nextReview) < new Date() ? '⚠ OVERDUE' : 'Current'}
Next Review: ${supplier.nextReview}
Days Until Review: ${Math.ceil((new Date(supplier.nextReview).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAILED RISK SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Financial Risk: ${supplier.financialRisk}/100 (Weight: 25%)
├─ Credit Rating: ${supplier.financialRisk > 70 ? 'B or below' : supplier.financialRisk > 40 ? 'BBB' : 'A or above'}
├─ Financial Stability: ${supplier.financialRisk > 70 ? 'Concerning' : supplier.financialRisk > 40 ? 'Stable' : 'Strong'}
└─ Payment History: ${supplier.financialRisk > 70 ? 'Multiple delays' : supplier.financialRisk > 40 ? 'Occasional delays' : 'On-time'}

Operational Risk: ${supplier.operationalRisk}/100 (Weight: 25%)
├─ Quality Performance: ${supplier.operationalRisk > 70 ? 'Below standard' : supplier.operationalRisk > 40 ? 'Acceptable' : 'Excellent'}
├─ Delivery Performance: ${supplier.operationalRisk > 70 ? '<85% OTD' : supplier.operationalRisk > 40 ? '85-95% OTD' : '>95% OTD'}
└─ Capacity: ${supplier.operationalRisk > 70 ? 'Overextended' : supplier.operationalRisk > 40 ? 'High utilization' : 'Adequate'}

Compliance Risk: ${supplier.complianceRisk}/100 (Weight: 20%)
├─ Certifications: ${supplier.complianceRisk > 70 ? 'Expired/None' : supplier.complianceRisk > 40 ? 'Expiring soon' : 'Current'}
├─ Regulatory Status: ${supplier.complianceRisk > 70 ? 'Violations' : supplier.complianceRisk > 40 ? 'Minor issues' : 'Compliant'}
└─ Audit Results: ${supplier.complianceRisk > 70 ? 'Failed' : supplier.complianceRisk > 40 ? 'Conditional pass' : 'Passed'}

Geopolitical Risk: ${supplier.geopoliticalRisk}/100 (Weight: 15%)
├─ Location Risk: ${supplier.geopoliticalRisk > 70 ? 'High risk region' : supplier.geopoliticalRisk > 40 ? 'Moderate risk' : 'Stable region'}
├─ Trade Exposure: ${supplier.geopoliticalRisk > 70 ? 'High tariffs/restrictions' : supplier.geopoliticalRisk > 40 ? 'Some exposure' : 'Minimal'}
└─ Political Stability: ${supplier.geopoliticalRisk > 70 ? 'Unstable' : supplier.geopoliticalRisk > 40 ? 'Some uncertainty' : 'Stable'}

Cybersecurity Risk: ${supplier.cyberSecurityRisk}/100 (Weight: 15%)
├─ Security Posture: ${supplier.cyberSecurityRisk > 70 ? 'Weak' : supplier.cyberSecurityRisk > 40 ? 'Basic' : 'Strong'}
├─ Certifications: ${supplier.cyberSecurityRisk > 70 ? 'None' : supplier.cyberSecurityRisk > 40 ? 'Basic' : 'SOC 2, ISO 27001'}
└─ Incident History: ${supplier.cyberSecurityRisk > 70 ? 'Recent breach' : supplier.cyberSecurityRisk > 40 ? 'Past incident' : 'Clean record'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL EXPOSURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Annual Spend: $${(supplier.totalSpend / 1000000).toFixed(2)}M
Spend at Risk: $${(supplier.spendAtRisk / 1000000).toFixed(2)}M
Risk Percentage: ${((supplier.spendAtRisk / supplier.totalSpend) * 100).toFixed(1)}%
Risk-Adjusted Exposure: $${(supplier.spendAtRisk * supplier.overallRiskScore / 100 / 1000000).toFixed(2)}M

Spend Category: ${supplier.totalSpend > 2000000 ? 'Strategic' : supplier.totalSpend > 1000000 ? 'Major' : 'Standard'}
Business Impact: ${supplier.totalSpend > 2000000 ? 'Critical - High business impact' : supplier.totalSpend > 1000000 ? 'Significant' : 'Moderate'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MITIGATION ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Mitigation Plans: ${supplier.mitigationActions}
Status: ${supplier.mitigationActions > 0 ? 'In Progress' : 'None Required'}

${supplier.mitigationActions > 0 ? `
Current Actions:
${Array.from({length: Math.min(supplier.mitigationActions, 5)}, (_, i) =>
  `${i + 1}. ${
    ['Diversify sourcing - identify backup supplier',
     'Increase inventory safety stock by 20%',
     'Quarterly financial health monitoring',
     'Require additional insurance/bonding',
     'Enhanced contract protection clauses'][i % 5]
  }
   Owner: ${['Procurement Manager', 'Supply Chain', 'Risk Manager', 'Legal', 'Category Manager'][i % 5]}
   Due: ${new Date(Date.now() + (30 + i * 15) * 24 * 60 * 60 * 1000).toLocaleDateString()}
   Status: ${['In Progress', 'Pending', 'In Progress', 'Complete', 'In Progress'][i % 5]}`
).join('\n\n')}
${supplier.mitigationActions > 5 ? `\n...and ${supplier.mitigationActions - 5} more actions` : ''}
` : 'No active mitigation actions required at this risk level.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK HISTORY (Last 6 Months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Array.from({length: 6}, (_, i) => {
  const monthDate = new Date();
  monthDate.setMonth(monthDate.getMonth() - (5 - i));
  const variation = Math.floor(Math.random() * 10) - 5;
  const score = Math.max(0, Math.min(100, supplier.overallRiskScore + variation));
  return `${monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}: ${score}/100`;
}).join(' → ')}

Trend: ${supplier.overallRiskScore > 70 ? '↗ Increasing risk' : supplier.overallRiskScore > 50 ? '→ Stable' : '↘ Decreasing risk'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECENT ACTIVITY LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${new Date(supplier.lastAssessment).toLocaleDateString()}: Risk assessment completed
${new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${supplier.operationalRisk > 60 ? 'Quality issue reported and resolved' : 'Performance review - meeting standards'}
${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${supplier.complianceRisk > 60 ? 'Compliance audit - corrective actions required' : 'Compliance audit passed'}
${new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString()}: Spend data updated
${new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${supplier.financialRisk > 60 ? 'Credit rating downgrade noted' : 'Financial review completed'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED NEXT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplier.riskLevel === 'critical' ?
`⚠ CRITICAL RISK ACTIONS REQUIRED:
☐ Schedule emergency risk review within 3 days
☐ Notify executive leadership immediately
☐ Implement enhanced monitoring (daily)
☐ Activate contingency sourcing plan
☐ Review contract termination clauses
☐ Consider sourcing restrictions or suspension` :
supplier.riskLevel === 'high' ?
`⚠ HIGH RISK ACTIONS RECOMMENDED:
☐ Schedule risk review within 15 days
☐ Increase monitoring to weekly
☐ Update/create mitigation action plan
☐ Identify alternative supplier options
☐ Review and enhance contract protections
☐ Monthly management review` :
supplier.riskLevel === 'medium' ?
`ℹ MEDIUM RISK STANDARD ACTIONS:
☐ Continue quarterly assessments
☐ Monitor KPIs monthly
☐ Maintain current mitigation actions
☐ Annual supplier business review
☐ Update risk profile as changes occur` :
`✓ LOW RISK ROUTINE ACTIONS:
☐ Annual risk assessment sufficient
☐ Standard quarterly monitoring
☐ Maintain preferred supplier status
☐ Continue relationship development
☐ Document any significant changes`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Assess Risk Now] [Update Scores] [View Risk Factors]
[Create Mitigation Plan] [Schedule Review] [Export Profile]
[Contact Supplier] [View Contract] [Audit History]

Risk Owner: Risk Management Team
Category Manager: [Assigned manager name]
Last Updated: ${new Date().toLocaleString()}`);
  };

  const handleGenerateRiskMatrix = () => {
    console.log('Generating risk matrix...');

    alert(`Generate Supplier Risk Matrix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK MATRIX OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A risk matrix provides a visual representation of suppliers positioned by:
• Horizontal Axis: Spend/Business Impact ($)
• Vertical Axis: Risk Score (0-100)
• Bubble Size: Mitigation action complexity

This helps identify:
✓ High-risk, high-spend suppliers (priority focus)
✓ Strategic supplier risk distribution
✓ Portfolio risk concentration
✓ Resource allocation priorities

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MATRIX QUADRANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUADRANT 1: High Risk, High Spend (Critical Priority)
Suppliers: ${suppliers.filter(s => s.overallRiskScore > 60 && s.totalSpend > 1500000).map(s => s.supplierName).join(', ') || 'None'}

Action Required:
• Immediate executive attention
• Comprehensive mitigation strategies
• Dual sourcing implementation
• Enhanced monitoring and controls
• Contract renegotiation with risk protections

QUADRANT 2: High Risk, Low Spend (Monitor)
Suppliers: ${suppliers.filter(s => s.overallRiskScore > 60 && s.totalSpend <= 1500000).map(s => s.supplierName).join(', ') || 'None'}

Action Required:
• Consider replacement suppliers
• Increase monitoring frequency
• Standard mitigation actions
• May consider consolidation

QUADRANT 3: Low Risk, High Spend (Strategic Partners)
Suppliers: ${suppliers.filter(s => s.overallRiskScore <= 60 && s.totalSpend > 1500000).map(s => s.supplierName).join(', ') || 'None'}

Action Required:
• Maintain strong relationships
• Routine monitoring
• Strategic partnership development
• Long-term contracts
• Innovation collaboration

QUADRANT 4: Low Risk, Low Spend (Routine Management)
Suppliers: ${suppliers.filter(s => s.overallRiskScore <= 60 && s.totalSpend <= 1500000).map(s => s.supplierName).join(', ') || 'None'}

Action Required:
• Standard procurement processes
• Annual review sufficient
• Consider consolidation opportunities
• Minimal management overhead

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MATRIX DATA POINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${suppliers.map(s =>
  `${s.supplierName}:
   • Risk Score: ${s.overallRiskScore} | Spend: $${(s.totalSpend/1000000).toFixed(1)}M
   • Position: ${s.overallRiskScore > 60 ? 'High Risk' : 'Low Risk'}, ${s.totalSpend > 1500000 ? 'High Spend' : 'Low Spend'}
   • Priority: ${s.overallRiskScore > 60 && s.totalSpend > 1500000 ? '⚠ CRITICAL' :
                s.overallRiskScore > 60 ? 'Monitor' :
                s.totalSpend > 1500000 ? 'Strategic' : 'Routine'}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Concentration:
• ${((suppliers.filter(s => s.overallRiskScore > 60 && s.totalSpend > 1500000).reduce((sum, s) => sum + s.totalSpend, 0) / suppliers.reduce((sum, s) => sum + s.totalSpend, 0)) * 100).toFixed(1)}% of spend is High Risk + High Spend
• ${suppliers.filter(s => s.overallRiskScore > 60 && s.totalSpend > 1500000).length} critical suppliers need immediate attention
• $${(suppliers.filter(s => s.overallRiskScore > 60 && s.totalSpend > 1500000).reduce((sum, s) => sum + s.spendAtRisk, 0) / 1000000).toFixed(2)}M in high-priority risk exposure

Portfolio Balance:
• Strategic Low-Risk Suppliers: ${suppliers.filter(s => s.overallRiskScore <= 60 && s.totalSpend > 1500000).length}
• Total Low-Risk Suppliers: ${suppliers.filter(s => s.overallRiskScore <= 60).length}
• Suppliers needing mitigation: ${suppliers.filter(s => s.mitigationActions > 0).length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MATRIX EXPORT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual Formats:
☐ Interactive HTML chart with drill-down
☐ PowerPoint slide with matrix visualization
☐ High-resolution PNG image
☐ PDF report with matrix and analysis

Data Formats:
☐ Excel with matrix data and pivot tables
☐ CSV for external analysis tools
☐ JSON for dashboard integration

Customization:
☐ Adjust quadrant thresholds
☐ Color code by risk category
☐ Add supplier labels to bubbles
☐ Include trend arrows (risk direction)
☐ Filter by category or region

Click 'Generate Matrix' to create risk matrix visualization.`);
  };

  const handleScheduleReview = (supplier: SupplierRisk) => {
    console.log('Scheduling risk review for supplier:', supplier.id);

    const daysUntilReview = Math.ceil((new Date(supplier.nextReview).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilReview < 0;

    alert(`Schedule Risk Review: ${supplier.supplierName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVIEW SCHEDULING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier: ${supplier.supplierName}
Code: ${supplier.code}
Current Risk Level: ${supplier.riskLevel.toUpperCase()}
Current Risk Score: ${supplier.overallRiskScore}/100

Last Assessment: ${supplier.lastAssessment}
Next Scheduled Review: ${supplier.nextReview}
Status: ${isOverdue ? '⚠ OVERDUE by ' + Math.abs(daysUntilReview) + ' days' :
           daysUntilReview <= 7 ? '⚠ Due within ' + daysUntilReview + ' days' :
           '✓ Scheduled in ' + daysUntilReview + ' days'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVIEW TYPE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. QUICK REFRESH (30 minutes)
   Scope:
   • Update risk scores based on latest data
   • Review recent performance metrics
   • Check for any major changes
   • Validate existing mitigation actions

   Recommended for: Low risk suppliers with no significant changes
   Frequency: Quarterly to Annual

2. STANDARD ASSESSMENT (2-4 hours)
   Scope:
   • Comprehensive risk category evaluation
   • Data collection from multiple sources
   • Stakeholder interviews (procurement, quality)
   • Risk score recalculation
   • Mitigation plan review and update
   • Documentation and reporting

   Recommended for: Medium risk suppliers, scheduled reviews
   Frequency: Quarterly to Semi-Annual

3. DETAILED AUDIT (1-2 days)
   Scope:
   • In-depth analysis of all risk factors
   • Supplier site visit (if applicable)
   • Financial deep-dive with latest statements
   • Operational capability assessment
   • Compliance certification verification
   • Cybersecurity posture evaluation
   • Third-party data validation
   • Comprehensive mitigation strategy
   • Executive report and recommendations

   Recommended for: High/Critical risk, strategic suppliers, major changes
   Frequency: Monthly to Quarterly

4. EMERGENCY REVIEW (Within 24-48 hours)
   Scope:
   • Rapid response to significant event
   • Immediate risk level reassessment
   • Containment and mitigation actions
   • Stakeholder communication
   • Contingency plan activation

   Triggers: Major incident, bankruptcy filing, regulatory action, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED REVIEW TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on current profile:
${supplier.riskLevel === 'critical' ?
'✓ DETAILED AUDIT recommended
  Reason: Critical risk level requires comprehensive evaluation
  Urgency: Schedule within 5 business days' :
supplier.riskLevel === 'high' ?
'✓ DETAILED AUDIT or STANDARD ASSESSMENT
  Reason: High risk level needs thorough review
  Urgency: Schedule within 15 business days' :
supplier.riskLevel === 'medium' ?
'✓ STANDARD ASSESSMENT recommended
  Reason: Medium risk, routine comprehensive review appropriate
  Urgency: Schedule within 30 days' :
'✓ QUICK REFRESH or STANDARD ASSESSMENT
  Reason: Low risk, standard review cycle
  Urgency: Schedule within 90 days'}

${isOverdue ? '⚠ OVERDUE NOTICE: Review is past due. Please prioritize scheduling immediately.' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEDULING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Review Date: [Select Date]
Suggested: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Review Time: [Select Time]
Duration: ${supplier.riskLevel === 'critical' || supplier.riskLevel === 'high' ? '4-8 hours (Detailed)' :
            supplier.riskLevel === 'medium' ? '2-4 hours (Standard)' :
            '30-60 minutes (Quick)'}

Review Team:
☐ Risk Analyst (Required)
☐ Category Manager (Required)
☐ Procurement Manager (${supplier.riskLevel === 'high' || supplier.riskLevel === 'critical' ? 'Required' : 'Optional'})
☐ Quality Engineer (For operational risk review)
☐ Compliance Officer (For compliance risk review)
☐ Finance Representative (For financial risk review)
☐ IT Security (For cybersecurity risk review)
☐ Executive Sponsor (For critical/strategic suppliers)

Supplier Participation:
☐ Request supplier data submission (2 weeks before)
☐ Schedule supplier interview/presentation
☐ Plan supplier site visit (if applicable)
☐ Supplier Q&A session

Pre-Review Preparation:
☐ Gather latest financial statements
☐ Pull performance metrics (quality, delivery, etc.)
☐ Review contract terms and compliance status
☐ Check certification expiration dates
☐ Compile geopolitical/market intelligence
☐ Review cybersecurity assessment results
☐ Summarize recent incidents or issues
☐ Review current mitigation action status

Post-Review Actions:
☐ Update risk scores in system
☐ Generate assessment report
☐ Update mitigation action plan
☐ Schedule follow-up reviews
☐ Communicate results to stakeholders
☐ Update supplier portal (if applicable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CALENDAR INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Send calendar invites to review team
☐ Block time for pre-review preparation
☐ Set reminders:
  • 2 weeks before: Request supplier data
  • 1 week before: Confirm attendance
  • 1 day before: Send review agenda
☐ Add to risk review master calendar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTIFICATION SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Notify:
☐ Review team members
☐ Supplier contact (if supplier participation required)
☐ Category manager
☐ Procurement leadership (for high/critical risk)
☐ Risk management team

Reminder Schedule:
☐ 2 weeks before review
☐ 1 week before review
☐ 1 day before review
☐ Day of review (morning reminder)

Click 'Schedule Review' to confirm and send invitations.
Or 'Add to Calendar' to manually manage scheduling.`);
  };

  const handleCompareSuppliers = () => {
    console.log('Opening supplier comparison...');

    alert(`Compare Supplier Risk Profiles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER COMPARISON TOOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Compare up to 4 suppliers side-by-side to:
• Evaluate relative risk levels
• Assess sourcing alternatives
• Support dual-source decisions
• Benchmark performance
• Inform supplier selection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selected Suppliers:
1. ${suppliers[0]?.supplierName || 'Supplier A'}
2. ${suppliers[1]?.supplierName || 'Supplier B'}
3. ${suppliers[2]?.supplierName || 'Supplier C'}

Comparison Metric                 | Supplier 1 | Supplier 2 | Supplier 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Risk Score               | ${suppliers[0]?.overallRiskScore || 'N/A'}        | ${suppliers[1]?.overallRiskScore || 'N/A'}        | ${suppliers[2]?.overallRiskScore || 'N/A'}
Risk Level                       | ${suppliers[0]?.riskLevel || 'N/A'}      | ${suppliers[1]?.riskLevel || 'N/A'}      | ${suppliers[2]?.riskLevel || 'N/A'}
Financial Risk                   | ${suppliers[0]?.financialRisk || 'N/A'}        | ${suppliers[1]?.financialRisk || 'N/A'}        | ${suppliers[2]?.financialRisk || 'N/A'}
Operational Risk                 | ${suppliers[0]?.operationalRisk || 'N/A'}        | ${suppliers[1]?.operationalRisk || 'N/A'}        | ${suppliers[2]?.operationalRisk || 'N/A'}
Compliance Risk                  | ${suppliers[0]?.complianceRisk || 'N/A'}        | ${suppliers[1]?.complianceRisk || 'N/A'}        | ${suppliers[2]?.complianceRisk || 'N/A'}
Geopolitical Risk                | ${suppliers[0]?.geopoliticalRisk || 'N/A'}        | ${suppliers[1]?.geopoliticalRisk || 'N/A'}        | ${suppliers[2]?.geopoliticalRisk || 'N/A'}
Cybersecurity Risk               | ${suppliers[0]?.cyberSecurityRisk || 'N/A'}        | ${suppliers[1]?.cyberSecurityRisk || 'N/A'}        | ${suppliers[2]?.cyberSecurityRisk || 'N/A'}
Annual Spend                     | $${((suppliers[0]?.totalSpend || 0)/1000000).toFixed(1)}M    | $${((suppliers[1]?.totalSpend || 0)/1000000).toFixed(1)}M    | $${((suppliers[2]?.totalSpend || 0)/1000000).toFixed(1)}M
Spend at Risk                    | $${((suppliers[0]?.spendAtRisk || 0)/1000000).toFixed(1)}M    | $${((suppliers[1]?.spendAtRisk || 0)/1000000).toFixed(1)}M    | $${((suppliers[2]?.spendAtRisk || 0)/1000000).toFixed(1)}M
Active Mitigation Actions        | ${suppliers[0]?.mitigationActions || '0'}         | ${suppliers[1]?.mitigationActions || '0'}         | ${suppliers[2]?.mitigationActions || '0'}
Last Assessment                  | ${suppliers[0]?.lastAssessment || 'N/A'}   | ${suppliers[1]?.lastAssessment || 'N/A'}   | ${suppliers[2]?.lastAssessment || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARATIVE INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lowest Overall Risk:
${suppliers.reduce((min, s) => s.overallRiskScore < (min?.overallRiskScore || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}
(Score: ${suppliers.reduce((min, s) => s.overallRiskScore < (min?.overallRiskScore || 999) ? s : min, suppliers[0])?.overallRiskScore || 'N/A'})

Highest Overall Risk:
${suppliers.reduce((max, s) => s.overallRiskScore > (max?.overallRiskScore || 0) ? s : max, suppliers[0])?.supplierName || 'N/A'}
(Score: ${suppliers.reduce((max, s) => s.overallRiskScore > (max?.overallRiskScore || 0) ? s : max, suppliers[0])?.overallRiskScore || 'N/A'})

Best Financial Health:
${suppliers.reduce((min, s) => s.financialRisk < (min?.financialRisk || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}

Best Operational Performance:
${suppliers.reduce((min, s) => s.operationalRisk < (min?.operationalRisk || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}

Strongest Compliance:
${suppliers.reduce((min, s) => s.complianceRisk < (min?.complianceRisk || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}

Lowest Geopolitical Exposure:
${suppliers.reduce((min, s) => s.geopoliticalRisk < (min?.geopoliticalRisk || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}

Best Cybersecurity Posture:
${suppliers.reduce((min, s) => s.cyberSecurityRisk < (min?.cyberSecurityRisk || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCING RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Supplier Recommendation:
${suppliers.reduce((min, s) => s.overallRiskScore < (min?.overallRiskScore || 999) ? s : min, suppliers[0])?.supplierName || 'N/A'}
Reason: Lowest overall risk with ${suppliers.reduce((min, s) => s.overallRiskScore < (min?.overallRiskScore || 999) ? s : min, suppliers[0])?.riskLevel || 'N/A'} risk level

Backup/Dual Source Option:
${suppliers.filter(s => s.riskLevel !== 'critical' && s.riskLevel !== 'high')[1]?.supplierName || 'Consider additional suppliers'}
Reason: ${suppliers.filter(s => s.riskLevel !== 'critical' && s.riskLevel !== 'high')[1] ? 'Acceptable risk level for diversification' : 'Insufficient low-risk alternatives'}

Risk Diversification Strategy:
${suppliers.filter(s => s.riskLevel === 'low' || s.riskLevel === 'medium').length >= 2 ?
`✓ Split volume between ${suppliers.filter(s => s.riskLevel === 'low' || s.riskLevel === 'medium').slice(0, 2).map(s => s.supplierName).join(' and ')}
  This provides redundancy and reduces concentration risk.` :
`⚠ Limited low-risk options available.
  Consider additional supplier qualification or enhanced mitigation strategies.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARISON ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Export comparison table (Excel/PDF)
☐ Generate side-by-side charts
☐ Add more suppliers to comparison
☐ Filter by specific risk categories
☐ Save comparison for future reference
☐ Share with sourcing team
☐ Create sourcing recommendation report

CUSTOM COMPARISON BUILDER:
Select suppliers: [Dropdown multi-select]
Choose metrics: [Checkbox list of all available metrics]
View type: [Table | Chart | Dashboard]
Export format: [Excel | PDF | PowerPoint]

Click 'Build Custom Comparison' to create your own supplier analysis.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Supplier Risk Scoring</h2>
              <p className="text-blue-100">Risk assessment, monitoring, and mitigation tracking</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateRiskMatrix}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Generate Risk Matrix"
            >
              <Activity className="h-4 w-4" />
              <span>Risk Matrix</span>
            </button>
            <button
              onClick={handleCompareSuppliers}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Compare Suppliers"
            >
              <FileText className="h-4 w-4" />
              <span>Compare</span>
            </button>
            <button
              onClick={handleExportRiskReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Export Report"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Risk Scoring Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'low').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'medium').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'high').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.riskLevel === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Spend at Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(suppliers.reduce((sum, s) => sum + s.spendAtRisk, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Supplier Risk Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Supplier Risk Profiles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Overall Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Financial</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Operational</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Geopolitical</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cyber</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Spend at Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mitigations</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.supplierName}</div>
                      <div className="text-xs text-gray-500">{supplier.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            supplier.overallRiskScore <= 30 ? 'bg-green-500' :
                            supplier.overallRiskScore <= 60 ? 'bg-yellow-500' :
                            supplier.overallRiskScore <= 80 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${supplier.overallRiskScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getRiskScoreColor(supplier.overallRiskScore)}`}>
                        {supplier.overallRiskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(supplier.riskLevel)}`}>
                      {supplier.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.financialRisk)}`}>{supplier.financialRisk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.operationalRisk)}`}>{supplier.operationalRisk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.complianceRisk)}`}>{supplier.complianceRisk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.geopoliticalRisk)}`}>{supplier.geopoliticalRisk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getRiskScoreColor(supplier.cyberSecurityRisk)}`}>{supplier.cyberSecurityRisk}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(supplier.totalSpend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    ${(supplier.spendAtRisk / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {supplier.mitigationActions} actions
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAssessRisk(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                        title="Assess Risk"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">Assess</span>
                      </button>
                      <button
                        onClick={() => handleUpdateRiskScore(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                        title="Update Risk Score"
                      >
                        <RefreshCw className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700">Update</span>
                      </button>
                      <button
                        onClick={() => handleViewRiskFactors(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                        title="View Risk Factors"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Factors</span>
                      </button>
                      <button
                        onClick={() => handleExportRiskReport()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-sm transition-colors"
                        title="Export Risk Report"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-700">Export</span>
                      </button>
                      <button
                        onClick={() => handleScheduleReview(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-orange-300 bg-orange-50 rounded-lg hover:bg-orange-100 text-sm transition-colors"
                        title="Schedule Review"
                      >
                        <Activity className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700">Review</span>
                      </button>
                      <button
                        onClick={() => handleViewSupplierProfile(supplier)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm transition-colors"
                        title="View Profile"
                      >
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Profile</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Risk Factors Analysis</h3>
          <p className="text-sm text-gray-600 mt-1">Example: Global Components Ltd. (GCL-002)</p>
        </div>
        <div className="p-6 space-y-6">
          {riskFactors.map((factor, idx) => (
            <div key={idx} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{factor.category}</h4>
                    <p className="text-xs text-gray-500">Weight: {factor.weight}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskStatusColor(factor.status)}`}>
                    {factor.status}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className={`text-2xl font-bold ${getRiskScoreColor(factor.score)}`}>{factor.score}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${
                    factor.score <= 30 ? 'bg-green-500' :
                    factor.score <= 60 ? 'bg-yellow-500' :
                    factor.score <= 80 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                {factor.factors.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start space-x-2 text-sm text-gray-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Distribution Chart (Text-based) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution by Category</h3>
        <div className="space-y-3">
          {[
            { name: 'Low Risk (0-30)', count: suppliers.filter(s => s.overallRiskScore <= 30).length, color: 'bg-green-500' },
            { name: 'Medium Risk (31-60)', count: suppliers.filter(s => s.overallRiskScore > 30 && s.overallRiskScore <= 60).length, color: 'bg-yellow-500' },
            { name: 'High Risk (61-80)', count: suppliers.filter(s => s.overallRiskScore > 60 && s.overallRiskScore <= 80).length, color: 'bg-orange-500' },
            { name: 'Critical Risk (81-100)', count: suppliers.filter(s => s.overallRiskScore > 80).length, color: 'bg-red-500' },
          ].map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="text-sm font-semibold text-gray-900">{category.count} suppliers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${category.color} h-3 rounded-full`}
                  style={{ width: `${(category.count / suppliers.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierRiskScoring;
