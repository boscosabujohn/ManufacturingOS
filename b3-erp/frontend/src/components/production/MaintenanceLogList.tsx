'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, History, CheckCircle, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { workCenterService } from '@/services/work-center.service';

interface MaintenanceLog {
    id: string;
    maintenanceType: string;
    status: string;
    description: string;
    scheduledDate: string;
    startDate?: string;
    endDate?: string;
    cost: number;
    performedBy: string;
}

interface MaintenanceLogListProps {
    workCenterId: string;
}

export const MaintenanceLogList: React.FC<MaintenanceLogListProps> = ({ workCenterId }) => {
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await workCenterService.getMaintenanceLogs(workCenterId);
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [workCenterId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Scheduled': return 'bg-yellow-100 text-yellow-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'In Progress': return <Clock className="w-4 h-4" />;
            case 'Scheduled': return <Clock className="w-4 h-4" />;
            case 'Overdue': return <AlertTriangle className="w-4 h-4" />;
            default: return <History className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Wrench className="w-4 h-4 text-orange-600" />
                    Maintenance History
                </h3>
                <button className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 font-semibold transition-colors">
                    View All
                </button>
            </div>

            <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500">Loading history...</div>
                ) : logs.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No maintenance logs found</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(log.status)} flex items-center gap-1`}>
                                        {getStatusIcon(log.status)}
                                        {log.status}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900">{log.maintenanceType}</span>
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">
                                    {new Date(log.scheduledDate).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-2">{log.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] text-gray-500">
                                    By: <span className="font-semibold text-gray-700">{log.performedBy || 'System'}</span>
                                </div>
                                <div className="text-[10px] text-orange-600 font-bold">
                                    Cost: ₹{log.cost.toLocaleString()}
                                </div>
                            </div>
                            <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-orange-50/50">
                <button className="w-full py-2 bg-white border border-orange-200 rounded-lg text-orange-600 text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Plus className="w-3 h-3" />
                    Log Maintenance
                </button>
            </div>
        </div>
    );
};
