'use client';

import React, { useState } from 'react';
import { X, Plus, Shield, Target, DollarSign, Percent, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Award, Zap, Lightbulb, Save } from 'lucide-react';
import { QuoteMarginAnalysis, MarginGuardrail, GuardrailType, ProductMargin } from './MarginAnalysis';

// Create/Edit Guardrail Modal
interface GuardrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  guardrail?: MarginGuardrail | null;
}

export const GuardrailModal: React.FC<GuardrailModalProps> = ({ isOpen, onClose, onSave, guardrail }) => {
  const [formData, setFormData] = useState({
    name: guardrail?.name || '',
    type: guardrail?.type || 'min_margin' as GuardrailType,
    threshold: guardrail?.threshold || 20,
    enabled: guardrail?.enabled ?? true,
    action: guardrail?.action || 'warn' as 'warn' | 'block' | 'require_approval',
    notifyRoles: guardrail?.notifyRoles || ['sales_manager'],
    description: guardrail?.description || '',
  });

  const [notifyRoleInput, setNotifyRoleInput] = useState('');

  const handleAddNotifyRole = () => {
    if (notifyRoleInput.trim() && !formData.notifyRoles.includes(notifyRoleInput.trim())) {
      setFormData({
        ...formData,
        notifyRoles: [...formData.notifyRoles, notifyRoleInput.trim()],
      });
      setNotifyRoleInput('');
    }
  };

  const handleRemoveNotifyRole = (role: string) => {
    setFormData({
      ...formData,
      notifyRoles: formData.notifyRoles.filter(r => r !== role),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: guardrail?.id || `grd-${Date.now()}`,
      ...formData,
    });
    onClose();
  };

  if (!isOpen) return null;

  const typeLabels: Record<GuardrailType, string> = {
    min_margin: 'Minimum Margin',
    max_discount: 'Maximum Discount',
    floor_price: 'Floor Price',
    target_margin: 'Target Margin',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">{guardrail ? 'Edit' : 'Create'} Margin Guardrail</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardrail Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enterprise Minimum Margin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Brief description of this guardrail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as GuardrailType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold * {formData.type.includes('margin') || formData.type.includes('discount') ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action When Violated *</label>
            <select
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="warn">Warning Only</option>
              <option value="require_approval">Require Approval</option>
              <option value="block">Block Deal</option>
            </select>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="font-semibold text-blue-900">Warning Only</p>
                <p className="text-blue-700">Shows alert, allows override</p>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <p className="font-semibold text-yellow-900">Require Approval</p>
                <p className="text-yellow-700">Needs manager approval</p>
              </div>
              <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                <p className="font-semibold text-red-900">Block Deal</p>
                <p className="text-red-700">Prevents deal from proceeding</p>
              </div>
            </div>
          </div>

          {/* Notify Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notify Roles</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={notifyRoleInput}
                onChange={(e) => setNotifyRoleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNotifyRole())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sales_manager, director, etc."
              />
              <button
                type="button"
                onClick={handleAddNotifyRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.notifyRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNotifyRole(role)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Enable/Disable */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700 cursor-pointer">
              Enable this guardrail immediately
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{guardrail ? 'Update' : 'Create'} Guardrail</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Quote Detail Modal
interface ViewQuoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteMarginAnalysis | null;
  targetMargin: number;
}

export const ViewQuoteDetailModal: React.FC<ViewQuoteDetailModalProps> = ({ isOpen, onClose, quote, targetMargin }) => {
  if (!isOpen || !quote) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-purple-100 text-purple-800';
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const marginVsTarget = quote.marginPercent - targetMargin;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{quote.quoteName}</h2>
            <p className="text-sm opacity-90">{quote.customer}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
              <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">${quote.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
              <p className="text-sm text-orange-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-orange-900">${quote.totalCost.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
              <p className="text-sm text-green-600 mb-1">Total Margin</p>
              <p className="text-2xl font-bold text-green-900">${quote.totalMargin.toLocaleString()}</p>
            </div>
            <div className={`rounded-lg p-3 border-l-4 ${getStatusColor(quote.status)} border-l-${quote.status === 'excellent' ? 'purple' : quote.status === 'healthy' ? 'green' : quote.status === 'warning' ? 'yellow' : 'red'}-500`}>
              <p className="text-sm mb-1">Margin %</p>
              <p className="text-2xl font-bold">{quote.marginPercent.toFixed(1)}%</p>
              <div className="flex items-center mt-1 text-xs">
                {marginVsTarget >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{marginVsTarget.toFixed(1)}% vs target</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>{marginVsTarget.toFixed(1)}% vs target</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Margin Status */}
          <div className={`rounded-lg p-3 ${getStatusColor(quote.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {quote.status === 'excellent' && <Award className="h-5 w-5" />}
                {quote.status === 'healthy' && <CheckCircle className="h-5 w-5" />}
                {quote.status === 'warning' && <AlertCircle className="h-5 w-5" />}
                {quote.status === 'critical' && <AlertCircle className="h-5 w-5" />}
                <span className="font-semibold">
                  {quote.status === 'excellent' && 'Excellent - Well above target margin'}
                  {quote.status === 'healthy' && 'Healthy - Meeting or exceeding target margin'}
                  {quote.status === 'warning' && 'Warning - Below target margin'}
                  {quote.status === 'critical' && 'Critical - Significantly below target margin'}
                </span>
              </div>
              <span className="text-sm">Target: {targetMargin}%</span>
            </div>
          </div>

          {/* Product Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product-Level Margin Analysis ({quote.products.length} items)</h3>
            <div className="space-y-3">
              {quote.products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{product.productName}</h4>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">{product.category}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(product.status)}`}>
                          {product.marginPercent.toFixed(1)}% margin
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                      <p className="text-lg font-bold text-blue-600">${product.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Base Price</p>
                      <p className="font-semibold">${product.basePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Discount</p>
                      <p className="font-semibold text-orange-600">{product.discountPercent.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">${product.discountAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Selling Price</p>
                      <p className="font-semibold text-blue-600">${product.sellingPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Cost</p>
                      <p className="font-semibold">${product.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Margin</p>
                      <p className="font-semibold text-green-600">${product.marginAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Total Margin</p>
                      <p className="font-semibold text-green-700">${product.totalMargin.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Guardrail Violations */}
                  {product.violatedGuardrails && product.violatedGuardrails.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-red-900 mb-1">Guardrail Violations:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.violatedGuardrails.map((guardrail) => (
                              <span key={guardrail.id} className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs font-semibold">
                                {guardrail.name} ({guardrail.action})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {product.recommendedPrice && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-blue-900 mb-1">Optimization Recommendation:</p>
                        <p className="text-blue-800">
                          Adjust selling price to <span className="font-semibold">${product.recommendedPrice.toFixed(2)}</span> to achieve{' '}
                          <span className="font-semibold">{product.recommendedMargin?.toFixed(1)}% margin</span>
                          {' '}(+${((product.recommendedPrice || 0) * product.quantity - product.totalRevenue).toFixed(0)} revenue)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optimize Margin Modal
interface OptimizeMarginModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteMarginAnalysis | null;
  targetMargin: number;
  onApplyOptimization: (quoteId: string, optimizations: any[]) => void;
}

export const OptimizeMarginModal: React.FC<OptimizeMarginModalProps> = ({
  isOpen,
  onClose,
  quote,
  targetMargin,
  onApplyOptimization,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  if (!isOpen || !quote) return null;

  // Calculate optimizations
  const optimizations = quote.products.map(product => {
    const currentMargin = product.marginPercent;
    const targetPrice = product.cost / (1 - targetMargin / 100);
    const priceAdjustment = targetPrice - product.sellingPrice;
    const newMargin = ((targetPrice - product.cost) / targetPrice) * 100;
    const revenueImpact = priceAdjustment * product.quantity;

    return {
      productId: product.id,
      productName: product.productName,
      currentPrice: product.sellingPrice,
      currentMargin: currentMargin,
      recommendedPrice: targetPrice,
      recommendedMargin: newMargin,
      priceAdjustment: priceAdjustment,
      revenueImpact: revenueImpact,
      needsOptimization: currentMargin < targetMargin,
    };
  });

  const toggleProduct = (productId: string) => {
    const newSet = new Set(selectedProducts);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setSelectedProducts(newSet);
  };

  const selectAll = () => {
    setSelectedProducts(new Set(optimizations.filter(o => o.needsOptimization).map(o => o.productId)));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const selectedOptimizations = optimizations.filter(o => selectedProducts.has(o.productId));
  const totalRevenueImpact = selectedOptimizations.reduce((sum, o) => sum + o.revenueImpact, 0);
  const newTotalRevenue = quote.totalRevenue + totalRevenueImpact;
  const newTotalMargin = quote.totalMargin + totalRevenueImpact;
  const newMarginPercent = (newTotalMargin / newTotalRevenue) * 100;

  const handleApply = () => {
    onApplyOptimization(quote.id, selectedOptimizations);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Margin Optimization</h2>
              <p className="text-sm opacity-90">{quote.quoteName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Current vs Optimized */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue:</span>
                  <span className="font-semibold">${quote.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Margin:</span>
                  <span className="font-semibold text-green-600">${quote.totalMargin.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Margin %:</span>
                  <span className="text-lg font-bold">{quote.marginPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border-2 border-purple-300">
              <h3 className="text-sm font-semibold text-purple-900 mb-3">After Optimization</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Total Revenue:</span>
                  <span className="font-semibold text-purple-900">
                    ${newTotalRevenue.toLocaleString()}
                    {totalRevenueImpact > 0 && (
                      <span className="text-xs text-green-600 ml-1">(+${totalRevenueImpact.toFixed(0)})</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Total Margin:</span>
                  <span className="font-semibold text-green-600">
                    ${newTotalMargin.toLocaleString()}
                    {totalRevenueImpact > 0 && (
                      <span className="text-xs ml-1">(+${totalRevenueImpact.toFixed(0)})</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-purple-200 pt-2">
                  <span className="text-sm text-purple-700">Margin %:</span>
                  <span className="text-lg font-bold text-purple-900">{newMarginPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Target Margin: {targetMargin}%</span> - Prices below are calculated to achieve this target margin
            </p>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Select Products to Optimize ({selectedProducts.size} selected)</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Select All Below Target
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Product Optimizations */}
          <div className="space-y-2">
            {optimizations.map((opt) => (
              <div
                key={opt.productId}
                className={`border-2 rounded-lg p-3 transition-all ${
                  selectedProducts.has(opt.productId)
                    ? 'border-purple-500 bg-purple-50'
                    : opt.needsOptimization
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(opt.productId)}
                      onChange={() => toggleProduct(opt.productId)}
                      disabled={!opt.needsOptimization}
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{opt.productName}</h4>
                        {opt.needsOptimization ? (
                          <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold">
                            Below Target
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-semibold">
                            At Target
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Current</p>
                          <p className="font-semibold">${opt.currentPrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-600">{opt.currentMargin.toFixed(1)}% margin</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Recommended</p>
                          <p className="font-semibold text-purple-600">${opt.recommendedPrice.toFixed(2)}</p>
                          <p className="text-xs text-purple-600">{opt.recommendedMargin.toFixed(1)}% margin</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Impact</p>
                          <p className={`font-semibold ${opt.priceAdjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {opt.priceAdjustment > 0 ? '+' : ''}${opt.priceAdjustment.toFixed(2)}/unit
                          </p>
                          <p className={`text-xs ${opt.revenueImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {opt.revenueImpact > 0 ? '+' : ''}${opt.revenueImpact.toFixed(0)} revenue
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {selectedProducts.size} products selected • Total revenue impact:
              <span className={`font-semibold ml-1 ${totalRevenueImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalRevenueImpact > 0 ? '+' : ''}${totalRevenueImpact.toFixed(0)}
              </span>
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={selectedProducts.size === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" />
                <span>Apply Optimization</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
