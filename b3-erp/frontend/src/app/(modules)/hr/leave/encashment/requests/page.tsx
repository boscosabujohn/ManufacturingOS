'use client';

import React, { useState } from 'react';
import {
    DollarSign,
    Plus,
    Send,
    Calendar,
    Clock,
    Info,
    Calculator
} from 'lucide-react';

interface EncashableLeave {
    type: string;
    available: number;
    encashable: number;
    ratePerDay: number;
}

export default function EncashmentRequestsPage() {
    const [selectedLeaveType, setSelectedLeaveType] = useState('');
    const [daysToEncash, setDaysToEncash] = useState<number>(0);
    const [remarks, setRemarks] = useState('');

    const encashableLeaves: EncashableLeave[] = [
        { type: 'Annual Leave', available: 14, encashable: 10, ratePerDay: 2500 },
        { type: 'Earned Leave', available: 8, encashable: 8, ratePerDay: 2500 },
        { type: 'Compensatory Off', available: 3, encashable: 3, ratePerDay: 2000 }
    ];

    const selectedLeave = encashableLeaves.find(l => l.type === selectedLeaveType);
    const estimatedAmount = selectedLeave ? daysToEncash * selectedLeave.ratePerDay : 0;

    const previousRequests = [
        {
            id: 'EN-2024-005',
            date: '2024-12-15',
            leaveType: 'Annual Leave',
            days: 5,
            amount: 12500,
            status: 'Approved',
            disbursedDate: '2024-12-28'
        },
        {
            id: 'EN-2024-003',
            date: '2024-06-20',
            leaveType: 'Earned Leave',
            days: 3,
            amount: 7500,
            status: 'Approved',
            disbursedDate: '2024-07-05'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Rejected': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-green-500" />
                            Encashment Requests
                        </h1>
                        <p className="text-gray-400 mt-1">Submit leave encashment requests</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {encashableLeaves.map((leave) => (
                        <div
                            key={leave.type}
                            className={`rounded-xl p-4 border cursor-pointer transition-all ${
                                selectedLeaveType === leave.type
                                    ? 'bg-green-500/20 border-green-500/50'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => {
                                setSelectedLeaveType(leave.type);
                                setDaysToEncash(0);
                            }}
                        >
                            <p className="text-gray-400 text-sm">{leave.type}</p>
                            <p className="text-3xl font-bold text-white">{leave.encashable} days</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Available: {leave.available} | Rate: ${leave.ratePerDay}/day
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6">New Encashment Request</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Leave Type *</label>
                                <select
                                    value={selectedLeaveType}
                                    onChange={(e) => {
                                        setSelectedLeaveType(e.target.value);
                                        setDaysToEncash(0);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Leave Type</option>
                                    {encashableLeaves.map(leave => (
                                        <option key={leave.type} value={leave.type}>
                                            {leave.type} ({leave.encashable} days encashable)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedLeave && (
                                <>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Days to Encash * (Max: {selectedLeave.encashable})
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedLeave.encashable}
                                            value={daysToEncash || ''}
                                            onChange={(e) => setDaysToEncash(Math.min(parseInt(e.target.value) || 0, selectedLeave.encashable))}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Enter number of days"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={selectedLeave.encashable}
                                            value={daysToEncash}
                                            onChange={(e) => setDaysToEncash(parseInt(e.target.value))}
                                            className="w-full mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Remarks (Optional)</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            rows={3}
                                            placeholder="Any additional notes..."
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                disabled={!selectedLeaveType || daysToEncash <= 0}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Submit Encashment Request
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {selectedLeave && daysToEncash > 0 && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-green-400" />
                                    Estimated Amount
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Days</span>
                                        <span className="text-white font-medium">{daysToEncash}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Rate per Day</span>
                                        <span className="text-white font-medium">${selectedLeave.ratePerDay}</span>
                                    </div>
                                    <hr className="border-gray-700" />
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Gross Amount</span>
                                        <span className="text-2xl font-bold text-green-400">${estimatedAmount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">* Actual amount may vary after tax deductions</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-blue-400 font-medium">Encashment Policy</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Leave encashment is processed twice a year (June & December). Minimum 3 days required for encashment. Maximum encashable leaves: 10 days per request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Previous Encashment Requests</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-3 text-gray-400 font-medium">Request ID</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Date</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Leave Type</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Days</th>
                                    <th className="text-right p-3 text-gray-400 font-medium">Amount</th>
                                    <th className="text-center p-3 text-gray-400 font-medium">Status</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Disbursed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previousRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-3 text-white font-mono">{request.id}</td>
                                        <td className="p-3 text-gray-300">{new Date(request.date).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-300">{request.leaveType}</td>
                                        <td className="p-3 text-center text-gray-300">{request.days}</td>
                                        <td className="p-3 text-right text-green-400 font-medium">${request.amount.toLocaleString()}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-400 text-sm">
                                            {request.disbursedDate ? new Date(request.disbursedDate).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
