'use client'
import { Bell, AlertTriangle, TrendingUp, Target } from 'lucide-react'
export default function KPIAlerts() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Bell className="h-8 w-8 text-orange-600" />
          KPI Alerts
        </h2>
        <p className="text-gray-600 mt-1">Real-time notifications when KPIs exceed thresholds</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Bell className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
          <div className="text-3xl font-bold text-red-600 mb-1">12</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">89%</div>
          <div className="text-sm text-gray-600">Target Met</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Target className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">67</div>
          <div className="text-sm text-gray-600">KPIs Tracked</div>
        </div>
      </div>
    </div>
  );
}
