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

    // Mock data - replace with API call
    useEffect(() => {
        const mockWorkflows: WorkflowChain[] = [
            // Phase 1: Sales & Order Management
            {
                id: '1',
                name: 'Quote Approval',
                entityType: 'quotation',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 48,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-15',
                usageCount: 156,
                successRate: 89,
            },
            {
                id: '2',
                name: 'Sales Order Confirmation',
                entityType: 'sales_order',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 18,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-12',
                usageCount: 203,
                successRate: 95,
            },
            {
                id: '3',
                name: 'Credit Limit Approval',
                entityType: 'credit_limit',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 16,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-18',
                usageCount: 78,
                successRate: 92,
            },

            // Phase 2: Design & Estimation
            {
                id: '4',
                name: 'Design Approval',
                entityType: 'design',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 72,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-20',
                usageCount: 134,
                successRate: 91,
            },
            {
                id: '5',
                name: 'Cost Estimation Approval',
                entityType: 'cost_estimation',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 36,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-14',
                usageCount: 167,
                successRate: 94,
            },

            // Phase 3: BOM & Material Planning
            {
                id: '6',
                name: 'BOM Approval',
                entityType: 'bom',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 48,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-16',
                usageCount: 189,
                successRate: 96,
            },
            {
                id: '7',
                name: 'Material Requisition Approval',
                entityType: 'material_requisition',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 18,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-22',
                usageCount: 312,
                successRate: 97,
            },

            // Phase 4: Procurement & Material Management
            {
                id: '8',
                name: 'Purchase Order Approval',
                entityType: 'purchase_order',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 48,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-10',
                usageCount: 245,
                successRate: 94,
            },
            {
                id: '9',
                name: 'Vendor Selection Approval',
                entityType: 'vendor_selection',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 60,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-11',
                usageCount: 45,
                successRate: 88,
            },
            {
                id: '10',
                name: 'RFQ/RFP Approval',
                entityType: 'rfq_rfp',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 36,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-13',
                usageCount: 67,
                successRate: 90,
            },

            // Phase 5: Production Management
            {
                id: '11',
                name: 'Work Order Release Approval',
                entityType: 'work_order',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 18,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-17',
                usageCount: 278,
                successRate: 98,
            },
            {
                id: '12',
                name: 'Production Deviation Approval',
                entityType: 'production_deviation',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 12,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-19',
                usageCount: 56,
                successRate: 85,
            },
            {
                id: '13',
                name: 'Overtime Approval',
                entityType: 'overtime',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 16,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-21',
                usageCount: 123,
                successRate: 93,
            },

            // Phase 6: Quality Control
            {
                id: '14',
                name: 'NCR Approval',
                entityType: 'ncr',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 13,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-18',
                usageCount: 89,
                successRate: 88,
            },
            {
                id: '15',
                name: 'Rework Authorization',
                entityType: 'rework',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 16,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-15',
                usageCount: 67,
                successRate: 91,
            },
            {
                id: '16',
                name: 'Final Inspection Approval',
                entityType: 'final_inspection',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 18,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-20',
                usageCount: 234,
                successRate: 97,
            },

            // Phase 7: Logistics & Accounts
            {
                id: '17',
                name: 'Shipment Authorization',
                entityType: 'shipment',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 27,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-16',
                usageCount: 198,
                successRate: 96,
            },
            {
                id: '18',
                name: 'Invoice Approval',
                entityType: 'invoice',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 18,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-14',
                usageCount: 267,
                successRate: 95,
            },
            {
                id: '19',
                name: 'Payment Authorization',
                entityType: 'payment',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 48,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-12',
                usageCount: 189,
                successRate: 93,
            },

            // Phase 8: Installation & Handover
            {
                id: '20',
                name: 'Installation Schedule Approval',
                entityType: 'installation_schedule',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 36,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-11',
                usageCount: 156,
                successRate: 94,
            },
            {
                id: '21',
                name: 'Site Modification Approval',
                entityType: 'site_modification',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 11,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-17',
                usageCount: 34,
                successRate: 87,
            },
            {
                id: '22',
                name: 'Project Closure Approval',
                entityType: 'project_closure',
                isActive: true,
                levelCount: 4,
                avgSlaHours: 54,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-13',
                usageCount: 145,
                successRate: 98,
            },

            // Cross-Phase Workflows
            {
                id: '23',
                name: 'Budget Override Approval',
                entityType: 'budget_override',
                isActive: true,
                levelCount: 3,
                avgSlaHours: 28,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-19',
                usageCount: 23,
                successRate: 82,
            },
            {
                id: '24',
                name: 'Emergency Change Approval',
                entityType: 'emergency_change',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 14,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-21',
                usageCount: 12,
                successRate: 100,
            },
            {
                id: '25',
                name: 'Expense Approval',
                entityType: 'expense',
                isActive: true,
                levelCount: 2,
                avgSlaHours: 36,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-15',
                usageCount: 456,
                successRate: 96,
            },
        ]

        setTimeout(() => {
            setWorkflows(mockWorkflows)
            setFilteredWorkflows(mockWorkflows)
            setIsLoading(false)
        }, 500)
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
        <div className="p-6 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Workflows</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Settings className="h-8 w-8 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Inactive</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                        </div>
                        <PowerOff className="h-8 w-8 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
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
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workflow Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Entity Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Levels
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg SLA
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Success Rate
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
                            {filteredWorkflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {workflow.entityType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span>{workflow.levelCount} levels</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span>{workflow.avgSlaHours}h</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {workflow.usageCount || 0} times
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${(workflow.successRate || 0) >= 90 ? 'text-green-600' :
                                                (workflow.successRate || 0) >= 75 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {workflow.successRate || 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
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
                                    <td className="px-6 py-4">
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
