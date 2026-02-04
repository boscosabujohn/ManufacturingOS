'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  Users,
  Truck,
  Wrench,
  Zap,
  TrendingUp,
  TrendingDown,
  Percent,
  PieChart,
  BarChart3,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Calculator,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type CostCategory = 'material' | 'labor' | 'equipment' | 'overhead' | 'subcontractor' | 'shipping' | 'other';

export interface CostLineItem {
  id: string;
  category: CostCategory;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  notes?: string;
  vendor?: string;
  leadTime?: number;
}

export interface CostCategorySummary {
  category: CostCategory;
  totalCost: number;
  percentage: number;
  itemCount: number;
  variance?: number; // Variance from budget or historical
  status: 'normal' | 'warning' | 'critical';
}

export interface CostBreakdownData {
  id: string;
  estimateId: string;
  estimateName: string;
  totalCost: number;
  targetMargin: number;
  suggestedPrice: number;
  lineItems: CostLineItem[];
  categorySummary: CostCategorySummary[];
  contingency: number;
  contingencyAmount: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface CostBreakdownProps {
  data: CostBreakdownData;
  onAddLineItem?: () => void;
  onEditLineItem?: (itemId: string) => void;
  onDeleteLineItem?: (itemId: string) => void;
  onUpdateMargin?: (margin: number) => void;
  onUpdateContingency?: (contingency: number) => void;
  onExport?: () => void;
  onViewDetails?: (category: CostCategory) => void;
  editable?: boolean;
  className?: string;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  data,
  onAddLineItem,
  onEditLineItem,
  onDeleteLineItem,
  onUpdateMargin,
  onUpdateContingency,
  onExport,
  onViewDetails,
  editable = false,
  className = '',
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<CostCategory>>(new Set());
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  const getCategoryConfig = (category: CostCategory) => {
    switch (category) {
      case 'material':
        return { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Material' };
      case 'labor':
        return { icon: Users, color: 'text-green-600', bg: 'bg-green-50', label: 'Labor' };
      case 'equipment':
        return { icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Equipment' };
      case 'overhead':
        return { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Overhead' };
      case 'subcontractor':
        return { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Subcontractor' };
      case 'shipping':
        return { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Shipping' };
      case 'other':
        return { icon: DollarSign, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Other' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal':
        return { icon: CheckCircle, color: 'text-green-600', label: 'On Budget' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-yellow-600', label: 'Near Limit' };
      case 'critical':
        return { icon: AlertCircle, color: 'text-red-600', label: 'Over Budget' };
      default:
        return { icon: Info, color: 'text-gray-600', label: 'Unknown' };
    }
  };

  const toggleCategory = (category: CostCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const totalCostWithContingency = data.totalCost + data.contingencyAmount;
  const marginAmount = totalCostWithContingency * (data.targetMargin / 100);
  const finalPrice = totalCostWithContingency + marginAmount;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{data.estimateName}</h2>
            <p className="text-sm text-gray-600">
              Estimate ID: {data.estimateId} • Updated by {data.updatedBy} on{' '}
              {new Date(data.lastUpdated).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {viewMode === 'summary' ? 'Detailed View' : 'Summary View'}
            </button>
            {onExport && (
              <button
                onClick={onExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Cost Summary Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <p className="text-sm opacity-90 mb-1">Total Direct Cost</p>
            <p className="text-3xl font-bold">${data.totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <p className="text-sm opacity-90 mb-1">Contingency ({data.contingency}%)</p>
            <p className="text-3xl font-bold">${data.contingencyAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
            <p className="text-sm opacity-90 mb-1">Target Margin ({data.targetMargin}%)</p>
            <p className="text-3xl font-bold">${marginAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <p className="text-sm opacity-90 mb-1">Suggested Price</p>
            <p className="text-3xl font-bold">${finalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Summary - Pie Chart View */}
      {viewMode === 'summary' && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Cost Distribution by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Visual Pie Chart Representation */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Simple stacked bar representation (simplified pie chart) */}
                <div className="grid grid-cols-1 gap-2">
                  {data.categorySummary.map((summary) => {
                    const config = getCategoryConfig(summary.category);
                    const CategoryIcon = config.icon;
                    const statusConfig = getStatusConfig(summary.status);

                    return (
                      <div key={summary.category} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <CategoryIcon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-900">{config.label}</span>
                            <span className="text-sm font-bold text-gray-900">
                              ${summary.totalCost.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${config.bg.replace('50', '500')}`}
                              style={{ width: `${summary.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-600">
                              {summary.percentage.toFixed(1)}% • {summary.itemCount} items
                            </span>
                            {summary.variance !== undefined && (
                              <div className="flex items-center text-xs">
                                {summary.variance > 0 ? (
                                  <TrendingUp className={`h-3 w-3 ${statusConfig.color} mr-1`} />
                                ) : (
                                  <TrendingDown className={`h-3 w-3 text-green-600 mr-1`} />
                                )}
                                <span className={statusConfig.color}>
                                  {Math.abs(summary.variance).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div className="space-y-3">
              {data.categorySummary.map((summary) => {
                const config = getCategoryConfig(summary.category);
                const statusConfig = getStatusConfig(summary.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={summary.category}
                    className={`border-2 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${
                      summary.status === 'critical'
                        ? 'border-red-300 bg-red-50'
                        : summary.status === 'warning'
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                    onClick={() => onViewDetails?.(summary.category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <config.icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{config.label}</h4>
                          <p className="text-xs text-gray-600">{summary.itemCount} line items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${summary.totalCost.toLocaleString()}</p>
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-xs text-gray-600">{summary.percentage.toFixed(1)}%</span>
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Line Items View */}
      {viewMode === 'detailed' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Cost Line Items</h3>
            {editable && onAddLineItem && (
              <button
                onClick={onAddLineItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {data.categorySummary.map((summary) => {
              const config = getCategoryConfig(summary.category);
              const isExpanded = expandedCategories.has(summary.category);
              const categoryItems = data.lineItems.filter((item) => item.category === summary.category);

              return (
                <div key={summary.category}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(summary.category)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <config.icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-gray-900">{config.label}</h4>
                        <p className="text-xs text-gray-600">
                          {summary.itemCount} items • ${summary.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-900">{summary.percentage.toFixed(1)}%</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="bg-gray-50 px-3 py-2">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-gray-600 border-b border-gray-200">
                            <th className="pb-2 font-semibold">Description</th>
                            <th className="pb-2 font-semibold text-right">Quantity</th>
                            <th className="pb-2 font-semibold text-right">Unit</th>
                            <th className="pb-2 font-semibold text-right">Unit Cost</th>
                            <th className="pb-2 font-semibold text-right">Total Cost</th>
                            {editable && <th className="pb-2 font-semibold text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {categoryItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 last:border-0">
                              <td className="py-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{item.description}</p>
                                  {item.notes && <p className="text-xs text-gray-600 mt-1">{item.notes}</p>}
                                  {item.vendor && (
                                    <p className="text-xs text-blue-600 mt-1">Vendor: {item.vendor}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 text-right text-sm text-gray-900">{item.quantity}</td>
                              <td className="py-3 text-right text-sm text-gray-900">{item.unit}</td>
                              <td className="py-3 text-right text-sm text-gray-900">
                                ${item.unitCost.toLocaleString()}
                              </td>
                              <td className="py-3 text-right text-sm font-bold text-gray-900">
                                ${item.totalCost.toLocaleString()}
                              </td>
                              {editable && (
                                <td className="py-3 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    {onEditLineItem && (
                                      <button
                                        onClick={() => onEditLineItem(item.id)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Edit"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                    )}
                                    {onDeleteLineItem && (
                                      <button
                                        onClick={() => onDeleteLineItem(item.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Calculation Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Price Calculation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Total Direct Cost</span>
            <span className="text-lg font-semibold text-gray-900">${data.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Contingency</span>
              {editable && onUpdateContingency && (
                <button
                  onClick={() => onUpdateContingency(data.contingency)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit Contingency"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600 mr-2">({data.contingency}%)</span>
              <span className="text-lg font-semibold text-gray-900">
                ${data.contingencyAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200">
            <span className="text-gray-700 font-semibold">Total Cost with Contingency</span>
            <span className="text-lg font-bold text-gray-900">${totalCostWithContingency.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Target Margin</span>
              {editable && onUpdateMargin && (
                <button
                  onClick={() => onUpdateMargin(data.targetMargin)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit Margin"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600 mr-2">({data.targetMargin}%)</span>
              <span className="text-lg font-semibold text-green-600">${marginAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 bg-blue-50 px-4 rounded-lg">
            <span className="text-lg font-bold text-gray-900">Suggested Selling Price</span>
            <span className="text-2xl font-bold text-blue-600">${finalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
