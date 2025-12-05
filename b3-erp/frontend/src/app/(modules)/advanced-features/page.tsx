'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ScanText, Wifi, ArrowRight, Activity, Cpu, FileText } from 'lucide-react';

export default function AdvancedFeaturesPage() {
    const features = [
        {
            title: 'AI Insights',
            description: 'Predictive analytics and intelligent forecasting for your business operations.',
            icon: Brain,
            color: 'bg-purple-100 text-purple-600',
            href: '/advanced-features/ai-insights',
            stats: '98% Accuracy',
        },
        {
            title: 'OCR Integration',
            description: 'Automated document processing and data extraction from invoices and receipts.',
            icon: ScanText,
            color: 'bg-blue-100 text-blue-600',
            href: '/advanced-features/ocr',
            stats: '500+ Docs/hr',
        },
        {
            title: 'IoT Dashboard',
            description: 'Real-time monitoring and control of connected manufacturing equipment.',
            icon: Wifi,
            color: 'bg-green-100 text-green-600',
            href: '/advanced-features/iot',
            stats: '42 Active Devices',
        },
    ];

    return (
        <div className="w-full max-w-full mx-auto min-h-screen bg-gray-50 p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Advanced Features</h1>
                <p className="text-gray-600 mt-2">Next-generation capabilities for your manufacturing operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <Link
                        key={feature.title}
                        href={feature.href}
                        className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${feature.color}`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {feature.description}
                        </p>

                        <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                            <Activity className="w-4 h-4 mr-2" />
                            {feature.stats}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Stats / Overview Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900">System Utilization</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">AI Processing Units</span>
                                <span className="font-medium text-gray-900">45%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">OCR Queue Capacity</span>
                                <span className="font-medium text-gray-900">12%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">IoT Bandwidth</span>
                                <span className="font-medium text-gray-900">78%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { text: 'Invoice #INV-2024-001 processed via OCR', time: '2 mins ago', type: 'ocr' },
                            { text: 'Machine B3-Milling-02 reported high temp', time: '15 mins ago', type: 'iot' },
                            { text: 'Demand forecast updated for Q4', time: '1 hour ago', type: 'ai' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'ai' ? 'bg-purple-500' :
                                        activity.type === 'ocr' ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                <div>
                                    <p className="text-sm text-gray-900">{activity.text}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
