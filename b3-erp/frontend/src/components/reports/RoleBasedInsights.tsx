'use client'
import { Users, Eye, Lock, Settings } from 'lucide-react'
export default function RoleBasedInsights() {
  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Role-Based Insights
        </h2>
        <p className="text-gray-600 mt-1">Personalized dashboards based on user roles and permissions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">User Roles</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Eye className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">89</div>
          <div className="text-sm text-gray-600">Custom Views</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Lock className="h-8 w-8 text-red-600 mb-3" />
          <div className="text-3xl font-bold text-red-600 mb-1">100%</div>
          <div className="text-sm text-gray-600">Secure</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
          <Settings className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">234</div>
          <div className="text-sm text-gray-600">Permissions</div>
        </div>
      </div>
    </div>
  );
}
