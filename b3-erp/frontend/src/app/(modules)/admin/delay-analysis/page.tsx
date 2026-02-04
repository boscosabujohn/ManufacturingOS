'use client'

import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import {
    Clock,
    AlertTriangle,
    TrendingUp,
    Download,
    Filter,
    RefreshCw,
    ChevronRight,
} from 'lucide-react'
import { WorkflowService, WorkflowStatistics } from '@/services/workflow.service'

interface DelayAnalysis {
    workflowName: string
    phase: string
    avgDelay: number
    maxDelay: number
    delayCount: number
    commonReasons: string[]
}

export default function DelayAnalysisPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [delayData, setDelayData] = useState<DelayAnalysis[]>([])
    const [selectedPhase, setSelectedPhase] = useState<string>('all')

    useEffect(() => {
        fetchDelayAnalysis()
    }, [timeRange, selectedPhase])

    const fetchDelayAnalysis = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Fetch workflow statistics to get baseline data
            const statistics = await WorkflowService.getWorkflowStatistics()

            // Calculate delay metrics based on statistics
            // In a real implementation, this would come from a dedicated delay analytics API
            const delayAnalysisData: DelayAnalysis[] = [
                {
                    workflowName: 'Quote Approval',
                    phase: 'Sales',
                    avgDelay: 12.5,
                    maxDelay: 48.2,
                    delayCount: Math.floor(statistics.pendingInstances * 0.1),
                    commonReasons: ['Approver unavailable', 'Missing pricing data', 'Complex quote'],
                },
                {
                    workflowName: 'Purchase Order Approval',
                    phase: 'Procurement',
                    avgDelay: 8.3,
                    maxDelay: 36.5,
                    delayCount: Math.floor(statistics.pendingInstances * 0.08),
                    commonReasons: ['Budget review needed', 'Vendor verification', 'High workload'],
                },
                {
                    workflowName: 'Design Approval',
                    phase: 'Design',
                    avgDelay: 18.7,
                    maxDelay: 72.0,
                    delayCount: Math.floor(statistics.pendingInstances * 0.07),
                    commonReasons: ['Design revisions', 'Engineering review', 'Customer feedback'],
                },
                {
                    workflowName: 'NCR Approval',
                    phase: 'Quality',
                    avgDelay: 6.2,
                    maxDelay: 24.5,
                    delayCount: Math.floor(statistics.pendingInstances * 0.06),
                    commonReasons: ['Investigation required', 'Root cause analysis', 'Manager unavailable'],
                },
                {
                    workflowName: 'Work Order Release',
                    phase: 'Production',
                    avgDelay: 4.5,
                    maxDelay: 18.0,
                    delayCount: Math.floor(statistics.pendingInstances * 0.04),
                    commonReasons: ['Material shortage', 'Machine breakdown', 'Priority changes'],
                },
                {
                    workflowName: 'BOM Approval',
                    phase: 'BOM',
                    avgDelay: 7.8,
                    maxDelay: 28.3,
                    delayCount: Math.floor(statistics.pendingInstances * 0.03),
                    commonReasons: ['Engineering changes', 'Cost validation', 'Supplier issues'],
                },
                {
                    workflowName: 'Shipment Authorization',
                    phase: 'Logistics',
                    avgDelay: 5.1,
                    maxDelay: 20.0,
                    delayCount: Math.floor(statistics.pendingInstances * 0.025),
                    commonReasons: ['Payment issues', 'Documentation incomplete', 'Transport unavailable'],
                },
            ]
            setDelayData(delayAnalysisData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load delay analysis')
            console.error('Error fetching delay analysis:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredData =
        selectedPhase === 'all'
            ? delayData
            : delayData.filter((d) => d.phase === selectedPhase)

    const totalDelays = delayData.reduce((sum, d) => sum + d.delayCount, 0)
    const avgDelayAcrossAll =
        delayData.length > 0
            ? delayData.reduce((sum, d) => sum + d.avgDelay, 0) / delayData.length
            : 0
    const maxDelayAcrossAll = Math.max(...delayData.map((d) => d.maxDelay), 0)

    const chartData = filteredData.map((d) => ({
        name: d.workflowName,
        avgDelay: d.avgDelay,
        maxDelay: d.maxDelay,
        count: d.delayCount,
    }))

    const phases = ['all', ...Array.from(new Set(delayData.map((d) => d.phase)))]

    return (
        <div className="p-6 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delay Analysis</h1>
                    <p className="text-gray-500 mt-1">Identify bottlenecks and common delay patterns</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={fetchDelayAnalysis}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Delayed Approvals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalDelays}</p>
                            <p className="text-sm text-gray-500 mt-1">Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Average Delay Time</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {avgDelayAcrossAll.toFixed(1)}h
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Across all workflows</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Maximum Delay</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {maxDelayAcrossAll.toFixed(1)}h
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Longest delay recorded</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <TrendingUp className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Filter */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Filter by Phase:</span>
                    {phases.map((phase) => (
                        <button
                            key={phase}
                            onClick={() => setSelectedPhase(phase)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPhase === phase
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {phase === 'all' ? 'All Phases' : phase}
                        </button>
                    ))}
                </div>
            </div>

            {/* Delay Chart */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delay Comparison by Workflow
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgDelay" fill="#f59e0b" name="Avg Delay (h)" />
                        <Bar dataKey="maxDelay" fill="#ef4444" name="Max Delay (h)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Delay Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Delay Details & Root Causes</h3>
                    <p className="text-sm text-gray-500 mt-1">Detailed breakdown with common reasons</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workflow
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phase
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Delay Count
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Delay (h)
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Max Delay (h)
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Common Reasons
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((delay, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{delay.workflowName}</div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            {delay.phase}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold text-red-600">
                                                {delay.delayCount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{delay.avgDelay.toFixed(1)}</span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className="text-sm font-medium text-red-600">
                                            {delay.maxDelay.toFixed(1)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {delay.commonReasons.map((reason, idx) => (
                                                <div key={idx} className="flex items-start gap-1">
                                                    <span className="text-gray-400">•</span>
                                                    <span>{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    Recommendations to Reduce Delays
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Automate Reminders</h4>
                        <p className="text-sm text-gray-600">
                            Set up automatic email reminders 2 hours before SLA deadline to reduce "Approver unavailable" delays.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Delegate Authority</h4>
                        <p className="text-sm text-gray-600">
                            Allow backup approvers for high-workload periods to prevent bottlenecks.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Pre-Fill Data</h4>
                        <p className="text-sm text-gray-600">
                            Implement data validation at submission to reduce "Missing information" delays.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Parallel Approvals</h4>
                        <p className="text-sm text-gray-600">
                            Enable parallel approvals for non-dependent levels to reduce total cycle time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
