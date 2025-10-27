'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  Package,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Navigation
} from 'lucide-react'
import { KPICard, CardSkeleton } from '@/components/ui'

interface LogisticsStats {
  activeShipments: number
  inTransit: number
  delivered: number
  pending: number
  avgDeliveryTime: number
  onTimeDeliveryRate: number
  totalDistance: number
  vehiclesActive: number
  delayedShipments: number
  shipmentsToday: number
}

interface Shipment {
  id: string
  destination: string
  origin: string
  status: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed'
  vehicle: string
  driver: string
  items: number
  distance: number
  estimatedDelivery: string
  currentLocation: string
  progress: number
}

export default function LogisticsDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats] = useState<LogisticsStats>({
    activeShipments: 45,
    inTransit: 28,
    delivered: 156,
    pending: 12,
    avgDeliveryTime: 2.5,
    onTimeDeliveryRate: 92.5,
    totalDistance: 45680,
    vehiclesActive: 18,
    delayedShipments: 3,
    shipmentsToday: 8
  })

  const [activeShipments] = useState<Shipment[]>([
    {
      id: 'SHP-2025-234',
      destination: 'Mumbai, Maharashtra',
      origin: 'Pune, Maharashtra',
      status: 'in_transit',
      vehicle: 'MH-12-AB-1234',
      driver: 'Rajesh Kumar',
      items: 15,
      distance: 148,
      estimatedDelivery: '2025-10-18 18:00',
      currentLocation: 'Lonavala Toll Plaza',
      progress: 65
    },
    {
      id: 'SHP-2025-235',
      destination: 'Delhi, NCR',
      origin: 'Pune, Maharashtra',
      status: 'in_transit',
      vehicle: 'MH-12-CD-5678',
      driver: 'Amit Sharma',
      items: 22,
      distance: 1420,
      estimatedDelivery: '2025-10-20 14:00',
      currentLocation: 'Indore Highway',
      progress: 35
    },
    {
      id: 'SHP-2025-236',
      destination: 'Bangalore, Karnataka',
      origin: 'Pune, Maharashtra',
      status: 'out_for_delivery',
      vehicle: 'KA-03-EF-9012',
      driver: 'Vikram Singh',
      items: 8,
      distance: 842,
      estimatedDelivery: '2025-10-18 16:00',
      currentLocation: 'Bangalore City Limits',
      progress: 95
    },
    {
      id: 'SHP-2025-237',
      destination: 'Chennai, Tamil Nadu',
      origin: 'Pune, Maharashtra',
      status: 'delayed',
      vehicle: 'TN-09-GH-3456',
      driver: 'Suresh Reddy',
      items: 12,
      distance: 1165,
      estimatedDelivery: '2025-10-18 12:00',
      currentLocation: 'Vellore Bypass',
      progress: 85
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'in_transit':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Logistics & Transportation</h1>
            <p className="text-gray-600 mt-1">Shipment tracking, fleet management, and delivery monitoring</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all shadow-md">
            <Truck className="h-5 w-5" />
            New Shipment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard
               
                value={stats.activeShipments}
                icon={Truck}
                color="blue"
                description={`${stats.inTransit} in transit`}
              />
              <KPICard
               
                value={`${stats.onTimeDeliveryRate}%`}
                icon={CheckCircle}
                color="green"
                description={`${stats.delivered} delivered`}
              />
              <KPICard
               
                value={stats.vehiclesActive}
                icon={Navigation}
                color="purple"
                description={`${stats.totalDistance} km today`}
              />
              <KPICard
               
                value={`${stats.avgDeliveryTime} days`}
                icon={Clock}
                color="yellow"
                description={`${stats.delayedShipments} delayed`}
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Shipments</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeShipments.map((shipment) => (
                <div key={shipment.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{shipment.id}</p>
                      <p className="text-sm text-gray-600 mt-1">{shipment.vehicle} - {shipment.driver}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">From: {shipment.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">To: {shipment.destination}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress - {shipment.currentLocation}</span>
                      <span className="font-medium text-gray-900">{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          shipment.status === 'delayed'
                            ? 'bg-red-500'
                            : shipment.progress >= 90
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span>{shipment.items} items • {shipment.distance} km</span>
                      <span>ETA: {shipment.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
