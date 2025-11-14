'use client';

import React, { useState } from 'react';
import {
  Package, TrendingUp, DollarSign, Users, BarChart3, Plus,
  Edit, Trash2, Eye, Settings, Download, RefreshCw, AlertCircle,
  CheckCircle, Target, Activity, PieChart, Layers, Tag, Shield,
  FileText, Share2, Filter, Search, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export interface Category {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  suppliers: number;
  items: number;
  status: 'active' | 'inactive' | 'planning';
  manager: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  savingsTarget: number;
  actualSavings: number;
}

const CategoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Advanced features state
  const [showRealTimeInsights, setShowRealTimeInsights] = useState(true);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Categories
  const categories: Category[] = [
    {
      id: 'CAT001',
      name: 'Raw Materials',
      description: 'Steel, aluminum, and other raw materials for manufacturing',
      budget: 850000,
      spent: 720000,
      suppliers: 12,
      items: 245,
      status: 'active',
      manager: 'Sarah Johnson',
      priority: 'critical',
      savingsTarget: 85000,
      actualSavings: 92000
    },
    {
      id: 'CAT002',
      name: 'Electronic Components',
      description: 'Semiconductors, PCBs, and electronic parts',
      budget: 450000,
      spent: 380000,
      suppliers: 8,
      items: 567,
      status: 'active',
      manager: 'Michael Chen',
      priority: 'high',
      savingsTarget: 45000,
      actualSavings: 38000
    },
    {
      id: 'CAT003',
      name: 'Office Supplies',
      description: 'Stationery, furniture, and office equipment',
      budget: 125000,
      spent: 98000,
      suppliers: 5,
      items: 123,
      status: 'active',
      manager: 'Emily Davis',
      priority: 'medium',
      savingsTarget: 12500,
      actualSavings: 15000
    },
    {
      id: 'CAT004',
      name: 'IT Equipment',
      description: 'Computers, servers, and networking equipment',
      budget: 320000,
      spent: 285000,
      suppliers: 6,
      items: 89,
      status: 'active',
      manager: 'Robert Wilson',
      priority: 'high',
      savingsTarget: 32000,
      actualSavings: 28000
    },
    {
      id: 'CAT005',
      name: 'Safety Equipment',
      description: 'PPE, safety gear, and protective equipment',
      budget: 180000,
      spent: 145000,
      suppliers: 4,
      items: 156,
      status: 'active',
      manager: 'Lisa Anderson',
      priority: 'critical',
      savingsTarget: 18000,
      actualSavings: 22000
    },
    {
      id: 'CAT006',
      name: 'Maintenance Parts',
      description: 'Spare parts and maintenance supplies',
      budget: 210000,
      spent: 175000,
      suppliers: 9,
      items: 312,
      status: 'active',
      manager: 'David Lee',
      priority: 'medium',
      savingsTarget: 21000,
      actualSavings: 19000
    }
  ];

  // Mock data - Category performance
  const categoryPerformance = [
    { month: 'Jul', rawMaterials: 120000, electronics: 65000, office: 15000 },
    { month: 'Aug', rawMaterials: 125000, electronics: 68000, office: 16000 },
    { month: 'Sep', rawMaterials: 118000, electronics: 62000, office: 14000 },
    { month: 'Oct', rawMaterials: 130000, electronics: 70000, office: 17000 },
    { month: 'Nov', rawMaterials: 128000, electronics: 67000, office: 16500 },
    { month: 'Dec', rawMaterials: 135000, electronics: 72000, office: 18000 }
  ];

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleCreateCategory = () => {
    console.log('Creating new category...');
    alert(`Create New Category

Category Information:

📦 BASIC DETAILS
• Category Name: [_______________]
• Description: [_______________]
• Category Code: [_______________]
• Parent Category: [Select...▼]

👤 MANAGEMENT
• Category Manager: [Select User ▼]
• Backup Manager: [Select User ▼]
• Department: [Select ▼]

💰 BUDGET ALLOCATION
• Annual Budget: $[_______]
• Q1: $[_______] (25%)
• Q2: $[_______] (25%)
• Q3: $[_______] (25%)
• Q4: $[_______] (25%)

🎯 SAVINGS TARGET
• Annual Savings Goal: $[_______]
• Target %: [___]%
• Strategy: [Select ▼]
  ○ Cost Reduction
  ○ Demand Management
  ○ Supplier Consolidation
  ○ Process Improvement

🏢 SUPPLIER REQUIREMENTS
• Minimum Suppliers: [__]
• Maximum Suppliers: [__]
• Certification Required: [Select]
☐ ISO 9001
☐ ISO 14001
☐ Industry-specific certs

📊 APPROVAL THRESHOLDS
• Auto-approve: Up to $[_______]
• Manager approval: $[_______] - $[_______]
• Director approval: $[_______] - $[_______]
• Executive approval: Over $[_______]

🔔 NOTIFICATIONS
☑ Budget threshold alerts (80%, 90%, 95%)
☑ Supplier performance issues
☑ New opportunities
☑ Monthly performance reports

[Create Category] [Save as Draft] [Cancel]`);
  };

  const handleEditCategory = (category: Category) => {
    console.log('Editing category:', category.id);
    alert(`Edit Category: ${category.name}

Current Information:

📦 BASIC DETAILS
• Category Name: ${category.name}
• Description: ${category.description}
• Status: ${category.status.toUpperCase()}
• Manager: ${category.manager}

💰 BUDGET INFORMATION
• Annual Budget: $${category.budget.toLocaleString()}
• Spent to Date: $${category.spent.toLocaleString()}
• Remaining: $${(category.budget - category.spent).toLocaleString()}
• Utilization: ${((category.spent / category.budget) * 100).toFixed(1)}%

🏢 SUPPLIER METRICS
• Active Suppliers: ${category.suppliers}
• Total Items: ${category.items}

🎯 SAVINGS PERFORMANCE
• Target Savings: $${category.savingsTarget.toLocaleString()}
• Actual Savings: $${category.actualSavings.toLocaleString()}
• Achievement: ${((category.actualSavings / category.savingsTarget) * 100).toFixed(1)}%

EDIT OPTIONS:
☐ Update budget allocation
☐ Change category manager
☐ Modify savings targets
☐ Update supplier requirements
☐ Adjust approval thresholds
☐ Change priority level: ${category.priority.toUpperCase()}
☐ Update notification settings

ACTIONS:
[Save Changes] [Reset] [Cancel]

⚠ Changes to budget and targets may require executive approval.`);
  };

  const handleAssignSuppliers = (category: Category) => {
    console.log('Assigning suppliers to category:', category.id);
    alert(`Assign Suppliers: ${category.name}

Current Suppliers (${category.suppliers}):

ASSIGNED SUPPLIERS:
✓ Metal Works Inc (Primary)
  - Rating: ⭐⭐⭐⭐⭐ 4.8/5
  - Products: 45
  - Annual Spend: $${Math.floor(Math.random() * 200000 + 100000).toLocaleString()}

✓ Tech Components Ltd
  - Rating: ⭐⭐⭐⭐ 4.5/5
  - Products: 32
  - Annual Spend: $${Math.floor(Math.random() * 150000 + 50000).toLocaleString()}

AVAILABLE SUPPLIERS (${Math.floor(Math.random() * 20 + 10)}):

☐ Global Materials Co
  - Rating: ⭐⭐⭐⭐ 4.6/5
  - Capabilities: ${category.name}
  - Status: Pre-qualified

☐ Industrial Supply Partners
  - Rating: ⭐⭐⭐⭐⭐ 4.9/5
  - Capabilities: ${category.name}
  - Status: Pre-qualified

SUPPLIER ASSIGNMENT CRITERIA:
☑ Meets category certifications
☑ Passed quality audit
☑ Financial stability verified
☑ Insurance requirements met
☑ Contract terms agreed

ACTIONS:
• Add Supplier: [Search suppliers...]
• Set Primary Supplier: [Select ▼]
• Set Backup Suppliers: [Select ▼]
• Define allocation %:
  - Primary: [__]%
  - Secondary: [__]%
  - Tertiary: [__]%

SUPPLIER PERFORMANCE REQUIREMENTS:
• Minimum rating: 4.0/5
• On-time delivery: >95%
• Quality acceptance: >98%
• Response time: <24 hours

[Save Assignments] [Import from Template] [Cancel]`);
  };

  const handleSetBudget = (category: Category) => {
    console.log('Setting budget for category:', category.id);
    alert(`Set Budget: ${category.name}

CURRENT BUDGET ALLOCATION

Fiscal Year 2025:
━━━━━━━━━━━━━━━━━━━━━
• Total Annual Budget: $${category.budget.toLocaleString()}
• Spent YTD: $${category.spent.toLocaleString()}
• Remaining: $${(category.budget - category.spent).toLocaleString()}
• Utilization: ${((category.spent / category.budget) * 100).toFixed(1)}%

QUARTERLY BREAKDOWN:

Q1 (Jan-Mar):
• Budget: $${(category.budget * 0.25).toLocaleString()}
• Spent: $${Math.floor(category.spent * 0.30).toLocaleString()}
• Status: ${Math.random() > 0.5 ? 'Over budget ⚠' : 'On track ✓'}

Q2 (Apr-Jun):
• Budget: $${(category.budget * 0.25).toLocaleString()}
• Spent: $${Math.floor(category.spent * 0.28).toLocaleString()}
• Status: On track ✓

Q3 (Jul-Sep):
• Budget: $${(category.budget * 0.25).toLocaleString()}
• Spent: $${Math.floor(category.spent * 0.25).toLocaleString()}
• Status: On track ✓

Q4 (Oct-Dec) - CURRENT:
• Budget: $${(category.budget * 0.25).toLocaleString()}
• Spent: $${Math.floor(category.spent * 0.17).toLocaleString()}
• Remaining: $${Math.floor(category.budget * 0.25 - category.spent * 0.17).toLocaleString()}

BUDGET ADJUSTMENT OPTIONS:

1. INCREASE BUDGET
   Additional Amount: $[_______]
   Justification: [Required]
   Funding Source: [Select ▼]
   Requires: Executive approval

2. DECREASE BUDGET
   Reduction Amount: $[_______]
   Justification: [Required]
   Impact Analysis: [Required]

3. REALLOCATE QUARTERS
   Move from Q[_] to Q[_]: $[_______]

4. CARRYOVER FROM PREVIOUS YEAR
   Available: $${Math.floor(Math.random() * 50000).toLocaleString()}

BUDGET ALERTS:
☑ Alert at 75% utilization
☑ Alert at 90% utilization
☑ Weekly spend reports
☑ Monthly variance analysis

[Save Budget] [Request Increase] [Generate Report] [Cancel]`);
  };

  const handleViewAnalytics = (category: Category) => {
    console.log('Viewing analytics for category:', category.id);
    alert(`Category Analytics: ${category.name}

📊 PERFORMANCE DASHBOARD

━━━ KEY METRICS ━━━

Spend Analysis:
• Total Spend: $${category.spent.toLocaleString()}
• Budget Variance: ${category.spent > category.budget ? '+' : ''}${(((category.spent - category.budget) / category.budget) * 100).toFixed(1)}%
• Average Order Value: $${Math.floor(category.spent / (category.items * 0.3)).toLocaleString()}
• Order Count: ${Math.floor(category.items * 0.3)}

Supplier Performance:
• Active Suppliers: ${category.suppliers}
• Average Rating: ${(Math.random() * 0.5 + 4.5).toFixed(2)}/5
• On-Time Delivery: ${Math.floor(Math.random() * 5 + 95)}%
• Quality Score: ${Math.floor(Math.random() * 3 + 97)}%

Savings Performance:
• Target: $${category.savingsTarget.toLocaleString()}
• Achieved: $${category.actualSavings.toLocaleString()}
• Variance: ${((category.actualSavings / category.savingsTarget - 1) * 100).toFixed(1)}%
• ROI: ${((category.actualSavings / category.spent) * 100).toFixed(1)}%

━━━ TREND ANALYSIS ━━━

6-Month Trend:
• Spend: ${Math.random() > 0.5 ? '↗ +12%' : '↘ -8%'}
• Supplier Count: ${Math.random() > 0.5 ? '↗ +2' : '→ Stable'}
• Item Count: ${Math.random() > 0.5 ? '↗ +45' : '↗ +23'}
• Savings: ${Math.random() > 0.5 ? '↗ +18%' : '↗ +9%'}

Top 5 Items by Spend:
1. ${['Steel Plates', 'Control Modules', 'Safety Kits', 'Bearings', 'Chemicals'][0]} - $${Math.floor(Math.random() * 100000 + 50000).toLocaleString()}
2. ${['Steel Plates', 'Control Modules', 'Safety Kits', 'Bearings', 'Chemicals'][1]} - $${Math.floor(Math.random() * 80000 + 40000).toLocaleString()}
3. ${['Steel Plates', 'Control Modules', 'Safety Kits', 'Bearings', 'Chemicals'][2]} - $${Math.floor(Math.random() * 60000 + 30000).toLocaleString()}
4. ${['Steel Plates', 'Control Modules', 'Safety Kits', 'Bearings', 'Chemicals'][3]} - $${Math.floor(Math.random() * 40000 + 20000).toLocaleString()}
5. ${['Steel Plates', 'Control Modules', 'Safety Kits', 'Bearings', 'Chemicals'][4]} - $${Math.floor(Math.random() * 30000 + 10000).toLocaleString()}

Top 3 Suppliers by Value:
1. ${['Metal Works Inc', 'Tech Components', 'Global Supply'][0]} - ${Math.floor(Math.random() * 30 + 30)}%
2. ${['Metal Works Inc', 'Tech Components', 'Global Supply'][1]} - ${Math.floor(Math.random() * 20 + 20)}%
3. ${['Metal Works Inc', 'Tech Components', 'Global Supply'][2]} - ${Math.floor(Math.random() * 15 + 10)}%

━━━ INSIGHTS & RECOMMENDATIONS ━━━

Opportunities:
• Consolidate with top 3 suppliers for ${Math.floor(Math.random() * 5 + 5)}% savings
• Negotiate volume discounts: Potential $${Math.floor(Math.random() * 20000 + 10000).toLocaleString()}
• Review slow-moving items: ${Math.floor(Math.random() * 20 + 10)} items

Risks:
${Math.random() > 0.7 ? '⚠ Single source dependency on critical items\n' : ''}${Math.random() > 0.6 ? '⚠ Budget utilization approaching limit\n' : ''}${Math.random() > 0.5 ? '⚠ Supplier performance declining\n' : ''}

[Export Analytics] [Schedule Report] [Deep Dive] [Close]`);
  };

  const handleDeleteCategory = (category: Category) => {
    console.log('Deleting category:', category.id);
    alert(`Delete Category: ${category.name}

⚠ WARNING: This action cannot be undone!

Impact Analysis:

📦 CURRENT USAGE:
• Active Items: ${category.items}
• Open Purchase Orders: ${Math.floor(Math.random() * 10 + 5)}
• Active Contracts: ${Math.floor(Math.random() * 5 + 2)}
• Suppliers Assigned: ${category.suppliers}

💰 FINANCIAL IMPACT:
• Allocated Budget: $${category.budget.toLocaleString()}
• Spent YTD: $${category.spent.toLocaleString()}
• Committed (POs): $${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}

⚠ DEPENDENCIES:
• Linked Departments: ${Math.floor(Math.random() * 5 + 2)}
• Approval Workflows: ${Math.floor(Math.random() * 3 + 1)} active
• Reports & Dashboards: ${Math.floor(Math.random() * 8 + 3)}

DELETION OPTIONS:

○ SOFT DELETE (Recommended)
  - Mark as inactive
  - Retain all historical data
  - Can be reactivated later
  - No data loss

○ ARCHIVE
  - Move to archive
  - Data available for reporting
  - Cannot be reactivated
  - Preserves audit trail

○ HARD DELETE (Not Recommended)
  - Permanently delete
  - Cannot be recovered
  - Historical data lost
  - Requires executive approval

BEFORE DELETING:
☐ Close all open purchase orders
☐ Reassign active items to other categories
☐ Notify category manager (${category.manager})
☐ Notify suppliers
☐ Update approval workflows
☐ Archive reports and data

Alternative Actions:
• Merge with another category
• Mark as inactive but keep data
• Transfer ownership to another manager

[Soft Delete] [Archive] [Cancel]

⚠ Hard deletion requires executive approval and cannot be performed from this screen.`);
  };

  const handleExportReport = () => {
    console.log('Exporting category report...');
    alert(`Export Category Report

EXPORT OPTIONS:

1. CATEGORY SUMMARY (PDF)
   • All ${categories.length} categories overview
   • Budget vs. spend comparison
   • Savings performance
   • Supplier distribution
   • Executive summary format

2. DETAILED ANALYSIS (Excel)
   • Category-by-category breakdown
   • Monthly trend data
   • Supplier assignments
   • Item listings
   • Variance analysis
   • Pivot tables included

3. PERFORMANCE DASHBOARD (PowerPoint)
   • Visual charts and graphs
   • KPI scorecards
   • Trend analysis
   • Ready for presentations
   • Executive summary slides

4. DATA EXPORT (CSV)
   • Raw data export
   • All fields included
   • For custom analysis
   • Import into other systems

DATE RANGE:
○ Current Quarter
○ Year to Date
○ Last 12 Months
○ Custom: [From __/__/__] to [__/__/__]

INCLUDE:
☑ Budget information
☑ Supplier details
☑ Savings metrics
☑ Performance trends
☑ Category managers
☑ Item details
☐ Cost breakdowns
☐ Compliance data

FILTERS:
• Status: [All ▼]
• Priority: [All ▼]
• Manager: [All ▼]

RECIPIENTS:
• Email to: [Enter emails]
• Schedule: [One-time ▼]

[Generate Export] [Schedule Recurring] [Cancel]`);
  };

  const handleManageStrategies = () => {
    console.log('Managing category strategies...');
    alert(`Category Strategies Management

STRATEGIC SOURCING FRAMEWORK

━━━ CATEGORY STRATEGIES ━━━

1. RAW MATERIALS
   Strategy: Global Sourcing
   • Multi-source to mitigate risk
   • Long-term contracts with price protection
   • Quarterly market reviews
   • Target: 10% cost reduction
   Status: On Track ✓

2. ELECTRONIC COMPONENTS
   Strategy: Preferred Supplier Program
   • 3 strategic suppliers
   • Volume consolidation discounts
   • Technology partnerships
   • Target: 8% savings through standardization
   Status: Behind Target ⚠

3. OFFICE SUPPLIES
   Strategy: E-Procurement Automation
   • Online catalog ordering
   • Punch-out integration
   • Auto-replenishment
   • Target: 15% admin cost reduction
   Status: Exceeding ✓

STRATEGIC INITIATIVES:

📊 SPEND ANALYSIS
• Identify consolidation opportunities
• Benchmark against industry
• Find cost reduction levers
• Review make vs. buy decisions

🤝 SUPPLIER RELATIONSHIP
• Develop strategic partnerships
• Annual business reviews
• Innovation workshops
• Risk mitigation plans

💡 DEMAND MANAGEMENT
• Standardize specifications
• Reduce variety/SKU count
• Implement value engineering
• Control maverick spending

🔄 PROCESS IMPROVEMENT
• Streamline approval workflows
• Automate routine purchases
• Implement e-sourcing tools
• Improve supplier onboarding

STRATEGY TEMPLATES:
• Cost Reduction Focus
• Innovation Partnership
• Risk Mitigation
• Sustainability Focus
• Total Cost of Ownership

[Create New Strategy] [Edit Existing] [Strategy Review] [Close]`);
  };

  const handleBudgetForecast = () => {
    console.log('Creating budget forecast...');
    alert(`Budget Forecast & Planning

FORECAST ANALYSIS - FY 2025

━━━ CURRENT PERFORMANCE ━━━

YTD Actual:
• Total Spend: $${categories.reduce((sum, cat) => sum + cat.spent, 0).toLocaleString()}
• vs Budget: ${(((categories.reduce((sum, cat) => sum + cat.spent, 0) / categories.reduce((sum, cat) => sum + cat.budget, 0)) - 1) * 100).toFixed(1)}%
• Trend: ${Math.random() > 0.5 ? '↗ Increasing' : '↘ Decreasing'}

━━━ FORECAST MODELS ━━━

1. LINEAR PROJECTION
   Based on current trend
   • Q4 Forecast: $${Math.floor(Math.random() * 500000 + 400000).toLocaleString()}
   • Year End Total: $${Math.floor(categories.reduce((sum, cat) => sum + cat.budget, 0) * (Math.random() * 0.1 + 0.95)).toLocaleString()}
   • Variance: ${(Math.random() * 10 - 5).toFixed(1)}%
   • Confidence: 75%

2. SEASONAL ADJUSTMENT
   Accounting for seasonal patterns
   • Q4 Forecast: $${Math.floor(Math.random() * 550000 + 450000).toLocaleString()}
   • Year End Total: $${Math.floor(categories.reduce((sum, cat) => sum + cat.budget, 0) * (Math.random() * 0.1 + 0.98)).toLocaleString()}
   • Variance: ${(Math.random() * 8 - 4).toFixed(1)}%
   • Confidence: 85%

3. ADVANCED ANALYTICS
   Machine learning based
   • Q4 Forecast: $${Math.floor(Math.random() * 520000 + 480000).toLocaleString()}
   • Year End Total: $${Math.floor(categories.reduce((sum, cat) => sum + cat.budget, 0) * (Math.random() * 0.08 + 0.96)).toLocaleString()}
   • Variance: ${(Math.random() * 6 - 3).toFixed(1)}%
   • Confidence: 92%

━━━ CATEGORY FORECASTS ━━━

Top Categories by Projected Spend:
${categories.slice(0, 3).map((cat, idx) =>
  `${idx + 1}. ${cat.name}: $${Math.floor(cat.spent * (1 + Math.random() * 0.2)).toLocaleString()} (${(Math.random() * 10 + 90).toFixed(1)}% of budget)`
).join('\n')}

Risk Categories (Over Budget):
${Math.random() > 0.5 ? `• ${categories[0].name}: ${(Math.random() * 15 + 100).toFixed(1)}% utilization` : 'None identified'}

━━━ PLANNING SCENARIOS ━━━

BASE CASE (Most Likely):
• Probability: 60%
• Total Budget Need: $${categories.reduce((sum, cat) => sum + cat.budget, 0).toLocaleString()}
• vs Current: 0%

OPTIMISTIC CASE:
• Probability: 20%
• Total Budget Need: $${Math.floor(categories.reduce((sum, cat) => sum + cat.budget, 0) * 0.92).toLocaleString()}
• vs Current: -8% (savings opportunities)

PESSIMISTIC CASE:
• Probability: 20%
• Total Budget Need: $${Math.floor(categories.reduce((sum, cat) => sum + cat.budget, 0) * 1.08).toLocaleString()}
• vs Current: +8% (market increases)

━━━ RECOMMENDATIONS ━━━

Budget Adjustments Needed:
${Math.random() > 0.7 ? `• Increase ${categories[0].name} by $${Math.floor(Math.random() * 50000 + 20000).toLocaleString()}\n` : ''}${Math.random() > 0.6 ? `• Reduce ${categories[2].name} by $${Math.floor(Math.random() * 30000 + 10000).toLocaleString()}\n` : ''}• Maintain current allocations for ${Math.floor(Math.random() * 3 + 2)} categories

[Export Forecast] [Scenario Planning] [Submit Budget Request] [Close]`);
  };

  const handleRefresh = () => {
    console.log('Refreshing category data...');
    alert(`Refresh Category Management

Syncing latest data from:
✓ Budget system
✓ Supplier database
✓ Purchase order system
✓ Contract management
✓ Savings tracking
✓ Performance metrics

Updated Information:
• Categories: ${categories.length}
• Total Budget: $${categories.reduce((sum, cat) => sum + cat.budget, 0).toLocaleString()}
• Total Spend: $${categories.reduce((sum, cat) => sum + cat.spent, 0).toLocaleString()}
• Active Suppliers: ${categories.reduce((sum, cat) => sum + cat.suppliers, 0)}
• Total Items: ${categories.reduce((sum, cat) => sum + cat.items, 0)}

Recent Changes:
• ${Math.floor(Math.random() * 5)} budget updates
• ${Math.floor(Math.random() * 3)} supplier assignments
• ${Math.floor(Math.random() * 8)} new items added

Last Refresh: ${new Date(Date.now() - Math.random() * 600000).toLocaleString()}

[Refresh Complete]`);
  };

  const handleSettings = () => {
    console.log('Opening category settings...');
    alert(`Category Management Settings

━━━ GENERAL SETTINGS ━━━

Default Values:
• Budget Period: Fiscal Year
• Currency: USD
• Decimal Places: 2
• Date Format: MM/DD/YYYY

Category Naming:
• Naming Convention: [Prefix][Name][Code]
• Auto-numbering: Enabled
• Next Category ID: CAT${String(categories.length + 1).padStart(3, '0')}

━━━ BUDGET SETTINGS ━━━

Budget Controls:
☑ Require budget approval for new categories
☑ Alert at 75% budget utilization
☑ Alert at 90% budget utilization
☑ Block spending at 100% budget
☐ Allow budget overruns with approval

Budget Periods:
• Fiscal Year Start: January 1
• Quarters: Standard (Q1-Q4)
• Reporting: Monthly

━━━ SUPPLIER SETTINGS ━━━

Assignment Rules:
• Min suppliers per category: 2
• Max suppliers per category: 15
• Require certification: By category
• Performance reviews: Quarterly

━━━ APPROVAL WORKFLOWS ━━━

Category Creation:
• <$100K: Manager approval
• $100K-$500K: Director approval
• >$500K: Executive approval

Budget Changes:
• <10% increase: Category manager
• 10-25% increase: Director
• >25% increase: CFO + Executive

━━━ NOTIFICATIONS ━━━

Email Notifications:
☑ Weekly performance summary
☑ Monthly budget reports
☑ Quarterly business reviews
☑ Budget threshold alerts
☑ Supplier performance issues

Recipients:
• Category Managers
• Procurement Director
• Finance Team

━━━ DATA & REPORTING ━━━

Data Retention:
• Transaction data: 7 years
• Performance metrics: 5 years
• Archived categories: Indefinite

Export Settings:
• Default format: Excel
• Include historical data: Yes
• Auto-schedule: Monthly

Integration:
☑ ERP system sync: Real-time
☑ Budget system: Daily
☑ Supplier portal: Real-time

[Save Settings] [Reset to Defaults] [Cancel]`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Category Management System</h2>
            <p className="text-gray-600">Strategic management of procurement categories</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateCategory}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              title="Create Category"
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </button>
            <button
              onClick={handleManageStrategies}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              title="Manage Strategies"
            >
              <Target className="h-4 w-4" />
              <span>Strategies</span>
            </button>
            <button
              onClick={handleBudgetForecast}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              title="Budget Forecast"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Forecast</span>
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Export Report"
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
            <Package className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold">{categories.filter(c => c.status === 'active').length}</p>
          <p className="text-sm text-gray-600">Active Categories</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">YTD</span>
          </div>
          <p className="text-2xl font-bold">${(categories.reduce((sum, cat) => sum + cat.budget, 0) / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-600">Total Category Budget</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-purple-500" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.suppliers, 0)}</p>
          <p className="text-sm text-gray-600">Assigned Suppliers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <span className="text-sm text-gray-500">Achieved</span>
          </div>
          <p className="text-2xl font-bold">${(categories.reduce((sum, cat) => sum + cat.actualSavings, 0) / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-600">Total Savings</p>
        </div>
      </div>

      {/* Real-Time Category Insights */}
      {showRealTimeInsights && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Real-Time Category Intelligence
              </h2>
              <p className="text-sm text-gray-600 mt-1">Live insights into category performance and spending patterns</p>
            </div>
            <div className="flex items-center gap-3">
              {autoRefresh && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Live
                </span>
              )}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </button>
              <button
                onClick={() => setShowRealTimeInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Budget at Risk</span>
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">$245K</div>
              <div className="text-xs text-gray-500 mt-1">3 categories over 85%</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Savings Achieved</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">108%</div>
              <div className="text-xs text-green-600 mt-1">Above target by $28K</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Initiatives</span>
                <Target className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">14</div>
              <div className="text-xs text-gray-500 mt-1">8 completed this quarter</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Health Score</span>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">8.4/10</div>
              <div className="text-xs text-blue-600 mt-1">Excellent performance</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                Top Performing Categories
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Raw Materials', performance: 108, color: 'green' },
                  { name: 'Office Supplies', performance: 120, color: 'green' },
                  { name: 'Safety Equipment', performance: 105, color: 'green' }
                ].map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className={`font-medium text-${cat.color}-600`}>{cat.performance}% of target</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Needs Attention
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Electronic Components', issue: 'Budget utilization: 89%', severity: 'medium' },
                  { name: 'IT Equipment', issue: 'Supplier consolidation needed', severity: 'low' },
                  { name: 'Packaging Materials', issue: 'Price increase: 12%', severity: 'high' }
                ].map((cat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${
                      cat.severity === 'high' ? 'bg-red-500' :
                      cat.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{cat.name}</div>
                      <div className="text-gray-600 text-xs">{cat.issue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Recommendations */}
      {showAIRecommendations && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                AI-Powered Strategic Recommendations
              </h2>
              <p className="text-sm text-gray-600 mt-1">Intelligent insights for category optimization and cost reduction</p>
            </div>
            <button
              onClick={() => setShowAIRecommendations(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Savings Potential</span>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">$186K</div>
              <p className="text-xs text-gray-600">Identified opportunities</p>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Confidence:</span> High (92%)
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Supplier Optimization</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
              <p className="text-xs text-gray-600">Consolidation opportunities</p>
              <div className="mt-2 text-xs text-blue-600">
                Est. savings: $42K annually
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Risk Mitigation</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">5</div>
              <p className="text-xs text-gray-600">Action items identified</p>
              <div className="mt-2 text-xs text-gray-500">
                Priority: 3 high, 2 medium
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              Recommended Strategic Actions
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Consolidate Electronic Components Suppliers</p>
                  <p className="text-xs text-gray-600 mt-1">Reduce from 8 to 3 preferred suppliers to gain volume discounts</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">$58K savings</span>
                  <div className="text-xs text-gray-500 mt-1">High Impact</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Implement Automated Reordering for Office Supplies</p>
                  <p className="text-xs text-gray-600 mt-1">Reduce admin time by 15 hours/month with smart inventory triggers</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Quick Win</span>
                  <div className="text-xs text-gray-500 mt-1">Medium Impact</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Renegotiate Raw Materials Contracts</p>
                  <p className="text-xs text-gray-600 mt-1">Market prices down 7% - opportunity to lock in better rates</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">$128K savings</span>
                  <div className="text-xs text-gray-500 mt-1">High Impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'categories', 'performance', 'budget'].map((tab) => (
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

      {/* Categories Table */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Category Portfolio</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suppliers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.manager}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(category.budget / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(category.spent / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              (category.spent / category.budget) * 100 > 90
                                ? 'bg-red-500'
                                : (category.spent / category.budget) * 100 > 75
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">
                          {((category.spent / category.budget) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.suppliers}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${(category.actualSavings / 1000).toFixed(0)}K
                      </div>
                      <div className={`text-xs ${
                        category.actualSavings >= category.savingsTarget ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((category.actualSavings / category.savingsTarget) * 100).toFixed(0)}% of target
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(category.priority)}`}>
                        {category.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700">Edit</span>
                        </button>
                        <button
                          onClick={() => handleAssignSuppliers(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                          title="Assign Suppliers"
                        >
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-700">Suppliers</span>
                        </button>
                        <button
                          onClick={() => handleSetBudget(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                          title="Set Budget"
                        >
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">Budget</span>
                        </button>
                        <button
                          onClick={() => handleViewAnalytics(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-sm transition-colors"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-4 h-4 text-indigo-600" />
                          <span className="text-indigo-700">Analytics</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 bg-red-50 rounded-lg hover:bg-red-100 text-sm transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-red-700">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Charts */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Spend by Category (6 Months)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="rawMaterials" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Raw Materials" />
                <Area type="monotone" dataKey="electronics" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Electronics" />
                <Area type="monotone" dataKey="office" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Office" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Budget Utilization by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categories.map(cat => ({
                name: cat.name.split(' ')[0],
                utilization: ((cat.spent / cat.budget) * 100).toFixed(1),
                target: 85
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#3B82F6" name="Current %" />
                <Bar dataKey="target" fill="#E5E7EB" name="Target %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Savings Performance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categories.map(cat => ({
                name: cat.name.split(' ')[0],
                target: cat.savingsTarget / 1000,
                actual: cat.actualSavings / 1000
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" fill="#E5E7EB" name="Target ($K)" />
                <Bar dataKey="actual" fill="#10B981" name="Actual ($K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Category Budget Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={categories.map(cat => ({
                    name: cat.name,
                    value: cat.budget,
                    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][categories.indexOf(cat) % 6]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Budget Overview */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">Budget vs. Spend Analysis</h4>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500 ml-2">Budget: ${(category.budget / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${(category.spent / 1000).toFixed(0)}K</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({((category.spent / category.budget) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        (category.spent / category.budget) * 100 > 95
                          ? 'bg-red-500'
                          : (category.spent / category.budget) * 100 > 80
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Quarterly Budget Trend</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { quarter: 'Q1', budget: 612500, spent: 580000 },
                  { quarter: 'Q2', budget: 612500, spent: 595000 },
                  { quarter: 'Q3', budget: 612500, spent: 610000 },
                  { quarter: 'Q4', budget: 612500, spent: 520000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#E5E7EB" strokeWidth={2} name="Budget" />
                  <Line type="monotone" dataKey="spent" stroke="#3B82F6" strokeWidth={2} name="Actual Spend" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Budget Alerts</h4>
              <div className="space-y-3">
                {categories.filter(cat => (cat.spent / cat.budget) > 0.8).map((category) => (
                  <div key={category.id} className={`p-3 rounded-lg ${
                    (category.spent / category.budget) > 0.95 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-start">
                      <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 ${
                        (category.spent / category.budget) > 0.95 ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {((category.spent / category.budget) * 100).toFixed(1)}% of budget utilized
                          {(category.spent / category.budget) > 0.95 && ' - Immediate action required'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {categories.filter(cat => (cat.spent / cat.budget) > 0.8).length === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All categories within budget thresholds</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Top Performing Categories</h4>
              <div className="space-y-3">
                {categories
                  .sort((a, b) => (b.actualSavings / b.savingsTarget) - (a.actualSavings / a.savingsTarget))
                  .slice(0, 3)
                  .map((cat, idx) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-2">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {((cat.actualSavings / cat.savingsTarget) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Budget Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm">Over 90% utilized</span>
                  <span className="text-sm font-bold text-red-600">
                    {categories.filter(c => (c.spent / c.budget) > 0.9).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">75-90% utilized</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {categories.filter(c => (c.spent / c.budget) > 0.75 && (c.spent / c.budget) <= 0.9).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Below 75%</span>
                  <span className="text-sm font-bold text-green-600">
                    {categories.filter(c => (c.spent / c.budget) <= 0.75).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4">Savings Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target</span>
                  <span className="text-sm font-medium">
                    ${(categories.reduce((sum, cat) => sum + cat.savingsTarget, 0) / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Achieved</span>
                  <span className="text-sm font-medium">
                    ${(categories.reduce((sum, cat) => sum + cat.actualSavings, 0) / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-semibold">Achievement</span>
                  <span className={`text-sm font-bold ${
                    (categories.reduce((sum, cat) => sum + cat.actualSavings, 0) /
                     categories.reduce((sum, cat) => sum + cat.savingsTarget, 0)) >= 1
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {((categories.reduce((sum, cat) => sum + cat.actualSavings, 0) /
                       categories.reduce((sum, cat) => sum + cat.savingsTarget, 0)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
