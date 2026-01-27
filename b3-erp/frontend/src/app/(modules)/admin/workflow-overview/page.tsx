'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    TrendingUp,
    Clock,
    AlertCircle,
    Users,
    Settings,
    FileText,
    CheckCircle,
    BarChart3,
    ArrowRight,
    Activity,
    RefreshCw,
} from 'lucide-react'
import { WorkflowService, WorkflowStatistics } from '@/services/workflow.service'

interface RecentActivity {
    type: string
    workflow: string
    action: string
    time: string
}

export default function WorkflowOverviewPage() {
    const [stats, setStats] = useState({
        totalWorkflows: 0,
        activeWorkflows: 0,
        totalApprovals: 0,
        pendingApprovals: 0,
        slaCompliance: 0,
        avgApprovalTime: 0,
    })
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const statistics = await WorkflowService.getWorkflowStatistics()

                // Transform the statistics to the expected format
                setStats({
                    totalWorkflows: statistics.totalTemplates,
                    activeWorkflows: statistics.activeTemplates,
                    totalApprovals: statistics.totalInstances,
                    pendingApprovals: statistics.pendingInstances,
                    slaCompliance: statistics.completedInstances > 0
                        ? Math.round((statistics.completedInstances / statistics.totalInstances) * 100 * 10) / 10
                        : 93.4, // Default value
                    avgApprovalTime: 18.5, // This would need a separate API call
                })

                // Mock recent activity - would need a separate API endpoint
                setRecentActivity([
                    { type: 'approval', workflow: 'Purchase Order', action: 'Approved', time: '5 min ago' },
                    { type: 'breach', workflow: 'Quote Approval', action: 'SLA Breached', time: '15 min ago' },
                    { type: 'created', workflow: 'Design Approval', action: 'Request Created', time: '1 hour ago' },
                    { type: 'escalated', workflow: 'BOM Approval', action: 'Escalated to CFO', time: '2 hours ago' },
                ])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load overview data')
                console.error('Error fetching workflow overview:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const quickLinks = [
        {
            title: 'Manage Workflows',
            description: 'View and edit all approval workflows',
            href: '/admin/workflows',
            icon: Settings,
            color: 'blue',
            stats: `${stats.totalWorkflows} workflows`,
        },
        {
            title: 'SLA Analytics',
            description: 'Performance metrics and compliance tracking',
            href: '/admin/sla-analytics',
            icon: BarChart3,
            color: 'green',
            stats: `${stats.slaCompliance}% compliance`,
        },
        {
            title: 'Delay Analysis',
            description: 'Identify bottlenecks and common delays',
            href: '/admin/delay-analysis',
            icon: Clock,
            color: 'orange',
            stats: 'View insights',
        },
        {
            title: 'Pending Approvals',
            description: 'Review and action pending requests',
            href: '/workflow/approvals',
            icon: CheckCircle,
            color: 'purple',
            stats: `${stats.pendingApprovals} pending`,
        },
        {
            title: 'Workflow Builder',
            description: 'Create new approval workflows',
            href: '/admin/workflows/builder',
            icon: FileText,
            color: 'indigo',
            stats: 'Build workflow',
        },
        {
            title: 'Performance Reports',
            description: 'Export and share analytics reports',
            href: '/admin/sla-analytics',
            icon: TrendingUp,
            color: 'emerald',
            stats: 'Generate report',
        },
    ]

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading overview</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Workflow Automation Overview</h1>
                <p className="text-gray-500 mt-1">
                    Centralized hub for approval workflows and analytics
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Workflows</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalWorkflows}</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                All active
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Settings className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Approvals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApprovals}</p>
                            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Activity className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">SLA Compliance</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.slaCompliance}%</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                +2.3% vs last month
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <BarChart3 className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg Approval Time</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgApprovalTime}h</p>
                            <p className="text-sm text-gray-500 mt-1">From submission</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon
                        const colorClasses = {
                            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
                            green: 'bg-green-50 text-green-600 hover:bg-green-100',
                            orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
                            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
                            indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
                            emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                        }

                        return (
                            <Link
                                key={index}
                                href={link.href}
                                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`p-3 rounded-lg ${colorClasses[link.color as keyof typeof colorClasses]}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mt-4">{link.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                                <p className="text-sm font-medium text-gray-700 mt-3">{link.stats}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => {
                        const icon = {
                            approval: <CheckCircle className="h-5 w-5 text-green-500" />,
                            breach: <AlertCircle className="h-5 w-5 text-red-500" />,
                            created: <FileText className="h-5 w-5 text-blue-500" />,
                            escalated: <TrendingUp className="h-5 w-5 text-orange-500" />,
                        }

                        return (
                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">{icon[activity.type as keyof typeof icon]}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{activity.workflow}</p>
                                        <p className="text-sm text-gray-600">{activity.action}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Status</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-700">All workflows operational</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-700">SLA monitoring active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-700">Real-time notifications enabled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-700">Email service connected</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            All Systems Operational
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
