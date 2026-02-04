'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Percent,
  AlertCircle,
  CheckCircle,
  XCircle,
  Target,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Package,
  Users,
  Calendar,
  Filter,
  Download,
  Eye,
  Settings,
  Zap,
  Shield,
  Bell,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
} from 'lucide-react';

export type MarginStatus = 'healthy' | 'warning' | 'critical' | 'excellent';
export type GuardrailType = 'min_margin' | 'max_discount' | 'floor_price' | 'target_margin';

export interface MarginGuardrail {
  id: string;
  name: string;
  type: GuardrailType;
  threshold: number;
  enabled: boolean;
  action: 'warn' | 'block' | 'require_approval';
  notifyRoles: string[];
  description?: string;
}

export interface ProductMargin {
  id: string;
  productId: string;
  productName: string;
  category: string;
  basePrice: number;
  cost: number;
  sellingPrice: number;
  discountPercent: number;
  discountAmount: number;
  marginAmount: number;
  marginPercent: number;
  status: MarginStatus;
  quantity: number;
  totalRevenue: number;
  totalCost: number;
  totalMargin: number;
  violatedGuardrails?: MarginGuardrail[];
  recommendedPrice?: number;
  recommendedMargin?: number;
}

export interface QuoteMarginAnalysis {
  id: string;
  quoteId: string;
  quoteName: string;
  customer: string;
  totalRevenue: number;
  totalCost: number;
  totalMargin: number;
  marginPercent: number;
  status: MarginStatus;
  products: ProductMargin[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export interface MarginAnalysisProps {
  quotes: QuoteMarginAnalysis[];
  guardrails: MarginGuardrail[];
  onEditGuardrail?: (guardrailId: string) => void;
  onToggleGuardrail?: (guardrailId: string) => void;
  onCreateGuardrail?: () => void;
  onViewQuote?: (quoteId: string) => void;
  onOptimizeMargin?: (quoteId: string) => void;
  onExportAnalysis?: () => void;
  targetMargin?: number;
  className?: string;
}

export const MarginAnalysis: React.FC<MarginAnalysisProps> = ({
  quotes,
  guardrails,
  onEditGuardrail,
  onToggleGuardrail,
  onCreateGuardrail,
  onViewQuote,
  onOptimizeMargin,
  onExportAnalysis,
  targetMargin = 30,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'guardrails'>('analysis');
  const [filter, setFilter] = useState<string>('all');
  const [expandedQuotes, setExpandedQuotes] = useState<Set<string>>(new Set());

  const getMarginStatusConfig = (status: MarginStatus) => {
    switch (status) {
      case 'excellent':
        return { icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Excellent' };
      case 'healthy':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Healthy' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Warning' };
      case 'critical':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' };
    }
  };

  const getGuardrailTypeConfig = (type: GuardrailType) => {
    switch (type) {
      case 'min_margin':
        return { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Minimum Margin' };
      case 'max_discount':
        return { icon: Percent, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Maximum Discount' };
      case 'floor_price':
        return { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', label: 'Floor Price' };
      case 'target_margin':
        return { icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Target Margin' };
    }
  };

  const getMarginTrend = (marginPercent: number, targetMargin: number) => {
    if (marginPercent > targetMargin + 10) return { icon: TrendingUp, color: 'text-purple-600', label: 'Excellent' };
    if (marginPercent >= targetMargin) return { icon: TrendingUp, color: 'text-green-600', label: 'Above Target' };
    if (marginPercent >= targetMargin - 5) return { icon: Minus, color: 'text-yellow-600', label: 'Near Target' };
    return { icon: TrendingDown, color: 'text-red-600', label: 'Below Target' };
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (filter === 'all') return true;
    return quote.status === filter;
  });

  const stats = {
    totalQuotes: quotes.length,
    avgMargin: quotes.length > 0 ? quotes.reduce((sum, q) => sum + q.marginPercent, 0) / quotes.length : 0,
    totalRevenue: quotes.reduce((sum, q) => sum + q.totalRevenue, 0),
    totalMargin: quotes.reduce((sum, q) => sum + q.totalMargin, 0),
    healthyQuotes: quotes.filter((q) => q.status === 'healthy' || q.status === 'excellent').length,
    criticalQuotes: quotes.filter((q) => q.status === 'critical').length,
  };

  const toggleExpanded = (quoteId: string) => {
    setExpandedQuotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(quoteId)) {
        newSet.delete(quoteId);
      } else {
        newSet.add(quoteId);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stats Dashboard */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Quotes</p>
          <p className="text-3xl font-bold">{stats.totalQuotes}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Avg Margin</p>
          <p className="text-3xl font-bold">{stats.avgMargin.toFixed(1)}%</p>
          <div className="flex items-center mt-1">
            {stats.avgMargin >= targetMargin ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-xs">Target: {targetMargin}%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Total Margin</p>
          <p className="text-3xl font-bold">${(stats.totalMargin / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
          <p className="text-sm opacity-90">Healthy/Critical</p>
          <p className="text-3xl font-bold">
            {stats.healthyQuotes}/{stats.criticalQuotes}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-3 py-2 font-semibold transition-colors ${
              activeTab === 'analysis'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Margin Analysis ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`flex-1 px-3 py-2 font-semibold transition-colors ${
              activeTab === 'guardrails'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Margin Guardrails ({guardrails.length})
          </button>
        </div>

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {['all', 'excellent', 'healthy', 'warning', 'critical'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {onExportAnalysis && (
                <button
                  onClick={onExportAnalysis}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Analysis</span>
                </button>
              )}
            </div>

            {/* Quotes List */}
            <div className="space-y-2">
              {filteredQuotes.map((quote) => {
                const statusConfig = getMarginStatusConfig(quote.status);
                const trend = getMarginTrend(quote.marginPercent, targetMargin);
                const StatusIcon = statusConfig.icon;
                const TrendIcon = trend.icon;
                const isExpanded = expandedQuotes.has(quote.id);

                return (
                  <div
                    key={quote.id}
                    className="bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Status Icon */}
                          <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                          </div>

                          {/* Quote Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{quote.quoteName}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                              >
                                {statusConfig.label}
                              </span>
                              <div className={`flex items-center space-x-1 ${trend.color}`}>
                                <TrendIcon className="h-4 w-4" />
                                <span className="text-xs font-semibold">{trend.label}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{quote.customer}</p>

                            {/* Margin Metrics */}
                            <div className="grid grid-cols-4 gap-2 mb-3">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-600 mb-1">Revenue</p>
                                <p className="text-lg font-bold text-blue-900">${quote.totalRevenue.toLocaleString()}</p>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-xs text-orange-600 mb-1">Cost</p>
                                <p className="text-lg font-bold text-orange-900">${quote.totalCost.toLocaleString()}</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-xs text-green-600 mb-1">Margin</p>
                                <p className="text-lg font-bold text-green-900">${quote.totalMargin.toLocaleString()}</p>
                              </div>
                              <div className={`rounded-lg p-3 ${statusConfig.bg}`}>
                                <p className={`text-xs ${statusConfig.color} mb-1`}>Margin %</p>
                                <p className={`text-lg font-bold ${statusConfig.color}`}>{quote.marginPercent.toFixed(1)}%</p>
                              </div>
                            </div>

                            {/* Violated Guardrails Warning */}
                            {quote.products.some((p) => p.violatedGuardrails && p.violatedGuardrails.length > 0) && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                                <div className="flex items-center text-red-700 text-sm">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  <span className="font-semibold">
                                    {
                                      quote.products.filter((p) => p.violatedGuardrails && p.violatedGuardrails.length > 0)
                                        .length
                                    }{' '}
                                    products violating guardrails
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center text-xs text-gray-600 space-x-4">
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {quote.createdBy}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Package className="h-3 w-3 mr-1" />
                                {quote.products.length} products
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {onOptimizeMargin && (
                            <button
                              onClick={() => onOptimizeMargin(quote.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Optimize Margin"
                            >
                              <Zap className="h-4 w-4" />
                            </button>
                          )}
                          {onViewQuote && (
                            <button
                              onClick={() => onViewQuote(quote.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Quote"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpanded(quote.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Product Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-3 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Product-Level Margin Analysis</h4>
                        <div className="space-y-2">
                          {quote.products.map((product) => {
                            const productStatus = getMarginStatusConfig(product.status);

                            return (
                              <div
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg p-3"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h5 className="text-sm font-bold text-gray-900">{product.productName}</h5>
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {product.category}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${productStatus.bg} ${productStatus.color}`}
                                      >
                                        {product.marginPercent.toFixed(1)}% margin
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-3 text-xs">
                                      <div>
                                        <p className="text-gray-500">Base Price</p>
                                        <p className="font-semibold text-gray-900">${product.basePrice.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Discount</p>
                                        <p className="font-semibold text-orange-600">
                                          {product.discountPercent.toFixed(1)}%
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Selling Price</p>
                                        <p className="font-semibold text-blue-600">${product.sellingPrice.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Cost</p>
                                        <p className="font-semibold text-gray-900">${product.cost.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Margin</p>
                                        <p className={`font-semibold ${productStatus.color}`}>
                                          ${product.marginAmount.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Guardrail Violations */}
                                    {product.violatedGuardrails && product.violatedGuardrails.length > 0 && (
                                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                        <p className="text-xs font-semibold text-red-800 mb-1">Guardrail Violations:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {product.violatedGuardrails.map((guardrail) => (
                                            <span
                                              key={guardrail.id}
                                              className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs font-semibold"
                                            >
                                              {guardrail.name}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Recommendation */}
                                    {product.recommendedPrice && (
                                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded flex items-start space-x-2">
                                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <div className="text-xs">
                                          <p className="font-semibold text-blue-900">Recommendation:</p>
                                          <p className="text-blue-800">
                                            Price at ${product.recommendedPrice.toFixed(2)} for{' '}
                                            {product.recommendedMargin?.toFixed(1)}% margin
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No quotes found matching your filter</p>
              </div>
            )}
          </div>
        )}

        {/* Guardrails Tab */}
        {activeTab === 'guardrails' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">Margin Protection Rules</h3>
              {onCreateGuardrail && (
                <button
                  onClick={onCreateGuardrail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>New Guardrail</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {guardrails.map((guardrail) => {
                const typeConfig = getGuardrailTypeConfig(guardrail.type);
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={guardrail.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg ${typeConfig.bg}`}>
                          <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{guardrail.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
                              {typeConfig.label}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                guardrail.enabled
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {guardrail.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                guardrail.action === 'block'
                                  ? 'bg-red-100 text-red-700'
                                  : guardrail.action === 'require_approval'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {guardrail.action === 'block' ? 'Blocks Deal' : guardrail.action === 'require_approval' ? 'Requires Approval' : 'Warning Only'}
                            </span>
                          </div>

                          {guardrail.description && (
                            <p className="text-sm text-gray-600 mb-2">{guardrail.description}</p>
                          )}

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">
                                Threshold:{' '}
                                <span className="font-semibold">
                                  {guardrail.threshold}
                                  {guardrail.type.includes('percent') ? '%' : ''}
                                </span>
                              </span>
                            </div>
                            {guardrail.notifyRoles.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Bell className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">
                                  Notifies: <span className="font-semibold">{guardrail.notifyRoles.join(', ')}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {onToggleGuardrail && (
                          <button
                            onClick={() => onToggleGuardrail(guardrail.id)}
                            className={`p-2 rounded transition-colors ${
                              guardrail.enabled
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={guardrail.enabled ? 'Disable' : 'Enable'}
                          >
                            {guardrail.enabled ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                        )}
                        {onEditGuardrail && (
                          <button
                            onClick={() => onEditGuardrail(guardrail.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {guardrails.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No margin guardrails configured</p>
                {onCreateGuardrail && (
                  <button
                    onClick={onCreateGuardrail}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Guardrail
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
