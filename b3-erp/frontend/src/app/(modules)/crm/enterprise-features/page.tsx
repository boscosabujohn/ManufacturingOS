'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Building2, Activity, Zap, Brain, User } from 'lucide-react';
import {
  LeadScoringQualification,
  SalesPipelineManagement,
  AccountContactManagement,
  ActivityManagementTracking,
  SalesAutomation,
  CollaborationIntelligence,
  Customer360View
} from '@/components/crm';

export default function CRMEnterpriseFeaturesPage() {
  const [activeTab, setActiveTab] = useState('lead-scoring');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        setActiveTab(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs = [
    { id: 'lead-scoring', label: 'Lead Scoring & Qualification', icon: Target },
    { id: 'pipeline', label: 'Sales Pipeline Management', icon: TrendingUp },
    { id: 'accounts', label: 'Account & Contact Management', icon: Building2 },
    { id: 'activity', label: 'Activity Management & Tracking', icon: Activity },
    { id: 'automation', label: 'Sales Automation', icon: Zap },
    { id: 'collaboration', label: 'Collaboration & Intelligence', icon: Brain },
    { id: 'customer360', label: 'Customer 360° View', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Enterprise Features</h1>
          <p className="text-gray-600">
            Enterprise-grade sales and relationship management with AI-powered lead scoring, visual pipeline management,
            and comprehensive customer 360° view
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.location.hash = tab.id;
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'lead-scoring' && <LeadScoringQualification />}
          {activeTab === 'pipeline' && <SalesPipelineManagement />}
          {activeTab === 'accounts' && <AccountContactManagement />}
          {activeTab === 'activity' && <ActivityManagementTracking />}
          {activeTab === 'automation' && <SalesAutomation />}
          {activeTab === 'collaboration' && <CollaborationIntelligence />}
          {activeTab === 'customer360' && <Customer360View />}
        </div>
      </div>
    </div>
  );
}
