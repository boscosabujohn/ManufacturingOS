'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Gavel, GitBranch, AlertTriangle, TrendingDown, BarChart3 } from 'lucide-react';
import {
  SupplierPortal,
  ContractCompliance,
  SourcingEvents,
  ApprovalWorkflows,
  SupplierRiskScoring,
  SavingsTracking,
  SpendAnalytics,
} from '@/components/procurement';

type TabId = 'portal' | 'contracts' | 'sourcing' | 'approvals' | 'risk' | 'savings' | 'spend';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: 'portal', label: 'Supplier Portal', icon: Users, component: SupplierPortal },
  { id: 'contracts', label: 'Contract Compliance', icon: Shield, component: ContractCompliance },
  { id: 'sourcing', label: 'Sourcing Events', icon: Gavel, component: SourcingEvents },
  { id: 'approvals', label: 'Approval Workflows', icon: GitBranch, component: ApprovalWorkflows },
  { id: 'risk', label: 'Supplier Risk Scoring', icon: AlertTriangle, component: SupplierRiskScoring },
  { id: 'savings', label: 'Savings Tracking', icon: TrendingDown, component: SavingsTracking },
  { id: 'spend', label: 'Spend Analytics', icon: BarChart3, component: SpendAnalytics },
];

export default function ProcurementAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('portal');

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabId;
      if (hash && tabs.find(t => t.id === hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange(); // Initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || SupplierPortal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Procurement Advanced Features</h1>
          <p className="text-gray-600">
            Enterprise-grade procurement capabilities: supplier collaboration, contract management, sourcing events, and analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`mr-2 h-5 w-5 ${
                        activeTab === tab.id ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white shadow p-4 text-center text-sm text-gray-600">
          <p>
            These advanced features provide enterprise-grade procurement capabilities comparable to SAP Ariba, Coupa, and Oracle Procurement Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
