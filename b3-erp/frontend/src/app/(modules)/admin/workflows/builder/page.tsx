'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Save,
    X,
    Plus,
    Trash2,
    GripVertical,
    Users,
    Clock,
    AlertCircle,
    CheckCircle,
    Eye,
    ArrowLeft,
    Copy,
    Settings,
    Zap,
    ChevronDown,
    ChevronUp,
    RefreshCw,
} from 'lucide-react'
import { WorkflowService, WorkflowTemplate, WorkflowStatus } from '@/services/workflow.service'

interface ApprovalLevel {
    id: string
    sequence: number
    approverType: 'role' | 'user' | 'position'
    approverIds: string[]
    requiredCount: number
    slaHours: number
    conditions: any
    escalationRules: any
}

interface WorkflowConfig {
    id?: string
    name: string
    entityType: string
    isActive: boolean
    levels: ApprovalLevel[]
}

const AVAILABLE_ROLES = [
    'sales_manager',
    'regional_director',
    'vp_sales',
    'cfo',
    'finance_manager',
    'finance_controller',
    'procurement_manager',
    'procurement_head',
    'production_manager',
    'production_engineer',
    'quality_manager',
    'quality_head',
    'design_manager',
    'engineering_head',
    'department_head',
]

const ENTITY_TYPES = [
    { value: 'purchase_order', label: 'Purchase Order' },
    { value: 'quotation', label: 'Quotation' },
    { value: 'design', label: 'Design' },
    { value: 'bom', label: 'BOM' },
    { value: 'work_order', label: 'Work Order' },
    { value: 'ncr', label: 'NCR (Non-Conformance)' },
    { value: 'shipment', label: 'Shipment' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'expense', label: 'Expense' },
    { value: 'leave_request', label: 'Leave Request' },
    { value: 'custom', label: 'Custom Workflow' },
]

export default function WorkflowBuilderPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const workflowId = searchParams?.get('id')

    const [workflow, setWorkflow] = useState<WorkflowConfig>({
        name: '',
        entityType: '',
        isActive: true,
        levels: [],
    })

    const [expandedLevel, setExpandedLevel] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load workflow if editing
    useEffect(() => {
        const fetchWorkflow = async () => {
            if (workflowId) {
                setIsLoading(true)
                setError(null)
                try {
                    const templates = await WorkflowService.getAllWorkflowTemplates()
                    const template = templates.find((t: WorkflowTemplate) => t.id === workflowId)

                    if (template) {
                        // Transform template to WorkflowConfig format
                        setWorkflow({
                            id: template.id,
                            name: template.name,
                            entityType: template.entityType || template.category.toLowerCase().replace(' ', '_'),
                            isActive: template.status === WorkflowStatus.ACTIVE,
                            levels: template.steps.map((step, index) => ({
                                id: step.id || `${index + 1}`,
                                sequence: step.order || index + 1,
                                approverType: 'role' as const,
                                approverIds: step.assignees?.map((a) => a.id) || ['department_head'],
                                requiredCount: 1,
                                slaHours: template.slaSettings?.warningDays ? template.slaSettings.warningDays * 24 : 24,
                                conditions: step.conditions || {},
                                escalationRules: {},
                            })),
                        })
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to load workflow')
                    console.error('Error fetching workflow:', err)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchWorkflow()
    }, [workflowId])

    const addLevel = () => {
        const newLevel: ApprovalLevel = {
            id: `${Date.now()}`,
            sequence: workflow.levels.length + 1,
            approverType: 'role',
            approverIds: [],
            requiredCount: 1,
            slaHours: 24,
            conditions: {},
            escalationRules: {},
        }
        setWorkflow({ ...workflow, levels: [...workflow.levels, newLevel] })
        setExpandedLevel(newLevel.id)
    }

    const removeLevel = (levelId: string) => {
        const updatedLevels = workflow.levels
            .filter((l) => l.id !== levelId)
            .map((l, index) => ({ ...l, sequence: index + 1 }))
        setWorkflow({ ...workflow, levels: updatedLevels })
    }

    const updateLevel = (levelId: string, updates: Partial<ApprovalLevel>) => {
        setWorkflow({
            ...workflow,
            levels: workflow.levels.map((l) =>
                l.id === levelId ? { ...l, ...updates } : l
            ),
        })
    }

    const moveLevel = (levelId: string, direction: 'up' | 'down') => {
        const index = workflow.levels.findIndex((l) => l.id === levelId)
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === workflow.levels.length - 1)
        ) {
            return
        }

        const newLevels = [...workflow.levels]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
            ;[newLevels[index], newLevels[swapIndex]] = [
                newLevels[swapIndex],
                newLevels[index],
            ]

        // Update sequences
        newLevels.forEach((level, idx) => {
            level.sequence = idx + 1
        })

        setWorkflow({ ...workflow, levels: newLevels })
    }

    const handleSave = async () => {
        if (!workflow.name || !workflow.entityType || workflow.levels.length === 0) {
            alert('Please fill in all required fields and add at least one approval level')
            return
        }

        setIsSaving(true)
        try {
            // Transform to service format
            const templateData = {
                name: workflow.name,
                entityType: workflow.entityType,
                category: workflow.entityType.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                description: `${workflow.name} workflow`,
                status: workflow.isActive ? WorkflowStatus.ACTIVE : WorkflowStatus.DRAFT,
                steps: workflow.levels.map((level) => ({
                    id: level.id,
                    name: `Level ${level.sequence}`,
                    type: 'approval',
                    order: level.sequence,
                    assignees: level.approverIds.map((id) => ({ type: level.approverType, id })),
                    conditions: level.conditions,
                })),
                slaSettings: {
                    warningDays: Math.floor(workflow.levels.reduce((sum, l) => sum + l.slaHours, 0) / 24),
                    criticalDays: Math.floor(workflow.levels.reduce((sum, l) => sum + l.slaHours, 0) / 24) + 1,
                },
            }

            if (workflow.id) {
                await WorkflowService.updateWorkflowTemplate(workflow.id, templateData)
            } else {
                await WorkflowService.createWorkflowTemplate(templateData)
            }

            alert('Workflow saved successfully!')
            router.push('/admin/workflows')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save workflow')
            console.error('Error saving workflow:', err)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-3">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading workflow</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/admin/workflows')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {workflowId ? 'Edit Workflow' : 'Create New Workflow'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Configure approval levels and conditions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                {showPreview ? 'Hide Preview' : 'Preview'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Workflow'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 w-full space-y-3">
                {/* Basic Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Workflow Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Workflow Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={workflow.name}
                                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                                placeholder="e.g., Purchase Order Approval"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entity Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={workflow.entityType}
                                onChange={(e) =>
                                    setWorkflow({ ...workflow, entityType: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select entity type...</option>
                                {ENTITY_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={workflow.isActive}
                                onChange={(e) =>
                                    setWorkflow({ ...workflow, isActive: e.target.checked })
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                Active (workflow will be used immediately)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Approval Levels */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">Approval Levels</h2>
                        <button
                            onClick={addLevel}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Level
                        </button>
                    </div>

                    {workflow.levels.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No approval levels
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Add your first approval level to get started
                            </p>
                            <button
                                onClick={addLevel}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add First Level
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {workflow.levels.map((level, index) => (
                                <div
                                    key={level.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    {/* Level Header */}
                                    <div
                                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${expandedLevel === level.id ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        onClick={() =>
                                            setExpandedLevel(expandedLevel === level.id ? null : level.id)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="h-5 w-5 text-gray-400" />
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                                                    {level.sequence}
                                                </span>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        Level {level.sequence}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {level.approverIds.length > 0
                                                            ? `${level.approverIds.length} approver(s) • ${level.slaHours}h SLA`
                                                            : 'Not configured'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    moveLevel(level.id, 'up')
                                                }}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-white rounded disabled:opacity-30"
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    moveLevel(level.id, 'down')
                                                }}
                                                disabled={index === workflow.levels.length - 1}
                                                className="p-1 hover:bg-white rounded disabled:opacity-30"
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeLevel(level.id)
                                                }}
                                                className="p-1 hover:bg-red-50 rounded text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Level Content */}
                                    {expandedLevel === level.id && (
                                        <div className="p-6 bg-white border-t space-y-3">
                                            {/* Approver Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Approver Type
                                                </label>
                                                <select
                                                    value={level.approverType}
                                                    onChange={(e) =>
                                                        updateLevel(level.id, {
                                                            approverType: e.target.value as any,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="role">Role</option>
                                                    <option value="user">Specific User</option>
                                                    <option value="position">Position</option>
                                                </select>
                                            </div>

                                            {/* Approvers */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Approvers <span className="text-red-500">*</span>
                                                </label>
                                                <div className="space-y-2">
                                                    {AVAILABLE_ROLES.map((role) => (
                                                        <label key={role} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={level.approverIds.includes(role)}
                                                                onChange={(e) => {
                                                                    const newIds = e.target.checked
                                                                        ? [...level.approverIds, role]
                                                                        : level.approverIds.filter((id) => id !== role)
                                                                    updateLevel(level.id, { approverIds: newIds })
                                                                }}
                                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">
                                                                {role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Required Count & SLA */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Required Approvals
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={level.approverIds.length}
                                                        value={level.requiredCount}
                                                        onChange={(e) =>
                                                            updateLevel(level.id, {
                                                                requiredCount: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        How many approvers must approve
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        SLA (hours)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={level.slaHours}
                                                        onChange={(e) =>
                                                            updateLevel(level.id, {
                                                                slaHours: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Time limit for this level
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Conditions (Simplified) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Conditions (Optional)
                                                </label>
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        This level will only activate if:
                                                    </p>
                                                    <div className="space-y-2 text-sm text-gray-500">
                                                        <div>• Amount exceeds certain threshold</div>
                                                        <div>• Specific fields match criteria</div>
                                                        <div>• Custom business rules apply</div>
                                                    </div>
                                                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                        Configure Conditions →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preview */}
                {showPreview && workflow.levels.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Workflow Preview
                        </h2>
                        <div className="space-y-2">
                            {workflow.levels.map((level, index) => (
                                <div key={level.id} className="flex items-start gap-2">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-medium">
                                            {level.sequence}
                                        </div>
                                        {index < workflow.levels.length - 1 && (
                                            <div className="w-0.5 h-12 bg-blue-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h3 className="font-medium text-gray-900">Level {level.sequence}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {level.approverIds.length} approver(s), {level.requiredCount} required
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            SLA: {level.slaHours} hours
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
