'use client'

import React from 'react'
import { X, Eye, Clock, AlertCircle, CheckCircle, Activity, TrendingUp, Package, Wrench, Users, FileText, Calendar, BarChart3, Timer, Target, AlertTriangle, Info, PlayCircle, PauseCircle, StopCircle } from 'lucide-react'

// =============================================
// OPERATOR DETAIL INTERFACES
// =============================================

export interface OperatorDetail {
  id: string
  name: string
  employeeId: string
  shift: string
  station: string
  department: string
  status: 'active' | 'idle' | 'break' | 'offline'
  currentWorkOrder?: string
  currentOperation?: string
  operationStartTime?: string
  elapsedTime?: string
  efficiency: number
  targetParts: number
  actualParts: number
  goodParts: number
  rejectedParts: number
  qualityRate: number
  defectCount: number
  reworkCount: number
  totalOperations: number
  totalPartsToday: number
  totalDowntime: string
  lastActivityTime: string
  skillLevel: string
  certifications: string[]
  contactInfo?: {
    phone?: string
    email?: string
  }
}

interface OperatorDetailModalProps {
  isOpen: boolean
  onClose: () => void
  operator: OperatorDetail | null
}

// =============================================
// STATION DETAIL INTERFACES
// =============================================

export interface StationDetail {
  id: string
  name: string
  stationCode: string
  type: string
  location: string
  status: 'running' | 'idle' | 'maintenance' | 'offline' | 'error'
  currentWorkOrder?: string
  currentOperator?: string
  currentOperation?: string
  operationProgress: number
  utilizationRate: number
  availableCapacity: number
  totalCapacity: number
  machineStatus: string
  lastMaintenance?: string
  nextMaintenanceDue?: string
  maintenanceHoursRemaining?: number
  partsProducedToday: number
  currentCycleTime?: number
  averageCycleTime: number
  targetCycleTime: number
  oeeScore: number
  availability: number
  performance: number
  quality: number
  downtimeToday: string
  capabilities: string[]
  assignedShifts: string[]
  equipmentDetails?: {
    manufacturer?: string
    model?: string
    serialNumber?: string
    yearInstalled?: number
  }
}

interface StationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  station: StationDetail | null
}

// =============================================
// WORK ORDER DETAIL INTERFACES
// =============================================

export interface WorkOrderOperation {
  sequence: number
  operationId: string
  operationName: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  station?: string
  operator?: string
  completedQty: number
  totalQty: number
  startTime?: string
  endTime?: string
  duration?: string
}

export interface MaterialRequirement {
  materialCode: string
  materialName: string
  requiredQty: number
  availableQty: number
  unit: string
  status: 'available' | 'partial' | 'shortage'
  location?: string
}

export interface WorkOrderDetail {
  id: string
  workOrderNumber: string
  productCode: string
  productName: string
  quantity: number
  completedQuantity: number
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate: string
  dueDate: string
  completionDate?: string
  currentOperation?: string
  currentStation?: string
  currentOperator?: string
  currentOperationStatus?: string
  operations: WorkOrderOperation[]
  materials: MaterialRequirement[]
  inspectionStatus: 'not-started' | 'in-progress' | 'passed' | 'failed'
  defectsFound: number
  qualityRate: number
  customer?: string
  salesOrder?: string
  notes?: string
  totalEstimatedTime: string
  actualTimeSpent: string
}

interface WorkOrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  workOrder: WorkOrderDetail | null
}

// =============================================
// ACTIVITY LOG DETAIL INTERFACES
// =============================================

export interface ActivityLogDetail {
  id: string
  timestamp: string
  logType: 'production' | 'quality' | 'downtime' | 'material' | 'maintenance' | 'other'
  severity?: 'info' | 'warning' | 'critical'
  workOrder?: string
  operation?: string
  station?: string
  operator?: string
  description: string
  details?: string
  actionsTaken?: string[]
  relatedData?: {
    quantity?: number
    duration?: string
    defectType?: string
    materialCode?: string
    downtimeReason?: string
    resolution?: string
    resolvedBy?: string
    resolvedAt?: string
  }
  affectedMetrics?: {
    metric: string
    previousValue: string
    newValue: string
  }[]
  attachments?: string[]
  createdBy?: string
}

interface ActivityLogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  log: ActivityLogDetail | null
}

// =============================================
// OPERATOR DETAIL MODAL COMPONENT
// =============================================

export function OperatorDetailModal({ isOpen, onClose, operator }: OperatorDetailModalProps) {
  if (!isOpen || !operator) return null

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      idle: 'bg-gray-100 text-gray-800 border border-gray-200',
      break: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      offline: 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[status as keyof typeof badges] || badges.idle
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4" />
      case 'idle':
        return <PauseCircle className="h-4 w-4" />
      case 'break':
        return <Clock className="h-4 w-4" />
      case 'offline':
        return <StopCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600'
    if (efficiency >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Operator Details</h2>
              <p className="text-indigo-100 text-sm">Complete operator information and performance metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Operator ID</label>
                <p className="text-gray-900 font-semibold">{operator.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-semibold">{operator.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(operator.status)}`}>
                  {getStatusIcon(operator.status)}
                  <span className="capitalize">{operator.status}</span>
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Shift</label>
                <p className="text-gray-900">{operator.shift}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Station</label>
                <p className="text-gray-900">{operator.station}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{operator.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Skill Level</label>
                <p className="text-gray-900">{operator.skillLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Activity</label>
                <p className="text-gray-900">{operator.lastActivityTime}</p>
              </div>
              {operator.contactInfo?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{operator.contactInfo.phone}</p>
                </div>
              )}
            </div>

            {operator.certifications && operator.certifications.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {operator.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Activity Section */}
          {operator.currentWorkOrder && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Activity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Active Work Order</label>
                  <p className="text-gray-900 font-semibold">{operator.currentWorkOrder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Operation</label>
                  <p className="text-gray-900">{operator.currentOperation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Time</label>
                  <p className="text-gray-900">{operator.operationStartTime || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Elapsed Time</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-gray-900 font-semibold">{operator.elapsedTime || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics Section */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Efficiency</label>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-bold ${getEfficiencyColor(operator.efficiency)}`}>
                    {operator.efficiency}%
                  </p>
                  {operator.efficiency >= 90 && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {operator.efficiency < 75 && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Target Parts</label>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-gray-400" />
                  <p className="text-2xl font-bold text-gray-900">{operator.targetParts}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Actual Parts</label>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.actualParts}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Good Parts</label>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{operator.goodParts}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Rejected Parts</label>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-red-600">{operator.rejectedParts}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Parts Variance</label>
                <p className={`text-2xl font-bold ${operator.actualParts >= operator.targetParts ? 'text-green-600' : 'text-red-600'}`}>
                  {operator.actualParts >= operator.targetParts ? '+' : ''}{operator.actualParts - operator.targetParts}
                </p>
              </div>
            </div>
          </div>

          {/* Quality Metrics Section */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Quality Rate</label>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-bold ${getQualityColor(operator.qualityRate)}`}>
                    {operator.qualityRate}%
                  </p>
                  {operator.qualityRate >= 95 && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {operator.qualityRate < 85 && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Defects</label>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.defectCount}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Rework Count</label>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.reworkCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Summary Section */}
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Operations</label>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.totalOperations}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Parts Produced</label>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.totalPartsToday}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Downtime</label>
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-gray-900">{operator.totalDowntime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================
// STATION DETAIL MODAL COMPONENT
// =============================================

export function StationDetailModal({ isOpen, onClose, station }: StationDetailModalProps) {
  if (!isOpen || !station) return null

  const getStatusBadge = (status: string) => {
    const badges = {
      running: 'bg-green-100 text-green-800 border border-green-200',
      idle: 'bg-gray-100 text-gray-800 border border-gray-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      offline: 'bg-red-100 text-red-800 border border-red-200',
      error: 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[status as keyof typeof badges] || badges.idle
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayCircle className="h-4 w-4" />
      case 'idle':
        return <PauseCircle className="h-4 w-4" />
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'offline':
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-600'
    if (rate >= 60) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getOEEColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 65) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wrench className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Station Details</h2>
              <p className="text-indigo-100 text-sm">Complete station information and performance metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Station Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Station Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Station ID</label>
                <p className="text-gray-900 font-semibold">{station.stationCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Station Name</label>
                <p className="text-gray-900 font-semibold">{station.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(station.status)}`}>
                  {getStatusIcon(station.status)}
                  <span className="capitalize">{station.status}</span>
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900">{station.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{station.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Downtime Today</label>
                <p className="text-gray-900">{station.downtimeToday}</p>
              </div>
            </div>

            {station.equipmentDetails && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Equipment Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {station.equipmentDetails.manufacturer && (
                    <div>
                      <label className="text-xs text-gray-400">Manufacturer</label>
                      <p className="text-sm text-gray-900">{station.equipmentDetails.manufacturer}</p>
                    </div>
                  )}
                  {station.equipmentDetails.model && (
                    <div>
                      <label className="text-xs text-gray-400">Model</label>
                      <p className="text-sm text-gray-900">{station.equipmentDetails.model}</p>
                    </div>
                  )}
                  {station.equipmentDetails.serialNumber && (
                    <div>
                      <label className="text-xs text-gray-400">Serial Number</label>
                      <p className="text-sm text-gray-900">{station.equipmentDetails.serialNumber}</p>
                    </div>
                  )}
                  {station.equipmentDetails.yearInstalled && (
                    <div>
                      <label className="text-xs text-gray-400">Year Installed</label>
                      <p className="text-sm text-gray-900">{station.equipmentDetails.yearInstalled}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {station.capabilities && station.capabilities.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Capabilities</label>
                <div className="flex flex-wrap gap-2">
                  {station.capabilities.map((capability, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {station.assignedShifts && station.assignedShifts.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 mb-2 block">Assigned Shifts</label>
                <div className="flex flex-wrap gap-2">
                  {station.assignedShifts.map((shift, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {shift}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Operation Section */}
          {station.currentWorkOrder && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Operation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Order</label>
                  <p className="text-gray-900 font-semibold">{station.currentWorkOrder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Operator</label>
                  <p className="text-gray-900">{station.currentOperator || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Operation</label>
                  <p className="text-gray-900">{station.currentOperation || 'N/A'}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-500">Progress</label>
                  <span className="text-sm font-semibold text-gray-900">{station.operationProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${station.operationProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Capacity Section */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Capacity & Utilization</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Utilization Rate</label>
                <div className="flex items-baseline space-x-2 mb-2">
                  <p className="text-3xl font-bold text-gray-900">{station.utilizationRate}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${getUtilizationColor(station.utilizationRate)}`}
                    style={{ width: `${station.utilizationRate}%` }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Available Capacity</label>
                <div className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <p className="text-3xl font-bold text-gray-900">
                    {station.availableCapacity} / {station.totalCapacity}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Units available / Total capacity</p>
              </div>
            </div>
          </div>

          {/* Equipment Status Section */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Machine Status</label>
                <p className="text-gray-900 font-semibold">{station.machineStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Maintenance</label>
                <p className="text-gray-900">{station.lastMaintenance || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Next Maintenance Due</label>
                <p className="text-gray-900">{station.nextMaintenanceDue || 'Not scheduled'}</p>
              </div>
            </div>
            {station.maintenanceHoursRemaining !== undefined && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Hours until next maintenance</span>
                  </div>
                  <span className={`text-lg font-bold ${station.maintenanceHoursRemaining <= 24 ? 'text-red-600' : 'text-gray-900'}`}>
                    {station.maintenanceHoursRemaining}h
                  </span>
                </div>
                {station.maintenanceHoursRemaining <= 24 && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Maintenance due soon</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Production Summary Section */}
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Production Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Parts Produced Today</label>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{station.partsProducedToday}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Cycle Time</label>
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{station.currentCycleTime || 'N/A'}</p>
                </div>
                {station.currentCycleTime && <p className="text-xs text-gray-500 mt-1">seconds</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Average Cycle Time</label>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{station.averageCycleTime}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">seconds (Target: {station.targetCycleTime}s)</p>
              </div>
            </div>
          </div>

          {/* OEE Metrics Section */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">OEE Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Overall OEE</label>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-bold ${getOEEColor(station.oeeScore)}`}>
                    {station.oeeScore}%
                  </p>
                  {station.oeeScore >= 85 && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {station.oeeScore < 65 && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Availability</label>
                <p className="text-2xl font-bold text-gray-900">{station.availability}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Performance</label>
                <p className="text-2xl font-bold text-gray-900">{station.performance}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quality</label>
                <p className="text-2xl font-bold text-gray-900">{station.quality}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================
// WORK ORDER DETAIL MODAL COMPONENT
// =============================================

export function WorkOrderDetailModal({ isOpen, onClose, workOrder }: WorkOrderDetailModalProps) {
  if (!isOpen || !workOrder) return null

  const getStatusBadge = (status: string) => {
    const badges = {
      'not-started': 'bg-gray-100 text-gray-800 border border-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
      'completed': 'bg-green-100 text-green-800 border border-green-200',
      'on-hold': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'cancelled': 'bg-red-100 text-red-800 border border-red-200',
      'pending': 'bg-gray-100 text-gray-800 border border-gray-200',
      'blocked': 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[status as keyof typeof badges] || badges['not-started']
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return badges[priority as keyof typeof badges] || badges.medium
  }

  const getMaterialStatusBadge = (status: string) => {
    const badges = {
      available: 'bg-green-100 text-green-800 border border-green-200',
      partial: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      shortage: 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[status as keyof typeof badges] || badges.available
  }

  const getInspectionStatusBadge = (status: string) => {
    const badges = {
      'not-started': 'bg-gray-100 text-gray-800 border border-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 border border-blue-200',
      'passed': 'bg-green-100 text-green-800 border border-green-200',
      'failed': 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[status as keyof typeof badges] || badges['not-started']
  }

  const progressPercentage = (workOrder.completedQuantity / workOrder.quantity) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Work Order Details</h2>
              <p className="text-indigo-100 text-sm">Complete work order information and progress tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Work Order Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Work Order Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Work Order Number</label>
                <p className="text-gray-900 font-semibold text-lg">{workOrder.workOrderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Product Code</label>
                <p className="text-gray-900 font-semibold">{workOrder.productCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Product Name</label>
                <p className="text-gray-900">{workOrder.productName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quantity</label>
                <p className="text-gray-900 font-semibold">{workOrder.quantity} units</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(workOrder.status)}`}>
                  {workOrder.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(workOrder.priority)}`}>
                  {workOrder.priority.toUpperCase()}
                </span>
              </div>
              {workOrder.customer && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-gray-900">{workOrder.customer}</p>
                </div>
              )}
              {workOrder.salesOrder && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Sales Order</label>
                  <p className="text-gray-900">{workOrder.salesOrder}</p>
                </div>
              )}
            </div>
            {workOrder.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-sm font-medium text-gray-500 block mb-1">Notes</label>
                <p className="text-sm text-gray-700">{workOrder.notes}</p>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-500">Completion Status</label>
                <span className="text-sm font-semibold text-gray-900">
                  {workOrder.completedQuantity} / {workOrder.quantity} ({progressPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 10 && (
                    <span className="text-xs text-white font-semibold">{progressPercentage.toFixed(0)}%</span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="text-gray-900">{workOrder.startDate}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="text-gray-900">{workOrder.dueDate}</p>
                </div>
              </div>
              {workOrder.completionDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Completion Date</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-gray-900">{workOrder.completionDate}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Estimated Time</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <p className="text-gray-900">{workOrder.totalEstimatedTime}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Actual Time Spent</label>
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-blue-600" />
                  <p className="text-gray-900 font-semibold">{workOrder.actualTimeSpent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Operation Section */}
          {workOrder.currentOperation && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Operation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Operation</label>
                  <p className="text-gray-900 font-semibold">{workOrder.currentOperation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Station</label>
                  <p className="text-gray-900">{workOrder.currentStation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Operator</label>
                  <p className="text-gray-900">{workOrder.currentOperator || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(workOrder.currentOperationStatus || 'in-progress')}`}>
                    {workOrder.currentOperationStatus?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Operations List Section */}
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Operations List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Seq</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Operation</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Station</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Operator</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrder.operations.map((operation) => (
                    <tr key={operation.operationId} className="border-b border-purple-100 hover:bg-purple-100 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{operation.sequence}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{operation.operationName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(operation.status)}`}>
                          {operation.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{operation.station || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{operation.operator || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">
                        {operation.completedQty} / {operation.totalQty}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{operation.duration || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Material Status Section */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Material Status</h3>
            </div>
            <div className="space-y-3">
              {workOrder.materials.map((material, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{material.materialName}</p>
                      <p className="text-sm text-gray-500">{material.materialCode}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getMaterialStatusBadge(material.status)}`}>
                      {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="text-gray-500">Required</label>
                      <p className="text-gray-900 font-semibold">{material.requiredQty} {material.unit}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Available</label>
                      <p className="text-gray-900 font-semibold">{material.availableQty} {material.unit}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Shortage</label>
                      <p className={`font-semibold ${material.requiredQty > material.availableQty ? 'text-red-600' : 'text-green-600'}`}>
                        {material.requiredQty > material.availableQty ? material.requiredQty - material.availableQty : 0} {material.unit}
                      </p>
                    </div>
                    {material.location && (
                      <div>
                        <label className="text-gray-500">Location</label>
                        <p className="text-gray-900">{material.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Section */}
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quality Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Inspection Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getInspectionStatusBadge(workOrder.inspectionStatus)}`}>
                  {workOrder.inspectionStatus.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Defects Found</label>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold text-gray-900">{workOrder.defectsFound}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quality Rate</label>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-2xl font-bold ${workOrder.qualityRate >= 95 ? 'text-green-600' : workOrder.qualityRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {workOrder.qualityRate}%
                  </p>
                  {workOrder.qualityRate >= 95 && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {workOrder.qualityRate < 85 && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================
// ACTIVITY LOG DETAIL MODAL COMPONENT
// =============================================

export function ActivityLogDetailModal({ isOpen, onClose, log }: ActivityLogDetailModalProps) {
  if (!isOpen || !log) return null

  const getLogTypeBadge = (type: string) => {
    const badges = {
      production: 'bg-blue-100 text-blue-800 border border-blue-200',
      quality: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      downtime: 'bg-red-100 text-red-800 border border-red-200',
      material: 'bg-purple-100 text-purple-800 border border-purple-200',
      maintenance: 'bg-orange-100 text-orange-800 border border-orange-200',
      other: 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    return badges[type as keyof typeof badges] || badges.other
  }

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null
    const badges = {
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      critical: 'bg-red-100 text-red-800 border border-red-200'
    }
    return badges[severity as keyof typeof badges] || badges.info
  }

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'production':
        return <Package className="h-5 w-5" />
      case 'quality':
        return <CheckCircle className="h-5 w-5" />
      case 'downtime':
        return <AlertCircle className="h-5 w-5" />
      case 'material':
        return <Package className="h-5 w-5" />
      case 'maintenance':
        return <Wrench className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityIcon = (severity?: string) => {
    if (!severity) return null
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'critical':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Activity Log Details</h2>
              <p className="text-indigo-100 text-sm">Detailed information about this activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Log Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Log Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Timestamp</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <p className="text-gray-900 font-semibold">{log.timestamp}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Log Type</label>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getLogTypeBadge(log.logType)}`}>
                  {getLogTypeIcon(log.logType)}
                  <span className="capitalize">{log.logType}</span>
                </span>
              </div>
              {log.severity && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity</label>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadge(log.severity)}`}>
                    {getSeverityIcon(log.severity)}
                    <span className="capitalize">{log.severity}</span>
                  </span>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Log ID</label>
                <p className="text-gray-900 font-mono text-sm">{log.id}</p>
              </div>
              {log.createdBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <p className="text-gray-900">{log.createdBy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Details Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {log.workOrder && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Order</label>
                  <p className="text-gray-900 font-semibold">{log.workOrder}</p>
                </div>
              )}
              {log.operation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Operation</label>
                  <p className="text-gray-900">{log.operation}</p>
                </div>
              )}
              {log.station && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Station</label>
                  <p className="text-gray-900">{log.station}</p>
                </div>
              )}
              {log.operator && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Operator</label>
                  <p className="text-gray-900">{log.operator}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-gray-900">{log.description}</p>
              {log.details && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <label className="text-sm font-medium text-gray-500 block mb-1">Additional Details</label>
                  <p className="text-sm text-gray-700">{log.details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Taken Section */}
          {log.actionsTaken && log.actionsTaken.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Actions Taken</h3>
              </div>
              <ul className="space-y-2">
                {log.actionsTaken.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Data Section */}
          {log.relatedData && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Related Data</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {log.relatedData.quantity !== undefined && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                    <p className="text-lg font-semibold text-gray-900">{log.relatedData.quantity}</p>
                  </div>
                )}
                {log.relatedData.duration && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-yellow-600" />
                      <p className="text-lg font-semibold text-gray-900">{log.relatedData.duration}</p>
                    </div>
                  </div>
                )}
                {log.relatedData.defectType && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Defect Type</label>
                    <p className="text-lg font-semibold text-gray-900">{log.relatedData.defectType}</p>
                  </div>
                )}
                {log.relatedData.materialCode && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Material Code</label>
                    <p className="text-lg font-semibold text-gray-900">{log.relatedData.materialCode}</p>
                  </div>
                )}
                {log.relatedData.downtimeReason && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Downtime Reason</label>
                    <p className="text-lg font-semibold text-gray-900">{log.relatedData.downtimeReason}</p>
                  </div>
                )}
                {log.relatedData.resolution && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200 md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                    <p className="text-gray-900 mt-1">{log.relatedData.resolution}</p>
                  </div>
                )}
                {log.relatedData.resolvedBy && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Resolved By</label>
                    <p className="text-gray-900">{log.relatedData.resolvedBy}</p>
                  </div>
                )}
                {log.relatedData.resolvedAt && (
                  <div className="bg-white p-3 rounded-lg border border-yellow-200">
                    <label className="text-sm font-medium text-gray-500">Resolved At</label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <p className="text-gray-900">{log.relatedData.resolvedAt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Affected Metrics Section */}
          {log.affectedMetrics && log.affectedMetrics.length > 0 && (
            <div className="bg-red-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Affected Metrics</h3>
              </div>
              <div className="space-y-3">
                {log.affectedMetrics.map((metric, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                    <p className="font-semibold text-gray-900 mb-2">{metric.metric}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Previous Value</label>
                        <p className="text-sm text-gray-700">{metric.previousValue}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">New Value</label>
                        <p className="text-sm text-gray-900 font-semibold">{metric.newValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {log.attachments && log.attachments.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              </div>
              <div className="space-y-2">
                {log.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-indigo-200">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="text-gray-900 text-sm">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
