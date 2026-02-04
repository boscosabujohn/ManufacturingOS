'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Plus,
    Search,
    Edit,
    Copy,
    Trash2,
    Power,
    PowerOff,
    Filter,
    Download,
    Upload,
    Settings,
    CheckCircle,
    Clock,
    Users,
    ChevronRight,
    BarChart3,
    Activity,
    AlertCircle,
} from 'lucide-react'
import { WorkflowService, WorkflowTemplate, WorkflowStatus } from '@/services/workflow.service'

interface WorkflowChain {
    id: string
    name: string
    entityType: string
    isActive: boolean
    levelCount: number
    avgSlaHours: number
    createdAt: string
    updatedAt: string
    usageCount?: number
    successRate?: number
}

export default function WorkflowsListPage() {
    const [workflows, setWorkflows] = useState<WorkflowChain[]>([])
    const [filteredWorkflows, setFilteredWorkflows] = useState<WorkflowChain[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
    const [filterPhase, setFilterPhase] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch workflows from service
    useEffect(() => {
        const fetchWorkflows = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const templates = await WorkflowService.getAllWorkflowTemplates()

                // Transform WorkflowTemplate to WorkflowChain format
                const transformedWorkflows: WorkflowChain[] = templates.map((template: WorkflowTemplate) => ({
                    id: template.id,
                    name: template.name,
                    entityType: template.entityType || template.category.toLowerCase().replace(' ', '_'),
                    isActive: template.status === WorkflowStatus.ACTIVE,
                    levelCount: template.steps.length || 2,
                    avgSlaHours: template.slaSettings?.warningDays ? template.slaSettings.warningDays * 24 : 48,
                    createdAt: new Date(template.createdAt).toISOString().split('T')[0],
                    updatedAt: new Date(template.updatedAt).toISOString().split('T')[0],
                    usageCount: template.instanceCount || 0,
                    successRate: Math.floor(Math.random() * 15) + 85, // Mock success rate for now
                }))

                setWorkflows(transformedWorkflows)
                setFilteredWorkflows(transformedWorkflows)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load workflows')
                console.error('Error fetching workflows:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkflows()
    }, [])

    // Filter workflows
    useEffect(() => {
        let filtered = [...workflows]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (wf) =>
                    wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wf.entityType.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter((wf) =>
                filterStatus === 'active' ? wf.isActive : !wf.isActive
            )
        }

        setFilteredWorkflows(filtered)
    }, [workflows, searchTerm, filterStatus, filterPhase])

    const handleToggleActive = (id: string) => {
        setWorkflows((prev) =>
            prev.map((wf) => (wf.id === id ? { ...wf, isActive: !wf.isActive } : wf))
        )
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this workflow?')) {
            setWorkflows((prev) => prev.filter((wf) => wf.id !== id))
        }
    }

    const handleDuplicate = (id: string) => {
        const workflow = workflows.find((wf) => wf.id === id)
        if (workflow) {
            const duplicate = {
                ...workflow,
                id: `${Date.now()}`,
                name: `${workflow.name} (Copy)`,
                isActive: false,
                usageCount: 0,
            }
            setWorkflows((prev) => [...prev, duplicate])
        }
    }

    const stats = {
        total: workflows.length,
        active: workflows.filter((wf) => wf.isActive).length,
        inactive: workflows.filter((wf) => !wf.isActive).length,
        avgSuccessRate: Math.round(
            workflows.reduce((sum, wf) => sum + (wf.successRate || 0), 0) / workflows.length
        ),
    }

    return (
        <div className="p-6 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Workflow Management</h1>
                    <p className="text-gray-500 mt-1">Configure and manage approval workflows</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import
                    </button>
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <Link
                        href="/admin/workflows/builder"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Workflow
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Workflows</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Settings className="h-8 w-8 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Inactive</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                        </div>
                        <PowerOff className="h-8 w-8 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg Success Rate</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.avgSuccessRate}%</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex flex-col lg:flex-row gap-2">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search workflows..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>

                    {/* Phase Filter */}
                    <select
                        value={filterPhase}
                        onChange={(e) => setFilterPhase(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Phases</option>
                        <option value="sales">Sales</option>
                        <option value="design">Design</option>
                        <option value="bom">BOM</option>
                        <option value="procurement">Procurement</option>
                        <option value="production">Production</option>
                        <option value="quality">Quality</option>
                        <option value="logistics">Logistics</option>
                        <option value="installation">Installation</option>
                    </select>
                </div>
            </div>

            {/* Workflows Table */}
            {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-center">
                        <Activity className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workflow Name
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Entity Type
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Levels
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg SLA
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usage
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Success Rate
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWorkflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {workflow.entityType}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span>{workflow.levelCount} levels</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span>{workflow.avgSlaHours}h</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                        {workflow.usageCount || 0} times
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${(workflow.successRate || 0) >= 90 ? 'text-green-600' :
                                                (workflow.successRate || 0) >= 75 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {workflow.successRate || 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => handleToggleActive(workflow.id)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${workflow.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {workflow.isActive ? (
                                                <>
                                                    <Power className="h-3 w-3 mr-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <PowerOff className="h-3 w-3 mr-1" />
                                                    Inactive
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/workflows/builder?id=${workflow.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                            >
                                                <Edit className="h-4 w-4 text-gray-600" />
                                                <span className="text-gray-700">Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDuplicate(workflow.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                            >
                                                <Copy className="h-4 w-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(workflow.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredWorkflows.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
