'use client';

import React, { useState } from 'react';
import {
    Wallet,
    Calendar,
    TrendingUp,
    TrendingDown,
    Clock,
    Info,
    Download,
    RefreshCw
} from 'lucide-react';

interface LeaveBalance {
    type: string;
    code: string;
    openingBalance: number;
    accrued: number;
    used: number;
    pending: number;
    lapsed: number;
    available: number;
    carryForward: number;
    maxAccumulation: number;
}

interface LeaveTransaction {
    id: string;
    date: string;
    type: string;
    leaveType: string;
    description: string;
    credit: number;
    debit: number;
    balance: number;
}

export default function MyBalancePage() {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [activeTab, setActiveTab] = useState<'balances' | 'transactions'>('balances');

    const leaveBalances: LeaveBalance[] = [
        {
            type: 'Annual Leave',
            code: 'AL',
            openingBalance: 5,
            accrued: 16,
            used: 5,
            pending: 2,
            lapsed: 0,
            available: 14,
            carryForward: 5,
            maxAccumulation: 30
        },
        {
            type: 'Sick Leave',
            code: 'SL',
            openingBalance: 0,
            accrued: 12,
            used: 3,
            pending: 0,
            lapsed: 0,
            available: 9,
            carryForward: 0,
            maxAccumulation: 12
        },
        {
            type: 'Casual Leave',
            code: 'CL',
            openingBalance: 0,
            accrued: 6,
            used: 2,
            pending: 1,
            lapsed: 0,
            available: 3,
            carryForward: 0,
            maxAccumulation: 6
        },
        {
            type: 'Compensatory Off',
            code: 'CO',
            openingBalance: 2,
            accrued: 2,
            used: 1,
            pending: 0,
            lapsed: 0,
            available: 3,
            carryForward: 0,
            maxAccumulation: 10
        },
        {
            type: 'Maternity Leave',
            code: 'ML',
            openingBalance: 0,
            accrued: 0,
            used: 0,
            pending: 0,
            lapsed: 0,
            available: 182,
            carryForward: 0,
            maxAccumulation: 182
        }
    ];

    const transactions: LeaveTransaction[] = [
        { id: '1', date: '2025-02-01', type: 'Accrual', leaveType: 'Annual Leave', description: 'Monthly accrual', credit: 1.75, debit: 0, balance: 15.75 },
        { id: '2', date: '2025-01-27', type: 'Used', leaveType: 'Annual Leave', description: 'LV-2025-001 Approved', credit: 0, debit: 3, balance: 14 },
        { id: '3', date: '2025-01-25', type: 'Used', leaveType: 'Sick Leave', description: 'LV-2025-002 Approved', credit: 0, debit: 1, balance: 9 },
        { id: '4', date: '2025-01-15', type: 'Pending', leaveType: 'Casual Leave', description: 'LV-2025-003 Pending approval', credit: 0, debit: 2, balance: 3 },
        { id: '5', date: '2025-01-01', type: 'Opening', leaveType: 'Annual Leave', description: 'Carry forward from 2024', credit: 5, debit: 0, balance: 5 },
        { id: '6', date: '2025-01-01', type: 'Accrual', leaveType: 'Annual Leave', description: 'Monthly accrual', credit: 1.75, debit: 0, balance: 6.75 }
    ];

    const totalAvailable = leaveBalances.reduce((sum, b) => sum + b.available, 0);
    const totalUsed = leaveBalances.reduce((sum, b) => sum + b.used, 0);
    const totalPending = leaveBalances.reduce((sum, b) => sum + b.pending, 0);

    const getBalanceColor = (available: number, max: number) => {
        const ratio = available / max;
        if (ratio >= 0.5) return 'text-green-400';
        if (ratio >= 0.25) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
            <div className="w-full space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Wallet className="w-8 h-8 text-green-500" />
                            My Leave Balance
                        </h1>
                        <p className="text-gray-400 mt-1">View your leave balances and transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm">Total Available</p>
                        <p className="text-3xl font-bold text-white">{totalAvailable} days</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">Total Used</p>
                        <p className="text-3xl font-bold text-white">{totalUsed} days</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">Pending Approval</p>
                        <p className="text-3xl font-bold text-white">{totalPending} days</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <p className="text-purple-400 text-sm">Last Updated</p>
                        <p className="text-xl font-bold text-white">Feb 1, 2025</p>
                        <button className="flex items-center gap-1 text-xs text-purple-400 mt-1 hover:text-purple-300">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                    <div className="flex border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab('balances')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'balances'
                                    ? 'text-green-400 border-b-2 border-green-400'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Leave Balances
                        </button>
                        <button
                            onClick={() => setActiveTab('transactions')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'transactions'
                                    ? 'text-green-400 border-b-2 border-green-400'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Transactions
                        </button>
                    </div>

                    {activeTab === 'balances' && (
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left p-3 text-gray-400 font-medium">Leave Type</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Opening</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Accrued</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Used</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Pending</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Available</th>
                                            <th className="text-center p-3 text-gray-400 font-medium">Max</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaveBalances.map((balance) => (
                                            <tr key={balance.code} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                                                            {balance.code}
                                                        </span>
                                                        <span className="text-white font-medium">{balance.type}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center text-gray-300">{balance.openingBalance}</td>
                                                <td className="p-3 text-center">
                                                    <span className="text-green-400">+{balance.accrued}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="text-red-400">-{balance.used}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="text-yellow-400">{balance.pending}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`text-xl font-bold ${getBalanceColor(balance.available, balance.maxAccumulation)}`}>
                                                        {balance.available}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center text-gray-500">{balance.maxAccumulation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="p-4">
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                tx.credit > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                            }`}>
                                                {tx.credit > 0 ? (
                                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{tx.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{tx.leaveType}</span>
                                                    <span className={`px-1.5 py-0.5 rounded ${
                                                        tx.type === 'Accrual' ? 'bg-green-500/20 text-green-400' :
                                                        tx.type === 'Used' ? 'bg-red-500/20 text-red-400' :
                                                        tx.type === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {tx.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {tx.credit > 0 ? (
                                                <p className="text-green-400 font-medium">+{tx.credit} days</p>
                                            ) : (
                                                <p className="text-red-400 font-medium">-{tx.debit} days</p>
                                            )}
                                            <p className="text-xs text-gray-500">Balance: {tx.balance}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                            <p className="text-blue-400 font-medium">Leave Accrual Information</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Annual leaves accrue at 1.75 days per month. Unused annual leaves up to 5 days can be carried forward to the next year. Sick leaves and casual leaves do not carry forward.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
