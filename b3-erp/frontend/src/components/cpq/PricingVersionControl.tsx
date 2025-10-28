'use client';

import React, { useState } from 'react';
import {
  Clock,
  GitBranch,
  Check,
  X,
  Eye,
  Copy,
  RotateCcw,
  Archive,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Calendar,
  Edit,
  Save,
  Tag,
  TrendingUp,
  DollarSign,
  Percent,
  ArrowRight,
  Download,
  Upload,
} from 'lucide-react';

export type VersionStatus = 'draft' | 'active' | 'scheduled' | 'archived' | 'superseded';
export type ChangeType = 'price_increase' | 'price_decrease' | 'new_product' | 'discontinued' | 'restructure';

export interface PriceChange {
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  reason?: string;
}

export interface PricingVersion {
  id: string;
  version: string;
  name: string;
  description?: string;
  status: VersionStatus;
  changeType: ChangeType;
  createdBy: string;
  createdAt: string;
  activatedAt?: string;
  lastModified?: string;
  scheduledFor?: string;
  expiresAt?: string;
  changes: PriceChange[];
  totalItems: number;
  avgPriceChange: number;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface PricingVersionControlProps {
  versions: PricingVersion[];
  currentVersion?: string;
  onCreateVersion?: () => void;
  onActivateVersion?: (versionId: string) => void;
  onArchiveVersion?: (versionId: string) => void;
  onViewVersion?: (versionId: string) => void;
  onCompareVersions?: (versionId1: string, versionId2: string) => void;
  onDuplicateVersion?: (versionId: string) => void;
  onRollbackVersion?: (versionId: string) => void;
  onExportVersion?: (versionId: string) => void;
  className?: string;
}

export const PricingVersionControl: React.FC<PricingVersionControlProps> = ({
  versions,
  currentVersion,
  onCreateVersion,
  onActivateVersion,
  onArchiveVersion,
  onViewVersion,
  onCompareVersions,
  onDuplicateVersion,
  onRollbackVersion,
  onExportVersion,
  className = '',
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const getStatusConfig = (status: VersionStatus) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Active' };
      case 'draft':
        return { icon: Edit, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Draft' };
      case 'scheduled':
        return { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Scheduled' };
      case 'archived':
        return { icon: Archive, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Archived' };
      case 'superseded':
        return { icon: X, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Superseded' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Unknown' };
    }
  };

  const getChangeTypeConfig = (type: ChangeType) => {
    switch (type) {
      case 'price_increase':
        return { icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', label: 'Price Increase' };
      case 'price_decrease':
        return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Price Decrease' };
      case 'new_product':
        return { icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50', label: 'New Products' };
      case 'discontinued':
        return { icon: X, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Discontinued' };
      case 'restructure':
        return { icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Restructure' };
      default:
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', label: 'General' };
    }
  };

  const filteredVersions = versions.filter((version) => {
    if (filter === 'all') return true;
    return version.status === filter;
  });

  const stats = {
    total: versions.length,
    active: versions.filter((v) => v.status === 'active').length,
    draft: versions.filter((v) => v.status === 'draft').length,
    scheduled: versions.filter((v) => v.status === 'scheduled').length,
    archived: versions.filter((v) => v.status === 'archived').length,
  };

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions((prev) =>
      prev.includes(versionId) ? prev.filter((id) => id !== versionId) : [...prev, versionId]
    );
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompareVersions) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Versions</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Active</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Draft</p>
          <p className="text-3xl font-bold">{stats.draft}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Scheduled</p>
          <p className="text-3xl font-bold">{stats.scheduled}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Archived</p>
          <p className="text-3xl font-bold">{stats.archived}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              {['all', 'active', 'draft', 'scheduled', 'archived'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Compare Button */}
            {selectedVersions.length === 2 && onCompareVersions && (
              <button
                onClick={handleCompare}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <GitBranch className="h-4 w-4" />
                <span>Compare Selected</span>
              </button>
            )}
          </div>

          {/* Create Button */}
          {onCreateVersion && (
            <button
              onClick={onCreateVersion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Tag className="h-4 w-4" />
              <span>New Version</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Versions */}
        <div className="space-y-6">
          {filteredVersions.map((version, index) => {
            const statusConfig = getStatusConfig(version.status);
            const changeTypeConfig = getChangeTypeConfig(version.changeType);
            const StatusIcon = statusConfig.icon;
            const ChangeIcon = changeTypeConfig.icon;
            const isCurrentVersion = version.id === currentVersion;

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
                    isCurrentVersion ? 'border-green-400 shadow-lg' : 'border-gray-200 hover:border-blue-400'
                  } hover:shadow-lg transition-all p-6`}
                >
                  {/* Current Version Badge */}
                  {isCurrentVersion && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>CURRENT</span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    {/* Version Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {/* Checkbox for comparison */}
                        {onCompareVersions && (
                          <input
                            type="checkbox"
                            checked={selectedVersions.includes(version.id)}
                            onChange={() => toggleVersionSelection(version.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        )}

                        <h3 className="text-lg font-bold text-gray-900">
                          {version.version} - {version.name}
                        </h3>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${changeTypeConfig.bg} ${changeTypeConfig.color}`}
                        >
                          {changeTypeConfig.label}
                        </span>
                      </div>

                      {version.description && (
                        <p className="text-sm text-gray-600 mb-3">{version.description}</p>
                      )}

                      {/* Version Metadata */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          Created by {version.createdBy}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(version.createdAt).toLocaleString()}
                        </div>
                        {version.scheduledFor && (
                          <div className="flex items-center text-sm text-blue-600">
                            <Clock className="h-4 w-4 mr-2" />
                            Scheduled: {new Date(version.scheduledFor).toLocaleString()}
                          </div>
                        )}
                        {version.activatedAt && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activated: {new Date(version.activatedAt).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Price Changes Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Changes</p>
                            <p className="text-lg font-bold text-gray-900">{version.totalItems}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Avg Price Change</p>
                            <p
                              className={`text-lg font-bold ${
                                version.avgPriceChange > 0
                                  ? 'text-red-600'
                                  : version.avgPriceChange < 0
                                  ? 'text-green-600'
                                  : 'text-gray-900'
                              }`}
                            >
                              {version.avgPriceChange > 0 ? '+' : ''}
                              {version.avgPriceChange.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Sample Changes</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {version.changes.slice(0, 3).map((change, idx) => (
                                <span
                                  key={idx}
                                  className={`px-1.5 py-0.5 rounded text-xs ${
                                    change.changePercent > 0
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {change.changePercent > 0 ? '+' : ''}
                                  {change.changePercent.toFixed(0)}%
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Approval Info */}
                      {version.approvedBy && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approved by {version.approvedBy} on{' '}
                          {version.approvedAt && new Date(version.approvedAt).toLocaleDateString()}
                        </div>
                      )}

                      {version.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                          <strong>Notes:</strong> {version.notes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
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
                      {onExportVersion && (
                        <button
                          onClick={() => onExportVersion(version.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Export"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {onDuplicateVersion && (
                        <button
                          onClick={() => onDuplicateVersion(version.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {onRollbackVersion && version.status === 'archived' && (
                        <button
                          onClick={() => onRollbackVersion(version.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Rollback"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                      {onActivateVersion && version.status === 'draft' && (
                        <button
                          onClick={() => onActivateVersion(version.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Activate"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {onArchiveVersion && version.status === 'active' && (
                        <button
                          onClick={() => onArchiveVersion(version.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
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

      {filteredVersions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No pricing versions found</p>
          {onCreateVersion && (
            <button
              onClick={onCreateVersion}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Version
            </button>
          )}
        </div>
      )}
    </div>
  );
};
