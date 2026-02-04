'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  DollarSign,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Calendar,
  History,
  PieChart,
  Target,
  Bell,
  Lock,
  BarChart3,
} from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  status: 'Under Budget' | 'On Budget' | 'Over Budget';
}

// 1. Add Budget Item Modal
interface AddBudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export function AddBudgetItemModal({ isOpen, onClose, onAdd }: AddBudgetItemModalProps) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [costCenter, setCostCenter] = useState('');

  const handleSubmit = () => {
    onAdd({
      category,
      subcategory,
      description,
      estimatedCost: parseFloat(estimatedCost),
      plannedDate,
      costCenter,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Add Budget Item</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="Equipment">Equipment</option>
                <option value="Civil Work">Civil Work</option>
                <option value="Labor">Labor</option>
                <option value="Materials">Materials</option>
                <option value="Testing & QC">Testing & QC</option>
                <option value="Commissioning">Commissioning</option>
                <option value="Contingency">Contingency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subcategory"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the budget item"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (₹) *</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Date</label>
              <input
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
            <input
              type="text"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Cost center code"
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
            disabled={!category || !subcategory || !description || !estimatedCost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Budget Item
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Edit Budget Item Modal
interface EditBudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BudgetItem | null;
  onSave: (item: any) => void;
}

export function EditBudgetItemModal({ isOpen, onClose, item, onSave }: EditBudgetItemModalProps) {
  const [estimatedCost, setEstimatedCost] = useState(item?.estimatedCost.toString() || '');
  const [actualCost, setActualCost] = useState(item?.actualCost.toString() || '');
  const [description, setDescription] = useState(item?.description || '');

  const handleSubmit = () => {
    onSave({
      ...item,
      estimatedCost: parseFloat(estimatedCost),
      actualCost: parseFloat(actualCost),
      description,
    });
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Edit Budget Item</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">{item.category} - {item.subcategory}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost (₹)</label>
              <input
                type="number"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Variance</p>
                <p className="font-semibold text-gray-900">
                  ₹{(parseFloat(estimatedCost || '0') - parseFloat(actualCost || '0')).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">% Variance</p>
                <p className="font-semibold text-gray-900">
                  {((parseFloat(estimatedCost || '0') - parseFloat(actualCost || '0')) / parseFloat(estimatedCost || '1') * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-semibold ${parseFloat(actualCost || '0') > parseFloat(estimatedCost || '0') ? 'text-red-600' : 'text-green-600'}`}>
                  {parseFloat(actualCost || '0') > parseFloat(estimatedCost || '0') ? 'Over Budget' : 'Under Budget'}
                </p>
              </div>
            </div>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Record Actual Cost Modal
interface RecordActualCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BudgetItem | null;
  onRecord: (cost: any) => void;
}

export function RecordActualCostModal({ isOpen, onClose, item, onRecord }: RecordActualCostModalProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = () => {
    onRecord({
      itemId: item?.id,
      amount: parseFloat(amount),
      date,
      invoiceNumber,
      vendor,
      notes,
      attachment,
    });
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Record Actual Cost</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm font-medium text-purple-900">{item.category} - {item.subcategory}</p>
            <p className="text-xs text-purple-700 mt-1">{item.description}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div>
                <span className="text-purple-600">Estimated: </span>
                <span className="font-semibold">₹{item.estimatedCost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-purple-600">Current Actual: </span>
                <span className="font-semibold">₹{item.actualCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="INV-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Vendor name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Additional notes about this expense"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500 mt-1">Upload invoice or receipt (PDF, JPG, PNG)</p>
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
            disabled={!amount || !date}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Record Cost
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Budget Variance Analysis Modal
interface VarianceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BudgetItem | null;
}

export function VarianceAnalysisModal({ isOpen, onClose, item }: VarianceAnalysisModalProps) {
  if (!isOpen || !item) return null;

  const variance = item.estimatedCost - item.actualCost;
  const variancePercent = (variance / item.estimatedCost) * 100;
  const isOverBudget = variance < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Variance Analysis</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h3 className="font-semibold text-orange-900">{item.category} - {item.subcategory}</h3>
            <p className="text-sm text-orange-700 mt-1">{item.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Estimated Cost</p>
              <p className="text-2xl font-bold text-blue-900">₹{item.estimatedCost.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Actual Cost</p>
              <p className="text-2xl font-bold text-purple-900">₹{item.actualCost.toLocaleString('en-IN')}</p>
            </div>
            <div className={`${isOverBudget ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
              <p className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-green-600'} mb-1`}>Variance</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-900' : 'text-green-900'}`}>
                ₹{Math.abs(variance).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Variance Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variance Amount:</span>
                <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {isOverBudget ? '-' : '+'}₹{Math.abs(variance).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variance Percentage:</span>
                <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {isOverBudget ? '-' : '+'}{Math.abs(variancePercent).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {isOverBudget ? 'Over Budget' : 'Under Budget'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Utilization:</span>
                <span className="font-semibold text-gray-900">
                  {((item.actualCost / item.estimatedCost) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Analysis</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  {isOverBudget
                    ? `This item is over budget by ₹${Math.abs(variance).toLocaleString('en-IN')}. Review the causes and take corrective action.`
                    : `This item is under budget by ₹${Math.abs(variance).toLocaleString('en-IN')}. Ensure quality standards are maintained.`
                  }
                </p>
              </div>
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

// 5. Budget Forecast Modal
interface BudgetForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItems: BudgetItem[];
}

export function BudgetForecastModal({ isOpen, onClose, budgetItems }: BudgetForecastModalProps) {
  const [forecastMethod, setForecastMethod] = useState('Linear');
  const [confidence, setConfidence] = useState('Medium');

  if (!isOpen) return null;

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const spendRate = totalActual / totalEstimated;
  const forecastTotal = totalEstimated * (1 + (spendRate - 1) * 0.5); // Simple forecast

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Budget Forecast</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Method</label>
              <select
                value={forecastMethod}
                onChange={(e) => setForecastMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>Linear</option>
                <option>Exponential</option>
                <option>Historical Average</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confidence Level</label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Original Budget</p>
              <p className="text-xl font-bold text-blue-900">₹{totalEstimated.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Current Spend</p>
              <p className="text-xl font-bold text-purple-900">₹{totalActual.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Forecast Total</p>
              <p className="text-xl font-bold text-orange-900">₹{Math.round(forecastTotal).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Forecast Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Spend Rate:</span>
                <span className="font-semibold text-gray-900">{(spendRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projected Variance:</span>
                <span className={`font-semibold ${forecastTotal > totalEstimated ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(forecastTotal - totalEstimated).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variance Percentage:</span>
                <span className={`font-semibold ${forecastTotal > totalEstimated ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(((forecastTotal - totalEstimated) / totalEstimated) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Recommendation</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  {forecastTotal > totalEstimated
                    ? 'Project is forecast to exceed budget. Consider cost control measures and review spending patterns.'
                    : 'Project is forecast to remain within budget. Continue monitoring spending trends.'
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

// 6. Cost Breakdown Modal
interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItems: BudgetItem[];
}

export function CostBreakdownModal({ isOpen, onClose, budgetItems }: CostBreakdownModalProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(budgetItems.map(item => item.category)));
  const categorySummary = categories.map(category => {
    const items = budgetItems.filter(item => item.category === category);
    const estimated = items.reduce((sum, item) => sum + item.estimatedCost, 0);
    const actual = items.reduce((sum, item) => sum + item.actualCost, 0);
    return { category, estimated, actual, count: items.length };
  });

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PieChart className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Cost Breakdown by Category</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-1">Total Estimated</p>
              <p className="text-2xl font-bold text-blue-900">₹{totalEstimated.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-600 mb-1">Total Actual</p>
              <p className="text-2xl font-bold text-purple-900">₹{totalActual.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estimated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categorySummary.map((cat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{cat.count}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{cat.estimated.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{cat.actual.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{((cat.estimated / totalEstimated) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{budgetItems.length}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{totalEstimated.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{totalActual.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
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

// 7. Budget Allocation Modal
interface BudgetAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: (allocation: any) => void;
}

export function BudgetAllocationModal({ isOpen, onClose, onAllocate }: BudgetAllocationModalProps) {
  const [totalBudget, setTotalBudget] = useState('');
  const [allocations, setAllocations] = useState([
    { category: 'Equipment', percentage: 40 },
    { category: 'Civil Work', percentage: 20 },
    { category: 'Labor', percentage: 25 },
    { category: 'Testing & QC', percentage: 5 },
    { category: 'Commissioning', percentage: 5 },
    { category: 'Contingency', percentage: 5 },
  ]);

  const totalPercentage = allocations.reduce((sum, item) => sum + item.percentage, 0);

  const handleSubmit = () => {
    onAllocate({
      totalBudget: parseFloat(totalBudget),
      allocations,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Budget Allocation</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter total budget amount"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-semibold text-gray-900 mb-3">Category Allocations</h4>
            <div className="space-y-3">
              {allocations.map((alloc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <label className="w-32 text-sm font-medium text-gray-700">{alloc.category}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={alloc.percentage}
                    onChange={(e) => {
                      const newAllocations = [...allocations];
                      newAllocations[index].percentage = parseInt(e.target.value);
                      setAllocations(newAllocations);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={alloc.percentage}
                    onChange={(e) => {
                      const newAllocations = [...allocations];
                      newAllocations[index].percentage = parseInt(e.target.value) || 0;
                      setAllocations(newAllocations);
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <span className="w-32 text-sm font-medium text-gray-900 text-right">
                    ₹{Math.round((parseFloat(totalBudget || '0') * alloc.percentage) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${totalPercentage === 100 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Allocation:</span>
              <span className={`text-xl font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                {totalPercentage}%
              </span>
            </div>
            {totalPercentage !== 100 && (
              <p className="text-xs text-yellow-700 mt-1">Allocations must total 100%</p>
            )}
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
            disabled={!totalBudget || totalPercentage !== 100}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            Apply Allocation
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. Budget History Modal
interface BudgetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BudgetItem | null;
}

export function BudgetHistoryModal({ isOpen, onClose, item }: BudgetHistoryModalProps) {
  if (!isOpen || !item) return null;

  const mockHistory = [
    { date: '2025-03-15', event: 'Budget Item Created', user: 'John Doe', details: `Estimated cost: ₹${item.estimatedCost.toLocaleString('en-IN')}` },
    { date: '2025-04-10', event: 'Actual Cost Recorded', user: 'Jane Smith', details: 'Invoice INV-2025-001, Amount: ₹500,000' },
    { date: '2025-05-05', event: 'Budget Revised', user: 'John Doe', details: 'Estimated cost updated from ₹2,500,000 to ₹2,800,000' },
    { date: '2025-06-20', event: 'Actual Cost Recorded', user: 'Jane Smith', details: 'Invoice INV-2025-042, Amount: ₹1,250,000' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Budget History</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900">{item.category} - {item.subcategory}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>

          <div className="space-y-3">
            {mockHistory.map((entry, index) => (
              <div key={index} className="flex gap-2 border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex-shrink-0 w-24">
                  <p className="text-xs text-gray-500">{entry.date}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{entry.event}</p>
                  <p className="text-sm text-gray-600">{entry.details}</p>
                  <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. Budget Alert Settings Modal
interface BudgetAlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function BudgetAlertSettingsModal({ isOpen, onClose, onSave }: BudgetAlertSettingsModalProps) {
  const [threshold, setThreshold] = useState('80');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [recipients, setRecipients] = useState('');
  const [alertFrequency, setAlertFrequency] = useState('Daily');

  const handleSubmit = () => {
    onSave({
      threshold: parseFloat(threshold),
      emailNotifications,
      recipients: recipients.split(',').map(e => e.trim()),
      alertFrequency,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Budget Alert Settings</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (%)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="80"
            />
            <p className="text-xs text-gray-500 mt-1">Alert when budget utilization exceeds this percentage</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
              Enable email notifications
            </label>
          </div>

          {emailNotifications && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients (comma-separated)</label>
                <textarea
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Frequency</label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option>Immediate</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </>
          )}
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
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. Budget Approval Modal
interface BudgetApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (approval: any) => void;
}

export function BudgetApprovalModal({ isOpen, onClose, onSubmit }: BudgetApprovalModalProps) {
  const [approver, setApprover] = useState('');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    onSubmit({
      approver,
      comments,
      attachments,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-t-lg">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Approver *</label>
            <select
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select approver</option>
              <option value="finance-manager">Finance Manager</option>
              <option value="project-director">Project Director</option>
              <option value="cfo">CFO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Add comments for the approver..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Attach supporting documents</p>
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
            disabled={!approver}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}

// 11. Budget Baseline Modal
interface BudgetBaselineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (baseline: any) => void;
}

export function BudgetBaselineModal({ isOpen, onClose, onSave }: BudgetBaselineModalProps) {
  const [baselineName, setBaselineName] = useState('');
  const [description, setDescription] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const handleSubmit = () => {
    onSave({
      baselineName,
      description,
      effectiveDate,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Set Budget Baseline</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <p className="text-sm text-cyan-900">
              Setting a baseline will lock the current budget as a reference point for future variance analysis.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baseline Name *</label>
            <input
              type="text"
              value={baselineName}
              onChange={(e) => setBaselineName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Approved Budget 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Describe the purpose of this baseline..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
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
            disabled={!baselineName || !effectiveDate}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
          >
            Set Baseline
          </button>
        </div>
      </div>
    </div>
  );
}

// 12. Budget Template Modal
interface BudgetTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (template: any) => void;
}

export function BudgetTemplateModal({ isOpen, onClose, onApply }: BudgetTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { id: 'restaurant', name: 'Restaurant Setup', description: 'Standard budget for restaurant setup projects' },
    { id: 'manufacturing', name: 'Manufacturing Facility', description: 'Budget template for manufacturing setup' },
    { id: 'office', name: 'Office Renovation', description: 'Office space renovation budget' },
    { id: 'custom', name: 'Custom Template', description: 'Start with a blank template' },
  ];

  const handleApply = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    onApply(template);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Apply Budget Template</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <p className="text-sm text-gray-600">
            Select a predefined template to quickly set up your budget structure.
          </p>

          <div className="space-y-3">
            {templates.map((template) => (
              <label
                key={template.id}
                className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </label>
            ))}
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
            onClick={handleApply}
            disabled={!selectedTemplate}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}

// 13. Export Budget Modal
interface ExportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

export function ExportBudgetModal({ isOpen, onClose, onExport }: ExportBudgetModalProps) {
  const [format, setFormat] = useState('Excel');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeVariance, setIncludeVariance] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const handleExport = () => {
    onExport(format);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Export Budget</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="space-y-2">
              {['Excel', 'PDF', 'CSV'].map((fmt) => (
                <label key={fmt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="format"
                    value={fmt}
                    checked={format === fmt}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Detailed line items</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeVariance}
                  onChange={(e) => setIncludeVariance(e.target.checked)}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Variance analysis</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Category summary</span>
              </label>
            </div>
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
            onClick={handleExport}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// 14. Import Budget Modal
interface ImportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export function ImportBudgetModal({ isOpen, onClose, onImport }: ImportBudgetModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mergeOption, setMergeOption] = useState('replace');

  const handleImport = () => {
    if (file) {
      onImport(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Import Budget</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              accept=".xlsx,.xls,.csv"
            />
            <p className="text-xs text-gray-500 mt-1">Excel (.xlsx, .xls) or CSV (.csv) files only</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Import Option</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="merge"
                  value="replace"
                  checked={mergeOption === 'replace'}
                  onChange={(e) => setMergeOption(e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Replace existing budget</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="merge"
                  value="merge"
                  checked={mergeOption === 'merge'}
                  onChange={(e) => setMergeOption(e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Merge with existing budget</span>
              </label>
            </div>
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
            onClick={handleImport}
            disabled={!file}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

// 15. Budget Comparison Modal
interface BudgetComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItems: BudgetItem[];
}

export function BudgetComparisonModal({ isOpen, onClose, budgetItems }: BudgetComparisonModalProps) {
  const [compareWith, setCompareWith] = useState('Previous Year');

  if (!isOpen) return null;

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);

  // Mock comparison data
  const previousTotal = totalEstimated * 0.92;
  const difference = totalEstimated - previousTotal;
  const percentChange = (difference / previousTotal) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Budget Comparison</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare With</label>
            <select
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Previous Year</option>
              <option>Previous Quarter</option>
              <option>Baseline Budget</option>
              <option>Similar Projects</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-1">Current Budget</p>
              <p className="text-2xl font-bold text-blue-900">₹{totalEstimated.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">{compareWith}</p>
              <p className="text-2xl font-bold text-gray-900">₹{previousTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className={`${difference >= 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
              <p className={`text-sm ${difference >= 0 ? 'text-red-600' : 'text-green-600'} mb-1`}>Difference</p>
              <p className={`text-2xl font-bold ${difference >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                {difference >= 0 ? '+' : ''}₹{Math.abs(difference).toLocaleString('en-IN')}
              </p>
              <p className={`text-xs ${difference >= 0 ? 'text-red-600' : 'text-green-600'} mt-1`}>
                {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{compareWith}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {['Equipment', 'Civil Work', 'Labor', 'Testing & QC', 'Commissioning'].map((category, index) => {
                  const categoryItems = budgetItems.filter(item => item.category === category);
                  const current = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
                  const previous = current * (0.9 + Math.random() * 0.2);
                  const change = ((current - previous) / previous) * 100;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{current.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{Math.round(previous).toLocaleString('en-IN')}</td>
                      <td className={`px-4 py-3 text-sm font-medium text-right ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
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
