'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Wrench,
  Activity,
  Award
} from 'lucide-react'

interface LaborRate {
  id: string
  skillCode: string
  skillName: string
  department: string
  category: 'direct' | 'indirect' | 'supervision'
  standardRate: number
  actualRate: number
  overtimeRate: number
  variance: number
  variancePercent: number
  headcount: number
  avgHoursPerMonth: number
  efficiency: number
  utilization: number
  status: 'optimal' | 'over-budget' | 'under-utilized'
}

interface DepartmentStats {
  department: string
  totalWorkers: number
  avgRate: number
  totalCost: number
  efficiency: number
  utilization: number
}

export default function LaborCostingPage() {
  const router = useRouter()

  const [laborRates] = useState<LaborRate[]>([
    {
      id: 'LAB-001',
      skillCode: 'WELD-SS',
      skillName: 'Stainless Steel Welder',
      department: 'Sink Manufacturing',
      category: 'direct',
      standardRate: 450,
      actualRate: 485,
      overtimeRate: 727.5,
      variance: 35,
      variancePercent: 7.8,
      headcount: 12,
      avgHoursPerMonth: 208,
      efficiency: 92,
      utilization: 88,
      status: 'over-budget'
    },
    {
      id: 'LAB-002',
      skillCode: 'MACH-CNC',
      skillName: 'CNC Machine Operator',
      department: 'Faucet Manufacturing',
      category: 'direct',
      standardRate: 520,
      actualRate: 515,
      overtimeRate: 772.5,
      variance: -5,
      variancePercent: -0.96,
      headcount: 8,
      avgHoursPerMonth: 208,
      efficiency: 95,
      utilization: 92,
      status: 'optimal'
    },
    {
      id: 'LAB-003',
      skillCode: 'POLISH-CHR',
      skillName: 'Chrome Polishing Specialist',
      department: 'Finishing',
      category: 'direct',
      standardRate: 380,
      actualRate: 380,
      overtimeRate: 570,
      variance: 0,
      variancePercent: 0,
      headcount: 6,
      avgHoursPerMonth: 208,
      efficiency: 88,
      utilization: 85,
      status: 'optimal'
    },
    {
      id: 'LAB-004',
      skillCode: 'ASSY-FAUCET',
      skillName: 'Faucet Assembly Technician',
      department: 'Faucet Manufacturing',
      category: 'direct',
      standardRate: 340,
      actualRate: 365,
      overtimeRate: 547.5,
      variance: 25,
      variancePercent: 7.4,
      headcount: 15,
      avgHoursPerMonth: 208,
      efficiency: 90,
      utilization: 94,
      status: 'over-budget'
    },
    {
      id: 'LAB-005',
      skillCode: 'CAST-ALUM',
      skillName: 'Aluminum Casting Operator',
      department: 'Cookware Manufacturing',
      category: 'direct',
      standardRate: 420,
      actualRate: 410,
      overtimeRate: 615,
      variance: -10,
      variancePercent: -2.4,
      headcount: 10,
      avgHoursPerMonth: 208,
      efficiency: 94,
      utilization: 90,
      status: 'optimal'
    },
    {
      id: 'LAB-006',
      skillCode: 'QC-INSP',
      skillName: 'Quality Control Inspector',
      department: 'Quality Assurance',
      category: 'indirect',
      standardRate: 480,
      actualRate: 490,
      overtimeRate: 735,
      variance: 10,
      variancePercent: 2.1,
      headcount: 8,
      avgHoursPerMonth: 208,
      efficiency: 96,
      utilization: 87,
      status: 'optimal'
    },
    {
      id: 'LAB-007',
      skillCode: 'CARP-CAB',
      skillName: 'Cabinet Carpenter',
      department: 'Cabinet Manufacturing',
      category: 'direct',
      standardRate: 460,
      actualRate: 475,
      overtimeRate: 712.5,
      variance: 15,
      variancePercent: 3.3,
      headcount: 9,
      avgHoursPerMonth: 208,
      efficiency: 89,
      utilization: 91,
      status: 'optimal'
    },
    {
      id: 'LAB-008',
      skillCode: 'STONE-CUT',
      skillName: 'Stone Cutting Specialist',
      department: 'Countertop Manufacturing',
      category: 'direct',
      standardRate: 550,
      actualRate: 580,
      overtimeRate: 870,
      variance: 30,
      variancePercent: 5.5,
      headcount: 5,
      avgHoursPerMonth: 208,
      efficiency: 93,
      utilization: 89,
      status: 'over-budget'
    },
    {
      id: 'LAB-009',
      skillCode: 'PAINT-IND',
      skillName: 'Industrial Painter',
      department: 'Finishing',
      category: 'direct',
      standardRate: 360,
      actualRate: 355,
      overtimeRate: 532.5,
      variance: -5,
      variancePercent: -1.4,
      headcount: 7,
      avgHoursPerMonth: 208,
      efficiency: 87,
      utilization: 82,
      status: 'under-utilized'
    },
    {
      id: 'LAB-010',
      skillCode: 'MAINT-MECH',
      skillName: 'Maintenance Mechanic',
      department: 'Maintenance',
      category: 'indirect',
      standardRate: 500,
      actualRate: 510,
      overtimeRate: 765,
      variance: 10,
      variancePercent: 2.0,
      headcount: 6,
      avgHoursPerMonth: 208,
      efficiency: 91,
      utilization: 75,
      status: 'optimal'
    },
    {
      id: 'LAB-011',
      skillCode: 'SUPV-PROD',
      skillName: 'Production Supervisor',
      department: 'Production',
      category: 'supervision',
      standardRate: 680,
      actualRate: 695,
      overtimeRate: 1042.5,
      variance: 15,
      variancePercent: 2.2,
      headcount: 4,
      avgHoursPerMonth: 208,
      efficiency: 98,
      utilization: 95,
      status: 'optimal'
    },
    {
      id: 'LAB-012',
      skillCode: 'PACK-SHIP',
      skillName: 'Packing & Shipping Staff',
      department: 'Logistics',
      category: 'indirect',
      standardRate: 280,
      actualRate: 285,
      overtimeRate: 427.5,
      variance: 5,
      variancePercent: 1.8,
      headcount: 10,
      avgHoursPerMonth: 208,
      efficiency: 85,
      utilization: 90,
      status: 'optimal'
    }
  ])

  const [departmentStats] = useState<DepartmentStats[]>([
    { department: 'Sink Manufacturing', totalWorkers: 18, avgRate: 442, totalCost: 1654560, efficiency: 91, utilization: 88 },
    { department: 'Faucet Manufacturing', totalWorkers: 23, avgRate: 438, totalCost: 2095344, efficiency: 93, utilization: 93 },
    { department: 'Cookware Manufacturing', totalWorkers: 15, avgRate: 405, totalCost: 1263600, efficiency: 92, utilization: 89 },
    { department: 'Cabinet Manufacturing', totalWorkers: 12, avgRate: 468, totalCost: 1166976, efficiency: 89, utilization: 90 },
    { department: 'Countertop Manufacturing', totalWorkers: 8, avgRate: 565, totalCost: 939520, efficiency: 94, utilization: 91 },
    { department: 'Finishing', totalWorkers: 13, avgRate: 370, totalCost: 1000880, efficiency: 87, utilization: 84 },
    { department: 'Quality Assurance', totalWorkers: 8, avgRate: 490, totalCost: 815680, efficiency: 96, utilization: 87 }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'over-budget':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'under-utilized':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'direct':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'indirect':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'supervision':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-red-600'
    if (variance > 0) return 'text-orange-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const totalWorkers = laborRates.reduce((sum, l) => sum + l.headcount, 0)
  const avgEfficiency = laborRates.reduce((sum, l) => sum + l.efficiency, 0) / laborRates.length
  const avgUtilization = laborRates.reduce((sum, l) => sum + l.utilization, 0) / laborRates.length
  const overBudgetCount = laborRates.filter(l => l.status === 'over-budget').length

  const totalMonthlyCost = laborRates.reduce((sum, l) => sum + (l.actualRate * l.headcount * l.avgHoursPerMonth), 0)

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Labor Costing</h1>
            <p className="text-sm text-gray-600 mt-1">Track labor rates and workforce productivity</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Workers</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalWorkers}</p>
              <p className="text-xs text-blue-700 mt-1">Active workforce</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalMonthlyCost / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-green-700 mt-1">Total labor cost</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgEfficiency.toFixed(1)}%</p>
              <p className="text-xs text-purple-700 mt-1">Production efficiency</p>
            </div>
            <Award className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Utilization</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{avgUtilization.toFixed(1)}%</p>
              <p className="text-xs text-orange-700 mt-1">Workforce utilization</p>
            </div>
            <Activity className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Over Budget</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{overBudgetCount}</p>
              <p className="text-xs text-red-700 mt-1">Skills over-budget</p>
            </div>
            <TrendingUp className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Department Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Department Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{dept.department}</p>
                    <p className="text-xs text-gray-600 mt-1">{dept.totalWorkers} workers</p>
                  </div>
                  <Wrench className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Rate:</span>
                    <span className="font-semibold text-gray-900">₹{dept.avgRate}/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Monthly Cost:</span>
                    <span className="font-semibold text-gray-900">₹{(dept.totalCost / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-semibold text-green-600">{dept.efficiency}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Utilization:</span>
                    <span className="font-semibold text-blue-600">{dept.utilization}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Labor Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Labor Rate Details</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Standard Rate</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actual Rate</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Headcount</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {laborRates.map((labor) => (
                <tr key={labor.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{labor.skillName}</p>
                      <p className="text-xs text-gray-600 mt-1">{labor.skillCode}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm text-gray-900">{labor.department}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(labor.category)}`}>
                      {labor.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">₹{labor.standardRate}/hr</p>
                    <p className="text-xs text-gray-600">OT: ₹{labor.overtimeRate}/hr</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">₹{labor.actualRate}/hr</p>
                    <p className="text-xs text-gray-600">{labor.avgHoursPerMonth} hrs/month</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className={`text-sm font-semibold ${getVarianceColor(labor.variancePercent)}`}>
                      {labor.variancePercent > 0 ? '+' : ''}{labor.variancePercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">₹{labor.variance > 0 ? '+' : ''}{labor.variance}/hr</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{labor.headcount}</p>
                    <p className="text-xs text-gray-600">workers</p>
                  </td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Eff:</span>
                        <span className="font-semibold text-green-600">{labor.efficiency}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Util:</span>
                        <span className="font-semibold text-blue-600">{labor.utilization}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(labor.status)}`}>
                      {labor.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
