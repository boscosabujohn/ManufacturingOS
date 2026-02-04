'use client';

import React from 'react';
import { TrendingDown, DollarSign, Target, Award, TrendingUp, Plus, Download, RefreshCw, Settings, Eye, FileText, BarChart3, Edit } from 'lucide-react';

export type SavingsType = 'cost-reduction' | 'cost-avoidance' | 'process-improvement' | 'demand-management';
export type SavingsStatus = 'realized' | 'projected' | 'at-risk';

export interface SavingsInitiative {
  id: string;
  initiative: string;
  type: SavingsType;
  category: string;
  owner: string;
  status: SavingsStatus;
  targetSavings: number;
  realizedSavings: number;
  achievementPercent: number;
  startDate: string;
  endDate: string;
  supplier?: string;
}

const SavingsTracking: React.FC = () => {
  // Mock data - Savings initiatives
  const initiatives: SavingsInitiative[] = [
    {
      id: 'SAV001',
      initiative: 'Steel Raw Materials - Competitive Bidding',
      type: 'cost-reduction',
      category: 'Raw Materials',
      owner: 'Sarah Johnson',
      status: 'realized',
      targetSavings: 220000,
      realizedSavings: 245000,
      achievementPercent: 111,
      startDate: '2025-01-15',
      endDate: '2025-10-15',
      supplier: 'Quality Steel Industries',
    },
    {
      id: 'SAV002',
      initiative: 'IT Services Contract Renegotiation',
      type: 'cost-reduction',
      category: 'IT Services',
      owner: 'Michael Chen',
      status: 'realized',
      targetSavings: 150000,
      realizedSavings: 165000,
      achievementPercent: 110,
      startDate: '2025-03-01',
      endDate: '2025-09-01',
      supplier: 'Tech Solutions Inc.',
    },
    {
      id: 'SAV003',
      initiative: 'Logistics Route Optimization',
      type: 'process-improvement',
      category: 'Transportation',
      owner: 'Emily Davis',
      status: 'projected',
      targetSavings: 180000,
      realizedSavings: 125000,
      achievementPercent: 69,
      startDate: '2025-06-01',
      endDate: '2025-12-31',
    },
    {
      id: 'SAV004',
      initiative: 'Supplier Consolidation - Electronic Components',
      type: 'cost-avoidance',
      category: 'Electronic Components',
      owner: 'Robert Wilson',
      status: 'realized',
      targetSavings: 125000,
      realizedSavings: 132000,
      achievementPercent: 106,
      startDate: '2025-02-01',
      endDate: '2025-08-01',
      supplier: 'Global Components Ltd.',
    },
    {
      id: 'SAV005',
      initiative: 'Packaging Materials - Demand Management',
      type: 'demand-management',
      category: 'Packaging',
      owner: 'Lisa Anderson',
      status: 'projected',
      targetSavings: 95000,
      realizedSavings: 42000,
      achievementPercent: 44,
      startDate: '2025-07-01',
      endDate: '2025-12-31',
    },
    {
      id: 'SAV006',
      initiative: 'Payment Terms Optimization',
      type: 'cost-avoidance',
      category: 'Financial',
      owner: 'David Lee',
      status: 'at-risk',
      targetSavings: 200000,
      realizedSavings: 85000,
      achievementPercent: 43,
      startDate: '2025-04-01',
      endDate: '2025-10-31',
    },
    {
      id: 'SAV007',
      initiative: 'Blanket PO Implementation - Machined Parts',
      type: 'process-improvement',
      category: 'Machined Parts',
      owner: 'Sarah Johnson',
      status: 'realized',
      targetSavings: 75000,
      realizedSavings: 82000,
      achievementPercent: 109,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      supplier: 'Precision Parts Manufacturing',
    },
  ];

  const totalTargetSavings = initiatives.reduce((sum, i) => sum + i.targetSavings, 0);
  const totalRealizedSavings = initiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
  const overallAchievement = (totalRealizedSavings / totalTargetSavings) * 100;

  const getSavingsStatusColor = (status: SavingsStatus): string => {
    switch (status) {
      case 'realized': return 'bg-green-100 text-green-800';
      case 'projected': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSavingsTypeColor = (type: SavingsType): string => {
    switch (type) {
      case 'cost-reduction': return 'bg-purple-100 text-purple-800';
      case 'cost-avoidance': return 'bg-blue-100 text-blue-800';
      case 'process-improvement': return 'bg-green-100 text-green-800';
      case 'demand-management': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (percent: number): string => {
    if (percent >= 100) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handler functions
  const handleRecordSavings = () => {
    console.log('Recording new savings...');

    alert(`Record New Savings Initiative

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE SAVINGS INITIATIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enter details for a new cost savings or avoidance initiative:

BASIC INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative Name: [________________]
Example: "Steel raw materials - competitive bidding"

Initiative ID: [Auto-generated: SAV-${new Date().getFullYear()}-${String(initiatives.length + 1).padStart(3, '0')}]

Description: [________________]
Detailed description of the savings initiative and approach

SAVINGS CLASSIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings Type: [Select]
  ○ Cost Reduction (Hard savings - direct price reduction)
  ○ Cost Avoidance (Prevented cost increase)
  ○ Process Improvement (Efficiency gains, reduced waste)
  ○ Demand Management (Volume reduction, usage optimization)

Category: [Select]
  ☐ Raw Materials
  ☐ Electronic Components
  ☐ IT Services
  ☐ Transportation & Logistics
  ☐ Packaging
  ☐ Professional Services
  ☐ Machined Parts
  ☐ MRO (Maintenance, Repair, Operations)
  ☐ Utilities
  ☐ Financial/Payment Terms
  ☐ Other: [Specify]

FINANCIAL DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Savings: $[________]
Annual projected savings amount

Baseline Spend: $[________]
Current/previous annual spend before initiative

New Spend (if applicable): $[________]
Annual spend after initiative implementation

Savings Calculation Method:
  ○ Price Comparison (Old Price - New Price)
  ○ Volume Reduction (Volume Change × Unit Price)
  ○ Efficiency Gain (Time/Resource Saved × Cost Rate)
  ○ Avoided Cost Increase (Prevented Increase Amount)
  ○ Other: [Describe]

TIMELINE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start Date: [MM/DD/YYYY]
When initiative begins

Target End Date: [MM/DD/YYYY]
Expected completion/full realization date

Duration: [Calculated: ${Math.ceil(Math.random() * 12)} months]

Milestone Schedule:
  Quarter 1: [____]% realization target
  Quarter 2: [____]% realization target
  Quarter 3: [____]% realization target
  Quarter 4: [____]% realization target

OWNERSHIP & ACCOUNTABILITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative Owner: [Select User]
Responsible for driving the initiative

Category Manager: [Select User]
Procurement category oversight

Finance Approver: [Select User]
Financial validation and approval

Stakeholders: [Select Users]
☐ Operations team
☐ Finance team
☐ Quality team
☐ Engineering team
☐ Supply chain team

SUPPLIER INFORMATION (if applicable):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier Name: [________________]
Primary supplier involved

Supplier Code: [________________]

Contract/Agreement Reference: [________________]

SUPPORTING DOCUMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Business case document
☐ Cost comparison analysis
☐ Supplier quotes/proposals
☐ Contract/agreement
☐ Baseline spend data
☐ Approval documentation
☐ ROI calculation
☐ Risk assessment

Attachments: [Upload Files]

VALIDATION & VERIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings Verification Method:
  ☐ Invoice comparison
  ☐ Purchase order analysis
  ☐ Payment records
  ☐ Supplier statements
  ☐ Financial system reports
  ☐ Third-party validation

Reporting Frequency:
  ○ Monthly
  ○ Quarterly
  ○ Milestone-based

RISK ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Level: [Select]
  ○ Low - Highly confident in realization
  ○ Medium - Some dependencies or uncertainties
  ○ High - Significant challenges or external factors

Risk Factors: [Describe potential risks]

Mitigation Actions: [Describe risk mitigation plans]

APPROVAL WORKFLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings initiatives require approval based on amount:
• <$50K: Category Manager approval
• $50K-$200K: Procurement Director + Finance approval
• >$200K: VP Procurement + CFO approval
• >$500K: Executive committee approval

Auto-routing to appropriate approvers based on target savings amount.

Current Total Portfolio:
• Target: $${(totalTargetSavings / 1000).toFixed(0)}K
• Realized: $${(totalRealizedSavings / 1000).toFixed(0)}K
• Active Initiatives: ${initiatives.length}

Click 'Submit for Approval' to create initiative and route for approval.
Or 'Save as Draft' to continue editing later.`);
  };

  const handleCategorizeSavings = (initiative: SavingsInitiative) => {
    console.log('Categorizing savings for:', initiative.id);

    const currentCategory = initiative.type;
    const currentStatus = initiative.status;

    alert(`Categorize Savings Initiative: ${initiative.initiative}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT CLASSIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative ID: ${initiative.id}
Initiative Name: ${initiative.initiative}

Current Savings Type: ${currentCategory.toUpperCase()}
Current Status: ${currentStatus.toUpperCase()}
Current Category: ${initiative.category}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVINGS TYPE CLASSIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the appropriate savings type:

1. COST REDUCTION (Hard Savings)
   Definition: Direct, measurable reduction in actual expenditure

   Examples:
   • Price negotiation yielding lower unit cost
   • Competitive bidding resulting in lower supplier price
   • Volume consolidation with better pricing
   • Specification changes reducing material cost

   Recognition: Immediate, flows directly to bottom line
   Verification: Invoice comparison, PO analysis
   Current Portfolio: ${initiatives.filter(i => i.type === 'cost-reduction').length} initiatives, $${(initiatives.filter(i => i.type === 'cost-reduction').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K realized

   ${currentCategory === 'cost-reduction' ? '✓ CURRENTLY SELECTED' : '○ Select'}

2. COST AVOIDANCE (Soft Savings)
   Definition: Prevented cost increase that would have otherwise occurred

   Examples:
   • Negotiating to avoid planned price increase
   • Locking in rates before anticipated market increase
   • Process improvement avoiding additional headcount
   • Preventive maintenance avoiding repair costs

   Recognition: Harder to verify, based on forecast/projection
   Verification: Market data comparison, supplier notice documentation
   Current Portfolio: ${initiatives.filter(i => i.type === 'cost-avoidance').length} initiatives, $${(initiatives.filter(i => i.type === 'cost-avoidance').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K realized

   ${currentCategory === 'cost-avoidance' ? '✓ CURRENTLY SELECTED' : '○ Select'}

3. PROCESS IMPROVEMENT
   Definition: Efficiency gains reducing operational costs/waste

   Examples:
   • Automated approval workflows reducing cycle time
   • Inventory optimization reducing carrying costs
   • Standardization reducing SKU complexity
   • Blanket POs reducing transaction costs
   • Logistics optimization reducing freight costs

   Recognition: Indirect savings, may include time/resource value
   Verification: Process metrics, transaction volume analysis
   Current Portfolio: ${initiatives.filter(i => i.type === 'process-improvement').length} initiatives, $${(initiatives.filter(i => i.type === 'process-improvement').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K realized

   ${currentCategory === 'process-improvement' ? '✓ CURRENTLY SELECTED' : '○ Select'}

4. DEMAND MANAGEMENT
   Definition: Reducing consumption/usage through policy or behavior change

   Examples:
   • Reducing specification requirements
   • Usage policies limiting consumption
   • Substitution with lower-cost alternatives
   • Elimination of unnecessary requirements
   • Consolidation reducing total volume

   Recognition: Volume reduction × unit cost
   Verification: Usage reports, volume tracking
   Current Portfolio: ${initiatives.filter(i => i.type === 'demand-management').length} initiatives, $${(initiatives.filter(i => i.type === 'demand-management').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K realized

   ${currentCategory === 'demand-management' ? '✓ CURRENTLY SELECTED' : '○ Select'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS CLASSIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the current realization status:

○ REALIZED
  Savings have been fully achieved and verified
  Requirements:
  • Implementation complete
  • Financial impact validated
  • Documented in financial systems
  • Ongoing benefit being realized

  ${initiative.achievementPercent >= 100 ? 'Recommendation: Set to REALIZED (target exceeded)' : ''}

○ PROJECTED
  Savings expected but not yet fully realized
  Tracking:
  • Progress toward target
  • Milestone achievement
  • Regular status updates
  • Forecasted completion date

  ${initiative.achievementPercent >= 50 && initiative.achievementPercent < 100 ? 'Recommendation: Keep as PROJECTED (in progress)' : ''}

○ AT-RISK
  Savings in jeopardy, may not be fully realized
  Indicators:
  • Behind schedule
  • Implementation challenges
  • External factors affecting realization
  • Achievement <50% with limited time remaining

  ${initiative.achievementPercent < 50 ? 'Recommendation: Mark as AT-RISK (underperforming)' : ''}

Current Achievement: ${initiative.achievementPercent}%
Target: $${(initiative.targetSavings / 1000).toFixed(0)}K
Realized: $${(initiative.realizedSavings / 1000).toFixed(0)}K
Variance: $${((initiative.realizedSavings - initiative.targetSavings) / 1000).toFixed(0)}K (${((initiative.realizedSavings / initiative.targetSavings - 1) * 100).toFixed(0)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPEND CATEGORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select spend category for reporting and analysis:

☐ Raw Materials             ☐ Transportation & Logistics
☐ Electronic Components     ☐ Packaging Materials
☐ Machined Parts           ☐ IT Services/Hardware
☐ Professional Services     ☐ MRO Supplies
☐ Utilities                ☐ Financial/Payment Terms
☐ Indirect Materials       ☐ Capital Equipment
☐ Other: [Specify]

Current: ${initiative.category}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECATEGORIZATION IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changing categorization will affect:
• Portfolio reporting and analytics
• Category manager performance metrics
• Savings attribution by department
• Executive dashboard aggregations
• Financial system integration

Change History:
${new Date().toLocaleDateString()}: Category created as ${currentCategory}
[Previous changes would be listed here]

Reason for Recategorization: [Required]
_________________________________________________

Approver: [Requires Category Manager or Director approval for changes]

Click 'Update Categories' to save changes.
Changes will be reflected immediately in reports and dashboards.`);
  };

  const handleExportSavingsReport = () => {
    console.log('Exporting savings report...');

    const realizedCount = initiatives.filter(i => i.status === 'realized').length;
    const projectedCount = initiatives.filter(i => i.status === 'projected').length;
    const atRiskCount = initiatives.filter(i => i.status === 'at-risk').length;

    alert(`Export Savings Tracking Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORT GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate comprehensive savings tracking reports for stakeholder communication and financial validation.

CURRENT PORTFOLIO SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Initiatives: ${initiatives.length}
• Realized: ${realizedCount} initiatives
• Projected: ${projectedCount} initiatives
• At-Risk: ${atRiskCount} initiatives

Target Savings: $${(totalTargetSavings / 1000).toFixed(0)}K
Realized Savings: $${(totalRealizedSavings / 1000).toFixed(0)}K
Overall Achievement: ${overallAchievement.toFixed(1)}%
Variance: $${((totalRealizedSavings - totalTargetSavings) / 1000).toFixed(0)}K

Report Generation Date: ${new Date().toLocaleDateString()}
Reporting Period: FY 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPORT FORMAT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXECUTIVE SUMMARY (PDF)
   File: Savings_Executive_Summary_${new Date().toISOString().split('T')[0]}.pdf

   Contents:
   • High-level savings dashboard
   • Total target vs. realized savings
   • Achievement percentage and trends
   • Savings by type breakdown
   • Top 5 initiatives by value
   • At-risk initiatives requiring attention
   • YoY comparison and trends

   Audience: C-Suite, Board of Directors
   Pages: 3-5 pages with charts

2. DETAILED SAVINGS REPORT (Excel)
   File: Savings_Detailed_Report_${new Date().toISOString().split('T')[0]}.xlsx

   Worksheets:
   • Initiative Master List (All ${initiatives.length} initiatives)
   • Savings by Type Analysis
   • Savings by Category Breakdown
   • Owner Performance Scorecard
   • Timeline and Milestone Tracking
   • Realization Status Summary
   • Financial Validation Documentation
   • Trend Analysis (12-month history)
   • Forecasted Savings Pipeline

   Features:
   ✓ Pivot tables for custom analysis
   ✓ Drill-down capability by category/type/owner
   ✓ Automated charts and visualizations
   ✓ Filters and sorting
   ✓ Calculated fields and formulas

3. FINANCIAL VALIDATION REPORT (PDF)
   File: Savings_Financial_Validation_${new Date().toISOString().split('T')[0]}.pdf

   Sections:
   • Realized savings with financial proof
   • Invoice/PO comparison documentation
   • Baseline vs. actual spend analysis
   • Savings calculation methodology
   • Third-party validation (where applicable)
   • Finance department sign-off
   • Audit trail and supporting documents

   Audience: CFO, Finance team, External auditors
   Pages: 20-30 pages with attachments

4. INITIATIVE DATA EXPORT (CSV)
   File: Savings_Data_Export_${new Date().toISOString().split('T')[0]}.csv

   Columns:
   • Initiative ID, Name, Description
   • Type, Category, Status
   • Owner, Stakeholders
   • Target Savings, Realized Savings, Achievement %
   • Start Date, End Date, Duration
   • Supplier information
   • Financial validation status
   • Last updated date

   Use Case: Import to BI tools, data warehouses, financial systems
   Records: ${initiatives.length} initiatives

5. PRESENTATION DECK (PowerPoint)
   File: Savings_Review_Presentation_${new Date().toISOString().split('T')[0]}.pptx

   Slides:
   • Portfolio Overview (1 slide)
   • Target vs. Realized Savings (1 slide)
   • Savings by Type Breakdown (1 slide)
   • Top Performing Initiatives (1 slide)
   • At-Risk Initiatives & Action Plans (1 slide)
   • Category Manager Scorecards (1-2 slides)
   • Trend Analysis & Forecasts (1 slide)
   • Next Steps & Recommendations (1 slide)

   Audience: Management reviews, QBRs, Board meetings
   Format: Executive-ready presentation

6. DASHBOARD EXPORT (JSON/API)
   File: savings_dashboard_data_${new Date().toISOString().split('T')[0]}.json

   Structure:
   • Initiative details with full metadata
   • Aggregated metrics and KPIs
   • Time-series data for trends
   • Category/type breakdowns
   • Owner performance metrics

   Use Case: Integration with BI dashboards, analytics platforms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVINGS BREAKDOWN FOR REPORTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

By Type:
• Cost Reduction: $${(initiatives.filter(i => i.type === 'cost-reduction').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${((initiatives.filter(i => i.type === 'cost-reduction').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%)
• Cost Avoidance: $${(initiatives.filter(i => i.type === 'cost-avoidance').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${((initiatives.filter(i => i.type === 'cost-avoidance').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%)
• Process Improvement: $${(initiatives.filter(i => i.type === 'process-improvement').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${((initiatives.filter(i => i.type === 'process-improvement').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%)
• Demand Management: $${(initiatives.filter(i => i.type === 'demand-management').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${((initiatives.filter(i => i.type === 'demand-management').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%)

By Status:
• Realized: $${(initiatives.filter(i => i.status === 'realized').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${realizedCount} initiatives)
• Projected: $${(initiatives.filter(i => i.status === 'projected').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${projectedCount} initiatives)
• At-Risk: $${(initiatives.filter(i => i.status === 'at-risk').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K (${atRiskCount} initiatives)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPORT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Export single format
☐ Export all formats as package
☐ Schedule recurring reports (weekly/monthly/quarterly)
☐ Email to distribution list
☐ Upload to shared drive/portal
☐ Publish to executive dashboard

DISTRIBUTION LIST:
☐ Procurement leadership team
☐ Finance/CFO office
☐ Category managers
☐ Executive committee
☐ Operations leadership
☐ Board of directors (executive summary only)

DATE RANGE FILTER:
○ All time (show all initiatives)
○ Current fiscal year (FY 2025)
○ Last 12 months
○ Last quarter
○ Custom date range: [From: ____ To: ____]

SECURITY SETTINGS:
• Classification: Internal Use Only
• Password protection: [Enabled/Disabled]
• Watermark: "Confidential - Financial Data"
• Access expiration: 90 days
• Download tracking: Enabled

Click 'Generate Report' to create selected export formats.
Processing time: 15-30 seconds per format.`);
  };

  const handleViewTrends = () => {
    console.log('Viewing savings trends...');

    alert(`Savings Trends & Analytics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO TREND ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyze savings performance over time and identify patterns, opportunities, and risks.

CURRENT PERIOD PERFORMANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Savings: $${(totalTargetSavings / 1000).toFixed(0)}K
Realized Savings: $${(totalRealizedSavings / 1000).toFixed(0)}K
Achievement Rate: ${overallAchievement.toFixed(1)}%
Active Initiatives: ${initiatives.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HISTORICAL TREND (Last 12 Months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Monthly Cumulative Realized Savings:

${Array.from({length: 12}, (_, i) => {
  const month = new Date();
  month.setMonth(month.getMonth() - (11 - i));
  const monthlyRealized = Math.floor(totalRealizedSavings * (0.4 + (i / 12) * 0.6));
  return `${month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}: $${(monthlyRealized / 1000).toFixed(0)}K`;
}).join('\n')}

Trend: ${overallAchievement >= 100 ? '↗ Exceeding targets' : overallAchievement >= 90 ? '→ On track' : '↘ Below target'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVINGS VELOCITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Average Monthly Realization Rate: $${(totalRealizedSavings / 12 / 1000).toFixed(0)}K/month
Run Rate (Annualized): $${(totalRealizedSavings / 1000).toFixed(0)}K

Quarterly Breakdown:
Q1 2025: $${(totalRealizedSavings * 0.20 / 1000).toFixed(0)}K (${initiatives.filter((_, i) => i < 2).length} initiatives)
Q2 2025: $${(totalRealizedSavings * 0.25 / 1000).toFixed(0)}K (${initiatives.filter((_, i) => i >= 2 && i < 4).length} initiatives)
Q3 2025: $${(totalRealizedSavings * 0.30 / 1000).toFixed(0)}K (${initiatives.filter((_, i) => i >= 4 && i < 6).length} initiatives)
Q4 2025: $${(totalRealizedSavings * 0.25 / 1000).toFixed(0)}K (${initiatives.filter((_, i) => i >= 6).length} initiatives, some in progress)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVINGS BY TYPE - TREND ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cost Reduction:
• Current: $${(initiatives.filter(i => i.type === 'cost-reduction').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => i.type === 'cost-reduction').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%
• Initiatives: ${initiatives.filter(i => i.type === 'cost-reduction').length}
• Trend: Most reliable savings type, ${initiatives.filter(i => i.type === 'cost-reduction' && i.status === 'realized').length}/${initiatives.filter(i => i.type === 'cost-reduction').length} realized

Cost Avoidance:
• Current: $${(initiatives.filter(i => i.type === 'cost-avoidance').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => i.type === 'cost-avoidance').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%
• Initiatives: ${initiatives.filter(i => i.type === 'cost-avoidance').length}
• Trend: Harder to validate, requires strong documentation

Process Improvement:
• Current: $${(initiatives.filter(i => i.type === 'process-improvement').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => i.type === 'process-improvement').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%
• Initiatives: ${initiatives.filter(i => i.type === 'process-improvement').length}
• Trend: Efficiency gains, indirect but measurable

Demand Management:
• Current: $${(initiatives.filter(i => i.type === 'demand-management').reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => i.type === 'demand-management').reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%
• Initiatives: ${initiatives.filter(i => i.type === 'demand-management').length}
• Trend: Volume-based, depends on adoption/compliance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OWNER PERFORMANCE TRENDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top Performers (by realized savings):
${Array.from(new Set(initiatives.map(i => i.owner)))
  .map(owner => {
    const ownerInitiatives = initiatives.filter(i => i.owner === owner);
    const ownerRealized = ownerInitiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
    return { owner, realized: ownerRealized, count: ownerInitiatives.length };
  })
  .sort((a, b) => b.realized - a.realized)
  .slice(0, 5)
  .map((item, idx) => `${idx + 1}. ${item.owner}: $${(item.realized / 1000).toFixed(0)}K (${item.count} initiatives)`)
  .join('\n')}

Average per Initiative: $${(totalRealizedSavings / initiatives.length / 1000).toFixed(0)}K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REALIZATION STATUS TRENDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative Status Distribution:
• Realized: ${initiatives.filter(i => i.status === 'realized').length} initiatives (${((initiatives.filter(i => i.status === 'realized').length / initiatives.length) * 100).toFixed(1)}%)
• Projected: ${initiatives.filter(i => i.status === 'projected').length} initiatives (${((initiatives.filter(i => i.status === 'projected').length / initiatives.length) * 100).toFixed(1)}%)
• At-Risk: ${initiatives.filter(i => i.status === 'at-risk').length} initiatives (${((initiatives.filter(i => i.status === 'at-risk').length / initiatives.length) * 100).toFixed(1)}%)

Success Rate: ${((initiatives.filter(i => i.status === 'realized').length / initiatives.length) * 100).toFixed(1)}%
At-Risk Rate: ${((initiatives.filter(i => i.status === 'at-risk').length / initiatives.length) * 100).toFixed(1)}%

Average Achievement by Status:
• Realized: ${(initiatives.filter(i => i.status === 'realized').reduce((sum, i) => sum + i.achievementPercent, 0) / initiatives.filter(i => i.status === 'realized').length).toFixed(0)}%
• Projected: ${(initiatives.filter(i => i.status === 'projected').reduce((sum, i) => sum + i.achievementPercent, 0) / initiatives.filter(i => i.status === 'projected').length).toFixed(0)}%
• At-Risk: ${(initiatives.filter(i => i.status === 'at-risk').reduce((sum, i) => sum + i.achievementPercent, 0) / initiatives.filter(i => i.status === 'at-risk').length || 0).toFixed(0)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORECAST & PROJECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on current trends and projected initiatives:

End of Year Forecast:
• Total Projected Savings: $${((totalRealizedSavings + initiatives.filter(i => i.status === 'projected').reduce((sum, i) => sum + (i.targetSavings - i.realizedSavings), 0)) / 1000).toFixed(0)}K
• Forecast Achievement: ${(((totalRealizedSavings + initiatives.filter(i => i.status === 'projected').reduce((sum, i) => sum + (i.targetSavings - i.realizedSavings) * 0.7, 0)) / totalTargetSavings) * 100).toFixed(0)}%
• Additional Initiatives Needed: ${Math.max(0, Math.ceil((totalTargetSavings - totalRealizedSavings) / 50000))} (assuming $50K average)

Pipeline Opportunities:
• Negotiations in progress: 3-5 potential initiatives
• Estimated pipeline value: $150K-$250K
• Expected realization: Q4 2025 - Q1 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY INSIGHTS & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Positive Trends:
✓ ${overallAchievement >= 100 ? 'Exceeding overall target' : overallAchievement >= 90 ? 'On track to meet targets' : ''}
✓ ${initiatives.filter(i => i.status === 'realized').length}/${initiatives.length} initiatives fully realized
${initiatives.filter(i => i.achievementPercent > 100).length > 0 ? `✓ ${initiatives.filter(i => i.achievementPercent > 100).length} initiatives exceeded targets` : ''}

Areas for Attention:
${initiatives.filter(i => i.status === 'at-risk').length > 0 ? `⚠ ${initiatives.filter(i => i.status === 'at-risk').length} initiatives at risk - require action plans` : ''}
${initiatives.filter(i => i.status === 'projected' && i.achievementPercent < 50).length > 0 ? `⚠ ${initiatives.filter(i => i.status === 'projected' && i.achievementPercent < 50).length} projected initiatives underperforming` : ''}
${overallAchievement < 90 ? '⚠ Overall portfolio below 90% target - accelerate realization' : ''}

Recommended Actions:
1. Focus resources on at-risk initiatives
2. Develop recovery plans for underperforming projects
3. Accelerate projected initiatives near completion
4. Build pipeline for next period
5. Share best practices from top performers
6. Improve validation and documentation for cost avoidance

Click 'View Detailed Analytics' to access interactive trend dashboards and drill-down capability.`);
  };

  const handleRefresh = () => {
    console.log('Refreshing savings data...');

    alert(`Refresh Savings Tracking Data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA REFRESH OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiating comprehensive data refresh for all savings initiatives and financial metrics...

DATA SOURCES TO SYNC:
✓ Initiative master database
✓ Financial systems (AP/AR, GL)
✓ Purchase order and invoice data
✓ Supplier contracts and agreements
✓ Payment records
✓ Baseline spend data
✓ Category spend analysis
✓ Owner/stakeholder assignments
✓ Approval workflow status
✓ Milestone and timeline tracking

REFRESH PROCESS:
1. Pull latest initiative updates from all owners
2. Sync financial data from ERP system
3. Recalculate realized savings from actuals
4. Update achievement percentages
5. Validate against financial records
6. Refresh status classifications
7. Update trend calculations
8. Regenerate dashboard visualizations
9. Trigger notifications for significant changes
10. Update executive reports

ESTIMATED TIME:
• Quick Refresh (status/metrics only): 10 seconds
• Standard Refresh (financial sync): 30 seconds
• Deep Refresh (full recalculation with validation): 2-3 minutes

CURRENT PORTFOLIO STATS:
• Total Initiatives: ${initiatives.length}
• Target Savings: $${(totalTargetSavings / 1000).toFixed(0)}K
• Realized Savings: $${(totalRealizedSavings / 1000).toFixed(0)}K
• Achievement: ${overallAchievement.toFixed(1)}%

RECENT UPDATES DETECTED:
• 2 initiatives updated realized savings amounts
• 1 initiative status changed to "realized"
• 3 initiatives progressed past milestones
• 0 new at-risk initiatives identified
• Financial validation completed for 2 initiatives

NOTIFICATION ALERTS:
System will automatically notify stakeholders if:
• Any initiative falls below 50% achievement with <3 months remaining
• Initiative status changes (especially to at-risk)
• Major variance detected (>$25K from target)
• Milestone deadlines approaching or missed
• Financial validation issues detected

LAST REFRESH: ${new Date(Date.now() - Math.random() * 7200000).toLocaleString()}
REFRESH FREQUENCY: Every 24 hours (automated)
NEXT SCHEDULED REFRESH: ${new Date(Date.now() + 86400000).toLocaleString()}

MANUAL REFRESH OPTIONS:
○ Quick Refresh - Update metrics only (10 sec)
○ Standard Refresh - Include financial sync (30 sec)
○ Deep Refresh - Full validation and recalculation (2-3 min)

Click 'Refresh Now' to manually trigger immediate data sync.
Or enable 'Real-Time Sync' for continuous updates (may impact performance).`);
  };

  const handleSettings = () => {
    console.log('Opening savings tracking settings...');

    alert(`Savings Tracking Settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIGURATION MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SAVINGS METHODOLOGY & DEFINITIONS

   Savings Type Classifications:
   ☐ Cost Reduction (hard savings)
     - Definition: Direct price/cost reduction
     - Recognition: Immediate, invoice-based

   ☐ Cost Avoidance (soft savings)
     - Definition: Prevented cost increase
     - Recognition: Forecasted vs. actual

   ☐ Process Improvement
     - Definition: Efficiency gains, reduced waste
     - Recognition: Indirect, time/resource value

   ☐ Demand Management
     - Definition: Volume/usage reduction
     - Recognition: Volume change × unit price

   Calculation Methods:
   ☐ Allow user-defined calculation formulas
   ☐ Require approval for non-standard methods
   ☐ Enforce standard methodology by category
   ☐ Include time value of money adjustments
   ☐ Allow one-time vs. recurring classification

2. FINANCIAL VALIDATION

   Validation Requirements:
   ☐ Hard savings: Invoice/PO comparison mandatory
   ☐ Soft savings: Market data/documentation required
   ☐ Third-party validation for initiatives >$100K
   ☐ Finance department sign-off required
   ☐ Baseline documentation mandatory

   Validation Frequency:
   • Monthly: All active initiatives
   • Quarterly: Comprehensive portfolio review
   • Annual: External audit and certification

   Documentation Requirements:
   ☐ Business case and approval
   ☐ Baseline spend evidence
   ☐ Price/quote comparisons
   ☐ Contract/agreement documentation
   ☐ Financial system extracts
   ☐ Supplier confirmations

3. ACHIEVEMENT TRACKING

   Status Definitions:
   • Realized: [____]% achievement or higher + validated
   • Projected: [____]% to [____]% achievement, in progress
   • At-Risk: Below [____]% achievement or behind schedule

   Milestone Tracking:
   ☐ Enable quarterly milestone targets
   ☐ Require monthly progress updates
   ☐ Auto-alert on missed milestones
   ☐ Escalate if <50% achievement at midpoint

   Achievement Calculations:
   ○ Simple: Realized / Target × 100%
   ○ Time-weighted: Consider duration completed
   ○ Risk-adjusted: Apply probability factors
   ○ Conservative: Apply discount factor to projections

4. APPROVAL WORKFLOWS

   Initiative Creation Approval:
   • <$50K: Category Manager
   • $50K-$200K: Procurement Director + Finance
   • $200K-$500K: VP Procurement + CFO
   • >$500K: Executive Committee

   Status Change Approval:
   ☐ Require approval to mark as "realized"
   ☐ Finance approval for financial validation
   ☐ Manager approval for at-risk classification
   ☐ Director approval for initiative closure

   Recategorization Approval:
   ☐ Requires Category Manager approval
   ☐ Requires Finance approval for type changes
   ☐ Audit trail for all categorization changes

5. OWNER & STAKEHOLDER MANAGEMENT

   Assignment Rules:
   ☐ Auto-assign based on category
   ☐ Require owner acceptance
   ☐ Allow multiple owners/co-ownership
   ☐ Mandatory stakeholder notifications

   Performance Metrics:
   ☐ Track individual owner success rates
   ☐ Calculate average achievement by owner
   ☐ Include in performance reviews
   ☐ Generate owner scorecards

   Notification Preferences:
   ☐ Email alerts for assigned initiatives
   ☐ Weekly digest of owned initiatives
   ☐ Alerts for approaching milestones
   ☐ Escalation for overdue updates

6. REPORTING & ANALYTICS

   Standard Reports:
   ☐ Executive dashboard (weekly)
   ☐ Detailed portfolio report (monthly)
   ☐ Financial validation summary (quarterly)
   ☐ Year-end summary (annual)

   Custom Reports:
   • By savings type
   • By category
   • By owner
   • By status
   • By time period
   • Custom date ranges

   Dashboard Widgets:
   ☐ Total savings summary
   ☐ Achievement gauge
   ☐ Savings by type breakdown
   ☐ At-risk initiatives alert
   ☐ Top performers leaderboard
   ☐ Trend charts (12-month)
   ☐ Forecast projections

7. INTEGRATION SETTINGS

   Financial System Integration:
   ☐ ERP system: [SAP/Oracle/Other]
   ☐ AP/AR integration for invoice data
   ☐ GL integration for spend baselines
   ☐ Budget system integration
   ☐ Real-time vs. batch sync

   Data Refresh:
   • Frequency: [Daily/Weekly/Real-time]
   • Sync time: [HH:MM timezone]
   • Retry logic: [Yes/No]
   • Error notifications: [Email list]

   External Tools:
   ☐ BI platform integration
   ☐ Data warehouse export
   ☐ API access for third-party tools
   ☐ Power BI/Tableau connectors

8. ACCESS CONTROL & PERMISSIONS

   User Roles:
   • Savings Administrator: Full access, all settings
   • Category Manager: View/edit assigned categories
   • Initiative Owner: View/edit owned initiatives
   • Finance Reviewer: View all, approve financial validation
   • Executive Viewer: View dashboards and reports only
   • Auditor: Read-only access to all data

   Permissions Matrix:
   ☐ Create initiatives: [Roles]
   ☐ Edit initiative details: [Roles]
   ☐ Update realized savings: [Roles]
   ☐ Change status: [Roles]
   ☐ Approve/validate: [Roles]
   ☐ Export data: [Roles]
   ☐ Configure settings: [Admin only]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Initiatives: ${initiatives.length}
Total Target Savings: $${(totalTargetSavings / 1000).toFixed(0)}K
Total Realized Savings: $${(totalRealizedSavings / 1000).toFixed(0)}K
Average Achievement: ${overallAchievement.toFixed(1)}%

Validation Status:
• Fully Validated: ${initiatives.filter(i => i.status === 'realized').length}
• Pending Validation: ${initiatives.filter(i => i.status === 'projected').length}
• Requires Action: ${initiatives.filter(i => i.status === 'at-risk').length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Save changes and apply immediately
☐ Save as draft (review before applying)
☐ Reset to default settings
☐ Export configuration (backup)
☐ Import configuration from file

Select settings categories to configure, or choose 'Guided Setup' for step-by-step wizard.`);
  };

  const handleViewInitiativeDetails = (initiative: SavingsInitiative) => {
    console.log('Viewing initiative details:', initiative.id);

    alert(`Savings Initiative Details: ${initiative.initiative}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INITIATIVE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative ID: ${initiative.id}
Initiative Name: ${initiative.initiative}
Status: ${initiative.status.toUpperCase()} ${
  initiative.status === 'realized' ? '✓' :
  initiative.status === 'at-risk' ? '⚠' :
  'ℹ'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLASSIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings Type: ${initiative.type.toUpperCase()}
Category: ${initiative.category}
Owner: ${initiative.owner}
${initiative.supplier ? `Supplier: ${initiative.supplier}` : 'Supplier: N/A (internal initiative)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Savings: $${(initiative.targetSavings / 1000).toFixed(1)}K
Realized Savings: $${(initiative.realizedSavings / 1000).toFixed(1)}K
Achievement: ${initiative.achievementPercent}%

Performance Status:
${initiative.achievementPercent >= 110 ? '⭐ EXCEEDING - Significantly above target' :
  initiative.achievementPercent >= 100 ? '✓ ON TARGET - Meeting expectations' :
  initiative.achievementPercent >= 70 ? '⚠ BELOW TARGET - Needs improvement' :
  '⚠ SIGNIFICANTLY BEHIND - Immediate action required'}

Variance: $${((initiative.realizedSavings - initiative.targetSavings) / 1000).toFixed(1)}K (${((initiative.realizedSavings / initiative.targetSavings - 1) * 100).toFixed(0)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start Date: ${initiative.startDate}
End Date: ${initiative.endDate}
Duration: ${Math.ceil((new Date(initiative.endDate).getTime() - new Date(initiative.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months

Time Elapsed: ${Math.ceil((Date.now() - new Date(initiative.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
Days Remaining: ${Math.max(0, Math.ceil((new Date(initiative.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
${new Date(initiative.endDate) < new Date() ? '⚠ OVERDUE - Past target end date' : ''}

Progress Timeline:
┌─────────────────────────────────────┐
│ ${'█'.repeat(Math.min(20, Math.floor(initiative.achievementPercent / 5)))}${'░'.repeat(Math.max(0, 20 - Math.floor(initiative.achievementPercent / 5)))} │ ${initiative.achievementPercent}%
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAILED BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings Calculation:
Method: ${initiative.type === 'cost-reduction' ? 'Price Comparison (Old - New)' :
         initiative.type === 'cost-avoidance' ? 'Prevented Cost Increase' :
         initiative.type === 'process-improvement' ? 'Efficiency Gain Valuation' :
         'Volume Reduction × Unit Cost'}

${initiative.type === 'cost-reduction' ? `
Baseline Price: [From contract/historical data]
New Price: [From negotiated contract]
Volume: [Annual usage]
Annual Savings: ${(initiative.targetSavings / 1000).toFixed(1)}K
` : initiative.type === 'cost-avoidance' ? `
Projected Increase: [From supplier notice/market data]
Actual Price: [Negotiated or current rate]
Volume: [Annual usage]
Avoided Cost: ${(initiative.targetSavings / 1000).toFixed(1)}K
` : initiative.type === 'process-improvement' ? `
Process Efficiency Gain: [Time/resource saved]
Value per Unit: [Cost rate]
Annual Volume: [Transactions/units]
Annual Savings: ${(initiative.targetSavings / 1000).toFixed(1)}K
` : `
Usage Reduction: [Volume decrease]
Unit Cost: [Price per unit]
Annual Savings: ${(initiative.targetSavings / 1000).toFixed(1)}K
`}

Realization Schedule:
Q1: $${(initiative.targetSavings * 0.20 / 1000).toFixed(1)}K target
Q2: $${(initiative.targetSavings * 0.25 / 1000).toFixed(1)}K target
Q3: $${(initiative.targetSavings * 0.30 / 1000).toFixed(1)}K target
Q4: $${(initiative.targetSavings * 0.25 / 1000).toFixed(1)}K target

Actual Realization to Date: $${(initiative.realizedSavings / 1000).toFixed(1)}K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Validation Status: ${initiative.status === 'realized' ? 'VALIDATED ✓' : 'PENDING VALIDATION'}

Supporting Documentation:
${initiative.status === 'realized' ?
`✓ Business case and approval
✓ Baseline spend documentation
✓ Price/quote comparisons
✓ Contract/agreement
✓ Invoice/PO comparison
✓ Financial system extracts
✓ Finance department sign-off` :
`☐ Business case and approval
☐ Baseline spend documentation
☐ Price/quote comparisons
☐ Contract/agreement (if applicable)
☐ Invoice/PO comparison (upon realization)
☐ Financial system validation
☐ Finance department sign-off`}

Validation Date: ${initiative.status === 'realized' ? new Date(initiative.endDate).toLocaleDateString() : 'Pending'}
Validated By: ${initiative.status === 'realized' ? 'Finance Department' : 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INITIATIVE ACTIVITY LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${new Date(initiative.startDate).toLocaleDateString()}: Initiative created by ${initiative.owner}
${new Date(new Date(initiative.startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}: Approved by Category Manager
${new Date(new Date(initiative.startDate).getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}: Implementation started${initiative.supplier ? ` with ${initiative.supplier}` : ''}
${new Date(new Date(initiative.startDate).getTime() + 120 * 24 * 60 * 60 * 1000).toLocaleDateString()}: Progress update - ${initiative.achievementPercent}% achieved
${initiative.status === 'realized' ? `${new Date(initiative.endDate).toLocaleDateString()}: Marked as realized, validated by Finance` : `${new Date().toLocaleDateString()}: Current status - ${initiative.status}`}

Recent Updates (Last 30 days):
• Realized savings updated to $${(initiative.realizedSavings / 1000).toFixed(1)}K
${initiative.status === 'at-risk' ? '• Status changed to AT-RISK - recovery plan needed' : ''}
${initiative.achievementPercent >= 100 ? '• Target exceeded - exceeding expectations' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAKEHOLDERS & NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative Owner: ${initiative.owner}
Accountability: Drive initiative, track progress, report results

Notified Stakeholders:
• Category Manager (performance oversight)
• Finance Team (validation and approval)
${initiative.supplier ? `• Supplier Contact (${initiative.supplier})` : ''}
• Procurement Leadership (portfolio monitoring)

Notification Settings:
☑ Weekly progress update emails
☑ Milestone alerts
☑ Status change notifications
${initiative.status === 'at-risk' ? '☑ Escalation alerts (at-risk status)' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${initiative.status === 'at-risk' ?
`⚠ AT-RISK STATUS - IMMEDIATE ACTIONS REQUIRED:
1. Schedule recovery planning meeting with owner
2. Identify root causes for underperformance
3. Develop action plan with specific milestones
4. Consider alternative approaches or suppliers
5. Set bi-weekly progress reviews
6. Escalate to leadership if no improvement in 30 days` :
initiative.status === 'projected' ?
`ℹ PROJECTED STATUS - STANDARD MONITORING:
1. Continue monthly progress tracking
2. Ensure owner provides regular updates
3. Validate milestones are being met
4. Prepare documentation for financial validation
5. Monitor for any risk factors
6. Plan for final validation upon completion` :
`✓ REALIZED STATUS - CLOSURE ACTIVITIES:
1. Ensure all financial validation complete
2. Document lessons learned and best practices
3. Share success with broader team
4. Consider extending or replicating approach
5. Archive initiative with full documentation
6. Update owner performance metrics`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Edit Initiative] [Update Realized Savings] [Change Status]
[Add Documentation] [View Financial Validation] [Contact Owner]
[Generate Report] [Export Details] [Close Initiative]

Last Updated: ${new Date().toLocaleString()}
Next Review Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  };

  const handleEditInitiative = (initiative: SavingsInitiative) => {
    console.log('Editing initiative:', initiative.id);

    alert(`Edit Savings Initiative: ${initiative.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDIT INITIATIVE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative ID: ${initiative.id} (Read-only)
Status: ${initiative.status.toUpperCase()}

BASIC INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative Name: [${initiative.initiative}___]
Description: [Update detailed description]

CLASSIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Savings Type: [${initiative.type}]
  ○ cost-reduction
  ○ cost-avoidance
  ○ process-improvement
  ○ demand-management

  ⚠ Changing savings type may require re-approval

Category: [${initiative.category}___]
Owner: [${initiative.owner}___]
${initiative.supplier ? `Supplier: [${initiative.supplier}___]` : 'Supplier: [Optional___]'}

FINANCIAL DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Savings: $[${(initiative.targetSavings / 1000).toFixed(1)}K___]
  ⚠ Changing target >10% requires approval

Realized Savings: $[${(initiative.realizedSavings / 1000).toFixed(1)}K___]
  Must be supported by financial documentation

Achievement: ${initiative.achievementPercent}% (Calculated automatically)

TIMELINE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start Date: [${initiative.startDate}]
End Date: [${initiative.endDate}]

  ℹ Extending end date affects realization tracking

STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Status: ${initiative.status}
  ○ projected - Initiative in progress
  ○ realized - Fully achieved and validated
  ○ at-risk - Requires attention/recovery plan

  ⚠ Status change may require approval:
  • To "realized": Requires financial validation
  • To "at-risk": Requires justification and action plan

SUPPORTING DOCUMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Attachments:
${initiative.status === 'realized' ?
`• Business case (approved)
• Baseline spend data
• Contract/quotes
• Financial validation report` :
`• Business case (approved)
• Baseline spend data
• Work in progress documentation`}

☐ Upload additional documents
☐ Remove outdated documents
☐ Request documents from stakeholders

CHANGE JUSTIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reason for Changes: [Required for audit trail]
_________________________________________________
_________________________________________________

APPROVAL REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on proposed changes:
${initiative.targetSavings >= 200000 ?
`⚠ HIGH-VALUE INITIATIVE
Approval Required From:
• Category Manager
• Procurement Director
• Finance Department
• VP Procurement (target >$200K)` :
initiative.targetSavings >= 50000 ?
`ℹ STANDARD APPROVAL
Approval Required From:
• Category Manager
• Procurement Director
• Finance Department` :
`ℹ STANDARD APPROVAL
Approval Required From:
• Category Manager`}

VALIDATION SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Send for financial validation
☐ Request stakeholder review
☐ Update notification distribution list
☐ Adjust milestone tracking

AUDIT TRAIL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All changes are logged for audit purposes:
• Who made the change
• What was changed (old → new values)
• When the change occurred
• Why the change was made (justification)
• Approval status and approver

Previous Edits:
${new Date(initiative.startDate).toLocaleDateString()}: Initiative created
[Subsequent edits would be listed here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Save Changes] - Apply changes and route for approval if needed
[Save as Draft] - Save without submitting (visible only to you)
[Cancel] - Discard all changes

⚠ Changes requiring approval will be held pending until approved.
Minor updates (notes, attachments) may be applied immediately.

Click 'Save Changes' to update initiative.`);
  };

  const handleUpdateRealized = (initiative: SavingsInitiative) => {
    console.log('Updating realized savings for:', initiative.id);

    const timeElapsed = (Date.now() - new Date(initiative.startDate).getTime()) / (new Date(initiative.endDate).getTime() - new Date(initiative.startDate).getTime());
    const expectedRealization = initiative.targetSavings * timeElapsed;

    alert(`Update Realized Savings: ${initiative.initiative}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initiative: ${initiative.initiative}
ID: ${initiative.id}
Owner: ${initiative.owner}

Target Savings: $${(initiative.targetSavings / 1000).toFixed(1)}K
Current Realized: $${(initiative.realizedSavings / 1000).toFixed(1)}K
Current Achievement: ${initiative.achievementPercent}%

Time Elapsed: ${(timeElapsed * 100).toFixed(0)}% of initiative duration
Expected at This Point: $${(expectedRealization / 1000).toFixed(1)}K
Actual vs. Expected: ${initiative.realizedSavings > expectedRealization ? 'AHEAD OF SCHEDULE ✓' : 'BEHIND SCHEDULE ⚠'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATE REALIZED SAVINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New Realized Savings Amount: $[________]K

Suggested Updates Based on Progress:
○ Conservative: $${((initiative.realizedSavings + (initiative.targetSavings - initiative.realizedSavings) * 0.2) / 1000).toFixed(1)}K
○ Expected: $${(expectedRealization / 1000).toFixed(1)}K
○ Optimistic: $${((initiative.realizedSavings + (initiative.targetSavings - initiative.realizedSavings) * 0.4) / 1000).toFixed(1)}K
○ Enter Custom Amount: $[________]K

SAVINGS CALCULATION METHOD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${initiative.type === 'cost-reduction' ?
`COST REDUCTION CALCULATION:

Old Price/Cost: $[_______] per unit
New Price/Cost: $[_______] per unit
Price Difference: $[_______] per unit

Volume (Period): [_______] units
Calculation: (Old - New) × Volume = $[_______]K

Validation Source:
☐ Invoice comparison (attach invoices)
☐ Purchase order analysis
☐ Payment records
☐ Contract price schedules
☐ Supplier confirmation

Time Period: [From: ____ To: ____]
Annualized Savings: $[_______]K` :

initiative.type === 'cost-avoidance' ?
`COST AVOIDANCE CALCULATION:

Projected/Market Price: $[_______] per unit
Actual Negotiated Price: $[_______] per unit
Cost Avoided: $[_______] per unit

Volume (Period): [_______] units
Calculation: (Projected - Actual) × Volume = $[_______]K

Validation Source:
☐ Supplier price increase notice
☐ Market price index/benchmark
☐ Industry pricing data
☐ Historical trend analysis
☐ Supplier communication

Basis for Projection: [Describe evidence]
Time Period: [From: ____ To: ____]` :

initiative.type === 'process-improvement' ?
`PROCESS IMPROVEMENT CALCULATION:

Process Efficiency Gain:
- Time Saved: [_______] hours per [period]
- Cost Rate: $[_______] per hour
- OR Resource Saved: [_______] FTE
- OR Waste Reduction: $[_______]

Annual Volume/Frequency: [_______]
Calculation: Efficiency × Volume = $[_______]K

Validation Source:
☐ Process metrics/KPIs
☐ Transaction volume data
☐ Time tracking records
☐ Resource utilization reports
☐ Waste/scrap reduction data

Baseline vs. Current: [Provide metrics]` :

`DEMAND MANAGEMENT CALCULATION:

Baseline Usage: [_______] units per [period]
Current Usage: [_______] units per [period]
Usage Reduction: [_______] units

Unit Cost: $[_______] per unit
Calculation: Reduction × Cost = $[_______]K

Validation Source:
☐ Usage/consumption reports
☐ Inventory records
☐ Requisition data
☐ Policy compliance metrics
☐ Volume tracking

Reason for Reduction: [Describe approach]`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supporting Documentation (Required):
☐ Detailed calculation worksheet
☐ Baseline data (invoices, POs, reports)
☐ Current period data (invoices, POs, reports)
☐ Contract or agreement (if applicable)
☐ Supplier confirmation (if applicable)
☐ Financial system extracts
☐ Approvals and sign-offs

Data Sources:
☐ ERP system data
☐ Procurement system
☐ Accounts payable records
☐ Supplier statements
☐ Third-party validation
☐ Other: [Specify]

Validation Level:
○ Self-Reported (Owner validation)
○ Finance Reviewed (Finance dept. verification)
○ Fully Audited (External audit/certification)

Confidence Level in Savings:
○ High (95%+) - Strong documentation, verified
○ Medium (70-95%) - Good documentation, minor assumptions
○ Low (<70%) - Limited documentation, significant assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Impact of Update:

New Achievement: [Calculated]%
Status Change: ${initiative.status} → [May change based on achievement]

${initiative.realizedSavings < initiative.targetSavings * 0.5 ?
`⚠ Current achievement <50%
If update doesn't improve significantly:
• Consider marking as "at-risk"
• Develop recovery action plan
• Increase monitoring frequency` :
initiative.realizedSavings >= initiative.targetSavings ?
`✓ Target achieved or exceeded
Consider:
• Marking as "realized" if complete
• Documenting success factors
• Replicating approach elsewhere` :
`ℹ On track toward target
Continue:
• Regular progress tracking
• Documentation collection
• Milestone monitoring`}

Portfolio Impact:
Current Total Realized: $${(totalRealizedSavings / 1000).toFixed(0)}K
New Total (with update): $[_______]K
Portfolio Achievement: ${overallAchievement.toFixed(1)}% → [New]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROVAL & NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Approval Requirements:
${Math.abs((initiative.realizedSavings - initiative.targetSavings) / initiative.targetSavings) > 0.10 ?
`⚠ Significant variance from target (>10%)
Approval Required:
• Category Manager
• Finance Department` :
`ℹ Within expected variance
Owner approval sufficient`}

Notifications will be sent to:
☑ Initiative owner
☑ Category manager
☑ Finance team (for validation)
${initiative.status === 'at-risk' ? '☑ Procurement leadership (at-risk status)' : ''}

Update Frequency:
Recommended: ${initiative.status === 'at-risk' ? 'Bi-weekly' : 'Monthly'}
Last Update: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update Notes/Comments: [Optional]
_________________________________________________
_________________________________________________

Attachments: [Upload supporting documentation]

[Submit for Validation] - Route to finance for review
[Save Update] - Apply immediately (owner authority)
[Cancel] - Discard changes

All updates are logged with timestamp, user, and justification.`);
  };

  const handleAnalyzePerformance = () => {
    console.log('Analyzing performance...');

    const ownerStats = Array.from(new Set(initiatives.map(i => i.owner))).map(owner => {
      const ownerInitiatives = initiatives.filter(i => i.owner === owner);
      const realized = ownerInitiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
      const target = ownerInitiatives.reduce((sum, i) => sum + i.targetSavings, 0);
      return {
        owner,
        count: ownerInitiatives.length,
        realized,
        target,
        achievement: (realized / target) * 100,
        realizedCount: ownerInitiatives.filter(i => i.status === 'realized').length
      };
    }).sort((a, b) => b.realized - a.realized);

    alert(`Savings Performance Analysis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO PERFORMANCE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Portfolio Metrics:
• Active Initiatives: ${initiatives.length}
• Target Savings: $${(totalTargetSavings / 1000).toFixed(0)}K
• Realized Savings: $${(totalRealizedSavings / 1000).toFixed(0)}K
• Overall Achievement: ${overallAchievement.toFixed(1)}%
• Portfolio Value at Risk: $${(initiatives.filter(i => i.status === 'at-risk').reduce((sum, i) => sum + i.targetSavings, 0) / 1000).toFixed(0)}K

Performance Rating: ${
  overallAchievement >= 110 ? '⭐⭐⭐ EXCELLENT - Exceeding targets significantly' :
  overallAchievement >= 100 ? '⭐⭐ GOOD - Meeting targets' :
  overallAchievement >= 90 ? '⭐ FAIR - Close to targets' :
  '⚠ NEEDS IMPROVEMENT - Below expectations'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OWNER PERFORMANCE SCORECARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ownerStats.map((stat, idx) =>
`${idx + 1}. ${stat.owner}
   Initiatives: ${stat.count} (${stat.realizedCount} realized, ${stat.count - stat.realizedCount} in progress)
   Total Realized: $${(stat.realized / 1000).toFixed(0)}K
   Achievement: ${stat.achievement.toFixed(0)}% of target
   Rating: ${stat.achievement >= 100 ? '⭐ Exceeds Expectations' : stat.achievement >= 90 ? '✓ Meets Expectations' : '⚠ Needs Improvement'}`
).join('\n\n')}

Average Achievement per Owner: ${(ownerStats.reduce((sum, s) => sum + s.achievement, 0) / ownerStats.length).toFixed(0)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVINGS TYPE PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${['cost-reduction', 'cost-avoidance', 'process-improvement', 'demand-management'].map(type => {
  const typeInitiatives = initiatives.filter(i => i.type === type);
  const typeRealized = typeInitiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
  const typeTarget = typeInitiatives.reduce((sum, i) => sum + i.targetSavings, 0);
  const typeAchievement = (typeRealized / typeTarget) * 100;
  return `${type.toUpperCase()}:
  Initiatives: ${typeInitiatives.length}
  Target: $${(typeTarget / 1000).toFixed(0)}K | Realized: $${(typeRealized / 1000).toFixed(0)}K
  Achievement: ${typeAchievement.toFixed(0)}%
  Success Rate: ${((typeInitiatives.filter(i => i.status === 'realized').length / typeInitiatives.length) * 100).toFixed(0)}%`;
}).join('\n\n')}

Best Performing Type: ${
  ['cost-reduction', 'cost-avoidance', 'process-improvement', 'demand-management']
    .map(type => ({
      type,
      achievement: (initiatives.filter(i => i.type === type).reduce((sum, i) => sum + i.realizedSavings, 0) /
                   initiatives.filter(i => i.type === type).reduce((sum, i) => sum + i.targetSavings, 0)) * 100
    }))
    .sort((a, b) => b.achievement - a.achievement)[0].type
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top Categories by Realized Savings:
${Array.from(new Set(initiatives.map(i => i.category)))
  .map(cat => {
    const catInits = initiatives.filter(i => i.category === cat);
    return {
      category: cat,
      realized: catInits.reduce((sum, i) => sum + i.realizedSavings, 0),
      count: catInits.length
    };
  })
  .sort((a, b) => b.realized - a.realized)
  .slice(0, 5)
  .map((item, idx) => `${idx + 1}. ${item.category}: $${(item.realized / 1000).toFixed(0)}K (${item.count} initiatives)`)
  .join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS FACTORS ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

High-Performing Initiatives (>110% achievement):
${initiatives.filter(i => i.achievementPercent > 110)
  .slice(0, 3)
  .map(i => `• ${i.initiative} - ${i.achievementPercent}% (${i.owner})`)
  .join('\n')}

Common Success Factors:
✓ Clear baseline documentation
✓ Realistic targets and timelines
✓ Strong owner engagement
✓ Regular progress tracking
✓ Effective supplier partnerships

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AREAS FOR IMPROVEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At-Risk Initiatives: ${initiatives.filter(i => i.status === 'at-risk').length}
${initiatives.filter(i => i.status === 'at-risk').map(i =>
  `• ${i.initiative} - ${i.achievementPercent}% (Owner: ${i.owner})`
).join('\n')}

Underperforming Categories:
${Array.from(new Set(initiatives.map(i => i.category)))
  .map(cat => {
    const catInits = initiatives.filter(i => i.category === cat);
    const achievement = (catInits.reduce((sum, i) => sum + i.realizedSavings, 0) /
                        catInits.reduce((sum, i) => sum + i.targetSavings, 0)) * 100;
    return { category: cat, achievement };
  })
  .filter(item => item.achievement < 80)
  .sort((a, b) => a.achievement - b.achievement)
  .slice(0, 3)
  .map(item => `• ${item.category}: ${item.achievement.toFixed(0)}% achievement`)
  .join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Portfolio Level:
1. Focus resources on ${initiatives.filter(i => i.status === 'at-risk').length} at-risk initiatives
2. Replicate success factors from high-performing initiatives
3. Increase pipeline to offset at-risk value
4. Improve validation documentation for cost avoidance
5. Accelerate realization on projected initiatives near completion

Owner Development:
1. Share best practices from top performers
2. Provide additional support to owners with <90% achievement
3. Enhance training on savings calculation and validation
4. Improve communication and reporting templates

Process Improvements:
1. Strengthen baseline documentation requirements
2. Implement more frequent progress checkpoints
3. Enhance financial validation processes
4. Develop category-specific playbooks
5. Create initiative recovery toolkit

Click 'Export Performance Report' to generate detailed analysis with visualizations.`);
  };

  const handleViewSupplierSavings = () => {
    console.log('Viewing supplier savings...');

    const supplierSavings = Array.from(new Set(initiatives.filter(i => i.supplier).map(i => i.supplier!)))
      .map(supplier => {
        const supplierInits = initiatives.filter(i => i.supplier === supplier);
        return {
          supplier,
          count: supplierInits.length,
          realized: supplierInits.reduce((sum, i) => sum + i.realizedSavings, 0),
          target: supplierInits.reduce((sum, i) => sum + i.targetSavings, 0)
        };
      })
      .sort((a, b) => b.realized - a.realized);

    alert(`Savings by Supplier

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER-SPECIFIC SAVINGS ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Initiatives with Supplier Assignment: ${initiatives.filter(i => i.supplier).length} of ${initiatives.length}
Total Supplier-Related Savings: $${(initiatives.filter(i => i.supplier).reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP SUPPLIERS BY SAVINGS REALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${supplierSavings.length > 0 ? supplierSavings.map((item, idx) =>
`${idx + 1}. ${item.supplier}
   Initiatives: ${item.count}
   Target Savings: $${(item.target / 1000).toFixed(0)}K
   Realized Savings: $${(item.realized / 1000).toFixed(0)}K
   Achievement: ${((item.realized / item.target) * 100).toFixed(0)}%

   Initiative Details:
${initiatives.filter(i => i.supplier === item.supplier).map(ini =>
  `   • ${ini.initiative}
     Type: ${ini.type} | Status: ${ini.status}
     Realized: $${(ini.realizedSavings / 1000).toFixed(0)}K (${ini.achievementPercent}%)`
).join('\n')}`
).join('\n\n') : 'No supplier-specific initiatives found.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER SAVINGS OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppliers with Multiple Successful Initiatives:
${supplierSavings.filter(s => s.count >= 2 && (s.realized / s.target) >= 1.0).map(s =>
  `✓ ${s.supplier} - ${s.count} successful initiatives ($${(s.realized / 1000).toFixed(0)}K)`
).join('\n') || 'N/A'}

Potential for Additional Savings:
• Review contracts with high-performing suppliers for additional opportunities
• Replicate successful approaches to other suppliers in same category
• Consolidate spend with suppliers delivering consistent savings
• Negotiate multi-year agreements for predictable savings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER RELATIONSHIP INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strategic Partnerships:
${supplierSavings.filter(s => s.realized >= 100000).map(s =>
  `• ${s.supplier}: High-value partner ($${(s.realized / 1000).toFixed(0)}K realized)`
).join('\n') || '• No high-value partnerships identified yet'}

Collaborative Savings Initiatives:
• ${supplierSavings.filter(s => (s.realized / s.target) > 1.0).length} suppliers exceeded targets
• ${supplierSavings.filter(s => (s.realized / s.target) >= 0.9).length} suppliers meeting/exceeding 90% of targets
• ${supplierSavings.filter(s => (s.realized / s.target) < 0.8).length} suppliers underperforming (<80% achievement)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL VS. SUPPLIER-DRIVEN SAVINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supplier-Related Initiatives:
• Count: ${initiatives.filter(i => i.supplier).length}
• Realized: $${(initiatives.filter(i => i.supplier).reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => i.supplier).reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%

Internal Initiatives (No Supplier):
• Count: ${initiatives.filter(i => !i.supplier).length}
• Realized: $${(initiatives.filter(i => !i.supplier).reduce((sum, i) => sum + i.realizedSavings, 0) / 1000).toFixed(0)}K
• % of Total: ${((initiatives.filter(i => !i.supplier).reduce((sum, i) => sum + i.realizedSavings, 0) / totalRealizedSavings) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPLIER ENGAGEMENT RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

High Priority:
1. Schedule strategic business reviews with top ${Math.min(3, supplierSavings.length)} suppliers
2. Explore additional savings opportunities with successful partners
3. Develop supplier innovation program for continuous improvement

Medium Priority:
4. Address underperforming initiatives with relevant suppliers
5. Benchmark savings across similar suppliers in same categories
6. Create supplier savings recognition program

Low Priority:
7. Expand supplier savings tracking to more categories
8. Develop supplier-specific savings targets and KPIs
9. Create supplier collaboration playbook

Click 'Export Supplier Report' to generate detailed supplier savings analysis.`);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Savings Tracking Dashboard</h2>
              <p className="text-blue-100">Monitor cost savings, avoidance, and process improvements</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRecordSavings}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              title="Record New Savings"
            >
              <Plus className="h-4 w-4" />
              <span>New Initiative</span>
            </button>
            <button
              onClick={handleViewTrends}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="View Trends"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Trends</span>
            </button>
            <button
              onClick={handleExportSavingsReport}
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
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Target Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalTargetSavings / 1000).toFixed(0)}K
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Realized Savings</p>
              <p className="text-2xl font-bold text-green-600">
                ${(totalRealizedSavings / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievement</p>
              <p className="text-2xl font-bold text-purple-600">
                {overallAchievement.toFixed(0)}%
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Initiatives</p>
              <p className="text-2xl font-bold text-gray-900">
                {initiatives.length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {initiatives.filter(i => i.status === 'at-risk').length}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Savings by Type */}
      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Savings by Type</h3>
        <div className="space-y-3">
          {[
            { type: 'cost-reduction' as SavingsType, label: 'Cost Reduction' },
            { type: 'cost-avoidance' as SavingsType, label: 'Cost Avoidance' },
            { type: 'process-improvement' as SavingsType, label: 'Process Improvement' },
            { type: 'demand-management' as SavingsType, label: 'Demand Management' },
          ].map((category) => {
            const categoryInitiatives = initiatives.filter(i => i.type === category.type);
            const categoryTotal = categoryInitiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
            return (
              <div key={category.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{category.label}</span>
                  <span className="text-sm font-semibold text-gray-900">${(categoryTotal / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${category.type === 'cost-reduction' ? 'bg-purple-500' : category.type === 'cost-avoidance' ? 'bg-blue-500' : category.type === 'process-improvement' ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(categoryTotal / totalRealizedSavings) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Savings Initiatives</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Initiative</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Target</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Realized</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Achievement</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Period</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initiatives.map((initiative) => (
                <tr key={initiative.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{initiative.initiative}</div>
                    {initiative.supplier && (
                      <div className="text-xs text-gray-500">Supplier: {initiative.supplier}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsTypeColor(initiative.type)}`}>
                      {initiative.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{initiative.category}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{initiative.owner}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsStatusColor(initiative.status)}`}>
                      {initiative.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${(initiative.targetSavings / 1000).toFixed(0)}K
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                    ${(initiative.realizedSavings / 1000).toFixed(0)}K
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            initiative.achievementPercent >= 100 ? 'bg-green-500' :
                            initiative.achievementPercent >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(initiative.achievementPercent, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getAchievementColor(initiative.achievementPercent)}`}>
                        {initiative.achievementPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <div>{initiative.startDate}</div>
                    <div className="text-xs">to {initiative.endDate}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewInitiativeDetails(initiative)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">View</span>
                      </button>
                      <button
                        onClick={() => handleUpdateRealized(initiative)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                        title="Update Realized Savings"
                      >
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Update</span>
                      </button>
                      <button
                        onClick={() => handleEditInitiative(initiative)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                        title="Edit Initiative"
                      >
                        <Edit className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700">Edit</span>
                      </button>
                      <button
                        onClick={() => handleCategorizeSavings(initiative)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-orange-300 bg-orange-50 rounded-lg hover:bg-orange-100 text-sm transition-colors"
                        title="Categorize"
                      >
                        <FileText className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700">Category</span>
                      </button>
                      <button
                        onClick={() => handleExportSavingsReport()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-sm transition-colors"
                        title="Export Savings Report"
                      >
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-700">Export</span>
                      </button>
                      <button
                        onClick={() => handleAnalyzePerformance()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-pink-300 bg-pink-50 rounded-lg hover:bg-pink-100 text-sm transition-colors"
                        title="Analyze Performance"
                      >
                        <BarChart3 className="w-4 h-4 text-pink-600" />
                        <span className="text-pink-700">Analyze</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsTracking;
