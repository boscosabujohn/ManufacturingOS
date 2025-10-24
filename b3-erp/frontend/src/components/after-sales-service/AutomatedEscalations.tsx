'use client'
import { AlertTriangle, Bell, TrendingUp, Zap } from 'lucide-react'
export default function AutomatedEscalations() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Bell className="h-8 w-8 text-orange-600" />
          Automated Escalations
        </h2>
        <p className="text-gray-600 mt-1">Smart escalation rules and notifications</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Bell className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">23</div>
          <div className="text-sm text-gray-600">Active Escalations</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
          <div className="text-3xl font-bold text-red-600 mb-1">5</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Zap className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">Auto</div>
          <div className="text-sm text-gray-600">Triggered</div>
        </div>
      </div>
    </div>
  );
}
