'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Building2,
  Network,
  MapPin,
  Package,
  Users,
  DollarSign,
  Mail,
  Phone,
  Globe,
  Plus,
  Edit,
  Eye,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';

export interface AccountNode {
  id: string;
  name: string;
  type: 'parent' | 'subsidiary' | 'branch' | 'division' | 'partner';
  industry?: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  employees?: number;
  annualRevenue?: number;
  accountValue: number;
  activeContracts: number;
  relationshipStart: string;
  status: 'active' | 'inactive' | 'pending';
  children?: AccountNode[];
}

export interface AccountHierarchyTreeProps {
  rootAccount: AccountNode;
  onAddChild?: (parentId: string) => void;
  onEdit?: (accountId: string) => void;
  onDelete?: (accountId: string) => void;
  onView?: (accountId: string) => void;
  onLink?: (accountId: string) => void;
  showActions?: boolean;
  expandAll?: boolean;
  className?: string;
}

interface TreeNodeProps {
  node: AccountNode;
  level: number;
  onAddChild?: (parentId: string) => void;
  onEdit?: (accountId: string) => void;
  onDelete?: (accountId: string) => void;
  onView?: (accountId: string) => void;
  onLink?: (accountId: string) => void;
  showActions?: boolean;
  initialExpanded?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onAddChild,
  onEdit,
  onDelete,
  onView,
  onLink,
  showActions = true,
  initialExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded || level < 2);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'parent':
        return {
          color: 'bg-purple-100 text-purple-700 border-purple-300',
          icon: Building2,
          label: 'Parent Company',
        };
      case 'subsidiary':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-300',
          icon: Network,
          label: 'Subsidiary',
        };
      case 'branch':
        return {
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: MapPin,
          label: 'Branch',
        };
      case 'division':
        return {
          color: 'bg-orange-100 text-orange-700 border-orange-300',
          icon: Package,
          label: 'Division',
        };
      case 'partner':
        return {
          color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
          icon: LinkIcon,
          label: 'Partner',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: Building2,
          label: 'Company',
        };
    }
  };

  const typeConfig = getTypeConfig(node.type);
  const Icon = typeConfig.icon;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      {/* Connection Line */}
      {level > 0 && (
        <div className="absolute left-0 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-300" />
      )}

      {/* Node Card */}
      <div className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
        <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all">
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Expand/Collapse Button */}
              <div className="flex-shrink-0">
                {hasChildren ? (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                ) : (
                  <div className="w-7" />
                )}
              </div>

              {/* Node Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border ${typeConfig.color} flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{node.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                        {node.industry && (
                          <span className="text-xs text-gray-600">{node.industry}</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            node.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : node.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {node.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {onView && (
                        <button
                          onClick={() => onView(node.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(node.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onAddChild && (
                        <button
                          onClick={() => onAddChild(node.id)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Add Child Entity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {onLink && (
                        <button
                          onClick={() => onLink(node.id)}
                          className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                          title="Link Account"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && node.type !== 'parent' && (
                        <button
                          onClick={() => onDelete(node.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{node.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{node.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate hover:underline cursor-pointer">{node.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{node.phone}</span>
                  </div>
                  {node.website && (
                    <div className="flex items-center gap-2 text-blue-600 col-span-2">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate hover:underline cursor-pointer">{node.website}</span>
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-2">
                  {node.employees !== undefined && (
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-xs text-blue-600 mb-1">Employees</p>
                      <p className="text-lg font-bold text-blue-900">{node.employees.toLocaleString()}</p>
                    </div>
                  )}
                  {node.annualRevenue !== undefined && (
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-xs text-green-600 mb-1">Revenue</p>
                      <p className="text-lg font-bold text-green-900">
                        ${(node.annualRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  <div className="bg-purple-50 rounded p-2">
                    <p className="text-xs text-purple-600 mb-1">Account Value</p>
                    <p className="text-lg font-bold text-purple-900">
                      ${(node.accountValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded p-2">
                    <p className="text-xs text-orange-600 mb-1">Contracts</p>
                    <p className="text-lg font-bold text-orange-900">{node.activeContracts}</p>
                  </div>
                </div>

                {/* Relationship Info */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <span>Customer since {new Date(node.relationshipStart).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative mt-4 ml-4">
            {/* Vertical connector line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />
            <div className="space-y-4">
              {node.children!.map((child, index) => (
                <div key={child.id} className="relative">
                  {/* Horizontal connector line */}
                  <div className="absolute left-2 top-6 w-4 h-0.5 bg-gray-300" />
                  <TreeNode
                    node={child}
                    level={level + 1}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onLink={onLink}
                    showActions={showActions}
                    initialExpanded={level < 1}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AccountHierarchyTree: React.FC<AccountHierarchyTreeProps> = ({
  rootAccount,
  onAddChild,
  onEdit,
  onDelete,
  onView,
  onLink,
  showActions = true,
  expandAll = false,
  className = '',
}) => {
  // Calculate total stats recursively
  const calculateTotalStats = (node: AccountNode): any => {
    let totals = {
      entities: 1,
      employees: node.employees || 0,
      revenue: node.annualRevenue || 0,
      accountValue: node.accountValue,
      contracts: node.activeContracts,
    };

    if (node.children) {
      node.children.forEach((child) => {
        const childStats = calculateTotalStats(child);
        totals.entities += childStats.entities;
        totals.employees += childStats.employees;
        totals.revenue += childStats.revenue;
        totals.accountValue += childStats.accountValue;
        totals.contracts += childStats.contracts;
      });
    }

    return totals;
  };

  const stats = calculateTotalStats(rootAccount);

  return (
    <div className={`${className}`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <Building2 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.entities}</p>
          <p className="text-sm text-purple-100">Total Entities</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{(stats.employees / 1000).toFixed(0)}K</p>
          <p className="text-sm text-blue-100">Employees</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <DollarSign className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">${(stats.revenue / 1000000000).toFixed(1)}B</p>
          <p className="text-sm text-green-100">Total Revenue</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <DollarSign className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">${(stats.accountValue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-orange-100">Account Value</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
          <Package className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.contracts}</p>
          <p className="text-sm text-pink-100">Active Contracts</p>
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <TreeNode
          node={rootAccount}
          level={0}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onLink={onLink}
          showActions={showActions}
          initialExpanded={expandAll}
        />
      </div>
    </div>
  );
};
