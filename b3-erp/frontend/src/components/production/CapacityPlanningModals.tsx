'use client'

import { useState } from 'react'
import { X, Save, Download, Send, Settings, BarChart3, AlertTriangle, TrendingUp, Users, Clock, Factory, FileText, Package } from 'lucide-react'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, options: any) => void
}

interface RequestResourcesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (request: any) => void
}

interface WorkCenterConfigModalProps {
  isOpen: boolean
  onClose: () => void
  workCenter: any | null
  onSave: (data: any) => void
}

interface BottleneckResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  bottleneck: any | null
  onApply: (actions: any) => void
}

interface OvertimePlanningModalProps {
  isOpen: boolean
  onClose: () => void
  workCenter: any | null
  onApprove: (plan: any) => void
}

export function ExportReportModal({ isOpen, onClose, onExport }: ExportReportModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [includeCapacityLoad, setIncludeCapacityLoad] = useState(true)
  const [includeBottlenecks, setIncludeBottlenecks] = useState(true)
  const [includeResourceLeveling, setIncludeResourceLeveling] = useState(true)
  const [includeOvertimePlan, setIncludeOvertimePlan] = useState(true)
  const [includeScenarios, setIncludeScenarios] = useState(true)
  const [includeMachineLabor, setIncludeMachineLabor] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(true)

  if (!isOpen) return null

  const handleExport = () => {
    const options = {
      includeCapacityLoad,
      includeBottlenecks,
      includeResourceLeveling,
      includeOvertimePlan,
      includeScenarios,
      includeMachineLabor,
      includeCharts,
    }
    onExport(exportFormat, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Export Capacity Planning Report</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Export Format */}
          <div className="mb-6">
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

          {/* Export Sections */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Sections</label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeCapacityLoad}
                  onChange={(e) => setIncludeCapacityLoad(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-gray-900">Capacity vs Load Analysis</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Work center utilization, available vs required capacity</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeBottlenecks}
                  onChange={(e) => setIncludeBottlenecks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium text-gray-900">Bottleneck Analysis</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Constrained resources, overloaded periods, suggested actions</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeResourceLeveling}
                  onChange={(e) => setIncludeResourceLeveling(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-900">Resource Leveling</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Load balancing, work order rescheduling recommendations</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeOvertimePlan}
                  onChange={(e) => setIncludeOvertimePlan(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-gray-900">Overtime Planning</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Overtime hours, costs, workforce requirements</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeScenarios}
                  onChange={(e) => setIncludeScenarios(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-gray-900">Scenario Comparison</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">What-if scenarios, capacity expansion analysis</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeMachineLabor}
                  onChange={(e) => setIncludeMachineLabor(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-600" />
                    <p className="text-sm font-medium text-gray-900">Machine & Labor Split</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Machine hours vs labor hours breakdown</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={exportFormat === 'csv'}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-pink-600" />
                    <p className="text-sm font-medium text-gray-900">Charts & Visualizations</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {exportFormat === 'csv' ? 'Not available for CSV format' : 'Graphs, charts, and visual analytics'}
                  </p>
                </div>
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
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RequestResourcesModal({ isOpen, onClose, onSubmit }: RequestResourcesModalProps) {
  const [formData, setFormData] = useState({
    resourceType: 'machine',
    workCenter: '',
    quantity: 1,
    requiredBy: '',
    duration: 'permanent',
    justification: '',
    priority: 'normal',
    estimatedCost: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Send className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Request Additional Resources</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Resource Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type *</label>
                <select
                  value={formData.resourceType}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="machine">Machine / Equipment</option>
                  <option value="labor">Labor / Workforce</option>
                  <option value="tooling">Tooling / Fixtures</option>
                  <option value="space">Floor Space</option>
                  <option value="utility">Utilities (Power, Water, etc.)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Center *</label>
                <select
                  value={formData.workCenter}
                  onChange={(e) => setFormData({ ...formData, workCenter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Work Center</option>
                  <option value="WC-01">WC-01 - Cabinet Assembly</option>
                  <option value="WC-02">WC-02 - CNC Machining</option>
                  <option value="WC-03">WC-03 - Welding & Fabrication</option>
                  <option value="WC-04">WC-04 - Painting & Finishing</option>
                  <option value="WC-05">WC-05 - Quality Inspection</option>
                  <option value="WC-06">WC-06 - Packaging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity / Units *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required By Date *</label>
                <input
                  type="date"
                  value={formData.requiredBy}
                  onChange={(e) => setFormData({ ...formData, requiredBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="permanent">Permanent Addition</option>
                  <option value="temporary">Temporary (Specify in justification)</option>
                  <option value="rental">Rental / Lease</option>
                  <option value="outsource">Outsource / Subcontract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (Optional)</label>
                <input
                  type="text"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="₹ 5,00,000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Justification *</label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Explain the need for additional resources, expected benefits, and impact on capacity..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Request Process
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your request will be sent to the Production Manager for review</li>
              <li>• Approval required from Finance for resources exceeding ₹2,00,000</li>
              <li>• Expected response time: 3-5 business days</li>
              <li>• You will receive email notifications on status updates</li>
            </ul>
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
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function WorkCenterConfigModal({ isOpen, onClose, workCenter, onSave }: WorkCenterConfigModalProps) {
  const [formData, setFormData] = useState({
    workCenterName: workCenter?.workCenterName || '',
    numberOfMachines: workCenter?.numberOfMachines || 1,
    shiftsPerDay: workCenter?.shiftsPerDay || 2,
    hoursPerShift: workCenter?.hoursPerShift || 8,
    workingDaysPerWeek: workCenter?.workingDaysPerWeek || 6,
    efficiencyFactor: workCenter?.efficiencyFactor || 85,
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const calculatedCapacity = formData.numberOfMachines * formData.shiftsPerDay * formData.hoursPerShift *
                              formData.workingDaysPerWeek * 4 * (formData.efficiencyFactor / 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Configure Work Center</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Center Name</label>
              <input
                type="text"
                value={formData.workCenterName}
                onChange={(e) => setFormData({ ...formData, workCenterName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Machines</label>
                <input
                  type="number"
                  value={formData.numberOfMachines}
                  onChange={(e) => setFormData({ ...formData, numberOfMachines: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shifts per Day</label>
                <select
                  value={formData.shiftsPerDay}
                  onChange={(e) => setFormData({ ...formData, shiftsPerDay: Number(e.target.value) as 1 | 2 | 3 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={1}>1 Shift</option>
                  <option value={2}>2 Shifts</option>
                  <option value={3}>3 Shifts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours per Shift</label>
                <input
                  type="number"
                  value={formData.hoursPerShift}
                  onChange={(e) => setFormData({ ...formData, hoursPerShift: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  max="12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Days per Week</label>
                <input
                  type="number"
                  value={formData.workingDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, workingDaysPerWeek: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  max="7"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency Factor (%)</label>
              <input
                type="number"
                value={formData.efficiencyFactor}
                onChange={(e) => setFormData({ ...formData, efficiencyFactor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Accounts for downtime, breaks, changeovers</p>
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Calculated Monthly Capacity</h4>
            <p className="text-3xl font-bold text-purple-900">{Math.round(calculatedCapacity).toLocaleString()} hours</p>
            <p className="text-xs text-purple-700 mt-1">Based on current configuration</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
