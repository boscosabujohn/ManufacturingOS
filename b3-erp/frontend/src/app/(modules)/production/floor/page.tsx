'use client'

import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Edit2, Pause, Users, Activity, Package, TrendingUp } from 'lucide-react'

interface FloorActivity {
  id: string
  activity_id: string
  work_center: string
  operator_name: string
  employee_id: string
  work_order_id: string
  product_name: string
  product_code: string
  operation: string
  start_time: string
  duration_minutes: number
  output_qty: number
  target_qty: number
  efficiency_percent: number
  status: 'active' | 'paused' | 'completed'
  shift: 'Morning' | 'Afternoon' | 'Night'
}

const mockActivities: FloorActivity[] = [
  {
    id: '1',
    activity_id: 'FA-2024-001',
    work_center: 'Assembly Line 1',
    operator_name: 'John Smith',
    employee_id: 'EMP-001',
    work_order_id: 'WO-2024-045',
    product_name: 'Steel Frame Assembly',
    product_code: 'SFA-5000',
    operation: 'Frame Welding',
    start_time: '2024-01-15 08:15',
    duration_minutes: 180,
    output_qty: 140,
    target_qty: 150,
    efficiency_percent: 93.3,
    status: 'active',
    shift: 'Morning'
  },
  {
    id: '2',
    activity_id: 'FA-2024-002',
    work_center: 'Machining Center',
    operator_name: 'Mike Johnson',
    employee_id: 'EMP-002',
    work_order_id: 'WO-2024-046',
    product_name: 'Precision Gear Box',
    product_code: 'PGB-3200',
    operation: 'CNC Machining',
    start_time: '2024-01-15 09:00',
    duration_minutes: 150,
    output_qty: 55,
    target_qty: 80,
    efficiency_percent: 68.8,
    status: 'paused',
    shift: 'Morning'
  },
  {
    id: '3',
    activity_id: 'FA-2024-003',
    work_center: 'Welding Shop',
    operator_name: 'Sarah Williams',
    employee_id: 'EMP-003',
    work_order_id: 'WO-2024-047',
    product_name: 'Hydraulic Cylinder',
    product_code: 'HC-1800',
    operation: 'TIG Welding',
    start_time: '2024-01-15 07:00',
    duration_minutes: 465,
    output_qty: 200,
    target_qty: 200,
    efficiency_percent: 100.0,
    status: 'completed',
    shift: 'Morning'
  },
  {
    id: '4',
    activity_id: 'FA-2024-004',
    work_center: 'Paint Shop',
    operator_name: 'David Brown',
    employee_id: 'EMP-004',
    work_order_id: 'WO-2024-048',
    product_name: 'Electric Motor Housing',
    product_code: 'EMH-2400',
    operation: 'Powder Coating',
    start_time: '2024-01-15 14:30',
    duration_minutes: 120,
    output_qty: 75,
    target_qty: 120,
    efficiency_percent: 62.5,
    status: 'active',
    shift: 'Afternoon'
  },
  {
    id: '5',
    activity_id: 'FA-2024-005',
    work_center: 'Assembly Line 2',
    operator_name: 'Emily Davis',
    employee_id: 'EMP-005',
    work_order_id: 'WO-2024-049',
    product_name: 'Conveyor Belt System',
    product_code: 'CBS-7500',
    operation: 'Final Assembly',
    start_time: '2024-01-15 14:00',
    duration_minutes: 90,
    output_qty: 38,
    target_qty: 50,
    efficiency_percent: 76.0,
    status: 'active',
    shift: 'Afternoon'
  },
  {
    id: '6',
    activity_id: 'FA-2024-006',
    work_center: 'Quality Station',
    operator_name: 'Robert Wilson',
    employee_id: 'EMP-006',
    work_order_id: 'WO-2024-050',
    product_name: 'Quality Control Jig',
    product_code: 'QCJ-1100',
    operation: 'Precision Inspection',
    start_time: '2024-01-15 15:00',
    duration_minutes: 60,
    output_qty: 28,
    target_qty: 30,
    efficiency_percent: 93.3,
    status: 'active',
    shift: 'Afternoon'
  }
]

const ProductionFloorPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [workCenterFilter, setWorkCenterFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600 font-semibold'
    if (efficiency >= 70) return 'text-yellow-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  const getEfficiencyBgColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-100'
    if (efficiency >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch =
      activity.activity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.work_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.operator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.operation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesWorkCenter = workCenterFilter === 'all' || activity.work_center === workCenterFilter
    const matchesShift = shiftFilter === 'all' || activity.shift === shiftFilter

    return matchesSearch && matchesWorkCenter && matchesShift
  })

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage)

  const activeWorkCenters = new Set(mockActivities.filter(a => a.status === 'active').map(a => a.work_center)).size
  const workersPresent = new Set(mockActivities.map(a => a.employee_id)).size
  const currentOutput = mockActivities.filter(a => a.status === 'active').reduce((sum, a) => sum + a.output_qty, 0)
  const totalTarget = mockActivities.filter(a => a.status === 'active').reduce((sum, a) => sum + a.target_qty, 0)
  const overallEfficiency = totalTarget > 0 ? ((currentOutput / totalTarget) * 100).toFixed(1) : '0.0'

  const handleExport = () => {
    console.log('Exporting production floor report...')
  }

  const handleView = (id: string) => {
    console.log('View floor activity:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit floor activity:', id)
  }

  const handlePause = (id: string) => {
    console.log('Pause floor activity:', id)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Floor</h1>
        <p className="text-gray-600">Real-time monitoring of production floor activities and worker performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Work Centers</p>
              <h3 className="text-3xl font-bold mt-2">{activeWorkCenters}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-purple-100">Currently operating</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Workers Present</p>
              <h3 className="text-3xl font-bold mt-2">{workersPresent}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-blue-100">On shift today</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Current Output</p>
              <h3 className="text-3xl font-bold mt-2">{currentOutput}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-100">Units produced</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm font-medium">Efficiency</p>
              <h3 className="text-3xl font-bold mt-2">{overallEfficiency}%</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-orange-100">Overall performance</span>
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
                  placeholder="Search by Activity ID, Work Order, Product, Operator..."
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

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={shiftFilter}
                    onChange={(e) => setShiftFilter(e.target.value)}
                  >
                    <option value="all">All Shifts</option>
                    <option value="Morning">Morning (6AM-2PM)</option>
                    <option value="Afternoon">Afternoon (2PM-10PM)</option>
                    <option value="Night">Night (10PM-6AM)</option>
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
                  Activity ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Center
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Output/Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency %
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
              {paginatedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{activity.activity_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.work_center}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{activity.operator_name}</div>
                    <div className="text-sm text-gray-500">{activity.employee_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.work_order_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{activity.product_name}</div>
                    <div className="text-sm text-gray-500">{activity.product_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.operation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.start_time}</div>
                    <div className="text-sm text-gray-500">{activity.shift}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDuration(activity.duration_minutes)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {activity.output_qty} / {activity.target_qty}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`px-2 py-1 rounded-full text-sm ${getEfficiencyBgColor(activity.efficiency_percent)}`}>
                      <span className={getEfficiencyColor(activity.efficiency_percent)}>
                        {activity.efficiency_percent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(activity.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(activity.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {activity.status === 'active' && (
                        <button
                          onClick={() => handlePause(activity.id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Pause"
                        >
                          <Pause className="w-5 h-5" />
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
                {Math.min(startIndex + itemsPerPage, filteredActivities.length)}
              </span>{' '}
              of <span className="font-medium">{filteredActivities.length}</span> results
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

export default ProductionFloorPage
