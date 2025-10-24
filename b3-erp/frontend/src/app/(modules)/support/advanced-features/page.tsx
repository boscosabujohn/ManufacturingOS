'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Headphones } from 'lucide-react'
import { OmnichannelRouting, KnowledgeBaseIntegration, AIAssistedResponses, SLAAutomation, CSATSurveys, BacklogForecasting, ITILWorkflows } from '@/components/support'

type TabId = 'omnichannel' | 'knowledge' | 'ai' | 'sla' | 'csat' | 'backlog' | 'itil';

export default function SupportAdvancedFeaturesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('omnichannel');
  const tabs = [
    { id: 'omnichannel' as TabId, label: 'Omnichannel' },
    { id: 'knowledge' as TabId, label: 'Knowledge Base' },
    { id: 'ai' as TabId, label: 'AI Responses' },
    { id: 'sla' as TabId, label: 'SLA' },
    { id: 'csat' as TabId, label: 'CSAT' },
    { id: 'backlog' as TabId, label: 'Backlog' },
    { id: 'itil' as TabId, label: 'ITIL' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'omnichannel': return <OmnichannelRouting />;
      case 'knowledge': return <KnowledgeBaseIntegration />;
      case 'ai': return <AIAssistedResponses />;
      case 'sla': return <SLAAutomation />;
      case 'csat': return <CSATSurveys />;
      case 'backlog': return <BacklogForecasting />;
      case 'itil': return <ITILWorkflows />;
      default: return <OmnichannelRouting />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        <div className="bg-white shadow-lg p-6">
          <button onClick={() => router.push('/support')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-5 w-5" />Back to Support
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Headphones className="h-10 w-10 text-blue-600" />Support Advanced Features
          </h1>
        </div>
        <div className="bg-white shadow-lg">
          <nav className="flex overflow-x-auto border-b">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'px-6 py-4 border-b-2 border-blue-600 text-blue-600' : 'px-6 py-4 text-gray-600'}>
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
