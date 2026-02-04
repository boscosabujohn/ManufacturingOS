'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wrench } from 'lucide-react'
import { LiveSLATracking, TechnicianRouting, SparePartsIntegration, ServiceDispatch, AutomatedEscalations, SelfServicePortal, CustomerFeedbackLoop } from '@/components/after-sales-service'

type TabId = 'sla' | 'routing' | 'parts' | 'dispatch' | 'escalations' | 'feedback';

export default function AfterSalesAdvancedFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('sla');
  const tabs = [
    { id: 'sla' as TabId, label: 'Live SLA' },
    { id: 'routing' as TabId, label: 'Technician Routing' },
    { id: 'parts' as TabId, label: 'Spare Parts' },
    { id: 'dispatch' as TabId, label: 'Service Dispatch' },
    { id: 'escalations' as TabId, label: 'Escalations' },
    { id: 'feedback' as TabId, label: 'Feedback' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sla': return <LiveSLATracking />;
      case 'routing': return <TechnicianRouting />;
      case 'parts': return <SparePartsIntegration />;
      case 'dispatch': return <ServiceDispatch />;
      case 'escalations': return <AutomatedEscalations />;
      case 'feedback': return <CustomerFeedbackLoop />;
      default: return <LiveSLATracking />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3">
      <div className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-100">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div>
              <button onClick={() => router.push('/after-sales-service')} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-widest transition-all hover:gap-2 mb-1">
                <ArrowLeft className="h-4 w-4" /> Back to After-Sales Service
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Advanced Service Suite
              </h1>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-white shadow-lg text-blue-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
