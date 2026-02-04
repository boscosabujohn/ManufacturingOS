'use client';

import React, { useState } from 'react';
import { X, Calculator, TrendingUp, TrendingDown, AlertTriangle, DollarSign, RefreshCw } from 'lucide-react';

interface ComponentCostChange {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  oldCost: number;
  newCost: number;
  totalOldCost: number;
  totalNewCost: number;
  changePercent: number;
}

interface CostSummary {
  material: number;
  labor: number;
  overhead: number;
  total: number;
}

interface RecalculateCostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecalculate: (options: RecalculateOptions) => void;
  currentCosts: CostSummary;
  componentChanges?: ComponentCostChange[];
}

export interface RecalculateOptions {
  updateSupplierPrices: boolean;
  updateLaborRates: boolean;
  updateOverheadAllocation: boolean;
  createNewVersion: boolean;
}

export const RecalculateCostsModal: React.FC<RecalculateCostsModalProps> = ({
  isOpen,
  onClose,
  onRecalculate,
  currentCosts,
  componentChanges = [],
}) => {
  const [updateSupplierPrices, setUpdateSupplierPrices] = useState(true);
  const [updateLaborRates, setUpdateLaborRates] = useState(false);
  const [updateOverheadAllocation, setUpdateOverheadAllocation] = useState(false);
  const [createNewVersion, setCreateNewVersion] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock preview data - in real app, this would come from API
  const previewChanges: ComponentCostChange[] = componentChanges.length > 0 ? componentChanges : [
    {
      id: 'COMP-001',
      name: 'Stainless Steel Sheet',
      partNumber: 'SS-304-001',
      quantity: 10,
      oldCost: 850,
      newCost: 920,
      totalOldCost: 8500,
      totalNewCost: 9200,
      changePercent: 8.24,
    },
    {
      id: 'COMP-002',
      name: 'Handle Assembly',
      partNumber: 'HDL-ALM-002',
      quantity: 20,
      oldCost: 120,
      newCost: 135,
      totalOldCost: 2400,
      totalNewCost: 2700,
      changePercent: 12.5,
    },
    {
      id: 'COMP-003',
      name: 'Drawer Slide',
      partNumber: 'DRW-SLD-003',
      quantity: 30,
      oldCost: 85,
      newCost: 82,
      totalOldCost: 2550,
      totalNewCost: 2460,
      changePercent: -3.53,
    },
    {
      id: 'COMP-004',
      name: 'Hinges Set',
      partNumber: 'HNG-SET-004',
      quantity: 15,
      oldCost: 45,
      newCost: 48,
      totalOldCost: 675,
      totalNewCost: 720,
      changePercent: 6.67,
    },
  ];

  // Calculate preview totals
  const previewTotalOldCost = previewChanges.reduce((sum, item) => sum + item.totalOldCost, 0);
  const previewTotalNewCost = previewChanges.reduce((sum, item) => sum + item.totalNewCost, 0);
  const previewTotalChange = previewTotalNewCost - previewTotalOldCost;
  const previewChangePercent = ((previewTotalChange / previewTotalOldCost) * 100).toFixed(2);

  // Calculate new costs based on options
  const calculateNewCosts = (): CostSummary => {
    let newMaterial = currentCosts.material;
    let newLabor = currentCosts.labor;
    let newOverhead = currentCosts.overhead;

    if (updateSupplierPrices) {
      newMaterial = previewTotalNewCost;
    }

    if (updateLaborRates) {
      newLabor = currentCosts.labor * 1.05; // 5% increase example
    }

    if (updateOverheadAllocation) {
      newOverhead = (newMaterial + newLabor) * 0.15; // 15% overhead example
    }

    return {
      material: newMaterial,
      labor: newLabor,
      overhead: newOverhead,
      total: newMaterial + newLabor + newOverhead,
    };
  };

  const newCosts = calculateNewCosts();
  const totalCostChange = newCosts.total - currentCosts.total;
  const totalChangePercent = ((totalCostChange / currentCosts.total) * 100).toFixed(2);
  const showWarning = parseFloat(totalChangePercent) > 10;

  const handleRecalculate = () => {
    const options: RecalculateOptions = {
      updateSupplierPrices,
      updateLaborRates,
      updateOverheadAllocation,
      createNewVersion,
    };
    onRecalculate(options);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Recalculate BOM Costs</h2>
              <p className="text-sm opacity-90">Update costs from latest pricing data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Current Cost Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Current Cost Summary
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-1">Material Cost</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(currentCosts.material)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 font-medium mb-1">Labor Cost</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(currentCosts.labor)}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 font-medium mb-1">Overhead</p>
                <p className="text-xl font-bold text-purple-900">{formatCurrency(currentCosts.overhead)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                <p className="text-xs text-orange-600 font-medium mb-1">Total Cost</p>
                <p className="text-xl font-bold text-orange-900">{formatCurrency(currentCosts.total)}</p>
              </div>
            </div>
          </div>

          {/* Recalculation Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recalculation Options</h3>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={updateSupplierPrices}
                  onChange={(e) => setUpdateSupplierPrices(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    Update from latest supplier prices
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Fetch current prices from supplier catalog and contracts</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={updateLaborRates}
                  onChange={(e) => setUpdateLaborRates(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    Update labor rates
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Apply current labor rates from work center definitions</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={updateOverheadAllocation}
                  onChange={(e) => setUpdateOverheadAllocation(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    Update overhead allocation
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Recalculate overhead based on current allocation rates</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={createNewVersion}
                  onChange={(e) => setCreateNewVersion(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    Create new version after recalculation
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Save current version and create new one with updated costs</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Changes Section */}
          {updateSupplierPrices && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  Preview Changes
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  {showPreview ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {/* Components that will be updated */}
              {showPreview && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-2">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Component</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Part Number</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Old Cost</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">New Cost</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total Old</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total New</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Change</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewChanges.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.partNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.oldCost)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.newCost)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalOldCost)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.totalNewCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <div className="flex items-center justify-end gap-1">
                                {item.changePercent > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-green-600" />
                                )}
                                <span className={`font-semibold ${item.changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total Cost Impact */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Total Material Cost Impact</p>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Old Total:</span> {formatCurrency(previewTotalOldCost)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">New Total:</span> {formatCurrency(previewTotalNewCost)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      {previewTotalChange > 0 ? (
                        <TrendingUp className="h-5 w-5 text-red-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      )}
                      <span className={`text-2xl font-bold ${previewTotalChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {previewTotalChange > 0 ? '+' : ''}{formatCurrency(previewTotalChange)}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${previewTotalChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {previewTotalChange > 0 ? '+' : ''}{previewChangePercent}% change
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Total Cost Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Projected New Costs
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className={`p-4 rounded-lg border-2 ${
                updateSupplierPrices
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs font-medium mb-1 ${
                  updateSupplierPrices ? 'text-blue-600' : 'text-gray-500'
                }`}>Material Cost</p>
                <p className={`text-xl font-bold ${
                  updateSupplierPrices ? 'text-blue-900' : 'text-gray-600'
                }`}>{formatCurrency(newCosts.material)}</p>
                {updateSupplierPrices && (
                  <p className="text-xs text-blue-600 mt-1">
                    {((newCosts.material - currentCosts.material) / currentCosts.material * 100).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                updateLaborRates
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs font-medium mb-1 ${
                  updateLaborRates ? 'text-green-600' : 'text-gray-500'
                }`}>Labor Cost</p>
                <p className={`text-xl font-bold ${
                  updateLaborRates ? 'text-green-900' : 'text-gray-600'
                }`}>{formatCurrency(newCosts.labor)}</p>
                {updateLaborRates && (
                  <p className="text-xs text-green-600 mt-1">
                    +{((newCosts.labor - currentCosts.labor) / currentCosts.labor * 100).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                updateOverheadAllocation
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs font-medium mb-1 ${
                  updateOverheadAllocation ? 'text-purple-600' : 'text-gray-500'
                }`}>Overhead</p>
                <p className={`text-xl font-bold ${
                  updateOverheadAllocation ? 'text-purple-900' : 'text-gray-600'
                }`}>{formatCurrency(newCosts.overhead)}</p>
                {updateOverheadAllocation && (
                  <p className="text-xs text-purple-600 mt-1">
                    {((newCosts.overhead - currentCosts.overhead) / currentCosts.overhead * 100).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg border-2 border-orange-400">
                <p className="text-xs text-orange-700 font-medium mb-1">New Total Cost</p>
                <p className="text-xl font-bold text-orange-900">{formatCurrency(newCosts.total)}</p>
                <p className={`text-xs font-semibold mt-1 ${
                  parseFloat(totalChangePercent) > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {parseFloat(totalChangePercent) > 0 ? '+' : ''}{totalChangePercent}% from current
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {showWarning && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900 mb-1">Significant Cost Increase Detected</h4>
                <p className="text-sm text-red-800">
                  The recalculated costs represent an increase of more than 10% ({totalChangePercent}%).
                  This may impact product pricing, margins, and profitability. Please review the changes carefully
                  before proceeding with the recalculation.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRecalculate}
              disabled={!updateSupplierPrices && !updateLaborRates && !updateOverheadAllocation}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md"
            >
              <Calculator className="h-4 w-4" />
              Recalculate Costs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
