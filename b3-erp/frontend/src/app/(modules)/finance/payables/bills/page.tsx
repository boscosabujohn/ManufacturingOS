'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  DollarSign,
  Tag,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface VendorBill {
  billId: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  poNumber?: string;
  grnNumber?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  currency: string;
  description: string;
  category: string;
  attachments: number;
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  lastPaymentDate?: string;
  notes?: string;
}

export default function VendorBillsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Mock data
  const billStats = {
    totalBills: 142,
    pendingApproval: 12,
    approved: 48,
    overdue: 8,
    totalAmount: 8750000,
    paidAmount: 5280000,
    pendingAmount: 3470000
  };

  const vendorBills: VendorBill[] = [
    {
      billId: 'B-001',
      billNumber: 'VB-2024-001',
      vendorId: 'V-001',
      vendorName: 'Tata Steel Ltd',
      billDate: '2024-03-01',
      dueDate: '2024-04-15',
      poNumber: 'PO-2024-045',
      grnNumber: 'GRN-2024-089',
      subtotal: 850000,
      taxAmount: 153000,
      totalAmount: 1003000,
      paidAmount: 503000,
      balanceAmount: 500000,
      status: 'partially_paid',
      paymentTerms: 'Net 45',
      currency: '₹',
      description: 'Steel plates and structural materials',
      category: 'Raw Materials',
      attachments: 3,
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-03-01',
      approvedBy: 'Priya Sharma',
      approvedDate: '2024-03-02',
      lastPaymentDate: '2024-03-15',
      notes: 'First installment paid'
    },
    {
      billId: 'B-002',
      billNumber: 'VB-2024-002',
      vendorId: 'V-002',
      vendorName: 'JSW Steel',
      billDate: '2024-03-05',
      dueDate: '2024-04-05',
      poNumber: 'PO-2024-052',
      grnNumber: 'GRN-2024-095',
      subtotal: 620000,
      taxAmount: 111600,
      totalAmount: 731600,
      paidAmount: 731600,
      balanceAmount: 0,
      status: 'paid',
      paymentTerms: 'Net 30',
      currency: '₹',
      description: 'High-grade steel rods',
      category: 'Raw Materials',
      attachments: 2,
      createdBy: 'Amit Sharma',
      createdDate: '2024-03-05',
      approvedBy: 'Suresh Reddy',
      approvedDate: '2024-03-06',
      lastPaymentDate: '2024-03-28'
    },
    {
      billId: 'B-003',
      billNumber: 'VB-2024-003',
      vendorId: 'V-003',
      vendorName: 'Hindalco Industries',
      billDate: '2024-02-15',
      dueDate: '2024-03-20',
      poNumber: 'PO-2024-038',
      grnNumber: 'GRN-2024-078',
      subtotal: 950000,
      taxAmount: 171000,
      totalAmount: 1121000,
      paidAmount: 0,
      balanceAmount: 1121000,
      status: 'overdue',
      paymentTerms: 'Net 60',
      currency: '₹',
      description: 'Aluminum sheets and extrusions',
      category: 'Raw Materials',
      attachments: 4,
      createdBy: 'Priya Patel',
      createdDate: '2024-02-15',
      approvedBy: 'Rajesh Kumar',
      approvedDate: '2024-02-16',
      notes: 'Payment delayed due to quality issues'
    },
    {
      billId: 'B-004',
      billNumber: 'VB-2024-004',
      vendorId: 'V-004',
      vendorName: 'L&T Construction',
      billDate: '2024-03-10',
      dueDate: '2024-04-25',
      poNumber: 'PO-2024-058',
      subtotal: 1800000,
      taxAmount: 324000,
      totalAmount: 2124000,
      paidAmount: 0,
      balanceAmount: 2124000,
      status: 'approved',
      paymentTerms: 'Net 45',
      currency: '₹',
      description: 'Construction services - Phase 2',
      category: 'Services',
      attachments: 5,
      createdBy: 'Suresh Reddy',
      createdDate: '2024-03-10',
      approvedBy: 'Amit Patel',
      approvedDate: '2024-03-11'
    },
    {
      billId: 'B-005',
      billNumber: 'VB-2024-005',
      vendorId: 'V-005',
      vendorName: 'Siemens India',
      billDate: '2024-03-12',
      dueDate: '2024-04-12',
      poNumber: 'PO-2024-061',
      grnNumber: 'GRN-2024-102',
      subtotal: 540000,
      taxAmount: 97200,
      totalAmount: 637200,
      paidAmount: 0,
      balanceAmount: 637200,
      status: 'approved',
      paymentTerms: 'Net 30',
      currency: '₹',
      description: 'Industrial automation equipment',
      category: 'Equipment',
      attachments: 3,
      createdBy: 'Michael Schmidt',
      createdDate: '2024-03-12',
      approvedBy: 'Kavita Desai',
      approvedDate: '2024-03-13'
    },
    {
      billId: 'B-006',
      billNumber: 'VB-2024-006',
      vendorId: 'V-006',
      vendorName: 'ABB India Ltd',
      billDate: '2024-03-14',
      dueDate: '2024-03-16',
      poNumber: 'PO-2024-064',
      subtotal: 420000,
      taxAmount: 75600,
      totalAmount: 495600,
      paidAmount: 0,
      balanceAmount: 495600,
      status: 'pending_approval',
      paymentTerms: 'Net 45',
      currency: '₹',
      description: 'Electrical components and spares',
      category: 'Equipment',
      attachments: 2,
      createdBy: 'Lars Andersson',
      createdDate: '2024-03-14'
    },
    {
      billId: 'B-007',
      billNumber: 'VB-2024-007',
      vendorId: 'V-001',
      vendorName: 'Tata Steel Ltd',
      billDate: '2024-03-15',
      dueDate: '2024-03-17',
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      status: 'draft',
      paymentTerms: 'Net 45',
      currency: '₹',
      description: 'Monthly steel supply - March 2024',
      category: 'Raw Materials',
      attachments: 0,
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-03-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'partially_paid': return 'text-purple-600 bg-purple-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredBills = vendorBills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (bill.poNumber && bill.poNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || bill.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectBill = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBills.length === filteredBills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(filteredBills.map(bill => bill.billId));
    }
  };

  const handleExportBills = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Bill Number', 'Vendor Name', 'Bill Date', 'Due Date', 'PO Number', 'GRN Number', 'Subtotal', 'Tax', 'Total', 'Paid', 'Balance', 'Status', 'Category', 'Payment Terms', 'Created By', 'Created Date'];
      const rows = filteredBills.map(b => [
        b.billNumber,
        b.vendorName,
        b.billDate,
        b.dueDate,
        b.poNumber || '',
        b.grnNumber || '',
        b.subtotal,
        b.taxAmount,
        b.totalAmount,
        b.paidAmount,
        b.balanceAmount,
        b.status,
        b.category,
        b.paymentTerms,
        b.createdBy,
        b.createdDate
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vendor_Bills_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 500);
  };

  const handleDeleteBill = (billId: string, billNumber: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete bill ${billNumber}?\n\nThis action cannot be undone. The bill will be permanently removed from the system.`);
    if (confirmDelete) {
      alert(`Bill ${billNumber} would be deleted.\n\nNote: This is a demo. In production, this would:\n- Mark the bill as deleted in the database\n- Update related transactions\n- Log the deletion in audit trail\n- Send notifications if configured`);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Vendor Bills</h1>
              </div>
              <p className="text-sm text-gray-600">Manage vendor invoices and bills</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleExportBills}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
              <button 
                onClick={() => router.push('/finance/payables/add')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Bill</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{billStats.totalBills}</p>
              <p className="text-xs text-gray-500 mt-1">All vendor bills</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-yellow-700">Pending Approval</p>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900">{billStats.pendingApproval}</p>
              <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700">Approved</p>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{billStats.approved}</p>
              <p className="text-xs text-blue-600 mt-1">Ready for payment</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-red-700">Overdue</p>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">{billStats.overdue}</p>
              <p className="text-xs text-red-600 mt-1">Past due date</p>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bill Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{(billStats.totalAmount / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{(billStats.paidAmount / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
                <p className="text-2xl font-bold text-orange-600">₹{(billStats.pendingAmount / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Services">Services</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Bills Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedBills.length === filteredBills.length && filteredBills.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <React.Fragment key={bill.billId}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBills.includes(bill.billId)}
                            onChange={() => handleSelectBill(bill.billId)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedBill(expandedBill === bill.billId ? null : bill.billId)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedBill === bill.billId ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{bill.billNumber}</div>
                              {bill.poNumber && <div className="text-xs text-gray-500">PO: {bill.poNumber}</div>}
                              <div className="text-xs text-gray-500">{bill.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{bill.vendorName}</div>
                          <div className="text-xs text-gray-500">{bill.vendorId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Bill: {bill.billDate}</div>
                          <div className="text-xs text-gray-500">Due: {bill.dueDate}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {bill.currency}{(bill.totalAmount / 1000).toFixed(0)}K
                          </div>
                          {bill.paidAmount > 0 && (
                            <div className="text-xs text-green-600">
                              Paid: {bill.currency}{(bill.paidAmount / 1000).toFixed(0)}K
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {getStatusLabel(bill.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => router.push(`/finance/payables/view/${bill.billId}`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => router.push(`/finance/payables/edit/${bill.billId}`)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBill(bill.billId, bill.billNumber)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete bill"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedBill === bill.billId && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Description</p>
                                <p className="font-medium text-gray-900">{bill.description}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Payment Terms</p>
                                <p className="font-medium text-gray-900">{bill.paymentTerms}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Subtotal / Tax</p>
                                <p className="font-medium text-gray-900">
                                  {bill.currency}{(bill.subtotal / 1000).toFixed(0)}K / {bill.currency}{(bill.taxAmount / 1000).toFixed(0)}K
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Created By</p>
                                <p className="font-medium text-gray-900">{bill.createdBy}</p>
                                <p className="text-xs text-gray-500">{bill.createdDate}</p>
                              </div>
                              {bill.grnNumber && (
                                <div>
                                  <p className="text-gray-500 mb-1">GRN Number</p>
                                  <p className="font-medium text-gray-900">{bill.grnNumber}</p>
                                </div>
                              )}
                              {bill.approvedBy && (
                                <div>
                                  <p className="text-gray-500 mb-1">Approved By</p>
                                  <p className="font-medium text-gray-900">{bill.approvedBy}</p>
                                  <p className="text-xs text-gray-500">{bill.approvedDate}</p>
                                </div>
                              )}
                              {bill.lastPaymentDate && (
                                <div>
                                  <p className="text-gray-500 mb-1">Last Payment</p>
                                  <p className="font-medium text-gray-900">{bill.lastPaymentDate}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-gray-500 mb-1">Attachments</p>
                                <p className="font-medium text-gray-900">{bill.attachments} files</p>
                              </div>
                            </div>
                            {bill.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Notes</p>
                                <p className="text-sm text-gray-900">{bill.notes}</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
