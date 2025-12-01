'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Plus,
    FileText,
    Download,
    Upload,
    CheckCircle,
    Clock,
    AlertCircle,
    Share2,
    Eye,
    Edit,
    Wrench,
    Zap,
    Droplet,
    Wind,
} from 'lucide-react';

interface MEPDrawing {
    id: string;
    mepNumber: string;
    projectId: string;
    projectName: string;
    drawingType: 'Electrical' | 'Plumbing' | 'HVAC' | 'Fire Safety' | 'Drainage';
    drawingName: string;
    version: string;
    status: 'Draft' | 'Under Review' | 'Approved' | 'Shared with Site' | 'Site Work Complete';
    createdDate: string;
    createdBy: string;
    approvedDate?: string;
    siteWorkProgress: number;
    siteWorkStatus: 'Not Started' | 'In Progress' | 'Pending Inspection' | 'Completed';
    assignedTo: string;
    fileSize: string;
}

const mockMEPDrawings: MEPDrawing[] = [
    {
        id: '1',
        mepNumber: 'MEP-2025-001',
        projectId: 'PRJ-2025-001',
        projectName: 'Taj Hotels - Commercial Kitchen Setup',
        drawingType: 'Electrical',
        drawingName: 'Kitchen Power Distribution - Main Panel',
        version: '2.0',
        status: 'Shared with Site',
        createdDate: '2025-01-15',
        createdBy: 'MEP Designer',
        approvedDate: '2025-01-16',
        siteWorkProgress: 75,
        siteWorkStatus: 'In Progress',
        assignedTo: 'Site Supervisor - Anil Kumar',
        fileSize: '3.2 MB',
    },
    {
        id: '2',
        mepNumber: 'MEP-2025-002',
        projectId: 'PRJ-2025-001',
        projectName: 'Taj Hotels - Commercial Kitchen Setup',
        drawingType: 'Plumbing',
        drawingName: 'Water Supply & Drainage Lines',
        version: '1.0',
        status: 'Approved',
        createdDate: '2025-01-16',
        createdBy: 'Plumbing Designer',
        approvedDate: '2025-01-17',
        siteWorkProgress: 0,
        siteWorkStatus: 'Not Started',
        assignedTo: 'Site Supervisor - Anil Kumar',
        fileSize: '2.8 MB',
    },
    {
        id: '3',
        mepNumber: 'MEP-2025-003',
        projectId: 'PRJ-2025-001',
        projectName: 'Taj Hotels - Commercial Kitchen Setup',
        drawingType: 'HVAC',
        drawingName: 'Kitchen Ventilation & Exhaust System',
        version: '1.0',
        status: 'Site Work Complete',
        createdDate: '2025-01-10',
        createdBy: 'HVAC Designer',
        approvedDate: '2025-01-11',
        siteWorkProgress: 100,
        siteWorkStatus: 'Completed',
        assignedTo: 'Site Supervisor - Anil Kumar',
        fileSize: '4.1 MB',
    },
    {
        id: '4',
        mepNumber: 'MEP-2025-004',
        projectId: 'PRJ-2025-002',
        projectName: 'BigBasket Cold Storage Facility',
        drawingType: 'Electrical',
        drawingName: 'Cold Room Power & Backup Systems',
        version: '1.0',
        status: 'Under Review',
        createdDate: '2025-01-18',
        createdBy: 'MEP Designer',
        siteWorkProgress: 0,
        siteWorkStatus: 'Not Started',
        assignedTo: 'Pending Assignment',
        fileSize: '2.5 MB',
    },
    {
        id: '5',
        mepNumber: 'MEP-2025-005',
        projectId: 'PRJ-2025-002',
        projectName: 'BigBasket Cold Storage Facility',
        drawingType: 'HVAC',
        drawingName: 'Refrigeration Ducting & Insulation',
        version: '1.0',
        status: 'Draft',
        createdDate: '2025-01-19',
        createdBy: 'HVAC Designer',
        siteWorkProgress: 0,
        siteWorkStatus: 'Not Started',
        assignedTo: 'Pending Assignment',
        fileSize: '3.7 MB',
    },
];

export default function MEPManagementPage() {
    const [drawings] = useState<MEPDrawing[]>(mockMEPDrawings);
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredDrawings = drawings.filter(
        (d) =>
            (typeFilter === 'All' || d.drawingType === typeFilter) &&
            (statusFilter === 'All' || d.status === statusFilter)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft':
                return 'bg-gray-100 text-gray-800';
            case 'Under Review':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-blue-100 text-blue-800';
            case 'Shared with Site':
                return 'bg-purple-100 text-purple-800';
            case 'Site Work Complete':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSiteWorkStatusColor = (status: string) => {
        switch (status) {
            case 'Not Started':
                return 'text-gray-600';
            case 'In Progress':
                return 'text-blue-600';
            case 'Pending Inspection':
                return 'text-yellow-600';
            case 'Completed':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Electrical':
                return <Zap className="w-5 h-5 text-yellow-600" />;
            case 'Plumbing':
                return <Droplet className="w-5 h-5 text-blue-600" />;
            case 'HVAC':
                return <Wind className="w-5 h-5 text-cyan-600" />;
            case 'Fire Safety':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'Drainage':
                return <Droplet className="w-5 h-5 text-gray-600" />;
            default:
                return <Wrench className="w-5 h-5 text-gray-600" />;
        }
    };

    const stats = {
        total: drawings.length,
        draft: drawings.filter((d) => d.status === 'Draft').length,
        underReview: drawings.filter((d) => d.status === 'Under Review').length,
        approved: drawings.filter((d) => d.status === 'Approved').length,
        sharedWithSite: drawings.filter((d) => d.status === 'Shared with Site').length,
        siteComplete: drawings.filter((d) => d.status === 'Site Work Complete').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/project-management"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    MEP Drawing Management
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Phase 2: Create, share, and track MEP drawings for site work
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            Create MEP Drawing
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Draft</p>
                                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                            </div>
                            <Edit className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Review</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                            </div>
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">At Site</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.sharedWithSite}</p>
                            </div>
                            <Share2 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Complete</p>
                                <p className="text-2xl font-bold text-green-600">{stats.siteComplete}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Type:</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All Types</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="HVAC">HVAC</option>
                            <option value="Fire Safety">Fire Safety</option>
                            <option value="Drainage">Drainage</option>
                        </select>

                        <label className="text-sm font-medium text-gray-700 ml-4">Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All Status</option>
                            <option value="Draft">Draft</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Shared with Site">Shared with Site</option>
                            <option value="Site Work Complete">Site Work Complete</option>
                        </select>
                    </div>
                </div>

                {/* MEP Drawings List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        MEP Drawing
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Project
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Site Work Progress
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Assigned To
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDrawings.map((drawing) => (
                                    <tr key={drawing.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {drawing.mepNumber}
                                                </div>
                                                <div className="text-sm text-gray-600">{drawing.drawingName}</div>
                                                <div className="text-xs text-gray-500">
                                                    v{drawing.version} • {drawing.fileSize}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-900">{drawing.projectName}</div>
                                            <div className="text-xs text-gray-500">{drawing.projectId}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(drawing.drawingType)}
                                                <span className="text-sm text-gray-900">{drawing.drawingType}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(drawing.status)}`}
                                            >
                                                {drawing.status}
                                            </span>
                                            {drawing.approvedDate && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Approved: {drawing.approvedDate}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span
                                                        className={`text-xs font-medium ${getSiteWorkStatusColor(drawing.siteWorkStatus)}`}
                                                    >
                                                        {drawing.siteWorkStatus}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900">
                                                        {drawing.siteWorkProgress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${drawing.siteWorkProgress === 100
                                                            ? 'bg-green-600'
                                                            : drawing.siteWorkProgress > 0
                                                                ? 'bg-blue-600'
                                                                : 'bg-gray-400'
                                                            }`}
                                                        style={{ width: `${drawing.siteWorkProgress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-900">{drawing.assignedTo}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Drawing"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                                {drawing.status === 'Approved' && (
                                                    <button
                                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Share with Site"
                                                    >
                                                        <Share2 className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">About MEP Management</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Step 2.8: Create MEP drawings, share them with site teams, and track the
                                progress of MEP work installation. MEP drawings must be approved before sharing
                                with site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
