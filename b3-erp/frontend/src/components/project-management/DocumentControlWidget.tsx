'use client';

import React, { useState } from 'react';
import {
    FileText,
    Upload,
    Trash2,
    Eye,
    CheckCircle2,
    Clock,
    FileImage,
    AlertCircle,
    Plus
} from 'lucide-react';

interface Attachment {
    id: string;
    fileName: string;
    category: string;
    createdAt: string;
    url: string;
}

export function DocumentControlWidget({ projectId, category }: { projectId: string; category?: string }) {
    const [attachments, setAttachments] = useState<Attachment[]>([
        { id: '1', fileName: 'Project_Confirmation_Email.pdf', category: 'CONFIRMATION', createdAt: '2026-02-05T10:00:00Z', url: '#' },
        { id: '2', fileName: 'Site_Layout_V1.dwg', category: 'DRAWING', createdAt: '2026-02-06T14:30:00Z', url: '#' },
    ]);

    const filtered = category ? attachments.filter(a => a.category === category) : attachments;

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Control</h3>
                </div>
                <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="divide-y divide-gray-50">
                {filtered.map((file) => (
                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {file.fileName.endsWith('.pdf') ? <FileText className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">{file.fileName}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">{file.category}</span>
                                    <span className="text-[8px] font-bold text-slate-300">Added 2h ago</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-all">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="p-10 text-center">
                        <Upload className="w-8 h-8 text-slate-200 mx-auto" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">No documents found</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-gray-100">
                <button className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 group hover:border-indigo-300 transition-all">
                    <Upload className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">Drop files to upload</span>
                </button>
            </div>
        </div>
    );
}
