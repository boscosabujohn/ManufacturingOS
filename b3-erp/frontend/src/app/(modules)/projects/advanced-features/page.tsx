'use client'

import { useState, useEffect } from 'react'
import {
  Gauge,
  GitBranch,
  DollarSign,
  Users,
  FileEdit,
  MessageSquare,
  Rocket
} from 'lucide-react'

import {
  ProjectHealthScoring,
  CrossProjectDependencies,
  FinancialRollup,
  ResourceLeveling,
  ChangeControl,
  StakeholderCommunication
} from '@/components/projects'

interface Tab {
  id: string
  label: string
  icon: React.ElementType
  component: React.ComponentType
}

export default function ProjectsAdvancedFeatures() {
  const [activeTab, setActiveTab] = useState<string>('health')

  const tabs: Tab[] = [
    { id: 'health', label: 'Project Health', icon: Gauge, component: ProjectHealthScoring },
    { id: 'dependencies', label: 'Dependencies', icon: GitBranch, component: CrossProjectDependencies },
    { id: 'financial', label: 'Financial Rollup', icon: DollarSign, component: FinancialRollup },
    { id: 'resources', label: 'Resource Leveling', icon: Users, component: ResourceLeveling },
    { id: 'changes', label: 'Change Control', icon: FileEdit, component: ChangeControl },
    { id: 'stakeholders', label: 'Stakeholder Hub', icon: MessageSquare, component: StakeholderCommunication }
  ]

  // Handle hash-based navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && tabs.find(t => t.id === hash)) {
      setActiveTab(hash)
    }
  }, [])

  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProjectHealthScoring

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Rocket className="h-10 w-10 text-blue-600" />
                Projects Advanced Features
              </h1>
              <p className="text-gray-600">
                Enterprise-grade project portfolio management with real-time health scoring, cross-project dependencies, and financial rollup
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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

        {/* Content Area */}
        <div className="p-6">
          <ActiveComponent />
        </div>

        {/* Footer */}
        <div className="bg-white shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            Projects Advanced Features • Real-time health scoring, dependency tracking, financial consolidation, resource optimization, change management, and stakeholder engagement
          </p>
        </div>
      </div>
    </div>
  )
}
