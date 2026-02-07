'use client';

import React, { useState } from 'react';
import {
    Wrench,
    Clock,
    CheckCircle2,
    AlertCircle,
    Camera,
    ListTodo,
    ChevronRight,
    Play,
    Pause
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function FieldAgentInstallerUI() {
    const { id } = useParams() as { id: string };

    const tasks = [
        { id: '1', name: 'Anchor Point Marking', status: 'Done', progress: 100 },
        { id: '2', name: 'Main Chassis Assembly', status: 'In Progress', progress: 65 },
        { id: '3', name: 'Leveling & Calibration', status: 'Todo', progress: 0 },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 px-3 py-4 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">Installation Feed</h1>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">Field Terminal | Active Site</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-emerald-600 uppercase">Live Sync</span>
                </div>
            </div>

            {/* Task Stream */}
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${task.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                    }`}>
                                    <ListTodo className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{task.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600" style={{ width: `${task.progress}%` }}></div>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 italic">{task.progress}%</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-300">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {task.status === 'In Progress' && (
                            <div className="px-4 pb-4 flex gap-2">
                                <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Camera className="w-3.5 h-3.5" /> Log Evidence
                                </button>
                                <button className="px-4 py-2 bg-slate-50 text-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest">
                                    Update %
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 fixed bottom-6 left-3 right-3 max-w-2xl mx-auto">
                <button className="py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-rose-100">
                    <AlertCircle className="w-4 h-4" /> Log Snag
                </button>
                <button className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                    <CheckCircle2 className="w-4 h-4" /> Complete Site
                </button>
            </div>
        </div>
    );
}
