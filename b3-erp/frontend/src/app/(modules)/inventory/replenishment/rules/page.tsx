'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Settings, Plus, Edit, Trash2, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReplenishmentRule {
  id: string;
  ruleName: string;
  description: string;
  category: string;
  itemFilter: string;
  method: 'reorder-point' | 'min-max' | 'consumption-based' | 'economic-order-qty';
  autoApprove: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  supplier: string;
  leadTimeDays: number;
  safetyStockDays: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export default function ReplenishmentRulesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const rules: ReplenishmentRule[] = [
    {
      id: '1',
      ruleName: 'Critical Raw Materials - Auto Replenish',
      description: 'Automatically create replenishment requests for critical raw materials when stock falls below reorder point',
      category: 'Raw Materials',
      itemFilter: 'RM-*',
      method: 'reorder-point',
      autoApprove: true,
      priority: 'critical',
      supplier: 'Any Available',
      leadTimeDays: 7,
      safetyStockDays: 3,
      isActive: true,
      createdDate: '2025-09-15',
      lastModified: '2025-10-20'
    },
    {
      id: '2',
      ruleName: 'Components Min-Max Replenishment',
      description: 'Maintain min-max levels for all component parts with weekly review',
      category: 'Components',
      itemFilter: 'CP-*',
      method: 'min-max',
      autoApprove: false,
      priority: 'high',
      supplier: 'Primary Supplier',
      leadTimeDays: 10,
      safetyStockDays: 5,
      isActive: true,
      createdDate: '2025-08-20',
      lastModified: '2025-10-18'
    },
    {
      id: '3',
      ruleName: 'Consumables - Usage Based',
      description: 'Replenish consumables based on average monthly consumption patterns',
      category: 'Consumables',
      itemFilter: 'CS-*',
      method: 'consumption-based',
      autoApprove: false,
      priority: 'medium',
      supplier: 'Multiple Suppliers',
      leadTimeDays: 3,
      safetyStockDays: 2,
      isActive: true,
      createdDate: '2025-07-10',
      lastModified: '2025-10-15'
    },
    {
      id: '4',
      ruleName: 'High-Value Items EOQ',
      description: 'Economic Order Quantity based replenishment for high-value items to minimize holding costs',
      category: 'High-Value Parts',
      itemFilter: 'HV-*',
      method: 'economic-order-qty',
      autoApprove: false,
      priority: 'high',
      supplier: 'Certified Suppliers Only',
      leadTimeDays: 14,
      safetyStockDays: 7,
      isActive: true,
      createdDate: '2025-06-05',
      lastModified: '2025-09-28'
    },
    {
      id: '5',
      ruleName: 'Seasonal Items - Advance Planning',
      description: 'Replenish seasonal items 60 days before peak season',
      category: 'Seasonal',
      itemFilter: 'SN-*',
      method: 'consumption-based',
      autoApprove: false,
      priority: 'medium',
      supplier: 'Primary Supplier',
      leadTimeDays: 21,
      safetyStockDays: 10,
      isActive: false,
      createdDate: '2025-05-12',
      lastModified: '2025-08-30'
    },
    {
      id: '6',
      ruleName: 'Fast-Moving Items - Daily Review',
      description: 'Daily monitoring and replenishment of fast-moving inventory items',
      category: 'Fast-Moving',
      itemFilter: 'FM-*',
      method: 'reorder-point',
      autoApprove: true,
      priority: 'critical',
      supplier: 'Any Available',
      leadTimeDays: 2,
      safetyStockDays: 1,
      isActive: true,
      createdDate: '2025-09-01',
      lastModified: '2025-10-21'
    }
  ];

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && rule.isActive) ||
                         (filterStatus === 'inactive' && !rule.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'reorder-point': return 'Reorder Point';
      case 'min-max': return 'Min-Max';
      case 'consumption-based': return 'Consumption Based';
      case 'economic-order-qty': return 'EOQ';
      default: return method;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'reorder-point': return 'bg-blue-100 text-blue-700';
      case 'min-max': return 'bg-purple-100 text-purple-700';
      case 'consumption-based': return 'bg-green-100 text-green-700';
      case 'economic-order-qty': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleToggleActive = (ruleId: string) => {
    alert(`Toggle rule ${ruleId} active status`);
  };

  const handleEditRule = (ruleId: string) => {
    alert(`Edit rule ${ruleId}`);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this replenishment rule?')) {
      alert(`Delete rule ${ruleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Replenishment Rules</h1>
            <p className="text-sm text-gray-500 mt-1">Configure automated replenishment rules and policies</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Rules</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{rules.length}</p>
            </div>
            <Settings className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {rules.filter(r => r.isActive).length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Auto-Approve</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {rules.filter(r => r.autoApprove).length}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-700" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rules.filter(r => !r.isActive).length}
              </p>
            </div>
            <ToggleLeft className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Components">Components</option>
            <option value="Consumables">Consumables</option>
            <option value="High-Value Parts">High-Value Parts</option>
            <option value="Fast-Moving">Fast-Moving</option>
            <option value="Seasonal">Seasonal</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{rule.ruleName}</h3>
                  {rule.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <ToggleLeft className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                  {rule.autoApprove && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Auto-Approve
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{rule.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Item Filter</p>
                    <p className="text-sm font-mono font-semibold text-blue-600">{rule.itemFilter}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Method</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMethodColor(rule.method)}`}>
                      {getMethodLabel(rule.method)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Priority</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Supplier</p>
                    <p className="text-sm font-semibold text-gray-900">{rule.supplier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lead Time</p>
                    <p className="text-sm font-semibold text-gray-900">{rule.leadTimeDays} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Safety Stock</p>
                    <p className="text-sm font-semibold text-gray-900">{rule.safetyStockDays} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Modified</p>
                    <p className="text-sm text-gray-600">{rule.lastModified}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleToggleActive(rule.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={rule.isActive ? 'Deactivate' : 'Activate'}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => handleEditRule(rule.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No replenishment rules found</p>
          <p className="text-sm text-gray-400 mt-1">Create a new rule to get started</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Replenishment Methods:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
          <div>
            <strong>Reorder Point:</strong> Creates request when stock falls below reorder point
          </div>
          <div>
            <strong>Min-Max:</strong> Maintains stock between minimum and maximum levels
          </div>
          <div>
            <strong>Consumption Based:</strong> Replenishes based on historical usage patterns
          </div>
          <div>
            <strong>Economic Order Qty (EOQ):</strong> Optimizes order quantity to minimize total costs
          </div>
        </div>
      </div>
    </div>
  );
}
