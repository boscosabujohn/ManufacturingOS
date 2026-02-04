'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Circle, ArrowRight, Play, FileText, Users, Settings, Database, Shield } from 'lucide-react';
import Link from 'next/link';

interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    category: 'setup' | 'training' | 'data' | 'security';
    estimatedTime: string;
}

export default function OnboardingPage() {
    const [tasks, setTasks] = useState<OnboardingTask[]>([
        {
            id: '1',
            title: 'Company Profile Setup',
            description: 'Configure basic company details, logo, and branding settings.',
            status: 'completed',
            category: 'setup',
            estimatedTime: '15 mins'
        },
        {
            id: '2',
            title: 'User Roles & Permissions',
            description: 'Define user roles and assign access permissions for your team.',
            status: 'completed',
            category: 'security',
            estimatedTime: '30 mins'
        },
        {
            id: '3',
            title: 'Import Customer Data',
            description: 'Upload your existing customer database via CSV or API.',
            status: 'in_progress',
            category: 'data',
            estimatedTime: '1 hour'
        },
        {
            id: '4',
            title: 'Configure Email Settings',
            description: 'Set up SMTP server and email templates for notifications.',
            status: 'pending',
            category: 'setup',
            estimatedTime: '20 mins'
        },
        {
            id: '5',
            title: 'Team Training Session',
            description: 'Schedule and complete the initial product training webinar.',
            status: 'pending',
            category: 'training',
            estimatedTime: '2 hours'
        },
        {
            id: '6',
            title: 'Setup Backup Policy',
            description: 'Configure automated data backup frequency and retention.',
            status: 'pending',
            category: 'security',
            estimatedTime: '15 mins'
        }
    ]);

    const toggleStatus = (id: string) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                return { ...task, status: newStatus };
            }
            return task;
        }));
    };

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/support" className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Onboarding Checklist</h1>
                        <p className="text-gray-600 mt-1">Track your setup progress and get started quickly</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{progress}% Complete</p>
                        <p className="text-xs text-gray-500">{completedCount} of {tasks.length} tasks</p>
                    </div>
                    <div className="w-12 h-12 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-gray-200"
                            />
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * progress) / 100}
                                className="text-green-500 transition-all duration-500 ease-out"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task List */}
                <div className="lg:col-span-2 space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white rounded-xl p-6 border transition-all duration-200 ${task.status === 'completed' ? 'border-green-200 bg-green-50/30' :
                                    task.status === 'in_progress' ? 'border-blue-200 shadow-md transform scale-[1.01]' :
                                        'border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => toggleStatus(task.id)}
                                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                            'border-gray-300 hover:border-blue-500 text-transparent'
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                            {task.title}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${task.category === 'setup' ? 'bg-blue-100 text-blue-700' :
                                                task.category === 'security' ? 'bg-red-100 text-red-700' :
                                                    task.category === 'data' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {task.category.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{task.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Play className="w-3 h-3" />
                                            {task.estimatedTime}
                                        </span>
                                        {task.status === 'in_progress' && (
                                            <span className="text-blue-600 font-medium animate-pulse">In Progress...</span>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resources Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Helpful Resources</h3>
                        <div className="space-y-4">
                            <Link href="/support/knowledge" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Documentation</p>
                                    <p className="text-xs text-gray-500">Detailed guides & API docs</p>
                                </div>
                            </Link>
                            <Link href="/support/tickets" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Contact Support</p>
                                    <p className="text-xs text-gray-500">Get help from our team</p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200">
                                    <Play className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Video Tutorials</p>
                                    <p className="text-xs text-gray-500">Watch step-by-step guides</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                        <p className="text-blue-100 text-sm mb-4">
                            Our onboarding specialists are available to help you set up your account.
                        </p>
                        <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Schedule a Call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
