'use client';

import React, { useState } from 'react';
import {
    GitBranch,
    Plus,
    Edit,
    Trash2,
    Save,
    Users,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

interface ApprovalLevel {
    level: number;
    approverType: 'Role' | 'Specific User' | 'Department Head';
    approver: string;
    autoApproveBelow: number;
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    leaveTypes: string[];
    isActive: boolean;
    levels: ApprovalLevel[];
}

export default function EncashmentWorkflowPage() {
    const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

    const workflows: Workflow[] = [
        {
            id: '1',
            name: 'Standard Encashment Approval',
            description: 'Default workflow for leave encashment up to 5 days',
            leaveTypes: ['Annual Leave', 'Earned Leave'],
            isActive: true,
            levels: [
                { level: 1, approverType: 'Role', approver: 'Team Lead', autoApproveBelow: 0 },
                { level: 2, approverType: 'Role', approver: 'HR Manager', autoApproveBelow: 3 }
            ]
        },
        {
            id: '2',
            name: 'High Value Encashment',
            description: 'Workflow for encashment above 5 days requiring additional approval',
            leaveTypes: ['Annual Leave'],
            isActive: true,
            levels: [
                { level: 1, approverType: 'Role', approver: 'Team Lead', autoApproveBelow: 0 },
                { level: 2, approverType: 'Role', approver: 'HR Manager', autoApproveBelow: 0 },
                { level: 3, approverType: 'Role', approver: 'Finance Head', autoApproveBelow: 0 }
            ]
        },
        {
            id: '3',
            name: 'Comp Off Encashment',
            description: 'Simplified workflow for compensatory off encashment',
            leaveTypes: ['Compensatory Off'],
            isActive: true,
            levels: [
                { level: 1, approverType: 'Department Head', approver: 'Department Head', autoApproveBelow: 2 },
                { level: 2, approverType: 'Role', approver: 'HR Manager', autoApproveBelow: 0 }
            ]
        }
    ];

    const getApproverTypeColor = (type: string) => {
        switch (type) {
            case 'Role': return 'bg-blue-500/20 text-blue-400';
            case 'Specific User': return 'bg-purple-500/20 text-purple-400';
            case 'Department Head': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <GitBranch className="w-8 h-8 text-purple-500" />
                            Approval Workflow
                        </h1>
                        <p className="text-gray-400 mt-1">Configure encashment approval workflows</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        New Workflow
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Workflows</p>
                        <p className="text-3xl font-bold text-white">{workflows.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Active Workflows</p>
                        <p className="text-3xl font-bold text-white">{workflows.filter(w => w.isActive).length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Leave Types Covered</p>
                        <p className="text-3xl font-bold text-white">3</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border overflow-hidden transition-all ${
                                selectedWorkflow === workflow.id ? 'border-purple-500' : 'border-gray-700'
                            }`}
                        >
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-700/30"
                                onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${workflow.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {workflow.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{workflow.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {workflow.leaveTypes.map(type => (
                                                <span key={type} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {workflow.levels.map((level, index) => (
                                            <React.Fragment key={level.level}>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                                        L{level.level}
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">{level.approver.split(' ')[0]}</span>
                                                </div>
                                                {index < workflow.levels.length - 1 && (
                                                    <ArrowRight className="w-4 h-4 text-gray-500" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                        <CheckCircle className="w-6 h-6 text-green-500 ml-2" />
                                    </div>
                                </div>
                            </div>

                            {selectedWorkflow === workflow.id && (
                                <div className="border-t border-gray-700 p-6 bg-gray-700/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-white font-medium">Approval Levels</h4>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button className="flex items-center gap-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm">
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {workflow.levels.map((level, index) => (
                                            <div key={level.level} className="flex items-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                                        {level.level}
                                                    </div>
                                                    {index < workflow.levels.length - 1 && (
                                                        <div className="w-0.5 h-8 bg-purple-500/50 mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 p-4 bg-gray-700/50 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-0.5 rounded text-xs ${getApproverTypeColor(level.approverType)}`}>
                                                                    {level.approverType}
                                                                </span>
                                                                <span className="text-white font-medium">{level.approver}</span>
                                                            </div>
                                                            {level.autoApproveBelow > 0 && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Auto-approve below {level.autoApproveBelow} days
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Users className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
