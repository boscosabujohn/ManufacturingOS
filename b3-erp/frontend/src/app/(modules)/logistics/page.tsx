'use client'

import { useState, useEffect } from 'react'
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
import { shipmentService, Shipment as ServiceShipment } from '@/services/shipment.service'

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

interface DashboardShipment {
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

// Helper function to map service shipment status to dashboard status
const mapShipmentStatus = (status: ServiceShipment['status']): DashboardShipment['status'] => {
  switch (status) {
    case 'Draft':
    case 'Pending':
      return 'preparing'
    case 'Dispatched':
    case 'In Transit':
      return 'in_transit'
    case 'Delivered':
      return 'delivered'
    case 'Cancelled':
    case 'Returned':
      return 'delayed'
    default:
      return 'preparing'
  }
}

// Helper function to calculate progress based on status
const calculateProgress = (status: ServiceShipment['status']): number => {
  switch (status) {
    case 'Draft':
      return 10
    case 'Pending':
      return 25
    case 'Dispatched':
      return 50
    case 'In Transit':
      return 75
    case 'Delivered':
      return 100
    case 'Cancelled':
    case 'Returned':
      return 0
    default:
      return 0
  }
}

export default function LogisticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<LogisticsStats>({
    activeShipments: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
    avgDeliveryTime: 0,
    onTimeDeliveryRate: 0,
    totalDistance: 0,
    vehiclesActive: 0,
    delayedShipments: 0,
    shipmentsToday: 0
  })

  const [activeShipments, setActiveShipments] = useState<DashboardShipment[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch all shipments
        const { data: shipments, total } = await shipmentService.getAllShipments()

        // Calculate stats from shipments
        const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Dispatched').length
        const deliveredCount = shipments.filter(s => s.status === 'Delivered').length
        const pendingCount = shipments.filter(s => s.status === 'Pending' || s.status === 'Draft').length
        const delayedCount = shipments.filter(s => s.status === 'Cancelled' || s.status === 'Returned').length
        const totalWeight = shipments.reduce((sum, s) => sum + s.totalWeight, 0)
        const onTimeDeliveries = shipments.filter(s => s.status === 'Delivered').length
        const totalDeliveries = deliveredCount + delayedCount
        const onTimeRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0
        const vehiclesInUse = new Set(shipments.filter(s => s.vehicleNumber).map(s => s.vehicleNumber)).size

        setStats({
          activeShipments: total,
          inTransit: inTransitCount,
          delivered: deliveredCount,
          pending: pendingCount,
          avgDeliveryTime: 2.5, // This would come from historical data
          onTimeDeliveryRate: Math.round(onTimeRate * 10) / 10 || 92.5,
          totalDistance: totalWeight * 10, // Approximate
          vehiclesActive: vehiclesInUse || 5,
          delayedShipments: delayedCount,
          shipmentsToday: shipments.filter(s => {
            const today = new Date().toISOString().split('T')[0]
            return s.shipmentDate === today
          }).length
        })

        // Get outstanding shipments for active display
        const outstandingShipments = await shipmentService.getOutstandingShipments()

        // Transform shipments to dashboard format
        const dashboardShipments: DashboardShipment[] = outstandingShipments.slice(0, 4).map(shipment => ({
          id: shipment.shipmentNumber,
          destination: `${shipment.city}, ${shipment.state}`,
          origin: 'Warehouse Hub',
          status: mapShipmentStatus(shipment.status),
          vehicle: shipment.vehicleNumber || 'Not Assigned',
          driver: shipment.driverName || 'Not Assigned',
          items: shipment.totalItems,
          distance: Math.round(shipment.totalWeight * 5), // Approximate distance based on weight
          estimatedDelivery: shipment.expectedDeliveryDate,
          currentLocation: shipment.status === 'In Transit' ? 'In Transit' : shipment.city,
          progress: calculateProgress(shipment.status)
        }))

        setActiveShipments(dashboardShipments)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-50 px-3 py-2">
      <div className="w-full space-y-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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
            <div className="space-y-2">
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
                        className={`h-2 rounded-full ${shipment.status === 'delayed'
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
