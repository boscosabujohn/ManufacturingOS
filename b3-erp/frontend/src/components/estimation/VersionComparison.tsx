'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Calendar,
  User,
  FileText,
  Eye,
  Copy,
  Download,
  RotateCcw,
  AlertCircle,
  Info,
  Percent,
  Package,
} from 'lucide-react';

export type VersionStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'superseded';

export interface EstimateVersion {
  id: string;
  version: string;
  name: string;
  status: VersionStatus;
  totalCost: number;
  suggestedPrice: number;
  margin: number;
  marginPercent: number;
  createdBy: string;
  createdAt: string;
  notes?: string;
  changes?: string[];
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}

export interface VersionDifference {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
  changeType: 'increase' | 'decrease' | 'modified' | 'added' | 'removed';
  changePercent?: number;
}

export interface VersionComparisonProps {
  estimateId: string;
  estimateName: string;
  versions: EstimateVersion[];
  selectedVersion1?: string;
  selectedVersion2?: string;
  onSelectVersion1?: (versionId: string) => void;
  onSelectVersion2?: (versionId: string) => void;
  onViewVersion?: (versionId: string) => void;
  onDuplicateVersion?: (versionId: string) => void;
  onRollbackVersion?: (versionId: string) => void;
  onExportComparison?: () => void;
  className?: string;
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  estimateId,
  estimateName,
  versions,
  selectedVersion1,
  selectedVersion2,
  onSelectVersion1,
  onSelectVersion2,
  onViewVersion,
  onDuplicateVersion,
  onRollbackVersion,
  onExportComparison,
  className = '',
}) => {
  const [comparisonView, setComparisonView] = useState<'timeline' | 'side-by-side'>('timeline');

  const getStatusConfig = (status: VersionStatus) => {
    switch (status) {
      case 'draft':
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Draft' };
      case 'submitted':
        return { icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Submitted' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected' };
      case 'superseded':
        return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Superseded' };
    }
  };

  const calculateDifferences = (v1: EstimateVersion, v2: EstimateVersion): VersionDifference[] => {
    const differences: VersionDifference[] = [];

    // Cost difference
    const costDiff = v2.totalCost - v1.totalCost;
    const costDiffPercent = ((costDiff / v1.totalCost) * 100);
    differences.push({
      field: 'totalCost',
      label: 'Total Cost',
      oldValue: v1.totalCost,
      newValue: v2.totalCost,
      changeType: costDiff > 0 ? 'increase' : costDiff < 0 ? 'decrease' : 'modified',
      changePercent: costDiffPercent,
    });

    // Price difference
    const priceDiff = v2.suggestedPrice - v1.suggestedPrice;
    const priceDiffPercent = ((priceDiff / v1.suggestedPrice) * 100);
    differences.push({
      field: 'suggestedPrice',
      label: 'Suggested Price',
      oldValue: v1.suggestedPrice,
      newValue: v2.suggestedPrice,
      changeType: priceDiff > 0 ? 'increase' : priceDiff < 0 ? 'decrease' : 'modified',
      changePercent: priceDiffPercent,
    });

    // Margin difference
    const marginDiff = v2.marginPercent - v1.marginPercent;
    differences.push({
      field: 'marginPercent',
      label: 'Margin %',
      oldValue: v1.marginPercent,
      newValue: v2.marginPercent,
      changeType: marginDiff > 0 ? 'increase' : marginDiff < 0 ? 'decrease' : 'modified',
      changePercent: marginDiff,
    });

    return differences;
  };

  const version1 = versions.find((v) => v.id === selectedVersion1);
  const version2 = versions.find((v) => v.id === selectedVersion2);
  const differences = version1 && version2 ? calculateDifferences(version1, version2) : [];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Version Comparison</h2>
            <p className="text-sm text-gray-600">
              Estimate: {estimateName} ({estimateId}) • {versions.length} versions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setComparisonView(comparisonView === 'timeline' ? 'side-by-side' : 'timeline')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {comparisonView === 'timeline' ? 'Side-by-Side View' : 'Timeline View'}
            </button>
            {onExportComparison && version1 && version2 && (
              <button
                onClick={onExportComparison}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 mb-1">Total Versions</p>
            <p className="text-2xl font-bold text-blue-900">{versions.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-900">
              {versions.filter((v) => v.status === 'approved').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-yellow-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-900">
              {versions.filter((v) => v.status === 'draft' || v.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-sm text-red-600 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-900">
              {versions.filter((v) => v.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Version Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Select Versions to Compare</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Version 1 Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Version 1 (Base)</label>
            <select
              value={selectedVersion1 || ''}
              onChange={(e) => onSelectVersion1?.(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a version...</option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.version} - {version.name} ({version.status})
                </option>
              ))}
            </select>
          </div>

          {/* Version 2 Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Version 2 (Compare)</label>
            <select
              value={selectedVersion2 || ''}
              onChange={(e) => onSelectVersion2?.(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a version...</option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.version} - {version.name} ({version.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {comparisonView === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Version Timeline</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Version Cards */}
            <div className="space-y-3">
              {versions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((version, index) => {
                  const statusConfig = getStatusConfig(version.status);
                  const StatusIcon = statusConfig.icon;
                  const isSelected = version.id === selectedVersion1 || version.id === selectedVersion2;

                  return (
                    <div key={version.id} className="relative pl-20">
                      {/* Timeline Node */}
                      <div
                        className={`absolute left-4 top-6 w-8 h-8 rounded-full border-4 ${statusConfig.bg} ${statusConfig.border} flex items-center justify-center z-10`}
                      >
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>

                      {/* Version Card */}
                      <div
                        className={`bg-white rounded-lg border-2 ${
                          isSelected ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                        } hover:shadow-lg transition-all p-3`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {version.version} - {version.name}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                              >
                                {statusConfig.label}
                              </span>
                              {isSelected && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                  SELECTED
                                </span>
                              )}
                            </div>

                            {version.notes && <p className="text-sm text-gray-600 mb-3">{version.notes}</p>}

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Total Cost</p>
                                <p className="text-lg font-bold text-gray-900">${version.totalCost.toLocaleString()}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Suggested Price</p>
                                <p className="text-lg font-bold text-blue-600">
                                  ${version.suggestedPrice.toLocaleString()}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Margin</p>
                                <p className="text-lg font-bold text-green-600">{version.marginPercent.toFixed(1)}%</p>
                              </div>
                            </div>

                            {/* Changes */}
                            {version.changes && version.changes.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Changes in this version:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {version.changes.map((change, idx) => (
                                    <li key={idx} className="text-sm text-gray-600">
                                      {change}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center text-xs text-gray-600 space-x-4">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {version.createdBy}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(version.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {/* Approval Info */}
                            {version.approvedBy && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                <strong>Approved by:</strong> {version.approvedBy} on{' '}
                                {version.approvedAt && new Date(version.approvedAt).toLocaleDateString()}
                              </div>
                            )}

                            {/* Rejection Reason */}
                            {version.rejectedReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                <strong>Rejected:</strong> {version.rejectedReason}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {onViewVersion && (
                              <button
                                onClick={() => onViewVersion(version.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            {onDuplicateVersion && (
                              <button
                                onClick={() => onDuplicateVersion(version.id)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            )}
                            {onRollbackVersion && version.status === 'approved' && (
                              <button
                                onClick={() => onRollbackVersion(version.id)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                title="Rollback"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
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

      {/* Side-by-Side Comparison */}
      {comparisonView === 'side-by-side' && version1 && version2 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Side-by-Side Comparison</h3>

          {/* Version Headers */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-sm font-semibold text-gray-700">Field</div>
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Version 1</p>
                <p className="text-lg font-bold text-blue-900">{version1.version}</p>
                <p className="text-xs text-gray-600">{version1.name}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
                <p className="text-sm text-purple-600 mb-1">Version 2</p>
                <p className="text-lg font-bold text-purple-900">{version2.version}</p>
                <p className="text-xs text-gray-600">{version2.name}</p>
              </div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {differences.map((diff, index) => {
              const ChangeIcon =
                diff.changeType === 'increase'
                  ? TrendingUp
                  : diff.changeType === 'decrease'
                  ? TrendingDown
                  : Minus;
              const changeColor =
                diff.changeType === 'increase'
                  ? 'text-red-600'
                  : diff.changeType === 'decrease'
                  ? 'text-green-600'
                  : 'text-gray-600';

              return (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 items-center py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="font-semibold text-gray-900">{diff.label}</div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {diff.field.includes('Percent') || diff.field.includes('margin')
                        ? `${diff.oldValue.toFixed(1)}%`
                        : `$${diff.oldValue.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {diff.field.includes('Percent') || diff.field.includes('margin')
                          ? `${diff.newValue.toFixed(1)}%`
                          : `$${diff.newValue.toLocaleString()}`}
                      </p>
                      {diff.changePercent !== undefined && diff.changePercent !== 0 && (
                        <div className={`flex items-center ${changeColor}`}>
                          <ChangeIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm font-semibold">
                            {Math.abs(diff.changePercent).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Comparison Summary</p>
                <p className="text-sm text-blue-800">
                  Version {version2.version} shows a{' '}
                  {differences[0].changeType === 'increase' ? 'cost increase' : 'cost decrease'} of{' '}
                  {Math.abs(differences[0].changePercent || 0).toFixed(1)}% compared to Version {version1.version}.
                  The margin changed by {Math.abs(differences[2].changePercent || 0).toFixed(1)} percentage points.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No comparison selected */}
      {comparisonView === 'side-by-side' && (!version1 || !version2) && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <GitBranch className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">Select two versions above to compare them side-by-side</p>
        </div>
      )}
    </div>
  );
};
