'use client'
import { Globe, BookOpen, Search, MessageSquare } from 'lucide-react'
export default function SelfServicePortal() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Globe className="h-8 w-8 text-blue-600" />
          Self-Service Portal
        </h2>
        <p className="text-gray-600 mt-1">Customer knowledge base and self-help tools</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">234</div>
          <div className="text-sm text-gray-600">KB Articles</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Search className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">1,234</div>
          <div className="text-sm text-gray-600">Searches</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <MessageSquare className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">45%</div>
          <div className="text-sm text-gray-600">Deflection Rate</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Globe className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
          <div className="text-sm text-gray-600">Availability</div>
        </div>
      </div>
    </div>
  );
}
