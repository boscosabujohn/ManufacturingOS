'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Edit2, Play, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface ProductionSchedule {
  id: string
  schedule_id: string
  work_order_id: string
  product_name: string
  product_code: string
  work_center: string
  planned_start: string
  planned_end: string
  actual_start: string | null
  actual_end: string | null
  quantity: number
  unit: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string
}

const mockSchedules: ProductionSchedule[] = [
  {
    id: '1',
    schedule_id: 'SCH-2024-001',
    work_order_id: 'WO-2024-045',
    product_name: 'Steel Frame Assembly',
    product_code: 'SFA-5000',
    work_center: 'Assembly Line 1',
    planned_start: '2024-01-15 08:00',
    planned_end: '2024-01-15 16:00',
    actual_start: '2024-01-15 08:15',
    actual_end: null,
    quantity: 150,
    unit: 'units',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'John Smith'
  },
  {
    id: '2',
    schedule_id: 'SCH-2024-002',
    work_order_id: 'WO-2024-046',
    product_name: 'Precision Gear Box',
    product_code: 'PGB-3200',
    work_center: 'Machining Center',
    planned_start: '2024-01-15 09:00',
    planned_end: '2024-01-15 17:00',
    actual_start: null,
    actual_end: null,
    quantity: 80,
    unit: 'units',
    status: 'scheduled',
    priority: 'medium',
    assigned_to: 'Mike Johnson'
  },
  {
    id: '3',
    schedule_id: 'SCH-2024-003',
    work_order_id: 'WO-2024-047',
    product_name: 'Hydraulic Cylinder',
    product_code: 'HC-1800',
    work_center: 'Welding Shop',
    planned_start: '2024-01-15 07:00',
    planned_end: '2024-01-15 15:00',
    actual_start: '2024-01-15 07:00',
    actual_end: '2024-01-15 14:45',
    quantity: 200,
    unit: 'units',
    status: 'completed',
    priority: 'high',
    assigned_to: 'Sarah Williams'
  },
  {
    id: '4',
    schedule_id: 'SCH-2024-004',
    work_order_id: 'WO-2024-048',
    product_name: 'Electric Motor Housing',
    product_code: 'EMH-2400',
    work_center: 'Paint Shop',
    planned_start: '2024-01-15 10:00',
    planned_end: '2024-01-15 14:00',
    actual_start: '2024-01-15 10:30',
    actual_end: null,
    quantity: 120,
    unit: 'units',
    status: 'delayed',
    priority: 'urgent',
    assigned_to: 'David Brown'
  },
  {
    id: '5',
    schedule_id: 'SCH-2024-005',
    work_order_id: 'WO-2024-049',
    product_name: 'Conveyor Belt System',
    product_code: 'CBS-7500',
    work_center: 'Assembly Line 2',
    planned_start: '2024-01-15 13:00',
    planned_end: '2024-01-15 21:00',
    actual_start: null,
    actual_end: null,
    quantity: 50,
    unit: 'units',
    status: 'on_hold',
    priority: 'low',
    assigned_to: 'Emily Davis'
  },
  {
    id: '6',
    schedule_id: 'SCH-2024-006',
    work_order_id: 'WO-2024-050',
    product_name: 'Quality Control Jig',
    product_code: 'QCJ-1100',
    work_center: 'Quality Station',
    planned_start: '2024-01-15 11:00',
    planned_end: '2024-01-15 15:00',
    actual_start: null,
    actual_end: null,
    quantity: 30,
    unit: 'units',
    status: 'scheduled',
    priority: 'medium',
    assigned_to: 'Robert Wilson'
  }
]

const ProductionSchedulingPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [workCenterFilter, setWorkCenterFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'on_hold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredSchedules = mockSchedules.filter(schedule => {
    const matchesSearch =
      schedule.schedule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.work_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.product_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter
    const matchesWorkCenter = workCenterFilter === 'all' || schedule.work_center === workCenterFilter

    return matchesSearch && matchesStatus && matchesWorkCenter
  })

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSchedules = filteredSchedules.slice(startIndex, startIndex + itemsPerPage)

  const scheduledToday = mockSchedules.filter(s => s.status === 'scheduled').length
  const inProgress = mockSchedules.filter(s => s.status === 'in_progress').length
  const completed = mockSchedules.filter(s => s.status === 'completed').length
  const delayed = mockSchedules.filter(s => s.status === 'delayed').length

  const handleExport = () => {
    console.log('Exporting production schedule report...')
  }

  const handleView = (id: string) => {
    console.log('View schedule:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit schedule:', id)
  }

  const handleStart = (id: string) => {
    console.log('Start production:', id)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Scheduling</h1>
        <p className="text-gray-600">Manage and monitor production schedules across all work centers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Scheduled Today</p>
              <h3 className="text-3xl font-bold mt-2">{scheduledToday}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-blue-100">Ready to start</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <h3 className="text-3xl font-bold mt-2">{inProgress}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-100">Currently running</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <h3 className="text-3xl font-bold mt-2">{completed}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-100">Finished today</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm font-medium">Delayed</p>
              <h3 className="text-3xl font-bold mt-2">{delayed}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-100">Behind schedule</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Schedule ID, Work Order, Product..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={workCenterFilter}
                    onChange={(e) => setWorkCenterFilter(e.target.value)}
                  >
                    <option value="all">All Work Centers</option>
                    <option value="Assembly Line 1">Assembly Line 1</option>
                    <option value="Assembly Line 2">Assembly Line 2</option>
                    <option value="Machining Center">Machining Center</option>
                    <option value="Welding Shop">Welding Shop</option>
                    <option value="Paint Shop">Paint Shop</option>
                    <option value="Quality Station">Quality Station</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Center
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned End
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual End
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.schedule_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.work_order_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{schedule.product_name}</div>
                    <div className="text-sm text-gray-500">{schedule.product_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.work_center}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.planned_start}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.planned_end}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.actual_start || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.actual_end || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.quantity} {schedule.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(schedule.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(schedule.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {schedule.status === 'scheduled' && (
                        <button
                          onClick={() => handleStart(schedule.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Start"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredSchedules.length)}
              </span>{' '}
              of <span className="font-medium">{filteredSchedules.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionSchedulingPage
