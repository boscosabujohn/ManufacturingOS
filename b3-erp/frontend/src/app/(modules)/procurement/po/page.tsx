'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, ShoppingCart, Package, Clock, CheckCircle, DollarSign, Calendar, TrendingUp, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  vendorCode: string;
  poDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent_to_vendor' | 'partially_received' | 'fully_received' | 'cancelled';
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  itemsCount: number;
  receivedItems: number;
  paymentTerms: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  approvedBy?: string;
  notes: string;
  currency: string;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2025-001',
    vendorName: 'Steel Masters Inc',
    vendorCode: 'VND-SS-001',
    poDate: '2025-10-01',
    expectedDelivery: '2025-10-20',
    actualDelivery: '2025-10-19',
    status: 'fully_received',
    totalAmount: 125000,
    taxAmount: 15000,
    grandTotal: 140000,
    itemsCount: 15,
    receivedItems: 15,
    paymentTerms: 'Net 30',
    priority: 'high',
    createdBy: 'John Procurement',
    approvedBy: 'Sarah Manager',
    notes: 'Stainless steel sheets for production',
    currency: 'USD',
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2025-002',
    vendorName: 'ElectroTech Solutions',
    vendorCode: 'VND-ELC-002',
    poDate: '2025-10-05',
    expectedDelivery: '2025-10-25',
    status: 'sent_to_vendor',
    totalAmount: 85000,
    taxAmount: 10200,
    grandTotal: 95200,
    itemsCount: 25,
    receivedItems: 0,
    paymentTerms: 'Net 45',
    priority: 'medium',
    createdBy: 'Michael Buyer',
    approvedBy: 'Sarah Manager',
    notes: 'Electronic components for assembly line',
    currency: 'USD',
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2025-003',
    vendorName: 'PackPro Industries',
    vendorCode: 'VND-PKG-003',
    poDate: '2025-10-08',
    expectedDelivery: '2025-10-18',
    actualDelivery: '2025-10-18',
    status: 'partially_received',
    totalAmount: 45000,
    taxAmount: 5400,
    grandTotal: 50400,
    itemsCount: 20,
    receivedItems: 12,
    paymentTerms: 'Net 30',
    priority: 'low',
    createdBy: 'Lisa Coordinator',
    approvedBy: 'Robert Director',
    notes: 'Packaging materials - partial delivery accepted',
    currency: 'USD',
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2025-004',
    vendorName: 'Precision Machinery Co',
    vendorCode: 'VND-MCH-004',
    poDate: '2025-10-10',
    expectedDelivery: '2025-11-15',
    status: 'approved',
    totalAmount: 350000,
    taxAmount: 42000,
    grandTotal: 392000,
    itemsCount: 3,
    receivedItems: 0,
    paymentTerms: 'Net 60',
    priority: 'urgent',
    createdBy: 'David Engineer',
    approvedBy: 'Sarah Manager',
    notes: 'CNC machines for new production line',
    currency: 'USD',
  },
  {
    id: 'PO-005',
    poNumber: 'PO-2025-005',
    vendorName: 'ChemSupply Corp',
    vendorCode: 'VND-CHM-005',
    poDate: '2025-10-12',
    expectedDelivery: '2025-10-28',
    status: 'pending_approval',
    totalAmount: 67000,
    taxAmount: 8040,
    grandTotal: 75040,
    itemsCount: 18,
    receivedItems: 0,
    paymentTerms: 'Net 30',
    priority: 'medium',
    createdBy: 'Emily Buyer',
    notes: 'Industrial chemicals and solvents',
    currency: 'USD',
  },
  {
    id: 'PO-006',
    poNumber: 'PO-2025-006',
    vendorName: 'Global Logistics Partners',
    vendorCode: 'VND-LOG-006',
    poDate: '2025-10-14',
    expectedDelivery: '2025-10-22',
    status: 'draft',
    totalAmount: 28000,
    taxAmount: 3360,
    grandTotal: 31360,
    itemsCount: 8,
    receivedItems: 0,
    paymentTerms: 'Net 15',
    priority: 'low',
    createdBy: 'John Procurement',
    notes: 'Transportation and logistics services',
    currency: 'USD',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  pending_approval: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  sent_to_vendor: 'bg-purple-100 text-purple-700',
  partially_received: 'bg-orange-100 text-orange-700',
  fully_received: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  sent_to_vendor: 'Sent to Vendor',
  partially_received: 'Partially Received',
  fully_received: 'Fully Received',
  cancelled: 'Cancelled',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || po.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalPOs: purchaseOrders.length,
    pendingPOs: purchaseOrders.filter((po) => po.status === 'pending_approval' || po.status === 'approved').length,
    deliveredPOs: purchaseOrders.filter((po) => po.status === 'fully_received').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0),
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      setPurchaseOrders(purchaseOrders.filter((po) => po.id !== id));
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total POs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalPOs}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pendingPOs}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Delivered</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.deliveredPOs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ${(stats.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/procurement/po/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create PO</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO number, vendor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="sent_to_vendor">Sent to Vendor</option>
          <option value="partially_received">Partially Received</option>
          <option value="fully_received">Fully Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPOs.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{po.poNumber}</div>
                        <div className="text-xs text-gray-500">By {po.createdBy}</div>
                        {po.approvedBy && (
                          <div className="text-xs text-green-600 mt-0.5">Approved by {po.approvedBy}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{po.vendorName}</div>
                    <div className="text-sm text-gray-500">{po.vendorCode}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{po.paymentTerms}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>PO: {po.poDate}</span>
                      </div>
                      <div className="flex items-center text-xs text-blue-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due: {po.expectedDelivery}</span>
                      </div>
                      {po.actualDelivery && (
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span>Rcvd: {po.actualDelivery}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {po.receivedItems}/{po.itemsCount}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {po.itemsCount === po.receivedItems
                        ? 'Complete'
                        : po.receivedItems > 0
                        ? 'Partial'
                        : 'Pending'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-700">${po.grandTotal.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Base: ${po.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Tax: ${po.taxAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${priorityColors[po.priority]}`}>
                      {priorityLabels[po.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[po.status]}`}>
                      {statusLabels[po.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/procurement/po/view/${po.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => router.push(`/procurement/po/edit/${po.id}`)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(po.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                       
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPOs.length)} of{' '}
            {filteredPOs.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
