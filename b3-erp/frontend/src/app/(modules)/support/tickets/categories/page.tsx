'use client'

import { useState } from 'react'
import { Tag, BarChart, Plus } from 'lucide-react'

export default function TicketCategories() {
  const [categories] = useState([
    { id: '1', name: 'Bug', description: 'Software bugs and errors', color: 'red', ticketCount: 156, avgResolutionTime: '8h 30m', slaTarget: '24h' },
    { id: '2', name: 'Feature Request', description: 'New feature suggestions', color: 'blue', ticketCount: 89, avgResolutionTime: '48h 15m', slaTarget: '72h' },
    { id: '3', name: 'How-To', description: 'User questions and guidance', color: 'green', ticketCount: 203, avgResolutionTime: '2h 45m', slaTarget: '4h' },
    { id: '4', name: 'Performance', description: 'System performance issues', color: 'orange', ticketCount: 67, avgResolutionTime: '12h 20m', slaTarget: '24h' },
    { id: '5', name: 'Access Issue', description: 'Login and permission problems', color: 'purple', ticketCount: 124, avgResolutionTime: '3h 15m', slaTarget: '8h' }
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Categories</h1>
          <p className="text-gray-600 mt-1">Manage support ticket categories and classification</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700">
          <Plus className="h-4 w-4 inline mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${category.color}-100`}>
                <Tag className={`h-6 w-6 text-${category.color}-600`} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{category.ticketCount}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Resolution:</span>
                <span className="font-medium text-gray-900">{category.avgResolutionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SLA Target:</span>
                <span className="font-medium text-gray-900">{category.slaTarget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
