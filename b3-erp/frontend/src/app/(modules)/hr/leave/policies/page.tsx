'use client';

import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Search,
    ToggleRight,
    AlertCircle,
    Users,
    Calendar
} from 'lucide-react';

interface LeavePolicy {
    id: string;
    name: string;
    description: string;
    applicableTo: string[];
    effectiveFrom: string;
    effectiveTo: string;
    rules: PolicyRule[];
    isActive: boolean;
}

interface PolicyRule {
    rule: string;
    value: string;
}

export default function LeavePoliciesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

    const policies: LeavePolicy[] = [
        {
            id: '1',
            name: 'Standard Leave Policy',
            description: 'Default leave policy for all regular employees',
            applicableTo: ['All Employees'],
            effectiveFrom: '2025-01-01',
            effectiveTo: '2025-12-31',
            rules: [
                { rule: 'Minimum advance notice for planned leave', value: '3 working days' },
                { rule: 'Maximum consecutive leave days', value: '15 days' },
                { rule: 'Emergency leave notification', value: 'Within 2 hours of shift start' },
                { rule: 'Leave cancellation deadline', value: '24 hours before start' },
                { rule: 'Sandwich rule for weekends', value: 'Enabled' },
                { rule: 'Probation period leave eligibility', value: 'After 90 days' }
            ],
            isActive: true
        },
        {
            id: '2',
            name: 'Management Leave Policy',
            description: 'Enhanced leave policy for management level employees',
            applicableTo: ['Managers', 'Directors', 'C-Level'],
            effectiveFrom: '2025-01-01',
            effectiveTo: '2025-12-31',
            rules: [
                { rule: 'Minimum advance notice for planned leave', value: '7 working days' },
                { rule: 'Maximum consecutive leave days', value: '21 days' },
                { rule: 'Additional annual leave', value: '+5 days' },
                { rule: 'Leave cancellation deadline', value: '48 hours before start' },
                { rule: 'Sabbatical eligibility', value: 'After 5 years of service' },
                { rule: 'Work from home option', value: 'Unlimited' }
            ],
            isActive: true
        },
        {
            id: '3',
            name: 'Shift Workers Policy',
            description: 'Leave policy for shift-based production workers',
            applicableTo: ['Production', 'Warehouse'],
            effectiveFrom: '2025-01-01',
            effectiveTo: '2025-12-31',
            rules: [
                { rule: 'Minimum advance notice for planned leave', value: '7 working days' },
                { rule: 'Maximum consecutive leave days', value: '10 days' },
                { rule: 'Shift swap allowed', value: 'Yes, with approval' },
                { rule: 'Emergency leave notification', value: 'Within 1 hour of shift start' },
                { rule: 'Weekend/Holiday premium', value: '+50% comp off' },
                { rule: 'Minimum staffing requirement', value: '70% attendance' }
            ],
            isActive: true
        },
        {
            id: '4',
            name: 'Probation Period Policy',
            description: 'Limited leave policy during probation',
            applicableTo: ['Probationers'],
            effectiveFrom: '2025-01-01',
            effectiveTo: '2025-12-31',
            rules: [
                { rule: 'Annual leave eligibility', value: 'Not applicable' },
                { rule: 'Sick leave eligibility', value: '3 days only' },
                { rule: 'Casual leave eligibility', value: '2 days only' },
                { rule: 'Emergency leave', value: 'Unpaid only' },
                { rule: 'Leave without pay limit', value: '5 days max' },
                { rule: 'Full policy effective after', value: '90 days confirmation' }
            ],
            isActive: true
        }
    ];

    const filteredPolicies = policies.filter(policy =>
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-500" />
                            Leave Policies
                        </h1>
                        <p className="text-gray-400 mt-1">Configure leave policy rules and guidelines</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Policy
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Total Policies</p>
                        <p className="text-3xl font-bold text-white">{policies.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Active Policies</p>
                        <p className="text-3xl font-bold text-white">{policies.filter(p => p.isActive).length}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Employee Groups</p>
                        <p className="text-3xl font-bold text-white">7</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <p className="text-orange-400 text-sm">Total Rules</p>
                        <p className="text-3xl font-bold text-white">{policies.reduce((sum, p) => sum + p.rules.length, 0)}</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search policies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredPolicies.map((policy) => (
                        <div
                            key={policy.id}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
                        >
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
                                onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{policy.name}</h3>
                                            {policy.isActive ? (
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">Inactive</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{policy.description}</p>

                                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                {policy.applicableTo.join(', ')}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                {new Date(policy.effectiveFrom).toLocaleDateString()} - {new Date(policy.effectiveTo).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">{policy.rules.length} rules</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {expandedPolicy === policy.id && (
                                <div className="border-t border-gray-700 p-6 bg-gray-700/20">
                                    <h4 className="text-white font-medium mb-4">Policy Rules</h4>
                                    <div className="space-y-3">
                                        {policy.rules.map((rule, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                                                <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-white">{rule.rule}</p>
                                                    <p className="text-sm text-purple-400 font-medium mt-1">{rule.value}</p>
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
