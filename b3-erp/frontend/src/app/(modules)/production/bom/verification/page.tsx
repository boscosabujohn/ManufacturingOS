'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Package,
    DollarSign,
    Users,
    Calendar,
    ClipboardCheck,
    Send,
} from 'lucide-react';

interface VerificationCheck {
    id: string;
    category: string;
    checkName: string;
    status: 'Pass' | 'Fail' | 'Warning';
    details: string;
}

interface BOMVerification {
    id: string;
    bomCode: string;
    productName: string;
    verificationDate: string;
    verifiedBy: string;
    status: 'Verified' | 'Pending' | 'Failed' | 'In Review';
    completeness: number;
    checks: VerificationCheck[];
    submittedToProcurement: boolean;
}

const mockVerifications: BOMVerification[] = [
    {
        id: '1',
        bomCode: 'BOM-KIT-001',
        productName: 'Premium SS304 Kitchen Sink - Double Bowl',
        verificationDate: '2025-01-20',
        verifiedBy: 'Technical Lead',
        status: 'Verified',
        completeness: 100,
        submittedToProcurement: true,
        checks: [
            {
                id: '1',
                category: 'Completeness',
                checkName: 'All Items Have Part Numbers',
                status: 'Pass',
                details: '24/24 items have valid part numbers',
            },
            {
                id: '2',
                category: 'Completeness',
                checkName: 'Quantities Specified',
                status: 'Pass',
                details: 'All quantities specified and valid',
            },
            {
                id: '3',
                category: 'Suppliers',
                checkName: 'Suppliers Identified',
                status: 'Pass',
                details: '24/24 items have assigned suppliers',
            },
            {
                id: '4',
                category: 'Costing',
                checkName: 'Costs Estimated',
                status: 'Pass',
                details: 'All items have cost estimates',
            },
            {
                id: '5',
                category: 'Categories',
                checkName: 'Accessories Categorized',
                status: 'Pass',
                details: '8 accessories properly categorized',
            },
            {
                id: '6',
                category: 'Categories',
                checkName: 'Fittings Categorized',
                status: 'Pass',
                details: '6 fittings properly categorized',
            },
        ],
    },
    {
        id: '2',
        bomCode: 'BOM-KIT-003',
        productName: 'Granite Composite Sink - Single Bowl',
        verificationDate: '2025-01-21',
        verifiedBy: 'Technical Lead',
        status: 'In Review',
        completeness: 80,
        submittedToProcurement: false,
        checks: [
            {
                id: '1',
                category: 'Completeness',
                checkName: 'All Items Have Part Numbers',
                status: 'Pass',
                details: '15/15 items have valid part numbers',
            },
            {
                id: '2',
                category: 'Completeness',
                checkName: 'Quantities Specified',
                status: 'Pass',
                details: 'All quantities specified',
            },
            {
                id: '3',
                category: 'Suppliers',
                checkName: 'Suppliers Identified',
                status: 'Warning',
                details: '12/15 items have suppliers - 3 pending',
            },
            {
                id: '4',
                category: 'Costing',
                checkName: 'Costs Estimated',
                status: 'Warning',
                details: '13/15 items costed - 2 pending quotes',
            },
            {
                id: '5',
                category: 'Categories',
                checkName: 'Accessories Categorized',
                status: 'Pass',
                details: '5 accessories categorized',
            },
            {
                id: '6',
                category: 'Categories',
                checkName: 'Fittings Categorized',
                status: 'Pass',
                details: '4 fittings categorized',
            },
        ],
    },
    {
        id: '3',
        bomCode: 'BOM-KIT-008',
        productName: 'Pull-Down Kitchen Faucet - Brushed Nickel',
        verificationDate: '2025-01-22',
        verifiedBy: 'Technical Lead',
        status: 'Failed',
        completeness: 45,
        submittedToProcurement: false,
        checks: [
            {
                id: '1',
                category: 'Completeness',
                checkName: 'All Items Have Part Numbers',
                status: 'Fail',
                details: '18/22 items have part numbers - 4 missing',
            },
            {
                id: '2',
                category: 'Completeness',
                checkName: 'Quantities Specified',
                status: 'Pass',
                details: 'All quantities specified',
            },
            {
                id: '3',
                category: 'Suppliers',
                checkName: 'Suppliers Identified',
                status: 'Fail',
                details: 'Only 10/22 items have suppliers',
            },
            {
                id: '4',
                category: 'Costing',
                checkName: 'Costs Estimated',
                status: 'Fail',
                details: 'Only 12/22 items have costs',
            },
            {
                id: '5',
                category: 'Categories',
                checkName: 'Accessories Categorized',
                status: 'Warning',
                details: '3/5 accessories need categorization',
            },
            {
                id: '6',
                category: 'Categories',
                checkName: 'Fittings Categorized',
                status: 'Warning',
                details: '2/4 fittings need categorization',
            },
        ],
    },
];

export default function BOMVerificationPage() {
    const [verifications] = useState<BOMVerification[]>(mockVerifications);
    const [selectedVerification, setSelectedVerification] = useState<BOMVerification | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'In Review':
                return 'bg-yellow-100 text-yellow-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCheckIcon = (status: string) => {
        switch (status) {
            case 'Pass':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'Warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'Fail':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    const stats = {
        total: verifications.length,
        verified: verifications.filter((v) => v.status === 'Verified').length,
        inReview: verifications.filter((v) => v.status === 'In Review').length,
        failed: verifications.filter((v) => v.status === 'Failed').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="px-3 py-2 space-y-3">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/production/bom"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    BOM Verification & Completeness Check
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Phase 3: Verify BOM completeness before procurement submission
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total BOMs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Verified</p>
                                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Review</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.inReview}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Verifications List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">BOM Verification Status</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {verifications.map((verification) => (
                            <div key={verification.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {verification.bomCode} - {verification.productName}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Verification Date</p>
                                                <p className="font-medium text-gray-900 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {verification.verificationDate}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Verified By</p>
                                                <p className="font-medium text-gray-900 flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {verification.verifiedBy}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Completeness</p>
                                                <p className="font-medium text-gray-900">{verification.completeness}%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Procurement</p>
                                                <p className={`font-medium ${verification.submittedToProcurement ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {verification.submittedToProcurement ? 'Submitted ✓' : 'Not Submitted'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-600">Verification Progress</span>
                                                <span className="font-medium text-gray-900">{verification.completeness}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${verification.completeness === 100
                                                            ? 'bg-green-600'
                                                            : verification.completeness >= 80
                                                                ? 'bg-yellow-600'
                                                                : 'bg-red-600'
                                                        }`}
                                                    style={{ width: `${verification.completeness}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            {verification.checks.filter((c) => c.status === 'Pass').length > 0 && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    {verification.checks.filter((c) => c.status === 'Pass').length} passed
                                                </span>
                                            )}
                                            {verification.checks.filter((c) => c.status === 'Warning').length > 0 && (
                                                <span className="flex items-center gap-1 text-yellow-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {verification.checks.filter((c) => c.status === 'Warning').length} warnings
                                                </span>
                                            )}
                                            {verification.checks.filter((c) => c.status === 'Fail').length > 0 && (
                                                <span className="flex items-center gap-1 text-red-600">
                                                    <XCircle className="w-4 h-4" />
                                                    {verification.checks.filter((c) => c.status === 'Fail').length} failed
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ml-6 flex flex-col items-end gap-3">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}>
                                            {verification.status}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedVerification(verification);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium"
                                            >
                                                <ClipboardCheck className="w-4 h-4 inline mr-1" />
                                                View Details
                                            </button>
                                            {verification.status === 'Verified' && !verification.submittedToProcurement && (
                                                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium">
                                                    <Send className="w-4 h-4 inline mr-1" />
                                                    Submit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedVerification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-3 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">Verification Checklist</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{selectedVerification.productName}</h3>
                                <p className="text-sm text-gray-600">{selectedVerification.bomCode}</p>
                            </div>

                            <div className="space-y-3">
                                {selectedVerification.checks.map((check) => (
                                    <div
                                        key={check.id}
                                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                                    >
                                        {getCheckIcon(check.status)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-gray-900">{check.checkName}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${check.status === 'Pass' ? 'bg-green-100 text-green-800' :
                                                        check.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {check.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">{check.category}</p>
                                            <p className="text-sm text-gray-700">{check.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedVerification.status === 'Verified' && (
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Submit to Procurement
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">About BOM Verification</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Step 3.11: Verify BOM completeness before submitting to procurement. System checks
                                for part numbers, quantities, supplier assignments, cost estimates, and proper
                                categorization of accessories and fittings. Only 100% verified BOMs can be submitted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
