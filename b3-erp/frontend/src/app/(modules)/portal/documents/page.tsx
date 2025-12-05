'use client';

import React, { useState } from 'react';
import { ArrowLeft, Folder, FileText, Download, Search, Grid, List, MoreVertical, Upload } from 'lucide-react';
import Link from 'next/link';

export default function PortalDocumentsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const files = [
        { id: 1, name: 'Invoices', type: 'folder', items: '12 items', date: 'Oct 24, 2025' },
        { id: 2, name: 'Contracts', type: 'folder', items: '3 items', date: 'Sep 15, 2025' },
        { id: 3, name: 'Project Specs', type: 'folder', items: '8 items', date: 'Oct 01, 2025' },
        { id: 4, name: 'Invoice #INV-2025-001.pdf', type: 'file', size: '2.4 MB', date: 'Oct 24, 2025' },
        { id: 5, name: 'Q4 Proposal.pdf', type: 'file', size: '1.8 MB', date: 'Oct 20, 2025' },
        { id: 6, name: 'Kitchen Layout v3.dwg', type: 'file', size: '15.2 MB', date: 'Oct 18, 2025' },
        { id: 7, name: 'Material Selection.xlsx', type: 'file', size: '45 KB', date: 'Oct 15, 2025' },
    ];

    return (
        <div className="w-full max-w-full mx-auto min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/portal" className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                        <p className="text-gray-600 mt-1">Access your invoices, contracts, and project files</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* File List */}
            {viewMode === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date Modified</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Size / Items</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {files.map((file) => (
                                <tr key={file.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {file.type === 'folder' ? (
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                                <Folder className="w-5 h-5" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-red-50 text-red-600 rounded">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-900">{file.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{file.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{file.type === 'folder' ? file.items : file.size}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {files.map((file) => (
                        <div key={file.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                {file.type === 'folder' ? (
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                        <Folder className="w-8 h-8" />
                                    </div>
                                ) : (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                )}
                                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{file.date}</span>
                                <span>{file.type === 'folder' ? file.items : file.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
