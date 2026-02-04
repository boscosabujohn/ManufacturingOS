'use client';

import React from 'react';
import Link from 'next/link';
import { Server, Database, Zap, Activity, Cpu, HardDrive, Network, ArrowRight } from 'lucide-react';

export default function ScalabilityPage() {
    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Scalability & Performance</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage system resources, load balancing, and optimization</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium text-sm">System Healthy</span>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/it-admin/system/scalability/load-balancing" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Network className="w-6 h-6 text-blue-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Load Balancing</h3>
                            <p className="text-sm text-gray-600">Manage traffic distribution across servers</p>
                        </div>
                    </Link>

                    <Link href="/it-admin/system/scalability/caching" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-purple-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Caching Strategy</h3>
                            <p className="text-sm text-gray-600">Configure Redis and memory caching</p>
                        </div>
                    </Link>

                    <Link href="/it-admin/system/scalability/sharding" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-orange-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Database className="w-6 h-6 text-orange-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Database Sharding</h3>
                            <p className="text-sm text-gray-600">Manage data distribution and partitions</p>
                        </div>
                    </Link>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Resource Usage</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">CPU Utilization</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">45%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">62%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Storage I/O</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">28%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Alerts</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'High Latency Detected', desc: 'API Gateway latency spiked to 250ms', time: '10 mins ago', type: 'warning' },
                                { title: 'Cache Hit Rate Drop', desc: 'Redis cache hit rate dropped below 85%', time: '1 hour ago', type: 'warning' },
                                { title: 'Auto-scaling Triggered', desc: 'Added 2 new worker nodes due to load', time: '2 hours ago', type: 'info' },
                            ].map((alert, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                                            }`}>{alert.title}</h3>
                                        <span className={`text-xs ${alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                            }`}>{alert.time}</span>
                                    </div>
                                    <p className={`text-sm mt-1 ${alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                                        }`}>{alert.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
