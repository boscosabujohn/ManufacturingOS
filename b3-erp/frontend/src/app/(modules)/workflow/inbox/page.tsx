'use client';

import React, { useState } from 'react';
import {
    Inbox,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight,
    Search,
    Filter,
    RefreshCw,
    FileText,
    ShoppingCart,
    Truck,
    Users,
    DollarSign,
    Package,
    ClipboardCheck,
    Calendar,
    User,
    MoreVertical,
    Eye,
    CheckSquare,
    XCircle,
    ArrowUpRight,
    Zap
} from 'lucide-react';
import Link from 'next/link';

interface UserTask {
    id: string;
    taskType: 'approval' | 'action' | 'review';
    title: string;
    description: string;
    module: string;
    moduleIcon: React.ElementType;
    moduleUrl: string;
    referenceNumber: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    dueDate?: string;
    slaStatus?: 'on-track' | 'warning' | 'breached';
    requester: string;
    amount?: number;
}

// Mock data for demonstration
const mockTasks: UserTask[] = [
    {
        id: '1',
        taskType: 'approval',
        title: 'Purchase Order Approval Required',
        description: 'PO for raw materials from ABC Suppliers - Steel plates and aluminum sheets',
        module: 'Procurement',
        moduleIcon: ShoppingCart,
        moduleUrl: '/procurement/purchase-orders/PO-2024-0892',
        referenceNumber: 'PO-2024-0892',
        priority: 'high',
        status: 'pending',
        createdAt: '2024-01-22 09:30',
        dueDate: '2024-01-23',
        slaStatus: 'warning',
        requester: 'John Smith',
        amount: 45000
    },
    {
        id: '2',
        taskType: 'approval',
        title: 'Sales Quotation Review',
        description: 'Customer quotation for Tech Industries - Annual contract renewal',
        module: 'Sales',
        moduleIcon: FileText,
        moduleUrl: '/crm/quotations/QUO-2024-1234',
        referenceNumber: 'QUO-2024-1234',
        priority: 'critical',
        status: 'pending',
        createdAt: '2024-01-22 08:15',
        dueDate: '2024-01-22',
        slaStatus: 'breached',
        requester: 'Sarah Johnson',
        amount: 125000
    },
    {
        id: '3',
        taskType: 'review',
        title: 'Shipment Documentation Verification',
        description: 'Export documentation for Dubai shipment - Customs clearance pending',
        module: 'Logistics',
        moduleIcon: Truck,
        moduleUrl: '/logistics/shipping/outbound/SHP-2024-0567',
        referenceNumber: 'SHP-2024-0567',
        priority: 'high',
        status: 'pending',
        createdAt: '2024-01-22 07:45',
        dueDate: '2024-01-23',
        slaStatus: 'on-track',
        requester: 'Mike Davis'
    },
    {
        id: '4',
        taskType: 'approval',
        title: 'Employee Leave Request',
        description: 'Annual leave request from Engineering Department - 5 working days',
        module: 'HR',
        moduleIcon: Users,
        moduleUrl: '/hr/leave/requests/LR-2024-0234',
        referenceNumber: 'LR-2024-0234',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-01-21 16:00',
        slaStatus: 'on-track',
        requester: 'David Chen'
    },
    {
        id: '5',
        taskType: 'approval',
        title: 'Invoice Payment Approval',
        description: 'Vendor invoice for IT equipment and software licenses',
        module: 'Finance',
        moduleIcon: DollarSign,
        moduleUrl: '/finance/invoices/INV-2024-3456',
        referenceNumber: 'INV-2024-3456',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2024-01-21 14:30',
        dueDate: '2024-01-24',
        slaStatus: 'on-track',
        requester: 'Lisa Wong',
        amount: 78500
    },
    {
        id: '6',
        taskType: 'action',
        title: 'Quality Inspection Report',
        description: 'NCR resolution requires your sign-off - Batch QC-2024-089',
        module: 'Quality',
        moduleIcon: ClipboardCheck,
        moduleUrl: '/quality/ncr/NCR-2024-0089',
        referenceNumber: 'NCR-2024-0089',
        priority: 'critical',
        status: 'pending',
        createdAt: '2024-01-21 11:00',
        dueDate: '2024-01-22',
        slaStatus: 'warning',
        requester: 'Quality Team'
    },
    {
        id: '7',
        taskType: 'review',
        title: 'Inventory Adjustment Review',
        description: 'Stock count variance reconciliation for Warehouse A',
        module: 'Inventory',
        moduleIcon: Package,
        moduleUrl: '/inventory/adjustments/ADJ-2024-0045',
        referenceNumber: 'ADJ-2024-0045',
        priority: 'low',
        status: 'pending',
        createdAt: '2024-01-20 09:00',
        slaStatus: 'on-track',
        requester: 'Warehouse Team'
    }
];

const counts = {
    total: 7,
    pending: 5,
    inProgress: 1,
    overdue: 2,
    critical: 2
};

export default function TaskInbox() {
    const [tasks] = useState<UserTask[]>(mockTasks);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTaskTypeStyles = (type: string) => {
        switch (type) {
            case 'approval': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'action': return 'bg-green-50 text-green-600 border-green-200';
            case 'review': return 'bg-blue-50 text-blue-600 border-blue-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getSLAIndicator = (slaStatus?: string) => {
        if (!slaStatus) return null;
        switch (slaStatus) {
            case 'on-track':
                return <span className="flex items-center gap-1 text-[10px] font-bold text-green-600"><CheckCircle2 className="w-3 h-3" /> On Track</span>;
            case 'warning':
                return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600"><Clock className="w-3 h-3" /> Due Soon</span>;
            case 'breached':
                return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600"><AlertTriangle className="w-3 h-3" /> Overdue</span>;
            default:
                return null;
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'pending') return task.status === 'pending';
        if (activeTab === 'overdue') return task.slaStatus === 'breached';
        if (activeTab === 'critical') return task.priority === 'critical';
        return true;
    });

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="px-3 py-2 bg-white border-b border-gray-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Inbox className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Task Inbox</h1>
                            <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest leading-none">
                                Manage pending tasks and approvals
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-md font-black uppercase text-[10px] tracking-widest">
                            <Zap className="w-4 h-4" /> Process All
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tasks</p>
                                <p className="text-3xl font-black text-gray-900 mt-1 italic tracking-tighter">{counts.total}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Inbox className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pending</p>
                                <p className="text-3xl font-black text-blue-600 mt-1 italic tracking-tighter">{counts.pending}</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-yellow-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">In Progress</p>
                                <p className="text-3xl font-black text-yellow-600 mt-1 italic tracking-tighter">{counts.inProgress}</p>
                            </div>
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <RefreshCw className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Overdue</p>
                                <p className="text-3xl font-black text-red-600 mt-1 italic tracking-tighter">{counts.overdue}</p>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-xl text-white shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Critical</p>
                                <p className="text-3xl font-black text-white mt-1 italic tracking-tighter">{counts.critical}</p>
                            </div>
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { id: 'all', label: 'All Tasks', count: counts.total },
                                { id: 'pending', label: 'Pending', count: counts.pending },
                                { id: 'overdue', label: 'Overdue', count: counts.overdue },
                                { id: 'critical', label: 'Critical', count: counts.critical }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === tab.id
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${activeTab === tab.id ? 'bg-orange-500' : 'bg-gray-200'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-gray-900 font-bold text-lg mb-1">You're all caught up! 🎉</p>
                            <p className="text-gray-500 text-sm">No tasks found in this category</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => {
                            const ModuleIcon = task.moduleIcon;
                            return (
                                <Link key={task.id} href={task.moduleUrl} className="block">
                                    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group ${task.slaStatus === 'breached' ? 'border-red-200 bg-red-50/30' :
                                            task.priority === 'critical' ? 'border-orange-200' : 'border-gray-100'
                                        }`}>
                                        <div className="p-4">
                                            <div className="flex items-start gap-2">
                                                {/* Module Icon */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${task.priority === 'critical' ? 'bg-red-100 text-red-600' :
                                                        task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    <ModuleIcon className="w-6 h-6" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityStyles(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getTaskTypeStyles(task.taskType)}`}>
                                                            {task.taskType}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-600">
                                                            {task.module}
                                                        </span>
                                                        {getSLAIndicator(task.slaStatus)}
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">{task.description}</p>

                                                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> {task.referenceNumber}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" /> {task.requester}
                                                        </span>
                                                        {task.dueDate && (
                                                            <span className={`flex items-center gap-1 ${task.slaStatus === 'breached' ? 'text-red-500 font-bold' : ''}`}>
                                                                <Calendar className="w-3 h-3" /> Due: {task.dueDate}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {task.createdAt}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Amount & Actions */}
                                                <div className="text-right flex-shrink-0">
                                                    {task.amount && (
                                                        <p className="text-lg font-black text-gray-900 italic tracking-tighter">
                                                            ${task.amount.toLocaleString()}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 bg-green-100 rounded-lg text-green-600 hover:bg-green-200" onClick={(e) => e.preventDefault()}>
                                                            <CheckSquare className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1.5 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200" onClick={(e) => e.preventDefault()}>
                                                            <Eye className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1.5 bg-red-100 rounded-lg text-red-600 hover:bg-red-200" onClick={(e) => e.preventDefault()}>
                                                            <XCircle className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Chevron */}
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                        <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Urgent Attention
                        </h4>
                        <p className="text-[11px] text-orange-700">
                            2 tasks are overdue and require immediate attention. Customer quotation and quality inspection deadlines have passed.
                        </p>
                        <button className="mt-3 text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-1 hover:text-orange-900">
                            View Overdue Tasks <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Due Today
                        </h4>
                        <p className="text-[11px] text-blue-700">
                            3 tasks are due today. Review and process them before end of business to maintain SLA compliance.
                        </p>
                        <button className="mt-3 text-[10px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1 hover:text-blue-900">
                            View Today's Tasks <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
