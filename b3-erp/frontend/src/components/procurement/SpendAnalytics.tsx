'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, Download, RefreshCw, Settings, Eye, Filter, Calendar, FileText, AlertCircle, Plus, ArrowUpDown } from 'lucide-react';

export interface CategorySpend {
  category: string;
  spend: number;
  percent: number;
  growth: number;
  supplierCount: number;
}

export interface SupplierSpend {
  supplier: string;
  spend: number;
  percent: number;
  transactions: number;
  avgOrderValue: number;
}

export interface MonthlySpend {
  month: string;
  spend: number;
  budget: number;
  variance: number;
}

const SpendAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('YTD');
  const [selectedView, setSelectedView] = useState<string>('category');

  // Handler functions
  const handleRefresh = () => {
    console.log('Refreshing spend analytics data...');
    alert('Refreshing Spend Analytics...\n\nUpdating:\n- Category spend data\n- Supplier spend rankings\n- Monthly trend analysis\n- Budget variance calculations\n- Spend concentration metrics\n\nSyncing with ERP and procurement systems.\nEstimated time: 10 seconds');
  };

  const handleSettings = () => {
    console.log('Opening spend analytics settings...');
    alert('Spend Analytics Settings\n\nConfigure:\n- Default time period (Monthly, Quarterly, YTD, Annual)\n- Category definitions and mapping\n- Budget thresholds and alerts\n- Supplier grouping rules\n- Variance calculation methods\n- Currency and exchange rates\n- Cost center allocations\n- Dashboard widgets and metrics\n\nCustomization Options:\n- Chart types and visualizations\n- KPI calculations\n- Automatic report scheduling\n- Export templates\n- Alert notifications');
  };

  const handleExport = () => {
    console.log('Exporting spend analytics report...');
    alert('Exporting Spend Analytics Report to Excel...\n\nIncludes:\n- Summary dashboard with KPIs\n- Category spend breakdown with trends\n- Top suppliers by spend\n- Monthly spend trend vs budget\n- Spend concentration analysis\n- Variance analysis details\n- Supplier transaction details\n- YoY growth analysis\n- Custom pivot tables for drill-down\n\nFormat: Excel workbook with multiple sheets\nCharts: Embedded visualizations\nData: Raw data for custom analysis');
  };

  const handleFilterPeriod = () => {
    console.log('Opening period filter...');
    alert('Select Time Period\n\nAvailable Periods:\n- Current Month\n- Current Quarter\n- Year-to-Date (YTD)\n- Last 12 Months\n- Fiscal Year\n- Custom Date Range\n\nComparison Options:\n- vs Previous Period\n- vs Same Period Last Year\n- vs Budget\n- vs Forecast\n\nApply filters to update all analytics and charts.');
  };

  const handleViewCategoryDetails = (category: CategorySpend) => {
    const savingsOpportunity = category.growth > 5 ? category.spend * 0.05 : 0;
    alert(`Category Deep Dive: ${category.category}\n\nSPEND ANALYSIS:\nTotal Spend: $${(category.spend / 1000000).toFixed(2)}M\nPercent of Total: ${category.percent}%\nYoY Growth: ${category.growth > 0 ? '+' : ''}${category.growth}%\nActive Suppliers: ${category.supplierCount}\n\nSUPPLIER CONCENTRATION:\n- Top 3 suppliers: ~60-70% of category spend\n- Diversification score: ${category.supplierCount > 8 ? 'Good' : category.supplierCount > 5 ? 'Moderate' : 'Low'}\n- Risk level: ${category.supplierCount < 5 ? 'HIGH - Limited alternatives' : category.supplierCount < 10 ? 'MEDIUM' : 'LOW'}\n\nTRENDS & INSIGHTS:\n${category.growth > 10 ? '⚠️ High growth rate - investigate drivers\n- Check for price increases\n- Review volume changes\n- Assess market conditions' : category.growth > 5 ? '📊 Moderate growth - within expectations' : category.growth > 0 ? '✅ Controlled growth' : '📉 Declining spend - cost optimization opportunity'}\n\nSAVINGS OPPORTUNITIES:\n${savingsOpportunity > 0 ? `Estimated potential: $${(savingsOpportunity / 1000000).toFixed(2)}M\n- Negotiate volume discounts\n- Consolidate suppliers\n- Explore alternatives` : 'Monitor for future optimization'}\n\nRECOMMENDED ACTIONS:\n1. Conduct supplier benchmarking\n2. Review contract terms and pricing\n3. Explore strategic sourcing initiatives\n4. Assess supplier diversification needs`);
  };

  const handleViewSupplierDetails = (supplier: SupplierSpend) => {
    const concentration = supplier.percent;
    const riskLevel = concentration > 25 ? 'HIGH' : concentration > 15 ? 'MEDIUM' : 'LOW';

    alert(`Supplier Deep Dive: ${supplier.supplier}\n\nSPEND METRICS:\nTotal Spend: $${(supplier.spend / 1000000).toFixed(2)}M\nPercent of Total: ${supplier.percent}%\nTransactions: ${supplier.transactions}\nAvg Order Value: $${supplier.avgOrderValue.toLocaleString()}\n\nBUSINESS RELATIONSHIP:\n- Supplier concentration risk: ${riskLevel}\n- Transaction frequency: ${(supplier.transactions / 12).toFixed(0)} per month\n- Order consistency: ${supplier.avgOrderValue > 50000 ? 'Large orders' : supplier.avgOrderValue > 20000 ? 'Medium orders' : 'Small frequent orders'}\n\nPERFORMANCE INDICATORS:\n${concentration > 20 ? '⚠️ HIGH CONCENTRATION RISK\n- This supplier represents significant portion of spend\n- Single point of failure risk\n- Limited negotiation leverage\n\nRECOMMENDATION: Develop alternative suppliers' : concentration > 10 ? '📊 Moderate concentration - monitor closely' : '✅ Healthy diversification'}\n\nCOST OPTIMIZATION:\nOpportunities:\n- ${supplier.transactions > 100 ? 'Negotiate volume discounts' : 'Consolidate orders for better pricing'}\n- Review payment terms for early payment discounts\n- Benchmark pricing against market rates\n- Explore long-term contracts for price stability\n\nRISK MITIGATION:\n- Establish backup suppliers\n- Regular performance reviews\n- Contract compliance monitoring\n- Diversify supplier base for critical categories`);
  };

  const handleComparePerio ds = () => {
    alert('Period Comparison Analysis\n\nCompare Spend Across Periods:\n\n1. Period Selection:\n   - Current vs Previous Quarter\n   - Current vs Same Quarter Last Year\n   - This Year vs Last Year\n   - Custom period comparison\n\n2. Comparison Metrics:\n   - Total spend variance\n   - Category-wise changes\n   - Supplier spend shifts\n   - Budget adherence trends\n   - Savings realized\n\n3. Analysis Outputs:\n   - Side-by-side comparison charts\n   - Variance explanations\n   - Trend identification\n   - Anomaly detection\n   - Predictive insights\n\n4. Key Questions Answered:\n   - Where did spending increase/decrease?\n   - Which suppliers gained/lost share?\n   - Are we on track with budget?\n   - What drove the changes?\n   - What\'s the forecast impact?\n\nGenerate detailed comparison report with actionable insights.');
  };

  const handleBudgetAlert = () => {
    alert('Budget Alert Configuration\n\nSet Up Spend Alerts:\n\n1. Threshold Alerts:\n   - 80% of category budget\n   - 90% of category budget\n   - 100% budget exceeded\n   - Custom thresholds\n\n2. Variance Alerts:\n   - >10% over budget\n   - >15% over budget\n   - Continuous overspend (3+ months)\n   - Unusual spending patterns\n\n3. Trend Alerts:\n   - Accelerating spend growth\n   - Supplier concentration increasing\n   - Price inflation detected\n   - Volume changes significant\n\n4. Notification Channels:\n   - Email notifications\n   - Dashboard widgets\n   - Mobile app alerts\n   - Weekly summary reports\n\n5. Recipients:\n   - Procurement managers\n   - Category managers\n   - Finance controllers\n   - Executive stakeholders\n\nAlerts help proactive spend management and budget control.');
  };

  const handleDrillDownMonth = (month: MonthlySpend) => {
    const varianceAmount = month.spend - month.budget;
    const status = month.variance > 5 ? 'OVER BUDGET' : month.variance > 0 ? 'Slightly Over' : month.variance > -5 ? 'On Target' : 'Under Budget';

    alert(`Monthly Spend Analysis: ${month.month} 2025\n\nSPEND SUMMARY:\nActual Spend: $${(month.spend / 1000).toFixed(0)}K\nBudget: $${(month.budget / 1000).toFixed(0)}K\nVariance: $${(varianceAmount / 1000).toFixed(0)}K (${month.variance > 0 ? '+' : ''}${month.variance}%)\nStatus: ${status}\n\nSPEND BREAKDOWN:\n- PO Count: ~${Math.floor(month.spend / 25000)} orders\n- Average PO Value: ~$25K\n- Emergency POs: ~5% of total\n\nBUDGET PERFORMANCE:\n${Math.abs(month.variance) > 5 ? `⚠️ SIGNIFICANT VARIANCE DETECTED\n\nRoot Causes:\n${month.variance > 0 ? '- Unplanned purchases\n- Price increases\n- Higher volumes\n- Emergency orders\n\nRequired Actions:\n- Review and justify overspend\n- Update forecast if trend\n- Implement spend controls\n- Get budget adjustment if needed' : '- Lower than expected demand\n- Delayed projects\n- Deferred purchases\n- Cost savings realized\n\nConsideration:\n- Reallocate unused budget\n- Accelerate planned purchases\n- Update forecast downward'}` : '✅ Within acceptable variance\n\nSpend is well-controlled and aligned with budget expectations.'}\n\nCATEGORY DRIVERS:\nTop spending categories this month:\n1. Raw Materials: 42%\n2. Components: 20%\n3. Services: 15%\n\nNEXT STEPS:\n- Review major purchase orders\n- Validate budget allocations\n- Plan upcoming month spend\n- Adjust forecast if needed`);
  };

  const handleGenerateReport = () => {
    alert('Generate Custom Spend Report\n\nReport Builder Options:\n\n1. Report Type:\n   - Executive Summary\n   - Detailed Analytics\n   - Category Deep Dive\n   - Supplier Performance\n   - Budget Variance Analysis\n   - Savings Opportunities\n   - Trend Analysis\n   - Custom Report\n\n2. Time Period:\n   - Current Month\n   - Quarter\n   - Year-to-Date\n   - Last 12 Months\n   - Custom Range\n\n3. Dimensions:\n   - By Category\n   - By Supplier\n   - By Cost Center\n   - By Buyer\n   - By Geography\n   - Multi-dimensional\n\n4. Metrics:\n   - Total Spend\n   - Budget Variance\n   - YoY Growth\n   - Supplier Count\n   - Avg Order Value\n   - Concentration\n   - Savings\n\n5. Visualizations:\n   - Tables\n   - Charts (Bar, Pie, Line)\n   - Heatmaps\n   - Treemaps\n   - Custom dashboards\n\n6. Output Format:\n   - PDF Report\n   - Excel Workbook\n   - PowerPoint\n   - Interactive Dashboard\n\nSchedule: One-time or recurring\nDistribution: Email, Shared folder, Portal');
  };

  const handleIdentifySavings = () => {
    alert('Spend Savings Opportunities\n\nAUTOMATED SAVINGS IDENTIFICATION:\n\n1. Price Variance Analysis:\n   - Same items, different prices across POs\n   - Opportunity: Standardize pricing\n   - Estimated savings: $150K-$200K\n\n2. Supplier Consolidation:\n   - 15 suppliers for similar items\n   - Opportunity: Consolidate to 5-7 suppliers\n   - Estimated savings: $100K-$150K via volume discounts\n\n3. Contract Compliance:\n   - 12% of spend off-contract\n   - Opportunity: Enforce contract usage\n   - Estimated savings: $80K-$120K\n\n4. Payment Terms Optimization:\n   - Early payment discounts available\n   - Opportunity: Capture 2% discounts\n   - Estimated savings: $60K-$80K\n\n5. Demand Management:\n   - Emergency POs: 8% premium\n   - Opportunity: Better planning\n   - Estimated savings: $40K-$60K\n\n6. Category-Specific:\n   - Raw Materials: Negotiate long-term contracts\n   - IT Services: Cloud optimization\n   - Logistics: Route optimization\n   - Packaging: Alternative materials\n\nTOTAL POTENTIAL SAVINGS:\n$430K - $610K (3.5% - 5% of total spend)\n\nIMPLEMENTATION ROADMAP:\nQ1: Quick wins (pricing, compliance)\nQ2: Supplier consolidation\nQ3: Contract negotiations\nQ4: Process improvements\n\nSTART WITH: Highest impact, lowest effort initiatives');
  };

  // Mock data - Category spend
  const categorySpend: CategorySpend[] = [
    { category: 'Raw Materials', spend: 5200000, percent: 42, growth: 8.5, supplierCount: 12 },
    { category: 'Electronic Components', spend: 2450000, percent: 20, growth: -3.2, supplierCount: 8 },
    { category: 'IT Services', spend: 1800000, percent: 15, growth: 12.5, supplierCount: 5 },
    { category: 'Logistics & Transportation', spend: 1350000, percent: 11, growth: 5.8, supplierCount: 6 },
    { category: 'Packaging Materials', spend: 890000, percent: 7, growth: -1.5, supplierCount: 4 },
    { category: 'Maintenance & Repair', spend: 610000, percent: 5, growth: 15.2, supplierCount: 9 },
  ];

  // Mock data - Top suppliers
  const topSuppliers: SupplierSpend[] = [
    { supplier: 'Quality Steel Industries', spend: 3200000, percent: 26, transactions: 124, avgOrderValue: 25806 },
    { supplier: 'Acme Manufacturing Co.', spend: 2450000, percent: 20, transactions: 98, avgOrderValue: 25000 },
    { supplier: 'Global Components Ltd.', spend: 1850000, percent: 15, transactions: 156, avgOrderValue: 11859 },
    { supplier: 'Tech Solutions Inc.', spend: 1800000, percent: 15, transactions: 42, avgOrderValue: 42857 },
    { supplier: 'Precision Parts Manufacturing', spend: 1650000, percent: 13, transactions: 187, avgOrderValue: 8824 },
    { supplier: 'Others', spend: 1350000, percent: 11, transactions: 245, avgOrderValue: 5510 },
  ];

  // Mock data - Monthly spend trend
  const monthlySpend: MonthlySpend[] = [
    { month: 'Jan', spend: 980000, budget: 1000000, variance: -2 },
    { month: 'Feb', spend: 1050000, budget: 1000000, variance: 5 },
    { month: 'Mar', spend: 1120000, budget: 1100000, variance: 1.8 },
    { month: 'Apr', spend: 995000, budget: 1000000, variance: -0.5 },
    { month: 'May', spend: 1230000, budget: 1150000, variance: 7 },
    { month: 'Jun', spend: 1180000, budget: 1150000, variance: 2.6 },
    { month: 'Jul', spend: 1290000, budget: 1200000, variance: 7.5 },
    { month: 'Aug', spend: 1150000, budget: 1150000, variance: 0 },
    { month: 'Sep', spend: 1340000, budget: 1250000, variance: 7.2 },
    { month: 'Oct', spend: 1265000, budget: 1200000, variance: 5.4 },
  ];

  const totalSpend = categorySpend.reduce((sum, c) => sum + c.spend, 0);
  const totalBudget = monthlySpend.reduce((sum, m) => sum + m.budget, 0);
  const totalActualSpend = monthlySpend.reduce((sum, m) => sum + m.spend, 0);
  const overallVariance = ((totalActualSpend - totalBudget) / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Spend Analytics</h2>
              <p className="text-blue-100">Comprehensive spending analysis and insights</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleIdentifySavings}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              title="Identify Savings Opportunities"
            >
              <DollarSign className="h-4 w-4" />
              <span>Savings Opportunities</span>
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              title="Generate Custom Report"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={handleFilterPeriod}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Filter Time Period"
            >
              <Calendar className="h-4 w-4" />
              <span>{selectedPeriod}</span>
            </button>
            <button
              onClick={handleComparePeriods}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Compare Periods"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Compare</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Analytics Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Export to Excel"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spend (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalActualSpend / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variance</p>
              <p className={`text-2xl font-bold ${overallVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {overallVariance > 0 ? '+' : ''}{overallVariance.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {categorySpend.reduce((sum, c) => sum + c.supplierCount, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Category Spend Analysis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Spend by Category</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suppliers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorySpend.map((category, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(category.spend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${category.growth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.supplierCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${category.percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewCategoryDetails(category)}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="View Category Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Suppliers by Spend</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distribution</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSuppliers.map((supplier, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(supplier.spend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.transactions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${supplier.avgOrderValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${supplier.percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewSupplierDetails(supplier)}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Supplier Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Spend Trend */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spend Trend (2025)</h3>
            </div>
            <button
              onClick={handleBudgetAlert}
              className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              title="Configure Budget Alerts"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Set Alerts</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {monthlySpend.map((month, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Actual: <span className="font-semibold">${(month.spend / 1000).toFixed(0)}K</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Budget: <span className="font-semibold">${(month.budget / 1000).toFixed(0)}K</span>
                    </span>
                    <span className={`text-sm font-bold ${month.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {month.variance > 0 ? '+' : ''}{month.variance}%
                    </span>
                    <button
                      onClick={() => handleDrillDownMonth(month)}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                      title="View Month Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </button>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="absolute bg-blue-500 h-6 rounded-full"
                    style={{ width: `${(month.budget / 1400000) * 100}%` }}
                  ></div>
                  <div
                    className={`absolute h-6 rounded-full ${month.variance > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(month.spend / 1400000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spend Concentration Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Concentration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top 3 Suppliers</p>
            <p className="text-2xl font-bold text-blue-600">
              {topSuppliers.slice(0, 3).reduce((sum, s) => sum + s.percent, 0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">of total spend</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top 3 Categories</p>
            <p className="text-2xl font-bold text-purple-600">
              {categorySpend.slice(0, 3).reduce((sum, c) => sum + c.percent, 0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">of total spend</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-green-600">
              ${(topSuppliers.reduce((sum, s) => sum + s.avgOrderValue, 0) / topSuppliers.length / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-500 mt-1">across all suppliers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendAnalytics;
