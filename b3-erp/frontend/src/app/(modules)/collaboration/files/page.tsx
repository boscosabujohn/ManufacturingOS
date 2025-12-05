'use client';

import React, { useState } from 'react';
import { Folder, FileText, Image, MoreVertical, Search, Plus, Upload, Download, Share2, Trash2, Grid, List, Clock, Star } from 'lucide-react';

export default function FilesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const folders = [
        { id: '1', name: 'Projects', items: 12, size: '1.2 GB', modified: '2 hours ago' },
        { id: '2', name: 'Finance', items: 8, size: '450 MB', modified: 'Yesterday' },
        { id: '3', name: 'Marketing', items: 24, size: '2.8 GB', modified: '3 days ago' },
        { id: '4', name: 'HR Documents', items: 5, size: '120 MB', modified: 'Last week' },
    ];

    const files = [
        { id: '1', name: 'Q4 Financial Report.pdf', type: 'pdf', size: '2.4 MB', modified: '10 mins ago', owner: 'Sarah Wilson' },
        { id: '2', name: 'Project Timeline.xlsx', type: 'excel', size: '1.8 MB', modified: '1 hour ago', owner: 'Mike Johnson' },
        { id: '3', name: 'Site Inspection.jpg', type: 'image', size: '4.2 MB', modified: '3 hours ago', owner: 'David Lee' },
        { id: '4', name: 'Meeting Notes.docx', type: 'doc', size: '45 KB', modified: 'Yesterday', owner: 'Emma Davis' },
        { id: '5', name: 'Design Assets.zip', type: 'zip', size: '156 MB', modified: '2 days ago', owner: 'James Brown' },
    ];

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
            case 'excel': return <FileText className="w-8 h-8 text-green-500" />;
            case 'image': return <Image className="w-8 h-8 text-blue-500" />;
            case 'doc': return <FileText className="w-8 h-8 text-blue-600" />;
            case 'zip': return <Folder className="w-8 h-8 text-yellow-500" />;
            default: return <FileText className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and share your documents</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 whitespace-nowrap">
                            <Upload className="w-4 h-4" />
                            Upload
                        </button>
                    </div>
                </div>

                {/* Quick Access */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Recent
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2">
                        <Star className="w-4 h-4" /> Starred
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Shared with me
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Trash
                    </button>
                </div>

                {/* Folders */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Folders</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <div key={folder.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <Folder className="w-10 h-10 text-blue-500 fill-blue-100" />
                                    <button className="p-1 hover:bg-gray-100 rounded-full">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                    <span>{folder.items} items</span>
                                    <span>{folder.size}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Files */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Files</h2>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {files.map((file) => (
                                <div key={file.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        {getFileIcon(file.type)}
                                        <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                    <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{file.size} • {file.modified}</p>
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                            {file.owner[0]}
                                        </div>
                                        <span className="text-xs text-gray-500 truncate">{file.owner}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Modified</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Owner</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {files.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                {getFileIcon(file.type)}
                                                <span className="font-medium text-gray-900">{file.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{file.size}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{file.modified}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{file.owner}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
