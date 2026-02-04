'use client';

import React, { useState } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  FileText,
  Download,
  AlertTriangle,
  Calendar,
  Users,
  Target,
  BarChart3,
  Calculator,
  Eye,
  History,
  Lock,
} from 'lucide-react';

interface ProjectCost {
  id: string;
  projectId: string;
  projectName: string;
  projectType: string;
  customer: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'On Hold';
  totalBudget: number;
  actualCost: number;
  committedCost: number;
  forecastedCost: number;
  variance: number;
  variancePercent: number;
  costBreakdown: CostBreakdown[];
  profitMargin: number;
  actualProfit: number;
}

interface CostBreakdown {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'Under Budget' | 'On Budget' | 'Over Budget';
}

// 1. Cost Breakdown Details Modal
interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
}

export function CostBreakdownModal({ isOpen, onClose, project }: CostBreakdownModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PieChart className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Breakdown</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="font-semibold text-blue-900">{project.projectName}</h3>
            <p className="text-sm text-blue-700">{project.projectId} - {project.customer}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Total Budget</p>
              <p className="text-lg font-bold text-gray-900">₹{project.totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Actual Cost</p>
              <p className="text-lg font-bold text-purple-900">₹{project.actualCost.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Committed</p>
              <p className="text-lg font-bold text-orange-900">₹{project.committedCost.toLocaleString('en-IN')}</p>
            </div>
            <div className={`border rounded-lg p-3 ${project.variance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs mb-1 ${project.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>Variance</p>
              <p className={`text-lg font-bold ${project.variance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                ₹{Math.abs(project.variance).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budgeted</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">%</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {project.costBreakdown.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.budgeted.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.actual.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variance >= 0 ? '+' : ''}₹{item.variance.toLocaleString('en-IN')}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${item.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'Under Budget' ? 'bg-green-100 text-green-700' :
                        item.status === 'On Budget' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Add Cost Entry Modal
interface AddCostEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
  onAdd: (entry: any) => void;
}

export function AddCostEntryModal({ isOpen, onClose, project, onAdd }: AddCostEntryModalProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onAdd({
      projectId: project?.id,
      category,
      description,
      amount: parseFloat(amount),
      date,
      vendor,
      invoiceNumber,
      notes,
    });
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Add Cost Entry</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-medium text-green-900">{project.projectName}</p>
            <p className="text-xs text-green-700">{project.projectId}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                <option value="Materials">Materials</option>
                <option value="Labor">Labor</option>
                <option value="Equipment">Equipment</option>
                <option value="Subcontractors">Subcontractors</option>
                <option value="Overheads">Overheads</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Brief description"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="INV-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Vendor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Additional notes"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!category || !description || !amount || !date}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Add Cost Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Cost Variance Analysis Modal
interface CostVarianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
}

export function CostVarianceModal({ isOpen, onClose, project }: CostVarianceModalProps) {
  if (!isOpen || !project) return null;

  const isOverBudget = project.variance < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Variance Analysis</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h3 className="font-semibold text-orange-900">{project.projectName}</h3>
            <p className="text-sm text-orange-700">{project.projectId}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Budget</p>
              <p className="text-2xl font-bold text-blue-900">₹{project.totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Actual + Committed</p>
              <p className="text-2xl font-bold text-purple-900">
                ₹{(project.actualCost + project.committedCost).toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`border rounded-lg p-3 ${isOverBudget ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-xs mb-1 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>Variance</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-900' : 'text-green-900'}`}>
                {isOverBudget ? '-' : '+'}₹{Math.abs(project.variance).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Variance Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Utilization:</span>
                <span className="font-semibold text-gray-900">
                  {((project.actualCost / project.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forecasted Final Cost:</span>
                <span className="font-semibold text-gray-900">₹{project.forecastedCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forecasted Variance:</span>
                <span className={`font-semibold ${project.forecastedCost > project.totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(project.totalBudget - project.forecastedCost).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project Progress:</span>
                <span className="font-semibold text-gray-900">{project.progress}%</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${isOverBudget ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-start gap-2">
              {isOverBudget && <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
              <div>
                <h4 className={`font-semibold ${isOverBudget ? 'text-yellow-900' : 'text-green-900'}`}>
                  {isOverBudget ? 'Cost Overrun Alert' : 'Within Budget'}
                </h4>
                <p className={`text-sm mt-1 ${isOverBudget ? 'text-yellow-800' : 'text-green-800'}`}>
                  {isOverBudget
                    ? `Project is forecasted to exceed budget by ₹${Math.abs(project.forecastedCost - project.totalBudget).toLocaleString('en-IN')}. Review spending and implement cost control measures.`
                    : `Project is on track to remain within budget. Continue monitoring expenses closely.`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Category Variances</h4>
            <div className="space-y-2">
              {project.costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.category}:</span>
                  <span className={`text-sm font-semibold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.variance >= 0 ? '+' : ''}₹{item.variance.toLocaleString('en-IN')} ({item.variancePercent.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Profit Margin Analysis Modal
interface ProfitMarginModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
}

export function ProfitMarginModal({ isOpen, onClose, project }: ProfitMarginModalProps) {
  if (!isOpen || !project) return null;

  const projectedRevenue = project.totalBudget;
  const projectedCost = project.forecastedCost;
  const projectedProfit = projectedRevenue - projectedCost;
  const projectedMargin = (projectedProfit / projectedRevenue) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Profit Margin Analysis</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <h3 className="font-semibold text-indigo-900">{project.projectName}</h3>
            <p className="text-sm text-indigo-700">{project.projectId}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-2">Target Profit Margin</p>
              <p className="text-3xl font-bold text-blue-900">{project.profitMargin}%</p>
              <p className="text-xs text-blue-700 mt-1">
                ₹{(project.totalBudget * project.profitMargin / 100).toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`border rounded-lg p-3 ${projectedMargin >= project.profitMargin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm mb-2 ${projectedMargin >= project.profitMargin ? 'text-green-600' : 'text-red-600'}`}>
                Projected Margin
              </p>
              <p className={`text-3xl font-bold ${projectedMargin >= project.profitMargin ? 'text-green-900' : 'text-red-900'}`}>
                {projectedMargin.toFixed(1)}%
              </p>
              <p className={`text-xs mt-1 ${projectedMargin >= project.profitMargin ? 'text-green-700' : 'text-red-700'}`}>
                ₹{projectedProfit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Financial Summary</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue:</span>
                  <span className="font-semibold text-gray-900">₹{projectedRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Forecasted Cost:</span>
                  <span className="font-semibold text-gray-900">₹{projectedCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Projected Profit:</span>
                  <span className={`font-semibold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{projectedProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Actual Profit (Current):</span>
                  <span className={`font-semibold ${project.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{project.actualProfit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Margin Gap:</span>
                  <span className={`font-semibold ${projectedMargin >= project.profitMargin ? 'text-green-600' : 'text-red-600'}`}>
                    {(projectedMargin - project.profitMargin).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    projectedMargin >= project.profitMargin
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {projectedMargin >= project.profitMargin ? 'On Track' : 'At Risk'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${
            projectedMargin >= project.profitMargin
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-2">
              {projectedMargin < project.profitMargin && (
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`font-semibold ${
                  projectedMargin >= project.profitMargin ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {projectedMargin >= project.profitMargin ? 'Profit Target On Track' : 'Profit Margin Risk'}
                </h4>
                <p className={`text-sm mt-1 ${
                  projectedMargin >= project.profitMargin ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {projectedMargin >= project.profitMargin
                    ? `Project is on track to meet the ${project.profitMargin}% profit margin target with a projected margin of ${projectedMargin.toFixed(1)}%.`
                    : `Project margin is below target. Current projection is ${projectedMargin.toFixed(1)}% vs target of ${project.profitMargin}%. Review costs and consider value engineering.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Cost Forecast Modal
interface CostForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
}

export function CostForecastModal({ isOpen, onClose, project }: CostForecastModalProps) {
  const [forecastMethod, setForecastMethod] = useState('Earned Value');

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Forecast</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h3 className="font-semibold text-purple-900">{project.projectName}</h3>
            <p className="text-sm text-purple-700">Progress: {project.progress}%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Method</label>
            <select
              value={forecastMethod}
              onChange={(e) => setForecastMethod(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option>Earned Value</option>
              <option>Linear Projection</option>
              <option>Historical Average</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Budget (BAC)</p>
              <p className="text-xl font-bold text-blue-900">₹{project.totalBudget.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1">Actual Cost (AC)</p>
              <p className="text-xl font-bold text-green-900">₹{project.actualCost.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Estimate at Completion</p>
              <p className="text-xl font-bold text-orange-900">₹{project.forecastedCost.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Forecast Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Performance Index (CPI):</span>
                <span className="font-semibold text-gray-900">
                  {((project.totalBudget * project.progress / 100) / project.actualCost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimate to Complete (ETC):</span>
                <span className="font-semibold text-gray-900">
                  ₹{(project.forecastedCost - project.actualCost).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variance at Completion (VAC):</span>
                <span className={`font-semibold ${project.totalBudget - project.forecastedCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(project.totalBudget - project.forecastedCost).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">To Complete Performance Index:</span>
                <span className="font-semibold text-gray-900">
                  {((project.totalBudget - (project.totalBudget * project.progress / 100)) / (project.totalBudget - project.actualCost)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Resource Cost Analysis Modal
interface ResourceCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCost | null;
}

export function ResourceCostModal({ isOpen, onClose, project }: ResourceCostModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Resource Cost Analysis</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <h3 className="font-semibold text-teal-900">{project.projectName}</h3>
            <p className="text-sm text-teal-700">Resource cost distribution and utilization</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {project.costBreakdown.filter(c => c.category === 'Labor' || c.category === 'Subcontractors').map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-2">{item.category}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budgeted:</span>
                    <span className="font-medium">₹{item.budgeted.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actual:</span>
                    <span className="font-medium">₹{item.actual.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilization:</span>
                    <span className="font-medium">{((item.actual / item.budgeted) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Total Resource Costs</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Resource Budget:</span>
                <span className="font-semibold text-gray-900">
                  ₹{project.costBreakdown.filter(c => c.category === 'Labor' || c.category === 'Subcontractors')
                    .reduce((sum, item) => sum + item.budgeted, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Resource Actual:</span>
                <span className="font-semibold text-gray-900">
                  ₹{project.costBreakdown.filter(c => c.category === 'Labor' || c.category === 'Subcontractors')
                    .reduce((sum, item) => sum + item.actual, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Resource Cost % of Total:</span>
                <span className="font-semibold text-gray-900">
                  {((project.costBreakdown.filter(c => c.category === 'Labor' || c.category === 'Subcontractors')
                    .reduce((sum, item) => sum + item.actual, 0) / project.actualCost) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. Cost Comparison Modal
interface CostComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectCost[];
}

export function CostComparisonModal({ isOpen, onClose, projects }: CostComparisonModalProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  if (!isOpen) return null;

  const compareProjects = projects.filter(p => selectedProjects.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Project Cost Comparison</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Projects to Compare</label>
            <div className="grid grid-cols-2 gap-2">
              {projects.slice(0, 6).map((project) => (
                <label key={project.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects([...selectedProjects, project.id]);
                      } else {
                        setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                      }
                    }}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{project.projectName}</span>
                </label>
              ))}
            </div>
          </div>

          {compareProjects.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                    {compareProjects.map((project) => (
                      <th key={project.id} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {project.projectId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Budget</td>
                    {compareProjects.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-sm text-gray-900 text-right">
                        ₹{p.totalBudget.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Actual Cost</td>
                    {compareProjects.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-sm text-gray-900 text-right">
                        ₹{p.actualCost.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Variance</td>
                    {compareProjects.map((p) => (
                      <td key={p.id} className={`px-4 py-3 text-sm font-medium text-right ${p.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {p.variance >= 0 ? '+' : ''}₹{p.variance.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Progress</td>
                    {compareProjects.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-sm text-gray-900 text-right">
                        {p.progress}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Profit Margin</td>
                    {compareProjects.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-sm text-gray-900 text-right">
                        {p.profitMargin}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 8-12: Additional Modals (simplified for space)

export function CostReportModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectCost | null }) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Report</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Comprehensive cost report for {project.projectName}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportCostDataModal({ isOpen, onClose, onExport }: { isOpen: boolean; onClose: () => void; onExport: (format: string) => void }) {
  const [format, setFormat] = useState('Excel');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Export Cost Data</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option>Excel</option>
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={() => onExport(format)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

export function CostHistoryModal({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project: ProjectCost | null }) {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost History</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Historical cost tracking for {project.projectName}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function CostApprovalModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [approver, setApprover] = useState('');
  const [comments, setComments] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Submit for Approval</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approver</label>
            <select value={approver} onChange={(e) => setApprover(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select approver</option>
              <option value="manager">Project Manager</option>
              <option value="director">Finance Director</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSubmit({ approver, comments })} disabled={!approver} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export function CostAlertModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }) {
  const [threshold, setThreshold] = useState('90');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Alert Settings</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (%)</label>
          <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave({ threshold })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Save</button>
        </div>
      </div>
    </div>
  );
}
