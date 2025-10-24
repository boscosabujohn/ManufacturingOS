'use client'

import { useState, useEffect } from 'react'
import { Users, Award, BarChart3, GitBranch, FileText, Gavel, FileSignature, Rocket } from 'lucide-react'

import {
  VendorCollaboration,
  ResponseScoring,
  BidComparison,
  ApprovalWorkflow,
  AuditTrail,
  SourcingIntegration,
  ContractGeneration
} from '@/components/rfq'

interface Tab {
  id: string
  label: string
  icon: React.ElementType
  component: React.ComponentType
}

export default function RFQAdvancedFeatures() {
  const [activeTab, setActiveTab] = useState<string>('collaboration')

  const tabs: Tab[] = [
    { id: 'collaboration', label: 'Vendor Collaboration', icon: Users, component: VendorCollaboration },
    { id: 'scoring', label: 'Response Scoring', icon: Award, component: ResponseScoring },
    { id: 'comparison', label: 'Bid Comparison', icon: BarChart3, component: BidComparison },
    { id: 'approval', label: 'Approval Workflow', icon: GitBranch, component: ApprovalWorkflow },
    { id: 'audit', label: 'Audit Trail', icon: FileText, component: AuditTrail },
    { id: 'sourcing', label: 'Sourcing Integration', icon: Gavel, component: SourcingIntegration },
    { id: 'contract', label: 'Contract Generation', icon: FileSignature, component: ContractGeneration }
  ]

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && tabs.find(t => t.id === hash)) {
      setActiveTab(hash)
    }
  }, [])

  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || VendorCollaboration

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="space-y-6">
        <div className="bg-white shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Rocket className="h-10 w-10 text-blue-600" />
                RFQ Advanced Features
              </h1>
              <p className="text-gray-600">
                Enterprise procurement with vendor collaboration, response scoring, automated comparison, and contract generation
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          <ActiveComponent />
        </div>

        <div className="bg-white shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            RFQ Advanced Features • Vendor portals, weighted scoring, bid analytics, multi-level approvals, audit logging, sourcing events, and contract automation
          </p>
        </div>
      </div>
    </div>
  )
}
