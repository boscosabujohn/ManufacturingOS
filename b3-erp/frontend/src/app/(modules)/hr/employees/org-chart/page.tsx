'use client';

import React, { useState } from 'react';
import {
    Network,
    ZoomIn,
    ZoomOut,
    Download,
    Filter,
    ChevronDown,
    ChevronRight,
    User,
    Users,
    Building
} from 'lucide-react';

interface OrgNode {
    id: string;
    name: string;
    designation: string;
    department: string;
    employeeId: string;
    directReports: number;
    children?: OrgNode[];
    expanded?: boolean;
}

export default function OrgChartPage() {
    const [zoomLevel, setZoomLevel] = useState(100);
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3']));

    const orgData: OrgNode[] = [
        {
            id: '1',
            name: 'Robert Williams',
            designation: 'CEO',
            department: 'Executive',
            employeeId: 'EMP001',
            directReports: 4,
            children: [
                {
                    id: '2',
                    name: 'Sarah Johnson',
                    designation: 'VP Human Resources',
                    department: 'Human Resources',
                    employeeId: 'EMP002',
                    directReports: 3,
                    children: [
                        { id: '5', name: 'Mike Ross', designation: 'HR Manager', department: 'Human Resources', employeeId: 'EMP005', directReports: 2 },
                        { id: '6', name: 'Lisa Chen', designation: 'Payroll Manager', department: 'Human Resources', employeeId: 'EMP006', directReports: 3 },
                        { id: '7', name: 'Tom Wilson', designation: 'Talent Acquisition Lead', department: 'Human Resources', employeeId: 'EMP007', directReports: 2 },
                    ]
                },
                {
                    id: '3',
                    name: 'Michael Chen',
                    designation: 'VP Operations',
                    department: 'Operations',
                    employeeId: 'EMP003',
                    directReports: 4,
                    children: [
                        { id: '8', name: 'David Lee', designation: 'Production Manager', department: 'Production', employeeId: 'EMP008', directReports: 8 },
                        { id: '9', name: 'Emily Davis', designation: 'Quality Manager', department: 'Quality', employeeId: 'EMP009', directReports: 5 },
                        { id: '10', name: 'James Taylor', designation: 'Warehouse Manager', department: 'Warehouse', employeeId: 'EMP010', directReports: 6 },
                        { id: '11', name: 'Anna Martin', designation: 'Supply Chain Manager', department: 'Supply Chain', employeeId: 'EMP011', directReports: 4 },
                    ]
                },
                {
                    id: '4',
                    name: 'Jennifer Brown',
                    designation: 'VP Finance',
                    department: 'Finance',
                    employeeId: 'EMP004',
                    directReports: 2,
                    children: [
                        { id: '12', name: 'Chris Anderson', designation: 'Finance Manager', department: 'Finance', employeeId: 'EMP012', directReports: 3 },
                        { id: '13', name: 'Rachel Green', designation: 'Accounting Manager', department: 'Finance', employeeId: 'EMP013', directReports: 4 },
                    ]
                }
            ]
        }
    ];

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    };

    const renderNode = (node: OrgNode, level: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        const levelColors = [
            'from-blue-500 to-purple-600',
            'from-green-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-pink-500 to-rose-600'
        ];

        return (
            <div key={node.id} className="flex flex-col items-center">
                <div className={`bg-gray-800 border border-gray-700 rounded-xl p-4 min-w-[200px] hover:border-blue-500/50 transition-all cursor-pointer`}
                    onClick={() => hasChildren && toggleNode(node.id)}>
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${levelColors[level % levelColors.length]} flex items-center justify-center text-white font-bold`}>
                            {node.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="text-white font-medium truncate">{node.name}</h4>
                                {hasChildren && (
                                    isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">{node.designation}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{node.department}</span>
                                {node.directReports > 0 && (
                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                        {node.directReports} reports
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-6 relative">
                        <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-600 -translate-y-6"></div>
                        <div className="flex gap-8 relative">
                            {node.children!.length > 1 && (
                                <div className="absolute top-0 left-0 right-0 h-px bg-gray-600"></div>
                            )}
                            {node.children!.map((child, index) => (
                                <div key={child.id} className="relative">
                                    <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-600 -translate-y-6"></div>
                                    {renderNode(child, level + 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Network className="w-8 h-8 text-blue-500" />
                            Organization Chart
                        </h1>
                        <p className="text-gray-400 mt-1">Visual hierarchy of your organization</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="text-white px-3">{zoomLevel}%</span>
                        <button
                            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg ml-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Building className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-blue-400 text-sm">Departments</p>
                            <p className="text-2xl font-bold text-white">8</p>
                        </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Users className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-green-400 text-sm">Total Employees</p>
                            <p className="text-2xl font-bold text-white">156</p>
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
                        <User className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-purple-400 text-sm">Managers</p>
                            <p className="text-2xl font-bold text-white">24</p>
                        </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
                        <Network className="w-8 h-8 text-orange-400" />
                        <div>
                            <p className="text-orange-400 text-sm">Hierarchy Levels</p>
                            <p className="text-2xl font-bold text-white">5</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        <option value="Executive">Executive</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                    </select>
                    <span className="text-sm text-gray-400 ml-auto">Click on nodes to expand/collapse</span>
                </div>

                <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-8 overflow-auto min-h-[600px]"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                    <div className="flex justify-center">
                        {orgData.map(node => renderNode(node))}
                    </div>
                </div>
            </div>
        </div>
    );
}
