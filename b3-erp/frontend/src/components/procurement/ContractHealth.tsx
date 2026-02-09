'use client'

import { useState, useEffect } from 'react'
import {
    FileText,
    AlertTriangle,
    Calendar,
    RefreshCw,
    Clock,
    ExternalLink,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { vendorService, VendorContract } from '@/services/VendorService'

export function ContractHealth() {
    const [expiringContracts, setExpiringContracts] = useState<VendorContract[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadContractData() {
            try {
                const [expiring, statistics] = await Promise.all([
                    vendorService.getExpiringContracts(60), // Check next 60 days
                    vendorService.getContractStatistics()
                ])
                setExpiringContracts(expiring)
                setStats(statistics)
            } catch (error) {
                console.error('Failed to load contract health data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadContractData()
    }, [])

    if (loading) return <div className="p-4 bg-gray-50 animate-pulse rounded-lg h-48" />

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Expiration Alerts */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-700 font-bold">
                        <AlertTriangle className="h-5 w-5" />
                        Active Renewal Alerts
                    </div>
                    <span className="bg-red-200 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        {expiringContracts.length} Urgent
                    </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {expiringContracts.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>All contracts are healthy</p>
                        </div>
                    ) : (
                        expiringContracts.map(contract => (
                            <div key={contract.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{contract.title}</h4>
                                        <p className="text-xs text-gray-500">{contract.vendorName} • {contract.contractNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                                        <Clock className="h-3 w-3" />
                                        {Math.ceil((new Date(contract.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days left
                                    </div>
                                    <button className="text-xs text-blue-600 hover:underline font-medium mt-1 flex items-center gap-1 ml-auto">
                                        Initiate Renewal <RefreshCw className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Contract Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    Contract Health
                </h3>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Utilization Rate</span>
                            <span className="font-bold text-gray-900">{Math.round(stats?.averageUtilization || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${stats?.averageUtilization || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                            <p className="text-xs text-gray-400">Active</p>
                            <p className="text-lg font-bold text-gray-900">{stats?.byStatus?.active || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                            <p className="text-xs text-gray-400">Total Value</p>
                            <p className="text-lg font-bold text-gray-900">₹{(stats?.totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors">
                        View Repository <ExternalLink className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
