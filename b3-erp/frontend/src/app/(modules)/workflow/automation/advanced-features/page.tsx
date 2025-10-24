'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  OrchestrationEngine,
  ConditionalBranching,
  TestingSandbox,
  IntegrationCatalog,
  ExecutionLogs,
  KPIMonitoring,
  ErrorHandling,
  VersionControl
} from '@/components/workflow'

type TabId = 'orchestration' | 'branching' | 'testing' | 'integrations' | 'logs' | 'kpi' | 'errors' | 'versions';

interface Tab {
  id: TabId;
  label: string;
  hash: string;
}

export default function WorkflowAdvancedFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('orchestration');

  const tabs: Tab[] = [
    { id: 'orchestration', label: 'Orchestration Engine', hash: '#orchestration' },
    { id: 'branching', label: 'Conditional Branching', hash: '#branching' },
    { id: 'testing', label: 'Testing Sandbox', hash: '#testing' },
    { id: 'integrations', label: 'Integration Catalog', hash: '#integrations' },
    { id: 'logs', label: 'Execution Logs', hash: '#logs' },
    { id: 'kpi', label: 'KPI Monitoring', hash: '#kpi' },
    { id: 'errors', label: 'Error Handling', hash: '#errors' },
    { id: 'versions', label: 'Version Control', hash: '#versions' }
  ];

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const tab = tabs.find(t => t.hash === `#${hash}`);
    if (tab) {
      setActiveTab(tab.id);
    }
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      window.location.hash = tab.hash.slice(1);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orchestration':
        return <OrchestrationEngine />;
      case 'branching':
        return <ConditionalBranching />;
      case 'testing':
        return <TestingSandbox />;
      case 'integrations':
        return <IntegrationCatalog />;
      case 'logs':
        return <ExecutionLogs />;
      case 'kpi':
        return <KPIMonitoring />;
      case 'errors':
        return <ErrorHandling />;
      case 'versions':
        return <VersionControl />;
      default:
        return <OrchestrationEngine />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg p-6">
          <button
            onClick={() => router.push('/workflow/automation')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Workflow Automation
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Workflow Automation - Advanced Features
          </h1>
          <p className="text-gray-600 mt-2">
            Enterprise-grade workflow orchestration, monitoring, and management capabilities
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}
