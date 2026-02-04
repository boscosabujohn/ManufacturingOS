'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Folder, Activity, Users, Bell, Search, Plus, FileText, Image, MoreHorizontal } from 'lucide-react';

export default function CollaborationPage() {
    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Collaboration Hub</h1>
                        <p className="text-sm text-gray-500 mt-1">Connect, share, and stay updated with your team</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/collaboration/messaging" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">3 New</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Messaging</h3>
                            <p className="text-sm text-gray-600">Chat with team members and groups</p>
                        </div>
                    </Link>

                    <Link href="/collaboration/files" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-purple-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <Folder className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">File Sharing</h3>
                            <p className="text-sm text-gray-600">Access and share documents securely</p>
                        </div>
                    </Link>

                    <Link href="/collaboration/feed" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-green-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Live</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Activity Feed</h3>
                            <p className="text-sm text-gray-600">Company updates and system notifications</p>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                            <Link href="/collaboration/feed" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {[
                                { user: 'Sarah Wilson', action: 'uploaded a new document', target: 'Q4 Financial Report.pdf', time: '10 mins ago', icon: FileText, color: 'bg-blue-100 text-blue-600' },
                                { user: 'Mike Johnson', action: 'commented on', target: 'Project Alpha Timeline', time: '1 hour ago', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
                                { user: 'System', action: 'completed', target: 'Weekly Backup', time: '2 hours ago', icon: Activity, color: 'bg-green-100 text-green-600' },
                                { user: 'David Lee', action: 'shared an image', target: 'Site Inspection.jpg', time: '3 hours ago', icon: Image, color: 'bg-orange-100 text-orange-600' },
                            ].map((activity, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className={`p-2 rounded-full h-fit ${activity.color}`}>
                                        <activity.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Online Users */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Online Team</h2>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">12 Online</span>
                        </div>
                        <div className="space-y-4">
                            {['Sarah Wilson', 'Mike Johnson', 'David Lee', 'Emma Davis', 'James Brown'].map((user, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                                            {user.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user}</p>
                                        <p className="text-xs text-gray-500">Available</p>
                                    </div>
                                    <button className="ml-auto p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                            View All Members
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
