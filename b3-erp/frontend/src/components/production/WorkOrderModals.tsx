'use client'

import { useState } from 'react'
import { X, Download, FileText, Calendar, Filter } from 'lucide-react'

interface ExportWorkOrdersModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, options: any) => void
}

export function ExportWorkOrdersModal({ isOpen, onClose, onExport }: ExportWorkOrdersModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [dateRange, setDateRange] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [includeCompleted, setIncludeCompleted] = useState(true)
  const [includeInProgress, setIncludeInProgress] = useState(true)
  const [includeReleased, setIncludeReleased] = useState(true)
  const [includePlanned, setIncludePlanned] = useState(true)
  const [includeDraft, setIncludeDraft] = useState(false)
  const [includeCancelled, setIncludeCancelled] = useState(false)
  const [includeBasicInfo, setIncludeBasicInfo] = useState(true)
  const [includeProductionDetails, setIncludeProductionDetails] = useState(true)
  const [includeScheduling, setIncludeScheduling] = useState(true)
  const [includeCustomerInfo, setIncludeCustomerInfo] = useState(true)
  const [includeMaterials, setIncludeMaterials] = useState(false)
  const [includeLabor, setIncludeLabor] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    const options = {
      dateRange,
      customStartDate: dateRange === 'custom' ? customStartDate : null,
      customEndDate: dateRange === 'custom' ? customEndDate : null,
      statuses: {
        completed: includeCompleted,
        inProgress: includeInProgress,
        released: includeReleased,
        planned: includePlanned,
        draft: includeDraft,
        cancelled: includeCancelled,
      },
      sections: {
        basicInfo: includeBasicInfo,
        productionDetails: includeProductionDetails,
        scheduling: includeScheduling,
        customerInfo: includeCustomerInfo,
        materials: includeMaterials,
        labor: includeLabor,
      },
    }
    onExport(exportFormat, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Export Work Orders</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Export Format */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'excel'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Excel</div>
                <div className="text-xs text-gray-500 mt-1">.xlsx</div>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">CSV</div>
                <div className="text-xs text-gray-500 mt-1">.csv</div>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">PDF</div>
                <div className="text-xs text-gray-500 mt-1">.pdf</div>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Filters */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Include Work Order Statuses
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCompleted}
                  onChange={(e) => setIncludeCompleted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Completed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInProgress}
                  onChange={(e) => setIncludeInProgress(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In Progress</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeReleased}
                  onChange={(e) => setIncludeReleased(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Released</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePlanned}
                  onChange={(e) => setIncludePlanned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Planned</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDraft}
                  onChange={(e) => setIncludeDraft(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCancelled}
                  onChange={(e) => setIncludeCancelled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Cancelled</span>
              </label>
            </div>
          </div>

          {/* Data Sections */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Include Data Sections
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBasicInfo}
                  onChange={(e) => setIncludeBasicInfo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Basic Information (WO Number, Product, Quantity, Dates)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProductionDetails}
                  onChange={(e) => setIncludeProductionDetails(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Production Details (Work Center, BOM, Status, Progress)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeScheduling}
                  onChange={(e) => setIncludeScheduling(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Scheduling (Assigned Team, Shift Schedule, Priority)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCustomerInfo}
                  onChange={(e) => setIncludeCustomerInfo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Customer Information (Customer Name, Sales Order)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMaterials}
                  onChange={(e) => setIncludeMaterials(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Materials & Components</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLabor}
                  onChange={(e) => setIncludeLabor(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Labor & Time Tracking</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
