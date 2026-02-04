'use client';

import React, { useState } from 'react';
import {
  Building2,
  Star,
  DollarSign,
  Clock,
  Shield,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Filter,
  Download,
  ArrowUpDown,
} from 'lucide-react';

// Types
export interface VendorMetrics {
  price: number;
  priceUnit: string;
  leadTime: number; // days
  leadTimeUnit: string;
  qualityScore: number; // 0-100
  deliveryReliability: number; // 0-100
  financialStability: string; // A, B, C, D
  certifications: string[];
  paymentTerms: string;
  minimumOrder: number;
  warrantyPeriod: string;
  supportLevel: string;
}

export interface ComparisonVendor {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
  overallScore: number;
  metrics: VendorMetrics;
  strengths: string[];
  weaknesses: string[];
  isPreferred?: boolean;
  lastOrderDate?: string;
  totalSpend?: number;
}

interface VendorComparisonMatrixProps {
  vendors?: ComparisonVendor[];
  onVendorSelect?: (vendorId: string) => void;
  onRequestQuote?: (vendorId: string) => void;
  onViewDetails?: (vendorId: string) => void;
}

// Sample data
const sampleVendors: ComparisonVendor[] = [
  {
    id: 'V001',
    name: 'Precision Components Inc.',
    location: 'Detroit, MI',
    category: 'CNC Machined Parts',
    overallScore: 92,
    isPreferred: true,
    lastOrderDate: '2024-01-15',
    totalSpend: 450000,
    metrics: {
      price: 45.50,
      priceUnit: 'per unit',
      leadTime: 14,
      leadTimeUnit: 'days',
      qualityScore: 98,
      deliveryReliability: 95,
      financialStability: 'A',
      certifications: ['ISO 9001', 'AS9100', 'IATF 16949'],
      paymentTerms: 'Net 45',
      minimumOrder: 100,
      warrantyPeriod: '24 months',
      supportLevel: 'Premium',
    },
    strengths: ['Excellent quality', 'On-time delivery', 'Strong technical support'],
    weaknesses: ['Higher pricing', 'Limited rush capacity'],
  },
  {
    id: 'V002',
    name: 'Global Manufacturing Ltd.',
    location: 'Shanghai, China',
    category: 'CNC Machined Parts',
    overallScore: 78,
    lastOrderDate: '2023-12-20',
    totalSpend: 280000,
    metrics: {
      price: 32.00,
      priceUnit: 'per unit',
      leadTime: 28,
      leadTimeUnit: 'days',
      qualityScore: 85,
      deliveryReliability: 75,
      financialStability: 'B',
      certifications: ['ISO 9001', 'ISO 14001'],
      paymentTerms: 'Net 30',
      minimumOrder: 500,
      warrantyPeriod: '12 months',
      supportLevel: 'Standard',
    },
    strengths: ['Competitive pricing', 'Large capacity', 'Flexible MOQ'],
    weaknesses: ['Longer lead times', 'Communication delays', 'Quality variability'],
  },
  {
    id: 'V003',
    name: 'TechParts Solutions',
    location: 'Guadalajara, Mexico',
    category: 'CNC Machined Parts',
    overallScore: 85,
    lastOrderDate: '2024-01-10',
    totalSpend: 320000,
    metrics: {
      price: 38.75,
      priceUnit: 'per unit',
      leadTime: 10,
      leadTimeUnit: 'days',
      qualityScore: 90,
      deliveryReliability: 88,
      financialStability: 'B+',
      certifications: ['ISO 9001', 'IATF 16949'],
      paymentTerms: 'Net 30',
      minimumOrder: 200,
      warrantyPeriod: '18 months',
      supportLevel: 'Premium',
    },
    strengths: ['Fast delivery', 'Good quality', 'Nearshoring benefits'],
    weaknesses: ['Limited certifications', 'Medium capacity'],
  },
  {
    id: 'V004',
    name: 'European Precision GmbH',
    location: 'Stuttgart, Germany',
    category: 'CNC Machined Parts',
    overallScore: 88,
    lastOrderDate: '2023-11-28',
    totalSpend: 180000,
    metrics: {
      price: 52.00,
      priceUnit: 'per unit',
      leadTime: 21,
      leadTimeUnit: 'days',
      qualityScore: 96,
      deliveryReliability: 92,
      financialStability: 'A',
      certifications: ['ISO 9001', 'AS9100', 'ISO 14001', 'IATF 16949'],
      paymentTerms: 'Net 60',
      minimumOrder: 50,
      warrantyPeriod: '36 months',
      supportLevel: 'Premium',
    },
    strengths: ['Highest quality', 'Extensive certifications', 'Low MOQ'],
    weaknesses: ['Premium pricing', 'Longer lead times'],
  },
];

const comparisonCriteria = [
  { key: 'price', label: 'Unit Price', icon: DollarSign, format: 'currency', lowerIsBetter: true },
  { key: 'leadTime', label: 'Lead Time', icon: Clock, format: 'days', lowerIsBetter: true },
  { key: 'qualityScore', label: 'Quality Score', icon: Award, format: 'percent', lowerIsBetter: false },
  { key: 'deliveryReliability', label: 'Delivery Reliability', icon: TrendingUp, format: 'percent', lowerIsBetter: false },
  { key: 'financialStability', label: 'Financial Rating', icon: Shield, format: 'rating', lowerIsBetter: false },
  { key: 'minimumOrder', label: 'Minimum Order', icon: Building2, format: 'number', lowerIsBetter: true },
];

export function VendorComparisonMatrix({
  vendors = sampleVendors,
  onVendorSelect,
  onRequestQuote,
  onViewDetails,
}: VendorComparisonMatrixProps) {
  const [selectedVendors, setSelectedVendors] = useState<string[]>(vendors.map(v => v.id));
  const [expandedSections, setExpandedSections] = useState<string[]>(['metrics', 'certifications']);
  const [sortBy, setSortBy] = useState<string>('overallScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [highlightBest, setHighlightBest] = useState(true);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const filteredVendors = vendors.filter(v => selectedVendors.includes(v.id));

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    if (sortBy === 'overallScore') {
      aVal = a.overallScore;
      bVal = b.overallScore;
    } else if (sortBy === 'price') {
      aVal = a.metrics.price;
      bVal = b.metrics.price;
    } else if (sortBy === 'leadTime') {
      aVal = a.metrics.leadTime;
      bVal = b.metrics.leadTime;
    } else if (sortBy === 'qualityScore') {
      aVal = a.metrics.qualityScore;
      bVal = b.metrics.qualityScore;
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const getBestValue = (key: string, lowerIsBetter: boolean): number | string => {
    const values = filteredVendors.map(v => {
      if (key === 'financialStability') return v.metrics.financialStability;
      return (v.metrics as unknown as Record<string, number>)[key];
    });

    if (key === 'financialStability') {
      const ratings = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'];
      return values.reduce((best, curr) =>
        ratings.indexOf(curr as string) < ratings.indexOf(best as string) ? curr : best
      , 'D');
    }

    const numValues = values as number[];
    return lowerIsBetter ? Math.min(...numValues) : Math.max(...numValues);
  };

  const isBestValue = (value: number | string, key: string, lowerIsBetter: boolean): boolean => {
    const best = getBestValue(key, lowerIsBetter);
    return value === best;
  };

  const getComparisonIndicator = (vendorValue: number, key: string, lowerIsBetter: boolean) => {
    const values = filteredVendors.map(v => (v.metrics as unknown as Record<string, number>)[key]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const diff = ((vendorValue - avg) / avg) * 100;

    if (Math.abs(diff) < 5) {
      return { icon: Minus, color: 'text-gray-400', label: 'Average' };
    }

    const isBetter = lowerIsBetter ? vendorValue < avg : vendorValue > avg;
    return isBetter
      ? { icon: TrendingUp, color: 'text-green-500', label: `${Math.abs(diff).toFixed(0)}% better` }
      : { icon: TrendingDown, color: 'text-red-500', label: `${Math.abs(diff).toFixed(0)}% worse` };
  };

  const formatValue = (value: number | string, format: string): string => {
    switch (format) {
      case 'currency':
        return `$${(value as number).toFixed(2)}`;
      case 'days':
        return `${value} days`;
      case 'percent':
        return `${value}%`;
      case 'number':
        return value.toLocaleString();
      case 'rating':
        return value as string;
      default:
        return String(value);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Comparison Matrix
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Compare {filteredVendors.length} vendors side-by-side
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={highlightBest}
                onChange={(e) => setHighlightBest(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-600 dark:text-gray-400">Highlight best values</span>
            </label>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="mt-4 flex flex-wrap gap-2">
          {vendors.map(vendor => (
            <button
              key={vendor.id}
              onClick={() => toggleVendor(vendor.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedVendors.includes(vendor.id)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {selectedVendors.includes(vendor.id) ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {vendor.name}
              {vendor.isPreferred && (
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Vendor Headers */}
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-48">
                <button
                  onClick={() => {
                    if (sortBy === 'overallScore') {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('overallScore');
                      setSortOrder('desc');
                    }
                  }}
                  className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Criteria
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              {sortedVendors.map(vendor => (
                <th key={vendor.id} className="px-4 py-4 text-center min-w-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {vendor.name}
                      </span>
                      {vendor.isPreferred && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {vendor.location}
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(vendor.overallScore)}`}>
                      Score: {vendor.overallScore}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Key Metrics Section */}
            <tr>
              <td colSpan={sortedVendors.length + 1} className="px-3 py-2 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => toggleSection('metrics')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {expandedSections.includes('metrics') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Key Metrics
                </button>
              </td>
            </tr>

            {expandedSections.includes('metrics') && comparisonCriteria.map(criteria => {
              const Icon = criteria.icon;
              return (
                <tr key={criteria.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {criteria.label}
                      </span>
                    </div>
                  </td>
                  {sortedVendors.map(vendor => {
                    const value = (vendor.metrics as unknown as Record<string, number | string>)[criteria.key];
                    const isBest = highlightBest && isBestValue(value, criteria.key, criteria.lowerIsBetter);
                    const comparison = criteria.format !== 'rating'
                      ? getComparisonIndicator(value as number, criteria.key, criteria.lowerIsBetter)
                      : null;
                    const CompIcon = comparison?.icon;

                    return (
                      <td
                        key={vendor.id}
                        className={`px-4 py-3 text-center ${
                          isBest ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-medium ${
                            isBest ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {formatValue(value, criteria.format)}
                            {isBest && <Check className="inline h-4 w-4 ml-1" />}
                          </span>
                          {comparison && CompIcon && (
                            <span className={`text-xs flex items-center gap-1 ${comparison.color}`}>
                              <CompIcon className="h-3 w-3" />
                              {comparison.label}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Certifications Section */}
            <tr>
              <td colSpan={sortedVendors.length + 1} className="px-3 py-2 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => toggleSection('certifications')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {expandedSections.includes('certifications') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Certifications & Compliance
                </button>
              </td>
            </tr>

            {expandedSections.includes('certifications') && (
              <>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Certifications
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3">
                      <div className="flex flex-wrap justify-center gap-1">
                        {vendor.metrics.certifications.map(cert => (
                          <span
                            key={cert}
                            className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Terms
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {vendor.metrics.paymentTerms}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Warranty Period
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {vendor.metrics.warrantyPeriod}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Support Level
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        vendor.metrics.supportLevel === 'Premium'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {vendor.metrics.supportLevel}
                      </span>
                    </td>
                  ))}
                </tr>
              </>
            )}

            {/* Strengths & Weaknesses Section */}
            <tr>
              <td colSpan={sortedVendors.length + 1} className="px-3 py-2 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => toggleSection('analysis')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {expandedSections.includes('analysis') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Strengths & Weaknesses
                </button>
              </td>
            </tr>

            {expandedSections.includes('analysis') && (
              <>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Strengths
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3">
                      <ul className="space-y-1">
                        {vendor.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Weaknesses
                    </span>
                  </td>
                  {sortedVendors.map(vendor => (
                    <td key={vendor.id} className="px-4 py-3">
                      <ul className="space-y-1">
                        {vendor.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions Footer */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a vendor to proceed with RFQ or view detailed profile
          </p>
          <div className="flex gap-2">
            {sortedVendors.slice(0, 2).map(vendor => (
              <div key={vendor.id} className="flex gap-2">
                <button
                  onClick={() => onViewDetails?.(vendor.id)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  View {vendor.name.split(' ')[0]}
                </button>
                <button
                  onClick={() => onRequestQuote?.(vendor.id)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorComparisonMatrix;
