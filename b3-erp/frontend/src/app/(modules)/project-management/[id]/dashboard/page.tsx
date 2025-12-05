'use client'

import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import {
    LayoutDashboard,
    Calendar,
    Users,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Clock,
    ArrowRight,
    MoreVertical,
    Flag,
} from 'lucide-react'

interface ProjectMetrics {
    progress: number
    tasks: {
        total: number
        completed: number
        inProgress: number
        blocked: number
    }
    budget: {
        allocated: number
        spent: number
        variance: number
    }
    resources: {
        count: number
        utilization: number
    }
    timeline: {
        startDate: string
        endDate: string
        daysRemaining: number
        status: 'on_track' | 'delayed' | 'at_risk'
    }
}

interface Milestone {
    id: string
    name: string
    date: string
    status: 'completed' | 'upcoming' | 'missed'
}

interface CriticalTask {
    id: string
    name: string
    assignee: string
    dueDate: string
    status: string
    priority: string
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']

export default function ProjectDashboardPage({ params }: { params: { id: string } }) {
    const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [criticalTasks, setCriticalTasks] = useState<CriticalTask[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProjectData()
    }, [])

    const fetchProjectData = async () => {
        setIsLoading(true)
        // TODO: Replace with actual API call
        setTimeout(() => {
            setMetrics({
                progress: 65,
                tasks: {
                    total: 45,
                    completed: 28,
                    inProgress: 12,
                    blocked: 5,
                },
                budget: {
                    allocated: 150000,
                    spent: 95000,
                    variance: -2000,
                },
                resources: {
                    count: 8,
                    utilization: 92,
                },
                timeline: {
                    startDate: '2024-11-01',
                    endDate: '2025-02-28',
                    daysRemaining: 85,
                    status: 'on_track',
                },
            })

            setMilestones([
                { id: '1', name: 'Design Approval', date: '2024-11-15', status: 'completed' },
                { id: '2', name: 'Prototype Review', date: '2024-12-10', status: 'upcoming' },
                { id: '3', name: 'Production Start', date: '2025-01-05', status: 'upcoming' },
                { id: '4', name: 'Final Delivery', date: '2025-02-28', status: 'upcoming' },
            ])

            setCriticalTasks([
                {
                    id: '1',
                    name: 'Finalize CAD Models',
                    assignee: 'John Doe',
                    dueDate: '2024-12-05',
                    status: 'in_progress',
                    priority: 'critical',
                },
                {
                    id: '2',
                    name: 'Material Procurement',
                    assignee: 'Jane Smith',
                    dueDate: '2024-12-08',
                    status: 'blocked',
                    priority: 'high',
                },
                {
                    id: '3',
                    name: 'Safety Inspection',
                    assignee: 'Bob Johnson',
                    dueDate: '2024-12-12',
                    status: 'not_started',
                    priority: 'high',
                },
            ])

            setIsLoading(false)
        }, 800)
    }

    if (isLoading || !metrics) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading project dashboard...</p>
                </div>
            </div>
        )
    }

    const taskData = [
        { name: 'Completed', value: metrics.tasks.completed },
        { name: 'In Progress', value: metrics.tasks.inProgress },
        { name: 'Blocked', value: metrics.tasks.blocked },
        { name: 'Not Started', value: metrics.tasks.total - metrics.tasks.completed - metrics.tasks.inProgress - metrics.tasks.blocked },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Factory Automation Project</h1>
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Active
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">Project ID: {params.id || 'PROJ-2024-001'} • Manager: Alice Williams</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Project Settings
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Progress Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Overall Progress</h3>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">{metrics.progress}%</span>
                        <span className="text-sm text-gray-500 mb-1">completed</span>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Budget Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Budget Status</h3>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                            ${(metrics.budget.spent / 1000).toFixed(1)}k
                        </span>
                        <span className="text-sm text-gray-500 mb-1">
                            of ${(metrics.budget.allocated / 1000).toFixed(1)}k
                        </span>
                    </div>
                    <p className={`text-sm mt-2 ${metrics.budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.budget.variance < 0 ? 'Under budget' : 'Over budget'} by ${Math.abs(metrics.budget.variance)}
                    </p>
                </div>

                {/* Timeline Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">{metrics.timeline.daysRemaining}</span>
                        <span className="text-sm text-gray-500 mb-1">days remaining</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Due: {new Date(metrics.timeline.endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* Resources Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Team Utilization</h3>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Users className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">{metrics.resources.utilization}%</span>
                        <span className="text-sm text-gray-500 mb-1">avg utilization</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {metrics.resources.count} active members
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Status Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {taskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Critical Tasks List */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Critical Tasks</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        {criticalTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${task.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.name}</h4>
                                        <p className="text-sm text-gray-500">Assigned to {task.assignee}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Milestones</h3>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                    <div className="relative flex justify-between">
                        {milestones.map((milestone, index) => (
                            <div key={milestone.id} className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full border-2 z-10 ${milestone.status === 'completed' ? 'bg-green-500 border-green-500' :
                                        milestone.status === 'upcoming' ? 'bg-white border-blue-500' :
                                            'bg-red-500 border-red-500'
                                    }`}></div>
                                <div className="mt-4 text-center">
                                    <p className="font-medium text-gray-900">{milestone.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
