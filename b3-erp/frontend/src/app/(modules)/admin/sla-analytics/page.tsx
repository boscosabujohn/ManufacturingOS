'use client'

import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import {
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Users,
    Calendar,
    Download,
    Filter,
    RefreshCw,
} from 'lucide-react'

interface SLAMetrics {
    totalApprovals: number
    onTimeApprovals: number
    approachingApprovals: number
    breachedApprovals: number
    complianceRate: number
    avgApprovalTime: number
    avgResponseTime: number
}

interface WorkflowPerformance {
    workflowName: string
    totalCount: number
    onTime: number
    breached: number
    avgTime: number
    complianceRate: number
}

interface TrendData {
    date: string
    onTime: number
    approaching: number
    breached: number
    complianceRate: number
}

interface ApproverPerformance {
    approverName: string
    role: string
    totalTasks: number
    completedOnTime: number
    avgResponseTime: number
    complianceRate: number
}

const COLORS = {
    onTime: '#10b981',
    approaching: '#f59e0b',
    breached: '#ef4444',
    primary: '#3b82f6',
}

export default function SLAAnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
    const [isLoading, setIsLoading] = useState(true)
    const [metrics, setMetrics] = useState<SLAMetrics | null>(null)
    const [workflowPerformance, setWorkflowPerformance] = useState<WorkflowPerformance[]>([])
    const [trendData, setTrendData] = useState<TrendData[]>([])
    const [approverPerformance, setApproverPerformance] = useState<ApproverPerformance[]>([])

    useEffect(() => {
        fetchAnalytics()
    }, [timeRange])

    const fetchAnalytics = async () => {
        setIsLoading(true)
        // TODO: Replace with actual API calls
        setTimeout(() => {
            // Mock data
            setMetrics({
                totalApprovals: 1247,
                onTimeApprovals: 1165,
                approachingApprovals: 47,
                breachedApprovals: 35,
                complianceRate: 93.4,
                avgApprovalTime: 18.5,
                avgResponseTime: 4.2,
            })

            setWorkflowPerformance([
                { workflowName: 'Purchase Order', totalCount: 245, onTime: 231, breached: 14, avgTime: 22.3, complianceRate: 94.3 },
                { workflowName: 'Quote Approval', totalCount: 156, onTime: 142, breached: 14, avgTime: 28.7, complianceRate: 91.0 },
                { workflowName: 'Design Approval', totalCount: 134, onTime: 128, breached: 6, avgTime: 45.2, complianceRate: 95.5 },
                { workflowName: 'BOM Approval', totalCount: 189, onTime: 185, breached: 4, avgTime: 16.8, complianceRate: 97.9 },
                { workflowName: 'NCR Approval', totalCount: 89, onTime: 78, breached: 11, avgTime: 8.5, complianceRate: 87.6 },
                { workflowName: 'Work Order', totalCount: 278, onTime: 272, breached: 6, avgTime: 12.3, complianceRate: 97.8 },
                { workflowName: 'Shipment Auth', totalCount: 198, onTime: 191, breached: 7, avgTime: 15.4, complianceRate: 96.5 },
            ])

            setTrendData([
                { date: 'Week 1', onTime: 285, approaching: 12, breached: 8, complianceRate: 94.7 },
                { date: 'Week 2', onTime: 292, approaching: 10, breached: 6, complianceRate: 95.1 },
                { date: 'Week 3', onTime: 278, approaching: 15, breached: 9, complianceRate: 92.1 },
                { date: 'Week 4', onTime: 310, approaching: 10, breached: 12, complianceRate: 93.4 },
            ])

            setApproverPerformance([
                { approverName: 'John Doe', role: 'Finance Manager', totalTasks: 78, completedOnTime: 74, avgResponseTime: 3.2, complianceRate: 94.9 },
                { approverName: 'Jane Smith', role: 'Production Manager', totalTasks: 92, completedOnTime: 89, avgResponseTime: 2.8, complianceRate: 96.7 },
                { approverName: 'Bob Johnson', role: 'Quality Head', totalTasks: 56, completedOnTime: 51, avgResponseTime: 5.1, complianceRate: 91.1 },
                { approverName: 'Alice Williams', role: 'CFO', totalTasks: 34, completedOnTime: 33, avgResponseTime: 4.5, complianceRate: 97.1 },
                { approverName: 'Tom Brown', role: 'Procurement Head', totalTasks: 67, completedOnTime: 61, avgResponseTime: 6.2, complianceRate: 91.0 },
            ])

            setIsLoading(false)
        }, 800)
    }

    const pieData = metrics
        ? [
            { name: 'On Time', value: metrics.onTimeApprovals, color: COLORS.onTime },
            { name: 'Approaching', value: metrics.approachingApprovals, color: COLORS.approaching },
            { name: 'Breached', value: metrics.breachedApprovals, color: COLORS.breached },
        ]
        : []

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">SLA Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-1">Performance metrics and compliance tracking</p>
                </div>
                <div className="flex gap-3">
                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={fetchAnalytics}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overall Compliance */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">SLA Compliance</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.complianceRate}%</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                +2.3% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* On Time */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">On Time</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.onTimeApprovals}</p>
                            <p className="text-sm text-gray-500 mt-1">of {metrics?.totalApprovals} total</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Approaching */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Approaching SLA</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.approachingApprovals}</p>
                            <p className="text-sm text-yellow-600 mt-1">Need attention</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Breached */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Breached</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.breachedApprovals}</p>
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                <TrendingDown className="h-4 w-4" />
                                -1.2% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Average Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Average Approval Time</h3>
                        <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-4xl font-bold text-blue-600">{metrics?.avgApprovalTime}h</p>
                    <p className="text-sm text-gray-500 mt-2">From submission to completion</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Average Response Time</h3>
                        <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-4xl font-bold text-blue-600">{metrics?.avgResponseTime}h</p>
                    <p className="text-sm text-gray-500 mt-2">Per approver action</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Trend Line Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Compliance Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="right" type="monotone" dataKey="complianceRate" stroke="#3b82f6" strokeWidth={2} name="Compliance %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Workflow Performance Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Workflow Performance</h3>
                    <p className="text-sm text-gray-500 mt-1">Performance metrics by workflow type</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workflow
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    On Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Breached
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Time (h)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Compliance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {workflowPerformance.map((workflow, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {workflow.workflowName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {workflow.totalCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        {workflow.onTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                        {workflow.breached}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {workflow.avgTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={`${workflow.complianceRate >= 95 ? 'text-green-600' :
                                                workflow.complianceRate >= 90 ? 'text-yellow-600' :
                                                    'text-red-600'
                                            }`}>
                                            {workflow.complianceRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${workflow.complianceRate >= 95 ? 'bg-green-500' :
                                                        workflow.complianceRate >= 90 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                    }`}
                                                style={{ width: `${workflow.complianceRate}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approver Performance */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Approver Performance</h3>
                    <p className="text-sm text-gray-500 mt-1">Individual approver metrics</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Approver
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Tasks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    On Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Response (h)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Compliance
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {approverPerformance.map((approver, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">
                                                    {approver.approverName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{approver.approverName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {approver.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {approver.totalTasks}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        {approver.completedOnTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {approver.avgResponseTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${approver.complianceRate >= 95 ? 'bg-green-100 text-green-800' :
                                                approver.complianceRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {approver.complianceRate}%
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
