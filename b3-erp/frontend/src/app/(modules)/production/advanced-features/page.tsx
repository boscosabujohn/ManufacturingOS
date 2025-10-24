'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Cpu, ClipboardCheck, BarChart3, Wrench, GitBranch, Monitor } from 'lucide-react';
import {
  FiniteScheduling,
  MESIntegration,
  QualityChecks,
  OEEAnalytics,
  MaintenanceCoordination,
  Traceability,
  ShopFloorControl,
} from '@/components/production';

type TabId = 'scheduling' | 'mes' | 'quality' | 'oee' | 'maintenance' | 'traceability' | 'shopfloor';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: 'scheduling', label: 'Finite Scheduling', icon: Calendar, component: FiniteScheduling },
  { id: 'mes', label: 'MES Integration', icon: Cpu, component: MESIntegration },
  { id: 'quality', label: 'Quality Checks', icon: ClipboardCheck, component: QualityChecks },
  { id: 'oee', label: 'OEE Analytics', icon: BarChart3, component: OEEAnalytics },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, component: MaintenanceCoordination },
  { id: 'traceability', label: 'Traceability', icon: GitBranch, component: Traceability },
  { id: 'shopfloor', label: 'Shop Floor Control', icon: Monitor, component: ShopFloorControl },
];

export default function ProductionAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('scheduling');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabId;
      if (hash && tabs.find(t => t.id === hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || FiniteScheduling;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-6">
        <div className="bg-white shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Advanced Features</h1>
          <p className="text-gray-600">
            MES-grade capabilities: scheduling, real-time monitoring, quality management, and OEE analytics
          </p>
        </div>

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
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`mr-2 h-5 w-5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>

        <div className="bg-white shadow p-4 text-center text-sm text-gray-600">
          <p>
            These advanced features provide MES-grade manufacturing capabilities comparable to Siemens Opcenter, Rockwell FactoryTalk, and SAP ME.
          </p>
        </div>
      </div>
    </div>
  );
}
