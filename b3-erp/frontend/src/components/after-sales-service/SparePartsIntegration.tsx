'use client'
import { Package, Truck, Database, CheckCircle } from 'lucide-react'
export default function SparePartsIntegration() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="h-8 w-8 text-purple-600" />
          Spare Parts Integration
        </h2>
        <p className="text-gray-600 mt-1">Real-time inventory sync and parts availability</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Package className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">2,345</div>
          <div className="text-sm text-gray-600">Parts in Stock</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
          <div className="text-sm text-gray-600">Availability</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Truck className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">156</div>
          <div className="text-sm text-gray-600">Orders Today</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Database className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">Real-time</div>
          <div className="text-sm text-gray-600">Sync</div>
        </div>
      </div>
    </div>
  );
}
