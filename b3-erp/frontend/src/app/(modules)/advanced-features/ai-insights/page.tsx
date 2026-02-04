'use client';

import React from 'react';
import { ArrowLeft, TrendingUp, AlertTriangle, Package, Users, Brain, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AIInsightsPage() {
    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/advanced-features" className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
                        <p className="text-gray-600 mt-1">Predictive analytics and intelligent forecasting</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Run New Analysis
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Forecast Accuracy', value: '98.2%', change: '+2.4%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Risk Score', value: 'Low', sub: '12 Potential Risks', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                    { label: 'Inventory Optimization', value: '$45k', sub: 'Potential Savings', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Workforce Efficiency', value: '94%', change: '+1.2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {stat.change && (
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-600 mt-1">{stat.sub || stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand Forecasting */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Demand Forecasting
                        </h2>
                        <select className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option>Next 30 Days</option>
                            <option>Next Quarter</option>
                            <option>Next Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[45, 52, 49, 60, 58, 65, 72, 68, 75, 80, 85, 82].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                                        {h * 10} Units
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Week 1</span>
                        <span>Week 12</span>
                    </div>
                </div>

                {/* Predictive Maintenance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Predictive Maintenance
                        </h2>
                        <button className="text-sm text-blue-600 hover:underline">View All Machines</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { machine: 'CNC Milling Machine 01', health: 92, status: 'Healthy', prediction: 'Maintenance recommended in 14 days' },
                            { machine: 'Hydraulic Press B2', health: 78, status: 'Warning', prediction: 'High vibration detected. Check bearings immediately.', alert: true },
                            { machine: 'Conveyor Belt System', health: 95, status: 'Healthy', prediction: 'Optimal performance. Next check in 30 days.' },
                            { machine: 'Assembly Robot Arm', health: 88, status: 'Good', prediction: 'Routine calibration needed in 5 days.' },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-lg border ${item.alert ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{item.machine}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.health > 90 ? 'bg-green-100 text-green-700' :
                                            item.health > 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {item.health}% Health
                                    </span>
                                </div>
                                <p className={`text-sm ${item.alert ? 'text-red-700 font-medium' : 'text-gray-600'}`}>
                                    {item.prediction}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
