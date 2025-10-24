'use client'
import { Database, Shield, Users } from 'lucide-react'
export default function GovernedDataModels() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Database className="h-8 w-8 text-indigo-600" />
          Governed Data Models
        </h2>
        <p className="text-gray-600 mt-1">Centralized data governance with row-level security</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Database className="h-8 w-8 text-indigo-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">24</div>
          <div className="text-sm text-gray-600">Data Models</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Shield className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
          <div className="text-sm text-gray-600">Governed</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">156</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>
    </div>
  );
}
