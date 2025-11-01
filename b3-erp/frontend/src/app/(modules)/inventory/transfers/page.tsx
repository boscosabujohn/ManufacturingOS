'use client'

import React, { useState } from 'react'
import {
  Search,
  Download,
  Eye,
  Edit,
  CheckCircle,
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter
} from 'lucide-react'
import {
  CreateTransferModal,
  ViewTransferDetailsModal,
  ApproveTransferModal,
  DispatchTransferModal,
  ReceiveTransferModal,
  TransferHistoryModal,
  CreateTransferData,
  Transfer,
  ApproveTransferData,
  DispatchTransferData,
  ReceiveTransferData
} from '@/components/inventory/InventoryTransferModals'

interface StockTransfer {
  id: string
  transferId: string
  fromWarehouse: string
  toWarehouse: string
  itemsCount: number
  totalQuantity: number
  transferDate: string
  expectedDelivery: string
  status: 'draft' | 'approved' | 'in_transit' | 'received' | 'cancelled'
  initiatedBy: string
  approvedBy: string
  totalValue: number
  transportMode: string
  vehicleNumber: string
  driverName: string
}

const InventoryTransfersPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal state hooks
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isDispatchOpen, setIsDispatchOpen] = useState(false)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)

  const transfers: StockTransfer[] = [
    {
      id: '1',
      transferId: 'TR-2024-001',
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Factory Store',
      itemsCount: 15,
      totalQuantity: 850,
      transferDate: '2024-01-15',
      expectedDelivery: '2024-01-16',
      status: 'received',
      initiatedBy: 'Rajesh Kumar',
      approvedBy: 'Amit Singh',
      totalValue: 245000,
      transportMode: 'Road',
      vehicleNumber: 'MH-12-AB-1234',
      driverName: 'Ramesh Verma'
    },
    {
      id: '2',
      transferId: 'TR-2024-002',
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Distribution Center',
      itemsCount: 24,
      totalQuantity: 1200,
      transferDate: '2024-01-16',
      expectedDelivery: '2024-01-18',
      status: 'in_transit',
      initiatedBy: 'Priya Sharma',
      approvedBy: 'Suresh Patel',
      totalValue: 580000,
      transportMode: 'Road',
      vehicleNumber: 'GJ-05-CD-5678',
      driverName: 'Mohan Das'
    },
    {
      id: '3',
      transferId: 'TR-2024-003',
      fromWarehouse: 'Factory Store',
      toWarehouse: 'Regional Hub',
      itemsCount: 8,
      totalQuantity: 320,
      transferDate: '2024-01-17',
      expectedDelivery: '2024-01-19',
      status: 'approved',
      initiatedBy: 'Neha Gupta',
      approvedBy: 'Vikram Rao',
      totalValue: 125000,
      transportMode: 'Road',
      vehicleNumber: 'KA-03-EF-9012',
      driverName: 'Kumar Swamy'
    },
    {
      id: '4',
      transferId: 'TR-2024-004',
      fromWarehouse: 'Distribution Center',
      toWarehouse: 'Main Warehouse',
      itemsCount: 12,
      totalQuantity: 480,
      transferDate: '2024-01-18',
      expectedDelivery: '2024-01-20',
      status: 'draft',
      initiatedBy: 'Arun Kumar',
      approvedBy: '',
      totalValue: 190000,
      transportMode: 'Road',
      vehicleNumber: '',
      driverName: ''
    },
    {
      id: '5',
      transferId: 'TR-2024-005',
      fromWarehouse: 'Regional Hub',
      toWarehouse: 'Factory Store',
      itemsCount: 18,
      totalQuantity: 720,
      transferDate: '2024-01-18',
      expectedDelivery: '2024-01-19',
      status: 'received',
      initiatedBy: 'Deepak Mehta',
      approvedBy: 'Sanjay Desai',
      totalValue: 340000,
      transportMode: 'Road',
      vehicleNumber: 'MH-14-GH-3456',
      driverName: 'Sunil Patil'
    },
    {
      id: '6',
      transferId: 'TR-2024-006',
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Regional Hub',
      itemsCount: 6,
      totalQuantity: 150,
      transferDate: '2024-01-17',
      expectedDelivery: '2024-01-18',
      status: 'cancelled',
      initiatedBy: 'Kavita Reddy',
      approvedBy: 'Rahul Joshi',
      totalValue: 75000,
      transportMode: 'Road',
      vehicleNumber: 'TN-09-IJ-7890',
      driverName: 'Muthu Kumar'
    }
  ]

  const stats = [
    {
      title: 'Pending Transfers',
      value: '23',
      change: '+5.2%',
      icon: Package,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'In Transit',
      value: '18',
      change: '+8.7%',
      icon: Truck,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Completed Today',
      value: '12',
      change: '+15.3%',
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Value',
      value: '₹1.2M',
      change: '+12.1%',
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch =
      transfer.transferId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toWarehouse.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter
    const matchesLocation = locationFilter === 'all' ||
      transfer.fromWarehouse.toLowerCase().includes(locationFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesLocation
  })

  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransfers = filteredTransfers.slice(startIndex, endIndex)

  const handleExport = () => {
    console.log('Exporting stock transfers report...')
  }

  const handleApprove = (transferId: string) => {
    console.log('Approving transfer:', transferId)
  }

  // Modal handler functions
  const handleCreateTransfer = () => {
    setIsCreateOpen(true)
  }

  const handleCreateTransferSubmit = (data: CreateTransferData, isDraft: boolean) => {
    console.log('Creating transfer:', data, 'isDraft:', isDraft)
    // TODO: Implement API call
    setIsCreateOpen(false)
  }

  const handleViewTransfer = (transfer: StockTransfer) => {
    // Convert StockTransfer to Transfer format
    const transferData: Transfer = {
      id: transfer.id,
      transferNumber: transfer.transferId,
      status: transfer.status === 'in_transit' ? 'in-transit' : transfer.status === 'received' ? 'completed' : transfer.status,
      priority: 'normal',
      transferType: 'warehouse',
      fromLocation: {
        warehouse: transfer.fromWarehouse,
        zone: '',
        bin: ''
      },
      toLocation: {
        warehouse: transfer.toWarehouse,
        zone: '',
        bin: ''
      },
      transferDate: transfer.transferDate,
      expectedDelivery: transfer.expectedDelivery,
      reason: 'Stock transfer',
      items: [],
      timeline: [
        {
          event: 'Transfer Created',
          date: transfer.transferDate,
          user: transfer.initiatedBy,
          notes: ''
        }
      ],
      createdBy: transfer.initiatedBy,
      createdDate: transfer.transferDate,
      approvedBy: transfer.approvedBy || undefined,
      value: transfer.totalValue
    }
    setSelectedTransfer(transferData)
    setIsViewDetailsOpen(true)
  }

  const handleApproveTransfer = () => {
    setIsViewDetailsOpen(false)
    setIsApproveOpen(true)
  }

  const handleApproveSubmit = (data: ApproveTransferData) => {
    console.log('Approving transfer:', data)
    // TODO: Implement API call
    setIsApproveOpen(false)
  }

  const handleDispatch = () => {
    setIsViewDetailsOpen(false)
    setIsDispatchOpen(true)
  }

  const handleDispatchSubmit = (data: DispatchTransferData) => {
    console.log('Dispatching transfer:', data)
    // TODO: Implement API call
    setIsDispatchOpen(false)
  }

  const handleReceive = () => {
    setIsViewDetailsOpen(false)
    setIsReceiveOpen(true)
  }

  const handleReceiveSubmit = (data: ReceiveTransferData) => {
    console.log('Receiving transfer:', data)
    // TODO: Implement API call
    setIsReceiveOpen(false)
  }

  const handleViewHistory = () => {
    setIsHistoryOpen(true)
  }

  const handleEdit = () => {
    setIsViewDetailsOpen(false)
    setIsCreateOpen(true)
  }

  const handleCancel = () => {
    console.log('Cancelling transfer')
    // TODO: Implement cancel API call
    setIsViewDetailsOpen(false)
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const gradientMap: { [key: string]: string } = {
              'from-orange-500 to-orange-600': 'from-orange-50 to-orange-100',
              'from-blue-500 to-blue-600': 'from-blue-50 to-blue-100',
              'from-green-500 to-green-600': 'from-green-50 to-green-100',
              'from-purple-500 to-purple-600': 'from-purple-50 to-purple-100'
            }
            const borderMap: { [key: string]: string } = {
              'from-orange-500 to-orange-600': 'border-orange-200',
              'from-blue-500 to-blue-600': 'border-blue-200',
              'from-green-500 to-green-600': 'border-green-200',
              'from-purple-500 to-purple-600': 'border-purple-200'
            }
            const textMap: { [key: string]: { title: string; value: string } } = {
              'from-orange-500 to-orange-600': { title: 'text-orange-600', value: 'text-orange-900' },
              'from-blue-500 to-blue-600': { title: 'text-blue-600', value: 'text-blue-900' },
              'from-green-500 to-green-600': { title: 'text-green-600', value: 'text-green-900' },
              'from-purple-500 to-purple-600': { title: 'text-purple-600', value: 'text-purple-900' }
            }
            const iconColor = gradientMap[stat.gradient].includes('orange') ? 'text-orange-600' :
                            gradientMap[stat.gradient].includes('blue') ? 'text-blue-600' :
                            gradientMap[stat.gradient].includes('green') ? 'text-green-600' : 'text-purple-600'
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
                  <stat.icon className={`h-8 w-8 ${iconColor}`} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Transfers</h1>
          <div className="flex gap-3">
            <button
              onClick={handleViewHistory}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              View History
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={handleCreateTransfer}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Transfer
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by transfer ID or warehouse..."
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
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="in_transit">In Transit</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All From Locations</option>
                <option value="main warehouse">Main Warehouse</option>
                <option value="factory store">Factory Store</option>
                <option value="distribution center">Distribution Center</option>
                <option value="regional hub">Regional Hub</option>
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
                    Transfer ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    From Warehouse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    To Warehouse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items Count
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transfer Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expected Delivery
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Initiated By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTransfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewTransfer(transfer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transfer.transferId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{transfer.fromWarehouse}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{transfer.toWarehouse}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{transfer.itemsCount} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{transfer.totalQuantity.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{transfer.transferDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{transfer.expectedDelivery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {transfer.status.replace('_', ' ').charAt(0).toUpperCase() + transfer.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transfer.initiatedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewTransfer(transfer)
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewTransfer(transfer)
                            setTimeout(() => handleEdit(), 100)
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Edit Transfer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {transfer.status === 'draft' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewTransfer(transfer)
                              setTimeout(() => handleApproveTransfer(), 100)
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Approve Transfer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransfers.length)} of {filteredTransfers.length} transfers
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

        {/* Modal Components */}
        <CreateTransferModal
          isOpen={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false)
            setSelectedTransfer(null)
          }}
          onSubmit={handleCreateTransferSubmit}
        />

        <ViewTransferDetailsModal
          isOpen={isViewDetailsOpen}
          onClose={() => {
            setIsViewDetailsOpen(false)
            setSelectedTransfer(null)
          }}
          transfer={selectedTransfer}
          onEdit={handleEdit}
          onApprove={handleApproveTransfer}
          onReject={() => {
            setIsViewDetailsOpen(false)
            setIsApproveOpen(true)
          }}
          onDispatch={handleDispatch}
          onReceive={handleReceive}
          onCancel={handleCancel}
          onPrint={() => console.log('Print transfer')}
        />

        <ApproveTransferModal
          isOpen={isApproveOpen}
          onClose={() => {
            setIsApproveOpen(false)
            setIsViewDetailsOpen(true)
          }}
          onSubmit={handleApproveSubmit}
          transfer={selectedTransfer}
        />

        <DispatchTransferModal
          isOpen={isDispatchOpen}
          onClose={() => {
            setIsDispatchOpen(false)
            setIsViewDetailsOpen(true)
          }}
          onSubmit={handleDispatchSubmit}
          transfer={selectedTransfer}
        />

        <ReceiveTransferModal
          isOpen={isReceiveOpen}
          onClose={() => {
            setIsReceiveOpen(false)
            setIsViewDetailsOpen(true)
          }}
          onSubmit={handleReceiveSubmit}
          transfer={selectedTransfer}
        />

        <TransferHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onViewDetails={handleViewTransfer}
          onExport={() => console.log('Export history')}
        />
      </div>
    </div>
  )
}

export default InventoryTransfersPage
