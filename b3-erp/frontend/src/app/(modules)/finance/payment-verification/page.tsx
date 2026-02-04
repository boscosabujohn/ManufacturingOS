'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    ArrowLeft,
    FileText,
    AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentVerification {
    id: string;
    woNumber: string;
    customerName: string;
    totalAmount: number;
    paidAmount: number;
    paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Credit Approved' | 'Override';
    paymentMethod?: string;
    receiptNumber?: string;
    creditApproval?: {
        approvedBy: string;
        approvalDate: string;
        creditLimit: number;
    };
    status: 'Verified' | 'Pending Verification' | 'Rejected' | 'Sales Notified';
    verifiedBy?: string;
    verificationDate?: string;
    notes?: string;
}

const mockVerifications: PaymentVerification[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        customerName: 'Hotel Paradise Ltd',
        totalAmount: 450000,
        paidAmount: 450000,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        receiptNumber: 'RCP-2025-001',
        status: 'Verified',
        verifiedBy: 'Accounts Manager',
        verificationDate: '2025-01-24',
        notes: 'Full payment received. Cleared for dispatch.',
    },
    {
        id: '2',
        woNumber: 'WO-2025-003',
        customerName: 'Springfield Academy',
        totalAmount: 320000,
        paidAmount: 320000,
        paymentStatus: 'Credit Approved',
        creditApproval: {
            approvedBy: 'Finance Director',
            approvalDate: '2025-01-23',
            creditLimit: 500000,
        },
        status: 'Verified',
        verifiedBy: 'Accounts Manager',
        verificationDate: '2025-01-23',
        notes: 'Credit approved. 30-day payment terms.',
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        customerName: 'City General Hospital',
        totalAmount: 280000,
        paidAmount: 100000,
        paymentStatus: 'Partial',
        paymentMethod: 'Cheque',
        receiptNumber: 'RCP-2025-002',
        status: 'Sales Notified',
        notes: 'Partial payment received. Sales team notified for follow-up.',
    },
];

export default function PaymentVerificationPage() {
    const { toast } = useToast();
    const [verifications] = useState<PaymentVerification[]>(mockVerifications);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredVerifications = verifications.filter(
        (ver) => filterStatus === 'all' || ver.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Sales Notified':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Pending Verification':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
            case 'Credit Approved':
                return 'bg-green-100 text-green-800';
            case 'Partial':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pending':
                return 'bg-red-100 text-red-800';
            case 'Override':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = {
        total: verifications.length,
        verified: verifications.filter((v) => v.status === 'Verified').length,
        pending: verifications.filter((v) => v.status === 'Pending Verification' || v.status === 'Sales Notified').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-3 py-2 space-y-3">
                {/* Header */}
                <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                        <Link href="/packaging/staging" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Payment Verification Gate</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Verify payments before dispatch (Steps 7.1-7.3)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Verified</p>
                                <p className="text-2xl font-bold text-green-900">{stats.verified}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg border p-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Verified">Verified</option>
                        <option value="Sales Notified">Sales Notified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* Verifications List */}
                <div className="grid gap-2">
                    {filteredVerifications.map((ver) => {
                        const paymentPercentage = (ver.paidAmount / ver.totalAmount) * 100;

                        return (
                            <div key={ver.id} className="bg-white rounded-lg border p-3 hover:shadow-lg transition">
                                <div className="flex items-start gap-2">
                                    <div className={`w-16 h-16 rounded-lg ${ver.status === 'Verified' ? 'bg-green-500' : 'bg-yellow-500'} flex items-center justify-center`}>
                                        <DollarSign className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold">{ver.customerName}</h3>
                                                <p className="text-sm text-gray-600">{ver.woNumber}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(ver.paymentStatus)}`}>
                                                    {ver.paymentStatus}
                                                </span>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(ver.status)}`}>
                                                    {ver.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Total Amount</p>
                                                <p className="font-bold text-gray-900">₹{ver.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Paid Amount</p>
                                                <p className="font-bold text-green-600">₹{ver.paidAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Method</p>
                                                <p className="font-medium">{ver.paymentMethod || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Receipt Number</p>
                                                <p className="font-medium">{ver.receiptNumber || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Payment Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700">
                                                    Payment: ₹{ver.paidAmount.toLocaleString()} / ₹{ver.totalAmount.toLocaleString()} ({paymentPercentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${paymentPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${paymentPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Credit Approval */}
                                        {ver.creditApproval && (
                                            <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-2">
                                                <p className="text-xs font-semibold text-purple-900 mb-1">Credit Approval</p>
                                                <div className="grid grid-cols-3 gap-2 text-xs text-purple-800">
                                                    <span>Approved by: {ver.creditApproval.approvedBy}</span>
                                                    <span>Date: {ver.creditApproval.approvalDate}</span>
                                                    <span>Credit Limit: ₹{ver.creditApproval.creditLimit.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Verification Info */}
                                        {ver.verifiedBy && (
                                            <div className="bg-green-50 border border-green-200 rounded p-2 text-sm mb-2">
                                                <span className="font-medium text-green-800">
                                                    Verified by {ver.verifiedBy} on {ver.verificationDate}
                                                </span>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {ver.notes && (
                                            <div className={`border rounded p-2 text-sm ${ver.status === 'Verified' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                                                <strong>Note:</strong> {ver.notes}
                                            </div>
                                        )}
                                    </div>
                                    {/* Actions */}
                                    <div className="mt-4 flex gap-3 border-t pt-4">
                                        <button
                                            onClick={() => {
                                                toast({
                                                    title: "Opening Details",
                                                    description: `Viewing details for ${ver.woNumber}`,
                                                });
                                            }}
                                            className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                        >
                                            View Details
                                        </button>
                                        {ver.status === 'Pending Verification' && (
                                            <button
                                                onClick={() => {
                                                    toast({
                                                        title: "Payment Verified",
                                                        description: `Payment for ${ver.woNumber} has been verified.`,
                                                        variant: "default",
                                                    });
                                                }}
                                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                            >
                                                Verify Payment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
