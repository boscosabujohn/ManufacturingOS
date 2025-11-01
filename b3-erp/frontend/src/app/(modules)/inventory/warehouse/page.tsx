'use client'

import React, { useState } from 'react'
import {
  Search,
  Download,
  Eye,
  Edit,
  Warehouse as WarehouseIcon,
  MapPin,
  Package,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react'
import {
  CreateWarehouseModal,
  ViewWarehouseDetailsModal,
  CreateZoneModal,
  WarehouseData,
  ZoneData
} from '@/components/inventory/InventoryWarehouseModals'

interface Warehouse {
  id: string
  warehouseId: string
  name: string
  location: string
  type: 'main' | 'regional' | 'factory' | 'distribution'
  capacity: number
  currentStockValue: number
  utilizationPercent: number
  manager: string
  status: 'active' | 'inactive' | 'maintenance'
  address: string
  contactNumber: string
  establishedDate: string
  totalItems: number
  city: string
}

const InventoryWarehousePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal states
  const [isCreateWarehouseOpen, setIsCreateWarehouseOpen] = useState(false)
  const [isViewWarehouseOpen, setIsViewWarehouseOpen] = useState(false)
  const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null)
  const [warehouseList, setWarehouseList] = useState<Warehouse[]>([])
  const [selectedWarehouseIdForZone, setSelectedWarehouseIdForZone] = useState<string>('')

  const warehouses: Warehouse[] = [
    {
      id: '1',
      warehouseId: 'WH-001',
      name: 'Mumbai Central Warehouse',
      location: 'Andheri East, Mumbai',
      type: 'main',
      capacity: 15000,
      currentStockValue: 8500000,
      utilizationPercent: 78,
      manager: 'Rajesh Kumar',
      status: 'active',
      address: 'Plot 45, MIDC Industrial Area, Andheri East',
      contactNumber: '+91-22-2850-1234',
      establishedDate: '2018-03-15',
      totalItems: 2450,
      city: 'Mumbai'
    },
    {
      id: '2',
      warehouseId: 'WH-002',
      name: 'Delhi Regional Hub',
      location: 'Okhla Industrial Area, Delhi',
      type: 'regional',
      capacity: 10000,
      currentStockValue: 6200000,
      utilizationPercent: 65,
      manager: 'Priya Sharma',
      status: 'active',
      address: 'Sector 63, Okhla Phase III',
      contactNumber: '+91-11-4567-8901',
      establishedDate: '2019-06-20',
      totalItems: 1850,
      city: 'Delhi'
    },
    {
      id: '3',
      warehouseId: 'WH-003',
      name: 'Bangalore Factory Store',
      location: 'Whitefield, Bangalore',
      type: 'factory',
      capacity: 8000,
      currentStockValue: 7200000,
      utilizationPercent: 92,
      manager: 'Amit Patel',
      status: 'active',
      address: 'KIADB Industrial Area, Whitefield',
      contactNumber: '+91-80-2345-6789',
      establishedDate: '2020-01-10',
      totalItems: 3200,
      city: 'Bangalore'
    },
    {
      id: '4',
      warehouseId: 'WH-004',
      name: 'Chennai Distribution Center',
      location: 'Ambattur Industrial Estate, Chennai',
      type: 'distribution',
      capacity: 12000,
      currentStockValue: 5800000,
      utilizationPercent: 55,
      manager: 'Suresh Rao',
      status: 'active',
      address: 'Phase 2, Ambattur Industrial Estate',
      contactNumber: '+91-44-2678-9012',
      establishedDate: '2019-09-05',
      totalItems: 1650,
      city: 'Chennai'
    },
    {
      id: '5',
      warehouseId: 'WH-005',
      name: 'Pune Manufacturing Warehouse',
      location: 'Chakan MIDC, Pune',
      type: 'factory',
      capacity: 9000,
      currentStockValue: 4500000,
      utilizationPercent: 45,
      manager: 'Neha Gupta',
      status: 'maintenance',
      address: 'Plot 78, Phase II, Chakan MIDC',
      contactNumber: '+91-20-2789-3456',
      establishedDate: '2021-02-28',
      totalItems: 1420,
      city: 'Pune'
    },
    {
      id: '6',
      warehouseId: 'WH-006',
      name: 'Hyderabad Regional Depot',
      location: 'Patancheru, Hyderabad',
      type: 'regional',
      capacity: 7000,
      currentStockValue: 2100000,
      utilizationPercent: 32,
      manager: 'Vikram Singh',
      status: 'inactive',
      address: 'Survey No. 234, Patancheru Industrial Area',
      contactNumber: '+91-40-2890-4567',
      establishedDate: '2017-11-12',
      totalItems: 890,
      city: 'Hyderabad'
    }
  ]

  const totalCapacity = warehouses.reduce((sum, wh) => sum + wh.capacity, 0)
  const activeWarehouses = warehouses.filter(wh => wh.status === 'active').length
  const totalStockValue = warehouses.reduce((sum, wh) => sum + wh.currentStockValue, 0)
  const usedCapacity = warehouses.reduce((sum, wh) => sum + (wh.capacity * wh.utilizationPercent / 100), 0)
  const avgUtilization = Math.round((usedCapacity / totalCapacity) * 100)

  const stats = [
    {
      title: 'Total Warehouses',
      value: warehouses.length.toString(),
      change: '+2 new',
      icon: WarehouseIcon,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Locations',
      value: activeWarehouses.toString(),
      change: '+1 this month',
      icon: MapPin,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Capacity',
      value: `${(totalCapacity / 1000).toFixed(0)}K m³`,
      change: '+5.2% vs last year',
      icon: Package,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Utilization %',
      value: `${avgUtilization}%`,
      change: '+3.5% this month',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600'
    }
  ]

  const getTypeColor = (type: string) => {
    const colors = {
      main: 'bg-blue-100 text-blue-800',
      regional: 'bg-purple-100 text-purple-800',
      factory: 'bg-green-100 text-green-800',
      distribution: 'bg-orange-100 text-orange-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-600 font-bold'
    if (utilization >= 70) return 'text-yellow-600 font-semibold'
    return 'text-green-600 font-medium'
  }

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization > 90) return 'bg-red-100'
    if (utilization >= 70) return 'bg-yellow-100'
    return 'bg-green-100'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch =
      warehouse.warehouseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || warehouse.status === statusFilter
    const matchesType = typeFilter === 'all' || warehouse.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentWarehouses = filteredWarehouses.slice(startIndex, endIndex)

  const handleExport = () => {
    console.log('Exporting warehouse report...')
  }

  // Convert Warehouse to WarehouseData
  const convertToWarehouseData = (warehouse: Warehouse): WarehouseData => {
    return {
      warehouseId: warehouse.warehouseId,
      warehouseName: warehouse.name,
      warehouseCode: warehouse.warehouseId,
      warehouseType: warehouse.type === 'factory' ? 'production' : warehouse.type === 'regional' ? 'distribution' : warehouse.type,
      location: {
        address: warehouse.address,
        city: warehouse.city,
        state: '',
        zipCode: '',
        country: 'India'
      },
      contact: {
        managerName: warehouse.manager,
        phone: warehouse.contactNumber,
        email: `${warehouse.manager.toLowerCase().replace(' ', '.')}@company.com`
      },
      capacity: {
        totalArea: warehouse.capacity,
        usedArea: Math.round(warehouse.capacity * warehouse.utilizationPercent / 100),
        unit: 'sqft'
      },
      status: warehouse.status,
      zones: [],
      features: []
    }
  }

  // Handle warehouse creation
  const handleCreateWarehouse = (data: WarehouseData) => {
    // TODO: Integrate with API to create warehouse
    console.log('Creating warehouse:', data)

    // Update local state
    const newWarehouse: Warehouse = {
      id: (warehouses.length + 1).toString(),
      warehouseId: data.warehouseId,
      name: data.warehouseName,
      location: data.location.address,
      type: data.warehouseType === 'production' ? 'factory' : data.warehouseType as any,
      capacity: data.capacity.totalArea,
      currentStockValue: 0,
      utilizationPercent: 0,
      manager: data.contact.managerName,
      status: data.status,
      address: data.location.address,
      contactNumber: data.contact.phone,
      establishedDate: new Date().toISOString().split('T')[0],
      totalItems: 0,
      city: data.location.city
    }

    setWarehouseList([...warehouseList, newWarehouse])
    setIsCreateWarehouseOpen(false)
  }

  // Handle warehouse view
  const handleViewWarehouse = (warehouse: Warehouse) => {
    const warehouseData = convertToWarehouseData(warehouse)
    setSelectedWarehouse(warehouseData)
    setIsViewWarehouseOpen(true)
  }

  // Handle warehouse edit
  const handleEditWarehouse = () => {
    // TODO: Implement edit functionality - reuse CreateWarehouseModal with edit mode
    console.log('Edit warehouse:', selectedWarehouse)
    setIsViewWarehouseOpen(false)
    // Could open CreateWarehouseModal with pre-filled data
  }

  // Handle add zone from warehouse details
  const handleAddZoneFromWarehouse = () => {
    if (selectedWarehouse) {
      setSelectedWarehouseIdForZone(selectedWarehouse.warehouseId)
      setIsViewWarehouseOpen(false)
      setIsCreateZoneOpen(true)
    }
  }

  // Handle zone creation
  const handleCreateZone = (data: ZoneData) => {
    // TODO: Integrate with API to create zone
    console.log('Creating zone:', data)

    // Update local warehouse zones
    if (selectedWarehouse) {
      const updatedWarehouse = {
        ...selectedWarehouse,
        zones: [...selectedWarehouse.zones, data.zoneName]
      }
      setSelectedWarehouse(updatedWarehouse)
    }

    setIsCreateZoneOpen(false)
    setSelectedWarehouseIdForZone('')
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const gradientMap: { [key: string]: string } = {
              'from-blue-500 to-blue-600': 'from-blue-50 to-blue-100',
              'from-green-500 to-green-600': 'from-green-50 to-green-100',
              'from-yellow-500 to-yellow-600': 'from-yellow-50 to-yellow-100',
              'from-orange-500 to-orange-600': 'from-orange-50 to-orange-100'
            }
            const borderMap: { [key: string]: string } = {
              'from-blue-500 to-blue-600': 'border-blue-200',
              'from-green-500 to-green-600': 'border-green-200',
              'from-yellow-500 to-yellow-600': 'border-yellow-200',
              'from-orange-500 to-orange-600': 'border-orange-200'
            }
            const textMap: { [key: string]: { title: string; value: string } } = {
              'from-blue-500 to-blue-600': { title: 'text-blue-600', value: 'text-blue-900' },
              'from-green-500 to-green-600': { title: 'text-green-600', value: 'text-green-900' },
              'from-yellow-500 to-yellow-600': { title: 'text-yellow-600', value: 'text-yellow-900' },
              'from-orange-500 to-orange-600': { title: 'text-orange-600', value: 'text-orange-900' }
            }
            const iconMap: { [key: string]: string } = {
              'from-blue-500 to-blue-600': 'text-blue-600',
              'from-green-500 to-green-600': 'text-green-600',
              'from-yellow-500 to-yellow-600': 'text-yellow-600',
              'from-orange-500 to-orange-600': 'text-orange-600'
            }
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${gradientMap[stat.gradient]} rounded-lg p-4 border ${borderMap[stat.gradient]}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textMap[stat.gradient].title}`}>{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${textMap[stat.gradient].value}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${iconMap[stat.gradient]}`} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setIsCreateWarehouseOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Warehouse
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by warehouse ID, name, location, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="main">Main</option>
                <option value="regional">Regional</option>
                <option value="factory">Factory</option>
                <option value="distribution">Distribution</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Warehouse ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Capacity (m³)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Utilization %
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentWarehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewWarehouse(warehouse)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{warehouse.warehouseId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                      <div className="text-sm text-gray-500">{warehouse.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{warehouse.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(warehouse.type)}`}>
                        {warehouse.type.charAt(0).toUpperCase() + warehouse.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {warehouse.capacity.toLocaleString()} m³
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(warehouse.currentStockValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getUtilizationBgColor(warehouse.utilizationPercent)}`}>
                        <span className={getUtilizationColor(warehouse.utilizationPercent)}>
                          {warehouse.utilizationPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.manager}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(warehouse.status)}`}>
                        {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => handleViewWarehouse(warehouse)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          onClick={() => handleViewWarehouse(warehouse)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredWarehouses.length)} of {filteredWarehouses.length} warehouses
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateWarehouseModal
        isOpen={isCreateWarehouseOpen}
        onClose={() => setIsCreateWarehouseOpen(false)}
        onSubmit={handleCreateWarehouse}
      />

      <ViewWarehouseDetailsModal
        isOpen={isViewWarehouseOpen}
        onClose={() => setIsViewWarehouseOpen(false)}
        warehouse={selectedWarehouse}
        onEdit={handleEditWarehouse}
        onAddZone={handleAddZoneFromWarehouse}
      />

      <CreateZoneModal
        isOpen={isCreateZoneOpen}
        onClose={() => {
          setIsCreateZoneOpen(false)
          setSelectedWarehouseIdForZone('')
        }}
        onSubmit={handleCreateZone}
        warehouseId={selectedWarehouseIdForZone}
      />
    </div>
  )
}

export default InventoryWarehousePage
