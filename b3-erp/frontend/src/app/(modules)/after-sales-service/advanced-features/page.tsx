'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wrench } from 'lucide-react'
import { LiveSLATracking, TechnicianRouting, SparePartsIntegration, ServiceDispatch, AutomatedEscalations, SelfServicePortal, CustomerFeedbackLoop } from '@/components/after-sales-service'

type TabId = 'sla' | 'routing' | 'parts' | 'dispatch' | 'escalations' | 'self-service' | 'feedback';

export default function AfterSalesAdvancedFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('sla');
  const tabs = [
    { id: 'sla' as TabId, label: 'Live SLA' },
    { id: 'routing' as TabId, label: 'Technician Routing' },
    { id: 'parts' as TabId, label: 'Spare Parts' },
    { id: 'dispatch' as TabId, label: 'Service Dispatch' },
    { id: 'escalations' as TabId, label: 'Escalations' },
    { id: 'self-service' as TabId, label: 'Self-Service' },
    { id: 'feedback' as TabId, label: 'Feedback' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sla': return <LiveSLATracking />;
      case 'routing': return <TechnicianRouting />;
      case 'parts': return <SparePartsIntegration />;
      case 'dispatch': return <ServiceDispatch />;
      case 'escalations': return <AutomatedEscalations />;
      case 'self-service': return <SelfServicePortal />;
      case 'feedback': return <CustomerFeedbackLoop />;
      default: return <LiveSLATracking />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        <div className="bg-white shadow-lg p-6">
          <button onClick={() => router.push('/after-sales-service')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-5 w-5" />Back to After-Sales Service
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="h-10 w-10 text-blue-600" />After-Sales Service - Advanced Features
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
