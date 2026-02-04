'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, FileText, Lock, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function CompliancePage() {
    return (
        <div className="w-full min-h-screen bg-gray-50 px-3 py-2">
            <div className="w-full space-y-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage regulatory requirements, data privacy, and audits</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium text-sm">Compliant</span>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Link href="/compliance/gdpr" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all hover:border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Lock className="w-6 h-6 text-blue-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">GDPR Controls</h3>
                            <p className="text-sm text-gray-600">Manage data subject requests and consent</p>
                        </div>
                    </Link>

                    <Link href="/compliance/reporting" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all hover:border-purple-500">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Regulatory Reporting</h3>
                            <p className="text-sm text-gray-600">Generate compliance reports and filings</p>
                        </div>
                    </Link>

                    <Link href="/compliance/audit" className="block group">
                        <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all hover:border-orange-500">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Audit Logs</h3>
                            <p className="text-sm text-gray-600">Track system events and user activities</p>
                        </div>
                    </Link>
                </div>

                {/* Compliance Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-3">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Compliance Scorecard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Overall Score</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-gray-900">98%</span>
                                    <span className="text-sm text-green-600 font-medium mb-1">↑ 2%</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-gray-900">3</span>
                                    <span className="text-sm text-gray-500 font-medium mb-1">DSRs</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Next Audit</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-gray-900">12</span>
                                    <span className="text-sm text-gray-500 font-medium mb-1">Days</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            {[
                                { name: 'GDPR Compliance', score: 100, status: 'Compliant' },
                                { name: 'SOC 2 Type II', score: 95, status: 'Review Needed' },
                                { name: 'HIPAA', score: 100, status: 'Compliant' },
                                { name: 'ISO 27001', score: 98, status: 'Compliant' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.score === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full">
                                            <div
                                                className={`h-2 rounded-full ${item.score === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${item.score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-3">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Alerts</h2>
                        <div className="space-y-2">
                            {[
                                { title: 'New DSR Request', desc: 'User ID #492 requested data export', time: '2 hours ago', type: 'info' },
                                { title: 'Policy Update Required', desc: 'Data Retention Policy expires in 5 days', time: '1 day ago', type: 'warning' },
                                { title: 'Failed Login Attempt', desc: 'Multiple failed logins from IP 192.168.1.1', time: '2 days ago', type: 'alert' },
                            ].map((alert, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className={`mt-1 ${alert.type === 'alert' ? 'text-red-500' :
                                            alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                                        }`}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{alert.desc}</p>
                                        <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                            View All Alerts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
