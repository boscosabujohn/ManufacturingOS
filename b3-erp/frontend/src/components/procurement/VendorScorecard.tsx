'use client'

import { useState, useEffect } from 'react'
import {
    Truck,
    Shield,
    Package,
    ArrowUp,
    ArrowDown,
    Target,
    AlertCircle
} from 'lucide-react'
import { vendorService, VendorScorecard as IScorecard } from '@/services/VendorService'

interface Props {
    vendorId: string
}

export function VendorScorecard({ vendorId }: Props) {
    const [scorecard, setScorecard] = useState<IScorecard | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadScorecard() {
            try {
                const data = await vendorService.getVendorScorecard(vendorId)
                setScorecard(data)
            } catch (error) {
                console.error('Failed to load scorecard:', error)
            } finally {
                setLoading(false)
            }
        }
        loadScorecard()
    }, [vendorId])

    if (loading) return <div className="p-4 bg-gray-50 animate-pulse rounded-lg h-32" />
    if (!scorecard) return null

    const getMetricColor = (value: number) => {
        if (value >= 90) return 'text-green-600'
        if (value >= 75) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <Truck className="h-6 w-6 text-blue-500" />
                    <Target className="h-4 w-4 text-gray-400" />
                </div>
                <p className={`text-2xl font-bold ${getMetricColor(scorecard.onTimeDeliveryPercentage)}`}>
                    {scorecard.onTimeDeliveryPercentage}%
                </p>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Delivery Accuracy</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Based on {scorecard.totalDeliveries} receipts
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <Shield className="h-6 w-6 text-green-500" />
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                </div>
                <p className={`text-2xl font-bold ${getMetricColor(scorecard.qualityPassRate)}`}>
                    {scorecard.qualityPassRate}%
                </p>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Quality Pass Rate</p>
                <div className="mt-2 text-xs text-gray-400">
                    Real-time QC acceptance data
                </div>
            </div>

            {/* Placeholder for Price Score derived from RFQ/PO */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md opacity-75">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-purple-500 font-bold">$</div>
                </div>
                <p className="text-2xl font-bold text-indigo-600">88.5%</p>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Price Competitiveness</p>
                <div className="mt-2 text-xs text-gray-400">
                    Vs Market Benchmark
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <Target className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{scorecard.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Total Orders</p>
                <div className="mt-2 text-xs text-gray-400">
                    Lifetime purchase volume
                </div>
            </div>
        </div>
    )
}
