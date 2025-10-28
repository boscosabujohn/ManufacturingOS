'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Printer,
  Share2,
  Filter,
  ChevronDown,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

export default function ProfitLossPage() {
  const [period, setPeriod] = useState('current-month');
  const [showComparison, setShowComparison] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'revenue',
    'cogs',
    'operating-expenses',
  ]);

  const plData = {
    revenue: {
      domesticSales: { current: 2400000, previous: 2200000 },
      exportSales: { current: 800000, previous: 750000 },
      otherIncome: { current: 150000, previous: 120000 },
    },
    cogs: {
      rawMaterials: { current: 800000, previous: 750000 },
      directLabor: { current: 300000, previous: 280000 },
      manufacturingOverhead: { current: 200000, previous: 190000 },
    },
    operatingExpenses: {
      administrative: {
        salaries: { current: 250000, previous: 240000 },
        rent: { current: 80000, previous: 80000 },
        utilities: { current: 30000, previous: 28000 },
        supplies: { current: 40000, previous: 35000 },
      },
      selling: {
        marketing: { current: 150000, previous: 140000 },
        commission: { current: 100000, previous: 95000 },
        transportation: { current: 50000, previous: 48000 },
      },
    },
    financialExpenses: {
      interestExpense: { current: 150000, previous: 155000 },
      bankCharges: { current: 30000, previous: 28000 },
      depreciation: { current: 125000, previous: 125000 },
    },
  };

  const calculateTotal = (obj: any): { current: number; previous: number } => {
    let current = 0;
    let previous = 0;

    Object.values(obj).forEach((item: any) => {
      if (item.current !== undefined) {
        current += item.current;
        previous += item.previous;
      } else {
        const nested = calculateTotal(item);
        current += nested.current;
        previous += nested.previous;
      }
    });

    return { current, previous };
  };

  const totalRevenue = calculateTotal(plData.revenue);
  const totalCOGS = calculateTotal(plData.cogs);
  const grossProfit = {
    current: totalRevenue.current - totalCOGS.current,
    previous: totalRevenue.previous - totalCOGS.previous,
  };
  const totalOperatingExpenses = calculateTotal(plData.operatingExpenses);
  const operatingProfit = {
    current: grossProfit.current - totalOperatingExpenses.current,
    previous: grossProfit.previous - totalOperatingExpenses.previous,
  };
  const totalFinancialExpenses = calculateTotal(plData.financialExpenses);
  const netProfit = {
    current: operatingProfit.current - totalFinancialExpenses.current,
    previous: operatingProfit.previous - totalFinancialExpenses.previous,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const renderLineItem = (
    label: string,
    current: number,
    previous: number,
    isSubtotal: boolean = false,
    isTotal: boolean = false,
    indent: number = 0
  ) => {
    const change = calculateChange(current, previous);
    const textClass = isTotal
      ? 'text-lg font-bold text-gray-900'
      : isSubtotal
      ? 'font-bold text-gray-900'
      : 'text-gray-700';
    const bgClass = isTotal
      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-t-2 border-b-2 border-blue-300'
      : isSubtotal
      ? 'bg-gray-50 border-t border-b border-gray-300'
      : '';

    return (
      <tr className={`${bgClass} hover:bg-gray-50 transition-colors`}>
        <td className={`px-6 py-3`} style={{ paddingLeft: `${1.5 + indent * 1.5}rem` }}>
          <span className={textClass}>{label}</span>
        </td>
        <td className={`px-6 py-3 text-right ${textClass}`}>
          {formatCurrency(current)}
        </td>
        {showComparison && (
          <>
            <td className={`px-6 py-3 text-right ${textClass}`}>
              {formatCurrency(previous)}
            </td>
            <td className={`px-6 py-3 text-right ${textClass}`}>
              {formatCurrency(current - previous)}
            </td>
            <td className="px-6 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                {change > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : change < 0 ? (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                ) : null}
                <span
                  className={`font-semibold ${
                    change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {change > 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
              </div>
            </td>
          </>
        )}
      </tr>
    );
  };

  const renderExpandableSection: any = (
    title: string,
    sectionKey: string,
    items: any,
    indent: number = 0
  ) => {
    const isExpanded = expandedSections.includes(sectionKey);
    const total = calculateTotal(items);

    return (
      <>
        <tr className="bg-gray-100 border-t-2 border-gray-300">
          <td className="px-6 py-3" style={{ paddingLeft: `${1.5 + indent * 1.5}rem` }}>
            <button
              onClick={() => toggleSection(sectionKey)}
              className="flex items-center gap-2 font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {title}
            </button>
          </td>
          <td className="px-6 py-3 text-right font-bold text-gray-900">
            {formatCurrency(total.current)}
          </td>
          {showComparison && (
            <>
              <td className="px-6 py-3 text-right font-bold text-gray-900">
                {formatCurrency(total.previous)}
              </td>
              <td className="px-6 py-3 text-right font-bold text-gray-900">
                {formatCurrency(total.current - total.previous)}
              </td>
              <td className="px-6 py-3 text-right">
                <span
                  className={`font-bold ${
                    calculateChange(total.current, total.previous) > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {calculateChange(total.current, total.previous) > 0 ? '+' : ''}
                  {calculateChange(total.current, total.previous).toFixed(1)}%
                </span>
              </td>
            </>
          )}
        </tr>
        {isExpanded &&
          Object.entries(items).map(([key, value]: [string, any]) => {
            if (value.current !== undefined) {
              return renderLineItem(
                key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
                value.current,
                value.previous,
                false,
                false,
                indent + 1
              );
            } else {
              return renderExpandableSection(
                key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
                `${sectionKey}-${key}`,
                value,
                indent + 1
              );
            }
          })}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Profit & Loss Statement
            </h1>
            <p className="text-gray-600 mt-1">Income statement for the selected period</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">{formatCurrency(totalRevenue.current)}</p>
            <p className="text-sm text-blue-100 mt-2">
              {calculateChange(totalRevenue.current, totalRevenue.previous) > 0 ? '+' : ''}
              {calculateChange(totalRevenue.current, totalRevenue.previous).toFixed(1)}% vs last period
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-purple-100 text-sm mb-1">Gross Profit</p>
            <p className="text-3xl font-bold">{formatCurrency(grossProfit.current)}</p>
            <p className="text-sm text-purple-100 mt-2">
              {((grossProfit.current / totalRevenue.current) * 100).toFixed(1)}% Margin
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-orange-100 text-sm mb-1">Operating Profit</p>
            <p className="text-3xl font-bold">{formatCurrency(operatingProfit.current)}</p>
            <p className="text-sm text-orange-100 mt-2">
              {((operatingProfit.current / totalRevenue.current) * 100).toFixed(1)}% Margin
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-green-100 text-sm mb-1">Net Profit</p>
            <p className="text-3xl font-bold">{formatCurrency(netProfit.current)}</p>
            <p className="text-sm text-green-100 mt-2">
              {((netProfit.current / totalRevenue.current) * 100).toFixed(1)}% Margin
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Report Options</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="current-quarter">Current Quarter</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="current-year">Current Year</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comparison</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Show Previous Period</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* P&L Statement Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
              <p className="text-green-100 mt-1">For the period: October 2025</p>
            </div>
            <BarChart3 className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">
                  Account
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                  Current Period
                </th>
                {showComparison && (
                  <>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                      Previous Period
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                      Variance
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                      Change %
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Revenue Section */}
              {renderExpandableSection('Revenue', 'revenue', plData.revenue)}
              {renderLineItem('Total Revenue', totalRevenue.current, totalRevenue.previous, true)}

              {/* COGS Section */}
              {renderExpandableSection('Cost of Goods Sold', 'cogs', plData.cogs)}
              {renderLineItem('Total COGS', totalCOGS.current, totalCOGS.previous, true)}

              {/* Gross Profit */}
              {renderLineItem('Gross Profit', grossProfit.current, grossProfit.previous, false, true)}

              {/* Operating Expenses */}
              {renderExpandableSection('Operating Expenses', 'operating-expenses', plData.operatingExpenses)}
              {renderLineItem(
                'Total Operating Expenses',
                totalOperatingExpenses.current,
                totalOperatingExpenses.previous,
                true
              )}

              {/* Operating Profit */}
              {renderLineItem('Operating Profit (EBIT)', operatingProfit.current, operatingProfit.previous, false, true)}

              {/* Financial Expenses */}
              {renderExpandableSection('Financial Expenses', 'financial-expenses', plData.financialExpenses)}
              {renderLineItem(
                'Total Financial Expenses',
                totalFinancialExpenses.current,
                totalFinancialExpenses.previous,
                true
              )}

              {/* Net Profit */}
              {renderLineItem('Net Profit', netProfit.current, netProfit.previous, false, true)}
            </tbody>
          </table>
        </div>

        {/* Profit Margins Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Profitability Ratios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Gross Profit Margin</p>
              <p className="text-2xl font-bold text-purple-600">
                {((grossProfit.current / totalRevenue.current) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Operating Profit Margin</p>
              <p className="text-2xl font-bold text-orange-600">
                {((operatingProfit.current / totalRevenue.current) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Net Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">
                {((netProfit.current / totalRevenue.current) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
