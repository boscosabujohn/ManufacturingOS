'use client';

import React from 'react';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileUp,
    ExternalLink,
    Search
} from 'lucide-react';

interface Document {
    id: string;
    name: string;
    category: 'Confirmation' | 'Technical' | 'Financial' | 'Legal';
    status: 'Approved' | 'Under Review' | 'Missing';
    uploadDate?: string;
}

const mockDocuments: Document[] = [
    { id: '1', name: 'Award Letter - Taj Hotel', category: 'Confirmation', status: 'Approved', uploadDate: '2026-01-05' },
    { id: '2', name: 'Signed Contract - Taj Hotel', category: 'Confirmation', status: 'Approved', uploadDate: '2026-01-07' },
    { id: '3', name: 'Handover Package - Hyatt Dubai', category: 'Confirmation', status: 'Under Review', uploadDate: '2026-02-01' },
    { id: '4', name: 'Confirmation Mail - private villa', category: 'Confirmation', status: 'Missing' },
];

export function DocumentControlWidget() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Document Control (Phase 1)</h2>
                </div>
                <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-800 font-medium">
                        3 of 4 projects have confirmed handover packages.
                    </p>
                </div>

                <div className="space-y-3">
                    {mockDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center ${doc.status === 'Approved' ? 'bg-green-50' :
                                        doc.status === 'Under Review' ? 'bg-blue-50' : 'bg-red-50'
                                    }`}>
                                    <FileText className={`w-4 h-4 ${doc.status === 'Approved' ? 'text-green-600' :
                                            doc.status === 'Under Review' ? 'text-blue-600' : 'text-red-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-none">{doc.name}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {doc.category} • {doc.uploadDate || 'Not Uploaded'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {doc.status === 'Approved' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : doc.status === 'Under Review' ? (
                                    <Clock className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <button className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-red-700">
                                        <FileUp className="w-3 h-3" />
                                        Upload
                                    </button>
                                )}
                                {doc.status !== 'Missing' && (
                                    <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2 text-[10px] font-bold text-gray-500 uppercase">
                        <span>Handover Status</span>
                        <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentControlWidget;
