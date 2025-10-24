'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { SelfServiceBI, DrillThroughAnalysis, GovernedDataModels, MLForecasting, ExportScheduling, RoleBasedInsights, KPIAlerts } from '@/components/reports'

type TabId = 'self-service' | 'drill-through' | 'data-models' | 'ml-forecasting' | 'export' | 'role-based' | 'kpi-alerts';

export default function ReportsAdvancedFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('self-service');
  const tabs = [
    { id: 'self-service' as TabId, label: 'Self-Service BI' },
    { id: 'drill-through' as TabId, label: 'Drill-Through' },
    { id: 'data-models' as TabId, label: 'Data Models' },
    { id: 'ml-forecasting' as TabId, label: 'ML Forecasting' },
    { id: 'export' as TabId, label: 'Export Scheduling' },
    { id: 'role-based' as TabId, label: 'Role-Based' },
    { id: 'kpi-alerts' as TabId, label: 'KPI Alerts' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'self-service': return <SelfServiceBI />;
      case 'drill-through': return <DrillThroughAnalysis />;
      case 'data-models': return <GovernedDataModels />;
      case 'ml-forecasting': return <MLForecasting />;
      case 'export': return <ExportScheduling />;
      case 'role-based': return <RoleBasedInsights />;
      case 'kpi-alerts': return <KPIAlerts />;
      default: return <SelfServiceBI />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        <div className="bg-white shadow-lg p-6">
          <button onClick={() => router.push('/reports')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-5 w-5" />Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-10 w-10 text-blue-600" />Reports & Analytics - Advanced Features
          </h1>
        </div>
        <div className="bg-white shadow-lg">
          <nav className="flex overflow-x-auto border-b">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'px-6 py-4 border-b-2 border-blue-600 text-blue-600 font-medium whitespace-nowrap' : 'px-6 py-4 text-gray-600 whitespace-nowrap hover:text-gray-900'}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
