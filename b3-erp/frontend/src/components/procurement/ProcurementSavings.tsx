'use client';

import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Target, Zap, BarChart3, Award, Plus,
  Edit, Download, RefreshCw, Settings, CheckCircle, XCircle,
  AlertCircle, FileText, Calendar, Star, TrendingDown, Activity,
  Percent, Package, Clock, Filter, Search, Eye, Send, ArrowUpRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export interface SavingsInitiative {
  id: string;
  name: string;
  category: string;
  type: 'price-reduction' | 'volume-consolidation' | 'process-improvement' | 'demand-management' | 'supplier-negotiation';
  targetSavings: number;
  actualSavings: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  owner: string;
  startDate: string;
  endDate: string;
  progress: number;
}

const ProcurementSavings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [showForecast, setShowForecast] = useState(true);
  const [showRealTimeTracking, setShowRealTimeTracking] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock data - Savings initiatives
  const savingsInitiatives: SavingsInitiative[] = [
    {
      id: 'SAV001',
      name: 'Supplier Consolidation - Electronics',
      category: 'Electronic Components',
      type: 'supplier-negotiation',
      targetSavings: 85000,
      actualSavings: 92000,
      status: 'completed',
      owner: 'Sarah Johnson',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      progress: 100
    },
    {
      id: 'SAV002',
      name: 'Volume Discount Program - Raw Materials',
      category: 'Raw Materials',
      type: 'volume-consolidation',
      targetSavings: 120000,
      actualSavings: 98000,
      status: 'active',
      owner: 'Michael Chen',
      startDate: '2025-03-01',
      endDate: '2025-12-31',
      progress: 75
    },
    {
      id: 'SAV003',
      name: 'Process Automation - Purchase Orders',
      category: 'Process Improvement',
      type: 'process-improvement',
      targetSavings: 45000,
      actualSavings: 52000,
      status: 'completed',
      owner: 'Emily Davis',
      startDate: '2025-02-01',
      endDate: '2025-07-31',
      progress: 100
    },
    {
      id: 'SAV004',
      name: 'Specification Standardization',
      category: 'IT Equipment',
      type: 'demand-management',
      targetSavings: 65000,
      actualSavings: 48000,
      status: 'active',
      owner: 'Robert Wilson',
      startDate: '2025-04-15',
      endDate: '2025-11-30',
      progress: 65
    },
    {
      id: 'SAV005',
      name: 'Contract Renegotiation - Services',
      category: 'Professional Services',
      type: 'supplier-negotiation',
      targetSavings: 78000,
      actualSavings: 82000,
      status: 'completed',
      owner: 'Lisa Anderson',
      startDate: '2025-01-01',
      endDate: '2025-05-31',
      progress: 100
    },
    {
      id: 'SAV006',
      name: 'SKU Rationalization - Office Supplies',
      category: 'Office Supplies',
      type: 'demand-management',
      targetSavings: 32000,
      actualSavings: 28000,
      status: 'active',
      owner: 'David Lee',
      startDate: '2025-05-01',
      endDate: '2025-12-31',
      progress: 80
    }
  ];

  // Mock data - Monthly savings
  const monthlySavings = [
    { month: 'Jul', target: 40000, actual: 45000, cumulative: 320000 },
    { month: 'Aug', target: 42000, actual: 48000, cumulative: 368000 },
    { month: 'Sep', target: 40000, actual: 38000, cumulative: 406000 },
    { month: 'Oct', target: 45000, actual: 52000, cumulative: 458000 },
    { month: 'Nov', target: 43000, actual: 51000, cumulative: 509000 },
    { month: 'Dec', target: 50000, actual: 0, cumulative: 509000 }
  ];

  // Mock data - Savings by type
  const savingsByType = [
    { type: 'Price Reduction', savings: 125000, percentage: 28, initiatives: 8 },
    { type: 'Volume Consolidation', savings: 110000, percentage: 25, initiatives: 6 },
    { type: 'Supplier Negotiation', savings: 98000, percentage: 22, initiatives: 5 },
    { type: 'Demand Management', savings: 75000, percentage: 17, initiatives: 7 },
    { type: 'Process Improvement', savings: 42000, percentage: 8, initiatives: 4 }
  ];

  // Mock data - Savings by category
  const savingsByCategory = [
    { category: 'Electronic Components', savings: 92000, target: 85000, achievement: 108 },
    { category: 'Raw Materials', savings: 98000, target: 120000, achievement: 82 },
    { category: 'Professional Services', savings: 82000, target: 78000, achievement: 105 },
    { category: 'IT Equipment', savings: 48000, target: 65000, achievement: 74 },
    { category: 'Process Improvement', savings: 52000, target: 45000, achievement: 116 },
    { category: 'Office Supplies', savings: 28000, target: 32000, achievement: 88 }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSavingsTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'price-reduction': 'bg-green-100 text-green-800',
      'volume-consolidation': 'bg-blue-100 text-blue-800',
      'process-improvement': 'bg-purple-100 text-purple-800',
      'demand-management': 'bg-orange-100 text-orange-800',
      'supplier-negotiation': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const totalTargetSavings = savingsInitiatives.reduce((sum, i) => sum + i.targetSavings, 0);
  const totalActualSavings = savingsInitiatives.reduce((sum, i) => sum + i.actualSavings, 0);
  const totalInitiatives = savingsInitiatives.length;

  // Handler functions
  const handleCalculateSavings = () => {
    console.log('Calculating savings...');
    alert(`Calculate Procurement Savings

SAVINGS CALCULATION WIZARD

━━━ STEP 1: SELECT CALCULATION METHOD ━━━

Choose calculation approach:

1. PRICE VARIANCE METHOD
   Compare current price vs. baseline price

   Formula: (Baseline Price - Current Price) × Volume

   Best for:
   • Negotiated price reductions
   • Market price improvements
   • Contract renegotiations

2. AVOIDED COST METHOD
   Calculate costs that were prevented

   Formula: (Old Process Cost - New Process Cost) × Volume

   Best for:
   • Process improvements
   • Specification changes
   • Demand management

3. VOLUME CONSOLIDATION METHOD
   Savings from increased purchase volume

   Formula: Volume Discount % × Total Spend

   Best for:
   • Supplier consolidation
   • Volume commitments
   • Pooled purchasing

4. BUDGET REDUCTION METHOD
   Reduction in planned budget

   Formula: Previous Budget - Current Budget

   Best for:
   • Strategic sourcing
   • Category optimization
   • Spend reduction programs

━━━ STEP 2: BASELINE ESTABLISHMENT ━━━

Define Baseline:

Baseline Type:
○ Previous price paid (recommended)
○ Market price
○ Budget allocation
○ Quote/proposal price
○ Custom baseline

Baseline Period:
• Start Date: [__/__/____]
• End Date: [__/__/____]
• Price: $[_____________]
• Volume: [_______] units

Baseline Documentation:
☐ Historical purchase orders
☐ Contract pricing
☐ Market indices
☐ Approved budget
☐ RFQ responses

━━━ STEP 3: CURRENT STATE DATA ━━━

Enter Current Information:

Current Price: $[_____________]
Current Volume: [_______] units
Effective Date: [__/__/____]

Supporting Documentation:
☐ New purchase order
☐ Updated contract
☐ Supplier invoice
☐ Market data
☐ Approval documents

━━━ STEP 4: CALCULATE SAVINGS ━━━

Calculation:

Baseline:
• Price: $[From Step 2]
• Volume: [From Step 2]
• Total: $[Calculated]

Current:
• Price: $[From Step 3]
• Volume: [From Step 3]
• Total: $[Calculated]

Savings Calculation:
• Unit Savings: $[Price Difference]
• Volume: [Units]
• Total Annual Savings: $[Calculated]

One-Time vs. Recurring:
○ One-time savings
● Recurring savings
  Annual run rate: $[_______]
  Duration: [___] years

━━━ STEP 5: VALIDATION & APPROVAL ━━━

Savings Validation:

Reasonability Check:
• Savings % of baseline: [___]%
• Industry benchmark: [___]%
• ☐ Within acceptable range (<30%)
• ${Math.random() > 0.3 ? '✓ Passes reasonability test' : '⚠ Requires additional justification'}

Supporting Evidence:
☐ Price comparison documentation
☐ Contract amendments
☐ Supplier confirmation
☐ Finance approval
☐ Category manager signoff

Approval Required:
${totalActualSavings > 100000 ? '• CFO approval (>$100K)\n' : ''}• Finance Director approval
• Category Manager approval
• Procurement Director approval

━━━ STEP 6: CATEGORIZATION ━━━

Savings Classification:

Savings Type:
○ Hard Savings (price reduction, directly visible)
● Soft Savings (cost avoidance, process improvement)
○ Cost Avoidance (future cost prevented)

Category:
[Select ▼]
${Array.from(new Set(savingsInitiatives.map(s => s.category))).map(cat => `  - ${cat}`).join('\n')}

Initiative Association:
• Link to Initiative: [Select existing or create new ▼]
• Owner: [Select User ▼]
• Tracking Period: [Select ▼]

━━━ STEP 7: REPORTING & TRACKING ━━━

Savings Tracking:

Reporting Frequency:
○ Monthly
● Quarterly
○ Annually

KPIs to Track:
☑ Savings achievement vs. target
☑ Run rate realization
☑ Sustainability (maintained over time)
☑ Attribution accuracy

Notifications:
☑ Monthly savings report to owner
☑ Quarterly executive summary
☑ Annual comprehensive review
☑ Alert if savings not realized

━━━ REVIEW & SUBMIT ━━━

Calculation Summary:

Method: [Selected from Step 1]
Baseline: $[From Step 2]
Current: $[From Step 3]
Savings: $[Calculated]
Type: [From Step 6]
Status: Pending Approval

Confidence Level: ${Math.floor(Math.random() * 20) + 75}%
Supporting Docs: ${Math.floor(Math.random() * 5) + 3} attached

[Calculate & Save] [Save as Draft] [Cancel]

Note: All savings claims require documentation and approval per company policy.`);
  };

  const handleTrackInitiatives = () => {
    console.log('Tracking savings initiatives...');
    alert(`Track Savings Initiatives

INITIATIVE TRACKING DASHBOARD

━━━ ACTIVE INITIATIVES (${savingsInitiatives.filter(i => i.status === 'active').length}) ━━━

${savingsInitiatives.filter(i => i.status === 'active').map(init =>
  `${init.name}:
  ID: ${init.id}
  Owner: ${init.owner}
  Category: ${init.category}
  Type: ${init.type.toUpperCase().replace(/-/g, ' ')}

  Savings Progress:
  • Target: $${init.targetSavings.toLocaleString()}
  • Actual: $${init.actualSavings.toLocaleString()}
  • Achievement: ${((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%
  • Progress: ${init.progress}%

  Timeline:
  • Start: ${init.startDate}
  • End: ${init.endDate}
  • Days Remaining: ${Math.floor((new Date(init.endDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))}

  Status: ${init.actualSavings >= init.targetSavings ? '✓ AHEAD OF TARGET' : init.progress > 75 ? '⚠ ON TRACK' : '⚠ BEHIND SCHEDULE'}`
).join('\n\n')}

━━━ COMPLETED INITIATIVES (${savingsInitiatives.filter(i => i.status === 'completed').length}) ━━━

${savingsInitiatives.filter(i => i.status === 'completed').slice(0, 2).map(init =>
  `${init.name}:
  Final Savings: $${init.actualSavings.toLocaleString()}
  vs Target: ${((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%
  Duration: ${Math.floor((new Date(init.endDate).getTime() - new Date(init.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000))} months
  Status: ${init.actualSavings >= init.targetSavings ? '✓ TARGET EXCEEDED' : '✓ COMPLETED'}`
).join('\n\n')}

━━━ INITIATIVE PERFORMANCE SUMMARY ━━━

Overall Performance:
• Total Initiatives: ${totalInitiatives}
• Active: ${savingsInitiatives.filter(i => i.status === 'active').length}
• Completed: ${savingsInitiatives.filter(i => i.status === 'completed').length}
• On-Hold: ${savingsInitiatives.filter(i => i.status === 'on-hold').length}

Savings Achievement:
• Total Target: $${totalTargetSavings.toLocaleString()}
• Total Actual: $${totalActualSavings.toLocaleString()}
• Achievement Rate: ${((totalActualSavings / totalTargetSavings) * 100).toFixed(0)}%
• Avg per Initiative: $${Math.floor(totalActualSavings / totalInitiatives).toLocaleString()}

By Type:
${savingsByType.map(t =>
  `• ${t.type}: $${t.savings.toLocaleString()} (${t.percentage}%) - ${t.initiatives} initiatives`
).join('\n')}

Top Performers:
${savingsInitiatives
  .sort((a, b) => (b.actualSavings / b.targetSavings) - (a.actualSavings / a.targetSavings))
  .slice(0, 3)
  .map((init, idx) =>
    `${idx + 1}. ${init.name}
   Achievement: ${((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%
   Savings: $${init.actualSavings.toLocaleString()}`
  ).join('\n')}

At Risk Initiatives:
${savingsInitiatives
  .filter(i => i.status === 'active' && i.progress < 75 && (i.actualSavings / i.targetSavings) < 0.75)
  .map(init =>
    `⚠ ${init.name}
   Progress: ${init.progress}%
   Achievement: ${((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%
   Action: Review and course correct`
  ).join('\n')}

${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75 && (i.actualSavings / i.targetSavings) < 0.75).length === 0 ? '✓ No at-risk initiatives' : ''}

━━━ TRACKING OPTIONS ━━━

View By:
○ Status
○ Owner
○ Category
○ Type
○ Timeline
○ Achievement

Sort By:
○ Savings amount (high to low)
○ Achievement % (high to low)
○ Progress % (low to high)
○ End date (soonest first)
○ Start date (newest first)

Filter:
☐ Active only
☐ Completed only
☐ Over target
☐ Under target
☐ High priority
☐ This quarter

Actions:
[Update Progress] [Add Initiative] [Export List] [Close]`);
  };

  const handleExportReports = () => {
    console.log('Exporting savings reports...');
    alert(`Export Savings Reports

SAVINGS REPORTING OPTIONS

━━━ REPORT TYPES ━━━

1. EXECUTIVE SUMMARY (PDF)
   • High-level savings overview
   • YTD vs target performance
   • Top initiatives and achievements
   • Trend analysis
   • 2-3 pages, board-ready

2. DETAILED SAVINGS REPORT (Excel)
   • Complete initiative list
   • Savings by category
   • Savings by type
   • Monthly tracking
   • Baseline documentation
   • Full calculations with formulas
   • Pivot tables for analysis

3. INITIATIVE STATUS REPORT (PDF)
   • Active initiative details
   • Progress tracking
   • Owner accountability
   • Timeline and milestones
   • Risk assessment
   • Action items

4. SAVINGS DASHBOARD (PowerPoint)
   • Visual performance charts
   • KPI scorecards
   • Category breakdown
   • Trend analysis
   • Top performers
   • Presentation-ready

5. FINANCIAL SUMMARY (CSV)
   • Raw savings data
   • Monthly actuals
   • Cumulative totals
   • For GL integration
   • Finance team format

6. AUDIT REPORT (PDF)
   • Savings validation
   • Supporting documentation
   • Calculation methodology
   • Approval trail
   • Compliance verification
   • Internal/external audit ready

━━━ REPORT PARAMETERS ━━━

Time Period:
○ Current Month (November 2025)
○ Current Quarter (Q4 2025)
● Year-to-Date (Jan - Nov 2025)
○ Fiscal Year 2025 (Full year)
○ Last 12 Months (Rolling)
○ Custom: [From __/__/____] to [__/__/____]

Include:
☑ Savings summary
☑ Initiative details
☑ Owner information
☑ Timeline and progress
☑ Achievement vs target
☑ Trend charts
☑ Category breakdown
☑ Type analysis
☑ Top performers
☐ Failed initiatives
☐ Individual transactions
☐ Supplier details

Savings Types:
☑ Hard savings
☑ Soft savings
☑ Cost avoidance
☐ One-time only
☐ Recurring only

━━━ METRICS TO INCLUDE ━━━

Key Performance Indicators:
☑ Total savings: $${totalActualSavings.toLocaleString()}
☑ Target savings: $${totalTargetSavings.toLocaleString()}
☑ Achievement rate: ${((totalActualSavings / totalTargetSavings) * 100).toFixed(0)}%
☑ Active initiatives: ${savingsInitiatives.filter(i => i.status === 'active').length}
☑ Completed initiatives: ${savingsInitiatives.filter(i => i.status === 'completed').length}
☑ Average savings per initiative: $${Math.floor(totalActualSavings / totalInitiatives).toLocaleString()}
☑ YoY growth: ${(Math.random() * 20 + 10).toFixed(1)}%

Breakdown Metrics:
☑ Savings by category
☑ Savings by type
☑ Savings by owner
☑ Monthly trends
☑ Quarterly performance
☑ Initiative status distribution

━━━ COMPARISON & BENCHMARKING ━━━

Compare Against:
☐ Previous year (FY 2024)
☐ Industry benchmark
☐ Company target
☐ Budget plan
☐ Best quarter

Show:
☐ Year-over-year comparison
☐ Quarter-over-quarter
☐ Target vs actual variance
☐ Trend analysis

━━━ DELIVERY & DISTRIBUTION ━━━

Format:
• PDF: Professional, read-only
• Excel: Data analysis, editable
• PowerPoint: Presentations
• CSV: System integration

Distribution:
Recipients:
☑ CFO
☑ Chief Procurement Officer
☑ Finance Director
☑ Category Managers
☐ Initiative Owners
☐ Executive Committee
☐ Board of Directors

Delivery Method:
○ Download now
○ Email to recipients:
  [Enter email addresses]
○ Save to shared folder: [Select ▼]
● All of the above

Schedule Recurring:
○ Weekly
● Monthly (5th of each month)
○ Quarterly (End of quarter)
○ Annually (Year-end)
○ Custom schedule

━━━ CUSTOMIZATION ━━━

Report Branding:
• Company Logo: ☑ Include
• Report Title: Procurement Savings Report
• Confidentiality: ☑ Mark as "Internal Use Only"
• Watermark: ☐ Add "DRAFT" or "FINAL"
• Page Numbers: ☑ Include
• Report ID: Auto-generated

Custom Sections:
☐ Executive message
☐ Success stories
☐ Lessons learned
☐ Best practices
☐ Future opportunities
☐ Action plan

Notes/Comments:
[Add any special instructions or context]
_____________________________________________
_____________________________________________

━━━ GENERATE REPORT ━━━

Report Summary:
• Type: Detailed Savings Report
• Period: YTD 2025
• Format: Excel + PDF Summary
• Recipients: 6
• Estimated Size: ${(Math.random() * 6 + 2).toFixed(1)} MB
• Generation Time: ~${Math.floor(Math.random() * 40) + 20} seconds

Includes:
• ${totalInitiatives} initiatives
• $${totalActualSavings.toLocaleString()} total savings
• ${savingsByCategory.length} categories
• ${savingsByType.length} savings types
• ${monthlySavings.length} months of data

[Generate Now] [Preview] [Schedule] [Cancel]`);
  };

  const handleComparePeriods = () => {
    console.log('Comparing periods...');
    alert(`Compare Savings Periods

PERIOD COMPARISON ANALYSIS

━━━ SELECT PERIODS ━━━

Period A (Current):
● Year-to-Date 2025 (Jan - Nov)
○ Q4 2025 (Oct - Dec)
○ FY 2025 (Full year)
○ Custom: [From __/__/__] to [__/__/__]

Period B (Comparison):
○ Same period last year (YTD 2024)
● Previous year (FY 2024)
○ Previous quarter (Q3 2025)
○ Budget/Target
○ Custom: [From __/__/__] to [__/__/__]

━━━ OVERALL COMPARISON ━━━

                    YTD 2025        FY 2024         Change
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Savings:      $${totalActualSavings.toLocaleString()}    $${Math.floor(totalActualSavings * 0.85).toLocaleString()}    +${((totalActualSavings / (totalActualSavings * 0.85) - 1) * 100).toFixed(1)}%
Target:             $${totalTargetSavings.toLocaleString()}    $${Math.floor(totalTargetSavings * 0.90).toLocaleString()}    +${((totalTargetSavings / (totalTargetSavings * 0.90) - 1) * 100).toFixed(1)}%
Achievement:        ${((totalActualSavings / totalTargetSavings) * 100).toFixed(0)}%         ${Math.floor(Math.random() * 10) + 85}%         ${(((totalActualSavings / totalTargetSavings) * 100) - (Math.floor(Math.random() * 10) + 85)).toFixed(0)}pp
Initiatives:        ${totalInitiatives}              ${Math.floor(totalInitiatives * 0.88)}              +${totalInitiatives - Math.floor(totalInitiatives * 0.88)}
Avg per Init:       $${Math.floor(totalActualSavings / totalInitiatives).toLocaleString()}    $${Math.floor((totalActualSavings * 0.85) / (totalInitiatives * 0.88)).toLocaleString()}    +${((Math.floor(totalActualSavings / totalInitiatives) / Math.floor((totalActualSavings * 0.85) / (totalInitiatives * 0.88))) - 1) * 100).toFixed(1)}%

━━━ CATEGORY COMPARISON ━━━

${savingsByCategory.slice(0, 4).map(cat => {
  const lastYear = cat.savings * (Math.random() * 0.3 + 0.7);
  const change = ((cat.savings / lastYear - 1) * 100).toFixed(1);
  return `${cat.category}:
  YTD 2025: $${cat.savings.toLocaleString()}
  FY 2024: $${lastYear.toLocaleString()}
  Change: ${change}% ${parseFloat(change) > 0 ? '↗' : '↘'}
  Target Achievement: ${cat.achievement}%`;
}).join('\n\n')}

━━━ TYPE COMPARISON ━━━

${savingsByType.slice(0, 3).map(type => {
  const lastYear = type.savings * (Math.random() * 0.3 + 0.75);
  return `${type.type}:
  YTD 2025: $${type.savings.toLocaleString()} (${type.percentage}%)
  FY 2024: $${lastYear.toLocaleString()} (${(lastYear / (totalActualSavings * 0.85) * 100).toFixed(0)}%)
  Change: ${((type.savings / lastYear - 1) * 100).toFixed(1)}%
  Initiatives: ${type.initiatives} (YTD 2025) vs ${Math.floor(type.initiatives * 0.9)} (FY 2024)`;
}).join('\n\n')}

━━━ MONTHLY TREND COMPARISON ━━━

Month-by-Month:
${monthlySavings.slice(0, 5).map((m, idx) => {
  const lastYear = m.actual * (Math.random() * 0.3 + 0.7);
  return `${m.month} 2025: $${m.actual.toLocaleString()} vs ${m.month} 2024: $${lastYear.toLocaleString()} (${((m.actual / lastYear - 1) * 100).toFixed(1)}%)`;
}).join('\n')}

Trend Analysis:
• YTD 2025 Average: $${Math.floor(monthlySavings.slice(0, 5).reduce((sum, m) => sum + m.actual, 0) / 5).toLocaleString()}/month
• FY 2024 Average: $${Math.floor(monthlySavings.slice(0, 5).reduce((sum, m) => sum + m.actual, 0) / 5 * 0.8).toLocaleString()}/month
• Growth: ${((Math.floor(monthlySavings.slice(0, 5).reduce((sum, m) => sum + m.actual, 0) / 5) / Math.floor(monthlySavings.slice(0, 5).reduce((sum, m) => sum + m.actual, 0) / 5 * 0.8) - 1) * 100).toFixed(1)}%

━━━ INITIATIVE PERFORMANCE ━━━

Completion Rate:
• YTD 2025: ${savingsInitiatives.filter(i => i.status === 'completed').length} completed (${((savingsInitiatives.filter(i => i.status === 'completed').length / totalInitiatives) * 100).toFixed(0)}%)
• FY 2024: ${Math.floor(totalInitiatives * 0.88 * 0.65)} completed (${(0.65 * 100).toFixed(0)}%)

Success Rate (Met or Exceeded Target):
• YTD 2025: ${savingsInitiatives.filter(i => i.actualSavings >= i.targetSavings).length} (${((savingsInitiatives.filter(i => i.actualSavings >= i.targetSavings).length / totalInitiatives) * 100).toFixed(0)}%)
• FY 2024: ${Math.floor(totalInitiatives * 0.88 * 0.55)} (${(0.55 * 100).toFixed(0)}%)

Over-Achievement:
• YTD 2025: Average ${((savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).reduce((sum, i) => sum + (i.actualSavings / i.targetSavings - 1), 0) / savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).length) * 100).toFixed(0)}% above target
• FY 2024: Average ${Math.floor(Math.random() * 10) + 8}% above target

━━━ KEY INSIGHTS ━━━

Improvements:
${totalActualSavings > totalActualSavings * 0.85 ? `✓ Total savings increased by ${((totalActualSavings / (totalActualSavings * 0.85) - 1) * 100).toFixed(1)}%\n` : ''}${totalInitiatives > totalInitiatives * 0.88 ? `✓ More initiatives launched (+${totalInitiatives - Math.floor(totalInitiatives * 0.88)})\n` : ''}${(totalActualSavings / totalTargetSavings) > 0.90 ? `✓ Higher target achievement rate\n` : ''}✓ Improved average savings per initiative

Areas of Focus:
${savingsByCategory.filter(c => c.achievement < 100).length > 0 ? `• ${savingsByCategory.filter(c => c.achievement < 100).length} categories below target\n` : ''}${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length > 0 ? `• ${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length} at-risk active initiatives\n` : ''}• Opportunity for ${Math.floor(Math.random() * 15) + 10}% more savings

Trends:
• Shift toward ${savingsByType[0].type} (${savingsByType[0].percentage}% of total)
• ${savingsByCategory[0].category} remains top category
• ${totalActualSavings > totalActualSavings * 0.85 ? 'Increasing' : 'Stable'} savings trajectory
• ${savingsInitiatives.filter(i => i.status === 'completed').length > Math.floor(totalInitiatives * 0.88 * 0.65) ? 'Higher' : 'Similar'} completion rate

━━━ ACTIONS ━━━

[Export Comparison] [Add Period] [View Details] [Close]`);
  };

  const handleCreateInitiative = () => {
    console.log('Creating savings initiative...');
    alert(`Create Savings Initiative

NEW SAVINGS INITIATIVE WIZARD

━━━ STEP 1: INITIATIVE BASICS ━━━

Initiative Information:

• Initiative Name: [_______________]
  (Example: "Supplier Consolidation - Office Supplies")

• Description: [_______________]
  [_______________]
  [_______________]

• Category: [Select ▼]
${Array.from(new Set(savingsInitiatives.map(s => s.category))).map(cat => `  - ${cat}`).join('\n')}
  - Other: [Specify]

• Type: [Select ▼]
  - Price Reduction
  - Volume Consolidation
  - Supplier Negotiation
  - Process Improvement
  - Demand Management
  - Specification Change
  - Other: [Specify]

━━━ STEP 2: TARGETS & TIMELINE ━━━

Financial Targets:

Target Annual Savings: $[_____________]

Breakdown:
• One-Time Savings: $[_______]
• Recurring Annual Savings: $[_______]
• Duration (years): [___]
• Total Lifetime Savings: $[Calculated]

Confidence Level:
○ High (>80% confident)
○ Medium (50-80% confident)
○ Low (<50% confident)

Timeline:

Start Date: [__/__/____]
End Date: [__/__/____]
Duration: [Calculated] months

Key Milestones:
1. [Milestone name]: [__/__/____]
2. [Milestone name]: [__/__/____]
3. [Milestone name]: [__/__/____]

━━━ STEP 3: OWNERSHIP & TEAM ━━━

Responsibility Assignment:

Initiative Owner: [Select User ▼]
• Overall accountability
• Progress reporting
• Stakeholder management

Supporting Team:
☐ Category Manager: [Select ▼]
☐ Finance Representative: [Select ▼]
☐ Supplier Manager: [Select ▼]
☐ Operations Lead: [Select ▼]
☐ Other: [_______________]

Executive Sponsor: [Select ▼]
• Required for initiatives >$100K
• Provides strategic direction
• Removes blockers

Approvers:
☐ Category Manager
☐ Finance Director
☐ Procurement Director
${totalTargetSavings > 100000 ? '☐ CFO (required for >$100K)\n' : ''}

━━━ STEP 4: BASELINE & METHODOLOGY ━━━

Savings Calculation:

Baseline Establishment:
• Current State Spend: $[_______]/year
• Baseline Price: $[_______]
• Baseline Volume: [_______] units
• Baseline Period: [__/__/____] to [__/__/____]

Target State:
• Target Price: $[_______]
• Target Volume: [_______] units
• Expected Savings: $[Calculated]

Calculation Method:
○ Price Variance: (Baseline Price - Target Price) × Volume
○ Avoided Cost: (Old Cost - New Cost) × Volume
○ Volume Discount: Discount % × Total Spend
○ Budget Reduction: Previous Budget - New Budget
○ Custom: [Describe methodology]

Supporting Data:
☐ Historical purchase orders
☐ Current contract pricing
☐ Market benchmarks
☐ RFQ/Quote responses
☐ Budget documents
☐ Supplier proposals

━━━ STEP 5: IMPLEMENTATION PLAN ━━━

Action Plan:

Phase 1: Analysis & Planning
• Tasks: [List key tasks]
• Duration: [___] weeks
• Owner: [_______________]
• Deliverables: [_______________]

Phase 2: Execution
• Tasks: [List key tasks]
• Duration: [___] weeks
• Owner: [_______________]
• Deliverables: [_______________]

Phase 3: Validation & Tracking
• Tasks: [List key tasks]
• Duration: [___] weeks
• Owner: [_______________]
• Deliverables: [_______________]

Resource Requirements:
• Staff Time: [___] hours
• Budget: $[_______]
• Systems/Tools: [_______________]
• External Support: [_______________]

━━━ STEP 6: RISKS & DEPENDENCIES ━━━

Risk Assessment:

Potential Risks:
1. [Risk description]
   Probability: [High/Med/Low]
   Impact: [High/Med/Low]
   Mitigation: [_______________]

2. [Risk description]
   Probability: [High/Med/Low]
   Impact: [High/Med/Low]
   Mitigation: [_______________]

Dependencies:
☐ Contract renegotiation
☐ System changes
☐ Process updates
☐ Supplier cooperation
☐ Stakeholder approval
☐ Budget allocation
☐ Other: [_______________]

Success Factors:
☑ Executive sponsorship
☑ Stakeholder buy-in
☑ Clear communication
☑ Adequate resources
☑ Realistic timeline
☑ Measurable outcomes

━━━ STEP 7: TRACKING & REPORTING ━━━

Monitoring Plan:

Progress Tracking:
• Update Frequency: [Monthly ▼]
• Reporting Tool: [Procurement Dashboard ▼]
• Status Reviews: [Weekly/Monthly ▼]

KPIs:
☑ Savings achieved vs target
☑ Timeline adherence
☑ Milestone completion
☑ Risk status
☑ Budget utilization
☑ Stakeholder satisfaction

Reporting:
• Initiative Owner: Weekly updates
• Category Manager: Monthly review
• Executive Sponsor: Quarterly review
• Finance Team: Monthly validation
• Procurement Leadership: Quarterly

━━━ STEP 8: APPROVAL WORKFLOW ━━━

Initiative Approval:

Submitted by: [Current User]
Date: ${new Date().toLocaleDateString()}

Approval Chain:
1. ☐ Category Manager - Review scope and approach
2. ☐ Finance - Validate savings calculation
3. ☐ Procurement Director - Strategic alignment
${totalTargetSavings > 100000 ? '4. ☐ CFO - Financial approval (>$100K)\n' : ''}

Approval Timeline: 5-10 business days

━━━ REVIEW & SUBMIT ━━━

Initiative Summary:

Name: [From Step 1]
Type: [From Step 1]
Target Savings: $[From Step 2]
Timeline: [From Step 2]
Owner: [From Step 3]
Status: Pending Approval

Estimated Impact:
• Annual Savings: $[_______]
• Lifetime Value: $[_______]
• ROI: ${(Math.random() * 300 + 200).toFixed(0)}%
• Payback Period: ${(Math.random() * 6 + 2).toFixed(1)} months

Next Steps:
1. Submit for approval
2. Approval workflow initiated
3. Resources allocated
4. Initiative launch
5. Progress tracking begins

[Submit for Approval] [Save as Draft] [Cancel]

Note: All initiatives require documented baselines and finance validation.`);
  };

  const handleAnalyzeTrends = () => {
    console.log('Analyzing savings trends...');
    const avgMonthlySavings = monthlySavings.slice(0, 5).reduce((sum, m) => sum + m.actual, 0) / 5;
    const trend = monthlySavings[4].actual > monthlySavings[0].actual ? 'INCREASING' : 'DECREASING';

    alert(`Analyze Savings Trends

SAVINGS TREND ANALYSIS

━━━ MONTHLY PERFORMANCE TREND ━━━

Last 6 Months:
${monthlySavings.map((m, idx) =>
  `${m.month}: $${m.actual.toLocaleString()}
  vs Target: $${m.target.toLocaleString()} (${((m.actual / m.target - 1) * 100).toFixed(1)}%)
  Cumulative: $${m.cumulative.toLocaleString()}
  ${idx > 0 ? `MoM Change: ${((m.actual / monthlySavings[idx - 1].actual - 1) * 100).toFixed(1)}%` : ''}`
).join('\n\n')}

Trend Direction: ${trend}
Average Monthly: $${avgMonthlySavings.toLocaleString()}
${trend === 'INCREASING' ? `Growth Rate: ${((monthlySavings[4].actual / monthlySavings[0].actual - 1) * 100 / 4).toFixed(1)}% per month` : `Decline Rate: ${((monthlySavings[0].actual / monthlySavings[4].actual - 1) * 100 / 4).toFixed(1)}% per month`}

━━━ CATEGORY TREND ANALYSIS ━━━

Category Performance:

${savingsByCategory.map(cat =>
  `${cat.category}:
  Current YTD: $${cat.savings.toLocaleString()}
  Target: $${cat.target.toLocaleString()}
  Achievement: ${cat.achievement}%

  Trend: ${cat.achievement > 100 ? '↗ Exceeding target' : cat.achievement > 90 ? '→ On track' : '↘ Below pace'}
  ${cat.achievement < 90 ? `Gap: -$${(cat.target - cat.savings).toLocaleString()}` : `Surplus: +$${(cat.savings - cat.target).toLocaleString()}`}`
).join('\n\n')}

Top Performing: ${savingsByCategory.reduce((max, cat) => cat.achievement > max.achievement ? cat : max).category} (${savingsByCategory.reduce((max, cat) => cat.achievement > max.achievement ? cat : max).achievement}%)
Needs Attention: ${savingsByCategory.reduce((min, cat) => cat.achievement < min.achievement ? cat : min).category} (${savingsByCategory.reduce((min, cat) => cat.achievement < min.achievement ? cat : min).achievement}%)

━━━ SAVINGS TYPE TREND ━━━

Distribution Over Time:

${savingsByType.map(type =>
  `${type.type}:
  Current: $${type.savings.toLocaleString()} (${type.percentage}% of total)
  Initiatives: ${type.initiatives}
  Avg per Initiative: $${Math.floor(type.savings / type.initiatives).toLocaleString()}

  Trend: ${type.percentage > 20 ? '↗ Growing share' : type.percentage > 15 ? '→ Stable' : '↘ Declining'}`
).join('\n\n')}

Dominant Type: ${savingsByType[0].type} (${savingsByType[0].percentage}%)
Emerging: ${savingsByType[savingsByType.length - 1].type} (${savingsByType[savingsByType.length - 1].percentage}%)

━━━ INITIATIVE SUCCESS PATTERNS ━━━

Completion Analysis:

Total Initiatives: ${totalInitiatives}
• Completed: ${savingsInitiatives.filter(i => i.status === 'completed').length} (${((savingsInitiatives.filter(i => i.status === 'completed').length / totalInitiatives) * 100).toFixed(0)}%)
• Active: ${savingsInitiatives.filter(i => i.status === 'active').length} (${((savingsInitiatives.filter(i => i.status === 'active').length / totalInitiatives) * 100).toFixed(0)}%)
• On-Hold: ${savingsInitiatives.filter(i => i.status === 'on-hold').length}

Target Achievement:
• Exceeded Target: ${savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).length} (${((savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).length / totalInitiatives) * 100).toFixed(0)}%)
• Met Target: ${savingsInitiatives.filter(i => i.actualSavings >= i.targetSavings && i.actualSavings <= i.targetSavings * 1.05).length}
• Below Target: ${savingsInitiatives.filter(i => i.actualSavings < i.targetSavings).length}

Success Factors:
${savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).length > 0 ?
  `✓ Successful initiatives average ${((savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).reduce((sum, i) => sum + (i.actualSavings / i.targetSavings), 0) / savingsInitiatives.filter(i => i.actualSavings > i.targetSavings).length - 1) * 100).toFixed(0)}% over target\n` : ''}✓ ${savingsInitiatives.filter(i => i.progress === 100).length} initiatives completed on time
✓ Average initiative duration: ${(savingsInitiatives.reduce((sum, i) => sum + (new Date(i.endDate).getTime() - new Date(i.startDate).getTime()), 0) / totalInitiatives / (30 * 24 * 60 * 60 * 1000)).toFixed(1)} months

━━━ FORECAST & PROJECTIONS ━━━

Year-End Forecast:

Based on Current Trend:
• Projected Dec Savings: $${Math.floor(avgMonthlySavings * (trend === 'INCREASING' ? 1.1 : 0.95)).toLocaleString()}
• Projected YE Total: $${Math.floor(totalActualSavings + (avgMonthlySavings * (trend === 'INCREASING' ? 1.1 : 0.95))).toLocaleString()}
• vs Annual Target: ${Math.floor(Math.random() * 20) + 90}%

Scenarios:

Best Case (30% probability):
• All active initiatives exceed targets
• New opportunities identified
• Projected Total: $${Math.floor(totalActualSavings * 1.15).toLocaleString()}
• vs Target: ${((totalActualSavings * 1.15 / totalTargetSavings) * 100).toFixed(0)}%

Most Likely (50% probability):
• Current pace maintained
• Some variance in active initiatives
• Projected Total: $${Math.floor(totalActualSavings * 1.05).toLocaleString()}
• vs Target: ${((totalActualSavings * 1.05 / totalTargetSavings) * 100).toFixed(0)}%

Worst Case (20% probability):
• Some initiatives delayed/reduced
• Market challenges
• Projected Total: $${Math.floor(totalActualSavings * 0.95).toLocaleString()}
• vs Target: ${((totalActualSavings * 0.95 / totalTargetSavings) * 100).toFixed(0)}%

━━━ INSIGHTS & RECOMMENDATIONS ━━━

Key Insights:
${trend === 'INCREASING' ?
  `✓ Positive momentum - savings trending upward
✓ Current pace will exceed annual target
✓ Strong performance across most categories` :
  `⚠ Savings growth slowing
⚠ May fall short of annual target without action
⚠ Review underperforming initiatives`}

Recommendations:
${trend === 'INCREASING' ?
  `1. Maintain current initiatives and processes
2. Document success factors for replication
3. Identify additional opportunities in high-performing categories
4. Recognize and reward top performers
5. Set stretch goals for Q4` :
  `1. Accelerate at-risk initiatives
2. Launch new quick-win initiatives
3. Focus resources on high-impact categories
4. Review and course-correct underperforming initiatives
5. Consider strategic sourcing events`}

Opportunities:
• ${savingsByCategory.filter(c => c.achievement < 90).length} categories below 90% achievement
• Potential additional savings: $${savingsByCategory.filter(c => c.achievement < 90).reduce((sum, c) => sum + (c.target - c.savings), 0).toLocaleString()}
• ${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length} active initiatives need attention

[Export Analysis] [Set Alerts] [Create Action Plan] [Close]`);
  };

  const handleManageBaselines = () => {
    console.log('Managing baselines...');
    alert(`Manage Savings Baselines

BASELINE MANAGEMENT

━━━ WHAT ARE BASELINES? ━━━

Baselines are reference points used to calculate savings.

Key Principles:
• Must be documented and approved
• Should represent legitimate comparison point
• Cannot be changed without justification
• Subject to finance audit
• Critical for accurate savings tracking

━━━ CURRENT BASELINES ━━━

Active Initiative Baselines:

${savingsInitiatives.filter(i => i.status === 'active').map(init =>
  `${init.name}:
  Initiative ID: ${init.id}

  Baseline Information:
  • Type: ${init.type === 'price-reduction' ? 'Previous Price' : init.type === 'volume-consolidation' ? 'Pre-consolidation Spend' : init.type === 'process-improvement' ? 'Old Process Cost' : 'Budget/Target'}
  • Baseline Amount: $${(init.targetSavings * (Math.random() * 0.3 + 1.2)).toLocaleString()}
  • Baseline Period: Jan-Dec 2024
  • Established Date: ${init.startDate}
  • Approved By: ${init.owner}

  Current State:
  • Current Amount: $${((init.targetSavings * (Math.random() * 0.3 + 1.2)) - init.actualSavings).toLocaleString()}
  • Savings: $${init.actualSavings.toLocaleString()}

  Documentation:
  ☑ Historical POs
  ☑ Contract pricing
  ${Math.random() > 0.5 ? '☑ Market data\n' : ''}  ☑ Finance approval

  Status: ${Math.random() > 0.8 ? '⚠ Requires re-validation' : '✓ Valid'}`
).join('\n\n')}

━━━ BASELINE TYPES ━━━

Supported Baseline Types:

1. HISTORICAL PRICE
   • Previous price paid for same item
   • Based on actual purchase orders
   • Most common and reliable
   • Requires: PO history, invoices

2. MARKET PRICE
   • Industry benchmark or market index
   • Used when no purchase history
   • Requires: Market data source
   • Subject to external validation

3. BUDGET/PLANNED SPEND
   • Approved budget allocation
   • Used for new items/categories
   • Requires: Budget approval
   • Less preferred for savings claims

4. QUOTE/RFQ PRICE
   • Competitive bid prices
   • Used in sourcing events
   • Requires: Documented quotes
   • Must be arms-length

5. COST MODEL
   • Should-cost analysis
   • Engineering-based estimate
   • Requires: Detailed cost breakdown
   • Subject to technical review

━━━ CREATE NEW BASELINE ━━━

Baseline Setup:

Associated Initiative: [Select ▼]
• ${savingsInitiatives[0].name}
• ${savingsInitiatives[1].name}
• Create New Initiative

Baseline Type: [Select ▼]
• Historical Price
• Market Price
• Budget/Planned Spend
• Quote/RFQ Price
• Cost Model

Baseline Details:

Item/Service: [_______________]
Baseline Amount: $[_____________]
Unit of Measure: [Select ▼]
  - Each
  - Pound
  - Kilogram
  - Hour
  - Month
  - Other

Volume/Quantity: [_______]
Total Baseline: $[Calculated]

Baseline Period:
• Start Date: [__/__/____]
• End Date: [__/__/____]
• Duration: [Calculated] months

Supporting Documentation:
☐ Purchase orders: [Upload]
☐ Contracts: [Upload]
☐ Invoices: [Upload]
☐ Market data: [Upload]
☐ Budget documents: [Upload]
☐ Quotes/RFQs: [Upload]
☐ Cost analysis: [Upload]

Baseline Justification:
[Explain why this baseline is appropriate]
_____________________________________________
_____________________________________________
_____________________________________________

Approval Required:
☐ Category Manager
☐ Finance Director
☐ Procurement Director

━━━ UPDATE EXISTING BASELINE ━━━

Select Baseline: [Choose from active initiatives ▼]

Current Baseline: $[Current Amount]
New Baseline: $[_____________]

Reason for Change:
○ Data correction
○ Additional information found
○ Finance audit adjustment
○ Market condition change
○ Other: [Specify]

Impact Analysis:
• Current Savings: $[Current]
• New Savings: $[Calculated]
• Change: $[Difference]
• % Impact: [___]%

Requires CFO approval if change >10%

Justification:
[Detailed explanation required for any baseline change]
_____________________________________________
_____________________________________________
_____________________________________________

Supporting Documentation:
☐ Updated data source
☐ Finance memo
☐ Audit findings
☐ Approval emails

━━━ BASELINE VALIDATION ━━━

Validation Checklist:

Data Quality:
☑ Source documents available
☑ Data is accurate and complete
☑ Timeframe is appropriate
☑ No anomalies or outliers
☑ Consistent with similar items

Reasonability:
☑ Within market range
☑ Consistent with historical trends
☑ Supported by multiple data points
☑ Validated by subject matter expert
☑ Finance review completed

Compliance:
☑ Follows company policy
☑ Meets audit requirements
☑ Properly documented
☑ Approved by authorized personnel
☑ Audit trail maintained

Validation Status:
${Math.random() > 0.7 ? '⚠ Requires additional documentation' : Math.random() > 0.4 ? '✓ Validated - approved for use' : '⚠ Under review'}

━━━ BASELINE AUDIT TRAIL ━━━

Recent Changes:

${Math.floor(Math.random() * 3) + 1} baselines modified in last 30 days
${Math.floor(Math.random() * 5) + 3} baselines created in last 90 days

Change History:
${new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${savingsInitiatives[0].name} baseline established
${new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${savingsInitiatives[1].name} baseline validated
${new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}: Market baseline updated for ${savingsInitiatives[2].name}

Audit Status:
• Last Audit: ${new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
• Next Audit: ${new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
• Findings: ${Math.floor(Math.random() * 3)} minor issues
• Status: ${Math.random() > 0.7 ? '⚠ Action items pending' : '✓ Compliant'}

━━━ BEST PRACTICES ━━━

Baseline Guidelines:

DO:
✓ Use most recent representative data
✓ Document source and methodology
✓ Get finance approval
✓ Maintain audit trail
✓ Review annually
✓ Use conservative estimates
✓ Include all relevant costs

DON'T:
✗ Cherry-pick favorable data
✗ Use unrealistic baselines
✗ Change without justification
✗ Mix time periods
✗ Ignore market conditions
✗ Skip documentation
✗ Assume approval

[Create Baseline] [Update Existing] [Run Audit] [Close]

⚠ All baselines subject to finance validation and periodic audit.`);
  };

  const handleRefresh = () => {
    console.log('Refreshing savings data...');
    alert(`Refresh Savings Data

Synchronizing from all systems:
✓ Savings initiatives database
✓ Financial system
✓ Purchase order system
✓ Contract management
✓ Budget tracking
✓ Approval workflows

Updated Information:
• Total Initiatives: ${totalInitiatives}
• Active Initiatives: ${savingsInitiatives.filter(i => i.status === 'active').length}
• Total Savings YTD: $${totalActualSavings.toLocaleString()}
• Target Achievement: ${((totalActualSavings / totalTargetSavings) * 100).toFixed(0)}%

Recent Changes (Last 24 Hours):
• ${Math.floor(Math.random() * 3)} initiatives updated
• ${Math.floor(Math.random() * 5)} savings validations completed
• ${Math.floor(Math.random() * 2)} new baselines established
• ${Math.floor(Math.random() * 4)} progress reports submitted

Data Quality:
• Completeness: 99.${Math.floor(Math.random() * 9) + 1}%
• Accuracy: 99.${Math.floor(Math.random() * 9) + 1}%
• Finance Validated: ${Math.floor(Math.random() * 10) + 90}%
• Last External Sync: ${Math.floor(Math.random() * 30)} minutes ago

Alerts:
${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length > 0 ? `⚠ ${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length} initiatives behind schedule\n` : ''}${savingsInitiatives.filter(i => i.actualSavings < i.targetSavings * 0.8 && i.status === 'active').length > 0 ? `⚠ ${savingsInitiatives.filter(i => i.actualSavings < i.targetSavings * 0.8 && i.status === 'active').length} initiatives below 80% of target\n` : ''}${savingsInitiatives.filter(i => i.status === 'active' && i.progress < 75).length === 0 && savingsInitiatives.filter(i => i.actualSavings < i.targetSavings * 0.8 && i.status === 'active').length === 0 ? '✓ All initiatives on track\n' : ''}
Last Refresh: ${new Date().toLocaleTimeString()}
Next Auto-Refresh: ${new Date(Date.now() + 1800000).toLocaleTimeString()}

[Refresh Complete]`);
  };

  const handleSettings = () => {
    console.log('Opening savings settings...');
    alert(`Procurement Savings Settings

━━━ GENERAL SETTINGS ━━━

Program Configuration:
• Program Name: Procurement Savings Initiative
• Program Owner: [Select User ▼]
• Start Date: January 1, 2025
• Status: Active

Annual Targets:
• Overall Savings Target: $[_______] (Current: $${totalTargetSavings.toLocaleString()})
• % of Total Spend: [___]%
• Hard Savings: [___]%
• Soft Savings: [___]%

━━━ SAVINGS TYPES ━━━

Enabled Savings Types:
☑ Price Reduction
☑ Volume Consolidation
☑ Supplier Negotiation
☑ Process Improvement
☑ Demand Management
☑ Specification Change
☑ Contract Optimization
☐ Custom: [_______________]

Savings Classification:
☑ Hard Savings (direct price reduction)
☑ Soft Savings (cost avoidance)
☑ Cost Avoidance (future costs prevented)
☐ Productivity Gains
☐ Other: [_______________]

━━━ CALCULATION METHODS ━━━

Approved Methodologies:

Price Variance:
☑ Enabled
• Formula: (Baseline Price - Current Price) × Volume
• Approval: Finance Director
• Documentation: PO comparison required

Avoided Cost:
☑ Enabled
• Formula: (Old Process Cost - New Process Cost) × Volume
• Approval: Finance Director + Operations
• Documentation: Process documentation required

Volume Consolidation:
☑ Enabled
• Formula: Volume Discount % × Total Spend
• Approval: Category Manager
• Documentation: Contract terms required

Budget Reduction:
☑ Enabled
• Formula: Previous Budget - Current Budget
• Approval: CFO
• Documentation: Budget approval required

━━━ BASELINE REQUIREMENTS ━━━

Baseline Standards:

Acceptable Baseline Types:
☑ Historical Price (last 12 months)
☑ Market Price (verified sources only)
☑ Budget/Planned Spend (approved budget)
☑ Quote/RFQ Price (documented bids)
☐ Cost Model (with approval)

Baseline Period:
• Minimum: 3 months
• Recommended: 12 months
• Maximum lookback: 24 months

Documentation Requirements:
☑ Source documents (POs, contracts, etc.)
☑ Data validation
☑ Finance approval
☑ Audit trail
☐ External verification

Re-validation:
• Frequency: Annually
• Trigger: >10% baseline change
• Approval: Finance Director

━━━ APPROVAL WORKFLOWS ━━━

Initiative Approval Thresholds:

Creation:
• <$25K: Category Manager
• $25K-$100K: + Finance Manager
• $100K-$500K: + Procurement Director
• >$500K: + CFO

Baseline Changes:
• <5% change: Category Manager
• 5-10% change: + Finance Manager
• >10% change: + CFO

Savings Claims:
• Monthly: Finance validation
• Quarterly: CFO review
• Annual: External audit

Response Time SLA:
• Category Manager: 2 business days
• Finance Manager: 3 business days
• Procurement Director: 5 business days
• CFO: 7 business days

━━━ TRACKING & REPORTING ━━━

Standard Reports:
☑ Daily: Savings dashboard
☑ Weekly: Initiative status
☑ Monthly: Savings summary
☑ Quarterly: Executive report
☑ Annual: Comprehensive review

Auto-Distribution:
• Initiative Owners: Weekly status
• Category Managers: Monthly summary
• Finance Team: Monthly validation
• Procurement Leadership: Quarterly
• Executive Team: Quarterly
• Board: Annual

Metrics Tracked:
☑ Total savings (actual vs target)
☑ Savings by category
☑ Savings by type
☑ Initiative completion rate
☑ Target achievement rate
☑ Average savings per initiative
☑ ROI and payback period

━━━ VALIDATION & AUDIT ━━━

Validation Requirements:

Monthly Validation:
☑ Finance team reviews all claims
☑ Source documentation verified
☑ Calculations checked
☑ Baselines confirmed
☑ Exceptions flagged

Quarterly Audit:
☑ Sample audit (${Math.floor(Math.random() * 20) + 10}% of initiatives)
☑ High-value initiatives (>$100K)
☑ Baseline re-validation
☑ Policy compliance check

Annual External Audit:
☑ Independent verification
☑ Full documentation review
☑ Process assessment
☑ Recommendations

Audit Trail:
☑ Log all changes
☑ Require change reason
☑ Track user actions
☑ Retain for 7 years
☑ Available for review

━━━ DATA & INTEGRATION ━━━

System Integrations:
☑ ERP system: Real-time sync
☑ Procurement system: Daily
☑ Financial system: Real-time
☑ Contract management: Weekly
☐ External benchmarking

Data Sources:
☑ Purchase orders
☑ Contracts
☑ Invoices
☑ Budget system
☑ Market indices
☐ Supplier portals

Data Retention:
• Active initiatives: Full detail
• Completed initiatives: 5 years full detail
• Historical: 7 years summary
• Audit trail: 10 years

━━━ NOTIFICATIONS & ALERTS ━━━

Alert Types:
☑ Initiative behind schedule
☑ Savings below 80% of target
☑ Baseline expiring/expired
☑ Validation required
☑ Approval pending
☑ Monthly target missed
☑ Milestone approaching

Recipients:
• Initiative Owner: All their alerts
• Category Manager: Team alerts
• Finance: Validation alerts
• Leadership: Critical only

Delivery Method:
☑ Email
☑ Dashboard notifications
☐ SMS (critical only)
☐ Mobile app

Frequency:
• Critical: Immediate
• Important: Daily digest
• Informational: Weekly summary

━━━ PERFORMANCE MANAGEMENT ━━━

Incentives & Recognition:
☐ Link to performance reviews
☐ Savings targets in KPIs
☐ Bonus tied to achievement
☑ Quarterly recognition program
☑ Annual awards

Benchmarking:
☑ Track vs industry average
☑ Compare vs previous year
☑ Peer comparisons
☐ Best-in-class targets

Continuous Improvement:
☑ Quarterly program review
☑ Best practice sharing
☑ Lessons learned sessions
☑ Process optimization

[Save Settings] [Reset to Defaults] [Export Config] [Cancel]`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Procurement Savings Tracker</h2>
            <p className="text-gray-600">Track and optimize procurement cost savings initiatives</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateInitiative}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              title="Create Initiative"
            >
              <Plus className="h-4 w-4" />
              <span>New Initiative</span>
            </button>
            <button
              onClick={handleCalculateSavings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              title="Calculate Savings"
            >
              <DollarSign className="h-4 w-4" />
              <span>Calculate</span>
            </button>
            <button
              onClick={handleExportReports}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Export Reports"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">YTD</span>
          </div>
          <p className="text-2xl font-bold">${(totalActualSavings / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600">Actual Savings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Annual</span>
          </div>
          <p className="text-2xl font-bold">${(totalTargetSavings / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600">Target Savings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <span className="text-sm text-gray-500">Rate</span>
          </div>
          <p className="text-2xl font-bold">{((totalActualSavings / totalTargetSavings) * 100).toFixed(0)}%</p>
          <p className="text-sm text-gray-600">Achievement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-8 w-8 text-orange-500" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold">{savingsInitiatives.filter(i => i.status === 'active').length}</p>
          <p className="text-sm text-gray-600">Initiatives</p>
        </div>
      </div>

      {/* Real-Time Tracking Dashboard */}
      {showRealTimeTracking && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 mb-6 border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Real-Time Savings Tracking
                  {autoRefresh && (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Live
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600">Automated tracking and validation • Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Auto-Refresh
              </button>
              <button
                onClick={() => setShowRealTimeTracking(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Today's Progress</span>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$12.4K</div>
              <div className="text-xs text-green-600 mt-1">↑ $3.2K vs yesterday</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '68%' }} />
                </div>
                <span className="text-xs text-gray-600">68%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">This Week</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$58.9K</div>
              <div className="text-xs text-blue-600 mt-1">Target: $65K (91%)</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '91%' }} />
                </div>
                <span className="text-xs text-gray-600">91%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">This Month</span>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$187K</div>
              <div className="text-xs text-purple-600 mt-1">Target: $200K (94%)</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '94%' }} />
                </div>
                <span className="text-xs text-gray-600">94%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pending Validation</span>
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$24.5K</div>
              <div className="text-xs text-amber-600 mt-1">8 initiatives awaiting</div>
              <button className="mt-2 text-xs text-amber-700 hover:text-amber-800 font-medium">
                Review Now →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Auto-Validated</h4>
                <p className="text-xs text-gray-600 mt-1">$42K in savings automatically validated via system integration</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">In Progress</h4>
                <p className="text-xs text-gray-600 mt-1">14 active initiatives tracking toward $285K annual target</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 flex items-start gap-3">
              <Star className="w-5 h-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Top Performer</h4>
                <p className="text-xs text-gray-600 mt-1">Supplier Consolidation initiative at 132% of target</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecasting Dashboard */}
      {showForecast && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 mb-6 border border-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">AI-Powered Savings Forecast</h2>
                <p className="text-sm text-gray-600">Predictive analytics and trend analysis • Confidence: 89%</p>
              </div>
            </div>
            <button
              onClick={() => setShowForecast(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">Q2 Forecast</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">$425K</div>
              <div className="text-xs text-indigo-600 mt-1">↑ 15% vs Q1 actual</div>
              <div className="text-xs text-gray-500 mt-1">Based on 12 initiatives</div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">EOY Projection</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">$1.72M</div>
              <div className="text-xs text-green-600 mt-1">On track for 108% of goal</div>
              <div className="text-xs text-gray-500 mt-1">High confidence (92%)</div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Quick Wins</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">$156K</div>
              <div className="text-xs text-purple-600 mt-1">Available within 30 days</div>
              <div className="text-xs text-gray-500 mt-1">6 opportunities identified</div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-600">Risk-Adjusted</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">$1.54M</div>
              <div className="text-xs text-amber-600 mt-1">Conservative estimate</div>
              <div className="text-xs text-gray-500 mt-1">Accounts for 10% risk</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'initiatives', 'tracking', 'analytics'].map((tab) => (
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

      {/* Initiatives Table */}
      {activeTab === 'initiatives' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Savings Initiatives</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleTrackInitiatives}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-sm transition-colors"
                title="Track Initiatives"
              >
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Track</span>
              </button>
              <button
                onClick={handleManageBaselines}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                title="Manage Baselines"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">Baselines</span>
              </button>
              <button
                onClick={handleComparePeriods}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                title="Compare Periods"
              >
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Compare</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiative</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savingsInitiatives.map((initiative) => (
                  <tr key={initiative.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{initiative.name}</div>
                        <div className="text-xs text-gray-500">{initiative.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{initiative.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsTypeColor(initiative.type)}`}>
                        {initiative.type.toUpperCase().replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(initiative.targetSavings / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(initiative.actualSavings / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        initiative.actualSavings >= initiative.targetSavings ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {((initiative.actualSavings / initiative.targetSavings) * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              initiative.progress >= 90
                                ? 'bg-green-500'
                                : initiative.progress >= 75
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{initiative.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{initiative.owner}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(initiative.status)}`}>
                        {initiative.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts */}
      {(activeTab === 'overview' || activeTab === 'analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Monthly Savings Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="cumulative" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" name="Cumulative" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Savings by Type</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={savingsByType.map(t => ({
                    name: t.type,
                    value: t.savings
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {savingsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Savings by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                <Bar dataKey="savings" fill="#10B981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Target Achievement by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsByCategory} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 120]} />
                <YAxis dataKey="category" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="achievement" fill="#3B82F6" name="Achievement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Initiative Progress Tracking</h4>
              <button
                onClick={handleAnalyzeTrends}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700">Analyze Trends</span>
              </button>
            </div>
            <div className="space-y-4">
              {savingsInitiatives.filter(i => i.status === 'active').map((initiative) => (
                <div key={initiative.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{initiative.name}</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsTypeColor(initiative.type)}`}>
                          {initiative.type.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Owner: {initiative.owner} • {initiative.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(initiative.actualSavings / 1000).toFixed(0)}K / ${(initiative.targetSavings / 1000).toFixed(0)}K
                      </div>
                      <div className={`text-sm ${
                        initiative.actualSavings >= initiative.targetSavings ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {((initiative.actualSavings / initiative.targetSavings) * 100).toFixed(0)}% achieved
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        initiative.progress >= 90
                          ? 'bg-green-500'
                          : initiative.progress >= 75
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${initiative.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress: {initiative.progress}%</span>
                    <span>End: {initiative.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Completed Initiatives</h4>
              <div className="space-y-3">
                {savingsInitiatives.filter(i => i.status === 'completed').map((init) => (
                  <div key={init.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-sm">{init.name}</p>
                        <p className="text-xs text-gray-600">{init.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">${(init.actualSavings / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-500">{((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Performance Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Target Met/Exceeded</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {savingsInitiatives.filter(i => i.actualSavings >= i.targetSavings).length} / {totalInitiatives}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">On Track (>75%)</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {savingsInitiatives.filter(i => i.progress >= 75 && i.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm font-medium">Needs Attention (<75%)</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">
                    {savingsInitiatives.filter(i => i.progress < 75 && i.status === 'active').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Top Performers</h4>
              <div className="space-y-3">
                {savingsInitiatives
                  .sort((a, b) => (b.actualSavings / b.targetSavings) - (a.actualSavings / a.targetSavings))
                  .slice(0, 3)
                  .map((init, idx) => (
                    <div key={init.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-2">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{init.name.substring(0, 25)}...</p>
                          <p className="text-xs text-gray-500">{init.category}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {((init.actualSavings / init.targetSavings) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Savings by Type</h4>
              <div className="space-y-2">
                {savingsByType.slice(0, 3).map((type) => (
                  <div key={type.type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type.type}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(type.savings / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-500">{type.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={handleCalculateSavings}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Calculate Savings</span>
                </button>
                <button
                  onClick={handleTrackInitiatives}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Activity className="h-4 w-4" />
                  <span>Track Progress</span>
                </button>
                <button
                  onClick={handleAnalyzeTrends}
                  className="w-full flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Analyze Trends</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Initiative completed above target</p>
                  <p className="text-xs text-gray-500 mt-1">{savingsInitiatives.filter(i => i.status === 'completed' && i.actualSavings > i.targetSavings)[0]?.name} - {((savingsInitiatives.filter(i => i.status === 'completed' && i.actualSavings > i.targetSavings)[0]?.actualSavings / savingsInitiatives.filter(i => i.status === 'completed' && i.actualSavings > i.targetSavings)[0]?.targetSavings - 1) * 100).toFixed(0)}% over target</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly target exceeded</p>
                  <p className="text-xs text-gray-500 mt-1">{monthlySavings[monthlySavings.length - 2].month}: ${monthlySavings[monthlySavings.length - 2].actual.toLocaleString()} (Target: ${monthlySavings[monthlySavings.length - 2].target.toLocaleString()})</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <Plus className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New initiative created</p>
                  <p className="text-xs text-gray-500 mt-1">{savingsInitiatives.filter(i => i.status === 'active')[savingsInitiatives.filter(i => i.status === 'active').length - 1]?.name} - Target: ${(savingsInitiatives.filter(i => i.status === 'active')[savingsInitiatives.filter(i => i.status === 'active').length - 1]?.targetSavings / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementSavings;
