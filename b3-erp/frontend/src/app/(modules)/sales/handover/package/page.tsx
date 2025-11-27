'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Package,
    FileText,
    CheckCircle,
    XCircle,
    Download,
    Send,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';

interface PackageDocument {
    id: string;
    name: string;
    type: string;
    status: 'Available' | 'Missing' | 'Pending Review';
    uploadDate?: string;
    uploadedBy?: string;
}

interface HandoverPackage {
    projectId: string;
    projectNumber: string;
    projectName: string;
    customer: string;
    createdDate: string;
    completionPercentage: number;
    documents: PackageDocument[];
}

const mockPackage: HandoverPackage = {
    projectId: 'PRJ-2025-001',
    projectNumber: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    customer: 'Taj Hotels Limited',
    createdDate: '2025-01-10',
    completionPercentage: 87,
    documents: [
        {
            id: '1',
            name: 'Project Confirmation Email / Signed PO',
            type: 'Contract',
            status: 'Available',
            uploadDate: '2025-01-10',
            uploadedBy: 'Sales Team',
        },
        {
            id: '2',
            name: 'Customer Details & Contact Information',
            type: 'Customer Profile',
            status: 'Available',
            uploadDate: '2025-01-10',
            uploadedBy: 'CRM System',
        },
        {
            id: '3',
            name: 'Bill of Quantities (BOQ)',
            type: 'BOQ',
            status: 'Available',
            uploadDate: '2025-01-11',
            uploadedBy: 'Sales Team',
        },
        {
            id: '4',
            name: 'Layout Drawings',
            type: 'Drawing',
            status: 'Available',
            uploadDate: '2025-01-12',
            uploadedBy: 'Design Team',
        },
        {
            id: '5',
            name: '3D Renders / Visualizations',
            type: 'Media',
            status: 'Available',
            uploadDate: '2025-01-12',
            uploadedBy: 'Design Team',
        },
        {
            id: '6',
            name: 'Kitchen Appliance Specifications',
            type: 'Specification',
            status: 'Available',
            uploadDate: '2025-01-10',
            uploadedBy: 'Sales Team',
        },
        {
            id: '7',
            name: 'Client Requested Completion Date',
            type: 'Timeline',
            status: 'Available',
            uploadDate: '2025-01-10',
            uploadedBy: 'Sales Team',
        },
        {
            id: '8',
            name: 'Sales Person Handover Notes',
            type: 'Notes',
            status: 'Missing',
        },
    ],
};

export default function HandoverPackagePage() {
    const [packageData] = useState<HandoverPackage>(mockPackage);

    const availableDocs = packageData.documents.filter((d) => d.status === 'Available').length;
    const totalDocs = packageData.documents.length;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Available':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'Missing':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'Pending Review':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available':
                return 'bg-green-100 text-green-800';
            case 'Missing':
                return 'bg-red-100 text-red-800';
            case 'Pending Review':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/sales/handover"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Phase 1 Handover Package
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {packageData.projectName} - {packageData.projectNumber}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                <Download className="w-4 h-4" />
                                Download Package
                            </button>
                            <button
                                disabled={availableDocs !== totalDocs}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${availableDocs === totalDocs
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-4 h-4" />
                                Execute Handover
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Package Completion</h2>
                            <p className="text-sm text-gray-600">
                                {availableDocs} of {totalDocs} required documents attached
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">
                                {Math.round((availableDocs / totalDocs) * 100)}%
                            </div>
                            <p className="text-sm text-gray-600">Complete</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(availableDocs / totalDocs) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="text-sm font-medium text-gray-900">{packageData.customer}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Package Created</p>
                            <p className="text-sm font-medium text-gray-900">{packageData.createdDate}</p>
                        </div>
                    </div>
                </div>

                {/* Document Checklist */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Required Documents Checklist
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Step 1.5 - All mandatory documents for Phase 1 handover
                        </p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {packageData.documents.map((doc) => (
                            <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {getStatusIcon(doc.status)}
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                                            <p className="text-xs text-gray-500">{doc.type}</p>
                                            {doc.uploadDate && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Uploaded on {doc.uploadDate} by {doc.uploadedBy}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}
                                        >
                                            {doc.status}
                                        </span>
                                        {doc.status === 'Available' && (
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <FileText className="w-4 h-4 text-gray-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Banner */}
                {availableDocs !== totalDocs && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-yellow-900">
                                    Handover Package Incomplete
                                </h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    You need to attach all {totalDocs} required documents before you can execute the
                                    handover. Currently missing: {totalDocs - availableDocs} document(s).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {availableDocs === totalDocs && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-green-900">
                                    Handover Package Complete ✓
                                </h3>
                                <p className="text-sm text-green-700 mt-1">
                                    All required documents are attached. You can now execute the handover to transfer
                                    this project to the project execution team.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
