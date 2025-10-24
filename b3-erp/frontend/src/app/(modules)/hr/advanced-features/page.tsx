'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Shield,
  TrendingUp,
  UserPlus,
  Award,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  EmployeeSelfService,
  AdvancedPayroll,
  ComplianceTracking,
  TalentAnalytics,
  OnboardingWorkflow,
  PerformanceReview,
  PolicyManagement,
} from '@/components/hr';

type TabId = 'self-service' | 'payroll' | 'compliance' | 'analytics' | 'onboarding' | 'performance' | 'policy';

export default function HRAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('self-service');

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabId;
      if (hash) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs = [
    { id: 'self-service', label: 'Employee Self-Service', icon: Users, component: EmployeeSelfService },
    { id: 'payroll', label: 'Advanced Payroll', icon: DollarSign, component: AdvancedPayroll },
    { id: 'compliance', label: 'Compliance Tracking', icon: Shield, component: ComplianceTracking },
    { id: 'analytics', label: 'Talent Analytics', icon: TrendingUp, component: TalentAnalytics },
    { id: 'onboarding', label: 'Onboarding Workflow', icon: UserPlus, component: OnboardingWorkflow },
    { id: 'performance', label: 'Performance Review', icon: Award, component: PerformanceReview },
    { id: 'policy', label: 'Policy Management', icon: FileText, component: PolicyManagement },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || EmployeeSelfService;

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="h-full flex flex-col px-2 py-2">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Advanced Features</h1>
              <p className="text-sm text-gray-600">Enterprise HCM capabilities for modern workforce management</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabId);
                    window.location.hash = tab.id;
                  }}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-purple-600 bg-purple-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
